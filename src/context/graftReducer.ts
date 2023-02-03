import {
  IGraftState,
  INotification,
  IFileType,
  IGrafType,
  IGraftImpedanceType,
  IStepBetweenPoints,
  csvFileColum,
  ProcessFile,
} from "../interfaces/interfaces";

type GraftAction = {
  type:
    | "setNotification"
    | "setFileType"
    | "setGraftType"
    | "setImpedanceType"
    | "setStepBetweenPoints"
    | "setDrawerOpen"
    | "setSelectedColumns"
    | "setFiles"
    | "setGraftState";
  payload:
    | INotification
    | IFileType
    | boolean
    | IGrafType
    | IGraftImpedanceType
    | IStepBetweenPoints
    | boolean
    | csvFileColum[]
    | ProcessFile[]
    | IGraftState;
};

export const graftReducer = (
  state: IGraftState,
  action: GraftAction
): IGraftState => {
  switch (action.type) {
    case "setNotification":
      return {
        ...state,
        notifications: action.payload as INotification,
      };
    case "setFileType":
      return {
        ...state,
        fileType: action.payload as IFileType,
      };
    case "setGraftType":
      return {
        ...state,
        graftType: action.payload as IGrafType,
      };
    case "setImpedanceType":
      return {
        ...state,
        impedanceType: action.payload as IGraftImpedanceType,
      };
    case "setStepBetweenPoints":
      return {
        ...state,
        stepBetweenPoints: action.payload as IStepBetweenPoints,
      };
    case "setDrawerOpen":
      return {
        ...state,
        drawerOpen: action.payload as boolean,
      };
    case "setSelectedColumns":
      return {
        ...state,
        csvFileColum: action.payload as csvFileColum[],
      };
    case "setFiles":
      return {
        ...state,
        files: action.payload as ProcessFile[],
      };

    case "setGraftState":
      return {
        ...state,
        ...(action.payload as IGraftState),
      };

    default:
      return state;
  }
};
