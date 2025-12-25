/*
  Warnings:

  - You are about to drop the `detailpenjualan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `detailpenjualan` DROP FOREIGN KEY `detailPenjualan_penjualan_id_fkey`;

-- DropForeignKey
ALTER TABLE `detailpenjualan` DROP FOREIGN KEY `detailPenjualan_produk_id_fkey`;

-- DropTable
DROP TABLE `detailpenjualan`;

-- CreateTable
CREATE TABLE `detail_penjualan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `penjualan_id` INTEGER NOT NULL,
    `produk_id` INTEGER NOT NULL,
    `jumlah_produk` INTEGER NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `detail_penjualan` ADD CONSTRAINT `detail_penjualan_penjualan_id_fkey` FOREIGN KEY (`penjualan_id`) REFERENCES `penjualan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_penjualan` ADD CONSTRAINT `detail_penjualan_produk_id_fkey` FOREIGN KEY (`produk_id`) REFERENCES `produk`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
