var assign = require("object-assign");
var t5=require("./data-es5.js").tests.map(function(t){return t._source="es5",t});
var t6=require("./data-es6.js").tests.map(function(t){return t._source="es6",t});
var t7=require("./data-es7.js").tests.map(function(t){return t._source="es7",t});
var mixed=[].concat(t5,t6,t7);

var tests = mixed.reduce(function(r, test) {
    if (test.subtests) {
        for (var subtest in test.subtests) {
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
