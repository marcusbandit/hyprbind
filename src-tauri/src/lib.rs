// Using plugin-fs for file operations; no custom commands needed
#![cfg_attr(mobile, tauri::mobile_entry_point)]

use tauri::{Builder, generate_context};
use tauri_plugin_fs::init;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    Builder::default()
        .plugin(init())
        .plugin(tauri_plugin_fs::init())
        .run(generate_context!())
        .expect("error while running tauri application");
}
