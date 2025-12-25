-- AlterTable
ALTER TABLE `pelanggan` ADD COLUMN `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `penjualan` (
    `PenjualanId` INTEGER NOT NULL AUTO_INCREMENT,
    `TanggalPenjualan` DATETIME(3) NOT NULL,
    `TotalHarga` DECIMAL(10, 2) NOT NULL,
    `PelangganId` INTEGER NOT NULL,
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`PenjualanId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `penjualan` ADD CONSTRAINT `penjualan_PelangganId_fkey` FOREIGN KEY (`PelangganId`) REFERENCES `pelanggan`(`IdPelanggan`) ON DELETE RESTRICT ON UPDATE CASCADE;
