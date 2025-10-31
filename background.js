
chrome.webRequest.onCompleted.addListener(    

  (details) => {
    if (details.url.includes("/youtubei/v1/browse?prettyPrint=false") && details.method === "POST"){
        console.log("xd");
        console.log("background.js loaded");
        console.log("Request completed:", details.url);
        console.log("Method:", details.method);
        console.log("Request ID:", details.requestId);
        



    }
  },
  { urls: ["*://*.youtube.com/*"] }
);


