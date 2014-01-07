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


var myPrettyCode = function (url) {

//    console.log('loaded', url);
};

loadScript("/asciidoc/js/base64.js", myPrettyCode);
loadScript("/asciidoc/js/jquery-ui-1.10.3.custom.min.js", myPrettyCode);
loadScript("/asciidoc/js/versal_color_manager.js", myPrettyCode);
loadScript("/asciidoc/js/versal_visualization.js", myPrettyCode);
loadScript("/asciidoc/js/visualization.js", myPrettyCode);
loadScript("/asciidoc/js/console.js", myPrettyCode);
$.getScript("/asciidoc/js/viz.js", function () {

    loadScript("/asciidoc/js/gist.js", myPrettyCode);
    loadScript("/asciidoc/js/graphgist.js", myPrettyCode);
});



