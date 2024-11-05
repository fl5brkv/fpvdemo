CREATE TABLE `flight_sessions` (
	`flight_session_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`public_flight_session_id` text NOT NULL,
	`datetime_start` text,
	`datetime_end` text,
	`location` text,
	`number_of_flights` integer,
	`time_in_air` integer,
	`purpose` text,
	`additional_info` text,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `items` (
	`item_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`item_name` text NOT NULL,
	`category` text NOT NULL,
	`status` text,
	`purchase_price` integer,
	`purchase_date` text,
	`sale_price` integer,
	`sale_date` text,
	`additional_info` text,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `recovery_tokens` (
	`recovery_token_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`hashed_token` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`verified_email` integer DEFAULT false NOT NULL,
	`password` text NOT NULL,
	`password_salt` text NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `verification_tokens` (
	`verification_token_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`hashed_token` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `flight_sessions_public_flight_session_id_unique` ON `flight_sessions` (`public_flight_session_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `recovery_tokens_hashed_token_unique` ON `recovery_tokens` (`hashed_token`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `verification_tokens_hashed_token_unique` ON `verification_tokens` (`hashed_token`);