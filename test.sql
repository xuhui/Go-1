SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS mydb;
CREATE DATABASE `mydb`;
USE mydb;
SELECT VERSION(), CURRENT_DATE;

SELECT
 USER()
 ,\c

DROP TABLE IF EXISTS `websites`;
CREATE TABLE `websites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(20) NOT NULL DEFAULT '' COMMENT '站点名称',
  `url` varchar(255) NOT NULL DEFAULT '',
  `alexa` int(11) NOT NULL DEFAULT '0' COMMENT 'Alexa 排名',
  `country` char(10) NOT NULL DEFAULT '' COMMENT '国家',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

BEGIN;

INSERT INTO `websites` VALUES 
	('1', 'Google', 'https://www.google.cm/', '1', 'USA'),
	('2', '淘宝', 'https://www.taobao.com/', '13', 'CN'), 
	('3', '菜鸟教程', 'http://www.runoob.com/', '4689', 'CN'), 
	('4', '微博', 'http://weibo.com/', '20', 'CN'), 
	('5', 'Facebook', 'https://www.facebook.com/', '3', 'USA');

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;

DESCRIBE `websites`;

SHOW TABLES;

SELECT * FROM `websites`;

DROP TABLE IF EXISTS `cards`;
CREATE TABLE `cards`(
  `class` VARCHAR(255) NOT NULL DEFAULT '',
  `name` VARCHAR(255) NOT NULL DEFAULT '',
  `cardnumber` VARCHAR(255) NOT NULL DEFAULT '',
  `note` VARCHAR(255) NOT NULL DEFAULT '',
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
)ENGINE=InnoDB CHARSET=utf8;

DESCRIBE `cards`;
LOAD DATA LOCAL INFILE 'C:/Users/Administrator/Desktop/card.txt' INTO TABLE `cards` fields terminated by '\t' IGNORE 1 ROWS;
SELECT * FROM cards;