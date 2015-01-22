JS_SOURCES = \
	vendor/es5-shim.min.js \
	vendor/es5-sham.min.js \
	vendor/underscore.min.js \
	vendor/react-with-addons-0.12.2.min.js

JS_TARGET = build/vendor-concatenated.min.js

concat_js: $(JS_SOURCES)
	@if [[ -f "$(JS_TARGET)" ]]; then rm $(JS_TARGET); fi
	cat $^ > $(JS_TARGET)
