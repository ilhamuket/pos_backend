# POS Backend

POS Backend adalah aplikasi backend untuk sistem Point of Sale (POS) yang dibangun menggunakan NestJS. Aplikasi ini menyediakan endpoint untuk mengelola pengguna, inventaris, produk, dan transaksi, serta dilindungi dengan autentikasi JWT.

## Fitur

- Autentikasi dan otorisasi menggunakan JWT
- Manajemen pengguna
- Manajemen inventaris
- Manajemen produk
- Manajemen transaksi

## Prasyarat

- Node.js (versi 14 atau lebih baru)
- NPM (versi 6 atau lebih baru)
- PostgreSQL (atau database lain yang didukung TypeORM)

## Instalasi

1. **Clone repositori ini:**

   ```bash
   git clone https://github.com/username/pos-backend.git
   cd pos-backend
   ```

2. **Instal dependensi:**

   ```bash
   npm install
   ```

3. **Konfigurasi database:**

   Buat file `.env` di root proyek dan tambahkan konfigurasi database Anda:

   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=your_db_user
   DATABASE_PASSWORD=your_db_password
   DATABASE_NAME=your_db_name
   JWT_SECRET=yourSecretKey
   ```

4. **Jalankan migrasi database:**

   ```bash
   npm run typeorm migration:run
   ```

5. **Jalankan aplikasi:**

   ```bash
   npm run start:dev
   ```

## Penggunaan

### Endpoint Autentikasi

#### Register

- **URL:** `http://localhost:3000/auth/register`
- **Method:** POST
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "password123"
  }
  ```

#### Login

- **URL:** `http://localhost:3000/auth/login`
- **Method:** POST
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "username": "testuser",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
    {
      "access_token": "your.jwt.token"
    }
  ```

### Endpoint yang Dilindungi

Gunakan token JWT yang diperoleh dari endpoint login untuk mengakses endpoint yang dilindungi.

#### Inventory

- **URL:** `http://localhost:3000/inventory`
- **Method:** GET
- **Headers:**
  ```plaintext
  Authorization: Bearer your.jwt.token
  ```

#### Product

- **URL:** `http://localhost:3000/product`
- **Method:** GET
- **Headers:**
  ```plaintext
  Authorization: Bearer your.jwt.token
  ```

#### Transactions

- **URL:** `http://localhost:3000/transactions`
- **Method:** GET
- **Headers:**
  ```plaintext
  Authorization: Bearer your.jwt.token
  ```

## Struktur Proyek

```
src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── dto/
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   ├── jwt.strategy.ts
├── users/
│   ├── users.controller.ts
│   ├── users.module.ts
│   ├── users.service.ts
│   ├── users.entity.ts
├── inventory/
│   ├── inventory.controller.ts
│   ├── inventory.module.ts
│   ├── inventory.service.ts
├── product/
│   ├── product.controller.ts
│   ├── product.module.ts
│   ├── product.service.ts
├── transactions/
│   ├── transactions.controller.ts
│   ├── transactions.module.ts
│   ├── transactions.service.ts
├── app.module.ts
```

  ## Lisensi

  Proyek ini dilisensikan di bawah lisensi MIT. Lihat file [LICENSE](LICENSE) untuk informasi lebih lanjut.
