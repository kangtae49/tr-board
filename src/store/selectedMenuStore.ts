import { create } from "zustand";
import {Menu} from "@/api.ts";

export interface SelectedMenuStore {
  selectedMenu: Menu | undefined;
  setSelectedMenu: (selectedMenu: Menu | undefined) => void;
}

export const useSelectedMenuStore = create<SelectedMenuStore>((set) => ({
  selectedMenu: undefined,
  setSelectedMenu: (selectedMenu: Menu | undefined) => set({ selectedMenu }),
}));
