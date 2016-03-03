git submodule init
git submodule update

# save name, twitter and email of the presenter in this file
PRESENTER_INFO_FILE=presenter.info

ADOC_VERSION=$(asciidoctor -v)
if [ ! $? ];  then
	echo "Installing AsciiDoctor"
	bundle install
else
	echo "Installed"
	echo "$ADOC_VERSION"
fi

function writePresenterInfo {
  cat << EOF > "$PRESENTER_INFO_FILE"
name="$name"
twitter="$twitter"
email="$email"
EOF
}

function readPresenterInfo {

	# try to read it from file first
	if [ -r "$PRESENTER_INFO_FILE" ]; then
		echo "Reading name, twitter and email from file: '$PRESENTER_INFO_FILE'"
		source "$PRESENTER_INFO_FILE"
	else

		echo -n "Your Name: "
		read name
		echo -n "Your Twitter: "
		read twitter
		echo -n "Your Email: "
		read email

		writePresenterInfo
	fi
}

readPresenterInfo

function create {
	./run.sh "content/training/$1" -a presenter="$name" -a twitter="$twitter" -a email="$email"
}
SLIDES="advanced_cypher/training-advanced-cypher.adoc import/training-data-import.adoc modeling/training-data-modeling.adoc production/training-neo4j-in-production.adoc intro/intro-cypher-movies/training-intro-cypher-movies.adoc intro/intro-cypher-relational/training-intro-cypher-relational.adoc intro/intro-cypher-interactive/training-intro-cypher-interactive.adoc intro/graph-days-movies/training-graph-days-cypher-movies.adoc"


for i in $SLIDES; do
	echo "Rendering $i"
	create "$i"
done

./http index.html

