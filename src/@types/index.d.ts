/* eslint-disable no-var */
const { createLogger, format, transports } = require('winston');
const ecsFormat = require('@elastic/ecs-winston-format')
declare global {
	var env:any;
	var logger:any;
	var redis:any;
	var medicalRecord:any;
	var dicom:any;
	var storage:any;
	var agentInitialized:boolean;
	var messagingService: any;

	namespace Express {
		interface Request {
			userId: string,
			userProfile:any,
			token: string,
			emrID:String,
			emrParams: ISearchMedicalRecordOptions
		}
	}
}

export {}
