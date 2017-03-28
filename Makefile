help:
	@echo "Syntax: \`make <target>\` where <target> is one of these:"
	@echo "  help                          display this help manual"
	@echo "  requirements                  install requirements"
	@echo "  static                        build static files"
	@echo "  validate_accessibilty         run accessibility tests"
	@echo "  validate_quality              run code quality tests"
	@echo "  validate                      run all tests"
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
