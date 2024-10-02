ALTER TABLE `users` ADD `hashed_password` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `password_hash`;