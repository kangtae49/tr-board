mod http_server;
mod error;

use std::sync::Arc;
use tauri::{AppHandle, Manager, State, Window};
use tauri_specta::{collect_commands, Builder};
use tokio::sync::{oneshot, Mutex, RwLock};
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use crate::error::{ Result };
use crate::http_server::{ServInfo};


#[derive(Clone)]
struct AppState {
    pub serv_info: Option<ServInfo>,
    pub shutdown_tx: Arc<Mutex<Option<oneshot::Sender<ServInfo>>>>,
}

#[tauri::command]
#[specta::specta]
async fn run_http_server(state: State<'_, Arc<RwLock<AppState>>>, serv_info: ServInfo) -> Result<ServInfo> {
    let handle = http_server::run(serv_info).await?;
    println!("{:?}", handle.serv_info.clone());
    let mut state = state.write().await;

    state.serv_info = Some(handle.serv_info.clone());
    state.shutdown_tx = handle.shutdown_tx;
    Ok(handle.serv_info)
}

// #[tauri::command]
// fn greet(name: &str) -> String {
//     format!("Hello, {}! You've been greeted from Rust!", name)
// }



#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    let builder = Builder::<tauri::Wry>::new().commands(collect_commands![
        // greet,
        run_http_server
    ]);

    #[cfg(debug_assertions)]
    {
        use specta_typescript::BigIntExportBehavior;
        use specta_typescript::Typescript;
        // use specta::{TypeCollection};

        let ts = Typescript::default().bigint(BigIntExportBehavior::Number);
        builder
            .export(ts, "../src/bindings.ts")
            .expect("Failed to export typescript bindings");

        // let mut types = TypeCollection::default();
        // types.register::<ServInfo>();
        // Typescript::default()
        //     .export_to("../src/bindings.ts", &types)
        //     .unwrap();
    }

    tauri::Builder::default()
        .manage(Arc::new(RwLock::new(AppState {
            serv_info: None,
            shutdown_tx: Arc::new(Mutex::new(None)),
            })))
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(builder.invoke_handler())
        .on_window_event( |window, event| match event {
            tauri::WindowEvent::CloseRequested{ .. } => {
                if let Some(state) = window.app_handle().try_state::<Arc<RwLock<AppState>>>() {
                    let state = Arc::clone(&state);
                    tauri::async_runtime::spawn(async move {
                        let app_state = state.read().await;
                        let shutdown_tx = app_state.shutdown_tx.clone();
                        let serv_info = app_state.serv_info.clone();
                        let mut shutdown_tx = shutdown_tx.lock().await;
                        if let Some(tx) = shutdown_tx.take() {
                            println!("take sender shutdown_tx: {:?}", &serv_info);
                            match serv_info {
                                Some(serv_info) => {
                                    println!("send shutdown: {:?}", &serv_info);
                                    let _ = tx.send(serv_info);
                                }
                                None => {}
                            }
                        }
                    });
                } else {

                }
            }
            _ => {},
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
