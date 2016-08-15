git submodule init
git submodule update

ADOC_VERSION=$(asciidoctor -v)
if [ ! $? ];  then
    echo "Please have rbenv installed https://github.com/rbenv/rbenv#installation"
    rbenv install 2.2.5 && rbenv global 2.2.5
	echo "Installing AsciiDoctor"
    rbenv exec gem install bundler
    rbenv exec bundle install
else
	echo "Installed"
	echo $ADOC_VERSION
fi

echo -n "Your Name: "
read name
echo -n "Your Twitter: "
read twitter
echo -n "Your Email: "
read email

SLIDES="advanced_cypher/training-advanced-cypher.adoc import/training-data-import.adoc modeling/training-data-modeling.adoc production/training-neo4j-in-production.adoc intro/intro-cypher-movies/training-intro-cypher-movies.adoc intro/intro-cypher-relational/training-intro-cypher-relational.adoc intro/intro-cypher-interactive/training-intro-cypher-interactive.adoc intro/graph-days-movies/training-graph-days-cypher-movies.adoc"

for i in $SLIDES; do
	echo "Rendering $i"
	./training.sh $i "$name" "$email" "$twitter"
done

asciidoctor content/training/readme.adoc -a env-local -o index.html
./http index.html

