import React from "react";
import {LeftItem} from "@/api.ts";
import {useSelectedLeftItemStore} from "@/store/selectedLeftItemStore.ts";

type Prop = {
  style: React.CSSProperties
  leftItem: LeftItem
}
function LeftItemView({style, leftItem}: Prop) {
  const selectedLeftItem = useSelectedLeftItemStore((state) => state.selectedLeftItem);
  const setSelectedLeftItem = useSelectedLeftItemStore((state) => state.setSelectedLeftItem);

  const clickLeftItem = (leftItem: LeftItem) => {
    setSelectedLeftItem(leftItem);
  }

  return (
    <div style={style} className={`left-item ${selectedLeftItem == leftItem ? "active" : ""}`} onClick={() => clickLeftItem(leftItem)}>{leftItem.subject}</div>
  )
}

export default LeftItemView;
