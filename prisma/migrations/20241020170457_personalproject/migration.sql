-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `Cart_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `Orders_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
