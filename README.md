# hyprbind

A Linux desktop GUI app for visually managing and configuring Hyprland keybinds.

## Features
- Visual keyboard UI for assigning/editing Hyprland keybinds
- List, add, edit, and remove keybinds (via `hyprctl`)
- Save managed binds to `~/.config/hypr/hyprbind.conf`
- Safe config mode: temporarily override binds with no-ops
- Live preview: apply new binds immediately for testing

## Setup

1. **Install dependencies:**
   - Rust (with cargo)
   - Node.js (LTS) and npm
   - Hyprland and `hyprctl` available in your PATH

2. **Clone and build:**
   ```sh
   cd hyprbind
   npm install
   npm run tauri dev
   ```

3. **(First time only) Add this line to your main Hyprland config (`~/.config/hypr/hyprland.conf`):**
   ```
   source = ~/.config/hypr/hyprbind.conf
   ```
   This ensures your managed binds are loaded by Hyprland.

## Project Structure
- `src/` — React + TypeScript frontend
- `src-tauri/` — Tauri Rust backend

## Development
- Frontend: edit `src/App.tsx` for the UI
- Backend: add Tauri commands in `src-tauri/src/lib.rs`

## Note
- This is a boilerplate. See `App.tsx` and `lib.rs` for example logic and extend as needed.

## Arch Linux / AUR

**hyprbind** is designed for Hyprland/Wayland and will be available on the AUR. To build or install manually:

### Dependencies
- `webkit2gtk` (for Tauri webview)
- `gtk3`
- `libdrm`, `libgbm`, `mesa` (graphics stack)
- `hyprland` (runtime)

### Install
- Clone the repo or AUR package and run:
  ```sh
  makepkg -si
  ```
- Or, when available:
  ```sh
  yay -S hyprbind
  ```

### Wayland Rendering Workaround
- On some systems, you may see a blank window due to a WebKitGTK/GBM/Wayland issue.
- The included `.desktop` launcher and the npm scripts set `WEBKIT_DISABLE_COMPOSITING_MODE=1` automatically to fix this.
- If you launch the binary directly from the terminal and see a blank window, set the variable manually:
  ```sh
  WEBKIT_DISABLE_COMPOSITING_MODE=1 hyprbind
  ```
- This is a known upstream issue with WebKitGTK compositing on some drivers. It is not a permanent patch, but a safe workaround for now.
