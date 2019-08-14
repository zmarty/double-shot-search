# Double Shot Search Chrome Extension: Search two search engines side-by-side

Allows searching in both Bing and Google at the same time by showing the results from both search engines side by side. In other words, this extension enables multi-search across two search engines at the same time by showing the result pages next to each other. This extension works best on high resolution screens.

You can [download it from the Chrome Web Store](https://chrome.google.com/webstore/detail/double-shot-search-bing-a/kddlkbpbepnaepdleclhdnfdpdogdhop?hl=en) to install it in Chrome.

![Double Show Search Chrome Extension Example Screenshot](/example-screenshot.png?raw=true "Double Show Search Chrome Extension Example Screenshot")

Technical details: 
* The extension sets itself as the default search engine.
* This extension requires some advanced permissions to force Google to load in an iframe by modifying the X-Frame-Options header Google sends to the browser. We do NOT modify any other page in any other way.
