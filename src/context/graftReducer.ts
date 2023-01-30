import {
  IGraftState,
  INotification,
  IFileType,
  IGrafType,
  IGraftImpedanceType,
  IStepBetweenPoints,
  csvFileColum,
} from "../interfaces/interfaces";

type GraftAction = {
  type:
    | "setNotification"
    | "setFileType"
    | "setLoading"
    | "setGraftType"
    | "setImpedanceType"
    | "setStepBetweenPoints"
    | "setDrawerOpen"
    | "setSelectedColumns";
  payload:
    | INotification
    | IFileType
    | boolean
    | IGrafType
    | IGraftImpedanceType
    | IStepBetweenPoints
    | boolean
    | csvFileColum[];
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
    case "setLoading":
      return {
        ...state,
        loading: action.payload as boolean,
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
    default:
      return state;
  }
};
