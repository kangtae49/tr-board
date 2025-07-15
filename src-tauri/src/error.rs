use serde::{Deserialize, Serialize};
use specta::Type;
use thiserror::Error;

pub type Result<T> = std::result::Result<T, ApiError>;

#[derive(Type, Serialize, Deserialize, Error, Debug)]
pub enum ApiError {
    #[error("Error: {0}")]
    Error(String),

    #[error("IO error: {0}")]
    Io(String),

    #[error("Tokio error: {0}")]
    Tokio(String),
}

impl From<std::io::Error> for ApiError {
    fn from(e: std::io::Error) -> Self {
        ApiError::Io(e.to_string())
    }
}

impl From<tokio::sync::oneshot::error::RecvError> for ApiError {
    fn from(e: tokio::sync::oneshot::error::RecvError) -> Self {
        ApiError::Tokio(e.to_string())
    }
}