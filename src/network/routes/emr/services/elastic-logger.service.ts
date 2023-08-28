const logger = require("winston").loggers.get("elasticsearch");
export class ElasticLoggerService {
  createHTTPResponse(request: any, response: any, responseCode: number, responseBody: any) {
    logger.info(`gic-emr-backend /api/emr${request.path}`, {
      service_name: global.env.APM_SERVICE_NAME,
      branch: request.emrParams && request.emrParams.Kode_Cabang ? request.emrParams.Kode_Cabang : "",
      environment: global.env.ENV,
      request: JSON.stringify(request.body),
      responseCode,
      response: JSON.stringify(responseBody),
    });
    // Don't send response if timeout have occurred
    if (!response.finished) response.status(responseCode).json(responseBody);
  }

  createLog(payload: any, routerName: string, message: string) {
    logger.info(`gic-emr-backend /api/emr${routerName}`, {
      service_name: global.env.APM_SERVICE_NAME,
      branch: payload.emrParams && payload.emrParams.Kode_Cabang ? payload.emrParams.Kode_Cabang : "",
      environment: global.env.ENV,
      request: JSON.stringify(payload.body),
      response: JSON.stringify({
        message,
        emr_id: payload.emrID ? payload.emrID : "",
      }),
    });
  }

  createHTTPErrorResponse(request: any, response: any, responseCode: number, responseBody: any, error: any) {
    logger.error(`gic-emr-backend /api/emr${request.path}`, {
      service_name: global.env.APM_SERVICE_NAME,
      branch: request.emrParams && request.emrParams.Kode_Cabang ? request.emrParams.Kode_Cabang : "",
      environment: global.env.ENV,
      request: JSON.stringify(request.body),
      responseCode,
      response: JSON.stringify({
        error,
        emr_id: request.emrID ? request.emrID : "",
      }),
    });
    // Don't send response if timeout have occurred
    if (!response.finished) response.status(responseCode).json(responseBody);
  }

  createErrorLog(payload: any, routerName: string, error: any) {
    logger.error(`gic-emr-backend /api/emr${routerName}`, {
      service_name: global.env.APM_SERVICE_NAME,
      branch: payload.emrParams && payload.emrParams.Kode_Cabang ? payload.emrParams.Kode_Cabang : "",
      environment: global.env.ENV,
      request: JSON.stringify(payload.body),
      response: JSON.stringify({
        error,
        emr_id: payload.emrID ? payload.emrID : "",
      }),
    });
  }
}
