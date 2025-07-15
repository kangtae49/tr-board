use std::sync::Arc;
use tokio::sync::{oneshot, Mutex};
use axum::{Router, routing::get};
use serde::{Deserialize, Serialize};
use serde_with::{serde_as, skip_serializing_none};
use tower_http::services::ServeDir;
use specta::Type;
use crate::error::Result;


#[derive(Clone)]
pub struct HttpServerHandle {
    pub serv_info: ServInfo,
    pub shutdown_tx: Arc<Mutex<Option<oneshot::Sender<ServInfo>>>>,
}


#[skip_serializing_none]
#[serde_as]
#[derive(Type, Serialize, Deserialize, Clone, Debug, Default)]
pub struct ServInfo {
    ip: String,
    port: u16,
    path: String,
}

pub async fn run(serv_info: ServInfo) -> Result<HttpServerHandle> {
    let (tx, rx) = oneshot::channel();
    let (shutdown_tx, shutdown_rx) = oneshot::channel();

    let shutdown_tx = Arc::new(Mutex::new(Some(shutdown_tx)));
    let shutdown_rx = shutdown_rx;
    tokio::spawn(async move {
        let serv_path = std::fs::canonicalize(serv_info.path).unwrap();
        let abs = serv_path.to_string_lossy().to_string();
        let root = abs.clone();
        let resource = abs.clone();
        let app = Router::new()
            .route("/", get(move || async move { format!("{}", root) }))
            .fallback_service(ServeDir::new(resource))
            ;

        let listener = tokio::net::TcpListener::bind(format!("{}:{}", serv_info.ip, serv_info.port)).await.unwrap();
        let addr = listener.local_addr().unwrap();
        let _ = tx.send(ServInfo { ip: addr.ip().to_string(), port: addr.port(), path: abs.clone() });
        axum::serve(listener, app)
            .with_graceful_shutdown(async {
                match shutdown_rx.await {
                    Ok(serv_info) => {
                        println!("shutdown: {:?}", serv_info);
                    },
                    Err(e) => {

                        println!("shutdown: {:?}", e);
                    },
                }
            })
            .await
            .unwrap();
    });
    let ret = rx.await?;
    Ok(HttpServerHandle{
        serv_info: ret,
        shutdown_tx,
    })
}