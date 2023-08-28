import { Router, Request, Response, NextFunction } from "express";
import RBAC from "services/rbac";
import moment from "moment";
import * as jsonpatch from 'fast-json-patch';
import { v4 as uuid } from "uuid";
import { ElasticLoggerService } from "./services";
import { isValidFile } from "./helpers/app.helper";
import { IUpdateEfekSampingObat, IUpdateObatDiberikan, IUpdateRekonsiliasiObat, UpdateBeriObat, UpdateCPOTWPdf, UpdateObatDiberikan } from "./interfaces/pharmacy/pharmacy.request";
import { EfekSampingObat, PemberianObat, RekonsiliasiObat } from "./interfaces/pharmacy/pharmacy.model";
import { IHowToUse, IMedicine } from "./interfaces/outpatient/outpatient.model";
const debugEMR = require("debug")("emr");

const Pharmacy = Router();

Pharmacy.route('/farmasi/pemberian-obat-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Rawat_Inap'];
    try {
      const sortDir = req.body.sort ?? "ASC";
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Farmasi');
      const checkInformation = await global.medicalRecord.keys(req.emrID, '.Informasi');
      const checkInpatient = await global.medicalRecord.keys(req.emrID, '.Rawat_Inap');
      if (checkObject !== null && checkObject.includes('Pemberian_Obat')) {
        emrKeys.push('Farmasi.Pemberian_Obat');
      }
      if (checkObject !== null && checkObject.includes('Tebus_Obat')) {
        emrKeys.push('Farmasi.Tebus_Obat');
      }
      if (checkInpatient !== null && checkInpatient.includes('Daftar_Resep_Visit_Dokter')) {
        emrKeys.push('Rawat_Inap.Daftar_Resep_Visit_Dokter');
      }
      if (checkInformation !== null && checkInformation.includes("Informasi")) {
        emrKeys.push("Informasi.Informasi");
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form = result['Farmasi.Pemberian_Obat'] ? result['Farmasi.Pemberian_Obat'] : []
        const allergy = result['Informasi.Informasi'] ?? {};
        const tebusObat = result['Farmasi.Tebus_Obat'] ?? {};
        const rawat_inap = result['Rawat_Inap'] ? result['Rawat_Inap'] : {};
        const prescriptions = result['Rawat_Inap.Daftar_Resep_Visit_Dokter'] ?? [];

        const obatRanap = [];
        for (let i = 0; i < prescriptions.length; i += 1) {
          if (prescriptions[i].Daftar_Tebus && Array.isArray(prescriptions[i].Daftar_Tebus)) {
            obatRanap.push(...prescriptions[i].Daftar_Tebus);
          }
        }

        for (let i = 0; i < form.length; i += 1) {
          if (form[i].Tanda_Tangan_Perawat && form[i].Tanda_Tangan_Perawat !== '' && isValidFile(form[i].Tanda_Tangan_Perawat)) {
            form[i].Tanda_Tangan_Perawat = await global.storage.signUrl(form[i].Tanda_Tangan_Perawat, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
          }
          if (form[i].Tanda_Tangan_Pasien && form[i].Tanda_Tangan_Pasien !== '' && isValidFile(form[i].Tanda_Tangan_Pasien)) {
            form[i].Tanda_Tangan_Pasien = await global.storage.signUrl(form[i].Tanda_Tangan_Pasien, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
          }
        }

        const dates = form.map((item: any) => item.Tanggal);
        const finalDates = dates.filter((item: any, index: number) => dates.indexOf(item) === index);

        const groupedByDate = [];

        for (let i = 0; i < finalDates.length; i += 1) {
          const arrObj = form.filter((item: any) => item.Tanggal === finalDates[i]);
          arrObj.sort((a: any, b: any) => {
            return moment(a.Waktu_Pemberian).unix() - moment(b.Waktu_Pemberian).unix();
          });
          const isValidated = !!(arrObj.find((item: any) => item.Validated));
          groupedByDate.push({
            date: finalDates[i],
            objects: arrObj,
            isValidated,
            signature: isValidated && arrObj[0].TTD_Apoteker ? await global.storage.signUrl(arrObj[0].TTD_Apoteker, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : undefined,
            pharmacist: isValidated && arrObj[0].Nama_Apoteker ? arrObj[0].Nama_Apoteker : undefined,
          })
        }

        groupedByDate.sort((a: any, b: any) => {
          return moment(a.date).unix() - moment(b.date).unix();
        });

        form.sort((a: any, b: any) => {
          if (sortDir === "ASC") {
            return moment(a.Waktu_Pemberian).unix() - moment(b.Waktu_Pemberian).unix();
          } else if (sortDir === "DESC") {
            return moment(b.Waktu_Pemberian).unix() - moment(a.Waktu_Pemberian).unix();
          }
        });

        const data: any = {
          EMR_ID: req.emrID,
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          form,
          form_grouped: groupedByDate ?? [],
          rawat_inap,
          pengkajian_keperawatan: allergy ?? {},
          obat_tebus: (result.Jenis_Pelayanan !== 'RawatInap') ? tebusObat : obatRanap,
        }
        if (!res.writableEnded) {
          res.status(200).json({
            message: 'OK',
            data,
          })
        }
      }
      if (!result || result === null) {
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'Patient data not found',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        });
      }
    }
  });

Pharmacy.route('/farmasi/generate-pdf-cpotw')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const dataToPost = UpdateCPOTWPdf.createFromJson(req.body);
      const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tanggal_Masuk', 'Tipe_Pasien', 'Rawat_Inap'];
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Farmasi');
      if (checkObject !== null && checkObject.includes('Pemberian_Obat')) {
        emrKeys.push('Farmasi.Pemberian_Obat');
      }
      if (checkObject !== null && checkObject.includes('Obat_Diberikan')) {
        emrKeys.push('Farmasi.Obat_Diberikan');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form = result['Farmasi.Pemberian_Obat'] ? result['Farmasi.Pemberian_Obat'] : [];
        const meds = result['Farmasi.Obat_Diberikan'] ? result['Farmasi.Obat_Diberikan'] : [];
        const patient = result['Pasien'] ?? {};
        const inpatient = result['Rawat_Inap'] ?? {};

        const dates = form.map((item: any) => item.Tanggal);
        const finalDates = dates.filter((item: any, index: number) => dates.indexOf(item) === index);

        const groupedByDate = [];
        for (let i = 0; i < finalDates.length; i += 1) {
          const arrObj = form.filter((item: any) => item.Tanggal === finalDates[i]);
          const isValidated = !!(arrObj.find((item: any) => item.Validated));
          const medsOfObj = meds.map((item1: any) => {
            const times = arrObj.map((item2: any) => {
              const isTrue = item2.Obat.find((val: any) => val.Kode === item1.ID_Obat);
              if (isTrue) {
                return {
                  Waktu: item2.Waktu ?? '',
                  TTD_Pasien: item2.Tanda_Tangan_Pasien ?? '',
                  TTD_Perawat: item2.Tanda_Tangan_Perawat ?? '',
                }
              }
            })
            const newTimes = times.filter((time: any) => !!time);
            return {
              nama_obat: item1.Nama_Obat ?? '',
              aturan_pakai: item1.Kode_AturanPakai ?? '',
              rute: item1.Rute ?? '',
              parafdokter: item1.TTD_Dokter ?? '',
              catatan: item1.Catatan ?? '',
              time1: newTimes[0] && newTimes[0].Waktu ? newTimes[0].Waktu : '',
              time2: newTimes[1] && newTimes[1].Waktu ? newTimes[1].Waktu : '',
              time3: newTimes[2] && newTimes[2].Waktu ? newTimes[2].Waktu : '',
              time4: newTimes[3] && newTimes[3].Waktu ? newTimes[3].Waktu : '',
              time5: newTimes[4] && newTimes[4].Waktu ? newTimes[4].Waktu : '',
              time6: newTimes[5] && newTimes[5].Waktu ? newTimes[5].Waktu : '',
              time7: newTimes[6] && newTimes[6].Waktu ? newTimes[6].Waktu : '',
              time8: newTimes[7] && newTimes[7].Waktu ? newTimes[7].Waktu : '',
              parafpasien1: newTimes[0] && newTimes[0].TTD_Pasien ? newTimes[0].TTD_Pasien : '',
              parafpasien2: newTimes[1] && newTimes[1].TTD_Pasien ? newTimes[1].TTD_Pasien : '',
              parafpasien3: newTimes[2] && newTimes[2].TTD_Pasien ? newTimes[2].TTD_Pasien : '',
              parafpasien4: newTimes[3] && newTimes[3].TTD_Pasien ? newTimes[3].TTD_Pasien : '',
              parafpasien5: newTimes[4] && newTimes[4].TTD_Pasien ? newTimes[4].TTD_Pasien : '',
              parafpasien6: newTimes[5] && newTimes[5].TTD_Pasien ? newTimes[5].TTD_Pasien : '',
              parafpasien7: newTimes[6] && newTimes[6].TTD_Pasien ? newTimes[6].TTD_Pasien : '',
              parafpasien8: newTimes[7] && newTimes[7].TTD_Pasien ? newTimes[7].TTD_Pasien : '',
              parafperawat1: newTimes[0] && newTimes[0].TTD_Perawat ? newTimes[0].TTD_Perawat : '',
              parafperawat2: newTimes[1] && newTimes[1].TTD_Perawat ? newTimes[1].TTD_Perawat : '',
              parafperawat3: newTimes[2] && newTimes[2].TTD_Perawat ? newTimes[2].TTD_Perawat : '',
              parafperawat4: newTimes[3] && newTimes[3].TTD_Perawat ? newTimes[3].TTD_Perawat : '',
              parafperawat5: newTimes[4] && newTimes[4].TTD_Perawat ? newTimes[4].TTD_Perawat : '',
              parafperawat6: newTimes[5] && newTimes[5].TTD_Perawat ? newTimes[5].TTD_Perawat : '',
              parafperawat7: newTimes[6] && newTimes[6].TTD_Perawat ? newTimes[6].TTD_Perawat : '',
              parafperawat8: newTimes[7] && newTimes[7].TTD_Perawat ? newTimes[7].TTD_Perawat : '',
            }
          })
          const x = medsOfObj ?? []
          const defaultImg = 'https://bucket.rsmatasmec.com/gambar_putih_ttd.jpeg'
          for (let k = 0; k < x.length; k += 1) {
            x[k].parafdokter = x[k].parafdokter && x[k].parafdokter !== '' && isValidFile(x[k].parafdokter) ? await global.storage.signUrl(x[k].parafdokter, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : defaultImg

            x[k].parafpasien1 = x[k].parafpasien1 !== '' && isValidFile(x[k].parafpasien1) ? await global.storage.signUrl(x[k].parafpasien1, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : defaultImg

            x[k].parafpasien2 = x[k].parafpasien2 !== '' && isValidFile(x[k].parafpasien2) ? await global.storage.signUrl(x[k].parafpasien2, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : defaultImg

            x[k].parafpasien3 = x[k].parafpasien3 !== '' && isValidFile(x[k].parafpasien3) ? await global.storage.signUrl(x[k].parafpasien3, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : defaultImg

            x[k].parafpasien4 = x[k].parafpasien4 !== '' && isValidFile(x[k].parafpasien4) ? await global.storage.signUrl(x[k].parafpasien4, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : defaultImg

            x[k].parafpasien5 = x[k].parafpasien5 !== '' && isValidFile(x[k].parafpasien5) ? await global.storage.signUrl(x[k].parafpasien5, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : defaultImg

            x[k].parafpasien6 = x[k].parafpasien6 !== '' && isValidFile(x[k].parafpasien6) ? await global.storage.signUrl(x[k].parafpasien6, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : defaultImg

            x[k].parafpasien7 = x[k].parafpasien7 !== '' && isValidFile(x[k].parafpasien7) ? await global.storage.signUrl(x[k].parafpasien7, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : defaultImg

            x[k].parafpasien8 = x[k].parafpasien8 !== '' && isValidFile(x[k].parafpasien8) ? await global.storage.signUrl(x[k].parafpasien8, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : defaultImg

            x[k].parafperawat1 = x[k].parafperawat1 !== '' && isValidFile(x[k].parafperawat1) ? await global.storage.signUrl(x[k].parafperawat1, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : defaultImg

            x[k].parafperawat2 = x[k].parafperawat2 !== '' && isValidFile(x[k].parafperawat2) ? await global.storage.signUrl(x[k].parafperawat2, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : defaultImg

            x[k].parafperawat3 = x[k].parafperawat3 !== '' && isValidFile(x[k].parafperawat3) ? await global.storage.signUrl(x[k].parafperawat3, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : defaultImg

            x[k].parafperawat4 = x[k].parafperawat4 !== '' && isValidFile(x[k].parafperawat4) ? await global.storage.signUrl(x[k].parafperawat4, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : defaultImg

            x[k].parafperawat5 = x[k].parafperawat5 !== '' && isValidFile(x[k].parafperawat5) ? await global.storage.signUrl(x[k].parafperawat5, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : defaultImg

            x[k].parafperawat6 = x[k].parafperawat6 !== '' && isValidFile(x[k].parafperawat6) ? await global.storage.signUrl(x[k].parafperawat6, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : defaultImg

            x[k].parafperawat7 = x[k].parafperawat7 !== '' && isValidFile(x[k].parafperawat7) ? await global.storage.signUrl(x[k].parafperawat7, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : defaultImg

            x[k].parafperawat8 = x[k].parafperawat8 !== '' && isValidFile(x[k].parafperawat8) ? await global.storage.signUrl(x[k].parafperawat8, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : defaultImg
          }
          groupedByDate.push({
            tanggal_array: finalDates[i],
            parafapoteker: isValidated && arrObj[0].TTD_Apoteker ? await global.storage.signUrl(arrObj[0].TTD_Apoteker, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : 'https://bucket.rsmatasmec.com/gambar_putih_ttd.jpeg',
            beri: medsOfObj ?? [],
          })
        }

        const data = {
          nomor_mr: result.No_MR ?? '',
          'pasien.Nama': patient.Nama ?? '',
          'pasien.Tgl_Lahir': patient.Tgl_Lahir ?? '',
          kelas: inpatient.Nama_Kelas_Kamar ?? '',
          bed: inpatient.Nama_Tempat_Tidur ?? '',
          diagnosis: inpatient.Diagnosa ?? '',
          alergi: dataToPost.alergi ?? '',
          rpo: dataToPost.rpo ?? '',
          rpt: dataToPost.rpt ?? '',
          tanggalpemberian: groupedByDate ?? [],
        };

        const pdfx = await global.storage.convertDocToPdf2(
          req.emrParams.Kode_Cabang,
          'farmasi_cpotw',
          dataToPost.emr_id,
          '',
          data,
        );

        if (pdfx && pdfx !== null) {
          const branchTimezone = await global.medicalRecord.getConfigValue(result.Kode_Cabang, "timezone");
          const resultPDF = await global.storage.uploadFromMemory(`pdfs/${result.Kode_Cabang}/${result.Jenis_Pelayanan}/${moment.unix(result.Tanggal_Masuk).format("YYYY")}/${moment.unix(result.Tanggal_Masuk).format("MM")}/${result.Tipe_Pasien}/${result.No_MR}/${result.ID_Pelayanan}/farmasi_cpotw_${moment().utcOffset(branchTimezone).format("YYYYMMDDHHmmss")}.pdf`, pdfx);

          // Save PDF URL
          const url = encodeURI(`https://${resultPDF.bucket}/${resultPDF.name}?generation=${resultPDF.generation}`);
          // await global.medicalRecord.setField(req.emrID, req.body.form_name, "", url);
          const pdf: IPDF = {
            Version: await global.medicalRecord.getPDFLastVersion(req.emrID, req.body.form_name),
            URL: url,
            Form_Name: 'farmasi_cpotw',
            Visit_Date: moment.unix(result.Tanggal_Masuk).format("YYYY-MM-DD"),
            Created_At: moment().utcOffset(branchTimezone).format("YYYY-MM-DD HH:mm:ss"),
            Created_By: req.userId,
            Created_By_Name: req.userProfile.nama,
          };
          await global.medicalRecord.addPDF(req.emrID, pdf);
          const signUrl = url && url !== "" && isValidFile(url) ? await global.storage.signUrl(url, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`)) : undefined;

          ElasticLoggerService().createLog(req, 'farmasi/pdf-cpotw', 'OK');
          if (!res.writableEnded) {
            res.status(200).json({
              message: 'OK',
              data: {
                url,
                signUrl,
              },
            });
          }
        } else {
          ElasticLoggerService().createErrorLog(req, 'farmasi/pdf-cpotw', 'Failed to generate PDF');
          if (!res.writableEnded) {
            res.status(500).json({
              message: 'Failed to generate PDF',
            })
          }
        }
      } else {
        ElasticLoggerService().createErrorLog(req, 'farmasi/pdf-cpotw', 'No Data');
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'No Data',
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, 'farmasi/pdf-cpotw', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        })
      }
    }
  })

Pharmacy.route('/farmasi/pemberian-obat-beri-obat-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const localDebug = debugEMR.extend(req.path);
    localDebug(`Request Begin`);
    let responseMessage: string = '';
    try {
      const emrKeys = ["Kode_Cabang", "No_MR", "Pasien", "Tipe_Pasien", 'Rawat_Inap'];
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Farmasi');
      if (checkObject !== null && checkObject.includes('Pemberian_Obat')) {
        emrKeys.push('Farmasi.Pemberian_Obat');
      }
      const dataToPost = UpdateBeriObat.createFromJson(req.body);
      const id = dataToPost.id;
      const emrData = await global.medicalRecord.get(req.emrID, emrKeys);
      localDebug(`Get Data ${req.emrID}`);
      if (emrData && emrData !== null) {
        const meds = await global.medicalRecord.get(`Obat:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`);
        const htu = await global.medicalRecord.get(`AturanPakai:{${emrData.Kode_Cabang}}`);
        const newData = dataToPost.obat.map((item) => {
          const selectedMeds = meds && Array.isArray(meds) && meds.find((med: IMedicine) => med.Kode_Inventory.toString() === item.kode_obat.toString());
          const selectedHtu = htu && Array.isArray(htu) && htu.find((howTo: IHowToUse) => howTo.ID_AturanPakai === parseInt(item.kode_aturanpakai));
          if (selectedHtu && selectedMeds) {
            return {
              Kode: selectedMeds.Kode_Inventory,
              Nama: selectedMeds.Nama_Inventory,
              Satuan: selectedMeds.Nama_Satuan,
              Aturan_Pakai: selectedHtu.Kode,
              Rute: item.rute,
            }
          }
        });
        const nurse = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_perawat}')]`);
        const fixedData = {
          ...PemberianObat.createFromJson(dataToPost),
          Obat: newData ?? [],
          Nama_Perawat: nurse && Array.isArray(nurse) && nurse.length > 0 && nurse[0] ? nurse[0].Nama : '',
          ID_Petugas: (req.userId) ? req.userId : '',
          Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
          Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
          Updated_By: (req.userId) ? req.userId : '',
        }

        if (!id || id === '') {
          const redisJsonData = {
            ...fixedData,
            ID: uuid().replace(/-/g, "").toUpperCase(),
          }
          await global.medicalRecord.addPemberianObat(req.emrID, redisJsonData);
          responseMessage = 'Data berhasil ditambah';
        } else {
          const listPrjd = emrData['Farmasi.Pemberian_Obat'] && Array.isArray(emrData['Farmasi.Pemberian_Obat']) ? emrData['Farmasi.Pemberian_Obat'] : [];
          const selectedObject = listPrjd.find((item: any) => item.ID === id);
          if (selectedObject) {
            const redisJsonData = {
              ...fixedData,
              ID: id ?? '',
            }
            const diff = jsonpatch.compare(selectedObject, redisJsonData);

            const updateDocument = jsonpatch.applyPatch(selectedObject, diff);
            await global.medicalRecord.update(req.emrID, `$.Farmasi.Pemberian_Obat[?(@.ID=="${id}")]`, updateDocument.newDocument);
            responseMessage = "Data berhasil diubah";
          } else {
            throw new Error("No Data");
          }
        }
        ElasticLoggerService().createHTTPResponse(req, res, 200, {
          message: responseMessage,
        });
      }
      if (!emrData || (emrData && emrData === null)) {
        ElasticLoggerService().createHTTPResponse(req, res, 404, {
          message: "EMR Data Not Found",
        });
      }
    } catch (err) {
      localDebug(`Error ${err}`);
      ElasticLoggerService().createHTTPResponse(req, res, 500, {
        message: "Internal Server Error",
        error: err,
      });
    }
  });

Pharmacy.route('/farmasi/pemberian-obat-beri-obat-delete')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const emrKeys: Array<string> = [];
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Farmasi')
      if (checkObject && checkObject !== null && checkObject.includes('Pemberian_Obat')) {
        emrKeys.push('Farmasi.Pemberian_Obat');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);

      if (result && Array.isArray(result) && result.length > 0) {
        const index = result.findIndex((val: any) => val.ID === req.body.id);
        await global.medicalRecord.deletePemberianObat(req.emrID, index);
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
  })

Pharmacy.route('/farmasi/given-meds-item')
  .get(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien'];
    try {
      const checkObject = await global.medicalRecord.keys(req.query.emr_id, '.Farmasi');
      if (checkObject !== null && checkObject.includes('Obat_Diberikan')) {
        emrKeys.push('Farmasi.Obat_Diberikan');
      }
      const result = await global.medicalRecord.get(req.query.emr_id, emrKeys);
      if (result && result !== null) {
        const arr = result['Farmasi.Obat_Diberikan'] ?? [];
        for (let i = 0; i < arr.length; i += 1) {
          if (arr[i].TTD_Dokter && arr[i].TTD_Dokter !== '' && isValidFile(arr[i].TTD_Dokter)) {
            arr[i].TTD_Dokter = await global.storage.signUrl(arr[i].TTD_Dokter, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
          }
        }
        const meds = await global.medicalRecord.get(`Obat:{${result.Kode_Cabang}}:${result.Tipe_Pasien}`);
        const htu = await global.medicalRecord.get(`AturanPakai:{${result.Kode_Cabang}}`);
        const data: any = {
          EMR_ID: req.query.emr_id,
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          records: arr,
          obat: meds ?? [],
          aturan_pakai: htu ?? [],
        }
        if (!res.writableEnded) {
          res.status(200).json({
            message: 'OK',
            data,
          })
        }
      }
      if (!result || result === null) {
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'Patient data not found',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        });
      }
    }
  });

Pharmacy.route('/farmasi/given-meds-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const localDebug = debugEMR.extend(req.path);
    localDebug(`Request Begin`);
    let responseMessage: string = '';
    try {
      const emrKeys = ["Kode_Cabang", "No_MR", "Pasien", "Tipe_Pasien", 'Rawat_Inap'];
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Farmasi');
      if (checkObject !== null && checkObject.includes('Obat_Diberikan')) {
        emrKeys.push('Farmasi.Obat_Diberikan');
      }
      const dataToPost = UpdateObatDiberikan.createFromJson(req.body);
      const id = dataToPost.id ?? '';
      const emrData = await global.medicalRecord.get(req.emrID, emrKeys);
      localDebug(`Get Data ${req.emrID}`);
      if (emrData && emrData !== null) {
        const doctor = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_dokter_obat}')]`);
        const meds = await global.medicalRecord.get(`Obat:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`);
        const htu = await global.medicalRecord.get(`AturanPakai:{${emrData.Kode_Cabang}}`);
        const selectedMeds = meds && Array.isArray(meds) && meds.find((med: IMedicine) => med.Kode_Inventory.toString() === dataToPost.id_obat.toString());
        const selectedHtu = htu && Array.isArray(htu) && htu.find((howTo: IHowToUse) => howTo.ID_AturanPakai === parseInt(dataToPost.id_aturanpakai));
        const fixedData = {
          ID_Obat: selectedMeds.Kode_Inventory ?? '',
          Nama_Obat: selectedMeds.Nama_Inventory ?? '',
          ID_Satuan: selectedMeds.ID_Satuan ?? '',
          Nama_Satuan: selectedMeds.Nama_Satuan ?? '',
          ID_AturanPakai: selectedHtu.ID_AturanPakai ?? '',
          Nama_AturanPakai: selectedHtu.Nama ?? '',
          Kode_AturanPakai: selectedHtu.Kode ?? '',
          Rute: dataToPost.rute ?? '',
          Catatan: dataToPost.catatan,
          ID_Dokter: dataToPost.id_dokter_obat ?? '',
          TTD_Dokter: dataToPost.ttd_dokter && dataToPost.ttd_dokter !== '' && isValidFile(dataToPost.ttd_dokter) ? global.storage.cleanUrl(dataToPost.ttd_dokter) : '',
          Nama_Dokter: doctor && Array.isArray(doctor) && doctor.length > 0 && doctor[0] ? doctor[0].Nama : '',
        }

        if (!id || id === '') {
          const redisJsonData = {
            ...fixedData,
            ID: uuid().replace(/-/g, "").toUpperCase(),
          }
          await global.medicalRecord.addMedsToGive(req.emrID, redisJsonData);
          responseMessage = 'Data berhasil ditambah';
        } else {
          const listPrjd = emrData['Farmasi.Obat_Diberikan'] && Array.isArray(emrData['Farmasi.Obat_Diberikan']) ? emrData['Farmasi.Obat_Diberikan'] : [];
          const selectedObject = listPrjd.find((item: any) => item.ID === id);
          if (selectedObject) {
            const redisJsonData = {
              ...fixedData,
              ID: id ?? '',
            }
            const diff = jsonpatch.compare(selectedObject, redisJsonData);

            const updateDocument = jsonpatch.applyPatch(selectedObject, diff);
            await global.medicalRecord.update(req.emrID, `$.Farmasi.Obat_Diberikan[?(@.ID=="${id}")]`, updateDocument.newDocument);
            responseMessage = "Data berhasil diubah";
          } else {
            throw new Error("No Data");
          }
        }
        ElasticLoggerService().createHTTPResponse(req, res, 200, {
          message: responseMessage,
        });
      }
      if (!emrData || (emrData && emrData === null)) {
        ElasticLoggerService().createHTTPResponse(req, res, 404, {
          message: "EMR Data Not Found",
        });
      }
    } catch (err) {
      localDebug(`Error ${err}`);
      ElasticLoggerService().createHTTPResponse(req, res, 500, {
        message: "Internal Server Error",
        error: err,
      });
    }
  });

Pharmacy.route('/farmasi/given-meds-delete')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const emrKeys: Array<string> = [];
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Farmasi')
      if (checkObject && checkObject !== null && checkObject.includes('Obat_Diberikan')) {
        emrKeys.push('Farmasi.Obat_Diberikan');
      }
      if (checkObject && checkObject !== null && checkObject.includes('Pemberian_Obat')) {
        emrKeys.push('Farmasi.Pemberian_Obat');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);

      if (result && result !== null) {
        const arrGivenMeds = Array.isArray(result) ? result : result['Farmasi.Obat_Diberikan'] ?? [];
        const arrMedsAdmin = result['Farmasi.Pemberian_Obat'] ?? [];
        if (arrGivenMeds && Array.isArray(arrGivenMeds) && arrGivenMeds.length > 0) {
          const index = arrGivenMeds.findIndex((val: any) => val.ID === req.body.id);
          if (arrMedsAdmin && Array.isArray(arrMedsAdmin) && arrMedsAdmin.length > 0) {
            const medsCode = arrGivenMeds[index].ID_Obat;
            let isAllowed = true;
            for (let i = 0; i < arrMedsAdmin.length; i += 1) {
              const obats = arrMedsAdmin[i].Obat;
              const filtered = obats.filter((item: any) => {
                return medsCode.indexOf(item.Kode) !== -1;
              })
              if (filtered && filtered.length > 0) {
                isAllowed = false;
                break;
              }
            }
            if (!isAllowed) {
              if (!res.writableEnded) {
                res.status(400).json({
                  message: 'med_used_error',
                })
              }
            } else {
              await global.medicalRecord.deleteMedsToGive(req.emrID, index);
              if (!res.writableEnded) {
                res.status(200).json({
                  message: 'OK',
                })
              }
            }
          } else {
            await global.medicalRecord.deleteMedsToGive(req.emrID, index);
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
              })
            }
          }
        } else {
          if (!res.writableEnded) {
            res.status(500).json({
              message: 'No Data',
            })
          }
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

Pharmacy.route('/farmasi/pemberian-obat-validate')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const emrKeys: Array<string> = ['Kode_Cabang', 'Tipe_Pasien'];
      const date = req.body.date;
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Farmasi')
      if (checkObject && checkObject !== null && checkObject.includes('Pemberian_Obat')) {
        emrKeys.push('Farmasi.Pemberian_Obat');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      const medsAdmin = result['Farmasi.Pemberian_Obat'] ?? [];
      const pharmacist = await global.medicalRecord.get(`Employee:{${result.Kode_Cabang}}:${result.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${req.body.id_apoteker}')]`);
      const dataToPost = {
        TTD_Apoteker: req.body.ttd_apoteker && req.body.ttd_apoteker !== '' && isValidFile(req.body.ttd_apoteker) ? global.storage.cleanUrl(req.body.ttd_apoteker) : '',
        ID_Apoteker: req.body.id_apoteker ?? '',
        Nama_Apoteker: pharmacist && Array.isArray(pharmacist) && pharmacist.length > 0 && pharmacist[0] ? pharmacist[0].Nama : '',
        Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
        Updated_By: (req.userId) ? req.userId : '',
        Validated: true,
      }

      if (medsAdmin && medsAdmin !== null) {
        const filtered = medsAdmin.filter((item: any) => item.Tanggal === date);
        if (filtered && filtered.length > 0) {
          for (let i = 0; i < filtered.length; i += 1) {
            const data = filtered[i];
            const redisJsonData = {
              ...data,
              ...dataToPost,
            }
            await global.medicalRecord.update(req.emrID, `$.Farmasi.Pemberian_Obat[?(@.ID=="${data.ID}")]`, redisJsonData);
          }
          if (!res.writableEnded) {
            res.status(200).json({
              message: 'OK',
            })
          }
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

Pharmacy.route('/farmasi/rekonsiliasi-obat-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Farmasi'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Farmasi');
      if (checkObject !== null && checkObject.includes('Rekonsiliasi_Obat')) {
        emrKeys.push('Farmasi.Rekonsiliasi_Obat');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      if (result && result !== null) {
        const form: IRekonsiliasiObat = result['Farmasi.Rekonsiliasi_Obat'] ? result['Farmasi.Rekonsiliasi_Obat'] : {};

        if (form.TTD_Perawat_Keluar && form.TTD_Perawat_Keluar !== '' && isValidFile(form.TTD_Perawat_Keluar)) {
          form.TTD_Perawat_Keluar = await global.storage.signUrl(form.TTD_Perawat_Keluar, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Perawat_Masuk_RS && form.TTD_Perawat_Masuk_RS !== '' && isValidFile(form.TTD_Perawat_Masuk_RS)) {
          form.TTD_Perawat_Masuk_RS = await global.storage.signUrl(form.TTD_Perawat_Masuk_RS, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Perawat_Ruangan_1 && form.TTD_Perawat_Ruangan_1 !== '' && isValidFile(form.TTD_Perawat_Ruangan_1)) {
          form.TTD_Perawat_Ruangan_1 = await global.storage.signUrl(form.TTD_Perawat_Ruangan_1, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Perawat_Ruangan_2 && form.TTD_Perawat_Ruangan_2 !== '' && isValidFile(form.TTD_Perawat_Ruangan_2)) {
          form.TTD_Perawat_Ruangan_2 = await global.storage.signUrl(form.TTD_Perawat_Ruangan_2, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Apoteker_Masuk_RS && form.TTD_Apoteker_Masuk_RS !== '' && isValidFile(form.TTD_Apoteker_Masuk_RS)) {
          form.TTD_Apoteker_Masuk_RS = await global.storage.signUrl(form.TTD_Apoteker_Masuk_RS, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Apoteker_Keluar && form.TTD_Apoteker_Keluar !== '' && isValidFile(form.TTD_Apoteker_Keluar)) {
          form.TTD_Apoteker_Keluar = await global.storage.signUrl(form.TTD_Apoteker_Keluar, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Apoteker_Masuk_RS && form.TTD_Apoteker_Masuk_RS !== '' && isValidFile(form.TTD_Apoteker_Masuk_RS)) {
          form.TTD_Apoteker_Masuk_RS = await global.storage.signUrl(form.TTD_Apoteker_Masuk_RS, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Apoteker_Ruangan_1 && form.TTD_Apoteker_Ruangan_1 !== '' && isValidFile(form.TTD_Apoteker_Ruangan_1)) {
          form.TTD_Apoteker_Ruangan_1 = await global.storage.signUrl(form.TTD_Apoteker_Ruangan_1, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Apoteker_Ruangan_2 && form.TTD_Apoteker_Ruangan_2 !== '' && isValidFile(form.TTD_Apoteker_Ruangan_2)) {
          form.TTD_Apoteker_Ruangan_2 = await global.storage.signUrl(form.TTD_Apoteker_Ruangan_2, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Apoteker_Masuk_RS && form.TTD_Apoteker_Masuk_RS !== '' && isValidFile(form.TTD_Apoteker_Masuk_RS)) {
          form.TTD_Apoteker_Masuk_RS = await global.storage.signUrl(form.TTD_Apoteker_Masuk_RS, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Dokter_Keluar && form.TTD_Dokter_Keluar !== '' && isValidFile(form.TTD_Dokter_Keluar)) {
          form.TTD_Dokter_Keluar = await global.storage.signUrl(form.TTD_Dokter_Keluar, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Dokter_Masuk_RS && form.TTD_Dokter_Masuk_RS !== '' && isValidFile(form.TTD_Dokter_Masuk_RS)) {
          form.TTD_Dokter_Masuk_RS = await global.storage.signUrl(form.TTD_Dokter_Masuk_RS, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Dokter_Ruangan_1 && form.TTD_Dokter_Ruangan_1 !== '' && isValidFile(form.TTD_Dokter_Ruangan_1)) {
          form.TTD_Dokter_Ruangan_1 = await global.storage.signUrl(form.TTD_Dokter_Ruangan_1, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Dokter_Ruangan_2 && form.TTD_Dokter_Ruangan_2 !== '' && isValidFile(form.TTD_Dokter_Ruangan_2)) {
          form.TTD_Dokter_Ruangan_2 = await global.storage.signUrl(form.TTD_Dokter_Ruangan_2, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Pasien_Keluar && form.TTD_Pasien_Keluar !== '' && isValidFile(form.TTD_Pasien_Keluar)) {
          form.TTD_Pasien_Keluar = await global.storage.signUrl(form.TTD_Pasien_Keluar, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Pasien_Masuk_RS && form.TTD_Pasien_Masuk_RS !== '' && isValidFile(form.TTD_Pasien_Masuk_RS)) {
          form.TTD_Pasien_Masuk_RS = await global.storage.signUrl(form.TTD_Pasien_Masuk_RS, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Pasien_Ruangan_1 && form.TTD_Pasien_Ruangan_1 !== '' && isValidFile(form.TTD_Pasien_Ruangan_1)) {
          form.TTD_Pasien_Ruangan_1 = await global.storage.signUrl(form.TTD_Pasien_Ruangan_1, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        if (form.TTD_Pasien_Ruangan_2 && form.TTD_Pasien_Ruangan_2 !== '' && isValidFile(form.TTD_Pasien_Ruangan_2)) {
          form.TTD_Pasien_Ruangan_2 = await global.storage.signUrl(form.TTD_Pasien_Ruangan_2, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        const data: any = {
          EMR_ID: req.emrID,
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          form,
        }
        if (!res.writableEnded) {
          res.status(200).json({
            message: 'OK',
            data,
          })
        }
      }
      if (!result || result === null) {
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'Patient data not found',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        });
      }
    }
  });

Pharmacy.route('/farmasi/rekonsiliasi-obat-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdateRekonsiliasiObat = req.body;
          const pharmacist1 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_apoteker_keluar}')]`)
          const pharmacist2 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_apoteker_masuk_rs}')]`)
          const pharmacist3 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_apoteker_ruangan_1}')]`)
          const pharmacist4 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_apoteker_ruangan_2}')]`)
          const doctor1 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_dokter_keluar}')]`)
          const doctor2 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_dokter_masuk_rs}')]`)
          const doctor3 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_dokter_ruangan_1}')]`)
          const doctor4 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_dokter_ruangan_2}')]`)
          const head1 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_ka_unit_keluar}')]`)
          const head2 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_ka_unit_masuk_rs}')]`)
          const head3 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_ka_unit_ruangan_1}')]`)
          const head4 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_ka_unit_ruangan_2}')]`)
          const nurse1 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_perawat_keluar}')]`)
          const nurse2 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_perawat_masuk_rs}')]`)
          const nurse3 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_perawat_ruangan_1}')]`)
          const nurse4 = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_perawat_ruangan_2}')]`)
          const fixedData = RekonsiliasiObat.createFromJson(dataToPost);
          const redisJsonData: IRekonsiliasiObat = {
            ...fixedData,
            Nama_Apoteker_Keluar: pharmacist1 && Array.isArray(pharmacist1) && pharmacist1.length > 0 && pharmacist1[0] ? pharmacist1[0].Nama : '',
            Nama_Apoteker_Masuk_RS: pharmacist2 && Array.isArray(pharmacist2) && pharmacist2.length > 0 && pharmacist2[0] ? pharmacist2[0].Nama : '',
            Nama_Apoteker_Ruangan_1: pharmacist3 && Array.isArray(pharmacist3) && pharmacist3.length > 0 && pharmacist3[0] ? pharmacist3[0].Nama : '',
            Nama_Apoteker_Ruangan_2: pharmacist4 && Array.isArray(pharmacist4) && pharmacist4.length > 0 && pharmacist4[0] ? pharmacist4[0].Nama : '',
            Nama_Dokter_Keluar: doctor1 && Array.isArray(doctor1) && doctor1.length > 0 && doctor1[0] ? doctor1[0].Nama : '',
            Nama_Dokter_Masuk_RS: doctor2 && Array.isArray(doctor2) && doctor2.length > 0 && doctor2[0] ? doctor2[0].Nama : '',
            Nama_Dokter_Ruangan_1: doctor3 && Array.isArray(doctor3) && doctor3.length > 0 && doctor3[0] ? doctor3[0].Nama : '',
            Nama_Dokter_Ruangan_2: doctor4 && Array.isArray(doctor4) && doctor4.length > 0 && doctor4[0] ? doctor4[0].Nama : '',
            Nama_Ka_Unit_Keluar: head1 && Array.isArray(head1) && head1.length > 0 && head1[0] ? head1[0].Nama : '',
            Nama_Ka_Unit_Masuk_RS: head2 && Array.isArray(head2) && head2.length > 0 && head2[0] ? head2[0].Nama : '',
            Nama_Ka_Unit_Ruangan_1: head3 && Array.isArray(head3) && head3.length > 0 && head3[0] ? head3[0].Nama : '',
            Nama_Ka_Unit_Ruangan_2: head4 && Array.isArray(head4) && head4.length > 0 && head4[0] ? head4[0].Nama : '',
            Nama_Perawat_Keluar: nurse1 && Array.isArray(nurse1) && nurse1.length > 0 && nurse1[0] ? nurse1[0].Nama : '',
            Nama_Perawat_Masuk_RS: nurse2 && Array.isArray(nurse2) && nurse2.length > 0 && nurse2[0] ? nurse2[0].Nama : '',
            Nama_Perawat_Ruangan_1: nurse3 && Array.isArray(nurse3) && nurse3.length > 0 && nurse3[0] ? nurse3[0].Nama : '',
            Nama_Perawat_Ruangan_2: nurse4 && Array.isArray(nurse4) && nurse4.length > 0 && nurse4[0] ? nurse4[0].Nama : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const inpatient: IPharmacy = {
            Rekonsiliasi_Obat: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Farmasi && newEmrData.Farmasi !== null) {
            newEmrData.Farmasi.Rekonsiliasi_Obat = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Farmasi.Rekonsiliasi_Obat',
              updateDocument.newDocument.Farmasi.Rekonsiliasi_Obat,
            );
            ElasticLoggerService().createLog(req, '/farmasi/rekonsiliasi-obat', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                data: {
                  EMR_ID: req.emrID,
                  nomor_mr: (emrData.No_MR) ? emrData.No_MR : '',
                  id_pelayanan: (emrData.ID_Pelayanan && emrData.ID_Pelayanan !== '') ? emrData.ID_Pelayanan : '',
                  jenis_pelayanan: (emrData.Jenis_Pelayanan && emrData.Jenis_Pelayanan !== '') ? emrData.Jenis_Pelayanan : '',
                  kode_cabang: (emrData.Kode_Cabang && emrData.Kode_Cabang !== '') ? emrData.Kode_Cabang : '',
                  pasien: (emrData.Pasien) ? emrData.Pasien : {},
                  tipe_pasien: (emrData.Tipe_Pasien && emrData.Tipe_Pasien !== '') ? emrData.Tipe_Pasien : '',
                  form: updateDocument.newDocument.Farmasi.Rekonsiliasi_Obat,
                },
              })
            }
          } else {
            newEmrData.Farmasi = inpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Farmasi', updateDocument.newDocument.Farmasi);
            ElasticLoggerService().createLog(req, '/farmasi/rekonsiliasi-obat', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                data: {
                  EMR_ID: req.emrID,
                  nomor_mr: (emrData.No_MR) ? emrData.No_MR : '',
                  id_pelayanan: (emrData.ID_Pelayanan && emrData.ID_Pelayanan !== '') ? emrData.ID_Pelayanan : '',
                  jenis_pelayanan: (emrData.Jenis_Pelayanan && emrData.Jenis_Pelayanan !== '') ? emrData.Jenis_Pelayanan : '',
                  kode_cabang: (emrData.Kode_Cabang && emrData.Kode_Cabang !== '') ? emrData.Kode_Cabang : '',
                  pasien: (emrData.Pasien) ? emrData.Pasien : {},
                  tipe_pasien: (emrData.Tipe_Pasien && emrData.Tipe_Pasien !== '') ? emrData.Tipe_Pasien : '',
                  form: updateDocument.newDocument.Farmasi.Rekonsiliasi_Obat,
                },
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/farmasi/rekonsiliasi-obat', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/farmasi/rekonsiliasi-obat', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/farmasi/rekonsiliasi-obat', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  })

Pharmacy.route('/farmasi/efek-samping-obat-index')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const emrKeys: Array<string> = ["ID_Pelayanan", 'No_MR', "Jenis_Pelayanan", 'Kode_Cabang', "Pasien", 'Tipe_Pasien', 'Farmasi'];
    try {
      const checkObject = await global.medicalRecord.keys(req.emrID, '.Farmasi');
      if (checkObject !== null && checkObject.includes('Efek_Samping_Obat')) {
        emrKeys.push('Farmasi.Efek_Samping_Obat');
      }
      const result = await global.medicalRecord.get(req.emrID, emrKeys);
      const meds = await global.medicalRecord.get(`Obat:{${result.Kode_Cabang}}:${result.Tipe_Pasien}`);
      const htu = await global.medicalRecord.get(`AturanPakai:{${result.Kode_Cabang}}`);
      if (result && result !== null) {
        const form: IEfekSampingObat = result['Farmasi.Efek_Samping_Obat'] ? result['Farmasi.Efek_Samping_Obat'] : {};

        if (form.TTD_Pelapor && form.TTD_Pelapor !== '' && isValidFile(form.TTD_Pelapor)) {
          form.TTD_Pelapor = await global.storage.signUrl(form.TTD_Pelapor, new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`))
        }
        const data: any = {
          EMR_ID: req.emrID,
          nomor_mr: (result.No_MR) ? result.No_MR : '',
          id_pelayanan: (result.ID_Pelayanan && result.ID_Pelayanan !== '') ? result.ID_Pelayanan : '',
          jenis_pelayanan: (result.Jenis_Pelayanan && result.Jenis_Pelayanan !== '') ? result.Jenis_Pelayanan : '',
          kode_cabang: (result.Kode_Cabang && result.Kode_Cabang !== '') ? result.Kode_Cabang : '',
          pasien: (result.Pasien) ? result.Pasien : {},
          tipe_pasien: (result.Tipe_Pasien && result.Tipe_Pasien !== '') ? result.Tipe_Pasien : '',
          form,
          obat: meds ?? [],
          aturan_pakai: htu ?? [],
        }
        if (!res.writableEnded) {
          res.status(200).json({
            message: 'OK',
            data,
          })
        }
      }
      if (!result || result === null) {
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'Patient data not found',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        });
      }
    }
  });

Pharmacy.route('/farmasi/efek-samping-obat-process')
  .post(RBAC.getInstance().isUserAuthenticated, RBAC.getInstance().getParameters, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      if (req.body && req.emrID) {
        const emrData = await global.medicalRecord.get(req.emrID, '.')
        if (emrData && emrData !== null) {
          const dataToPost: IUpdateEfekSampingObat = req.body;
          const reporter = await global.medicalRecord.get(`Employee:{${emrData.Kode_Cabang}}:${emrData.Tipe_Pasien}`, `$[?(@.Status_Aktif==1&&@.ID_Karyawan=='${dataToPost.id_pelapor}')]`)
          const fixedData = EfekSampingObat.createFromJson(dataToPost);
          const redisJsonData: IEfekSampingObat = {
            ...fixedData,
            Nama_Pelapor: reporter && Array.isArray(reporter) && reporter.length > 0 && reporter[0] ? reporter[0].Nama : '',
            ID_Petugas: (req.userId) ? req.userId : '',
            Nama_Petugas: (req.userProfile && req.userProfile.nama) ? req.userProfile.nama : '',
            Updated_At: moment().utcOffset(await global.medicalRecord.getConfigValue(req.emrParams.Kode_Cabang, "timezone")).format("YYYY-MM-DD HH:mm:ss"),
            Updated_By: (req.userId) ? req.userId : '',
          }

          const inpatient: IPharmacy = {
            Efek_Samping_Obat: redisJsonData,
          }

          const newEmrData: IMedicalRecord = JSON.parse(JSON.stringify(emrData))
          if (newEmrData.Farmasi && newEmrData.Farmasi !== null) {
            newEmrData.Farmasi.Efek_Samping_Obat = redisJsonData;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff);
            await global.medicalRecord.update(
              req.emrID,
              '$.Farmasi.Efek_Samping_Obat',
              updateDocument.newDocument.Farmasi.Efek_Samping_Obat,
            );
            const data: any = {
              EMR_ID: req.emrID,
              nomor_mr: (emrData.No_MR) ? emrData.No_MR : '',
              id_pelayanan: (emrData.ID_Pelayanan && emrData.ID_Pelayanan !== '') ? emrData.ID_Pelayanan : '',
              jenis_pelayanan: (emrData.Jenis_Pelayanan && emrData.Jenis_Pelayanan !== '') ? emrData.Jenis_Pelayanan : '',
              kode_cabang: (emrData.Kode_Cabang && emrData.Kode_Cabang !== '') ? emrData.Kode_Cabang : '',
              pasien: (emrData.Pasien) ? emrData.Pasien : {},
              tipe_pasien: (emrData.Tipe_Pasien && emrData.Tipe_Pasien !== '') ? emrData.Tipe_Pasien : '',
              form: updateDocument.newDocument.Farmasi.Efek_Samping_Obat,
            }
            ElasticLoggerService().createLog(req, '/farmasi/efek-samping-obat', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                data,
              })
            }
          } else {
            newEmrData.Farmasi = inpatient;
            const diff = jsonpatch.compare(emrData, newEmrData);
            const updateDocument = jsonpatch.applyPatch(emrData, diff)
            await global.medicalRecord.update(req.emrID, '$.Farmasi', updateDocument.newDocument.Farmasi);
            const data: any = {
              EMR_ID: req.emrID,
              nomor_mr: (emrData.No_MR) ? emrData.No_MR : '',
              id_pelayanan: (emrData.ID_Pelayanan && emrData.ID_Pelayanan !== '') ? emrData.ID_Pelayanan : '',
              jenis_pelayanan: (emrData.Jenis_Pelayanan && emrData.Jenis_Pelayanan !== '') ? emrData.Jenis_Pelayanan : '',
              kode_cabang: (emrData.Kode_Cabang && emrData.Kode_Cabang !== '') ? emrData.Kode_Cabang : '',
              pasien: (emrData.Pasien) ? emrData.Pasien : {},
              tipe_pasien: (emrData.Tipe_Pasien && emrData.Tipe_Pasien !== '') ? emrData.Tipe_Pasien : '',
              form: updateDocument.newDocument.Farmasi.Efek_Samping_Obat,
            }
            ElasticLoggerService().createLog(req, '/farmasi/efek-samping-obat', 'OK');
            if (!res.writableEnded) {
              res.status(200).json({
                message: 'OK',
                data,
              })
            }
          }
        }
        if (!emrData || (emrData && emrData === null)) {
          const errorMessage = 'Patient data not found'
          ElasticLoggerService().createErrorLog(req, '/farmasi/efek-samping-obat', errorMessage);
          if (!res.writableEnded) {
            res.status(500).json({
              message: errorMessage,
            })
          }
        }
      }
      if (!req.emrID || (req.emrID && req.emrID === null)) {
        const errorMessage = 'EMR_ID not found'
        ElasticLoggerService().createErrorLog(req, '/farmasi/efek-samping-obat', errorMessage);
        if (!res.writableEnded) {
          res.status(500).json({
            message: errorMessage,
          })
        }
      }
    } catch (err) {
      ElasticLoggerService().createErrorLog(req, '/farmasi/efek-samping-obat', err);
      if (!res.writableEnded) {
        res.status(500).json({
          message: `${err}`,
        })
      }
    }
  })

export { Pharmacy };
