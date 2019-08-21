all::

#SPEC	= dvp3_protocol
SPEC	= dvp3
CODE	= dvp-bad
CODEG	= dvp-good

.PRECIOUS:	%.scxml %.puml %.svg

%.scxml: %.spec
	rules2scxml $< -o $@
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

ts-enforced/ts/$(CODE).ts: ts-preprocessed/ts/$(CODE).ts $(SPEC).spec
	safeguard $< $(SAFEGUARD_OPTS) --spec $(SPEC).spec -o $@

ts-enforced/ts/$(CODEG).ts: ts-preprocessed/ts/$(CODEG).ts $(SPEC).spec
	safeguard $< $(SAFEGUARD_OPTS) --spec $(SPEC).spec -o $@

all::	ts-enforced/ts/$(CODE).ts ts-enforced/ts/$(CODEG).ts

clean::;	rm -f *~
veryclean::	clean

docker:
	docker run -it -v "`pwd`:/root/dvp" --rm ldltools/dsl4sc-dev bash -c ". .profile && cd /root/dvp && make -B"
