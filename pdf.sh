HTML=${1%%.adoc}-pdf.html
sh run.sh -a "options=" -o $HTML $1 
./deck2pdf/bin/deck2pdf $HTML ${1%%.adoc}.pdf
rm $HTML