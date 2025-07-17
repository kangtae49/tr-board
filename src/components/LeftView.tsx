import {ReactElement, useEffect, useRef} from "react";
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window';
import {useSelectedMenuStore} from "@/store/selectedMenuStore.ts";
import LeftItemView from "@/components/LeftItemView.tsx";
import {useServInfoStore} from "@/store/servInfoStore.ts";
import {LeftItem} from '@/api'
import {useLeftItemsStore} from "@/store/leftItemsStore.ts";


function LeftView(): ReactElement {
  const listRef = useRef<List>(null)
  const servInfo = useServInfoStore((state) => state.servInfo);
  const selectedMenu = useSelectedMenuStore((state) => state.selectedMenu);
  const leftItems = useLeftItemsStore((state) => state.leftItems);
  const setLeftItems = useLeftItemsStore((state) => state.setLeftItems);
  useEffect(() => {
    if (selectedMenu && servInfo) {
      fetch(`http://localhost:${servInfo.port}/articles/${selectedMenu.menuId}.tsv`)
        .then((res) => res.text())
        .then((tsv) => {
          const leftItems = tsv.split('\n')
            .map((line) => {
              const [menuId, articleId, subject] = line.split('\t');
              return ({
                menuId,
                articleId,
                subject
              } as LeftItem)
            });
          setLeftItems(leftItems);
        })
    }
  }, [selectedMenu, servInfo]);
  return (
    <AutoSizer>
      {({ height, width }) => {
        console.log(width, height);
        return (
        <List
          className="left-list"
          itemSize={20}
          itemCount={leftItems.length}
          width={width}
          height={height}
          ref={listRef}
        >
          {({ index, style }) => {
            const leftItem = leftItems[index];
            return  (
              <LeftItemView key={index} style={style} leftItem={leftItem}/>
            )
          }}
        </List>
      )}}
    </AutoSizer>
  )
}

export default LeftView;
