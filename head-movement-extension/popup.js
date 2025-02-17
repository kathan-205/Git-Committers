document.getElementById("start").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ["content.js"]
        });
    });
});

document.getElementById("stop").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
                let videos = document.querySelectorAll("video");
                videos.forEach(video => video.remove());
                let canvases = document.querySelectorAll("canvas");
                canvases.forEach(canvas => canvas.remove());
            }
        });
    });
});
