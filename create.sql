SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS godb;
CREATE DATABASE `godb`;
USE godb;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL DEFAULT '' COMMENT '用户名',
  `password` varchar(255) NOT NULL DEFAULT '' COMMENT '密码',
  `nickname` varchar(255) NOT NULL DEFAULT '' COMMENT '昵称',
  `sign` varchar(255) NOT NULL DEFAULT '' COMMENT '签名',
  `avatar` varchar(255) NOT NULL DEFAULT '' COMMENT '头像',

  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10001 DEFAULT CHARSET=utf8;

