import { RedisClientOptions, createClient } from "redis";
import { v4 as uuid } from "uuid";
import moment from "moment";
const fs = require("fs");
const short = require("short-uuid");
const sizeOf = require("image-size");
const google = require("@googleapis/healthcare");
const healthcare = google.healthcare({
  version: "v1",
  auth: new google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  }),
  headers: {
    Accept: "application/dicom+json",
  },
});

class DicomService {
  readonly prefix: string = "Dicom:";
  readonly DICOM_ORG_ROOT = "1.2.360.1";
  private client: any;
  private cloudRegion: string;
  private projectId: string;
  private datasetId: string;
  private ohifViewer: String;

  constructor(ohifViewer: string, cloudRegion: string, projectId: string, datasetId: string, options: RedisClientOptions) {
    this.ohifViewer = ohifViewer;
    this.cloudRegion = cloudRegion;
    this.projectId = projectId;
    this.datasetId = datasetId;
    this.client = createClient(options);
    this.client.on("error", (err: any) => console.log("Redis Client Error", err));
  }

  async connect() {
    await this.client.connect();
  }

  generateJSONMetadata(dicomMetadata: IDicomMetadata, width: number, height: number) {
    return [
      {
        "00020010": { vr: "UI", Value: ["1.2.840.10008.1.2.4.50"] },
        "00080005": { vr: "CS", Value: ["ISO_IR 192"] },
        "00080008": { vr: "CS", Value: ["ORIGINAL", "PRIMARY"] },
        "00080016": { vr: "UI", Value: [dicomMetadata.SOPClassUID] },
        "00080018": { vr: "UI", Value: [dicomMetadata.SOPInstanceUID] },
        "0020000D": { vr: "UI", Value: [dicomMetadata.StudyInstanceUID] },
        "0020000E": { vr: "UI", Value: [dicomMetadata.SeriesInstanceUID] },
        "00200013": { vr: "IS", Value: [1] },
        "00200011": { vr: "IS", Value: [1] },
        "00100020": { vr: "LO", Value: [dicomMetadata.PatientID] },
        "00100010": { vr: "PN", Value: [dicomMetadata.PatientName] },
        "00100030": { vr: "DA", Value: [dicomMetadata.PatientBirthDate] },
        "00100040": { vr: "CS", Value: [dicomMetadata.PatientSex] },
        "00100021": { vr: "LO", Value: [dicomMetadata.IssuerOfPatientID] },
        "00080080": { vr: "LO", Value: [dicomMetadata.InstitutionName] },
        "00200010": { vr: "SH", Value: [dicomMetadata.StudyID] },
        "00080020": { vr: "DA", Value: [dicomMetadata.StudyDate] },
        "00080023": { vr: "DA", Value: [dicomMetadata.StudyDate] },
        "00080030": { vr: "TM", Value: [dicomMetadata.StudyTime] },
        "00080033": { vr: "TM", Value: [dicomMetadata.StudyTime] },
        "00080021": { vr: "DA", Value: [dicomMetadata.SeriesDate] },
        "00080031": { vr: "TM", Value: [dicomMetadata.SeriesTime] },
        "0008103E": { vr: "LO", Value: [dicomMetadata.SeriesDescription] },
        "00080060": { vr: "CS", Value: [dicomMetadata.Modality] },
        "00081070": { vr: "PN", Value: [dicomMetadata.OperatorsName] },
        "00080090": { vr: "PN", Value: [dicomMetadata.ReferringPhysicianName] },
        "0040A491": { vr: "CS", Value: ["COMPLETE"] },
        "00280002": { vr: "US", Value: [3] },
        "00280004": { vr: "CS", Value: ["RGB"] },
        "00280006": { vr: "US", Value: [0] },
        "00280008": { vr: "IS", Value: [1] },
        "00280010": { vr: "US", Value: [height] },
        "00280011": { vr: "US", Value: [width] },
        "00280100": { vr: "US", Value: [8] },
        "00280101": { vr: "US", Value: [8] },
        "00280102": { vr: "US", Value: [7] },
        "00280103": { vr: "US", Value: [0] },
        "7FE00010": { vr: "OB", BulkDataURI: "jpeg-image" },
      },
    ];
  }

  generateBinaryData(metadata: Buffer, image: Buffer): Buffer {
    const openingFile = Buffer.from("--DICOMwebBoundary\r\nContent-Type: application/dicom+json\r\n\r\n");

    const middleFile = Buffer.from("\r\n--DICOMwebBoundary\r\nContent-Location: jpeg-image\r\nContent-Type: image/jpeg; transfer-syntax=1.2.840.10008.1.2.4.50\r\n\r\n");

    const closingFile = Buffer.from("\r\n--DICOMwebBoundary--");
    const requestBuffer = Buffer.concat([openingFile, metadata, middleFile, image, closingFile]);
    return requestBuffer;
  }

  generateNewUID(hospitalCode: string, tipe_pasien: string, no_berobat: string, unique: boolean): string {
    const now = moment();
    const decimalTranslator = short("0123456789");
    let dicomUid = `${this.DICOM_ORG_ROOT}.${hospitalCode}.${tipe_pasien === "UMUM" ? "1" : "2"}.${no_berobat}`;
    if (unique === true) {
      const zeroDate = `${now.month() + 1}.${now.date()}.${now.hour()}${now.minute()}${now.second()}${now.millisecond()}`;
      const guid = decimalTranslator.new();
      dicomUid += `.${zeroDate}.${guid}`;
    }
    return dicomUid.length > 45 ? dicomUid.substring(0, 45) : dicomUid;
  }

  async search(dicomStoreId: string, patientId: string, studyDate: string): Promise<any> {
    try {
      const parent = `projects/${this.projectId}/locations/${this.cloudRegion}/datasets/${this.datasetId}/dicomStores/${dicomStoreId}`;
      const dicomWebPath = `instances`;
      const request = { parent, dicomWebPath };
      //const params = { includefield: "all", PatientID: patientId, StudyDate: studyDate };
      //const params = { includefield: "all", PatientID: patientId };
      const params = { includefield: "all" };
      console.log(request);
      console.log(params);
      const studies = await healthcare.projects.locations.datasets.dicomStores.searchForInstances(request, {
        params,
        headers: { Accept: "application/dicom+json,multipart/related" },
      });
      console.log(`Found ${studies.data.length} instances:`);
      console.log(JSON.stringify(studies.data));
      const dicoms = [];
      let study: IDicomMetadata = {};
      for (let i = 0; i < studies.data.length; i++) {
        if (i === 0) {
          study = {
            StudyInstanceUID: studies.data[i]["0020000D"]["Value"][0],
            StudyDate: studies.data[i]["00080020"]["Value"][0],
            StudyTime: studies.data[i]["00080030"]["Value"][0],
            PatientName: studies.data[i]["00100010"]["Value"][0]["Alphabetic"],
            PatientID: studies.data[i]["00100020"]["Value"][0],
            AccessionNumber: "",
            PatientSex: studies.data[i]["00100040"]["Value"][0],
          };
        }
        const instanceMetadata: IDicomInstanceMetadata = {
          StudyInstanceUID: studies.data[i]["0020000D"]["Value"][0],
          SeriesInstanceUID: studies.data[i]["0020000E"]["Value"][0],
          SOPInstanceUID: studies.data[i]["00080018"]["Value"][0],
          Columns: studies.data[i]["00280011"]["Value"][0],
          Rows: studies.data[i]["00280010"]["Value"][0],
          InstanceNumber: 1,
          SOPClassUID: studies.data[i]["00080016"]["Value"][0],
          PlanarConfiguration: studies.data[i]["00280006"]["Value"][0],
          NumberOfFrames: studies.data[i]["00280008"]["Value"][0],
          BitsAllocated: studies.data[i]["00280100"]["Value"][0],
          BitsStored: studies.data[i]["00280101"]["Value"][0],
          HighBit: studies.data[i]["00280102"]["Value"][0],
          PixelRepresentation: studies.data[i]["00280103"]["Value"][0],
          Modality: studies.data[i]["00080060"]["Value"][0],
          WindowCenter: -600,
          WindowWidth: 1600,
          SeriesDate: studies.data[i]["00080020"]["Value"][0],
          ImageType: ["ORIGINAL", "PRIMARY", "AXIAL"],
        };
        if (studies.data[i]["00280004"]) instanceMetadata.PhotometricInterpretation = studies.data[i]["00280004"]["Value"][0];
        if (studies.data[i]["00280002"]) instanceMetadata.SamplesPerPixel = studies.data[i]["00280002"]["Value"][0];
        const instance: IDicomInstance = {
          metadata: instanceMetadata,
          url: `dicomweb:${this.ohifViewer}${dicomStoreId}/dicomWeb/studies/${instanceMetadata.StudyInstanceUID}/series/${instanceMetadata.SeriesInstanceUID}/instances/${instanceMetadata.SOPInstanceUID}`,
        };
        const series: IDicomMetadata = {
          SeriesInstanceUID: studies.data[i]["0020000E"]["Value"][0],
          SeriesNumber: 1,
          SliceThickness: 1,
          Modality: studies.data[i]["00080060"]["Value"][0],
          instances: [instance],
        };

        dicoms.push(series);
      }
      if (dicoms.length > 0) {
        study.series = dicoms;
        study.NumInstances = dicoms.length;
        study.Modalities = "DICOM";
      }
      return [study];
    } catch (err) {
      throw err;
    }
  }

  async uploadImageFile(dicomStoreId: string, dicomMetadata: IDicomMetadata, data: any): Promise<any> {
    try {
      const parent = `projects/${this.projectId}/locations/${this.cloudRegion}/datasets/${this.datasetId}/dicomStores/${dicomStoreId}`;
      const dicomWebPath = `studies`;
      const dimension = sizeOf(data);
      //console.log(JSON.stringify(this.generateJSONMetadata(dicomMetadata, dimension.width, dimension.height)));
      const metadata = Buffer.from(JSON.stringify(this.generateJSONMetadata(dicomMetadata, dimension.width, dimension.height)));

      const requestUpload = {
        parent,
        dicomWebPath,
        requestBody: this.generateBinaryData(metadata, data),
      };

      const instance = await healthcare.projects.locations.datasets.dicomStores.storeInstances(requestUpload, {
        headers: {
          "Content-Type": 'multipart/related; type="application/dicom+json"; boundary=DICOMwebBoundary',
          Accept: "application/dicom+json",
        },
      });
      console.log(instance);
      console.log("Stored DICOM instance:\n", JSON.stringify(instance.data));
      return instance.data;
    } catch (err) {
      throw err;
    }
  }

  async imageRendered(dicomStoreId: string, dicomMetadata: IDicomMetadata): Promise<any> {
    const parent = `projects/${this.projectId}/locations/${this.cloudRegion}/datasets/${this.datasetId}/dicomStores/${dicomStoreId}`;
    const dicomWebPath = `studies/${dicomMetadata.StudyInstanceUID}/series/${dicomMetadata.SeriesInstanceUID}/instances/${dicomMetadata.SOPInstanceUID}/rendered`;
    const request = { parent, dicomWebPath };
    try {
      const rendered = await healthcare.projects.locations.datasets.dicomStores.studies.series.instances.retrieveRendered(request, {
        headers: {
          Accept: "image/jpeg",
        },
        responseType: "arraybuffer",
      });
      return Buffer.from(rendered.data);
    } catch (err) {
      throw err;
    }
  }
  
  async metadata(dicomStoreId: string, dicomMetadata: IDicomMetadata): Promise<any> {
    const parent = `projects/${this.projectId}/locations/${this.cloudRegion}/datasets/${this.datasetId}/dicomStores/${dicomStoreId}`;
    const dicomWebPath = `studies/${dicomMetadata.StudyInstanceUID}/series/${dicomMetadata.SeriesInstanceUID}/instances/${dicomMetadata.SOPInstanceUID}/metadata`;
    const request = { parent, dicomWebPath };
    try {
      const rendered = await healthcare.projects.locations.datasets.dicomStores.studies.series.instances.retrieveMetadata(request);
      return rendered.data;
    } catch (err) {
      throw err;
    }
  }

  async download(dicomStoreId: string, dicomMetadata: IDicomMetadata): Promise<any> {
    const parent = `projects/${this.projectId}/locations/${this.cloudRegion}/datasets/${this.datasetId}/dicomStores/${dicomStoreId}`;
    const dicomWebPath = `studies/${dicomMetadata.StudyInstanceUID}/series/${dicomMetadata.SeriesInstanceUID}/instances/${dicomMetadata.SOPInstanceUID}`;
    const request = { parent, dicomWebPath };
    try {
      const rendered = await healthcare.projects.locations.datasets.dicomStores.studies.series.instances.retrieveInstance(request, {
        headers: {
          Accept: "application/dicom; transfer-syntax=*",
        },
        responseType: "arraybuffer",
      });
      return Buffer.from(rendered.data);
    } catch (err) {
      throw err;
    }
  }

  async delete(dicomStoreId: string, studyUid: string, seriesUid: string, instanceUid: string): Promise<any> {
    const parent = `projects/${this.projectId}/locations/${this.cloudRegion}/datasets/${this.datasetId}/dicomStores/${dicomStoreId}`;
    const dicomWebPath = `studies/${studyUid}/series/${seriesUid}/instances/${instanceUid}`;
    const request = { parent, dicomWebPath };
    try {
      const response = await healthcare.projects.locations.datasets.dicomStores.studies.series.instances.delete(request);
      return response;
    } catch (err) {
      console.log('err', err);
      throw err;
    }
  }

  getUrl(dicomStoreId: string, studyUid: string) {
    return `${this.ohifViewer}?StudyInstanceUIDs=${studyUid}&BranchCode=${dicomStoreId}`;
  }
}

export { DicomService };
