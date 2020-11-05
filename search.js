let height = 0;

function resize() {
    var handler = document.querySelector('.handler');
    var wrapper = document.querySelector('.wrapper');
    var boxA = document.querySelector('.box');
    var isHandlerDragging = false;

    document.addEventListener('mousedown', function(e) {
        if (e.target === handler) {
            isHandlerDragging = true;
            document.getElementById("shield-left").style.display = "block";
            document.getElementById("shield-right").style.display = "block";
        }
    });

    document.addEventListener('mouseup', function(e) {
        isHandlerDragging = false;
        document.getElementById("shield-left").style.display = "none";
        document.getElementById("shield-right").style.display = "none";
    });

    document.addEventListener('mousemove', function(e) {
        if (!isHandlerDragging) {
            return false;
        }

        var containerOffsetLeft = wrapper.offsetLeft;
        var pointerRelativeXpos = e.clientX - containerOffsetLeft;
        var boxAminWidth = 60;
        boxA.style.width = (Math.max(boxAminWidth, pointerRelativeXpos - 8)) + 'px';
        boxA.style.flexGrow = 0;
    });
}

function onload(e) { 
    let iframe = e.target;
    iframe.contentWindow.postMessage("Load", '*');
    window.addEventListener("message", function(event) {
        if (event.data) {
            if (event.data.height) {
                height = Math.max(event.data.height, height);
                document.body.style.height = height + "px";
            } else if (event.data.query) {
                location.href = "/search.html?q=" + encodeURIComponent(event.data.query);
            }
        }
    }, false);
}

const shopPrefix = "shop ";
$( document ).ready(function() {
    resize();
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
        $("#left").load(onload);
        $("#right").load(onload);
        $("#left").attr("src", left + encodeURIComponent(query));
        $("#right").attr("src", right + encodeURIComponent(query));
        document.title = query.replace(/</g, "&lt;").replace(/>/g, "&gt;") + " - Double Shot Search";
    }
});