const shopPrefix = "shop ";
$( document ).ready(function() {
    let left = "https://www.bing.com/search?ds=1&q=";
    let right = "https://www.google.com/search?ds=1&q=";
    var url = $.url();
    var query = url.param("q");

    if (typeof query != 'undefined')
    {
        if (query.toLowerCase().indexOf(shopPrefix) === 0) {
            query = query.substr(shopPrefix.length);
            left = left.replace("search?", "shop?");
            right = right.replace("search?", "search?psb=1&tbm=shop&");
        }
        $("#left").attr("src", left + encodeURIComponent(query));
        $("#right").attr("src", right + encodeURIComponent(query));
        document.title = query.replace(/</g, "&lt;").replace(/>/g, "&gt;") + " - Double Shot Search";
    }
});