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
                    const observer = new MutationObserver(function() {
                        event.source.postMessage({ query: document.title.split(" - ")[0]}, event.origin);
                    });
                    observer.observe(document.getElementsByTagName("title")[0], { attributes: true, childList: true, subtree: true });
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