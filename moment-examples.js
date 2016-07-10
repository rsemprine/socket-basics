var moment = require('moment');
var now = moment();

console.log(now.format());
console.log(now.format('X'));

/*
now.subtract(1, 'year');

console.log(now.format());
console.log(now.format('MMM Do YYYY, h:mma'));
*/