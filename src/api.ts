import { invoke } from "@tauri-apps/api/core";
import {ServInfo} from "@/bindings"

export async function runHttpServer(): Promise<ServInfo> {
  return await invoke("run_http_server", { servInfo: { ip: "127.0.0.1", port: 0, path: "." } });
}
