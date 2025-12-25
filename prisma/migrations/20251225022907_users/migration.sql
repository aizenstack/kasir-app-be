/*
  Warnings:

  - The primary key for the `detailpenjualan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `CreatedAt` on the `detailpenjualan` table. All the data in the column will be lost.
  - You are about to drop the column `IdDetail` on the `detailpenjualan` table. All the data in the column will be lost.
  - You are about to drop the column `IdPenjualan` on the `detailpenjualan` table. All the data in the column will be lost.
  - You are about to drop the column `IdProduk` on the `detailpenjualan` table. All the data in the column will be lost.
  - You are about to drop the column `JumlahProduk` on the `detailpenjualan` table. All the data in the column will be lost.
  - You are about to drop the column `Subtotal` on the `detailpenjualan` table. All the data in the column will be lost.
  - The primary key for the `pelanggan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Alamat` on the `pelanggan` table. All the data in the column will be lost.
  - You are about to drop the column `CreatedAt` on the `pelanggan` table. All the data in the column will be lost.
  - You are about to drop the column `IdPelanggan` on the `pelanggan` table. All the data in the column will be lost.
  - You are about to drop the column `NamaPelanggan` on the `pelanggan` table. All the data in the column will be lost.
  - You are about to drop the column `Telepon` on the `pelanggan` table. All the data in the column will be lost.
  - The primary key for the `penjualan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `CreatedAt` on the `penjualan` table. All the data in the column will be lost.
  - You are about to drop the column `IdPelanggan` on the `penjualan` table. All the data in the column will be lost.
  - You are about to drop the column `IdPenjualan` on the `penjualan` table. All the data in the column will be lost.
  - You are about to drop the column `TanggalPenjualan` on the `penjualan` table. All the data in the column will be lost.
  - You are about to drop the column `TotalHarga` on the `penjualan` table. All the data in the column will be lost.
  - The primary key for the `produk` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `CreatedAt` on the `produk` table. All the data in the column will be lost.
  - You are about to drop the column `Harga` on the `produk` table. All the data in the column will be lost.
  - You are about to drop the column `IdProduk` on the `produk` table. All the data in the column will be lost.
  - You are about to drop the column `NamaProduk` on the `produk` table. All the data in the column will be lost.
  - You are about to drop the column `Stok` on the `produk` table. All the data in the column will be lost.
  - You are about to drop the column `UpdatedAt` on the `produk` table. All the data in the column will be lost.
  - Added the required column `id` to the `detailPenjualan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jumlah_produk` to the `detailPenjualan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `penjualan_id` to the `detailPenjualan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `produk_id` to the `detailPenjualan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `detailPenjualan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alamat` to the `pelanggan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `pelanggan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama_pelanggan` to the `pelanggan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telepon` to the `pelanggan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `penjualan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tanggal_penjualan` to the `penjualan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_harga` to the `penjualan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `harga` to the `produk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `produk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama_produk` to the `produk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stok` to the `produk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `produk` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `detailpenjualan` DROP FOREIGN KEY `detailPenjualan_IdPenjualan_fkey`;

-- DropForeignKey
ALTER TABLE `detailpenjualan` DROP FOREIGN KEY `detailPenjualan_IdProduk_fkey`;

-- DropForeignKey
ALTER TABLE `penjualan` DROP FOREIGN KEY `penjualan_IdPelanggan_fkey`;

-- DropIndex
DROP INDEX `detailPenjualan_IdPenjualan_fkey` ON `detailpenjualan`;

-- DropIndex
DROP INDEX `detailPenjualan_IdProduk_fkey` ON `detailpenjualan`;

-- DropIndex
DROP INDEX `penjualan_IdPelanggan_fkey` ON `penjualan`;

-- AlterTable
ALTER TABLE `detailpenjualan` DROP PRIMARY KEY,
    DROP COLUMN `CreatedAt`,
    DROP COLUMN `IdDetail`,
    DROP COLUMN `IdPenjualan`,
    DROP COLUMN `IdProduk`,
    DROP COLUMN `JumlahProduk`,
    DROP COLUMN `Subtotal`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `jumlah_produk` INTEGER NOT NULL,
    ADD COLUMN `penjualan_id` INTEGER NOT NULL,
    ADD COLUMN `produk_id` INTEGER NOT NULL,
    ADD COLUMN `subtotal` DECIMAL(10, 2) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `pelanggan` DROP PRIMARY KEY,
    DROP COLUMN `Alamat`,
    DROP COLUMN `CreatedAt`,
    DROP COLUMN `IdPelanggan`,
    DROP COLUMN `NamaPelanggan`,
    DROP COLUMN `Telepon`,
    ADD COLUMN `alamat` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `nama_pelanggan` VARCHAR(191) NOT NULL,
    ADD COLUMN `telepon` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `penjualan` DROP PRIMARY KEY,
    DROP COLUMN `CreatedAt`,
    DROP COLUMN `IdPelanggan`,
    DROP COLUMN `IdPenjualan`,
    DROP COLUMN `TanggalPenjualan`,
    DROP COLUMN `TotalHarga`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `pelanggan_id` INTEGER NULL,
    ADD COLUMN `tanggal_penjualan` DATETIME(3) NOT NULL,
    ADD COLUMN `total_harga` DECIMAL(10, 2) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `produk` DROP PRIMARY KEY,
    DROP COLUMN `CreatedAt`,
    DROP COLUMN `Harga`,
    DROP COLUMN `IdProduk`,
    DROP COLUMN `NamaProduk`,
    DROP COLUMN `Stok`,
    DROP COLUMN `UpdatedAt`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `harga` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `nama_produk` VARCHAR(191) NOT NULL,
    ADD COLUMN `stok` INTEGER NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `penjualan` ADD CONSTRAINT `penjualan_pelanggan_id_fkey` FOREIGN KEY (`pelanggan_id`) REFERENCES `pelanggan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailPenjualan` ADD CONSTRAINT `detailPenjualan_penjualan_id_fkey` FOREIGN KEY (`penjualan_id`) REFERENCES `penjualan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailPenjualan` ADD CONSTRAINT `detailPenjualan_produk_id_fkey` FOREIGN KEY (`produk_id`) REFERENCES `produk`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
