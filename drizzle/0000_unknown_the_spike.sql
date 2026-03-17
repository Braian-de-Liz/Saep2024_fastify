CREATE TABLE `tasks` (
	`id_task` serial AUTO_INCREMENT NOT NULL,
	`id_usuario` int NOT NULL,
	`descricao_tarefa` varchar(255) NOT NULL,
	`nome_setor` varchar(100) NOT NULL,
	`prioridade` enum('baixa','média','alta') NOT NULL,
	`data_cadastro` timestamp NOT NULL DEFAULT (now()),
	`status` enum('a fazer','fazendo','pronto') NOT NULL DEFAULT 'a fazer',
	CONSTRAINT `tasks_id_task` PRIMARY KEY(`id_task`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`nome` varchar(87) NOT NULL,
	`senha` varchar(14) NOT NULL,
	`email` varchar(255) NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_id_usuario_users_id_fk` FOREIGN KEY (`id_usuario`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;