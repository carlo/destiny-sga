JS_SOURCES = \
	vendor/es5-shim.min.js \
	vendor/es5-sham.min.js

JS_TARGET_ES5 = build/es5.min.js
JS_TARGET_MAIN = build/main.min.js

all: build_js_es5 build_js_main

build_js_es5: $(JS_SOURCES)
	@if [[ -f "$(JS_TARGET_ES5)" ]]; then rm $(JS_TARGET_ES5); fi
	cat $^ > $(JS_TARGET_ES5)

build_js_main:
	jsx src/ build/
	browserify build/main.js > $(JS_TARGET_MAIN).tmp
	uglifyjs $(JS_TARGET_MAIN).tmp -m -c -o $(JS_TARGET_MAIN)
	rm $(JS_TARGET_MAIN).tmp
