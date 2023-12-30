CREATE DATABASE logs;

use logs;

CREATE TABLE logs (
	id_number    VARCHAR(255),
    time_in 	 VARCHAR(255), 
    username 	 VARCHAR(255),
    password     VARCHAR(255),
	log_attempt  VARCHAR(255) NOT NULL,
	verification VARCHAR(255),
	token_length VARCHAR(255),
	
    PRIMARY KEY (id_number)
);



