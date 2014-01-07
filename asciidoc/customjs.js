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

    console.log('loaded', url);
};

loadScript("js/base64.js", myPrettyCode);
loadScript("js/console.js", myPrettyCode);
loadScript("js/jquery-ui-1.10.3.custom.min.js", myPrettyCode);
loadScript("js/versal_color_manager.js", myPrettyCode);
loadScript("js/versal_visualization.js", myPrettyCode);
loadScript("js/visualization.js", myPrettyCode);
$.getScript("js/viz.js", function () {

    loadScript("js/gist.js", myPrettyCode);
    loadScript("js/graphgist.js", myPrettyCode);
});



