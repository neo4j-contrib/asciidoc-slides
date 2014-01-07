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

function CypherConsole(config, ready) {

    var $IFRAME = $('<iframe/>').attr('id', 'console').addClass('cypherdoc-console');
    var $IFRAME_WRAPPER = $('<div/>').attr('id', 'console-wrapper');

    var consolr;
    var consoleClass = 'consoleClass' in config ? config.consoleClass : 'console';
    var contentId = 'contentId' in config ? config.contentId : 'content';
    var contentMoveSelector = 'contentMoveSelector' in config ? config.contentMoveSelector : 'div.navbar';
    var consoleUrl = config.url;

    createConsole(ready, consoleClass, contentId);

    function createConsole(ready, elementClass, contentId) {
        var $element = $('p.' + elementClass).first();
        //no console defined
        if ($element.length !== 1) {
            $element = $('<p/>').addClass(elementClass);
            $element.addClass("hidden");
            $('body').append($element);
        }
        $element.each(function () {
            var $context = $(this);

            addConsole($context, ready)
        });
    }

    function addConsole($context, ready) {
        var url = getUrl('none', 'none', '\n\nUse the play/edit buttons to run the queries!');
        var $iframe = $IFRAME.clone().attr('src', url);
        console.log("adding Console", $iframe);
        $iframe.load(function () {
            console.log("adding Console2", $iframe, url);
            consolr = new Consolr($iframe[0].contentWindow);
            if (ready) {
                ready(consolr);
            }
        });
        $context.empty();
        var $iframeWrapper = $IFRAME_WRAPPER.clone();
        $iframeWrapper.append($iframe);
    }


    function getUrl(database, command, message, session) {
        var url = consoleUrl;

        if (session !== undefined) {
            url += ';jsessionid=' + session;
        }
        url += '?';
        if (database !== undefined) {
            url += 'init=' + encodeURIComponent(database);
        }
        if (command !== undefined) {
            url += '&query=' + encodeURIComponent(command);
        }
        if (message !== undefined) {
            url += '&message=' + encodeURIComponent(message);
        }
        if (window.neo4jVersion != undefined) {
            url += '&version=' + encodeURIComponent(neo4jVersion);
        }
        return url + '&no_root=true';
    }
}

function Consolr(consoleWindow) {
    console.log("3");
    window.addEventListener('message', receiver, false);
    var receivers = [];

    function init(params, success, error, data) {
        var index = 0;
        if (success || error) {
            receivers.push(new ResultReceiver(success, error));
            index = receivers.length;
        }
        consoleWindow.postMessage(JSON.stringify({
            'action': 'init',
            'data': params,
            'call_id': index
        }), "*");
    }

    function query(queries, success, error) {
        var index = 0;
        if (success || error) {
            receivers.push(new ResultReceiver(success, error, queries.length));
            index = receivers.length;
        }
        var message = JSON.stringify({
            'action': 'query',
            'data': queries,
            'call_id': index
        });
        consoleWindow.postMessage(message, '*');
    }

    function input(query) {
        consoleWindow.postMessage(JSON.stringify({
            'action': 'input',
            'data': [ query ]
        }), '*');
    }

    function receiver(event) {
        var origin = event.origin;
        if (typeof origin !== 'string') {
            return;
        }
        if (origin.indexOf('neo4j') === -1 && origin.indexOf('localhost') === -1) {
            return;
        }
        var result = JSON.parse(event.data);
        if ('call_id' in result) {
            var rr = receivers[result.call_id - 1];
            rr(result);
        }
    }

    function ResultReceiver(successFunc, errorFunc, numberOfResults) {
        var expectedResults = numberOfResults || 1;

        function call(result) {
            if (expectedResults === 0) {
                console.log('Unexpected result', result);
                return;
            }
            expectedResults--;
            var resultNo = numberOfResults - expectedResults - 1;
            return result.error ? errorFunc(result, resultNo) : successFunc(result, resultNo);
        }

        return call;
    }

    return {
        'init': init,
        'query': query,
        'input': input
    };
}
