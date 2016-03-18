
You may want to read also the [original README.md](https://github.com/kangax/compat-table/blob/gh-pages/README.md).

# CLI for Compat Tables (Added by Gratex team)

How is this different from orginal kangax repo ?

	cli.js 		-	trivial cmd line over original 'data files'
	README.md	- 	this file with CLI samples

# TLDR
	
	node cli.js es5 matrix | grep ....

## Other samples (JSON):

	node cli.js es5 browsers

	node cli.js es5 tests

browsers supporting indexOf

	node cli.js es5 tests indexOf

Array api supported by ie9

	node cli.js es5 tests Array ie9

# Other Sample Usages

Top 5 worst es5 browsers:

	node cli.js es5 matrix | grep false$ | cut -f2 | sort | uniq -c | sort -k1,1nr | head -n 5

Prints:	

	50 ie7
	47 ios78
	47 phantom
	46 ie8
	40 safari3

Listing browsers:
	
	node cli.js es5 browsers
	node cli.js es6 browsers
	node cli.js esnext browsers

Only browser names:

	node cli.js es5 browsers | jsontool -ak 

Obsolete browsers

	node cli.js es6 browsers | jsontool -M | jsontool -c 'this.value.obsolete' | jsontool -a key

'Real' browsers

	node cli.js es6 browsers | jsontool -M | jsontool -c '!this.value.platform' | jsontool -a key

Current browsers by platform (as html table output)

	(	
		echo "|name|platform|"; echo "|----|----|"; 
		node cli.js es6 browsers | jsontool -M | jsontool -c '!this.value.obsolete' | jsontool -d"|" -a foo key value.platformtype bar \
		| sort -t"|" -k3,3 -k2,2 
	) | pandoc

# Updating data (from kangax repo)

This is fork of original https://kangax.github.io/compat-table/es6/

	git remote add upstream https://github.com/kangax/compat-table
	git merge remotes/upstream/gh-pages

	npm install #just in case 

	# test

Be carefull, he changes formats sometimes
