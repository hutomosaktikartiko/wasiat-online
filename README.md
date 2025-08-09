# Wasiat Online — On‑chain Crypto Inheritance Vault

_Disclaimer: Produk ini mengotomasi transfer warisan aset kripto dan bukan dokumen/layanan hukum._

## Tentang Project Ini

**Menciptakan standar baru yang aman, transparan, dan terotomatisasi untuk pewarisan aset digital di blockchain, memastikan tidak ada lagi aset kripto yang hilang selamanya karena sebuah tragedi.**

## Keunggulan

- **Aman**: Pengguna memegang kendali penuh atas kunci pribadi (private key) mereka; aset diamankan oleh logika kontrak pintar (smart contract).
- **Otomatis**: Proses transfer aset terjadi secara otomatis berdasarkan aturan yang telah ditetapkan, menghilangkan kebutuhan akan perantara yang mahal dan proses hukum yang panjang.
- **Efisien & Terjangkau**: Dibangun di atas Solana, biaya transaksi untuk membuat dan mengelola wasiat menjadi sangat murah dan prosesnya terjadi hampir seketika.

## Pengguna

- **Pewasiat (The Testator)**: Pemilik aset yang akan menggunakan aplikasi kita untuk membuat wasiat, menetapkan aturan pemicu ("heartbeat"), dan menyetor aset mereka ke dalam brankas (vault) yang aman.
- **Penerima Manfaat (The Beneficiary)**: Pihak yang ditunjuk oleh Pewasiat, yang akan menggunakan aplikasi kita untuk memverifikasi status wasiat dan mengklaim aset setelah kondisi pemicu terpenuhi.

## Alur Kerja

- **Pembuatan**: Pewasiat membuat sebuah "Kontrak Wasiat" melalui aplikasi kita, menunjuk satu Penerima Manfaat, dan menentukan durasi "timer heartbeat" (misalnya, 90 hari).
- **Pendanaan**: Pewasiat mentransfer aset digital (SOL, token, atau NFT) ke dalam brankas on-chain yang terasosiasi dengan kontrak wasiatnya.
- **Aktivitas ("Heartbeat")**: Pewasiat secara berkala menekan satu tombol di aplikasi untuk mengirim transaksi "heartbeat", yang membuktikan bahwa ia masih aktif dan mengatur ulang timer ke 90 hari.
- **Pemicuan (Trigger)**: Jika Pewasiat tidak mengirim "heartbeat" dalam 90 hari, sebuah layanan otomatis (disebut "keeper") akan mendeteksi ini dan memanggil fungsi untuk mengubah status kontrak menjadi "Triggered".
- **Klaim Aset**: Penerima Manfaat, setelah melihat status wasiat telah "Triggered", dapat menekan tombol "Klaim Aset". Kontrak pintar secara otomatis akan memverifikasi identitasnya dan mentransfer seluruh aset dari brankas ke dompet Penerima Manfaat.

## Komponen Utama

- **Aplikasi Web (dApp)**: Antarmuka pengguna yang simpel dan intuitif untuk Pewasiat dan Penerima Manfaat.
- **Program On-Chain (Smart Contract)**: Otak dari layanan yang ditulis dalam Rust dan di-deploy di Solana. Program ini akan mengelola semua logika, status wasiat, dan hak akses.
- **Brankas Aset (PDA Vault)**: Akun khusus on-chain (Program Derived Address) untuk setiap wasiat, yang berfungsi sebagai brankas untuk menyimpan aset dengan aman.
- **Layanan Keeper (Off-chain)**: Sebuah skrip otomatis yang berjalan di server untuk memonitor semua kontrak wasiat dan memanggil fungsi pemicu jika timer heartbeat telah berakhir.

## Protocol POC Requirements

- Protokol harus menyediakan fungsi bagi seorang pengguna ("Pewasiat") untuk membuat sebuah Kontrak Wasiat on-chain.
- Protokol harus mengizinkan Pewasiat untuk menunjuk satu alamat Solana lain sebagai "Penerima Manfaat".
- Protokol harus mengizinkan Pewasiat untuk menyetor (deposit) berbagai jenis aset ke dalam brankas wasiat, termasuk SOL, SPL Token, dan NFT.
- Protokol harus mengizinkan Pewasiat untuk menetapkan periode waktu "heartbeat" (misalnya 90 hari) sebagai kondisi pemicu (trigger).
- Protokol harus menyediakan fungsi "heartbeat" yang dapat dipanggil oleh Pewasiat untuk membuktikan aktivitas dan mengatur ulang periode waktu pemicu.
- Protokol harus memiliki status "Triggered" yang aktif jika periode heartbeat telah terlampaui.
- Protokol harus mengizinkan Penerima Manfaat yang sah untuk mengklaim seluruh aset dari wasiat yang telah berstatus "Triggered".
- Protokol harus mengenakan biaya layanan yang kecil (persentase akan ditentukan kemudian) pada saat aset berhasil diklaim.
- Protokol harus memiliki brankas (vault) terpisah untuk menyimpan akumulasi biaya layanan yang terkumpul.
- Protokol harus memastikan hanya Pewasiat yang dapat mengubah detail wasiat atau menarik kembali asetnya, selama wasiat belum berstatus "Triggered".

## Roadmap

- **MVP**: Single beneficiary, heartbeat + trigger + claim.
- **V2**: Permisionless trigger bounty, multi-beneficiary dengan presentase, reminder notifikasi.
- **v3**: Guardian/multisig heartbeat, audit + program upgrade lock, fitur fee konfigurabel.

## Tech Stack

- **Smart Contract**: Anchor Framework (Rust)
- **Backend**: Go with SQLite
- **Frontend**: React Router v7
- **Deployment**: Cloudflare (Frontend), VPS 2GB (Backend)
- **Blockchain**: Solana

## Documentation

📚 **Detailed Documentation:**

- [🏗️ System Architecture](docs/ARCHITECTURE.md) - Diagrams dan arsitektur sistem
- [🗄️ Database Schema](docs/DATABASE_SCHEMA.md) - On-chain dan off-chain data structure
- [🛣️ Development Roadmap](docs/ROADMAP.md) - Planning dan milestones

## Quick Start

### Prerequisites

- Node.js 18+
- Rust 1.70+
- Solana CLI
- Anchor CLI
- Go 1.21+

### Installation

```bash
# Clone repository
git clone <repository-url>
cd wasiat-online

# Install frontend dependencies
pnpm install

# Install Anchor dependencies
cd anchor && pnpm install

# Build Solana program
anchor build

# Run development
pnpm run dev
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**🚨 Important Notice**: This is experimental software for educational purposes. Always conduct thorough testing before using with real assets.
