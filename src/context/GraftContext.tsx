import { createContext } from "react";
import { IGraftImpedanceType, IGraftState, IGrafType, INotification } from '../interfaces/interfaces';


export type GrafContextProps = {
  graftState: IGraftState;
  setNotification: (notification: INotification) => void;
  setSelectedFile: (selectedFileType: string) => void;
  setLoading: (loading: boolean) => void;
  setGraftType: (type: IGrafType) => void;
  setImpedanceType: (type: IGraftImpedanceType) => void;
  setStepBetweenPoints: (step: number) => void;
  setDrawerOpen: (open: boolean) => void;
}


export const GrafContext = createContext<GrafContextProps>({} as GrafContextProps);