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

function highlight( graphParentId,stepId, classId,highlight_color) {
    var graph = d3.select("#"+graphParentId).select("figure.graph-diagram");
    step(stepId).onEnter(function () {
        console.log("onEnter", classId, graph);
        graph.selectAll(".node." + classId)
            .style("stroke", highlight_color);
        graph.selectAll(".relationship." + classId)
            .style("fill", highlight_color);
    }).onReverse(function () {
            graph.selectAll(".node." + classId)
                .style("stroke", null);
            graph.selectAll(".relationship." + classId)
                .style("fill", null);
        });
}

function dash(graphParentId, stepAndClassId) {
    var graph = d3.select("#"+graphParentId).select("figure.graph-diagram");
    step(stepAndClassId).onEnter(function () {
        console.log("onEnter stroke", stepAndClassId, graphParentId);
        graph.selectAll(".node." + stepAndClassId)
            .style("stroke", "red");
        graph.selectAll(".relationship." + stepAndClassId)
            .style("stroke-width", "10")
            .attr("fill", "none")
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
    highlight("big_graph1","bg1_triangle1", "triangle1", "red");
    highlight("big_graph1","bg1_triangle2", "triangle2", "red");

    highlight("big_graph2","bg2_graph_pattern_ab1","graph_pattern_ab1", "red");
    highlight("big_graph2","bg2_graph_pattern_ab2","graph_pattern_ab2", "red");
    highlight("big_graph2","bg2_graph_pattern_ab3","graph_pattern_ab3", "red");
    
    highlight("big_graph3", "bg3_one_node", "one_node", "red");
    highlight("big_graph4", "bg4_one_node", "one_node", "red");
    
    
    highlight("big_graph5", "bg5_one_node", "one_node", "red");
    highlight("big_graph5", "bg5_one_node_outgoing","one_node_outgoing", "red");

    highlight("big_graph6", "bg6_one_node", "bg5_one_node", "red");
    highlight("big_graph6","bg6_one_node_outgoing", "one_node_outgoing", "orange");
    highlight("big_graph6","bg6_one_node_outgoing_incoming","one_node_outgoing_incoming", "blue");

    highlight("big_graph7","bg7_one_node", "one_node", "red");
    highlight("big_graph7","bg7_one_node_outgoing", "one_node_outgoing", "orange");


    dash("graph_optional_match", "graph_pattern_optional_rel" );
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
