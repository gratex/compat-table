var assign = require("object-assign");

// TODO: commander ?
var esVersion = process.argv.slice(2)[0] || "es6";
var command = process.argv.slice(2)[1] || "tests";
var commandParams = process.argv.slice(4);

console.error("[DEBUG] esVersion:"+ esVersion + ",command:"+ command);

var data = require("./data-" + esVersion + ".js");

var browsers = data.browsers;
var tests = data.tests;

console.error("[DEBUG] raw:"+ tests.length + ",browsers:"+ Object.keys(browsers).length);

var browserNames = Object.keys(data.browsers).sort();


tests = tests.reduce(extractSubtests, []);
if (command !== "tests-raw-browsers") {
    tests.forEach(addHigherBrowserVersions);
}
console.error("[DEBUG] extractSubtests:"+ tests.length + ",browsers:"+ Object.keys(browsers).length);


if (command === "browsers") {
    console.log(JSON.stringify(browsers, null, "\t"));
} else if (command === "tests" || command === "tests-raw-browsers"  ) {
	if(commandParams){
		var testFilter=commandParams[0];
		var browserFilter=commandParams[1];
		
		tests=tests.filter(function(test){
			 return (!testFilter || ~test.name.indexOf(testFilter)) && (!browserFilter || test.res[browserFilter]);
		});
	}
    console.log(JSON.stringify(tests, null, "\t"));
} else {
    console.error("Unknown command " + command);
    process.exit(1);
}



function extractSubtests(r, test) {
    if (test.subtests) {
        test.subtests.forEach(function(subtest){
            // merge subtest data with parents data
            var newTest = assign({}, test, test.subtests[subtest]);
            newTest.name = test.name + " - " + subtest.name;
            delete newTest.subtests;
            r.push(newTest)
        });
    } else {
        r.push(test);
    }
    return r;
}

function addHigherBrowserVersions(test) {
    for (var browser in test.res) {
        if (test.res[browser] === true) {
            getHigherBrowserVersions(browser).forEach(addProperty, test.res);
        }
    }
}

function getHigherBrowserVersions(browserName) {
    // not very effective, but seems working
    var index = browserNames.indexOf(browserName);
    var withoutVersion = browserName.replace(/[\d]+(dev)?$/, ""); //dev because of es6 and chromeXXdev

    return browserNames.filter(function(name, i) {
        return i > index && ~name.indexOf(withoutVersion);
    });
}

function addProperty(property) {
    // adds property==true to object 
    // but only if the property does not exists already
    //console.log(this);
    property in this || (this[property] = true);
}