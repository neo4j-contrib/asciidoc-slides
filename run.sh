asciidoctor -T asciidoc/asciidoctor-backends/haml/deckjs -a stylesdir=`PWD`/asciidoc/deck.js/themes/style -a allow-uri-read "$@"
