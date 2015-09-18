
You may want to read also the [original README.md](https://github.com/kangax/compat-table/blob/gh-pages/README.md).

# CLI for Compat Tables (Added by Gratex team)

How is this different from orginal kangax repo ?

	cli.js 		-	trivial cmd line over original 'data files'
	README.md	- 	this file with CLI samples

## Sample Usage

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
	 node cli.js es6 | jsontool -c "this.res.iojs!==this.res.node4" | jsontool -d"|" -0 -a name res.node4 res.iojs

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

	# what can you start using in both IE10 and node
	node cli.js es6 | jsontool -c 'this.res.ie10 && this.res.node4' | jsontool -d"|" -0 -a name res.ie10 res.node4 | cut -d"-" -f1 | sort -u

	# new features in node4 (not in node012)
	node cli.js es6 | jsontool -c '!this.res.node012 && this.res.node4===true' | jsontool -d"|" -0 -a name res.ie10 res.node4 | cut -d"-" -f1 | sort -u

## More samples:

Array metods supported in chrome47 vs node012

	$ node cli.js es6 tests 'Array.prototype methods - Array.prototype' 'node012' | jsontool -a name
	Array.prototype methods - Array.prototype.find
	Array.prototype methods - Array.prototype.findIndex
	Array.prototype methods - Array.prototype.fill
	Array.prototype methods - Array.prototype.keys
	Array.prototype methods - Array.prototype.values
	Array.prototype methods - Array.prototype.entries
	Array.prototype methods - Array.prototype[Symbol.iterator]
	Array.prototype methods - Array.prototype[Symbol.unscopables]


	$ node cli.js es6 tests 'Array.prototype methods - Array.prototype' 'chrome47' | jsontool -a name
	Array.prototype methods - Array.prototype.copyWithin
	Array.prototype methods - Array.prototype.find
	Array.prototype methods - Array.prototype.findIndex
	Array.prototype methods - Array.prototype.fill
	Array.prototype methods - Array.prototype.keys
	Array.prototype methods - Array.prototype.entries
	Array.prototype methods - Array.prototype[Symbol.iterator]
	Array.prototype methods - Array.prototype[Symbol.unscopables]

## Updating data (from kangax repo)

This is fork of original https://kangax.github.io/compat-table/es6/

	git remote add upstream https://github.com/kangax/compat-table
	git merge remotes/upstream/gh-pages

	npm install #just in case 

	# test

