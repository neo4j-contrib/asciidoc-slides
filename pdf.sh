FILE=$1
shift
HTML=${FILE%%.adoc}-pdf.html
sh run.sh -a backend-pdf -a handout=true -a "options=" "$@" -o $HTML $FILE 
./deck2pdf/bin/deck2pdf $HTML ${FILE%%.adoc}.pdf
rm $HTML
