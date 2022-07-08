# Minimal makefile for Sphinx documentation
#

# You can set these variables from the command line.
SPHINXOPTS    = -v
SPHINXBUILD   = sphinx-build
SPHINXPROJ    = Thebe
SOURCEDIR     = .
BUILDDIR      = _build
JSDOC         = ../../node_modules/.bin/jsdoc
PATH 		 := ../../node_modules/.bin:$(PATH)

# Put it first so that "make" without argument is like "make help".
help:
	@$(SPHINXBUILD) -M help "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)

.PHONY: js help Makefile

package.json:
	yarn ls

# npm-ci: package.json
# 	# package.json updated, refresh lock with npm install
# 	npm ci
# 	touch $@

$(JSDOC):
	npm ci
	# refresh mtime
	test -f $@ && touch $@

# Catch-all target: route all unknown targets to Sphinx using the new
# "make mode" option.  $(O) is meant as a shortcut for $(SPHINXOPTS).

%: Makefile $(JSDOC)
	@$(SPHINXBUILD) -M $@ "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)

clean-js:
	rm -rf _static/lib

js: clean-js
	cd ..; npm ci; yarn build:prod
	cp -R ../lib _static/lib

js-dev: clean-js
	cd ..; npm ci; yarn build
	cp -R ../lib _static/lib

show:
	@python -c "import webbrowser; webbrowser.open_new_tab('file://$(PWD)/_build/html/index.html')"

push: html
	ghp-import -pn build/html/

linkcheck:
	$(SPHINXBUILD) -b linkcheck $(ALLSPHINXOPTS) $(SOURCEDIR) $(BUILDDIR)/linkcheck
	@echo
	@echo "Link check complete; look for any errors in the above output " \
	      "or in $(BUILDDIR)/linkcheck/output.txt."
