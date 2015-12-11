source = draggable.js
minified = draggable.min.js
sourcemap := $(minified).map
miniandmap := $(minified) $(sourcemap)

minify: $(minified) $(sourcemap)

$(miniandmap) : $(source)
	@echo "> Minifying..."; \
	./node_modules/.bin/uglifyjs $(source) \
					--compress \
					--output $(minified) \
					--source-map $(sourcemap)

install :
	@npm install

test :
	@./node_modules/.bin/mocha-phantomjs \
		test/test.html
		
clean :
	@rm --verbose $(miniandmap)

.PHONY: install test clean
