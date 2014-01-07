/**
 * Licensed to Neo Technology under one or more contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership. Neo Technology licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You
 * may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

'use strict';

GraphGist(jQuery);

function GraphGist($) {
    var HAS_ERRORS = false;
    var $QUERY_MESSAGE = $('<pre/>').addClass('query-message');
    var $VISUALIZATION = $('<div/>').addClass('visualization');
    var $TABLE_CONTAINER = $('<div/>').addClass('result-table');

    var DEFAULT_VERSION = '2.0.0';
    var CONSOLE_VERSIONS = { '2.0.0-M06': 'http://neo4j-console-20m06.herokuapp.com/',
        '2.0.0-RC1': 'http://neo4j-console-20rc1.herokuapp.com/',
        '2.0.0': 'http://neo4j-console-20.herokuapp.com/',
        '1.9': 'http://neo4j-console-19.herokuapp.com/'
    }

    var $content = undefined;
    var consolr = undefined;
    var statements = [];
    var version = '2.0.0'

    $(document).ready(function () {
        window.addEventListener("message", handleMessage);
        renderContent();
    });

    function handleMessage(e) {
        var source = e.source;
        var msg = e.data;
        if (msg == "queries") {
            console.log('posting', statements);
            source.postMessage("message", ['match (n) return n']);
        }
    }

    function renderContent(originalContent, link, imagesdir) {
        var consoleUrl = CONSOLE_VERSIONS[version in CONSOLE_VERSIONS ? version : DEFAULT_VERSION];
        console.log("1", consoleUrl);
        CypherConsole({'url': consoleUrl}, function (conslr) {
            console.log("3");
            consolr = conslr;
            executeQueries(function () {
                console.log("2", consoleUrl);
                initConsole(function () {
                    renderGraphs();
                    renderTables();

                }, function () {
                    hideConsole()
                    postProcessRendering();
                    if ('initDisqus' in window) {
                        initDisqus($content);
                    }
                });
            });
        });
    }

    function hideConsole() {
        var $TOGGLE_CONSOLE_HIDE_BUTTON = $('<a class="btn btn-small show-console-toggle" data-toggle="tooltip"  title="Show or hide a Neo4j Console in order to try the examples in the GraphGist live."><i class="icon-chevron-down"></i> Show/Hide Live Console</a>');
        var consolewrapper = $(".console");
        var $toggleConsoleShowButton = $TOGGLE_CONSOLE_HIDE_BUTTON.clone();
        $toggleConsoleShowButton.click(function () {
            console.log("click", consolewrapper.is(':visible'), consolewrapper);
            if (consolewrapper.is(':visible')) {
                consolewrapper.hide();
            } else {
                consolewrapper.show();
            }
        });
        $toggleConsoleShowButton.insertBefore(consolewrapper);
        if (consolewrapper.hasClass("hidden")) {
            consolewrapper.removeClass("hidden");
            consolewrapper.hide();
        }
    }

    function postProcessRendering() {
        $('span[data-toggle="tooltip"]').tooltip({'placement': 'left'});
        $('a.run-query,a.edit-query,a.show-console-toggle').tooltip({'placement': 'right'});
        $('.tooltip-below').tooltip({'placement': 'bottom'});
        var status = $("#status");
        if (HAS_ERRORS) {
            status.text("Errors.");
            status.addClass("label-important");
        } else {
            status.text("No Errors.");
            status.addClass("label-success");
        }
        DotWrapper($).scan();
    }

    function initConsole(callback, always) {
        var query = getSetupQuery();
        consolr.init({
            'init': 'none',
            'query': query || 'none',
            'message': 'none',
            'no_root': true
        }, success, error);

        function success(data) {
            consolr.input('');
            if (callback) {
                callback();
            }
            if (always) {
                always();
            }
        }

        function error(data) {
            HAS_ERRORS = true;
            console.log('Error during INIT: ', data);
            if (always) {
                always();
            }
        }
    }

    function executeQueries(callbackAfter) {
        var $wrappers = [];
        var receivedResults = 0;
        $('textarea.code').each(function (index, element) {
            var $wrapper = $(element);
            var number = index + 1;
            $wrapper.data('number', number);
            var statement = $wrapper.value();
            console.log("pushing", statement);
            statements.push(statement);
            $wrappers.push($wrapper);
        });
        consolr.query(statements, success, error);

        function success(data, resultNo) {
            receivedResults++;
            var $wrapper = $wrappers[resultNo];
            var showOutput = $wrapper.parent().data('show-output');
            createQueryResultButton($QUERY_OK_LABEL, $wrapper, data.result, !showOutput);
            $wrapper.data('visualization', data['visualization']);
            $wrapper.data('data', data);
            if (callbackAfter && receivedResults === statements.length) {
                callbackAfter();
            }
        }

        function error(data, resultNo) {
            HAS_ERRORS = true;
            receivedResults++;
            var $wrapper = $wrappers[resultNo];
            createQueryResultButton($QUERY_ERROR_LABEL, $wrapper, data.error, false);
            if (callbackAfter && receivedResults === statements.length) {
                callbackAfter();
            }
        }
    }

    function getSetupQuery() {
        var query = undefined;
        $('#content pre.highlight.setup-query').first().children('div.query-wrapper').first().each(function () {
            var $wrapper = $(this);
            query = $wrapper.data('query');
            if (query) {
                $wrapper.prevAll('h5').first().each(function () {
                    var $heading = $(this);
                    $heading.text($heading.text() + ' — this query has been used to initialize the console');
                });
            }
        });
        return query;
    }

    function renderGraphs() {
        findPreviousQueryWrapper('h5.graph-visualization', $content, function ($heading, $wrapper) {
            //
            var visualization = $wrapper.data('visualization');
            var $visContainer = $VISUALIZATION.clone().insertAfter($heading);
            $heading.remove(); // text('The graph after query ' + $wrapper.data('number'));
            if (visualization) {
                console.log("wrapper", $visContainer);
//                d3graph($visContainer[0], visualization);
//                Visualization.
                var height = $visContainer.height();
                setTimeout(function () {
                    console.log('Viz', height);
                }, 0);

                var myChart = new GraphVisualizer($visContainer, window.ColorManager(), 840, 300);
                myChart.draw(visualization, true);
            }
            else {
                $visContainer.text('There is no graph to render.').addClass('alert-error');
            }
        });
    }

    function renderTables() {
        findPreviousQueryWrapper('h5.result-table', $content, function ($heading, $wrapper) {
            var $tableContainer = $TABLE_CONTAINER.clone().insertAfter($heading);
            $heading.remove(); // text('The results of query ' + $wrapper.data('number'));
            if (!renderTable($tableContainer, $wrapper.data('data'))) {
                $tableContainer.text("Couldn't render the result table.").addClass('alert-error');
            }
        });
    }

    function replaceNewlines(str) {
        return str.replace(/\\n/g, '&#013;');
    }

    function createQueryResultButton($labelType, $wrapper, message, hide) {
        var $label = $labelType.clone();
        var $button = $RESULT_TOGGLE_BUTTON.clone();
        $wrapper.after($label).after($button);
        var $message = $QUERY_MESSAGE.clone().text(replaceNewlines(message));
        if (hide) {
            toggler($message, $button, 'hide');
        }
        else {
            toggler($message, $button, 'show');
        }
        $button.click(function () {
            toggler($message, $button);
        });
        $wrapper.after($message);
    }

    function toggler($target, button, action) {
        var $icon = $('i', button);
        var stateIsExpanded = $icon.hasClass(COLLAPSE_ICON);
        if (( action && action === 'hide' ) || ( action === undefined && stateIsExpanded )) {
            $target.hide();
            $icon.removeClass(COLLAPSE_ICON).addClass(EXPAND_ICON);
            return 'hide';
        }
        else {
            $target.show();
            $icon.removeClass(EXPAND_ICON).addClass(COLLAPSE_ICON);
            return 'show';
        }
    }

    function findQuery(selector, context, operation) {
        $(selector, context).each(
            function () {
                $(this).nextAll('div.listingblock').children('div').children('pre.highlight')
                    .children('textarea.code').first().each(function (el) {
                        console.log("Found query", el);
                        operation(this);
                    });
            });
    }

    function findPreviousQueryWrapper(selector, context, operation) {
        $(selector, context).each(function () {
            var $selected = $(this);
            findPreviousQueryWrapperSearch($selected, $selected, operation);
        });
    }

    function findPreviousQueryWrapperSearch($container, $selected, operation) {
        var done = false;
        done = findQueryWrapper($container, $selected, operation);
        if (done) {
            return true;
        }
        var $newContainer = $container.prev();
        if ($newContainer.length > 0) {
            return findPreviousQueryWrapperSearch($newContainer, $selected, operation);
        }
        else {
            var $up = $container.parent();
            done = $up.length === 0 || $up.prop('tagName').toUpperCase() === 'BODY';
            if (!done) {
                return findPreviousQueryWrapperSearch($up, $selected, operation);
            }
        }
        return done;
    }

    function findQueryWrapper($container, $selected, operation) {
        var done = false;
        $container.find('div.query-wrapper').last().each(function () {
            operation($selected, $(this));
            done = true;
        });
        return done;
    }

    function errorMessage(message, gist) {
        var messageText;
        if (gist) {
            messageText = 'Something went wrong fetching the GraphGist "' + gist + '":<p>' + message + '</p>';
        }
        else {
            messageText = '<p>' + message + '</p>';
        }

        $content.html('<div class="alert alert-block alert-error"><h4>Error</h4>' + messageText + '</div>');
    }

    var visualizer = new GraphVisualization();

    function d3graph(element, graph) {
        var width = 800, height = 300;
        visualizer.visualize(element, width, height, graph);
    }
}
