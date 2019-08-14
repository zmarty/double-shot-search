// Ignore X-Frame-Options header - Original code from: https://gist.github.com/dergachev/e216b25d9a144914eae2
chrome.webRequest.onHeadersReceived.addListener(
    function(details) {
        for (var i = 0; i < details.responseHeaders.length; ++i) {
            if (details.responseHeaders[i].name.toLowerCase() == 'x-frame-options') {
                details.responseHeaders.splice(i, 1);
                return {
                    responseHeaders: details.responseHeaders
                };
            }
        }
    }, {
        urls: ["<all_urls>"]
    }, ["blocking", "responseHeaders"]
);

// !! https://developer.chrome.com/extensions/settings_override
//urls: ["*://www.bing.com/*", "*://www.google.com/*"]

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
    function(query) {
        var search_url = chrome.runtime.getURL("search.html");
        search_url = search_url + "?q=" + encodeURIComponent(query);
        navigate(search_url);
    }
);

function navigate(url) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.update(tabs[0].id, {url: url});
    });
}

chrome.webRequest.onBeforeRequest.addListener(
    function(details)
    { 
        if (details.url.indexOf("https://www.doubleshotsearch.download/chrome-extension/search/?q=") != -1
            || details.url.indexOf("chrome-extension://" + chrome.runtime.id + "/?q=") != -1) {

            var url = $.url(details.url);
            var query = url.param("q");
            var search_url = chrome.runtime.getURL("search.html");
            search_url = search_url + "?q=" + encodeURIComponent(query);
            
            return {redirectUrl: search_url};
        }
    },
    {urls: ["<all_urls>"]},
    ["blocking"]
);