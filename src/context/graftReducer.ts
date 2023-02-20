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
    | "setGraftState"
    | "updateFile"
    | "updateCSVfileColumn";
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
    | IGraftState
    | ProcessFile
    | csvFileColum;
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
    case "updateFile": {
      const files = state.files.map((file) => {
        if (file.id === (action.payload as ProcessFile).id) {
          return action.payload as ProcessFile;
        }
        return file;
      });
      return {
        ...state,
        files,
      };
    }
    case "updateCSVfileColumn": {
      const csvFileColum = state.csvFileColum.map((column) => {
        if (column.id === (action.payload as csvFileColum).id) {
          return action.payload as csvFileColum;
        }
        return column;
      });
      return {
        ...state,
        csvFileColum,
      };
    }

    default:
      return state;
  }
};
