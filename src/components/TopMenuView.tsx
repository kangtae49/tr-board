import {useEffect} from "react";
import {Menu} from "@/api";
import {useServInfoStore} from "@/store/servInfoStore.ts";
import {useMenusStore} from "@/store/menusStore.ts";
import {useSelectedMenuStore} from "@/store/selectedMenuStore.ts";

function TopMenuView() {
  const servInfo = useServInfoStore((state) => state.servInfo);
  const menus = useMenusStore((state) => state.menus);
  const setMenus = useMenusStore((state) => state.setMenus);
  const setSelectedMenu = useSelectedMenuStore((state) => state.setSelectedMenu);
  const selectedMenu = useSelectedMenuStore((state) => state.selectedMenu);

  const clickMenu = (menu: Menu) => {
    setSelectedMenu(menu);
  }

  useEffect(() => {
    if (servInfo) {
      fetch(`http://localhost:${servInfo.port}/menu/menu_26989041.json`)
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          const menus: Menu[] = json.result.menus.map((menu: Menu) => ({
            menuId: menu.menuId,
            name: menu.name,
            boardType: menu.boardType,
          }))
            .filter((menu: Menu) => menu.name && menu.boardType == 'L')
          ;
          setMenus(menus);
        })
    }
  }, []);
  return (
    <div className="menus">
      {menus.map((menu) => (
        <div className={`menu ${selectedMenu == menu ? 'active' : ''}`} key={menu.menuId} onClick={() => clickMenu(menu)}>{menu.name}</div>
      ))}
    </div>
  )
}

export default TopMenuView;