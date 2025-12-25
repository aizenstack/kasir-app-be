/*
  Warnings:

  - The primary key for the `detailpenjualan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `DetailId` on the `detailpenjualan` table. All the data in the column will be lost.
  - You are about to drop the column `PenjualanId` on the `detailpenjualan` table. All the data in the column will be lost.
  - You are about to drop the column `ProdukId` on the `detailpenjualan` table. All the data in the column will be lost.
  - The primary key for the `pelanggan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `PelangganId` on the `pelanggan` table. All the data in the column will be lost.
  - The primary key for the `penjualan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `PelangganId` on the `penjualan` table. All the data in the column will be lost.
  - You are about to drop the column `PenjualanId` on the `penjualan` table. All the data in the column will be lost.
  - The primary key for the `produk` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ProdukId` on the `produk` table. All the data in the column will be lost.
  - You are about to drop the column `UpdateAt` on the `produk` table. All the data in the column will be lost.
  - Added the required column `IdDetail` to the `detailPenjualan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `IdPenjualan` to the `detailPenjualan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `IdProduk` to the `detailPenjualan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `IdPelanggan` to the `pelanggan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `IdPenjualan` to the `penjualan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `IdProduk` to the `produk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `produk` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `detailpenjualan` DROP FOREIGN KEY `detailPenjualan_PenjualanId_fkey`;

-- DropForeignKey
ALTER TABLE `detailpenjualan` DROP FOREIGN KEY `detailPenjualan_ProdukId_fkey`;

-- DropForeignKey
ALTER TABLE `penjualan` DROP FOREIGN KEY `penjualan_PelangganId_fkey`;

-- DropIndex
DROP INDEX `detailPenjualan_PenjualanId_fkey` ON `detailpenjualan`;

-- DropIndex
DROP INDEX `detailPenjualan_ProdukId_fkey` ON `detailpenjualan`;

-- DropIndex
DROP INDEX `penjualan_PelangganId_fkey` ON `penjualan`;

-- AlterTable
ALTER TABLE `detailpenjualan` DROP PRIMARY KEY,
    DROP COLUMN `DetailId`,
    DROP COLUMN `PenjualanId`,
    DROP COLUMN `ProdukId`,
    ADD COLUMN `IdDetail` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `IdPenjualan` INTEGER NOT NULL,
    ADD COLUMN `IdProduk` INTEGER NOT NULL,
    ADD PRIMARY KEY (`IdDetail`);

-- AlterTable
ALTER TABLE `pelanggan` DROP PRIMARY KEY,
    DROP COLUMN `PelangganId`,
    ADD COLUMN `IdPelanggan` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`IdPelanggan`);

-- AlterTable
ALTER TABLE `penjualan` DROP PRIMARY KEY,
    DROP COLUMN `PelangganId`,
    DROP COLUMN `PenjualanId`,
    ADD COLUMN `IdPelanggan` INTEGER NULL,
    ADD COLUMN `IdPenjualan` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`IdPenjualan`);

-- AlterTable
ALTER TABLE `produk` DROP PRIMARY KEY,
    DROP COLUMN `ProdukId`,
    DROP COLUMN `UpdateAt`,
    ADD COLUMN `IdProduk` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `UpdatedAt` DATETIME(3) NOT NULL,
    ADD PRIMARY KEY (`IdProduk`);

-- AddForeignKey
ALTER TABLE `penjualan` ADD CONSTRAINT `penjualan_IdPelanggan_fkey` FOREIGN KEY (`IdPelanggan`) REFERENCES `pelanggan`(`IdPelanggan`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailPenjualan` ADD CONSTRAINT `detailPenjualan_IdPenjualan_fkey` FOREIGN KEY (`IdPenjualan`) REFERENCES `penjualan`(`IdPenjualan`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailPenjualan` ADD CONSTRAINT `detailPenjualan_IdProduk_fkey` FOREIGN KEY (`IdProduk`) REFERENCES `produk`(`IdProduk`) ON DELETE RESTRICT ON UPDATE CASCADE;
