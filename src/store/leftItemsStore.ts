import { create } from "zustand";
import {LeftItem} from "@/api.ts";

export interface LeftItemsStore {
  leftItems: LeftItem [] | [];
  setLeftItems: (leftItems: LeftItem []) => void;
}

export const useLeftItemsStore = create<LeftItemsStore>((set) => ({
  leftItems: [],
  setLeftItems: (leftItems: LeftItem []) => set({ leftItems }),
}));
