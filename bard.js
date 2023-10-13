// listen to chat request from background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "chat") {
    const chatText = request.chatText;
    // resize the chat and add Bing Chat under an iframe
    var chatApp = document.querySelector('chat-app')
    chatApp.style = "width:50%";
    var header = document.querySelector('header')
    header.style = "width:50%";

    var iframe = document.createElement("iframe");
    iframe.style = "width:50%;height:100%;position:absolute;top:0;right:0";

    document.body.appendChild(iframe); 
        

    const waitForElement = (selector, callback) => {
      const element = document.querySelector(selector);
      if (element) {
        callback(element);
      } else {
        setTimeout(() => {
          waitForElement(selector, callback);
        }, 500);
      }
    };

    waitForElement('textarea[placeholder="Enter a prompt here"]', (textarea) => {
      textarea.value = chatText;
      
      // Trigger the input event
      const inputEvent = new Event('input', { bubbles: true, cancelable: true });
      textarea.dispatchEvent(inputEvent);

      const button = document.querySelector('button[aria-label="Send message"]');
      if (button && !button.disabled) {
        button.click();
      }
    });

    var searchUrl = `https://www.bing.com/search?q=${chatText}&showconv=1&sendquery=1&FORM=hpcodx`;
    iframe.src = searchUrl
  }
});
