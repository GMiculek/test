
const express = require("express");
const mysql = require("mysql2");
var crypto = require("crypto");
var sha256 = require("js-sha256");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');

const PORT = String(process.env.PORT);
const HOST = String(process.env.HOST);
const MYSQLHOST = String(process.env.MYSQLHOST);
const MYSQLUSER = String(process.env.MYSQLUSER);
const MYSQLPASS = String(process.env.MYSQLPASS);


var dealing_through_users_database = require('knex')({
  client: "mysql2",
  connection: {
	  host: MYSQLHOST,
	  user: MYSQLUSER,
	  password: MYSQLPASS,
	  database: "users"  
  }
}); 

var dealing_through_logs_database = require('knex')({
  client: "mysql2",
  connection: {
	  host: MYSQLHOST,
	  user: MYSQLUSER,
	  password: MYSQLPASS,
	  database: "logs"
	  
  }
}); 

var dealing_through_comments_database = require('knex')({
  client: "mysql2",
  connection: {
	  host: MYSQLHOST,
	  user: MYSQLUSER,
	  password: MYSQLPASS,
	  database: "comments"
	  
  }
}); 



const app = express();
app.use(express.json());

app.use("/", express.static("frontend"));


var identification_id = 0;  //global variable to use as id number


app.post("/redirect", function (req, res) {
	
	var token_to_be_checked = JSON.stringify(req.body.passed_token); //pulls token
		
	token_to_be_checked = token_to_be_checked.substring(1); //removes quote marks about the token
	token_to_be_checked = token_to_be_checked.substring(0, token_to_be_checked.length - 1);
	
	jwt.verify(token_to_be_checked, "secret", (err) => { //verifys token 
		
		if(err){
			
			res.sendStatus(401); //send 401 error message if token can't be verified 
			res.end();
		}
	
		else{ //if token is verified 
		
			var payload = jwt_decode(token_to_be_checked);
			
			if(payload.name == "GMiculek" || payload.name == "lo" || payload.name == "averie" || payload.name == "slimjim" ){ //checks username
				
				res.send("2"); //sends user to query page
			}
			
			else{
				
				res.send("1");  //sends user to funfacts page
			}
			
		}
	})	
	res.end();	
})


app.post("/comment", function (req, res) {
	
	var comment_from_user = JSON.stringify(req.body.supplied_comment); //pulls comment and token passed 
	var token_to_be_checked = JSON.stringify(req.body.passed_token); 
	
	
	if(token_to_be_checked == '""'){ //if no token is passed 	
		res.sendStatus(401); 
		res.end();
		}
	
	else{ //if a token exists
	
		comment_from_user = comment_from_user.substring(1);
		comment_from_user = comment_from_user.substring(0, comment_from_user.length - 1); //removes quote marks about the comment
		
		token_to_be_checked = token_to_be_checked.substring(1); //removes quote marks about the token
		token_to_be_checked = token_to_be_checked.substring(0, token_to_be_checked.length - 1);
		
		
		const date = new Date(); //get timestamp
		
		
		jwt.verify(token_to_be_checked, "secret", (err) => { //verifys token 
		
			var payload = jwt_decode(token_to_be_checked);
		
			if(err){ //token can't be verified 
				
				res.sendStatus(401); //send 401 error message if token can't be verified 
				res.end();
			}
				
			else{ //if token can be verified 
		
				
				if(comment_from_user==""){ //if publish comment button was pressed, but no comment was written 
					dealing_through_comments_database.select("*").from("comments").asCallback(function(err, results) {
						if(err) {
			  
							console.error(error.message);
							res.status(500).send("database error"); //display error message if problem getting data back 
							res.end();
							
						} 
						
						else {
							 //sends back the comments database contents 
							res.send(results);
							res.end();
							}
						});
				}
		
				else{ //if publish comment button was pressed and a comment was written 
		
					dealing_through_comments_database("comments").insert([{ //inserts the data into the comments data base 
							timestamped: date,
							commenter: payload.name,
							affiliation: payload.affiliation,
							comment_written: comment_from_user, 
							}]).then(() => {
		
								dealing_through_comments_database.select("*").from("comments").asCallback(function(err, results) {
									if(err) {
										console.error(error.message);
										res.status(500).send("database error"); //display error message if problem getting data back 
										res.end();
										} 
						
									else {
									//sends back the comments database contents 
									res.send(results);
									res.end();
										}
								});
							})
				}
	
			}
		})
	}
})

app.get("/show_comments", function (req, res) {
	
	dealing_through_comments_database.select("*").from("comments").asCallback(function(err, results) {
		if(err) {
		  
			//console.error(error.message);
			res.send("Be the first to comment!");
			res.end();
						
			} 
					
		else {
		
				if(results==""){ //if no data is in database 
					res.send("Be the first to comment!");		
					}
						
				else{
						
					res.send(results); //send back the contents of the comments database
					res.end();
					}
				}
	});
	
})


app.post("/query", function (req, res) {
	
	var database_request = JSON.stringify(req.body.indicator);
	var token_to_be_checked = JSON.stringify(req.body.passed_token); 
		
	token_to_be_checked = token_to_be_checked.substring(1); //removes quote marks about the token
	token_to_be_checked = token_to_be_checked.substring(0, token_to_be_checked.length - 1);
	
	jwt.verify(token_to_be_checked, "secret", (err) => { //verifys token 
		
		if(err){
			
			res.sendStatus(401); //send 401 error message if token can't be verified 
			res.end();
		}
	
		else{ //if token is verified 
		
			var payload = jwt_decode(token_to_be_checked);
				
			if (database_request == 1){ //if the user wants data from the login attempts table
						
				if(payload.affiliation == "CEO" || payload.affiliation == "IT_Manager"){//if the ceo or the it manager is trying to access the data 
				
					dealing_through_logs_database.select("*").from("logs").asCallback(function(err, results) {
						
						if(err) {
			  
						console.error(error.message);
						res.status(500).send("database error"); //display error message if problem getting data back 
						res.end();
						} 
				
						else {
							 //sends back the database contents
							res.send(results);
							res.end();
							}
					});
					
				}
				
				else{  //if the user logged in isn't allowed to view the data 
				
				
					res.send("Not authorized to view that information"); 
					res.end();
				}
				
			}
			
			else if (database_request == 2){ //if the user wants to view the data from the user database 
				
				if(payload.affiliation == "CEO" || payload.affiliation == "HR_Manager" || payload.affiliation == "HR_worker"){ //if the user logged in is either the ceo, or part of human resources
					
					dealing_through_users_database.select("*").from("users").asCallback(function(err, results) {
					if(err) {
		  
						//console.error(error.message);
						res.status(500).send("database error"); //display error message if problem getting data back 
						res.end();
						
					} 
					
					else {
						 //sends back the database contents
						res.send(results);
						res.end();
						}
					});
									
				}
					
				else{
					
					res.send("Not authorized to view that information"); //if the user logged in isn't allowed to view the data 
					res.end();
					
				}
				
			}
					
			else{ //if no option was selected initially and query was press first
				
				res.send("Please select a database"); //send message
				res.end();
					
			}
			
		}
		
	})
  
});


app.post("/verify", function (req, res) {
	 
	var String_of_code = JSON.stringify(req.body.supplied_code); 
	
	var token_to_be_checked = JSON.stringify(req.body.passed_token); 
	
	
	if(token_to_be_checked == '""'){ //if tokwn doesn't exist
		
		res.sendStatus(401); 
			res.end();
	}
	
	else{ //if token does exist
	
	token_to_be_checked = token_to_be_checked.substring(1); //removes quote marks about the token
	token_to_be_checked = token_to_be_checked.substring(0, token_to_be_checked.length - 1);
	
	
	String_of_code = String_of_code.substring(1);
	String_of_code = String_of_code.substring(0, String_of_code.length - 1); //removes quotes around passed code
	
	var payload = jwt_decode(token_to_be_checked);
	
	
	jwt.verify(token_to_be_checked, "secret", (err) => { //verifys token 
		
		if(err){
			
			res.sendStatus(401); //send 401 error message if token can't be verified 
			res.end();
		}
			
		else{
			
			
			
			dealing_through_users_database.select('secret_phrase').from('users').where("username", String_of_user2).asCallback(function(err, results) {
					 
					
						
					 
				 //})
				 
			
			
			
			
			
			const secretkey = results[0].secret_phrase;
			//const secretkey = 'secretkey';
			const timestamp = JSON.stringify(Math.floor(Date.now() / 30000));
			const hash = crypto.createHmac('sha256', secretkey).update(timestamp).digest("hex"); //hash that changes every 30 seconds

			const subhash = hash.substring(0,6);		//only first 6 digits of code
			
			if(String_of_code.localeCompare(subhash) ==0){ //compares the hash generated with the hash supplied by the user, if match
			
			
				dealing_through_logs_database.update("verification", "success").where( "id_number", payload.id_number).from("logs").asCallback(function(err, results) { //updates log database, indicating that the user has been successfully verified 
			
			
					dealing_through_users_database.select('*').from('users').where("username", String_of_user2).asCallback(function(err, results) { //gets all data about the confirmed user
						
						the_user_contents = JSON.stringify(results)
									
						const myArray = the_user_contents.split(/[: ,"{""}"]+/);
					
						myArray.shift(); //drops quotes
						myArray.pop();
							
						const USER_INFO = { name: myArray[1], pass: myArray[3], email: myArray[5], affiliation:  myArray[7], secret_phrase: myArray[9]}
						
						const accessToken = jwt.sign(USER_INFO, "secret", { expiresIn: '600s'}); //creates a token with the username, password, email, affiliation. Will expire in 10 seconds
						
						console.log("Welcome " + String_of_user2);
						
										
						res.json({ Token: accessToken}) //sends back the token 
						res.end();
						});
								
					});
		
				}
		
			else{ //if hashs don't match
			
			res.sendStatus(401); 
			res.end();
			
			}
			})
		
		}
	
	})
}
})


app.post("/register", function (req, res) {

	 
	var String_of_user = JSON.stringify(req.body.supplied_user); 
	var String_of_pass = JSON.stringify(req.body.supplied_pass);
	var String_of_country = JSON.stringify(req.body.supplied_country);

	String_of_user = String_of_user.replace(/^"(.*)"$/, '$1');
	String_of_country = String_of_country.replace(/^"(.*)"$/, '$1');
	
	dealing_through_users_database.select('username').from('users').where("username", String_of_user).asCallback(function(err, results) { //searchs if username is already present in users database
	    
		if (results == ""){  //if username is not found in data base
	  
			bcrypt.hash(String_of_pass, 10, function(err, hash) {
				
				let r = (Math.random() + 1).toString(36).substring(7); //creates secret code to use
				
				
				 
				
			
				dealing_through_users_database("users").insert([{ //inserts the data into the log database
						
						username: String_of_user, 
						password: hash, 
						email: "none", 
						affiliation: String_of_country,
						secret_phrase: r,
				}])
					
			.then(() => {res.send("New User Registered. Save '" + r + "' as a secret key and use it as a command line argument to generate your verification code when logging in.")})
		})
	  
	  }
	  
	  else{ //if user is already present in the users database
		  
		


		res.send("User already registered")
		}
	 })
	 
})
	
	
app.post("/login", function (req, res) {
	 
	var String_of_user = JSON.stringify(req.body.supplied_user); 
	var String_of_pass = JSON.stringify(req.body.supplied_pass);

	var time_log = Math.floor(Date.now() / 1000); //gets current time stamp
	
	
	identification_id = identification_id +1; //increase id number by 1
	
	
	
	String_of_user2 = String_of_user.replace(/^"(.*)"$/, '$1');
  
    dealing_through_users_database.select('username').from('users').where("username", String_of_user2).asCallback(function(err, results) { //searchs if username is present in database
	    
	  if (results == ""){  //if username is not found in data base
	 
			if(String_of_pass == '""'){ //if user not found in data and no password provided
			
				log_attempts(identification_id, time_log, String_of_user2, "''", 'failure', 'cannot verify', ''); //run log function
				
			}
	 
			else{//if user not found in data and password provided, bycrypts password for log table
				
				bcrypt.hash(String_of_pass, 10, function(err, hash) { 
	
				log_attempts(identification_id, time_log, String_of_user2, hash, 'failure', 'cannot verify', ''); //run log function
				
				})
			}
				  
		  res.sendStatus(401); //send 401 error message
		  res.end();
		  
	  }
	  
	  else{ //if username was in data base 
		  
			if(String_of_pass == '""'){ //if no password was provided
				
				log_attempts(identification_id, time_log, String_of_user2, "''", 'cannot verify', 'failure', '');
				
			}
					
			else{
		  
		  
				bcrypt.hash(String_of_pass, 10, function(err, hash) { //brcypts the password 
				
				dealing_through_users_database.select('password').from('users').where("username", String_of_user2).asCallback(function(err, SQL_find_if_valid_passordRes) {
					
					const dbhash = SQL_find_if_valid_passordRes[0].password;
						
					bcrypt.compare(String_of_pass, dbhash, function(err, result) { //compares the password to the bcrypy hash
						
						if (result) { //if they match
							
							dealing_through_users_database.select('*').from('users').where("username", String_of_user2).asCallback(function(err, results) { //gets all data about the confirmed user
					
							the_user_contents = JSON.stringify(results)
					
					
							const myArray = the_user_contents.split(/[: ,"{""}"]+/);
					
					
							myArray.shift(); //drops quotes
							myArray.pop();
					
							const USER_ID = { id_number: identification_id}
						
							const accessToken = jwt.sign(USER_ID, "secret"); //creates a token with the username, password, email, affiliation. Will expire in 10 seconds
							
							log_attempts(identification_id, time_log, String_of_user2, dbhash, 'success', 'cannot verify', "10 seconds"); //run log function
							
							res.json({ Token: accessToken }) //sends back the token 
							res.end();
							});
							
							}
						
						else{ //if they don't match
						
							log_attempts(identification_id, time_log, String_of_user2, hash, 'failure', 'cannot verify', ''); //run log function
							res.sendStatus(401); //send 401 error message
							res.end();
										
							}
						
					});
		
				})
  
			})
	  
		}
	  
	  }
  })
  
});

function log_attempts(IDnum, TimeIn, Username, Passhash, YorN, Verfying,  Token){ //log function 
	
					var values = [
					
					[IDnum, TimeIn, Username, Passhash, YorN, Token]
					
					]; 
					
					
					dealing_through_logs_database("logs").insert([{ //inserts the data into the log database
						id_number: IDnum,
						time_in: TimeIn, 
						username: Username, 
						password: Passhash, 
						log_attempt: YorN, 
						verification: Verfying,
						token_length: Token}
						])
						.then(() => {console.log("logged attempt")})
						
						
}


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);