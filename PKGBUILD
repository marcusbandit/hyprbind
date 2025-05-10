pkgname=hyprbind
pkgver=0.1.0
pkgrel=1
pkgdesc="Visual Hyprland keybind manager (Wayland-native, Tauri app)"
arch=('x86_64')
url="https://github.com/marcusbandit/hyprbind"
license=('MIT')
depends=('webkit2gtk' 'gtk3' 'libdrm' 'libgbm' 'mesa' 'hyprland')
makedepends=('rust' 'npm' 'tauri-cli')
source=("$pkgname-$pkgver.tar.gz::https://github.com/marcusbandit/hyprbind/archive/refs/tags/v$pkgver.tar.gz" "hyprbind.desktop")
sha256sums=('SKIP' 'SKIP')

build() {
  cd "$srcdir/$pkgname-$pkgver"
  npm install
  npm run tauri build
}

package() {
  cd "$srcdir/$pkgname-$pkgver"
  install -Dm755 "src-tauri/target/release/hyprbind" "$pkgdir/usr/bin/hyprbind"
  install -Dm644 "hyprbind.desktop" "$pkgdir/usr/share/applications/hyprbind.desktop"
  # Optionally install icons here
} 