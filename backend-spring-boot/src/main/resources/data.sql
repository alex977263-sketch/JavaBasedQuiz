-- Insert Base Roles
INSERT IGNORE INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'ROLE_ADMIN', 'Platform Administrator with full control over user accounts, quiz approval, and settings'),
(2, 'ROLE_CREATOR', 'Quiz Creator authorized to author quizzes, review results, and interact with participants'),
(3, 'ROLE_PARTICIPANT', 'Participant authorized to take timed quizzes, review performance reports, and contact creators');

-- Insert Demo Users
-- Passwords hashed via Spring Security BCryptPasswordEncoder (strength 10)
INSERT IGNORE INTO `users` (`id`, `username`, `email`, `password_hash`, `full_name`, `college_or_company`, `is_enabled`) VALUES
(1, 'admin', 'admin@javaquiz.com', '$2a$10$GRLdNnU8F48lVfVp9s1qCeX76o/o73vjG9n8Gq.q.pY7H6fM.62i2', 'Administrator', 'Faculty of Software Systems', 1),
(2, 'creator', 'creator@javaquiz.com', '$2a$10$GRLdNnU8F48lVfVp9s1qCeX76o/o73vjG9n8Gq.q.pY7H6fM.62i2', 'Prof. James Gosling', 'Java Curriculum Lead', 1),
(3, 'participant', 'participant@javaquiz.com', '$2a$10$GRLdNnU8F48lVfVp9s1qCeX76o/o73vjG9n8Gq.q.pY7H6fM.62i2', 'Rahul Sharma', 'Computer Science & Engineering', 1);

-- Map User Roles
INSERT IGNORE INTO `user_roles` (`user_id`, `role_id`) VALUES
(1, 1),
(2, 2),
(3, 3);

-- Seed Categories
INSERT IGNORE INTO `categories` (`id`, `name`, `slug`, `description`, `icon_name`) VALUES
(1, 'Java Programming', 'java-programming', 'Core Java syntax, variables, data types, loops, JVM internals, and fundamentals.', 'Coffee'),
(2, 'Object-Oriented Programming', 'oop', 'Encapsulation, inheritance, polymorphism, abstraction, and design principles in Java.', 'Boxes'),
(3, 'Data Structures & Algorithms', 'dsa', 'Arrays, LinkedLists, Trees, Hash tables, sorting, searching, and computational complexity.', 'Binary'),
(4, 'DBMS and SQL', 'dbms-sql', 'Relational database concepts, normalization, SQL queries, indexing, and ACID transactions.', 'Database'),
(5, 'Operating Systems', 'operating-systems', 'Processes, threads, CPU scheduling, synchronization, memory management, and deadlock.', 'Cpu'),
(6, 'Computer Networks', 'computer-networks', 'OSI/TCP-IP models, sockets, routing protocols, DNS, HTTP/HTTPS, and network security.', 'Network'),
(7, 'General Computer Knowledge', 'general-cs', 'Computer architecture, binary arithmetic, software engineering methodologies, and git.', 'Laptop');

-- Seed Default System Settings
INSERT IGNORE INTO `system_settings` (`id`, `platform_title`, `default_duration_minutes`, `default_passing_percentage`, `auto_approve_quizzes`, `allow_participant_interactions`, `registration_open`, `maintenance_mode`, `system_announcement`) VALUES
(1, 'Java-Based Online Quiz Platform', 15, 70, 0, 1, 1, 0, 'Welcome to JavaQuiz Platform! Timed quizzes and performance reports are active.');
