var assign = require("object-assign");
//from user or defaults
var sources = process.argv.slice(2).length ? process.argv.slice(2) : [
	"es5",
	"es6",
	"es7"
];

var tests = sources.map(function(es) {
	return require("./data-" + es + ".js").tests.map(function(test) {
		test._source = es
		return test;
	});
});
var mixed = Array.prototype.concat.apply([], tests);

tests = mixed.reduce(function(r, test) {
	if (test.subtests) {
		for ( var subtest in test.subtests) {
			// merge subtest data with parents data
			var newTest = assign({}, test, test.subtests[subtest]);
			newTest.name = test.name + " - " + subtest;
			delete newTest.subtests;
			r.push(newTest)
		}
	} else {
		r.push(test);
	}
	return r;
}, []);

console.log(JSON.stringify(tests, null, "\t"));
