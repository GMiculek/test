var parsedUrl = new URL(window.location.href);


var indicator = 0; //global indicator that will determine which database


function returnto() {
	
	indicator = 0;
	location.replace('/index.html'); //returns back to the login page and changes global variable back
}


function logsdatabase() {
	
	indicator = 1; //changes global variable to 1, which will indicate that the logged user wants to view the logs data base
	
}

function userdatabase() {
	
	indicator = 2; //changes global variable to 2, which will indicate that the logged user wants to view the user data base
	
}

function query() {
	
	var passed_token =JSON.stringify(window.location.href);
			
	passed_token = passed_token.substring(38); //pulls url and substrings the url to get the token 
	passed_token = passed_token.substring(0, passed_token.length - 1);
		
		
	
	const info = { passed_token, indicator } //token and global variable
	
	fetch("http://" + parsedUrl.host + "/query", {
		
		method: "POST",
		headers: {
             "Content-Type": "application/json",
            },
        body: JSON.stringify(info), //passes the token and the global indicator value back to verify 
			
	})
	
	.then((resp) => resp.text()) //converts repsonse to text form 
		
	.then((data) => {
		
	
		document.getElementById("response").innerHTML = data; //displays the content of the data base, or the unauthorized message (depending if the token is valid, or if user has clearance to view data contents)
				
		
	})
	
    .catch((err) => {
        console.log(err);
    })
	
}


function register(){
	
	location.replace('/register.html'); //moves to the register page
	
}


function registerUser(){ //adds new user and password
	
	const supplied_user = document.getElementById("given_username").value; //gets entered user and password
	const supplied_pass = document.getElementById("given_password").value; 
	const supplied_country = document.getElementById("given_country").value; 
	
	const info = {supplied_user, supplied_pass, supplied_country} //information to be sent

	fetch("http://" + parsedUrl.host + "/register", {
        method: "POST",
		headers: {
             "Content-Type": "application/json",
            },
        body: JSON.stringify(info), //passes the inputted info to the server 
	})
	
	.then((resp) => resp.text()) //converts repsonce to text form 
		
	.then((data) => {

		document.getElementById("show_message").innerHTML = JSON.stringify(data);
	})

}


function funfacts(){
	
	location.replace('/funfacts.html'); //changes to the fun facts page, this button is on the login page  
	
}


function funfacts2(){
	
	var passed_token =JSON.stringify(window.location.href); //changes to the fun facts page with the token, this button is in the query page 
			
	passed_token = passed_token.substring(38); //pulls url and substrings the url to get the token 
	passed_token = passed_token.substring(0, passed_token.length - 1);

	var params = new URLSearchParams();
	params.append("Token", passed_token);
								
	location.href = "/funfacts.html?" + params.toString() ;
	
}


function login(){
		
	const supplied_user = document.getElementById("given_username").value; //gets entered user and password
	const supplied_pass = document.getElementById("given_password").value; 
	
	const info = {supplied_user, supplied_pass} //information to be sent

	fetch("http://" + parsedUrl.host + "/login", {
        method: "POST",
		headers: {
             "Content-Type": "application/json",
            },
        body: JSON.stringify(info), //passes the inputted info to the server 
		
    })
	
	
	.then((resp) => resp.text()) //converts repsonce to text form 
		
	.then((data) => {
		
		if('"Unauthorized"' != JSON.stringify(data)){ //if username and password is accepted 
						
				var recieved_token = JSON.stringify(data) 
				
				recieved_token = recieved_token.substring(0, recieved_token.length - 4);
				
				recieved_token = recieved_token.substring(14); //substrings the token to the desired format
				
				
				var params = new URLSearchParams();
				params.append("Token", recieved_token);
				
				
				location.href = "/verify.html?" + params.toString() ; //changes url to verify page with the token in the url 
						
		}
		
		else{
			
			document.getElementById("show_message").innerHTML = JSON.stringify(data); //shows error message in text box
			
		}
		
    })
	
    .catch((err) => {
        console.log(err);
    })
	
}

function verify(){
	
	var passed_token =JSON.stringify(window.location.href);
			
	passed_token = passed_token.substring(39); //pulls url and substrings the url to get the token 
	passed_token = passed_token.substring(0, passed_token.length - 1);
	
	
		
	const supplied_code = document.getElementById("given_code").value; //gets code provided in text box
	
	
	const info = {supplied_code, passed_token} //information to be sent

	fetch("http://" + parsedUrl.host + "/verify", {
        method: "POST",
		headers: {
             "Content-Type": "application/json",
            },
        body: JSON.stringify(info), //passes the inputted info to the server 
		
    })
	
	.then((resp) => resp.text()) //converts repsonce to text form 
		
	.then((data) => {
		
		if('"Unauthorized"' != JSON.stringify(data)){ //if code is verified
						
				var recieved_token = JSON.stringify(data) 
				
				recieved_token = recieved_token.substring(0, recieved_token.length - 4);
				
				recieved_token = recieved_token.substring(14); //substrings the token to the desired format
					
				var params = new URLSearchParams();
				params.append("Token", recieved_token);
			
				redirect(recieved_token, params); //runs function to determine what page to change to
			
		}
		
		else{
			
			document.getElementById("show_message").innerHTML = JSON.stringify(data); //shows error message in text box
			
		}
		
    })
	
    .catch((err) => {
        console.log(err);
    })
	
}

function redirect(passed_token, params){
	
	const info2 = {passed_token}
	
	fetch("http://" + parsedUrl.host + "/redirect", {
        method: "POST",
		headers: {
             "Content-Type": "application/json",
            },
        body: JSON.stringify(info2), //passes the inputted info to the server 
		
    })
	
	.then((resp) => resp.text()) //converts repsonce to text form 
		
	.then((data) => {
		
		if(JSON.stringify(data) == '"1"'){ //changes to the funfact page if the user is not an employee 
	
			location.href = "/funfacts.html?" + params.toString() ;
		
		}
			
		else{
			
			location.href = "/query.html?" + params.toString() ;  //changes to the query page if the user is not an employee 
			
		}
		
	})

}

function add_comments(){
	
	const supplied_comment = document.getElementById("comment_submission").value; //pulls the coments
	
	var passed_token =JSON.stringify(window.location.href);
			
	passed_token = passed_token.substring(41); //pulls url and substrings the url to get the token 
	passed_token = passed_token.substring(0, passed_token.length - 1);
	
	const info = {supplied_comment, passed_token} //information to be sent
	
	fetch("http://" + parsedUrl.host + "/comment", {
        method: "POST",
		headers: {
             "Content-Type": "application/json",
            },
        body: JSON.stringify(info), //passes the inputted info to the server 
		
    })
	
	.then((resp) => resp.text()) //converts repsonce to text form 
		
	.then((data) => {
	
	//refreshs the page, when this occurs, the show_comments function runs 
		location.reload();
	})
}

function show_comments(){
	
	fetch("http://" + parsedUrl.host + "/show_comments", {
        method: "GET",
        mode: "no-cors",
    })
    .then((resp) => resp.text())
    .then((data) => {
        document.getElementById("show_message").innerHTML = data; //shows comment data base in the text box
    })
    .catch((err) => {
        console.log(err);
    })

}
