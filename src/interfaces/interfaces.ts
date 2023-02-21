type NotificationType = "error" | "warning" | "success" | "info" | null;

export interface INotification {
  title: string;
  content: string[];
  type: NotificationType;
}

interface IState {}

export interface IGraftState {
  notifications: INotification;
  state: IState;
  fileType: IFileType;
  loading: boolean;
  graftType: IGrafType;
  impedanceType: IGraftImpedanceType;
  stepBetweenPoints: IStepBetweenPoints;
  drawerOpen: boolean;
  csvFileColum: csvFileColum[];
  files: ProcessFile[];
  platform: IPlatform;
}

export type IPlatform = "web" | "desktop" | null;

export type IGrafType = "line" | "scatter";

export type IGraftImpedanceType = "Bode" | "Nyquist" | "ZiZrVsFreq";

export type IFileType = "teq4Z" | "teq4" | "csv";

export type IGraftData =
  | "IMPEDANCE_MODULE_FASE"
  | "IMPEDANCE_ZiZr"
  | "VC_V_vs_I"
  | "VC_t_vs_I";

export type IStepBetweenPoints = number;

export type File = {
  id: number;
  name: string;
  content: string | string[][];
  selected: boolean;
  columns?: string[];
  invariableContent?: string[][];
  selectedInvariableContentIndex?: number;
};

export type ExportData = {
  name: string;
  value: {
    Time?: number;
    Frequency?: number;
    Module?: number;
    Fase?: number;
    ZI?: number;
    ZR?: number;
  }[];
}[];

export type ProcessFile = {
  id: number;
  name: string;
  type: "teq4" | "teq4Z" | "csv";
  pointNumber?: number;
  content: string[][];
  selected: boolean;
  invariableContent?: string[][];
  selectedInvariableContentIndex?: number;
  impedance?: {
    V: number;
    signalAmplitude: number;
    sFrequency: number;
    eFrequency: number;
    totalPoints: number;
  };
  voltammeter?: {
    samplesSec: number;
    range: number;
    totalTime: number;
    cicles: number;
  };
  csv?: {
    columns: string[];
  };
};

export type Files = {
  files: File[];
};
export type csvFileColum = {
  id: number;
  fileName: string;
  selected: boolean;
  x?: columns;
  y?: columns;
  y2?: columns;
  notSelected?: columns;
};

export type columns = {
  name: string;
  index: number;
  color?: string;
}[];
