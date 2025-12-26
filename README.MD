# 🧾 SIKAS Backend - Sistem Informasi Kasir API

Backend API untuk **Sistem Informasi Kasir (SIKAS)** yang menyediakan RESTful API untuk mengelola data penjualan, produk, pelanggan, dan manajemen pengguna.  
Aplikasi ini dikembangkan menggunakan **Express.js**, **Prisma ORM**, dan **MySQL** dengan arsitektur yang scalable, maintainable, dan mengikuti best practices.

---

## ✨ Fitur Utama

- 🔐 **Sistem Autentikasi & Autorisasi**
  - JWT-based authentication untuk keamanan akses
  - Role-based access control (Administrator & Petugas)
  - Password hashing dengan bcrypt

- 📦 **Manajemen Produk**
  - CRUD operasi untuk data produk
  - Tracking stok barang secara real-time
  - Monitoring harga dan informasi produk

- 👥 **Manajemen Pelanggan**
  - Pendataan informasi pelanggan
  - Riwayat transaksi per pelanggan
  - Data kontak dan alamat pelanggan

- 💰 **Sistem Penjualan**
  - Pencatatan transaksi penjualan
  - Detail penjualan dengan multiple produk
  - Perhitungan total otomatis
  - Tracking tanggal dan waktu transaksi

- 📊 **API Documentation**
  - Swagger UI untuk dokumentasi interaktif
  - Testing API langsung dari browser
  - OAuth2 authentication flow terintegrasi

---

## 🛠️ Teknologi yang Digunakan

- **Express.js 5.2.1**  
  Framework Node.js yang ringan dan fleksibel untuk membangun RESTful API

- **Prisma ORM 5.22.0**  
  Next-generation ORM dengan type-safety dan auto-generated queries

- **PostgreSQL**  
  Database relational untuk menyimpan data transaksi dan master data

- **JWT (JSON Web Token)**  
  Standar untuk autentikasi dan otorisasi yang aman

- **Swagger/OpenAPI**  
  Dokumentasi API interaktif dengan UI yang user-friendly

- **bcrypt**  
  Library untuk hashing password dengan algoritma yang aman

---

## 🏗️ Arsitektur

Backend ini menggunakan arsitektur **MVC (Model-View-Controller)** dengan struktur yang terorganisir:

- **Models** - Layer untuk interaksi dengan database menggunakan Prisma
- **Controllers** - Business logic dan handling request/response
- **Routes** - Definisi endpoint dan routing
- **Middlewares** - JWT authentication dan role-based authorization
- **Utils** - Helper functions dan konfigurasi

---

## 🚀 Keunggulan

- ✅ **Type-Safe Database Access**  
  Prisma ORM memberikan type-safety dan auto-completion untuk query database

- ✅ **Scalable Architecture**  
  Struktur kode yang modular dan mudah untuk dikembangkan lebih lanjut

- ✅ **Security First**  
  Implementasi JWT, password hashing, dan role-based access control

- ✅ **Developer Friendly**  
  Swagger documentation memudahkan testing dan integrasi dengan frontend

- ✅ **Database Migrations**  
  Prisma migrations untuk version control database schema

- ✅ **Environment Configuration**  
  Menggunakan dotenv untuk mengelola konfigurasi environment

---

## 📚 Dokumentasi API

Dokumentasi API tersedia melalui Swagger UI yang dapat diakses di:
```
http://localhost:3000/sikas/docs
```

Fitur dokumentasi:
- Daftar lengkap semua endpoint
- Request/response schema
- Testing langsung dari browser
- OAuth2 authentication flow

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan pembelajaran dan pengembangan.  
Silakan digunakan dan dikembangkan sesuai kebutuhan.

