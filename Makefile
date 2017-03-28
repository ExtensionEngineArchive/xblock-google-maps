LANG_DIR=google_maps/translations/$$LANG/LC_MESSAGES

help:
	@echo "Syntax: \`make <target>\` where <target> is one of these:"
	@echo "  help                          display this help manual"
	@echo "  requirements                  install requirements"
	@echo "  static                        build static files"
	@echo "  validate_accessibilty         run accessibility tests"
	@echo "  validate_quality              run code quality tests"
	@echo "  validate                      run all tests"
	@echo "  init_translation              create the initial text.po file for passed LANG variable."
	@echo "                                Syntax: make init_translation LANG=<lang>"
	@echo "  extract_translations          extract strings for translations"
	@echo "  compile_translations          compile translation files"
	@echo "  pull_translations             pull translations from transifex"
	@echo "  push_translations             push translations to transifex"
	@echo ""

requirements:
	pip install -r requirements.txt
	npm install

static:
	python scripts/compile_sass.py

validate_quality:
	pep8 google_maps/; \
	pylint google_maps/; \
	npm run lint

validate_accessibility:
	for file in google_maps/public/html/*.html; do \
		pa11y -s WCAG2AA file://$(PWD)/$$file; \
	done

validate: validate_accessibility validate_quality

init_translation:
	mkdir -p $$LANG/LC_MESSAGES/; \
	find . -name "*.py" | xargs xgettext -o $(LANG_DIR)/text.po --language=python --add-comments="Translators:"; \
	find google_maps/public/html/ google_maps/public/js/src/ -name "*.js" -o -name "*.html" | \
	xargs xgettext -o $(LANG_DIR)/text.po --language=python --from-code=utf-8 --keyword=pgettext:1c,2 --keyword=npgettext:1c,2,3 -c --join-existing;

extract_translations:
	for dir in google_maps/translations/*; do \
		find . -name "*.py" | xargs xgettext -o $$dir/LC_MESSAGES/text.po --language=python --add-comments="Translators:" --join-existing; \
		find ./google_maps/public/html/ ./google_maps/public/js/src/ -name "*.js" -o -name "*.html" | \
		xargs xgettext -o $$dir/LC_MESSAGES/text.po --language=python --from-code=utf-8 --keyword=pgettext:1c,2 --keyword=npgettext:1c,2,3 -c --join-existing; \
	done;

compile_translations:
	for dir in google_maps/translations/*; do \
		msgfmt $$dir/LC_MESSAGES/text.po -o $$dir/LC_MESSAGES/text.mo; \
	done;

pull_translations:
	cd google_maps && tx pull -af

push_translations:
	cd google_maps && tx push -s
