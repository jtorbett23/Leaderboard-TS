CREATE DATABASE IF NOT EXISTS `test_db`;

USE `test_db`;

DROP TABLE IF EXISTS `test`;

CREATE TABLE `test` (
  `id` int(9) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `score` varchar(100) NULL,
  `time` varchar(100) NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


INSERT INTO `test` ( `name`, `score`) VALUES ('John', '100');
