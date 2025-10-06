CREATE DATABASE IF NOT EXISTS `test_db`;

USE `test_db`;

DROP TABLE IF EXISTS `test`;

CREATE TABLE `test` (
  `id` int(9) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `score` int NULL,
  `time` int NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

INSERT INTO `test` ( `name`, `time`) VALUES ('Alex', '60');
INSERT INTO `test` ( `name`, `score`) VALUES ('John', '100');
INSERT INTO `test` ( `name`, `score`) VALUES ('Grace', '150');

CREATE TABLE `apiKeys` (
  `id` int(9) unsigned NOT NULL AUTO_INCREMENT,
  `game` varchar(100) NOT NULL,
  `apiKey` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

INSERT INTO `apiKeys` (`game`, `apiKey`) VALUES ('test', 'test-key') 