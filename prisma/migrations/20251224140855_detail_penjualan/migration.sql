/*
  Warnings:

  - Added the required column `UpdateAt` to the `produk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `produk` ADD COLUMN `UpdateAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `detailPenjualan` (
    `DetailId` INTEGER NOT NULL AUTO_INCREMENT,
    `PenjualanId` INTEGER NOT NULL,
    `ProdukId` INTEGER NOT NULL,
    `JumlahProduk` INTEGER NOT NULL,
    `Subtotal` DECIMAL(10, 2) NOT NULL,
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`DetailId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `detailPenjualan` ADD CONSTRAINT `detailPenjualan_PenjualanId_fkey` FOREIGN KEY (`PenjualanId`) REFERENCES `penjualan`(`PenjualanId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailPenjualan` ADD CONSTRAINT `detailPenjualan_ProdukId_fkey` FOREIGN KEY (`ProdukId`) REFERENCES `produk`(`ProdukId`) ON DELETE RESTRICT ON UPDATE CASCADE;
