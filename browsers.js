var b5=require("./data-es5.js").browsers;
var b6=require("./data-es6.js").browsers;
var b7=require("./data-es7.js").browsers;
var assign     = require('object-assign');

//some properties get overriden by later spec
var mixed=assign(b5,b6,b7); 
console.log(JSON.stringify(mixed,null,"\t"));