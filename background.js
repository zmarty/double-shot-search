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
        urls: ["*://www.bing.com/*", "*://www.google.com/*", "*://www.google.co.in/*"],
        types: [ 'sub_frame' ]
    }, ["blocking", "responseHeaders", "extraHeaders"]
);

// Update request headers
chrome.webRequest.onBeforeSendHeaders.addListener(
    changeRequestHeaders,
    {
        urls: ["*://www.bing.com/*", "*://www.google.com/*", "*://www.google.co.in/*"],
    },
    ['blocking', 'requestHeaders', 'extraHeaders']
);

// Add Edge as a user agent to support Bing chat
function changeRequestHeaders(details) {
    for (var i = 0; i < details.requestHeaders.length; ++i) {
        if (
            details.requestHeaders[i].name.toLowerCase() === 'user-agent'
            && details.url.indexOf('Edg') <= -1
        ) {
            details.requestHeaders[i].value = details.requestHeaders[i].value + ' Edg/111.0.1661.44';
        }
    }
      
    return {
        requestHeaders: details.requestHeaders,
    };
}

// !! https://developer.chrome.com/extensions/settings_override
//urls: ["*://www.bing.com/*", "*://www.google.com/*"]

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(function(query) {
    if (query.startsWith('chat ')) {
        var searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query.substring(5))}&showconv=1&sendquery=1&FORM=hpcodx`;
        var bardUrl = 'https://bard.google.com/';
        chrome.tabs.create({ url: bardUrl }, function(tab) {
            var bardTabId = tab.id;
            chrome.tabs.executeScript(bardTabId, { code: 'var iframe = document.createElement("iframe");' +
                                                       'iframe.src = "' + searchUrl + '";' +
                                                       'iframe.style = "width:50%;height:100%;position:absolute;top:0;right:0;z-index:99999";' +
                                                       'document.body.appendChild(iframe);'
            });
        });
    } else {
        var search_url = chrome.runtime.getURL("search.html");
        search_url = search_url + "?q=" + encodeURIComponent(query);
        navigate(search_url);
    }
});

function navigate(url) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.update(tabs[0].id, {url: url});
    });
}

const shopPrefix = "shop";
const chatPrefix = "chat";

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        if (details.url.indexOf("https://www.doubleshotsearch.download/chrome-extension/search/?q=") !== -1
            || details.url.indexOf("chrome-extension://" + chrome.runtime.id + "/?q=") !== -1) {
            var url = $.url(details.url);
            var query = url.param("q");
            var search_url = chrome.runtime.getURL("search.html");
            search_url = search_url + "?q=" + encodeURIComponent(query);

            let queryWords = query.split(" ");
            if (queryWords.length > 1) {
                switch (queryWords[0].toLowerCase()) {
                    case shopPrefix:
                        queryWords[0] = shopPrefix;
                        query = queryWords.join(" ");
                        break;
                    case chatPrefix:
                        queryWords[0] = chatPrefix;
                        query = queryWords.join(" ");
                        break;
                    default:
                        break;
                }
            }

            if (query.startsWith("chat ")) {
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.update(tabs[0].id, { url: "https://bard.google.com/" }, function () {
                        setTimeout(() => {
                            chrome.tabs.sendMessage(tabs[0].id, {
                                action: "chat",
                                chatText: query.substring(5),
                            });
                        }, 2000);
                    });
                });
            } else {
                // Update to support the Edge version: 111.0.1661.54
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.update(tabs[0].id, { url: search_url });
                });
            }
        }
    },
    {urls: ["<all_urls>"]},
    ["blocking"]
);
