-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 01, 2023 at 04:01 PM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `railway`
--

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id_customers` int(8) NOT NULL,
  `name` varchar(128) NOT NULL,
  `email` varchar(128) NOT NULL,
  `phone` varchar(128) NOT NULL,
  `isDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id_customers`, `name`, `email`, `phone`, `isDeleted`) VALUES
(1, 'Novaria Lesley', 'novarias@mail.com', '081329025868', 0),
(2, 'Valentine Layla', 'valentina@mail.com', '081329022889', 0),
(3, 'Kathryn Fern', 'kathryn@mail.com', '0813290258', 0),
(4, 'Virginia Veer', 'virginia@mail.com', '081329021111', 0),
(5, 'Constance Lee', 'constance@mail.com', '0813290584212', 0),
(6, 'Melanie Mollies', 'melanie@mail.com', '0813290581231', 0),
(7, 'Leila Aysha', 'leilla@mail.com', '0812382738211', 0),
(8, 'Kitty Cleos', 'kitty@mail.com', '08132908513', 0),
(9, 'Vanessa Rosa', 'vanessa@mail.com', '0813290258421', 0),
(10, 'Alexis Olivera', 'alexis@mail.com', '081329058475', 0),
(12, 'Miya Valentina', 'miya@mail.com', '0813297412333', 0),
(13, 'Edith Juliana', 'edith@mail.com', '0813292717255', 0),
(14, 'Lylia Lynia', 'lylia@mail.com', '0813295717432', 0),
(15, 'Catherine Karina', 'catherine@mail.com', '08132905849', 0),
(16, 'Kylian Kyle', 'kylian@mail.com', '081329285822', 0),
(17, 'Jule July', 'jule@mail.com', '081273657222', 0),
(18, 'Abigail Caily', 'abigail@mail.com', '089123823811', 0),
(19, 'Bella Belinda', 'bella@mail.com', '0813290258422', 0),
(20, 'Senna Derulo', 'senna@mail.com', '0813902832322', 0),
(21, 'Alexia Romanio', 'alexia@mail.com', '081230921037822', 0),
(22, 'Shizuka Sora', 'shizuka@mail.com', '081390283222', 0),
(23, 'Rubelski Adolfski', 'rubelski@mail.com', '08132902584722', 0),
(24, 'Cylin Lyn', 'cylin@mail.com', '08132902584720', 0),
(25, 'Melody Anin', 'melody@mail.com', '081329028411', 0),
(26, 'Katherine Katlyna', 'katherine@mail.com', '0801329025848', 0),
(27, 'Jennifer Luan', 'jennifer@mail.com', '0814929108188', 0),
(28, 'Mona Le', 'mona@mail.com', '081320328111', 0),
(29, 'Ling Ko', 'ling@mail.com', '081329025811', 0),
(30, 'Oliver Wang', 'oliver@mail.com', '081329012382', 0),
(31, 'Poca Po', 'poca@mail.com', '081392382221', 0),
(32, 'Rosa Maxx', 'rosa@mail.com', '0813290258429', 0),
(33, 'Alexia Romania', 'elkxa@mail.com', '081230921037821', 0),
(36, 'Coba lagi', 'lagi@mail.com', '09812312', 0),
(37, 'abc', 'abc@gmail.com', '082227472742', 0),
(38, 'absduadbau', 'ashdaudhsau@mail.com', '08132908888', 1),
(39, 'Pou Ko', 'pou@mail.com', '08132902822', 0);

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id_expense` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `total_expense` varchar(128) NOT NULL,
  `issued_date` date DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id_expense`, `product_id`, `quantity`, `total_expense`, `issued_date`, `isDeleted`) VALUES
(1, 1, 50, '750000', '2023-11-01', 0),
(2, 3, 21, '147000', '2023-11-02', 0),
(3, 2, 24, '120000', '2023-11-03', 0),
(4, 4, 66, '330000', '2023-11-04', 0),
(5, 5, 11, '88000', '2023-11-05', 0),
(6, 6, 73, '584000', '2023-11-05', 0),
(7, 7, 8, '64000', '2023-11-14', 0),
(8, 7, 12, '96000', '2023-11-15', 0),
(10, 5, 22, '176000', '2023-11-16', 0),
(11, 3, 22, '154000', '2023-11-16', 0),
(12, 7, 23, '184000', '2023-11-17', 0),
(13, 3, 1, '7000', '2023-11-22', 0),
(14, 4, 16, '80000', '2023-11-22', 0),
(15, 5, 19, '152000', '2023-11-22', 0),
(16, 2, 27, '135000', '2023-11-29', 0);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id_product` int(8) NOT NULL,
  `name_product` varchar(128) NOT NULL,
  `price_product` varchar(64) NOT NULL,
  `quantity_product` int(11) NOT NULL,
  `isDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id_product`, `name_product`, `price_product`, `quantity_product`, `isDeleted`) VALUES
(1, 'Makarizo Hair Mask', '15000', 36, 0),
(2, 'Makarizo Shampoo', '5000', 32, 0),
(3, 'Makarizo Keratin Shampoo', '7000', 32, 0),
(4, 'Makarizo Conditioner', '5000', 51, 0),
(5, 'Makarizo Hair Vitamin', '8000', 68, 0),
(6, 'Makarizo Hair Tonic ', '8000', 36, 0),
(7, 'Makarizo Hair Spa', '8000', 23, 0),
(8, 'Coba', '122', 0, 1),
(9, 'Ab', '222', 66, 1);

-- --------------------------------------------------------

--
-- Table structure for table `serviceproducts`
--

CREATE TABLE `serviceproducts` (
  `id` int(11) NOT NULL,
  `service_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `serviceproducts`
--

INSERT INTO `serviceproducts` (`id`, `service_id`, `product_id`, `isDeleted`) VALUES
(5, 2, 3, 0),
(6, 2, 4, 0),
(7, 2, 5, 0),
(8, 2, 6, 0),
(9, 3, 5, 0),
(10, 3, 6, 0),
(11, 3, 4, 0),
(12, 3, 2, 0),
(13, 4, 3, 0),
(14, 4, 4, 0),
(15, 4, 5, 0),
(16, 4, 6, 0),
(17, 5, 1, 0),
(18, 5, 5, 0),
(19, 5, 6, 0),
(20, 6, 1, 0),
(21, 6, 5, 0),
(22, 6, 6, 0),
(29, 1, 2, 0),
(30, 1, 4, 0),
(31, 1, 5, 0),
(32, 1, 6, 0),
(103, 12, 2, 1),
(106, 15, 1, 1),
(109, 7, 1, 0),
(110, 7, 5, 0),
(111, 7, 7, 1);

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id_service` int(8) NOT NULL,
  `name_service` varchar(128) NOT NULL,
  `price_service` varchar(64) NOT NULL,
  `isDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id_service`, `name_service`, `price_service`, `isDeleted`) VALUES
(1, 'Cuci Blow / Catok Shampoo Biasa', '35000', 0),
(2, 'Cuci Blow / Catok Silver / Keratin Shampoo', '50000', 0),
(3, 'Cuci Curly Shampoo Biasa', '35000', 0),
(4, 'Cuci Curly Silver / Keratin Shampoo', '55000', 0),
(5, 'Creambath', '65000', 0),
(6, 'Hair Mask', '75000', 0),
(7, 'Hair Spa', '95000', 0),
(12, 'BuildProd Dummy', '555', 1),
(15, 'uuu', '8888', 1);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id_transactions` int(8) NOT NULL,
  `name` varchar(128) NOT NULL,
  `name_service` varchar(128) NOT NULL,
  `price_service` varchar(64) NOT NULL,
  `quantity` varchar(8) NOT NULL,
  `issued_transactions` date NOT NULL,
  `total_transactions` varchar(128) NOT NULL,
  `id_customers` int(8) NOT NULL,
  `id_users` int(8) NOT NULL,
  `isDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id_transactions`, `name`, `name_service`, `price_service`, `quantity`, `issued_transactions`, `total_transactions`, `id_customers`, `id_users`, `isDeleted`) VALUES
(1, 'Katherine Katlyna', 'Cuci Blow / Catok Shampoo Biasa', '35000', '12', '2023-11-01', '420000', 26, 1, 0),
(2, 'Kathryn Fern', 'Cuci Blow / Catok Silver / Keratin Shampoo', '50000', '1', '2023-11-01', '50000', 3, 1, 0),
(3, 'Constance Lee', 'Cuci Blow / Catok Silver / Keratin Shampoo', '50000', '1', '2023-11-01', '50000', 5, 1, 0),
(4, 'Kathryn Fern', 'Cuci Curly Shampoo Biasa', '35000', '1', '2023-11-04', '35000', 3, 1, 0),
(5, 'Novaria Lesley', 'Cuci Curly Silver / Keratin Shampoo', '55000', '1', '2023-11-05', '55000', 1, 1, 0),
(6, 'Novaria Lesley', 'Creambath', '65000', '1', '2023-11-06', '65000', 1, 1, 0),
(7, 'Novaria Lesley', 'Hair Mask\nHair Spa', '75000\n95000', '1\n1', '2023-11-06', '170000', 1, 1, 0),
(8, 'Novaria Lesley', 'Cuci Blow / Catok Shampoo Biasa', '35000', '4', '2023-11-07', '140000', 1, 1, 0),
(9, 'Novaria Lesley', 'Cuci Curly Shampoo Biasa', '35000', '3', '2023-11-07', '105000', 1, 1, 0),
(10, 'Novaria Lesley', 'Creambath', '65000', '1', '2023-11-07', '65000', 1, 1, 0),
(11, 'Novaria Lesley', 'Creambath', '65000', '1', '2023-11-14', '65000', 1, 1, 0),
(12, 'Novaria Lesley', 'Cuci Blow / Catok Silver / Keratin Shampoo', '50000', '1', '2023-11-14', '50000', 1, 1, 0),
(13, 'Novaria Lesley', 'Cuci Blow / Catok Shampoo Biasa', '35000', '1', '2023-11-14', '35000', 1, 1, 0),
(14, 'Kathryn Fern', 'Cuci Blow / Catok Silver / Keratin Shampoo', '50000', '1', '2023-11-14', '50000', 3, 1, 0),
(15, 'Novaria Lesley', 'Cuci Blow / Catok Shampoo Biasa', '35000', '1', '2023-11-16', '35000', 1, 1, 0),
(16, 'Novaria Lesley', 'Cuci Blow / Catok Silver / Keratin Shampoo', '50000', '1', '2023-11-16', '50000', 1, 1, 0),
(17, 'Novaria Lesley', 'Cuci Blow / Catok Shampoo Biasa', '35000', '1', '2023-11-16', '35000', 1, 1, 0),
(18, 'Novaria Lesley', 'Cuci Curly Silver / Keratin Shampoo', '55000', '1', '2023-11-16', '55000', 1, 1, 0),
(19, 'Valentine Layla', 'Cuci Blow / Catok Shampoo Biasa', '35000', '1', '2023-11-16', '35000', 2, 1, 0),
(20, 'Novaria Lesley', 'Cuci Blow / Catok Silver / Keratin Shampoo', '50000', '1', '2023-11-16', '50000', 1, 1, 0),
(21, 'Novaria Lesley', 'Hair Spa', '95000', '1', '2023-11-16', '95000', 1, 1, 0),
(22, 'Novaria Lesley', 'Creambath', '65000', '1', '2023-11-16', '65000', 1, 1, 0),
(23, 'Novaria Lesley', 'Cuci Curly Silver / Keratin Shampoo', '55000', '1', '2023-11-16', '55000', 1, 1, 0),
(24, 'Novaria Lesley', 'Cuci Blow / Catok Silver / Keratin Shampoo', '50000', '1', '2023-11-16', '50000', 1, 1, 0),
(25, 'Valentine Layla', 'Cuci Curly Shampoo Biasa', '35000', '1', '2023-11-16', '35000', 2, 1, 0),
(26, 'Kathryn Fern', 'Hair Mask', '75000', '1', '2023-11-16', '75000', 3, 1, 0),
(27, 'Alexia Romanio', 'Hair Mask', '75000', '2', '2023-11-16', '150000', 21, 1, 0),
(28, 'Novaria Lesley', 'Cuci Blow / Catok Shampoo Biasa', '35000', '1', '2023-11-16', '35000', 1, 1, 0),
(29, 'Valentine Layla', 'Cuci Curly Silver / Keratin Shampoo', '55000', '1', '2023-11-16', '55000', 2, 1, 0),
(30, 'Virginia Veer', 'Hair Spa', '95000', '1', '2023-11-16', '95000', 4, 1, 0),
(31, 'Valentine Layla', 'Cuci Blow / Catok Shampoo Biasa', '35000', '1', '2023-11-16', '35000', 2, 1, 0),
(32, 'Novaria Lesley', 'Cuci Curly Shampoo Biasa', '35000', '1', '2023-11-16', '35000', 1, 1, 0),
(33, 'Novaria Lesley', 'Hair Spa', '95000', '1', '2023-11-16', '95000', 1, 1, 0),
(34, 'Virginia Veer', 'Hair Spa', '95000', '1', '2023-11-16', '95000', 4, 1, 0),
(35, 'Kathryn Fern', 'Hair Spa', '95000', '1', '2023-11-16', '95000', 3, 1, 0),
(36, 'Novaria Lesley', 'Hair Spa', '95000', '1', '2023-11-16', '95000', 1, 1, 0),
(37, 'Novaria Lesley', 'Cuci Blow / Catok Silver / Keratin Shampoo', '50000', '1', '2023-11-16', '50000', 1, 1, 0),
(38, 'Valentine Layla', 'Hair Mask', '75000', '1', '2023-11-16', '75000', 2, 1, 0),
(39, 'Novaria Lesley', 'Hair Spa', '95000', '1', '2023-11-16', '95000', 1, 1, 0),
(40, 'Valentine Layla', 'Hair Spa', '95000', '1', '2023-11-16', '95000', 2, 1, 0),
(41, 'Oliver Wang', 'Creambath', '65000', '1', '2023-11-19', '65000', 30, 1, 0),
(42, 'Novaria Lesley', 'Cuci Blow / Catok Shampoo Biasa', '35000', '1', '2023-11-21', '35000', 1, 1, 0),
(43, 'Valentine Layla', 'Cuci Blow / Catok Silver / Keratin Shampoo', '50000', '3', '2023-11-22', '150000', 2, 1, 0),
(44, 'Kathryn Fern', 'Cuci Blow / Catok Shampoo Biasa', '35000', '10', '2023-11-22', '350000', 3, 1, 0),
(45, 'Valentine Layla', 'Cuci Blow / Catok Silver / Keratin Shampoo', '50000', '1', '2023-11-28', '50000', 2, 1, 0),
(46, 'Kathryn Fern', 'Cuci Blow / Catok Shampoo Biasa', '35000', '1', '2023-11-28', '35000', 3, 1, 0),
(47, 'Novaria Lesley', 'Cuci Blow / Catok Silver / Keratin Shampoo', '50000', '1', '2023-11-29', '50000', 1, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_users` int(8) NOT NULL,
  `firstname` varchar(128) NOT NULL,
  `lastname` varchar(128) NOT NULL,
  `username` varchar(128) NOT NULL,
  `password` varchar(128) NOT NULL,
  `role` varchar(128) NOT NULL,
  `isDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_users`, `firstname`, `lastname`, `username`, `password`, `role`, `isDeleted`) VALUES
(1, 'Super', 'Admin', 'admin', 'admin', 'Admin', 0),
(2, 'Cashier', 'Cashier', 'cashier', 'cashier', 'Cashier', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id_customers`),
  ADD UNIQUE KEY `unique_name` (`name`),
  ADD UNIQUE KEY `unique_email` (`email`),
  ADD UNIQUE KEY `unique_phone` (`phone`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id_expense`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id_product`),
  ADD UNIQUE KEY `unique_product_name` (`name_product`);

--
-- Indexes for table `serviceproducts`
--
ALTER TABLE `serviceproducts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service_id` (`service_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id_service`),
  ADD UNIQUE KEY `unique_service_name` (`name_service`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id_transactions`),
  ADD KEY `name_service` (`name_service`),
  ADD KEY `name` (`name`),
  ADD KEY `id_customers` (`id_customers`),
  ADD KEY `price_service` (`price_service`),
  ADD KEY `id_users` (`id_users`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_users`),
  ADD KEY `role` (`role`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id_customers` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id_expense` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id_product` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `serviceproducts`
--
ALTER TABLE `serviceproducts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id_service` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id_transactions` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_users` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id_product`);

--
-- Constraints for table `serviceproducts`
--
ALTER TABLE `serviceproducts`
  ADD CONSTRAINT `serviceproducts_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id_service`),
  ADD CONSTRAINT `serviceproducts_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id_product`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
