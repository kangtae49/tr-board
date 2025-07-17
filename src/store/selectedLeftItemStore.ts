import { create } from "zustand";
import {LeftItem} from "@/api.ts";

export interface SelectedLeftItemStore {
  selectedLeftItem: LeftItem | undefined;
  setSelectedLeftItem: (selectedLeftItem: LeftItem | undefined) => void;
}

export const useSelectedLeftItemStore = create<SelectedLeftItemStore>((set) => ({
  selectedLeftItem: undefined,
  setSelectedLeftItem: (selectedLeftItem: LeftItem | undefined) => set({ selectedLeftItem }),
}));
