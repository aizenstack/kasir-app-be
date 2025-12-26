-- CreateEnum
CREATE TYPE "roles" AS ENUM ('administrator', 'petugas');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "roles" NOT NULL DEFAULT 'petugas',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pelanggan" (
    "id" SERIAL NOT NULL,
    "nama_pelanggan" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "telepon" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pelanggan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produk" (
    "id" SERIAL NOT NULL,
    "nama_produk" TEXT NOT NULL,
    "harga" DECIMAL(10,2) NOT NULL,
    "stok" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penjualan" (
    "id" SERIAL NOT NULL,
    "tanggal_penjualan" TIMESTAMP(3) NOT NULL,
    "total_harga" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pelanggan_id" INTEGER,

    CONSTRAINT "penjualan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_penjualan" (
    "id" SERIAL NOT NULL,
    "penjualan_id" INTEGER NOT NULL,
    "produk_id" INTEGER NOT NULL,
    "jumlah_produk" INTEGER NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "detail_penjualan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "penjualan" ADD CONSTRAINT "penjualan_pelanggan_id_fkey" FOREIGN KEY ("pelanggan_id") REFERENCES "pelanggan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_penjualan" ADD CONSTRAINT "detail_penjualan_penjualan_id_fkey" FOREIGN KEY ("penjualan_id") REFERENCES "penjualan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_penjualan" ADD CONSTRAINT "detail_penjualan_produk_id_fkey" FOREIGN KEY ("produk_id") REFERENCES "produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
