// from user or defaults
var sources = process.argv.slice(2).length ? process.argv.slice(2) : [
	"es5",
	"es6",
	"es7"
];
var browsers = sources //
.map(function(es) {
	return "./data-" + es + ".js"
})//
.map(function(mid) {
	return require(mid).browsers;
});

var assign = require('object-assign');

//some properties get overriden by later spec
var mixed = assign.apply({}, browsers);
console.log(JSON.stringify(mixed, null, "\t"));