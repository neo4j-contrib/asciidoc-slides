if [ $# -eq 0 ]
  then echo "Must pass argument of asciidoc root page, eg: ./pdf.sh content/demo/index.adoc"
  exit -1
fi 
FILE=$1
shift
HTML=${FILE%%.adoc}-pdf.html
sh run.sh -a backend-pdf -a handout=true -a "options=" "$@" -o $HTML $FILE 
./deck2pdf/bin/deck2pdf $HTML ${FILE%%.adoc}.pdf
rm $HTML
