type NotificationType = "Error" | "Warning" | "Success" | "Info" | null;

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
}

export type IGrafType = "line" | "scatter";

export type IGraftImpedanceType = "Bode" | "Nyquist" | "ZiZrVsFreq";

export type IFileType = "teq4Z" | "teq4";

export type IGraftData =
  | "IMPEDANCE_MODULE_FASE"
  | "IMPEDANCE_ZiZr"
  | "VC_V_vs_I"
  | "VC_t_vs_I";
