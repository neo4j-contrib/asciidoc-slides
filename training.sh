file=${1-intro/intro-cypher-movies/training-intro-cypher-movies.adoc}

presenter=${2-"Neo4j"}
email=${3-"info@neotechnology.com"}
twitter=${4-"neo4j"}

./run.sh content/training/$file -a presenter=$presenter -a email=$email -a twitter=$twitter
