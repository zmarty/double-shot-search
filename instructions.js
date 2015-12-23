$( document ).ready(function() {
    $("#double-shot-search-box").attr("action", chrome.extension.getURL("search.html"));
    $("#query-box").focus();
});