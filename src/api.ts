import { invoke } from "@tauri-apps/api/core";
import {ServInfo} from "@/bindings"

export async function runHttpServer(servInfo: ServInfo): Promise<ServInfo> {
  return await invoke("run_http_server", { servInfo });
}

export async function getArgPath(): Promise<string> {
  return await invoke("get_arg_path");
}
