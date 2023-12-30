CREATE DATABASE users;

use users;

CREATE TABLE users (
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email    VARCHAR(255) NOT NULL,
	affiliation		 VARCHAR(255) NOT NULL,
	secret_phrase  VARCHAR(255) NOT NULL,
    PRIMARY KEY (username)
);


INSERT INTO users

VALUES("GMiculek", "$2a$10$i0fZKoOXCzdhcUFu6hI6deATKrAgR98IDmuVxZl4fcLiMjYgQ8Tfi", "garrett.miculek@gmail.com", "CEO", "secretkey"),
("lo", "$2a$10$5VigcibeOHaIAsTkRPyPtOMRPSJk0pFAMjikGW0IIR796sN0kmL0y", "joshloganjohnston@gmail.com", "IT_Manager","secretkey"),
("slimjim", "$2a$10$qTlCKKmoemsoUw.EFpJwVeBLsJpLRaCaXHP/gRzavFFa0Ml4u4COW", "edgin.jeremy@gmail.com", "HR_Manager", "secretkey"),
("averie", "$2a$10$F381k79krIadQPD.L3NsRexxmIrSom7QbqBKZSqE/hcMb2slcHAD6", "averie.hardy@gmail.com", "HR_worker", "secretkey");