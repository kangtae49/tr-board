import { create } from "zustand";
import { ServInfo} from "@/bindings.ts";

export interface ServInfoStore {
  servInfo: ServInfo | undefined;
  setServInfo: (servInfo: ServInfo | undefined) => void;
}

export const useServInfoStore = create<ServInfoStore>((set) => ({
  servInfo: undefined,
  setServInfo: (servInfo: ServInfo | undefined) => set({ servInfo }),
}));
