import {useEffect, useState} from "react";
// import reactLogo from "./assets/react.svg";
// import { invoke } from "@tauri-apps/api/core";
// import "./App.css";
import {runHttpServer} from "@/api"
import {ServInfo} from "@/bindings"

function App()  {
  const [servInfo, setServInfo] = useState<ServInfo | undefined>(undefined);

  // const run = async ():Promise<void> => {
  //   runHttpServer().then(setServInfo);
  // }

  useEffect(() => {
    runHttpServer().then(setServInfo);
  }, []);
  // const [greetMsg, setGreetMsg] = useState("");
  // const [name, setName] = useState("");
  //
  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  return (
    <main className="container">
      {
        servInfo && (
          <>
            <div><a href={`http://${servInfo.ip}:${servInfo.port}`} target="_blank">{servInfo.ip}:{servInfo.port}</a></div>
            <div>{servInfo.path}</div>
          </>
        )
      }
    </main>
  );
}

export default App;
