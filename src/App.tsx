// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
import {useEffect, useState} from "react";
import {runHttpServer, getArgPath} from "@/api"
import {ServInfo} from "@/bindings.ts";
import './App.css';

function App()  {
  const [servPath, setServPath] = useState<string | undefined>(undefined);
  const [servInfo, setServInfo] = useState<ServInfo | undefined>(undefined);

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
    <main className="container">
    </main>
  )
}

export default App;
