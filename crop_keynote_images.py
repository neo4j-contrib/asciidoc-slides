import os
for name in xrange(21,27):
	os.system('convert  -crop 700x400+150+100  Neo4j\ 2.0\ Intro\ Training\ Keynote10.0{0}.jpg {0}.jpg'.format(name, name))

for name in xrange(27,35):
	print name
	os.system('convert  -crop 690x500+180+50  Neo4j\ 2.0\ Intro\ Training\ Keynote10.0{0}.jpg {0}.jpg'.format(name, name))	