import { create } from "zustand";
import { Menu } from "@/api.ts";

export interface MenusStore {
  menus: Menu[];
  setMenus: (menus: Menu[]) => void;
}

export const useMenusStore = create<MenusStore>((set) => ({
  menus: [],
  setMenus: (menus: Menu[]) => set({ menus }),
}));
