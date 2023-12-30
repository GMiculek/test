
var crypto = require("crypto");

const arg = process.argv.slice(2);


const timestamp = JSON.stringify(Math.floor(Date.now() / 30000));
const hash = crypto.createHmac('sha256', arg[0]).update(timestamp).digest("hex"); //hash that changes every 30 seconds

const subhash = hash.substring(0,6);
console.log(subhash); 
