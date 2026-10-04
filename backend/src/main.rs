use axum::{
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::env;
use tiberius::{AuthMethod, Client, Config};
use tokio::net::TcpStream;
use tokio_util::compat::TokioAsyncWriteCompatExt;
use tower_http::cors::CorsLayer;

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct SensorData {
    pub device_id: String,
    pub temperature: f32,
    pub humidity: f32,
    pub mq1: f32,
    pub mq2: f32,
    pub mq3: f32,
    pub mq4: f32,
    pub mq5: f32,
    pub mq6: f32,
    pub mq7: f32,
    pub mq8: f32,
}

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok(); // Membaca file .env

    // Konfigurasi CORS agar mengizinkan akses dari frontend mana pun
    let cors = CorsLayer::permissive();

    let app = Router::new()
        .route("/", get(|| async { "Backend Web Teknologi IoT dengan Azure SQL aktif!" }))
        .route("/api/readings", get(get_readings).post(receive_reading))
        .layer(cors); // Pasang layer CORS

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();

    println!("Backend Rust berjalan di http://0.0.0.0:3000");

    axum::serve(listener, app).await.unwrap();
}

// Handler untuk menerima data POST dari ESP32/Client
async fn receive_reading(Json(payload): Json<SensorData>) -> Result<String, String> {
    println!("Data diterima dari Device: {}", payload.device_id);

    let host = env::var("DATABASE_HOST").unwrap_or_default();
    let user = env::var("DATABASE_USER").unwrap_or_default();
    let password = env::var("DATABASE_PASSWORD").unwrap_or_default();
    let db_name = env::var("DATABASE_NAME").unwrap_or_default();

    let mut config = Config::new();
    config.host(&host);
    config.port(1433);
    config.authentication(AuthMethod::sql_server(&user, &password));
    config.database(&db_name);
    config.trust_cert();

    let tcp = TcpStream::connect(config.get_addr())
        .await
        .map_err(|e| format!("Gagal koneksi TCP: {}", e))?;
    let tcp_compat = tcp.compat_write();

    let mut client = Client::connect(config, tcp_compat)
        .await
        .map_err(|e| format!("Gagal handshake SQL: {}", e))?;

    let query = "INSERT INTO sensor_readings (device_id, temperature, humidity, mq1, mq2, mq3, mq4, mq5, mq6, mq7, mq8) VALUES (@P1, @P2, @P3, @P4, @P5, @P6, @P7, @P8, @P9, @P10, @P11)";
    
    client
        .execute(
            query,
            &[
                &payload.device_id,
                &payload.temperature,
                &payload.humidity,
                &payload.mq1,
                &payload.mq2,
                &payload.mq3,
                &payload.mq4,
                &payload.mq5,
                &payload.mq6,
                &payload.mq7,
                &payload.mq8,
            ],
        )
        .await
        .map_err(|e| format!("Gagal simpan ke DB: {}", e))?;

    Ok(format!("Data dari {} berhasil disimpan ke Azure SQL!", payload.device_id))
}

// Handler untuk mengambil data GET dari database untuk Frontend React
async fn get_readings() -> Result<Json<Vec<SensorData>>, String> {
    let host = env::var("DATABASE_HOST").unwrap_or_default();
    let user = env::var("DATABASE_USER").unwrap_or_default();
    let password = env::var("DATABASE_PASSWORD").unwrap_or_default();
    let db_name = env::var("DATABASE_NAME").unwrap_or_default();

    let mut config = Config::new();
    config.host(&host);
    config.port(1433);
    config.authentication(AuthMethod::sql_server(&user, &password));
    config.database(&db_name);
    config.trust_cert();

    let tcp = TcpStream::connect(config.get_addr())
        .await
        .map_err(|e| format!("Gagal koneksi TCP: {}", e))?;
    let tcp_compat = tcp.compat_write();

    let mut client = Client::connect(config, tcp_compat)
        .await
        .map_err(|e| format!("Gagal handshake SQL: {}", e))?;

    let query = "SELECT TOP 10 device_id, temperature, humidity, mq1, mq2, mq3, mq4, mq5, mq6, mq7, mq8 FROM sensor_readings ORDER BY id DESC";
    let streamed = client.query(query, &[]).await.map_err(|e| format!("Query error: {}", e))?;
    let rows = streamed.into_results().await.map_err(|e| format!("Result error: {}", e))?;

    let mut readings = Vec::new();
    if let Some(row_slice) = rows.first() {
        for row in row_slice {
            let reading = SensorData {
                device_id: row.get::<&str, _>("device_id").unwrap_or("").to_string(),
                temperature: row.get::<f64, _>("temperature").unwrap_or(0.0) as f32,
                humidity: row.get::<f64, _>("humidity").unwrap_or(0.0) as f32,
                mq1: row.get::<f64, _>("mq1").unwrap_or(0.0) as f32,
                mq2: row.get::<f64, _>("mq2").unwrap_or(0.0) as f32,
                mq3: row.get::<f64, _>("mq3").unwrap_or(0.0) as f32,
                mq4: row.get::<f64, _>("mq4").unwrap_or(0.0) as f32,
                mq5: row.get::<f64, _>("mq5").unwrap_or(0.0) as f32,
                mq6: row.get::<f64, _>("mq6").unwrap_or(0.0) as f32,
                mq7: row.get::<f64, _>("mq7").unwrap_or(0.0) as f32,
                mq8: row.get::<f64, _>("mq8").unwrap_or(0.0) as f32,
            };
            readings.push(reading);
        }
    }

    Ok(Json(readings))
}