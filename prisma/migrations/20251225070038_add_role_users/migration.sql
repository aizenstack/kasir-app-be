-- AlterTable
ALTER TABLE `users` MODIFY `roles` ENUM('administrator', 'petugas') NOT NULL DEFAULT 'petugas';
