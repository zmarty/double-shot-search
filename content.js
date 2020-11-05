// Open links in new tab only when navigating to Bing or Google using the extension
if (location && location.href.indexOf("ds=1") >= 0) {
    var head = document.getElementsByTagName("head")[0];
    if (head) {
        var base = document.createElement("base");
        base.setAttribute("target", "_blank");
        head.appendChild(base);
    }

    function scroll() {
        // Minimize left gutter if visible area is less than the width of the page
        if (document.documentElement.scrollWidth - document.documentElement.clientWidth > 140) {
            document.documentElement.scrollTo({top: 0, left: 140, behavior: 'smooth'});
        }
    }

    function receiver(event) {
        if (event.origin.indexOf('-extension://') > 0) {
            switch (event.data) {
                case "Load":
                    event.source.postMessage({ height: document.documentElement.scrollHeight}, event.origin);
                    scroll();
                    const observer = new MutationObserver(function() {
                        event.source.postMessage({ query: document.title.split(" - ")[0]}, event.origin);
                    });
                    observer.observe(document.getElementsByTagName("title")[0], { attributes: true, childList: true, subtree: true });
                    break;
            }
            
        }
    }

    window.addEventListener("message", receiver, false);
    window.addEventListener("resize", scroll, false);
    
}