import { RedisClientOptions, createClient } from "redis";
import { Request, Response, NextFunction } from "express";
import { v4 as uuid } from "uuid";
import moment from "moment";
import { ElasticLoggerService } from "network/routes/emr/services";
const jp = require("jsonpath");
const axios = require("axios");
const {BigQuery} = require('@google-cloud/bigquery');
const {PubSub} = require('@google-cloud/pubsub');
const bigquery = new BigQuery();

class MedicalRecordService {
    readonly prefix: string = "MedicalRecord:";
    readonly patientPrefix: string = "Patient:";
    readonly patientPrefixGuardian: string = "PatientGuardian:";

    private client: any;
    private env: string = '';
    constructor(options: RedisClientOptions, env:string) {
        this.client = createClient(options);
        this.env = env;
        this.client.on("error", (err: any) => {
            console.log("MedicalRecord - Redis Client Error", err);
        });
        this.client.on('connect', () => {
            console.log('MedicalRecord - Redis connected');
        });
        this.client.on('reconnecting', () => {
            console.log('MedicalRecord - Redis reconnecting');
        });
        this.client.on('ready', () => {
            console.log('MedicalRecord - Redis ready!');
        });
    }

    async connect() {
        await this.client.connect();
    }
    
    async sendCommand(commands:Array<string>) {
        await this.client.sendCommand(commands);
    }
    
    // changeType: INSERT | UPDATE | DELETE
    async logChange(key:string, changeType:string) {
        if (key.includes("MedicalRecord")) {
            const result = await this.client.json.get(key, "$");
            const branchCode = key.substring(15, key.indexOf("}"));
            const deleted = (changeType == "DELETE" ? true : false).toString();
            const uniqueID = uuid();
            
            const pubSubClient = new PubSub();
            const dataBuffer = Buffer.from(JSON.stringify(result));
            const customAttributes = {
              source: 'gic-emr-backend',
              env: this.env,
              branchCode: branchCode,
              keyName: key,
              changeType: changeType,
              deleted: deleted
            };
            
            let messageId;
            if (this.env && this.env === 'development') {
                messageId = await pubSubClient.topic(`dev_emr_v2_logs`).publish(dataBuffer, customAttributes);
            }
            if (this.env && this.env === 'production') {
                messageId = await pubSubClient.topic(`emr_v2_logs`).publish(dataBuffer, customAttributes);
            }
            console.log(`emr_${this.env}_logs => Message ${messageId} published.`);
        }
    }

    async loadAll(key: string) {
        try {
            const result = await this.client.json.get(this.prefix + key, ".");
            return result;
        } catch (err) {
            throw err;
        }
    }

    async getByPath(id: string, path: string): Promise<any> {
        try {
            const value = await this.client.json.get(id, { path });
            return value;
        } catch (err) {
            throw err;
        }
    }

    async new(branchCode: string, value: IMedicalRecord): Promise<string> {
        try {
            const id: string = uuid().replace(/-/g, "").toUpperCase();
            await this.client.json.set(`${this.prefix}{${branchCode}}:${id}`, "$", value);
            await this.logChange(`${this.prefix}{${branchCode}}:${id}`, "INSERT");
            return `${this.prefix}{${branchCode}}:${id}`;
        } catch (err) {
            throw err;
        }
    }

    async newQueue(branchCode: string, value: IQueue): Promise<string> {
        try {
            await this.client.json.set(`Queue:{${branchCode}}`, "$", value);
            return `Queue:{${branchCode}}`;
        } catch (err) {
            throw err;
        }
    }

    async newHeaderPDF(branchCode: string, value: any): Promise<string> {
        try {
            await this.client.json.set(`HeaderPDF:{${branchCode}}`, "$", value);
            return `HeaderPDF:{${branchCode}}`;
        } catch (err) {
            throw err;
        }
    }

    async newRooms(branchCode: string, value: any): Promise<string> {
        try {
            await this.client.json.set(`Rooms:{${branchCode}}`, "$", value);
            return `Rooms:{${branchCode}}`;
        } catch (err) {
            throw err;
        }
    }

    async newAnamnesa(branchCode: string, value: any): Promise<string> {
        try {
            await this.client.json.set(`Anamnesa:{${branchCode}}`, "$", value);
            return `Anamnesa:{${branchCode}}`;
        } catch (err) {
            throw err;
        }
    }

    async newAturanPakai(branchCode: string, value: any): Promise<string> {
        try {
            await this.client.json.set(`AturanPakai:{${branchCode}}`, "$", value);
            return `AturanPakai:{${branchCode}}`;
        } catch (err) {
            throw err;
        }
    }

    async newObat(branchCode: string, serviceType: string, value: any): Promise<string> {
        try {
            await this.client.json.set(`Obat:{${branchCode}}:${serviceType}`, "$", value);
            return `Obat:{${branchCode}}:${serviceType}`;
        } catch (err) {
            throw err;
        }
    }

    async newListKaryawan(branchCode: string, serviceType: string, value: any): Promise<string> {
        try {
            await this.client.json.set(`Employee:{${branchCode}}:${serviceType}`, "$", value);
            return `Employee:{${branchCode}}:${serviceType}`;
        } catch (err) {
            throw err;
        }
    }

    async newObatIol(branchCode: string, serviceType: string, value: any): Promise<string> {
        try {
            await this.client.json.set(`ObatIOL:{${branchCode}}:${serviceType}`, "$", value);
            return `ObatIOL:{${branchCode}}:${serviceType}`;
        } catch (err) {
            throw err;
        }
    }

    async newPaketObat(branchCode: string, value: any): Promise<string> {
        try {
            await this.client.json.set(`PaketObat:{${branchCode}}`, "$", value);
            return `PaketObat:{${branchCode}}`;
        } catch (err) {
            throw err;
        }
    }

    async newRequestMr(branchCode: string, value: any): Promise<string> {
        const id: string = uuid().replace(/-/g, "").toUpperCase();
        try {
            await this.client.json.set(`RequestMR:{${branchCode}}:${id}`, "$", value);
            return `RequestMR:{${branchCode}}:${id}`;
        } catch (err) {
            throw err;
        }
    }

    async newMedicalRecordUsers(branchCode: string, value: any): Promise<string> {
        try {
            await this.client.json.set(`MedicalRecordUsers:{${branchCode}}`, "$", value);
            return `MedicalRecordUsers:{${branchCode}}`;
        } catch (err) {
            throw err;
        }
    }

    async update(id: string, path: string, value: any): Promise<string> {
        try {
            const result = await this.client.json.set(id, path, value);
            await this.logChange(id, "UPDATE");
            return result;
        } catch (err) {
            throw err;
        }
    }

    async delete(id: string, path: string): Promise<any> {
        try {
            await this.logChange(id, "DELETE");
            const result = await this.client.json.del(id, path);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async addCPPT(id: string, value: any): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            let result = null;
            if (checkObject !== null && checkObject.includes("Common")) {
                const checkCPPT = await this.keys(id, ".Common");
                if (checkCPPT && checkCPPT !== null && checkCPPT.includes("CPPT")) {
                    result = await this.client.json.arrAppend(id, `Common.CPPT`, value);
                } else {
                    result = await this.client.json.set(id, `Common.CPPT`, []);
                    result = await this.client.json.arrAppend(id, `Common.CPPT`, value);
                }
            } else {
                result = await this.client.json.set(id, "Common", {});
                result = await this.client.json.set(id, `Common.CPPT`, []);
                result = await this.client.json.arrAppend(id, `Common.CPPT`, value);
            }
            await this.logChange(id, "UPDATE");
            return result;
        } catch (err) {
            throw err;
        }
    }

    async addKonsultasi(id: string, value: any): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            let result = null;
            if (checkObject !== null && checkObject.includes("Konsultasi")) {
                const checkKonsultasi = await this.keys(id, ".Konsultasi");
                if (checkKonsultasi && checkKonsultasi !== null && checkKonsultasi.includes("Lembar_Konsultasi")) {
                    result = await this.client.json.arrAppend(id, `Konsultasi.Lembar_Konsultasi`, value);
                } else {
                    result = await this.client.json.set(id, `Konsultasi.Status_Konsultasi`, '1')
                    result = await this.client.json.set(id, `Konsultasi.Lembar_Konsultasi`, []);
                    result = await this.client.json.arrAppend(id, `Konsultasi.Lembar_Konsultasi`, value);
                }
            } else {
                result = await this.client.json.set(id, "Konsultasi", {});
                result = await this.client.json.set(id, `Konsultasi.Status_Konsultasi`, '1')
                result = await this.client.json.set(id, `Konsultasi.Lembar_Konsultasi`, []);
                result = await this.client.json.arrAppend(id, `Konsultasi.Lembar_Konsultasi`, value);
            }
            await this.logChange(id, "UPDATE");
            return result;
        } catch (err) {
            throw err;
        }
    }

    async addEdukasiHarian(id: string, value: any): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            let result = null;
            if (checkObject !== null && checkObject.includes("Common")) {
                const checkCPPT = await this.keys(id, ".Common");
                if (checkCPPT && checkCPPT !== null && checkCPPT.includes("Edukasi_Harian")) {
                    result = await this.client.json.arrAppend(id, `Common.Edukasi_Harian`, value);
                } else {
                    result = await this.client.json.set(id, `Common.Edukasi_Harian`, []);
                    result = await this.client.json.arrAppend(id, `Common.Edukasi_Harian`, value);
                }
            } else {
                result = await this.client.json.set(id, "Common", {});
                result = await this.client.json.set(id, `Common.Edukasi_Harian`, []);
                result = await this.client.json.arrAppend(id, `Common.Edukasi_Harian`, value);
            }
            await this.logChange(id, "UPDATE");
            return result;
        } catch (err) {
            throw err;
        }
    }

    async addMedsToGive(id: string, value: any): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            let result = null;
            if (checkObject !== null && checkObject.includes("Farmasi")) {
                const checkEws = await this.keys(id, ".Farmasi");
                if (checkEws && checkEws !== null && checkEws.includes("Obat_Diberikan")) {
                    result = await this.client.json.arrAppend(id, `Farmasi.Obat_Diberikan`, value);
                } else {
                    result = await this.client.json.set(id, `Farmasi.Obat_Diberikan`, []);
                    result = await this.client.json.arrAppend(id, `Farmasi.Obat_Diberikan`, value);
                }
            } else {
                result = await this.client.json.set(id, "Farmasi", {});
                result = await this.client.json.set(id, `Farmasi.Obat_Diberikan`, []);
                result = await this.client.json.arrAppend(id, `Farmasi.Obat_Diberikan`, value);
            }
            await this.logChange(id, "UPDATE");
            return result;
        } catch (err) {
            throw err;
        }
    }

    async addEarlyWarningScoring(id: string, value: any): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            let result = null;
            if (checkObject !== null && checkObject.includes("Rawat_Inap")) {
                const checkEws = await this.keys(id, ".Rawat_Inap");
                if (checkEws && checkEws !== null && checkEws.includes("Pengkajian_Early_Warning_Scoring_System")) {
                    result = await this.client.json.arrAppend(id, `Rawat_Inap.Pengkajian_Early_Warning_Scoring_System`, value);
                } else {
                    result = await this.client.json.set(id, `Rawat_Inap.Pengkajian_Early_Warning_Scoring_System`, []);
                    result = await this.client.json.arrAppend(id, `Rawat_Inap.Pengkajian_Early_Warning_Scoring_System`, value);
                }
            } else {
                result = await this.client.json.set(id, "Rawat_Inap", {});
                result = await this.client.json.set(id, `Rawat_Inap.Pengkajian_Early_Warning_Scoring_System`, []);
                result = await this.client.json.arrAppend(id, `Rawat_Inap.Pengkajian_Early_Warning_Scoring_System`, value);
            }
            await this.logChange(id, "UPDATE");
            return result;
        } catch (err) {
            throw err;
        }
    }

    async addPengkajianResikoJatuhAnak(id: string, value: any): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            let result = null;
            if (checkObject !== null && checkObject.includes("Rawat_Inap")) {
                const checkPrja = await this.keys(id, ".Rawat_Inap");
                if (checkPrja && checkPrja !== null && checkPrja.includes("Pengkajian_Resiko_Jatuh_Anak")) {
                    result = await this.client.json.arrAppend(id, `Rawat_Inap.Pengkajian_Resiko_Jatuh_Anak`, value);
                } else {
                    result = await this.client.json.set(id, `Rawat_Inap.Pengkajian_Resiko_Jatuh_Anak`, []);
                    result = await this.client.json.arrAppend(id, `Rawat_Inap.Pengkajian_Resiko_Jatuh_Anak`, value);
                }
            } else {
                result = await this.client.json.set(id, "Rawat_Inap", {});
                result = await this.client.json.set(id, `Rawat_Inap.Pengkajian_Resiko_Jatuh_Anak`, []);
                result = await this.client.json.arrAppend(id, `Rawat_Inap.Pengkajian_Resiko_Jatuh_Anak`, value);
            }
            await this.logChange(id, "UPDATE");
            return result;
        } catch (err) {
            throw err;
        }
    }

    async addPengkajianResikoJatuhDewasa(id: string, value: any): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            let result = null;
            if (checkObject !== null && checkObject.includes("Rawat_Inap")) {
                const checkPrjd = await this.keys(id, ".Rawat_Inap");
                if (checkPrjd && checkPrjd !== null && checkPrjd.includes("Pengkajian_Resiko_Jatuh_Dewasa")) {
                    result = await this.client.json.arrAppend(id, `Rawat_Inap.Pengkajian_Resiko_Jatuh_Dewasa`, value);
                } else {
                    result = await this.client.json.set(id, `Rawat_Inap.Pengkajian_Resiko_Jatuh_Dewasa`, []);
                    result = await this.client.json.arrAppend(id, `Rawat_Inap.Pengkajian_Resiko_Jatuh_Dewasa`, value);
                }
            } else {
                result = await this.client.json.set(id, "Rawat_Inap", {});
                result = await this.client.json.set(id, `Rawat_Inap.Pengkajian_Resiko_Jatuh_Dewasa`, []);
                result = await this.client.json.arrAppend(id, `Rawat_Inap.Pengkajian_Resiko_Jatuh_Dewasa`, value);
            }
            await this.logChange(id, "UPDATE");
            return result;
        } catch (err) {
            throw err;
        }
    }

    async addImplementasiPasienResikoJatuh(id: string, value: any): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            let result = null;
            if (checkObject !== null && checkObject.includes("Rawat_Inap")) {
                const checkPrjd = await this.keys(id, ".Rawat_Inap");
                if (checkPrjd && checkPrjd !== null && checkPrjd.includes("Implementasi_Pasien_Resiko_Jatuh")) {
                    result = await this.client.json.arrAppend(id, `Rawat_Inap.Implementasi_Pasien_Resiko_Jatuh`, value);
                } else {
                    result = await this.client.json.set(id, `Rawat_Inap.Implementasi_Pasien_Resiko_Jatuh`, []);
                    result = await this.client.json.arrAppend(id, `Rawat_Inap.Implementasi_Pasien_Resiko_Jatuh`, value);
                }
            } else {
                result = await this.client.json.set(id, "Rawat_Inap", {});
                result = await this.client.json.set(id, `Rawat_Inap.Implementasi_Pasien_Resiko_Jatuh`, []);
                result = await this.client.json.arrAppend(id, `Rawat_Inap.Implementasi_Pasien_Resiko_Jatuh`, value);
            }
            await this.logChange(id, "UPDATE");
            return result;
        } catch (err) {
            throw err;
        }
    }

    async addMonitoringSkalaNyeri(id: string, value: any): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            let result = null;
            if (checkObject !== null && checkObject.includes("Rawat_Inap")) {
                const checkPrjd = await this.keys(id, ".Rawat_Inap");
                if (checkPrjd && checkPrjd !== null && checkPrjd.includes("Monitoring_Skala_Nyeri")) {
                    result = await this.client.json.arrAppend(id, `Rawat_Inap.Monitoring_Skala_Nyeri`, value);
                } else {
                    result = await this.client.json.set(id, `Rawat_Inap.Monitoring_Skala_Nyeri`, []);
                    result = await this.client.json.arrAppend(id, `Rawat_Inap.Monitoring_Skala_Nyeri`, value);
                }
            } else {
                result = await this.client.json.set(id, "Rawat_Inap", {});
                result = await this.client.json.set(id, `Rawat_Inap.Monitoring_Skala_Nyeri`, []);
                result = await this.client.json.arrAppend(id, `Rawat_Inap.Monitoring_Skala_Nyeri`, value);
            }
            await this.logChange(id, "UPDATE");
            return result;
        } catch (err) {
            throw err;
        }
    }

    async addAsesmenUlangTandaVital(id: string, value: any): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            let result = null;
            if (checkObject !== null && checkObject.includes("Rawat_Inap")) {
                const checkPrjd = await this.keys(id, ".Rawat_Inap");
                if (checkPrjd && checkPrjd !== null && checkPrjd.includes("Asesmen_Ulang_Tanda_Vital")) {
                    result = await this.client.json.arrAppend(id, `Rawat_Inap.Asesmen_Ulang_Tanda_Vital`, value);
                } else {
                    result = await this.client.json.set(id, `Rawat_Inap.Asesmen_Ulang_Tanda_Vital`, []);
                    result = await this.client.json.arrAppend(id, `Rawat_Inap.Asesmen_Ulang_Tanda_Vital`, value);
                }
            } else {
                result = await this.client.json.set(id, "Rawat_Inap", {});
                result = await this.client.json.set(id, `Rawat_Inap.Asesmen_Ulang_Tanda_Vital`, []);
                result = await this.client.json.arrAppend(id, `Rawat_Inap.Asesmen_Ulang_Tanda_Vital`, value);
            }
            await this.logChange(id, "UPDATE");
            return result;
        } catch (err) {
            throw err;
        }
    }

    async addInfeksiDaerahOperasi(id: string, value: any): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            let result = null;
            if (checkObject !== null && checkObject.includes("Rawat_Inap")) {
                const checkPrjd = await this.keys(id, ".Rawat_Inap");
                if (checkPrjd && checkPrjd !== null && checkPrjd.includes("Infeksi_Daerah_Operasi")) {
                    result = await this.client.json.arrAppend(id, `Rawat_Inap.Infeksi_Daerah_Operasi`, value);
                } else {
                    result = await this.client.json.set(id, `Rawat_Inap.Infeksi_Daerah_Operasi`, []);
                    result = await this.client.json.arrAppend(id, `Rawat_Inap.Infeksi_Daerah_Operasi`, value);
                }
            } else {
                result = await this.client.json.set(id, "Rawat_Inap", {});
                result = await this.client.json.set(id, `Rawat_Inap.Infeksi_Daerah_Operasi`, []);
                result = await this.client.json.arrAppend(id, `Rawat_Inap.Infeksi_Daerah_Operasi`, value);
            }
            await this.logChange(id, "UPDATE");
            return result;
        } catch (err) {
            throw err;
        }
    }

    async addPemberianObat(id: string, value: any): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            let result = null;
            if (checkObject !== null && checkObject.includes("Farmasi")) {
                const checkPrjd = await this.keys(id, ".Farmasi");
                if (checkPrjd && checkPrjd !== null && checkPrjd.includes("Pemberian_Obat")) {
                    result = await this.client.json.arrAppend(id, `Farmasi.Pemberian_Obat`, value);
                } else {
                    result = await this.client.json.set(id, `Farmasi.Pemberian_Obat`, []);
                    result = await this.client.json.arrAppend(id, `Farmasi.Pemberian_Obat`, value);
                }
            } else {
                result = await this.client.json.set(id, "Farmasi", {});
                result = await this.client.json.set(id, `Farmasi.Pemberian_Obat`, []);
                result = await this.client.json.arrAppend(id, `Farmasi.Pemberian_Obat`, value);
            }
            await this.logChange(id, "UPDATE");
            return result;
        } catch (err) {

        }
    }

    async addTebusObatRanap(id: string, value: any): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            let result = null;
            if (checkObject !== null && checkObject.includes("Rawat_Inap")) {
                const checkEws = await this.keys(id, ".Rawat_Inap");
                if (checkEws && checkEws !== null && checkEws.includes("Daftar_Resep_Visit_Dokter")) {
                    result = await this.client.json.arrAppend(id, `Rawat_Inap.Daftar_Resep_Visit_Dokter`, value);
                } else {
                    result = await this.client.json.set(id, `Rawat_Inap.Daftar_Resep_Visit_Dokter`, []);
                    result = await this.client.json.arrAppend(id, `Rawat_Inap.Daftar_Resep_Visit_Dokter`, value);
                }
            } else {
                result = await this.client.json.set(id, "Rawat_Inap", {});
                result = await this.client.json.set(id, `Rawat_Inap.Daftar_Resep_Visit_Dokter`, []);
                result = await this.client.json.arrAppend(id, `Rawat_Inap.Daftar_Resep_Visit_Dokter`, value);
            }
            await this.logChange(id, "UPDATE");
            return result;
        } catch (err) {
            throw err;
        }
    }

    async addTransferPasien(id: string, value: any): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            let result = null;
            if (checkObject !== null && checkObject.includes("Common")) {
                const checkPrjd = await this.keys(id, ".Common");
                if (checkPrjd && checkPrjd !== null && checkPrjd.includes("Transfer_Pasien")) {
                    result = await this.client.json.arrAppend(id, `Common.Transfer_Pasien`, value);
                } else {
                    result = await this.client.json.set(id, `Common.Transfer_Pasien`, []);
                    result = await this.client.json.arrAppend(id, `Common.Transfer_Pasien`, value);
                }
            } else {
                result = await this.client.json.set(id, "Common", {});
                result = await this.client.json.set(id, `Common.Transfer_Pasien`, []);
                result = await this.client.json.arrAppend(id, `Common.Transfer_Pasien`, value);
            }
            await this.logChange(id, "UPDATE");
            return result;
        } catch (err) {
            throw err;
        }
    }

    async addHasilPemeriksaan(id: string, value: any): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            let result = null;
            if (checkObject !== null && checkObject.includes("Rawat_Jalan")) {
                const checkRajal = await this.keys(id, ".Rawat_Jalan");
                if (checkRajal && checkRajal !== null && checkRajal.includes("Laporan_Hasil_Alat_Pemeriksaan")) {
                    result = await this.client.json.arrAppend(id, `Rawat_Jalan.Laporan_Hasil_Alat_Pemeriksaan`, value);
                } else {
                    result = await this.client.json.set(id, `Rawat_Jalan.Laporan_Hasil_Alat_Pemeriksaan`, []);
                    result = await this.client.json.arrAppend(id, `Rawat_Jalan.Laporan_Hasil_Alat_Pemeriksaan`, value);
                }
            } else {
                result = await this.client.json.set(id, "Rawat_Jalan", {});
                result = await this.client.json.set(id, `Rawat_Jalan.Laporan_Hasil_Alat_Pemeriksaan`, []);
                result = await this.client.json.arrAppend(id, `Rawat_Jalan.Laporan_Hasil_Alat_Pemeriksaan`, value);
            }
            await this.logChange(id, "UPDATE");
            return result;
        } catch (err) {
            throw err;
        }
    }

    async deleteCPPT(id: string, index: number): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            if (checkObject !== null && checkObject.includes("Common")) {
                const checkCPPT = await this.keys(id, ".Common");
                if (checkCPPT && checkCPPT !== null && checkCPPT.includes("CPPT")) {
                    await this.client.json.arrPop(id, `Common.CPPT`, index);
                    await this.logChange(id, "UPDATE");
                }
            }
        } catch (err) {
            throw err;
        }
    }

    async deleteKonsultasi(id: string, index: number): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            if (checkObject !== null && checkObject.includes("Konsultasi")) {
                const checkEws = await this.keys(id, ".Konsultasi");
                if (checkEws && checkEws !== null && checkEws.includes("Lembar_Konsultasi")) {
                    await this.client.json.arrPop(id, `Konsultasi.Lembar_Konsultasi`, index);
                    await this.logChange(id, "UPDATE");
                }
            }
        } catch (err) {
            throw err;
        }
    }

    async deleteEarlyWarningScore(id: string, index: number): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            if (checkObject !== null && checkObject.includes("Rawat_Inap")) {
                const checkEws = await this.keys(id, ".Rawat_Inap");
                if (checkEws && checkEws !== null && checkEws.includes("Pengkajian_Early_Warning_Scoring_System")) {
                    await this.client.json.arrPop(id, `Rawat_Inap.Pengkajian_Early_Warning_Scoring_System`, index);
                    await this.logChange(id, "UPDATE");
                }
            }
        } catch (err) {
            throw err;
        }
    }

    async deletePemberianObat(id: string, index: number): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            if (checkObject !== null && checkObject.includes("Farmasi")) {
                const checkEws = await this.keys(id, ".Farmasi");
                if (checkEws && checkEws !== null && checkEws.includes("Pemberian_Obat")) {
                    await this.client.json.arrPop(id, `Farmasi.Pemberian_Obat`, index);
                    await this.logChange(id, "UPDATE");
                }
            }
        } catch (err) {
            throw err;
        }
    }

    async deleteMedsToGive(id: string, index: number): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            if (checkObject !== null && checkObject.includes("Farmasi")) {
                const checkEws = await this.keys(id, ".Farmasi");
                if (checkEws && checkEws !== null && checkEws.includes("Obat_Diberikan")) {
                    await this.client.json.arrPop(id, `Farmasi.Obat_Diberikan`, index);
                    await this.logChange(id, "UPDATE");
                }
            }
        } catch (err) {
            throw err;
        }
    }

    async deletePengkajianResikoJatuhAnak(id: string, index: number): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            if (checkObject !== null && checkObject.includes("Rawat_Inap")) {
                const checkEws = await this.keys(id, ".Rawat_Inap");
                if (checkEws && checkEws !== null && checkEws.includes("Pengkajian_Resiko_Jatuh_Anak")) {
                    await this.client.json.arrPop(id, `Rawat_Inap.Pengkajian_Resiko_Jatuh_Anak`, index);
                    await this.logChange(id, "UPDATE");
                }
            }
        } catch (err) {
            throw err;
        }
    }

    async deletePengkajianResikoJatuhDewasa(id: string, index: number): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            if (checkObject !== null && checkObject.includes("Rawat_Inap")) {
                const checkPrjd = await this.keys(id, ".Rawat_Inap");
                if (checkPrjd && checkPrjd !== null && checkPrjd.includes("Pengkajian_Resiko_Jatuh_Dewasa")) {
                    await this.client.json.arrPop(id, `Rawat_Inap.Pengkajian_Resiko_Jatuh_Dewasa`, index);
                    await this.logChange(id, "UPDATE");
                }
            }
        } catch (err) {
            throw err;
        }
    }

    async deleteImplementasiPasienResikoJatuh(id: string, index: number): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            if (checkObject !== null && checkObject.includes("Rawat_Inap")) {
                const checkPrjd = await this.keys(id, ".Rawat_Inap");
                if (checkPrjd && checkPrjd !== null && checkPrjd.includes("Implementasi_Pasien_Resiko_Jatuh")) {
                    await this.client.json.arrPop(id, `Rawat_Inap.Implementasi_Pasien_Resiko_Jatuh`, index);
                    await this.logChange(id, "UPDATE");
                }
            }
        } catch (err) {
            throw err;
        }
    }

    async deleteMonitoringSkalaNyeri(id: string, index: number): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            if (checkObject !== null && checkObject.includes("Rawat_Inap")) {
                const checkPrjd = await this.keys(id, ".Rawat_Inap");
                if (checkPrjd && checkPrjd !== null && checkPrjd.includes("Monitoring_Skala_Nyeri")) {
                    await this.client.json.arrPop(id, `Rawat_Inap.Monitoring_Skala_Nyeri`, index);
                    await this.logChange(id, "UPDATE");
                }
            }
        } catch (err) {
            throw err;
        }
    }

    async deleteAsesmenUlangTandaVital(id: string, index: number): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            if (checkObject !== null && checkObject.includes("Rawat_Inap")) {
                const checkPrjd = await this.keys(id, ".Rawat_Inap");
                if (checkPrjd && checkPrjd !== null && checkPrjd.includes("Asesmen_Ulang_Tanda_Vital")) {
                    await this.client.json.arrPop(id, `Rawat_Inap.Asesmen_Ulang_Tanda_Vital`, index);
                    await this.logChange(id, "UPDATE");
                }
            }
        } catch (err) {
            throw err;
        }
    }

    async deleteInfeksiDaerahOperasi(id: string, index: number): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            if (checkObject !== null && checkObject.includes("Rawat_Inap")) {
                const checkPrjd = await this.keys(id, ".Rawat_Inap");
                if (checkPrjd && checkPrjd !== null && checkPrjd.includes("Infeksi_Daerah_Operasi")) {
                    await this.client.json.arrPop(id, `Rawat_Inap.Infeksi_Daerah_Operasi`, index);
                    await this.logChange(id, "UPDATE");
                }
            }
        } catch (err) {
            throw err;
        }
    }

    async deleteTransferPasien(id: string, index: number): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            if (checkObject !== null && checkObject.includes("Common")) {
                const checkPrjd = await this.keys(id, ".Common");
                if (checkPrjd && checkPrjd !== null && checkPrjd.includes("Transfer_Pasien")) {
                    await this.client.json.arrPop(id, `Common.Transfer_Pasien`, index);
                    await this.logChange(id, "UPDATE");
                }
            }
        } catch (err) {
            throw err;
        }
    }

    async deleteEdukasiHarian(id: string, index: number): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            if (checkObject !== null && checkObject.includes("Common")) {
                const checkCPPT = await this.keys(id, ".Common");
                if (checkCPPT && checkCPPT !== null && checkCPPT.includes("Edukasi_Harian")) {
                    await this.client.json.arrPop(id, `Common.Edukasi_Harian`, index);
                    await this.logChange(id, "UPDATE");
                }
            }
        } catch (err) {
            throw err;
        }
    }

    async deleteHasilPemeriksaan(id: string, index: number): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            if (checkObject !== null && checkObject.includes("Rawat_Jalan")) {
                const checkCPPT = await this.keys(id, ".Rawat_Jalan");
                if (checkCPPT && checkCPPT !== null && checkCPPT.includes("Laporan_Hasil_Alat_Pemeriksaan")) {
                    await this.client.json.arrPop(id, `Rawat_Jalan.Laporan_Hasil_Alat_Pemeriksaan`, index);
                    await this.logChange(id, "UPDATE");
                }
            }
        } catch (err) {
            throw err;
        }
    }

    async saveToArrayByPath(id: string, path: string, value: any): Promise<string> {
        try {
            const result = await this.client.json.arrAppend(id, path, value);
            await this.logChange(id, "UPDATE");
            return result;
        } catch (err) {
            throw err;
        }
    }
    
    async findDicom(searchQuery:String, options: any):Promise<any> {
        try {
            const result = await this.client.ft.search("dicomIdx", searchQuery, options);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async findCPPT(searchQuery: string, options: any): Promise<any> {
        try {
            const result = await this.client.ft.search("cpptIdx", searchQuery, options);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async findKonsultasi(searchQuery: string, options: any): Promise<any> {
        try {
            const result = await this.client.ft.search("consultationIdx", searchQuery, options);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async findEdukasiHarian(searchQuery: string, options: any): Promise<any> {
        try {
            const result = await this.client.ft.search("edukasiIdx", searchQuery, options);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async findHasilPemeriksaan(searchQuery: string, options: any): Promise<any> {
        try {
            const result = await this.client.ft.search("pemeriksaanAlatIdx", searchQuery, options);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async findEarlyWarningScoring(searchQuery: string, options: any): Promise<any> {
        try {
            const result = await this.client.ft.search("ewsIdx", searchQuery, options);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async findRequestMr(searchQuery: string, options: any): Promise<any> {
        try {
            const result = await this.client.ft.search("requestMrIdx", searchQuery, options);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async find(searchQuery: string, options: any): Promise<any> {
        try {
            const result = await this.client.ft.search("medicalRecordIdx", searchQuery, options);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async findPdf(searchQuery: string, options: any): Promise<any> {
        try {
            const result = await this.client.ft.search('pdfIdx', searchQuery, options);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async aggregate(searchQuery: string, options: any): Promise<any> {
        try {
            const result = await this.client.ft.aggregate("medicalRecordIdx", searchQuery, options);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async consultationAggregate(searchQuery: string, options: any): Promise<any> {
        try {
            const result = await this.client.ft.aggregate("consulRecordIdx", searchQuery, options);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async getConfigValue(companyCode: string, fieldName: string): Promise<any> {
        try {
            const result = (await this.client.json.get(`Config:{${companyCode}}`, { path: [`.${fieldName}`] })) || "";
            return result;
        } catch (err) {
            throw err;
        }
    }

    async addDicom(id: string, value: IDicomMetadata): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            let result = null;
            if (checkObject !== null && checkObject.includes("Dicoms")) {
                result = await this.client.json.arrInsert(id, `Dicoms`, 0, value);
            } else {
                result = await this.client.json.set(id, `Dicoms`, []);
                result = await this.client.json.arrInsert(id, `Dicoms`, 0, value);
            }
            await this.logChange(id, "UPDATE");
            return result;
        } catch (err) {
            throw err;
        }
    }

    async deleteDicom(id: string, key: string): Promise<any> {
        const checkObject = await this.keys(id, ".");
        if (checkObject !== null && checkObject.includes("Dicoms")) {
            const result = await this.client.json.del(id, `.Dicoms[?(@.SOPInstanceUID=="${key}")]`);
            await this.logChange(id, "UPDATE");
            return result;
        } else {
            return 0;
        }
    }

    async getDicoms(id: string): Promise<any> {
        const checkObject = await this.keys(id, ".");
        if (checkObject !== null && checkObject.includes("Dicoms")) {
            const result = (await this.client.json.get(id, { path: [`.Dicoms`] })) || [];
            return result;
        } else {
            return [];
        }
    }

    async addPDF(id: string, value: IPDF): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".");
            let result = null;
            if (checkObject !== null && checkObject.includes("PDFs")) {
                result = await this.client.json.arrInsert(id, `PDFs`, 0, value);
            } else {
                result = await this.client.json.set(id, `PDFs`, []);
                result = await this.client.json.arrInsert(id, `PDFs`, 0, value);
            }
            await this.logChange(id, "UPDATE");
            return result;
        } catch (err) {
            throw err;
        }
    }

    async getPDFLastVersion(id: string, formName: string): Promise<any> {
        const checkObject = await this.keys(id, ".");
        if (checkObject !== null && checkObject.includes("PDFs")) {
            let result = (await this.client.json.get(id, { path: [`.PDFs`] })) || [];
            if (result.length > 0) result = jp.query(result, `$[?(@.Form_Name=='${formName}')]`);
            return result.length + 1;
        } else {
            return 1;
        }
    }

    async getPDFs(id: string, formName: string): Promise<any> {
        const checkObject = await this.keys(id, ".");
        if (checkObject !== null && checkObject.includes("PDFs")) {
            let result = (await this.client.json.get(id, { path: [`.PDFs`] })) || [];
            if (formName !== "" && result.length > 0) {
                result = jp.query(result, `$[?(@.Form_Name=='${formName}')]`);
            }
            return result;
        } else {
            return [];
        }
    }

    async setField(id: string, formName: string, componentId: string, value: string): Promise<any> {
        try {
            const checkObject = await this.keys(id, ".Fields");
            let result = null;
            let fieldName = formName;
            if (componentId !== "") fieldName = `${fieldName}/${componentId}`;
            if (checkObject !== null) {
                result = await this.client.json.set(id, `.Fields.${fieldName}`, global.storage.cleanUrl(value));
            } else {
                result = await this.client.json.set(id, `.Fields`, {});
                result = await this.client.json.set(id, `.Fields.${fieldName}`, global.storage.cleanUrl(value));
            }
            await this.logChange(id, "UPDATE");
            //const result = await this.client.hSet(`${id}:Fields`, `${formName}/${componentId}`, value)
            return result;
        } catch (err) {
            throw err;
        }
    }

    async getField(id: string, formName: string, componentId: string): Promise<any> {
        try {
            let fieldName = formName;
            if (componentId !== "") fieldName = `${fieldName}/${componentId}`;
            const result = await this.client.json.get(id, `.Fields.${fieldName}`);
            //const result = await this.client.hGet(`${id}:Fields`, `${formName}/${componentId}`)
            return result;
        } catch (err) {
            throw err;
        }
    }

    async getFields(id: string, fields: Array<any>): Promise<any> {
        try {
            const selectFields = [];
            if (fields.length > 0) {
                const checkObject = await this.keys(id, ".Fields");
                let fieldName = "";
                if (checkObject !== null) {
                    for (let i = 0; i < fields.length; i++) {
                        fieldName = `${fields[i].form_name}/${fields[i].component_id}`;
                        if (checkObject.includes(fieldName)) selectFields.push(`.Fields.${fieldName}`);
                    }
                    const data = await this.client.json.get(id, { path: selectFields });
                    for (let i = 0; i < fields.length; i++) {
                        fieldName = `${fields[i].form_name}/${fields[i].component_id}`;
                        fields[i]["value"] = await global.storage.signUrl(data[`.Fields.${fieldName}`], new Date(`${moment().format("YYYY-MM-DD")} 23:59:59`));
                    }
                }
                /*
        for (var i = 0; i < fields.length; i++) {
          selectFields.push(`${fields[i].form_name}/${fields[i].component_id}`)
        }
        const data = await this.client.hmGet(`${id}:Fields`, selectFields)
        for (var i = 0; i < fields.length; i++) {
          fields[i]['value'] = await global.storage.signUrl(data[i],new Date(moment().format("YYYY-MM-DD") + ' 23:59:59'))
        }
        */
                return fields;
            }
            return [];
        } catch (err) {
            throw err;
        }
    }

    async keys(id: string, path: string): Promise<any> {
        try {
            const result = await this.client.json.objKeys(id, path);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async get(id: string, path: Array<string>): Promise<any> {
        try {
            const result = await this.client.json.get(id, { path });
            return result;
        } catch (err) {
            console.error(err);
            return {};
        }
    }

    async findAll(searchMedicalRecordOptions: ISearchMedicalRecordOptions): Promise<any> {
        try {
            let searchQuery = "'";
            if (searchMedicalRecordOptions.Kode_Cabang) searchQuery += ` @Kode_Cabang:${searchMedicalRecordOptions.Kode_Cabang}`;
            if (searchMedicalRecordOptions.Jenis_Pelayanan) searchQuery += ` @Jenis_Pelayanan:${searchMedicalRecordOptions.Jenis_Pelayanan}`;
            if (searchMedicalRecordOptions.No_MR) searchQuery += ` @No_MR:${searchMedicalRecordOptions.No_MR}`;
            if (searchMedicalRecordOptions.Tipe_Pasien) searchQuery += ` @Tipe_Pasien:${searchMedicalRecordOptions.Tipe_Pasien}`;
            if (searchMedicalRecordOptions.ID_Pelayanan) searchQuery += ` @ID_Pelayanan:${searchMedicalRecordOptions.ID_Pelayanan.replace(/-/g, "_")}`;

            searchQuery += "'";
            ElasticLoggerService().createLog(searchMedicalRecordOptions, '/find-all', searchQuery);
            const result = await this.client.ft.search("medicalRecordIdx", searchQuery, searchMedicalRecordOptions.Options);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async findOne(searchMedicalRecordOptions: ISearchMedicalRecordOptions): Promise<any> {
        try {
            let searchQuery = "'";
            if (searchMedicalRecordOptions.Kode_Cabang) searchQuery += ` @Kode_Cabang:${searchMedicalRecordOptions.Kode_Cabang}`;
            if (searchMedicalRecordOptions.Jenis_Pelayanan) searchQuery += ` @Jenis_Pelayanan:${searchMedicalRecordOptions.Jenis_Pelayanan}`;
            if (searchMedicalRecordOptions.No_MR) searchQuery += ` @No_MR:${searchMedicalRecordOptions.No_MR}`;
            if (searchMedicalRecordOptions.Tipe_Pasien) searchQuery += ` @Tipe_Pasien:${searchMedicalRecordOptions.Tipe_Pasien}`;
            if (searchMedicalRecordOptions.ID_Pelayanan) searchQuery += ` @ID_Pelayanan:${searchMedicalRecordOptions.ID_Pelayanan.replace(/-/g, "_")}`;

            searchQuery += "'";
            const result = await this.client.ft.search("medicalRecordIdx", searchQuery, searchMedicalRecordOptions.Options);
            if (result.total > 0) {
                return result.documents[0];
            }
            return null;
        } catch (err) {
            throw err;
        }
    }

    async savePatient(companyCode: string, MRN: string, value: any): Promise<string> {
        try {
            const result = await this.client.json.set(`${this.patientPrefix}{${companyCode}}:${MRN}`, "$", value);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async getPatient(companyCode: string, MRN: string): Promise<any> {
        try {
            const result = await this.client.json.get(`${this.patientPrefix}{${companyCode}}:${MRN}`, "$");
            return result;
        } catch (err) {
            throw err;
        }
    }

    async savePatientGuardian(companyCode: string, MRN: string, value: any): Promise<string> {
        try {
            const result = await this.client.json.set(`${this.patientPrefixGuardian}{${companyCode}}:${MRN}`, "$", value);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async getPatientGuardian(companyCode: string, MRN: string): Promise<any> {
        try {
            const result = await this.client.json.get(`${this.patientPrefixGuardian}{${companyCode}}:${MRN}`, "$");
            return result;
        } catch (err) {
            throw err;
        }
    }

    getAge(birthday: Date, relativeTo: any = null): number {
        if (relativeTo === null) {
            relativeTo = Date.now();
        }

        const ageDifMs = relativeTo - birthday.getTime();
        const ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    getFullAge(birthday: Date, relativeTo: any = null) {
        if (relativeTo === null) {
            relativeTo = new Date();
        }

        const ageDiff = relativeTo.getTime() - birthday.getTime();
        const elapsed = new Date(ageDiff);
        const year = elapsed.getUTCFullYear() - 1970;
        const month = elapsed.getUTCMonth();
        const day = elapsed.getUTCDate()
        return {
            Tahun: `${year}`,
            Bulan: `${month}`,
            Hari: `${day}`,
        }
    }

    getGenderName(code: string) {
        switch (code.toUpperCase()) {
            case "L":
                return "Laki-Laki";
            case "P":
                return "Perempuan";
        }
        return "";
    }

    getReligionName(code: string) {
        switch (code.toUpperCase()) {
            case "B":
                return "Budha";
            case "K":
                return "Katolik";
            case "P":
                return "Protestan";
            case "I":
                return "Islam";
            case "H":
                return "Hindu";
            case "C":
                return "Kong Hu Chu";
            case "T":
                return "Kristen";
        }
        return "";
    }

    getEducationName(code: string) {
        switch (code.toUpperCase()) {
            case "1":
                return "S3";
            case "2":
                return "S2";
            case "3":
                return "S1 / D4";
            case "4":
                return "D3";
            case "5":
                return "D2";
            case "6":
                return "D1";
            case "7":
                return "SMU / SMK";
            case "8":
                return "SMP";
            case "9":
                return "SD";
            case "10":
                return "Belum Sekolah";
        }
        return "";
    }

    getMaritalStatus(code: string) {
        switch (code.toUpperCase()) {
            case "B":
                return "Belum Nikah";
            case "N":
                return "Nikah";
            case "D":
                return "Duda";
            case "J":
                return "Janda";
        }
        return "";
    }

    getHandling(code: string) {
        if (code !== null)
            switch (code.toUpperCase()) {
                case "1.":
                    return "Operasi";
                case "2.":
                    return "Periksa";
                case "3.":
                    return "Fisiotherapy";
                case "4.":
                    return "Biometri";
                case "5.":
                    return "Ganti Obat";
                case "6.":
                    return "Post Op 1 Minggu";
                case "7.":
                    return "Post Op 2 Minggu";
                case "8.":
                    return "Post Op 1 Bulan";
                case "9.":
                    return "Post Op 2 Bulan";
                case "10.":
                    return "Post Op 6 Bulan";
                case "11.":
                    return "Post Op 11 Bulan";
                case "12.":
                    return "Cek Lengkap";
            }
        return "";
    }

    async populateData(token: string): Promise<void> {
        const responseProvince = await axios.post(
            `${global.env.API_REFERENCE}/propinsi`,
            {},
            {
                headers: {
                    "x-token": token,
                    "Content-Type": "application/json",
                },
            }
        );

        if (responseProvince.data.metadata.code === "200") {
            const data: Array<any> = responseProvince.data.response.list || [];
            for (let i = 0; i < data.length; i++) {
                const provinceCode = data[i].kode;
                await this.client.hSet("Province", provinceCode, data[i].nama);

                const response = await axios.post(
                    `${global.env.API_REFERENCE}/kabupaten`,
                    {
                        kode_propinsi: provinceCode,
                    },
                    {
                        headers: {
                            "x-token": token,
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (response.data.metadata.code === "200") {
                    const dataCity: Array<any> = response.data.response.list || [];
                    for (let j = 0; j < dataCity.length; j++) {
                        const cityCode = dataCity[j].kode;
                        await this.client.hSet("City", `${provinceCode}:${dataCity[j].kode}`, dataCity[j].nama);
                        const response = await axios.post(
                            `${global.env.API_REFERENCE}/kecamatan`,
                            {
                                kode_kabupaten: cityCode,
                            },
                            {
                                headers: {
                                    "x-token": token,
                                    "Content-Type": "application/json",
                                },
                            }
                        );
                        if (response.data.metadata.code === "200") {
                            const dataDistrict: Array<any> = response.data.response.list || [];
                            for (let k = 0; k < dataDistrict.length; k++) {
                                await this.client.hSet("District", `${provinceCode}:${cityCode}:${dataDistrict[k].kode}`, dataDistrict[k].nama);
                            }
                        }
                    }
                }
            }
        }
    }

    async getHospitalCode(branchCode: string): Promise<string> {
        const hospitalCode = (await this.client.hGet("IndonesiaHospitalCode", branchCode)) || "";
        return hospitalCode;
    }

    async getProvinceName(code: string): Promise<string> {
        const provinceName = (await this.client.hGet("Province", code)) || "";
        return provinceName;
    }

    async getCityName(provinceCode: string, code: string): Promise<string> {
        const cityName = (await this.client.hGet("City", `${provinceCode}:${code}`)) || "";
        return cityName;
    }

    async getDistrictName(provinceCode: string, cityCode: string, code: string): Promise<string> {
        const cityName = (await this.client.hGet("District", `${provinceCode}:${cityCode}:${code}`)) || "";
        return cityName;
    }

    async getWordTemplate(branchCode: string, formName: string): Promise<string> {
        const result = await this.client.lPop(`WordTemplates:{${branchCode}}:${formName}`);
        return result;
    }

    async getAllWordTemplate(branchCode: string, formName: string): Promise<string> {
        const result = await this.client.lPopCount(`WordTemplates:{${branchCode}}:${formName}`, 1000);
        return result;
    }

    async addWordTemplate(branchCode: string, formName: string, docID: string): Promise<void> {
        await this.client.rPush(`WordTemplates:{${branchCode}}:${formName}`, docID);
    }

    async postRequestMRNotifications(ids: Array<string>, message: string): Promise<any> {
        for (let i = 0; i < ids.length; i += 1) {
            try {
                await axios.post(
                    `${process.env.PROD_URL}/smec-bot/api/sendTextMessage`,
                    {
                        user_id: ids[i],
                        message,
                        bot_id: 'smec_bot',
                    },
                    {
                        headers: {
                            'x-token': process.env.NOTIFICATION_TOKEN,
                            'Content-Type': 'application/json',
                        },
                    },
                )
            } catch (err) {
                return err;
            }
        }
    }
}

export { MedicalRecordService };
