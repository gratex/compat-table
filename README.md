ECMAScript 5/6/7/non-standard compatibility tables
==================================================

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/kangax/compat-table?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/kangax/es5-compat-table/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

Editing the tests
-----------------

Edit the `data-es5.js`, `data-es6.js`, `data-es7.js`, or `data-non-standard.js` files to adjust the tests and their recorded browser results. Run `node build.js` to build the HTML files from these JavaScript sources.

The ES6 tests themselves should be written in pure ES3, *except* for the sole ES6 feature being tested (as well as any ES5 features strictly required to use the ES6 feature). The test code is placed in multi-line comments (as in [this hack](http://tomasz.janczuk.org/2013/05/multi-line-strings-in-javascript-and.html)), so that Node/io.js can parse the data scripts without throwing syntax errors when encountering features it does not support. The `build.js` script will wrap the code in an `eval` call inside a `try`, so the tests themselves do not need to catch errors that non-supporting platforms may throw.

The ES6 tests have a `significance` rating, which affects how a platform's total support percentage is calculated. A test rated `"large"` (representing a landmark, transformative feature) is worth 1, one rated `"medium"` (representing a significant feature that's less universally useful, or is primarily connected to another feature) is worth 0.5, and one rated `"small"` (representing a useful but subtle improvement from ES5) is worth 0.25.

In order to test compilers
-----------------

Run `npm install` to install the compilers under test (and remember to `npm update` them frequently).
Then run `node build.js compilers` to create compiler test pages under `es6/compilers`. Currently only the ES6 tests produce compiler test pages.
Open the compilers' HTML files in a browser with close to zero native ES6 support, such as Internet Explorer 9 (although its lack of support for strict mode will cause some tests to fail), Opera 12, or Safari 5.1 (bearing in mind their native support for TypedArrays, `__proto__` and such).

Note that some tests cannot be compiled correctly, as they rely on runtime `eval()` results to ensure that, for instance, certain syntactic constructs are syntax errors. These will fail on the compiler test pages. Support for those features should be divined manually.

CLI for Compat Tables (Added by Gratex Team)
------------------

Mostly from CLI to integrate with other tools.

Listing browsers:
	
	# from one of the specs
	node -e 'console.log(JSON.stringify(require("./data-es6.js"),null,"\t"))' | jsontool browsers | jsontool -ak

	# shortcut
	node cli.js es6 browsers

	# obsolete browsers
	node cli.js es6 browsers | jsontool -M | jsontool -c 'this.value.obsolete' | jsontool -a key

	# 'real' browsers
	node cli.js es6 browsers | jsontool -M | jsontool -c '!this.value.platform' | jsontool -a key

	# not obsolete browsers by platform (as html table output)
	(	
		echo "|name|platform|"; echo "|----|----|"; 
		node cli.js es6 browsers | jsontool -M | jsontool -c '!this.value.obsolete' | jsontool -d"|" -a foo key value.platformtype bar \
		| sort -t"|" -k3,3 -k2,2 
	) | pandoc

Listing 'tests':

	# all subtests from all data files expanded to first level as tests (for easier querying)
	node cli.js es6 tests

	# flat, readable list of test-subtest
	node cli.js es6 tests | jsontool -a name

	# test by category (not applicable for es5)
	node cli.js es6 tests | jsontool -a category | cnt

	# node vs iojs
	 node cli.js es6 | jsontool -c "this.res.iojs!==this.res.node" | jsontool -d"|" -0 -a name res.node res.iojs

	# browser version expansion

	# by default kangax uses CSS to color green all browsers versions higher from mybrowser=true
	# to simulate this, I add all higher versions of browsers to each res:{} node
	# this is default behavior of 'tests' swich
	node cli.js es6 tests | jsontool -c 'this.name=="RegExp.prototype.compile"' | jsontool -a res

	# to turn this off and keep original browser list use 'tests-raw-browsers'
	# this can be integrpered (I hope) as 'supported since'
	node cli.js es6 tests-raw-browsers | jsontool -c 'this.name=="RegExp.prototype.compile"' | jsontool -a res



More samples:

	# support of trim()

	node cli.js es5 | jsontool -c 'this.name=="String.prototype.trim"' | jsontool -a res

	# compare, ie9 supported, ie8 unsupported features
	node cli.js es5  | jsontool -c 'this.res.ie9===true && this.res.ie9!=this.res.ie8' | jsontool -0 -d"|" -a name res.ie8 res.ie9

	# ie8_unsuported_static_api, you can easily grep your code base for these and find IE8 potential problems
	ie8_unsuported_static_api=$(node cli.js es5  | jsontool -c 'this.res.ie9===true && this.res.ie9!=this.res.ie8' | jsontool -0 -d"|" -a name | grep "\." | grep -v prototype)

	# then in your project code:
	git grep -w -F "$ie8_unsuported_static_api"

	# es6 supported features in ie10
	node cli.js es6 tests "" "ie10" | jsontool -a name

	# shat can you start using in both IE10 and node
	node cli.js es6 | jsontool -c 'this.res.ie10 && this.res.node' | jsontool -d"|" -0 -a name res.ie10 res.node | cut -d"-" -f1 | sort -u

## Updating data 

This is fork of original https://kangax.github.io/compat-table/es6/

	git remote add upstream https://github.com/kangax/compat-table
	git merge remotes/upstream/gh-pages

	npm install #just in case 

	# test

