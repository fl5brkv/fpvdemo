CREATE TABLE `batteries` (
	`battery_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`item_id` integer NOT NULL,
	`charge_cycles` real DEFAULT 0 NOT NULL,
	`fully_charged_days` real DEFAULT 0 NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`item_id`) REFERENCES `items`(`item_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `drone_components` (
	`drone_component_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`item_id` integer NOT NULL,
	`drone_id` integer,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`item_id`) REFERENCES `items`(`item_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`drone_id`) REFERENCES `drones`(`drone_id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `drones` (
	`drone_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`item_id` integer NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`item_id`) REFERENCES `items`(`item_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `flight_sessions` (
	`flight_session_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`datetime_start` text,
	`datetime_end` text,
	`location` text,
	`lat` integer,
	`lng` integer,
	`number_of_flights` integer DEFAULT 1 NOT NULL,
	`time_in_air` integer,
	`purpose` text,
	`additional_info` text,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `fpv_drones` (
	`fpv_drone_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`drone_id` integer NOT NULL,
	`custom_build` integer DEFAULT false NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`drone_id`) REFERENCES `drones`(`drone_id`) ON UPDATE no action ON DELETE cascade
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
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `items_to_flight_sessions` (
	`item_id` integer NOT NULL,
	`flight_session_id` integer NOT NULL,
	PRIMARY KEY(`item_id`, `flight_session_id`),
	FOREIGN KEY (`item_id`) REFERENCES `items`(`item_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`flight_session_id`) REFERENCES `flight_sessions`(`flight_session_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`profile_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`username` text,
	`country` text,
	`currency_code` text DEFAULT 'USD' NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
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
	`hashed_password` text NOT NULL,
	`password_salt` text NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
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
CREATE UNIQUE INDEX `profiles_username_unique` ON `profiles` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `recovery_tokens_hashed_token_unique` ON `recovery_tokens` (`hashed_token`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `verification_tokens_hashed_token_unique` ON `verification_tokens` (`hashed_token`);