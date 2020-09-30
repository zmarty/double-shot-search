// Open links in new tab only when navigating to Bing or Google using the extension
if (location && location.href.indexOf("ds=1") >= 0) {
    var head = document.getElementsByTagName("head")[0];
    if (head) {
        var base = document.createElement("base");
        base.setAttribute("target", "_blank");
        head.appendChild(base);
    }
}