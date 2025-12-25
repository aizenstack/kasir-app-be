-- CreateTable
CREATE TABLE `pelanggan` (
    `IdPelanggan` INTEGER NOT NULL AUTO_INCREMENT,
    `NamaPelanggan` VARCHAR(191) NOT NULL,
    `Alamat` VARCHAR(191) NOT NULL,
    `Telepon` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`IdPelanggan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
