// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
import {useEffect, useState} from "react";
import {runHttpServer, getArgPath} from "@/api"
import {ServInfo} from "@/bindings.ts";
import './App.css';
import { useServInfoStore } from "@/store/servInfoStore.ts";
import TopMenuView from "@/components/TopMenuView.tsx";
import {SplitPane} from "@rexxars/react-split-pane";
import LeftView from "@/components/LeftView.tsx";
import RightView from "@/components/RightView.tsx";

function App()  {
  const [isResizing, setIsResizing] = useState(false)
  const [servPath, setServPath] = useState<string | undefined>(undefined);

  const servInfo = useServInfoStore((state) => state.servInfo);
  const setServInfo = useServInfoStore((state) => state.setServInfo);

  useEffect(() => {
    getArgPath().then((path) => {
        setServPath(path);
      })
      .catch((_e) => {
        setServPath(".")
      })
  }, []);

  useEffect(() => {
    if (servPath) {
      runHttpServer({
        path: servPath,
        port: 0,
        ip: '127.0.0.1'
      }).then((servInfo) => {
        setServInfo(servInfo);
      });
    }
  }, [servPath]);

  useEffect(() => {
    if (servInfo) {
      fetch(`http://localhost:${servInfo.port}/menu/menu_26989041.json`)
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
        })
    }
  }, [servInfo]);

  return (
    servInfo &&
    <main className="container">
      <TopMenuView />
      <div className="main-pane">
          <SplitPane
              split="vertical"
              minSize={0}
              defaultSize={200}
              onDragStarted={() => setIsResizing(true)}
              onDragFinished={() => setIsResizing(false)}
              style={{ position: 'relative' }}
          >
              <div className="left-pane">
                  <LeftView />
              </div>
              <div style={{ position: 'relative', height: '100%' }}>
                {isResizing && <div className="iframe-overlay" />}
                  <div className="right-pane">
                      <RightView />
                  </div>
              </div>

          </SplitPane>
      </div>
    </main>
  )
}

export default App;
