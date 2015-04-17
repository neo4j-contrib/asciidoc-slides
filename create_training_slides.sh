git submodule init
git submodule update

ADOC_VERSION=$(asciidoctor -v)
if [ ! $? ];  then
	echo "Installing AsciiDoctor"
	bundle install
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

function create {
	./run.sh content/training/$1 -a presenter="$name" -a twitter="$twitter" -a email="$email"
}
SLIDES="advanced_cypher/training-advanced-cypher.adoc import/training-data-import.adoc modeling/training-data-modeling.adoc production/training-neo4j-in-production.adoc intro/intro-cypher-movies/training-intro-cypher-movies.adoc intro/intro-cypher-relational/training-intro-cypher-relational.adoc"

for i in $SLIDES; do
	echo "Rendering $i"
	create $i
done

./http index.html
