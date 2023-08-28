import { isValidFile } from "../../helpers/app.helper";
import { IRefraksiOptisiData, IRefraksiOptisiKMB, IRefraksiOptisiKML, IRefraksiOptisiKoreksi1, IRefraksiOptisiKoreksi2, IRefraksiOptisiRPL, IRefraksiOptisiRPLStreak } from "../ro.model";
import { IUpdateROPengkajianAwal } from "./ro.request";

export class PengkajianAwalRO {
  static createFromJson(json: any) {
    const OD: IRefraksiOptisiData = {
      PH: json["od-ph"],
      VA: json["od-va"],
      Add: json["od-add"],
      False: json["od-false"],
      Jagger: json["od-jagger"],
      Schiotz: json["od-schiotz"],
      Non_Contact: json["od-non-contact"],
      Tanam_Lensa: json["od-tanam-lensa"],
      Keterangan_Tono: json['od-keterangan-tono'],
    };
    const OS: IRefraksiOptisiData = {
      PH: json["os-ph"],
      VA: json["os-va"],
      Add: json["os-add"],
      False: json["os-false"],
      Jagger: json["os-jagger"],
      Schiotz: json["os-schiotz"],
      Non_Contact: json["os-non-contact"],
      Tanam_Lensa: json["os-tanam-lensa"],
      Keterangan_Tono: json['os-keterangan-tono'],
    };
    let OD_KML: IRefraksiOptisiKML = {
      VA: "",
      Add: "",
      Cyl: "",
      Sph: "",
      Axis: "",
      False: "",
      Jagger: "",
      Select: "",
      Pd_Jauh: "",
      Pd_Dekat: "",
    };
    if (json["od-kml-select"] === "on") {
      OD_KML = {
        VA: json["od-kml-va"],
        Add: json["od-kml-add"],
        Cyl: json["od-kml-cyl"],
        Sph: json["od-kml-sph"],
        Axis: json["od-kml-axis"],
        False: json["od-kml-false"],
        Jagger: json["od-kml-jagger"],
        Select: json["od-kml-select"],
        Pd_Jauh: json["od-kml-pd-jauh"],
        Pd_Dekat: json["od-kml-pd-dekat"],
      };
    }
    OD.KML = OD_KML;

    let OS_KML: IRefraksiOptisiKML = {
      VA: "",
      Add: "",
      Cyl: "",
      Sph: "",
      Axis: "",
      False: "",
      Jagger: "",
      Select: "",
      Pd_Jauh: "",
      Pd_Dekat: "",
    };
    if (json["os-kml-select"] === "on") {
      OS_KML = {
        VA: json["os-kml-va"],
        Add: json["os-kml-add"],
        Cyl: json["os-kml-cyl"],
        Sph: json["os-kml-sph"],
        Axis: json["os-kml-axis"],
        False: json["os-kml-false"],
        Jagger: json["os-kml-jagger"],
        Select: json["os-kml-select"],
        Pd_Jauh: json["os-kml-pd-jauh"],
        Pd_Dekat: json["os-kml-pd-dekat"],
      };
    }
    OS.KML = OS_KML;
    // End: KML

    // Begin: Koreksi 1
    let OD_Koreksi_1: IRefraksiOptisiKoreksi1 = {
      VA: "",
      Add: "",
      Cyl: "",
      Sph: "",
      Axis: "",
      False: "",
      Jagger: "",
      Select: "",
      Pd_Jauh: "",
      Pd_Dekat: "",
      Adaptasi: "",
    };
    if (json["od-koreksi-1-select"] === "on") {
      OD_Koreksi_1 = {
        VA: json["od-koreksi-1-va"],
        Add: json["od-koreksi-1-add"],
        Cyl: json["od-koreksi-1-cyl"],
        Sph: json["od-koreksi-1-sph"],
        Axis: json["od-koreksi-1-axis"],
        False: json["od-koreksi-1-false"],
        Jagger: json["od-koreksi-1-jagger"],
        Select: json["od-koreksi-1-select"],
        Pd_Jauh: json["od-koreksi-1-pd-jauh"],
        Pd_Dekat: json["od-koreksi-1-pd-dekat"],
        Adaptasi: json["od-koreksi-1-adaptasi"],
      };
    }
    OD.Koreksi_1 = OD_Koreksi_1;

    let OS_Koreksi_1: IRefraksiOptisiKoreksi1 = {
      VA: "",
      Add: "",
      Cyl: "",
      Sph: "",
      Axis: "",
      False: "",
      Jagger: "",
      Select: "",
      Pd_Jauh: "",
      Pd_Dekat: "",
      Adaptasi: "",
    };
    if (json["os-koreksi-1-select"] === "on") {
      OS_Koreksi_1 = {
        VA: json["os-koreksi-1-va"],
        Add: json["os-koreksi-1-add"],
        Cyl: json["os-koreksi-1-cyl"],
        Sph: json["os-koreksi-1-sph"],
        Axis: json["os-koreksi-1-axis"],
        False: json["os-koreksi-1-false"],
        Jagger: json["os-koreksi-1-jagger"],
        Select: json["os-koreksi-1-select"],
        Pd_Jauh: json["os-koreksi-1-pd-jauh"],
        Pd_Dekat: json["os-koreksi-1-pd-dekat"],
        Adaptasi: json["os-koreksi-1-adaptasi"],
      };
    }
    OS.Koreksi_1 = OS_Koreksi_1;
    // End: Koreksi 1

    // Begin: Koreksi 2
    let OD_Koreksi_2: IRefraksiOptisiKoreksi2 = {
      VA: "",
      Add: "",
      Cyl: "",
      Sph: "",
      Axis: "",
      False: "",
      Jagger: "",
      Select: "",
      Pd_Jauh: "",
      Pd_Dekat: "",
      Adaptasi: "",
    };
    if (json["od-koreksi-2-select"] === "on") {
      OD_Koreksi_2 = {
        VA: json["od-koreksi-2-va"],
        Add: json["od-koreksi-2-add"],
        Cyl: json["od-koreksi-2-cyl"],
        Sph: json["od-koreksi-2-sph"],
        Axis: json["od-koreksi-2-axis"],
        False: json["od-koreksi-2-false"],
        Jagger: json["od-koreksi-2-jagger"],
        Select: json["od-koreksi-2-select"],
        Pd_Jauh: json["od-koreksi-2-pd-jauh"],
        Pd_Dekat: json["od-koreksi-2-pd-dekat"],
        Adaptasi: json["od-koreksi-2-adaptasi"],
      };
    }
    OD.Koreksi_2 = OD_Koreksi_2;

    let OS_Koreksi_2: IRefraksiOptisiKoreksi2 = {
      VA: "",
      Add: "",
      Cyl: "",
      Sph: "",
      Axis: "",
      False: "",
      Jagger: "",
      Select: "",
      Pd_Jauh: "",
      Pd_Dekat: "",
      Adaptasi: "",
    };
    if (json["os-koreksi-2-select"] === "on") {
      OS_Koreksi_2 = {
        VA: json["os-koreksi-2-va"],
        Add: json["os-koreksi-2-add"],
        Cyl: json["os-koreksi-2-cyl"],
        Sph: json["os-koreksi-2-sph"],
        Axis: json["os-koreksi-2-axis"],
        False: json["os-koreksi-2-false"],
        Jagger: json["os-koreksi-2-jagger"],
        Select: json["os-koreksi-2-select"],
        Pd_Jauh: json["os-koreksi-2-pd-jauh"],
        Pd_Dekat: json["os-koreksi-2-pd-dekat"],
        Adaptasi: json["os-koreksi-2-adaptasi"],
      };
    }
    OS.Koreksi_2 = OS_Koreksi_2;
    // End: Koreksi 2

    // Begin: KMB
    let OD_KMB: IRefraksiOptisiKMB = {
      VA: "",
      Add: "",
      Cyl: "",
      Sph: "",
      Axis: "",
      False: "",
      Jagger: "",
      Select: "",
      Pd_Jauh: "",
      Pd_Dekat: "",
    };
    if (json["od-kmb-select"] === "on") {
      OD_KMB = {
        VA: json["od-kmb-va"],
        Add: json["od-kmb-add"],
        Cyl: json["od-kmb-cyl"],
        Sph: json["od-kmb-sph"],
        Axis: json["od-kmb-axis"],
        False: json["od-kmb-false"],
        Jagger: json["od-kmb-jagger"],
        Select: json["od-kmb-select"],
        Pd_Jauh: json["od-kmb-pd-jauh"],
        Pd_Dekat: json["od-kmb-pd-dekat"],
      };
    }
    OD.KMB = OD_KMB;

    let OS_KMB: IRefraksiOptisiKMB = {
      VA: "",
      Add: "",
      Cyl: "",
      Sph: "",
      Axis: "",
      False: "",
      Jagger: "",
      Select: "",
      Pd_Jauh: "",
      Pd_Dekat: "",
    };
    if (json["os-kmb-select"] === "on") {
      OS_KMB = {
        VA: json["os-kmb-va"],
        Add: json["os-kmb-add"],
        Cyl: json["os-kmb-cyl"],
        Sph: json["os-kmb-sph"],
        Axis: json["os-kmb-axis"],
        False: json["os-kmb-false"],
        Jagger: json["os-kmb-jagger"],
        Select: json["os-kmb-select"],
        Pd_Jauh: json["os-kmb-pd-jauh"],
        Pd_Dekat: json["os-kmb-pd-dekat"],
      };
    }
    OS.KMB = OS_KMB;
    // End: KMB

    // Begin: RPL
    let OD_RPL: IRefraksiOptisiRPL = {
      VA: "",
      Add: "",
      Cyl: "",
      Sph: "",
      Axis: "",
      False: "",
      Jagger: "",
      Select: "",
      Pd_Jauh: "",
      Pd_Dekat: "",
      Adaptasi: "",
      Va_Aquity: '',
      PH: '',
    };
    if (json["od-rpl-select"] === "on") {
      OD_RPL = {
        VA: json["od-rpl-va"],
        Add: json["od-rpl-add"],
        Cyl: json["od-rpl-cyl"],
        Sph: json["od-rpl-sph"],
        Axis: json["od-rpl-axis"],
        False: json["od-rpl-false"],
        Jagger: json["od-rpl-jagger"],
        Select: json["od-rpl-select"],
        Pd_Jauh: json["od-rpl-pd-jauh"],
        Pd_Dekat: json["od-rpl-pd-dekat"],
        Adaptasi: json["od-rpl-adaptasi"],
        Va_Aquity: json['od-rpl-va-aquity'],
        PH: json['od-rpl-ph'],
      };
    }
    OD.RPL = OD_RPL;

    let OS_RPL: IRefraksiOptisiRPL = {
      VA: "",
      Add: "",
      Cyl: "",
      Sph: "",
      Axis: "",
      False: "",
      Jagger: "",
      Select: "",
      Pd_Jauh: "",
      Pd_Dekat: "",
      Adaptasi: "",
      Va_Aquity: '',
      PH: '',
    };
    if (json["os-rpl-select"] === "on") {
      OS_RPL = {
        VA: json["os-rpl-va"],
        Add: json["os-rpl-add"],
        Cyl: json["os-rpl-cyl"],
        Sph: json["os-rpl-sph"],
        Axis: json["os-rpl-axis"],
        False: json["os-rpl-false"],
        Jagger: json["os-rpl-jagger"],
        Select: json["os-rpl-select"],
        Pd_Jauh: json["os-rpl-pd-jauh"],
        Pd_Dekat: json["os-rpl-pd-dekat"],
        Adaptasi: json["os-rpl-adaptasi"],
        Va_Aquity: json['os-rpl-va-aquity'],
        PH: json['os-rpl-ph'],
      };
    }
    OS.RPL = OS_RPL;
    // End: RPL

    // Begin: RPL_Streak
    // eslint-disable-next-line camelcase
    let OD_RPL_Streak: IRefraksiOptisiRPLStreak = {
      VA: "",
      Add: "",
      Cyl: "",
      Sph: "",
      Axis: "",
      False: "",
      Jagger: "",
      Select: "",
      Pd_Jauh: "",
      Pd_Dekat: "",
      Adaptasi: "",
      Va_Aquity: '',
      PH: '',
    };
    if (json["od-rpl-streak-select"] === "on") {
      OD_RPL_Streak = {
        VA: json["od-rpl-streak-va"],
        Add: json["od-rpl-streak-add"],
        Cyl: json["od-rpl-streak-cyl"],
        Sph: json["od-rpl-streak-sph"],
        Axis: json["od-rpl-streak-axis"],
        False: json["od-rpl-streak-false"],
        Jagger: json["od-rpl-streak-jagger"],
        Select: json["od-rpl-streak-select"],
        Pd_Jauh: json["od-rpl-streak-pd-jauh"],
        Pd_Dekat: json["od-rpl-streak-pd-dekat"],
        Adaptasi: json['od-rpl-streak-adaptasi'],
        Va_Aquity: json['od-rpl-streak-va-aquity'],
        PH: json['od-rpl-streak-ph'],
      };
    }
    OD.RPL_Streak = OD_RPL_Streak;

    let OS_RPL_Streak: IRefraksiOptisiRPLStreak = {
      VA: "",
      Add: "",
      Cyl: "",
      Sph: "",
      Axis: "",
      False: "",
      Jagger: "",
      Select: "",
      Pd_Jauh: "",
      Pd_Dekat: "",
      Adaptasi: "",
      Va_Aquity: '',
      PH: '',
    };
    if (json["os-rpl-streak-select"] === "on") {
      OS_RPL_Streak = {
        VA: json["os-rpl-streak-va"],
        Add: json["os-rpl-streak-add"],
        Cyl: json["os-rpl-streak-cyl"],
        Sph: json["os-rpl-streak-sph"],
        Axis: json["os-rpl-streak-axis"],
        False: json["os-rpl-streak-false"],
        Jagger: json["os-rpl-streak-jagger"],
        Select: json["os-rpl-streak-select"],
        Pd_Jauh: json["os-rpl-streak-pd-jauh"],
        Pd_Dekat: json["os-rpl-streak-pd-dekat"],
        Adaptasi: json['os-rpl-streak-adaptasi'],
        Va_Aquity: json['os-rpl-streak-va-aquity'],
        PH: json['os-rpl-streak-ph'],
      };
    }
    // eslint-disable-next-line camelcase
    OS.RPL_Streak = OS_RPL_Streak;
    // End: RPL_Streak

    // Begin: RPL2
    let OD_RPL_2: IRefraksiOptisiRPL = {
      VA: "",
      Add: "",
      Cyl: "",
      Sph: "",
      Axis: "",
      False: "",
      Jagger: "",
      Select: "",
      Pd_Jauh: "",
      Pd_Dekat: "",
      Adaptasi: "",
      Va_Aquity: '',
      PH: '',
    }
    if (json['od-rpl-2-select']) {
      OD_RPL_2 = {
        VA: json["od-rpl-2-va"],
        Add: json["od-rpl-2-add"],
        Cyl: json["od-rpl-2-cyl"],
        Sph: json["od-rpl-2-sph"],
        Axis: json["od-rpl-2-axis"],
        False: json["od-rpl-2-false"],
        Jagger: json["od-rpl-2-jagger"],
        Select: json["od-rpl-2-select"],
        Pd_Jauh: json["od-rpl-2-pd-jauh"],
        Pd_Dekat: json["od-rpl-2-pd-dekat"],
        Adaptasi: json["od-rpl-2-adaptasi"],
        Va_Aquity: json['od-rpl-2-va-aquity'],
        PH: json['od-rpl-2-ph'],
      };
    }
    OD.RPL_2 = OD_RPL_2

    let OS_RPL_2: IRefraksiOptisiRPL = {
      VA: "",
      Add: "",
      Cyl: "",
      Sph: "",
      Axis: "",
      False: "",
      Jagger: "",
      Select: "",
      Pd_Jauh: "",
      Pd_Dekat: "",
      Adaptasi: "",
      Va_Aquity: '',
      PH: '',
    }
    if (json['os-rpl-2-select']) {
      OS_RPL_2 = {
        VA: json["os-rpl-2-va"],
        Add: json["os-rpl-2-add"],
        Cyl: json["os-rpl-2-cyl"],
        Sph: json["os-rpl-2-sph"],
        Axis: json["os-rpl-2-axis"],
        False: json["os-rpl-2-false"],
        Jagger: json["os-rpl-2-jagger"],
        Select: json["os-rpl-2-select"],
        Pd_Jauh: json["os-rpl-2-pd-jauh"],
        Pd_Dekat: json["os-rpl-2-pd-dekat"],
        Adaptasi: json["os-rpl-2-adaptasi"],
        Va_Aquity: json['os-rpl-2-va-aquity'],
        PH: json['os-rpl-2-ph'],
      };
    }
    OS.RPL_2 = OS_RPL_2
    // End: RPL2

    // Begin: RPL Streak 2
    let OD_RPL_Streak_2: IRefraksiOptisiRPLStreak = {
      VA: "",
      Add: "",
      Cyl: "",
      Sph: "",
      Axis: "",
      False: "",
      Jagger: "",
      Select: "",
      Pd_Jauh: "",
      Pd_Dekat: "",
      Adaptasi: "",
      Va_Aquity: '',
      PH: '',
    };
    if (json["od-rpl-streak-2-select"] === "on") {
      OD_RPL_Streak_2 = {
        VA: json["od-rpl-streak-2-va"],
        Add: json["od-rpl-streak-2-add"],
        Cyl: json["od-rpl-streak-2-cyl"],
        Sph: json["od-rpl-streak-2-sph"],
        Axis: json["od-rpl-streak-2-axis"],
        False: json["od-rpl-streak-2-false"],
        Jagger: json["od-rpl-streak-2-jagger"],
        Select: json["od-rpl-streak-2-select"],
        Pd_Jauh: json["od-rpl-streak-2-pd-jauh"],
        Pd_Dekat: json["od-rpl-streak-2-pd-dekat"],
        Adaptasi: json['od-rpl-streak-2-adaptasi'],
        Va_Aquity: json['od-rpl-streak-2-va-aquity'],
        PH: json['od-rpl-streak-2-ph'],
      };
    }
    OD.RPL_Streak_2 = OD_RPL_Streak_2;

    let OS_RPL_Streak_2: IRefraksiOptisiRPLStreak = {
      VA: "",
      Add: "",
      Cyl: "",
      Sph: "",
      Axis: "",
      False: "",
      Jagger: "",
      Select: "",
      Pd_Jauh: "",
      Pd_Dekat: "",
      Adaptasi: "",
      Va_Aquity: '',
      PH: '',
    };
    if (json["os-rpl-streak-2-select"] === "on") {
      OS_RPL_Streak_2 = {
        VA: json["os-rpl-streak-2-va"],
        Add: json["os-rpl-streak-2-add"],
        Cyl: json["os-rpl-streak-2-cyl"],
        Sph: json["os-rpl-streak-2-sph"],
        Axis: json["os-rpl-streak-2-axis"],
        False: json["os-rpl-streak-2-false"],
        Jagger: json["os-rpl-streak-2-jagger"],
        Select: json["os-rpl-streak-2-select"],
        Pd_Jauh: json["os-rpl-streak-2-pd-jauh"],
        Pd_Dekat: json["os-rpl-streak-2-pd-dekat"],
        Adaptasi: json['os-rpl-streak-2-adaptasi'],
        Va_Aquity: json['os-rpl-streak-2-va-aquity'],
        PH: json['os-rpl-streak-2-ph'],
      };
    }
    OS.RPL_Streak_2 = OS_RPL_Streak_2;
    // End: RPL Streak 2

    return {
      OD,
      OS,
      ID_Petugas_RO: json["id-petugas-ro"],
      TTD_Petugas_RO: (json["ttd-petugas-ro"] && json["ttd-petugas-ro"] !== '' && isValidFile(json["ttd-petugas-ro"])) ? global.storage.cleanUrl(json["ttd-petugas-ro"]) : '',
      Catatan_Lain: json["catatan-lain"],
      Diagnosa: json.diagnosa ? json.diagnosa : null,
      Terapi: json.terapi ? json.terapi : null,
      Anjuran: json.anjuran ? json.anjuran : null,
      TTD_Pasien: (json["ttd-pasien"] && json["ttd-pasien"] !== '' && isValidFile(json["ttd-pasien"])) ? global.storage.cleanUrl(json["ttd-pasien"]) : '',
    }
  }
}
