SHOW DATABASES;

CREATE DATABASE go_taipei;
DROP DATABASE go_taipei;
USE go_taipei;

SHOW TABLES;

CREATE TABLE attractions(
	aid INT PRIMARY KEY AUTO_INCREMENT,
	id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    description VARCHAR(5000) NOT NULL,
    address VARCHAR(255) NOT NULL,
    transport VARCHAR(1000) NOT NULL,	
    mrt_id INT NOT NULL,
    lat VARCHAR(255) NOT NULL,
    lng VARCHAR(255) NOT NULL
);

CREATE TABLE categories(
	cid INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(255) NOT NULL
);

CREATE TABLE mrts(
	mid INT PRIMARY KEY AUTO_INCREMENT,
    mrt_name VARCHAR(255)
);

CREATE TABLE images(
	pid INT PRIMARY KEY AUTO_INCREMENT,
	iid INT NOT NULL,
    url text NOT NULL
);


SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));
SET GLOBAL group_concat_max_len=100000;

SELECT * FROM attractions;
SELECT * FROM categories;
SELECT * FROM mrts;
SELECT * FROM images;


DROP TABLE attractions;
DROP TABLE categories;
DROP TABLE mrts;
DROP TABLE images;



CREATE TABLE users( 
	uuid VARCHAR(255) PRIMARY KEY NOT NULL, 
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM users;

DROP TABLE users;



CREATE TABLE bookings(
	bid INT PRIMARY KEY AUTO_INCREMENT, 
    uuid VARCHAR(255) NOT NULL, 
	attraction_id VARCHAR(255) NOT NULL,
    date VARCHAR(255) NOT NULL,
    time VARCHAR(255) NOT NULL,
    price INT NOT NULL,
	create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM bookings;

DROP TABLE bookings;


CREATE TABLE payment( 
	payment_id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(255) NOT NULL,
    uuid VARCHAR(255),
    total_price INT NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(255) NOT NULL,
    status BOOLEAN,
    time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
DROP TABLE payment;
SELECT * FROM payment;
SELECT LAST_INSERT_ID();
SELECT LAST_INSERT_ID(payment_id) from payment order by LAST_INSERT_ID(payment_id) DESC LIMIT 1;


CREATE TABLE trips( 
	tid INT NOT NULL,
    trip_order_number VARCHAR(255) NOT NULL,
    attraction_id VARCHAR(255) NOT NULL,
    attraction_name VARCHAR(255) NOT NULL,
    attraction_address VARCHAR(255) NOT NULL,
    attraction_image VARCHAR(255) NOT NULL,
    attraction_price INT NOT NULL,
    attraction_date VARCHAR(255) NOT NULL,
    attraction_time VARCHAR(255) NOT NULL
);
DROP TABLE trips;
SELECT * FROM trips;

SELECT * FROM payment AS p INNER JOIN trips AS t ON p.payment_id=t.tid AND p.order_number=t.trip_order_number 
WHERE uuid='c838e436-f956-46dc-942d-d7b6a71a3f0f';

SET GLOBAL time_zone = '+8:00';
SELECT @@global.time_zone;