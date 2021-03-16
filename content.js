// Open links in new tab only when navigating to Bing or Google using the extension
if (location && location.href.indexOf("ds=1") >= 0) {
    var head = document.getElementsByTagName("head")[0];
    if (head) {
        var base = document.createElement("base");
        base.setAttribute("target", "_blank");
        head.appendChild(base);
    }

    function receiver(event) {
        if (event.origin.indexOf('-extension://') > 0 && event.data && event.data.type) {
            switch (event.data.type) {
                case "Load":
                    event.source.postMessage({
                        scroll:  (document.documentElement.scrollWidth * 100) /  document.documentElement.clientWidth,
                        height: document.documentElement.scrollHeight
                    }, event.origin);
                    
                    // Listen to Ajax navigation
                    window.addEventListener("message", function(e) {
                        if (e.source === window && e.data.api) {
                            var d = e.data;
                            switch (d.api) {
                              case "pushState":
                                event.source.postMessage({ url: d.url }, event.origin);
                                break;
                            }
                        }
                    });
            
                    // Execute script in webpage context
                    var script = document.createElement("script");
                    var code = proxy();
                    script.innerText = code;
                    document.body.appendChild(script);

                    break;
                case "Resize":
                    event.source.postMessage({
                        scroll:  (document.documentElement.scrollWidth * 100) /  document.documentElement.clientWidth,
                        height: document.documentElement.scrollHeight
                    }, event.origin);
                    break;
                case "Scroll":
                    document.documentElement.scrollLeft = event.data.value;
                    break;

            }
            
        }
    }

    // Let the code within webpage context to communicate back to the extension
    function proxy() {
        var closure = () => {
            var pushState = history.pushState;
            history.pushState = function(state, title, url) {
                pushState.apply(this, arguments);
                window.postMessage({ api: "pushState", url: location.href }, "*");
            };
        };
        return `(${closure.toString()})();`;
    }

    function load() {
        var links = document.querySelectorAll("a");
        for (var i = 0; i < links.length; i++) {
            links[i].setAttribute("target", "_blank");
            links[i].setAttribute("rel", "opener");
        }
    }

    window.addEventListener("message", receiver, false);
    window.addEventListener("load", load, false);
    
}