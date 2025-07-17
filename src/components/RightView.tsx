import {ReactElement, useEffect, useState} from "react";
import {useSelectedMenuStore} from "@/store/selectedMenuStore.ts";
import {useServInfoStore} from "@/store/servInfoStore.ts";
import {useSelectedLeftItemStore} from "@/store/selectedLeftItemStore.ts";


function RightView(): ReactElement {
  const servInfo = useServInfoStore((state) => state.servInfo);
  const selectedMenu = useSelectedMenuStore((state) => state.selectedMenu);
  const selectedLeftItem = useSelectedLeftItemStore((state) => state.selectedLeftItem);
  const [article, setArticle] = useState(undefined);
  useEffect(() => {
    if (selectedMenu && selectedLeftItem && servInfo) {
      fetch(`http://localhost:${servInfo.port}/article/${selectedMenu.menuId}/${selectedLeftItem.menuId}_${selectedLeftItem.articleId}.json`)
        .then((res) => res.json())
        .then((json) => {
          setArticle(json.result);
        })
    }
  }, [selectedMenu, selectedLeftItem, servInfo]);
  return (
    <div>
    { article && (
      <>
        <h2 className="subject">{article["article"]["subject"]}</h2>
        <div className="contentHtml" dangerouslySetInnerHTML={{ __html: article["article"]["contentHtml"] }}></div>
      </>
    )}
    </div>
  )
}

export default RightView;
