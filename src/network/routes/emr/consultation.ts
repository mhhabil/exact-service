import { Router, Request, Response } from 'express'
import RBAC from '../../../services/rbac'
import moment from 'moment'
import { ElasticLoggerService } from './services';
import { v4 as uuid } from "uuid";
import * as jsonpatch from 'fast-json-patch';
import { isValidFile } from './helpers/app.helper';
import { IHowToUse, IMedicine, Konsultasi } from './interfaces/outpatient/outpatient.model';
import { IUpdateKonsultasi } from './interfaces/outpatient/outpatient.request';
const Consultation = Router();
const redisVersion = process.env.REDIS_VERSION ?? '';

Consultation.route('/konsultasi/lembar-konsultasi-item')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const limit: number = req.body.limit ?? 100;
    const offset: number = req.body.offset ?? 0;
    const sortDir = req.body.sort ?? "DESC";
    const emrKeys = ["Kode_Cabang", "No_MR", "Pasien"];
    const emrData = await global.medicalRecord.get(req.emrID, emrKeys);
    if (!emrData || (emrData && emrData === null)) {
      ElasticLoggerService().createHTTPResponse(req, res, 404, {
        message: "EMR Data Not Found",
      });
    } else {
      const searchQuery = `\'@Kode_Cabang:${emrData.Kode_Cabang} @No_MR:${emrData.No_MR}\'`;
      const result = await global.medicalRecord.find(searchQuery, {
        LIMIT: { from: 0, size: 10000 },
        RETURN: ["$.Kode_Cabang", "$.No_MR", "$.Konsultasi.Lembar_Konsultasi"],
      });
      let records: any = [];
      // Merge CPPT from multiple visits
      for (let i = 0; i < result.documents.length; i++) {
        if (result.documents[i].value["$.Konsultasi.Lembar_Konsultasi"] !== undefined) {
          const objConsult = JSON.parse(result.documents[i].value["$.Konsultasi.Lembar_Konsultasi"]);
          for (let j = 0; j < objConsult.length; j++) {
            objConsult[j]["EMR_ID"] = result.documents[i].id;
          }
          records = records.concat(objConsult);
        }
      }

      const total = records.length;
      records.sort((a: any, b: any) => {
        if (sortDir === 'ASC') {
          return a.Tanggal_Konsul - b.Tanggal_Konsul;
        } else {
          return b.Tanggal_Konsul - a.Tanggal_Konsul;
        }
      })
      records = records.slice(offset, offset + limit > records.length ? records.length : offset + limit);
      records = records.filter((val: any) => !val.Deleted || (val.Deleted && val.Deleted !== 1))
      for (let i = 0; i < records.length; i += 1) {
        if (records[i].TTD_Dokter_Konsultasi && records[i].TTD_Dokter_Konsultasi !== '' && isValidFile(records[i].TTD_Dokter_Konsultasi)) {
          records[i].TTD_Dokter_Konsultasi = await global.storage.signUrl(records[i].TTD_Dokter_Konsultasi, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (records[i].TTD_Dokter_Balas_Konsultasi && records[i].TTD_Dokter_Balas_Konsultasi !== '' && isValidFile(records[i].TTD_Dokter_Balas_Konsultasi)) {
          records[i].TTD_Dokter_Balas_Konsultasi = await global.storage.signUrl(records[i].TTD_Dokter_Balas_Konsultasi, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (records[i].PDF && records[i].PDF !== '' && isValidFile(records[i].PDF)) {
          records[i].PDF = await global.storage.signUrl(records[i].PDF, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
        }
        if (records[i].Tanggal_Konsul && records[i].Tanggal_Konsul !== '') {
          records[i].Tanggal_Konsul = moment.unix(records[i].Tanggal_Konsul).format("YYYY-MM-DD HH:mm:ss");
        }
        if (records[i].Tanggal_Balas && records[i].Tanggal_Balas !== '') {
          records[i].Tanggal_Balas = moment.unix(records[i].Tanggal_Balas).format("YYYY-MM-DD HH:mm:ss");
        }
        if (records[i].Yth_Dokter_Konsul_Id && records[i].Yth_Dokter_Konsul_Id !== '') {
          records[i].Yth_Dokter_Konsul_Id = records[i].Yth_Dokter_Konsul_Id.split('_').join('-');
        }
        if (records[i].Yth_Dokter_Balas_Id && records[i].Yth_Dokter_Balas_Id !== '') {
          records[i].Yth_Dokter_Balas_Id = records[i].Yth_Dokter_Balas_Id.split('_').join('-');
        }
        if (records[i].ID_Dokter_Konsultasi && records[i].ID_Dokter_Konsultasi !== '') {
          records[i].ID_Dokter_Konsultasi = records[i].ID_Dokter_Konsultasi.split('_').join('-');
        }
        if (records[i].ID_Dokter_Balas_Konsultasi && records[i].ID_Dokter_Balas_Konsultasi !== '') {
          records[i].ID_Dokter_Balas_Konsultasi = records[i].ID_Dokter_Balas_Konsultasi.split('_').join('-');
        }
      }
      res.status(200).json({
        message: "OK",
        data: {
          total,
          totalFiltered: records.length,
          EMR_ID: req.emrID,
          pasien: emrData.Pasien,
          records,
        },
      });
    }
  });

Consultation.route('/konsultasi/lembar-konsultasi-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const dataToPost: IUpdateKonsultasi = req.body;
      const emrKeys = ["Kode_Cabang", "No_MR", "Pasien", "Tipe_Pasien"];
      const id = dataToPost.id;
      const emrData = await global.medicalRecord.get(req.emrID, emrKeys);
      if (emrData && emrData !== null) {
        const doctor1 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${dataToPost.id_dokter_konsultasi}')]`)
        const doctor2 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${dataToPost.id_dokter_balas_konsultasi}')]`)
        const doctor3 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${dataToPost.yth_dokter_konsul_id}')]`)
        const doctor4 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.ID_Karyawan=='${dataToPost.yth_dokter_balas_id}')]`)

        const meds = await global.medicalRecord.get(`Obat:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`);
        const htu = await global.medicalRecord.get(`AturanPakai:{${emrData.Kode_Cabang}}`);

        const prescriptions: Array<IPrescription> | Array<any> = [];

        for (let i = 0; i < (req.body['nama-obat'] ? req.body['nama-obat'] : []).length; i += 1) {
          const medsCode = req.body['nama-obat'][i] ? req.body['nama-obat'][i] : ''
          const total = req.body['jumlah'][i] ? req.body['jumlah'][i] : '';
          const note = req.body['catatan'][i] ? req.body['catatan'][i] : '';
          const howToUse = req.body['aturan-pakai'][i] ? req.body['aturan-pakai'][i] : '';

          const selectedMeds = meds && Array.isArray(meds) && meds.find((med: IMedicine) => med.Kode_Inventory.toString() === medsCode.toString());

          const selectedHtu = htu && Array.isArray(htu) && htu.find((howTo: IHowToUse) => howTo.ID_AturanPakai === parseInt(howToUse));

          if (selectedMeds && selectedHtu) {
            prescriptions.push({
              ID_Obat: selectedMeds.Kode_Inventory,
              Nama_Obat: selectedMeds.Nama_Inventory,
              ID_Satuan: selectedMeds.ID_Satuan,
              Nama_Satuan: selectedMeds.Nama_Satuan,
              ID_AturanPakai: selectedHtu.ID_AturanPakai,
              Nama_AturanPakai: selectedHtu.Nama,
              Kode_AturanPakai: selectedHtu.Kode,
              Jumlah: total,
              Catatan: note,
            })
          }
        }
        const fixedData = Konsultasi.createFromJson(dataToPost);
        const datas = {
          ...fixedData,
          Balas_Resep: prescriptions ?? [],
          Yth_Dokter_Konsul_Nama: doctor3 && Array.isArray(doctor3) && doctor3.length > 0 && doctor3[0] ? doctor3[0].Nama : '',
          Yth_Dokter_Balas_Nama: doctor4 && Array.isArray(doctor4) && doctor4.length > 0 && doctor4[0] ? doctor4[0].Nama : '',
          Nama_TTD_Dokter_Konsultasi: doctor1 && Array.isArray(doctor1) && doctor1.length > 0 && doctor1[0] ? doctor1[0].Nama : '',
          Nama_TTD_Dokter_Balas_Konsultasi: doctor2 && Array.isArray(doctor2) && doctor2.length > 0 && doctor2[0] ? doctor2[0].Nama : '',
        }
        if (!id || id === '') {
          // Create
          const redisJsonData: IKonsultasi = {
            ...datas,
            ID: uuid().replace(/-/g, "").toUpperCase(),
            ID_Petugas: req.userId ?? '',
            CPPT_ID: dataToPost.cppt_id ?? '',
            Nama_Petugas: req.userProfile.nama ?? '',
            Deleted: 0,
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          await global.medicalRecord.addKonsultasi(req.emrID, redisJsonData);
          if (dataToPost.cppt_id && dataToPost.cppt_id !== '') {
            const cppts = await global.medicalRecord.get(req.emrID, ['Common.CPPT'])
            const index = cppts && Array.isArray(cppts) && cppts.findIndex((item) => item.ID === dataToPost.cppt_id);
            if (index !== -1) {
              await global.medicalRecord.update(req.emrID, `$.Common.CPPT[${index}].Konsultasi`, `Konsultasi ke ${redisJsonData.Yth_Dokter_Konsul_Nama}`);
            }
          }
          if (redisJsonData.Tanggal_Konsul) {
            redisJsonData.Tanggal_Konsul = moment.unix(redisJsonData.Tanggal_Konsul).format("YYYY-MM-DD HH:mm:ss");
          }
          if (redisJsonData.Tanggal_Balas && redisJsonData.Tanggal_Balas !== '') {
            redisJsonData.Tanggal_Balas = moment.unix(redisJsonData.Tanggal_Balas).format("YYYY-MM-DD HH:mm:ss");
          }
          ElasticLoggerService().createLog(req, '/rawat-jalan/lembar-konsultasi', 'OK');
          if (!res.writableEnded) {
            res.status(200).json({
              message: 'Data Berhasil Ditambah',
              data: {
                EMR_ID: req.emrID,
                ...redisJsonData,
              },
            })
          }
        } else {
          const searchQuery = `\'@Kode_Cabang:${emrData.Kode_Cabang} @No_MR:${emrData.No_MR} "${id}"\'`;
          const result = await global.medicalRecord.findKonsultasi(searchQuery, {
            RETURN: ["$.Kode_Cabang", "$.No_MR", `$.Konsultasi.Lembar_Konsultasi[?(@.ID=="${id}")]`],
          });
          let data: any;
          if (result.documents.length > 0) {
            data = JSON.parse(result.documents[0].value[`$.Konsultasi.Lembar_Konsultasi[?(@.ID=="${id}")]`]);
            if (data.Deleted && data.Deleted === 1) {
              data = {};
              ElasticLoggerService().createLog(req, '/rawat-jalan/lembar-konsultasi', 'OK');
              if (!res.writableEnded) {
                res.status(200).json({
                  message: 'Data Konsultasi Tidak Ada',
                })
              }
            } else {
              // Update CPPT
              const redisJsonData: IKonsultasi = {
                ...datas,
                ID: data.ID ?? '',
                ID_Petugas: req.userId ?? '',
                Nama_Petugas: req.userProfile.nama ?? '',
                Deleted: 0,
                Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
                Updated_By: (req.userId) ? req.userId : '',
              }
              const diff = jsonpatch.compare(data, redisJsonData);

              const updateDocument = jsonpatch.applyPatch(data, diff);
              await global.medicalRecord.update(req.emrID, `$.Konsultasi.Lembar_Konsultasi[?(@.ID=="${id}")]`, updateDocument.newDocument);

              if (updateDocument.newDocument.Tanggal_Konsul && updateDocument.newDocument.Tanggal_Konsul !== '') {
                updateDocument.newDocument.Tanggal_Konsul = moment.unix(updateDocument.newDocument.Tanggal_Konsul).format("YYYY-MM-DD HH:mm:ss");
              }
              if (updateDocument.newDocument.Tanggal_Balas && updateDocument.newDocument.Tanggal_Balas !== '') {
                updateDocument.newDocument.Tanggal_Balas = moment.unix(updateDocument.newDocument.Tanggal_Balas).format("YYYY-MM-DD HH:mm:ss");
              }
              ElasticLoggerService().createLog(req, '/rawat-jalan/lembar-konsultasi', 'OK');
              if (!res.writableEnded) {
                res.status(200).json({
                  message: 'Data Berhasil Diubah',
                  data: {
                    EMR_ID: req.emrID,
                    ...updateDocument.newDocument,
                  },
                })
              }
            }
          } else {
            throw new Error("No Data");
          }
        }
      }
      if (!emrData || (emrData && emrData === null)) {
        ElasticLoggerService().createHTTPResponse(req, res, 404, {
          message: "EMR Data Not Found",
        });
      }
    } catch (err) {
      ElasticLoggerService().createHTTPResponse(req, res, 500, {
        message: "Internal Server Error",
        error: err,
      });
    }
  });

Consultation.route('/konsultasi/lembar-konsultasi-delete')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const emrKeys: Array<string> = [];
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Konsultasi')
      if (checkObject && checkObject !== null && checkObject.includes('Lembar_Konsultasi')) {
        emrKeys.push('Konsultasi.Lembar_Konsultasi');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);

      if (result && Array.isArray(result) && result.length > 0) {
        const object = result.find((val: any) => val.ID === req.body.id);
        if (object && object !== null && object.CPPT_ID && object.CPPT_ID !== '') {
          await global.medicalRecord.delete(req.emrID, `$.Common.CPPT[?(@.ID=="${object.CPPT_ID}")].Konsultasi`);
        }
        const index = result.findIndex((val: any) => val.ID === req.body.id);
        await global.medicalRecord.deleteKonsultasi(req.emrID, index);
        if (!res.writableEnded) {
          res.status(200).json({
            message: 'OK',
          })
        }
      } else {
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'No Data',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        })
      }
    }
  });

Consultation.route('/konsultasi/lembar-konsultasi-pdf')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const id = req.body.id;
      const data = req.body.data;
      const preview = req.body.preview;
      const pdfx = await global.storage.convertDocToPdf2(
        req.emrParams.Kode_Cabang,
        req.body.form_name,
        req.body.emr_id,
        req.body.row_filter,
        data,
        req.body.converter || '',
      );

      if (pdfx && pdfx !== null) {
        if (preview) {
          res.status(200).set({
            "Cache-Control": "no-cache",
            "Content-Type": "application/pdf",
            "Content-Length": pdfx.length,
            "Content-Disposition": `attachment; filename=test.pdf`,
          }).send(pdfx);
        } else {
          const result = await global.medicalRecord.get(req.body.emr_id, ["Kode_Cabang", "Jenis_Pelayanan", "Tanggal_Masuk", "Tipe_Pasien", "No_MR", "ID_Pelayanan"]);
          const branchTimezone = await global.medicalRecord.getConfigValue(result.Kode_Cabang, "timezone");
          const resultPDF = await global.storage.uploadFromMemory(`pdfs/${result.Kode_Cabang}/${result.Jenis_Pelayanan}/${moment.unix(result.Tanggal_Masuk).format("YYYY")}/${moment.unix(result.Tanggal_Masuk).format("MM")}/${result.Tipe_Pasien}/${result.No_MR}/${result.ID_Pelayanan}/${req.body.form_name}_${moment().utcOffset(branchTimezone).format("YYYYMMDDHHmmss")}.pdf`, pdfx);

          // Save PDF URL
          const url = encodeURI(`https://${resultPDF.bucket}/${resultPDF.name}?generation=${resultPDF.generation}`);
          // await global.medicalRecord.setField(req.emrID, req.body.form_name, "", url);
          const pdf: IPDF = {
            Version: await global.medicalRecord.getPDFLastVersion(req.emrID, req.body.form_name),
            URL: url,
            Form_Name: req.body.form_name,
            Visit_Date: moment.unix(result.Tanggal_Masuk).format("YYYY-MM-DD"),
            Created_At: moment().utcOffset(branchTimezone).format("YYYY-MM-DD HH:mm:ss"),
            Created_By: req.userId,
            Created_By_Name: req.userProfile.nama,
          };
          await global.medicalRecord.addPDF(req.emrID, pdf);

          const consult = await global.medicalRecord.get(req.emrID, `$.Konsultasi.Lembar_Konsultasi.[?(@.ID=="${id}")]`)

          const oldData = consult[0]
          const data = {
            ...consult[0],
            PDF: url,
          };
          const diff = jsonpatch.compare(oldData, data);
          const updateDocument = jsonpatch.applyPatch(oldData, diff);
          await global.medicalRecord.update(req.emrID, `$.Konsultasi.Lembar_Konsultasi[?(@.ID=="${id}")]`, updateDocument.newDocument);

          // Signed URL
          const signUrl = url && url !== "" && isValidFile(url) ? await global.storage.signUrl(url, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : undefined;

          if (!res.writableEnded) {
            ElasticLoggerService().createHTTPResponse(req, res, 200, {
              message: "OK",
              data: {
                url,
                signUrl,
              },
            });
          }
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/rawat-jalan/lembar-konsultasi', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        });
      }
    }
  });

export { Consultation };
