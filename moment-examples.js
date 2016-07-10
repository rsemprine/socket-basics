var moment = require('moment');
var now = moment();
/*
console.log(now.format());
console.log(now.format('X')); //seconds
console.log(now.format('x')); //miliseconds
console.log(now.valueOf()); //miliseconds
*/
var timestamp = 1468166727519;
var timestampMoment = moment.utc(timestamp); //hora UTC/GMT

console.log(timestampMoment.format('h:mma'));
console.log(timestampMoment.local().format('h:mma')); //hora local

/*
now.subtract(1, 'year');

console.log(now.format());
console.log(now.format('MMM Do YYYY, h:mma'));
*/