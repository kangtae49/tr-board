use std::path::absolute;
use std::sync::Arc;
use tokio::sync::{oneshot, Mutex};
use axum::{Router};
use serde::{Deserialize, Serialize};
use serde_with::{serde_as, skip_serializing_none};
use tower_http::services::ServeDir;
use tower_http::cors::{CorsLayer, Any};

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
    println!("run: {:?}", serv_info);
    let (tx, rx) = oneshot::channel();
    let (shutdown_tx, shutdown_rx) = oneshot::channel();

    let shared_shutdown_tx = Arc::new(Mutex::new(Some(shutdown_tx)));
    tokio::spawn(async move {

        let serv_path = absolute(serv_info.path).unwrap();
        println!("serv_path: {}", &serv_path.to_string_lossy().to_string());
        let abs = serv_path.to_string_lossy().to_string();
        let resource = abs.clone();
        let index_path = format!("{}/index.html", &abs);
        println!("index_path: {}", &index_path);

        let cors = CorsLayer::new()
            .allow_origin(Any)
            .allow_methods([http::Method::GET, http::Method::HEAD, http::Method::POST, http::Method::PUT, http::Method::DELETE]);

        let serv_dir = ServeDir::new(resource);
        let app = Router::new()
            // .route("/", get(move || async move {
            //     axum::response::Html(html)
            // }))
            .fallback_service(serv_dir)
            .layer(cors)
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
        shutdown_tx: shared_shutdown_tx
    })
}