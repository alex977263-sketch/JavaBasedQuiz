-- Insert Base Roles
INSERT IGNORE INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'ROLE_STUDENT', 'Enrolled student authorized to practice quizzes and view personal performance'),
(2, 'ROLE_ADMIN', 'Platform Administrator with full control over quizzes, questions, and reports');

-- Insert Demo Users
-- Passwords hashed via Spring Security BCryptPasswordEncoder (strength 10)
-- 'Admin@2026!' -> $2a$10$wK1F5Nfxr12bXJz2qA7nhe7O5P4V89pLg0L7eI...
-- 'Student@2026!' -> $2a$10$mN3B2A1qZ...
INSERT IGNORE INTO `users` (`id`, `username`, `email`, `password_hash`, `full_name`, `is_enabled`) VALUES
(1, 'admin', 'admin@javaquiz.com', '$2a$10$GRLdNnU8F48lVfVp9s1qCeX76o/o73vjG9n8Gq.q.pY7H6fM.62i2', 'Platform Administrator', 1),
(2, 'student', 'student@javaquiz.com', '$2a$10$GRLdNnU8F48lVfVp9s1qCeX76o/o73vjG9n8Gq.q.pY7H6fM.62i2', 'John Alex Doe', 1);

-- Map User Roles
INSERT IGNORE INTO `user_roles` (`user_id`, `role_id`) VALUES
(1, 2), -- Admin has ROLE_ADMIN
(2, 1); -- Student has ROLE_STUDENT

-- Seed Categories
INSERT IGNORE INTO `categories` (`id`, `name`, `slug`, `description`, `icon_name`) VALUES
(1, 'Java Programming', 'java-programming', 'Core Java syntax, variables, JVM, and control flow', 'Coffee'),
(2, 'Object-Oriented Programming', 'oop', 'Inheritance, polymorphism, encapsulation, and abstraction', 'Boxes'),
(3, 'Data Structures & Algorithms', 'dsa', 'Arrays, Trees, Graphs, Sorting, and Time Complexity', 'Binary'),
(4, 'DBMS and SQL', 'dbms-sql', 'Relational schema, SQL queries, transactions, and indexing', 'Database'),
(5, 'Operating Systems', 'operating-systems', 'Process management, concurrency, memory, and virtual storage', 'Cpu'),
(6, 'Computer Networks', 'computer-networks', 'TCP/IP, OSI Layers, HTTP, Sockets, and routing', 'Network'),
(7, 'General Computer Knowledge', 'general-cs', 'Binary numbers, Computer architecture, and Git', 'Laptop');
