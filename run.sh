current_year=$(date "+%Y")
asciidoctor -T asciidoc/asciidoctor-backends/haml/deckjs -a stylesdir=`pwd`/asciidoc/deck.js/themes/style -a allow-uri-read -a currentyear=$current_year "$@"