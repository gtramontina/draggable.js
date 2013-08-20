source = draggable.js
minified = draggable.min.js

install:
	@npm install

test:
	@./node_modules/.bin/mocha-phantomjs \
		test/test.html

minify:
	@echo "> Minifying..."
	@rm -f $(minified)
	@curl -s \
		-X POST \
		--data-urlencode 'compilation_level=SIMPLE_OPTIMIZATIONS' \
		--data-urlencode 'output_format=text' \
		--data-urlencode 'output_info=compiled_code' \
		--data-urlencode 'js_code@$(source)' \
		-o $(minified) \
		http://closure-compiler.appspot.com/compile

.PHONY: install test minify