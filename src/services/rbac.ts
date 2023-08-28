/* eslint-disable max-len */
/* eslint-disable no-tabs */
import { Request, Response, NextFunction } from "express";

import { RedisClientOptions, createClient } from "redis";

import * as jwt from "jsonwebtoken";

import _ from "lodash";

const util = require("util");
const { EventEmitter } = require("events");

const axios = require("axios");

// const jp = require('jsonpath');
const RBAC_REDIS_HOST = process.env.RBAC_REDIS_HOST || global.env.RBAC_REDIS_HOST || "localhost";
const RBAC_REDIS_PORT = process.env.RBAC_REDIS_PORT || global.env.RBAC_REDIS_PORT || 6789;
const RBAC_REDIS_USERNAME = process.env.RBAC_REDIS_USERNAME || global.env.RBAC_REDIS_USERNAME || "default";
const RBAC_REDIS_PASSWORD = process.env.RBAC_REDIS_PASSWORD || global.env.RBAC_REDIS_PASSWORD || "";
const SECRET_KEY = process.env.JWT_SECRET_KEY || global.env.JWT_SECRET_KEY || "";

// const agentInitialized = Symbol('GIC-RBACAgentInitialized');
class RBAC {
  // eslint-disable-next-line no-use-before-define
  private static instance: RBAC;

  private client: any;

  private isReady: boolean;

  private constructor() {
    const rbacConnectionString = `redis://${RBAC_REDIS_USERNAME}:${RBAC_REDIS_PASSWORD}@${RBAC_REDIS_HOST}:${RBAC_REDIS_PORT}`;
    this.client = createClient({ url: rbacConnectionString });
    this.isReady = false;
    this.client.on("error", (err: any) => {
      console.log("RBAC - Redis Client Error", err);
    });
    this.client.on('connect', () => {
        console.log('RBAC - Redis connected');
    });
    this.client.on('reconnecting', () => {
        console.log('RBAC - Redis reconnecting');
    });
    this.client.on('ready', () => {
        this.isReady = true;
        console.log('RBAC - Redis ready!');
    });
    // eslint-disable-next-line no-return-assign
  }

  public static getInstance(): RBAC {
    if (!RBAC.instance) {
      RBAC.instance = new RBAC();
    }

    return RBAC.instance;
  }

  // eslint-disable-next-line no-return-await
  public connect = async (): Promise<void> => await this.client.connect();

  private static ACTION = {
    READ: "tread",
    CREATE: "tcreate",
    UPDATE: "tupdate",
    DELETE: "tdelete",
  };

  // eslint-disable-next-line class-methods-use-this
  public getUserProfile = async (token: string, userId: string): Promise<any> => {
    var userProfile = await this.client.json.get(`user_profile:${userId}`, { path: '$' });
    if (userProfile == null) {
      const response = await axios.post(
        `${global.env.API_USER_PROFILE}`,
        {
          employee_id: userId,
        },
        {
          headers: {
            "x-token": token,
            "Content-Type": "application/json",
          },
        },
      );
      userProfile = {
        id: response.data.detail.id,
        nama: response.data.detail.nama,
        nik: response.data.detail.nik
      };
      await this.client.json.set(`user_profile:${userId}`, '$', userProfile);
      await this.client.expire(`user_profile:${userId}`, 86400);
      return userProfile;
    } else {
      return userProfile[0];
    }
  };

  public isUserAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers["x-token"] || req.body.xtoken;
    if (!token) {
      if (!res.finished)
        res.status(401).json({ message: "Header x-token must provided" }).send();
    } else {
      try {
        const payload = jwt.verify(token, SECRET_KEY) as any;
        // Check if token has expired
        if (payload === null || payload.exp < Date.now().valueOf() / 1000) {
          if (!res.finished)
            res.status(401).json({ error: "Token has expired, please re-login" });
          return;
        }
        if (payload && payload.user_id) {
          const sessionToken = await this.client.get(`session:${payload.user_id}`);
          if (token !== sessionToken) {
            if (!res.finished)
              res.status(401).json({ error: "Token has expired, please re-login" });
            return;
          }
          req.token = token;
          req.userId = payload.user_id;
          req.userProfile = await this.getUserProfile(token, payload.user_id);
          next();
        } else {
          if (!res.finished)
            res.status(401).json({ message: "Token invalid" }).send();
        }
      } catch (err) {
        if (!res.finished)
          res.status(401).json({ message: "Token invalid" }).send();
      }
    }
  };

  // eslint-disable-next-line class-methods-use-this
  public getParameters = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const searchMedicalRecord: ISearchMedicalRecordOptions = {
      Kode_Cabang: req.body && req.body.kode_cabang ? req.body.kode_cabang : "",
      Jenis_Pelayanan: req.body && req.body.jenis_pelayanan ? req.body.jenis_pelayanan : "",
      Tipe_Pasien: req.body && req.body.tipe_pasien ? req.body.tipe_pasien : "",
      No_MR: req.body && req.body.nomor_mr ? req.body.nomor_mr : "",
      ID_Pelayanan: req.body.id_pelayanan ? req.body.id_pelayanan.replace(/-/g, "_") : "",
      Tanggal_Masuk: req.body && req.body.tgl_mulai ? req.body.tgl_mulai : "",
      Tanggal_Keluar: req.body && req.body.tgl_selesai ? req.body.tgl_selesai : "",
      Options: {
        RETURN: ["$.ID_Pelayanan"],
        // RETURN: ['$.Pasien', '$.Wali','$.Rawat_Jalan', '$.Rawat_Inap']
      },
    };
    req.emrID = req.body && req.body.emr_id ? req.body.emr_id : "";
    req.emrParams = searchMedicalRecord;
    if (req.emrID != "") {
      req.emrParams.Kode_Cabang = req.emrID.substring(15, req.emrID.indexOf("}"));
    }
    next();
  };

  /*
	// eslint-disable-next-line no-tabs
	private static isUserAuthorized = function(action, resource) {
		return async function(req, res, next) {
			const modules = await reJSON.get('user_role:' + req.userId, '.modules');
			const value = jp.query(modules, '$[?(@.module_code=="' + resource + '")]')[0][action];
			if (value == true) {
				next();
			} else {
				res.status(401).json({ message: "User not authorized to " + action.substr(1) + " on " + resource }).send();
			}
		};
	}

	private static getRole = async function(userId) {
		const role = await reJSON.get('user_role:' + userId, '.role');
		return role;
	}

	private static getCompanyList = async function(userId) {
		const result = await reJSON.get('user_role:' + userId, '.company_list');
		return result;
	}

	private static isUserCompany = async function(userId, companyCode) {
		const index = await reJSON.arrindex('user_role:' + userId, '.company_list', '"' + companyCode + '"');
		if (index > -1)
			return true;
		return false;
	}

	private static getDivisionList = async function(userId) {
		const result = await reJSON.get('user_role:' + userId, '.divisi_list');
		return result;
	}

	private static isUserDivision = async function(userId, divisionCode) {
		const index = await reJSON.arrindex('user_role:' + userId, '.divisi_list', '"' + divisionCode + '"');
		if (index > -1)
			return true;
		return false;
	}

	private static getLocationList = async function(userId) {
		const result = await reJSON.get('user_role:' + userId, '.location_list');
		return result;
	}

	private static isUserLocation = async function(userId, locationCode) {
		const index = await reJSON.arrindex('user_role:' + userId, '.location_list', '"' + locationCode + '"');
		if (index > -1)
			return true;
		return false;
	}

	private static isAdminUser = async function(req, res, next) {
		console.log('isAdminUser');
		next();
	}
	*/
}

export default RBAC;
util.inherits(RBAC, EventEmitter);
