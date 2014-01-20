var actionsOnEnter = {};
var actionsOnReverse = {};
var actionsOnExit = {};

function step(id) {
    var stepBuilder = {};
    stepBuilder.onEnter = function (action) {
        actionsOnEnter[id] = action;
        return stepBuilder;
    };
    stepBuilder.onReverse = function (action) {
        actionsOnReverse[id] = action;
        return stepBuilder;
    };
    stepBuilder.onExit = function (action) {
        actionsOnExit[id] = action;
        return stepBuilder;
    };
    return stepBuilder;
}

function highlight(stepAndClassId, highlight_color, graphParent) {
    var graph = graphParent.select("figure.graph-diagram")
    step(stepAndClassId).onEnter(function () {
        console.log("onEnter", stepAndClassId, graph);
        graph.selectAll(".node." + stepAndClassId)
            .style("stroke", highlight_color);
        graph.selectAll(".relationship." + stepAndClassId)
            .style("fill", highlight_color);
    }).onReverse(function () {
            graph.selectAll(".node." + stepAndClassId)
                .style("stroke", null);
            graph.selectAll(".relationship." + stepAndClassId)
                .style("fill", null);
        });
}

function stroke(stepAndClassId, highlight_color, strokeStyle, graphParent) {
    var graph = graphParent.select("figure.graph-diagram");
    step(stepAndClassId).onEnter(function () {
        console.log("onEnter stroke", stepAndClassId, graphParent);
        graph.selectAll(".node." + stepAndClassId)
            .style("stroke", highlight_color);
        graph.selectAll(".relationship." + stepAndClassId)
            .style("stroke-width", "10")
            .attr("fill", "none")
//            .attr("stroke", highlight_color)
            .attr("stroke-dasharray", "10,10");
    }).onReverse(function () {
            graph.selectAll(".node." + stepAndClassId)
                .style("stroke-width", null);
            graph.selectAll(".relationship." + stepAndClassId)
                .attr("fill", null)
                .attr("stroke-dasharray", null);
        });
}


(function () {
    var graph1 = d3.select("#big_graph1");
    highlight("triangle1", "red", graph1);
    highlight("triangle2", "red", graph1);

    var graph2 = d3.select("#big_graph2");
    highlight("graph_pattern_ab1", "red", graph2);
    highlight("graph_pattern_ab2", "red", graph2);
    highlight("graph_pattern_ab3", "red", graph2);


    stroke("graph_pattern_optional_rel", "red", null, d3.select("#graph_optional_match"));
})();


$(function () {
    function callIfDefined(action) {
        if (action) action();
    }

    $.deck('.slide');
    $(document).bind('deck.change', function (e, from, to) {
        var fromId = $.deck('getSlide', from).attr("id");
        var toId = $.deck('getSlide', to).attr("id");
        console.log("changing", fromId, toId);

        if (from > to) {
            callIfDefined(actionsOnReverse[fromId]);
        }
        callIfDefined(actionsOnExit[fromId]);
        callIfDefined(actionsOnEnter[toId]);
    });
});
