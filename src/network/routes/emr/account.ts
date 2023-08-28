/* eslint-disable no-tabs */
import { Router, Request, Response, NextFunction } from "express";
import RBAC from "../../../services/rbac";
import { IVerifyPin, UpdatePDFHeaderRequest } from "./interfaces/account.model";
const crypto = require("crypto");
import moment from "moment";
import { isValidFile } from "./helpers/app.helper";
import { ElasticLoggerService } from "./services";
const Account = Router();

Account.route("/account/pin-verify").post(RBAC.getInstance().isUserAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const employeeId = req.body["employee-id"];
  const pin = req.body.pin;
  try {
    const employee: IVerifyPin = await global.medicalRecord.get(`{Employee}:${employeeId}`);
    if (employee && employee !== null) {
      const pinHash = crypto.createHash("md5").update(pin).digest("hex");
      if (employee.PIN === pinHash) {
        const signUrl = (employee.Signature && employee.Signature !== '' && isValidFile(employee.Signature)) ? await global.storage.signUrl(employee.Signature, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';
        const logData = {
          Logged_User: req.userId ?? '',
          Signed_User: employeeId,
          Timestamp: signUrl,
        }
        if (!res.writableEnded) {
          res.status(200).json({
            message: "OK",
            data: {
              Last_Updated: employee.Last_Updated,
              ID_Karyawan: employeeId,
              Signature: signUrl,
              Tanda_Tangan: signUrl,
            },
          });
        }
      } else {
        if (!res.writableEnded) {
          res.status(400).json({
            message: "Salah Password PIN",
          });
        }
      }
    }
    if (!employee || employee === null) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: "Employee not found",
        });
      }
    }
  } catch (err) {
    if (!res.writableEnded) {
      res.status(500).json({
        message: "Employee not found",
        error: err,
      });
    }
  }
});

Account.route('/account/tanpa-pin-verify')
  .post(RBAC.getInstance().isUserAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const employeeId = req.body['employee-id'];
    const employee: IVerifyPin = await global.medicalRecord.get(`{Employee}:${employeeId}`);
    try {
      if (employee && employee !== null) {
        const signUrl = (employee.Signature && employee.Signature !== '' && isValidFile(employee.Signature)) ? await global.storage.signUrl(employee.Signature, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';
        if (!res.writableEnded) {
          res.status(200).json({
            message: 'OK',
            data: {
              Last_Updated: employee.Last_Updated,
              ID_Karyawan: employeeId,
              Signature: signUrl,
              Tanda_Tangan: signUrl,
            },
          })
        }
      } else {
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'Data karyawan tidak ada',
          });
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: 'Internal Server Error',
        });
      }
    }
  })

Account.route("/account/pin-form").post(RBAC.getInstance().isUserAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const employee = await global.medicalRecord.get(`{Employee}:${req.userId}`, ".");
    if (employee && employee !== null) {
      const signUrl = (employee.Signature && employee.Signature !== '' && isValidFile(employee.Signature)) ? await global.storage.signUrl(employee.Signature, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : '';
      res.status(200).json({
        message: "OK",
        data: {
          ID_Karyawan: req.userId ? req.userId : '',
          Last_Updated: employee.Last_Updated ? employee.Last_Updated : '',
          Tanda_Tangan: signUrl ? signUrl : '',
        },
      });
    } else if (!employee && employee === null) {
      if (!res.writableEnded) {
        res.status(200).json({
          message: "OK",
          data: {},
        });
      }
    }
  } catch (err) {
    if (!res.writableEnded) {
      res.status(500).json({
        message: `${err}`,
      })
    }
  }
});

Account.route("/account/pin-process").post(RBAC.getInstance().isUserAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const employee = await global.medicalRecord.get(`{Employee}:${req.userId}`, ".");
  const oldPIN = req.body["pin-lama"] || "";
  const newPIN = req.body["pin-baru"] || "";
  const verificationPIN = req.body["pin-verifikasi"] || "";
  const signatureUrl = req.body["tanda-tangan"] || "";

  const oldPINHash = crypto.createHash("md5").update(oldPIN).digest("hex");
  const newPINHash = crypto.createHash("md5").update(newPIN).digest("hex");
  try {
    if (employee && employee !== null) {
      if (oldPIN === "" || oldPINHash !== employee.PIN) {
        if (!res.writableEnded) {
          res.status(501).json({
            message: "PIN Lama Error",
          });
        }
      } else if (newPIN !== verificationPIN) {
        if (!res.writableEnded) {
          res.status(501).json({
            message: "PIN Baru dan Verifikasi tidak sama",
          });
        }
      } else {
        await global.medicalRecord.update(`{Employee}:${req.userId}`, "$", {
          PIN: newPINHash,
          Last_Updated: moment().utcOffset(await global.medicalRecord.getConfigValue(req.body.kode_cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
          Signature: (signatureUrl && signatureUrl !== '' && isValidFile(signatureUrl)) ? global.storage.cleanUrl(signatureUrl) : '',
        });
        if (!res.writableEnded) {
          res.status(200).json({
            message: "OK",
          });
        }
      }
    } else {
      await global.medicalRecord.update(`{Employee}:${req.userId}`, "$", {
        PIN: newPINHash,
        Last_Updated: moment().utcOffset(await global.medicalRecord.getConfigValue(req.body.kode_cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
        Signature: (signatureUrl && signatureUrl !== '' && isValidFile(signatureUrl)) ? global.storage.cleanUrl(signatureUrl) : '',
      });
      if (!res.writableEnded) {
        res.status(200).json({
          message: "OK",
        });
      }
    }
  } catch (err) {
    if (!res.writableEnded) {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
});

Account.route("/account/pin-process-reset").post(RBAC.getInstance().isUserAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const employee = await global.medicalRecord.get(`{Employee}:${req.userId}`, ".");
  const defaultPin: string = "1234";
  const defaultPinHash = crypto.createHash("md5").update(defaultPin).digest("hex");
  try {
    if (employee) {
      await global.medicalRecord.update(`{Employee}:${req.userId}`, "$", {
        PIN: defaultPinHash,
        Last_Updated: moment().format("YYYY-MM-DD HH:mm:ss"),
        Signature: employee.Signature ? employee.Signature : "",
      });
      if (!res.writableEnded) {
        res.status(200).json({
          message: "OK",
        });
      }
    }
    if (!employee) {
      if (!res.writableEnded) {
        res.status(501).json({
          message: "Karyawan Tidak Terdaftar",
        });
      }
    }
  } catch (error) {
    if (!res.writableEnded) {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
});

Account.route("/account/karyawan-list").post(RBAC.getInstance().isUserAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const branchCode = req.body.kode_cabang;
  const patientType = req.body.tipe_pasien;
  const employees = await global.medicalRecord.get(`Employee:{${branchCode}}:${patientType}`, "$[?(@.Status_Aktif==1)]");
  if (employees === null) {
    if (!res.writableEnded) {
      res.status(404).json({
        message: "Data Not Found",
      });
    }
  } else {
    if (!res.writableEnded) {
      res.status(200).json({
        message: "OK",
        data: {
          karyawan: employees,
        },
      });
    }
  }
});

Account.route("/account/petugas-list").post(RBAC.getInstance().isUserAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const branchCode = req.body.kode_cabang;
  const patientType = req.body.tipe_pasien;
  const employees = await global.medicalRecord.get(`Employee:{${branchCode}}:${patientType}`, "$[?(@.Status_Dokter==0 && @.Status_Perawat==0 && @.Status_Aktif==1)]");

  if (employees === null) {
    if (!res.writableEnded) {
      res.status(404).json({
        message: "Data Not Found",
      });
    }
  } else {
    if (!res.writableEnded) {
      res.status(200).json({
        message: "OK",
        data: {
          karyawan: employees,
        },
      });
    }
  }
});

Account.route('/account/all-petugas')
  .post(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const branchCode = req.body.kode_cabang;
      const employees1 = await global.medicalRecord.get(`Employee:{${branchCode}}:UMUM`, "$[?(@.Status_Aktif==1)]");
      const employees2 = await global.medicalRecord.get(`Employee:{${branchCode}}:BPJS`, "$[?(@.Status_Aktif==1)]");
      const ids = new Set(employees1.map((d: any) => d.ID_Karyawan));
      const newData = [...employees1, ...employees2.filter((d: any) => !ids.has(d.ID_Karyawan))];
      const compare = (a: any, b: any) => {
        if (a.Nama < b.Nama) {
          return -1;
        }
        if (a.Nama > b.Nama) {
          return 1;
        }
        return 0;
      }
      newData.sort(compare);
      if (!res.writableEnded) {
        res.status(200).json({
          message: "OK",
          data: {
            karyawan: newData,
          },
        });
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        });
      }
    }
  });

Account.route('/account/medical-record-users-index')
  .get(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const companyCode = req.query.branch_code;
      const result = await global.medicalRecord.get(`MedicalRecordUsers:{${companyCode}}`, '$');
      if (result === null) {
        if (!res.writableEnded) {
          res.status(200).json({
            message: "OK",
            data: {
              users: [],
            },
          });
        }
      } else {
        if (!res.writableEnded) {
          console.log('result', result[0]);
          res.status(200).json({
            message: "OK",
            data: {
              users: result[0] ?? '',
            },
          });
        }
      }

    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        });
      }
    }
  });

Account.route('/account/medical-record-users-process')
  .post(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const dataToPost = req.body;
    try {
      if (dataToPost && dataToPost.branch_code) {
        const result = await global.medicalRecord.get(`MedicalRecordUsers:{${dataToPost.branch_code}}`);
        if (result && result !== null) {
          await global.medicalRecord.update(`MedicalRecordUsers:{${dataToPost.branch_code}}`, "$", dataToPost.data);
          if (!res.writableEnded) {
            res.status(200).json({
              message: `Berhasil update data master ${dataToPost.branch_code}`,
              id: `MedicalRecordUsers:{${dataToPost.branch_code}}`,
            });
          }
        }
        if (!result || (result && result === null)) {
          const id = await global.medicalRecord.newMedicalRecordUsers(dataToPost.branch_code, dataToPost.data);
          if (!res.writableEnded) {
            res.status(200).json({
              message: `Berhasil tambah data master ${dataToPost.branch_code}`,
              id,
            });
          }
        }
      }
      if (!dataToPost || (dataToPost && dataToPost.branch_code === null)) {
        if (!res.writableEnded) {
          res.status(500).json({
            message: "Request branch_code tidak ada",
          });
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        });
      }
    }
  });

Account.route("/account/perawat-list").post(RBAC.getInstance().isUserAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const branchCode = req.body.kode_cabang;
  const patientType = req.body.tipe_pasien;
  const employees = await global.medicalRecord.get(`Employee:{${branchCode}}:${patientType}`, "$[?(@.Status_Dokter==0 && @.Status_Perawat==1 && @.Status_Aktif==1)]");
  if (employees === null) {
    if (!res.writableEnded) {
      res.status(404).json({
        message: "Data Not Found",
      });
    }
  } else {
    if (!res.writableEnded) {
      res.status(200).json({
        message: "OK",
        data: {
          karyawan: employees,
        },
      });
    }
  }
});

Account.route("/account/dokter-list").post(RBAC.getInstance().isUserAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const branchCode = req.body.kode_cabang;
  const patientType = req.body.tipe_pasien;
  const employees = await global.medicalRecord.get(`Employee:{${branchCode}}:${patientType}`, "$[?(@.Status_Dokter==1 && @.Status_Perawat==0 && @.Status_Aktif==1)]");
  if (employees === null) {
    if (!res.writableEnded) {
      res.status(404).json({
        message: "Data Not Found",
      });
    }
  } else {
    if (!res.writableEnded) {
      res.status(200).json({
        message: "OK",
        data: {
          karyawan: employees,
        },
      });
    }
  }
});

Account.route('/account/companies')
  .get(RBAC.getInstance().isUserAuthenticated,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const companies = await global.medicalRecord.get('all_companies');
        if (companies && companies !== null) {
          if (!res.writableEnded) {
            res.status(200).json({
              message: 'OK',
              data: companies,
            })
          }
        } else {
          if (!res.writableEnded) {
            res.status(500).json({
              message: 'Data Tidak Ada',
            })
          }
        }
      } catch (err) {
        if (!res.writableEnded) {
          res.status(500).json({
            message: `${err}`,
          })
        }
      }
    })

Account.route('/account/config-form')
  .post(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const dataToPost = req.body;
      const config = await global.medicalRecord.get(`Config:{${dataToPost.company_code}}`);
      if (config && config !== null) {
        if (!res.writableEnded) {
          res.status(200).json({
            message: 'OK',
            data: config,
          });
        }
      } else {
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'Data Tidak Ada',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });

Account.route('/account/config-process')
  .post(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const dataToPost = req.body;
      const config = await global.medicalRecord.get(`Config:{${dataToPost.company_code}}`, ".");
      if (config && config !== null) {
        const redisJsonData: IConfig = {
          timezone: dataToPost.timezone ?? '',
          institution_name: dataToPost.institution_name ?? '',
          ip: dataToPost.ip ?? '',
          simrs_port: dataToPost.simrs_port ?? ':3030/v9',
          dpad: !!(dataToPost.dpad && dataToPost.dpad === '1'),
          word_templates: dataToPost.word_templates ?? '',
          folder_templates: dataToPost.folder_templates ?? '1S4SKw6tOyDaoTZriGYU8bc__afb0w7wQ',
        };
        await global.medicalRecord.update(`Config:{${dataToPost.company_code}}`, "$", redisJsonData);
        if (!res.writableEnded) {
          ElasticLoggerService().createLog(req, '/account/config-process', 'OK');
          res.status(200).json({
            message: 'OK',
          });
        }
      } else {
        if (!res.writableEnded) {
          ElasticLoggerService().createErrorLog(req, '/account/config-process', 'No Data');
          res.status(500).json({
            message: 'No Data',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        ElasticLoggerService().createErrorLog(req, '/account/config-process', err);
        res.status(500).json({
          message: err,
        });
      }
    }
  });

Account.route('/account/pdf-header')
  .get(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const companyCode = req.query.company_code;
      const headerConfig = await global.medicalRecord.get(`HeaderPDF:{${companyCode}}`);
      if (headerConfig && headerConfig !== null) {
        if (headerConfig.logo_url && headerConfig.logo_url !== '' && isValidFile(headerConfig.logo_url)) {
          headerConfig.logo_url = await global.storage.signUrl(headerConfig.logo_url, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (!res.writableEnded) {
          res.status(200)
            .json({
              message: 'OK',
              data: headerConfig,
            })
        }
      } else {
        if (!res.writableEnded) {
          res.status(200)
            .json({
              message: 'OK',
              data: {},
            })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500)
          .json({
            message: err,
          })
      }
    }
  });

Account.route('/account/pdf-header')
  .post(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const dataToPost = UpdatePDFHeaderRequest.createFromJson(req.body);
      if (dataToPost.logo_url && dataToPost.logo_url !== '' && isValidFile(dataToPost.logo_url)) {
        dataToPost.logo_url = global.storage.cleanUrl(dataToPost.logo_url)
      }
      if (dataToPost.company_code) {
        const result = await global.medicalRecord.get(`HeaderPDF:{${dataToPost.company_code}}`);
        if (result && result !== null) {
          await global.medicalRecord.update(`HeaderPDF:{${dataToPost.company_code}}`, "$", dataToPost);
          if (!res.writableEnded) res.status(200).json({
            message: `Berhasil update data master ${dataToPost.company_code}`,
            id: `HeaderPDF:{${dataToPost.company_code}}`,
          });
        } else {
          const id = await global.medicalRecord.newHeaderPDF(dataToPost.company_code, dataToPost);
          if (!res.writableEnded) res.status(200).json({
            message: `Berhasil tambah data master ${dataToPost.company_code}`,
            id,
          });
        }
      } else {
        if (!res.writableEnded) res.status(500).json({
          message: "Request company_code tidak ada",
        });
      }
    } catch (err) {
      if (!res.writableEnded) res.status(500).json({
        message: err,
      });
    }
  });

Account.route('/account/medicine')
  .get(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const companyCode = req.query.company_code;
      const patientType = req.query.patient_type;
      const meds = await global.medicalRecord.get(`Obat:{${companyCode}}:${patientType}`);
      if (meds && meds !== null) {
        const restructureds = meds.map((item: any) => item.Nama_Inventory);
        if (!res.writableEnded) {
          res.status(200).json({
            message: 'OK',
            data: restructureds,
          })
        }
      } else {
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'Data Tidak Ada',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  });

export { Account };
