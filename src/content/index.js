chrome.runtime.onMessage.addListener(
    function(msg, sender, sendResponse){
        const h1 = document.createElement('h1');
        const text = document.createTextNode('Please do this: ${msg}');
        h1.appendChild(text);
        document.body.appendChild(h1); 
        sendResponse('looks good');

    }
)