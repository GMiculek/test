CREATE DATABASE comments;

use comments;

CREATE TABLE comments (
	timestamped    VARCHAR(255) NOT NULL,
	commenter    VARCHAR(255) NOT NULL,
	affiliation		 VARCHAR(255) NOT NULL,
    comment_written 	 VARCHAR(255) NOT NULL, 
    
	
    PRIMARY KEY (timestamped)
);



