all::

#SPEC	= dvp3_protocol
SPEC	= dvp3
CODE	= dvp-bad
CODEG	= dvp-good

.PRECIOUS:	%.scxml %.puml %.svg test-good-ok test-good-err test-bad-ok test-bad-err

%.scxml: %.spec
	rules2scxml  --exit=END $< -o $@
%.puml:	%.scxml
	landscape=`test $(LANDSCAPE) -ne 0 && echo -e "\x2dlandscape"`; \
	scxml2uml.sh $< -o $@ $$landscape
%.svg:	%.puml
	plantuml.sh $< -tsvg
%.png:	%.svg
	convert $< $@

# all::	$(SPEC:%=generated/%.scxml)
# all::	$(SPEC:%=%.svg)

# safeguard
SAFEGUARD_OPTS = --js-class=DvP --js-keep-decorators --js-decorators=initial,transitions --js-decorators-lib=./decorator

ts-enforced/ts/%.ts: ts-preprocessed/ts/%.ts $(SPEC).spec
	safeguard $< $(SAFEGUARD_OPTS) --spec $(SPEC).scxml -o $@

all::	$(SPEC).scxml
all::	ts-enforced/ts/$(CODE).ts ts-enforced/ts/$(CODEG).ts

run-safeguard:
	docker run -it -v "`pwd`:/root/dvp" --rm ldltools/dsl4sc-dev bash -c ". .profile && cd /root/dvp && make -B"

test-enforced:
	node ts-enforced/test/dvp.demo.js good
	node ts-enforced/test/dvp.demo.js good 1
	node ts-enforced/test/dvp.demo.js bad
	node ts-enforced/test/dvp.demo.js bad 1

clean::;	rm -f *~
veryclean::	clean
