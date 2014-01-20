function loadScript(url, callback) {
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback(url);

    // Fire the loading
    head.appendChild(script);
}

var status = "Executing queries"

var errors = [];
$.getScript("../../../../asciidoc/js/presentation.js");
$.getScript("../../../../asciidoc/js/jquery-ui-1.10.3.custom.min.js", function () {
    init();
});

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
};

function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var session_id = guid();


function setupDiagrams() {
    $.deck('.slide');

    var figure = gd.figure();
    figure.scaling(gd.scaling.sizeSvgToFitDiagram);
    d3.selectAll("figure.graph-diagram")
        .call(function (selection) {
            figure(selection);
        });
}
function init() {

    setupDiagrams();
    var $status = $("#status");
    $status.text(status);
    var cypherblocks = [];
    $('textarea.code[mode="cypher"]').each(function (index, element) {
        cypherblocks.push($(element));
    });
    handleBlock(cypherblocks, [], function (statements) {
        initConsole(function () {
            console.log("Statements to execute:", statements);
            executeStatements(statements, function () {
                console.log("done.", errors);
                if (errors.length > 0) {
                    $status.text("Done with errors.");
                    for (i = 0; i < errors.length; i++) {
                        $("#errors").append("statement: <br>" + errors[i].statement + " <br/>Message: <br/>" + errors[i].message + "<br/>");
                    }
                } else {
                    $status.text("No cypher errors, tested against " + CONSOLE_URL); 
                }
            });
        });
    });

}

function initConsole(done) {
    $.ajax(CONSOLE_URL + "/init", {
        beforeSend: setSessionHeader,
        type: "POST",
        contentType: "application/json",
        dataType: "text",
        headers: { "X-Session": session_id },
        xhrFields: { withCredentials: true },
        crossDomain: true,
        data: JSON.stringify({init: "none"}),
        success: function () {
            console.log(arguments);
            done()
        }
    });
}

function setSessionHeader(request) {
    request.setRequestHeader("X-Session", session_id);
    request.withCredentials = true;
//    console.log("session", session_id, request);
}

function handleBlock(cypherblocks, statements, done) {
    if (cypherblocks.length == 0) {
        done(statements);
    } else {

        var element = cypherblocks.shift();
        var setup = element.attr("setup");
        if (setup) {
//            console.log("pulling in", setup);
            var CLEAN = "OPTIONAL MATCH (n)-[r]->() DELETE n, r";
            statements.push(CLEAN);
            $.get(setup, function (content) {
//            console.log(arguments);
                splitStringIntoStatements(content, statements);
                statements.push(element.text());
                handleBlock(cypherblocks, statements, done);
            });
        } else {
            statements.push(element.text());
            handleBlock(cypherblocks, statements, done);
        }
    }
}
const CONSOLE_URL = "http://neo4j-console-20.herokuapp.com/console";

function executeStatements(statements, done) {
    if (statements.length == 0) {
        done();
    } else {
        var statement = statements.shift();
//        console.log("executing now", statement);
        $.ajax(CONSOLE_URL + "/cypher", {
            data: statement,
            type: "POST",
            dataType: "text",
            contentType: "application/json",
            beforeSend: setSessionHeader,
            success: function (result) {
//                console.log("done executing", statement, arguments);
                var res = JSON.parse(result);
                if (res.error) {
                    errors.push({statement: statement, message: res.error});
                }
                executeStatements(statements, done);
            },
            error: function (result) {
//                console.log("error executing", statement, arguments);
                executeStatements(statements, done);
                errors.push(result);
            }});
    }
}

function splitStringIntoStatements(content, statements) {
    var lines = content.split('\n');
    var currentStatement = "";
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (line.trim().endsWith(";")) {
            statements.push(currentStatement + line.trim().slice(0, -1));
        } else {
            currentStatement = currentStatement + line;
        }
    }
}





