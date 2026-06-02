# STT-NF Decentralized Identifier (DID) Registry

> **⚠️ DISCLAIMER:** Repository ini merupakan *Proof of Concept* (PoC) untuk keperluan penelitian/skripsi dan **BUKAN** merupakan implementasi resmi dari Sekolah Tinggi Teknologi Terpadu Nurul Fikri (STT-NF).

Repository ini berfungsi sebagai infrastruktur publik ***Decentralized Identifier* (DID)**. Sistem ini merupakan bagian dari penelitian implementasi *Single Sign-On* (SSO) berbasis *Self-Sovereign Identity* (SSI).

## Standar dan Algoritma yang Dipakai

Sistem ini dibangun dengan mematuhi spesifikasi standar identitas terdesentralisasi global:

- **Format DID Document:** [W3C DID Core v1.0](https://www.w3.org/TR/did-1.0/)
- **Metode DID:** [`did:web`](https://w3c-ccg.github.io/did-method-web/)
- **Format Kunci Publik:** [RFC 7517](https://www.rfc-editor.org/rfc/rfc7517) (JSON Web Key / JWK)
- **Algoritma Kriptografi:** ES256 (ECDSA menggunakan kurva NIST P-256)
- **Penomoran Kunci:** Dihitung otomatis menggunakan metode JWK Thumbprint ([RFC 7638](https://www.rfc-editor.org/rfc/rfc7638))

## Akses Dokumen Publik (*DID Document*)

Dokumen JSON Web Key (JWK) publik dari *issuer* dapat diakses secara langsung melalui tautan berikut:
[https://nurulfikri.qzz.io/.well-known/did.json](https://nurulfikri.qzz.io/.well-known/did.json)

Untuk pengujian resolusi identitas sesuai standar global, DID ini (`did:web:nurulfikri.qzz.io`) juga dapat diverifikasi menggunakan **[DIF Universal Resolver](https://dev.uniresolver.io/)**.

## Konfigurasi Infrastruktur

Repository ini di-hosting menggunakan GitHub Pages. Sesuai dengan aturan spesifikasi W3C untuk *custom root domain*, dokumen resolusi diletakkan secara absolut pada rute `/.well-known/did.json`.

Penggunaan *custom domain* pada *repository* ini memanfaatkan layanan penyedia domain gratis dari [DigitalPlatDev/FreeDomain](https://github.com/DigitalPlatDev/FreeDomain).