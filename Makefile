source = draggable.js
#sourcemap := $(source).map
minified = draggable.min.js

$(minified): $(source)
	@echo "> Minifying..."
	npm run minify $(source) \
					--compress \
					--source-map $(source) \
					--output $(minified)

install:
	@npm install

test:
	@./node_modules/.bin/mocha-phantomjs \
		test/test.html	

.PHONY: install test
