/*
  Warnings:

  - The primary key for the `pelanggan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `IdPelanggan` on the `pelanggan` table. All the data in the column will be lost.
  - Added the required column `PelangganId` to the `pelanggan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `penjualan` DROP FOREIGN KEY `penjualan_PelangganId_fkey`;

-- DropIndex
DROP INDEX `penjualan_PelangganId_fkey` ON `penjualan`;

-- AlterTable
ALTER TABLE `pelanggan` DROP PRIMARY KEY,
    DROP COLUMN `IdPelanggan`,
    ADD COLUMN `PelangganId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`PelangganId`);

-- CreateTable
CREATE TABLE `produk` (
    `ProdukId` INTEGER NOT NULL AUTO_INCREMENT,
    `NamaProduk` VARCHAR(191) NOT NULL,
    `Harga` DECIMAL(10, 2) NOT NULL,
    `Stok` INTEGER NOT NULL,
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`ProdukId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `penjualan` ADD CONSTRAINT `penjualan_PelangganId_fkey` FOREIGN KEY (`PelangganId`) REFERENCES `pelanggan`(`PelangganId`) ON DELETE RESTRICT ON UPDATE CASCADE;
