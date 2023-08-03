"use strict";
const observeTarget = document.getElementsByTagName("body")[0];
const observerOptions = {
    childList: true,
    attributes: true,
    subtree: true
};
const getTargetUrl = (url) => {
    switch(url.host) {
        case "youtu.be":
            return `https://www.youtube.com/watch?v=${url.pathname.replace(/\//, "")}`
        case "youtube.com":
            url.host = "www.youtube.com";
            return url;
        default:
            return url;
    }
}

const generateNoteWord = async () => {
    try {
        const url = new URL(document.getElementById("share-url").value);
        const targetUrl = getTargetUrl(url);
        const response = await fetch(targetUrl, {
            method: 'GET',
            mode: 'same-origin',
            headers: {
            'Content-Type': 'text/html',
            }});
        const string = await new Response(response.body).text();
        const domParser = new DOMParser();
        const targetDocument = domParser.parseFromString(string, "text/html");
        const title = targetDocument.querySelector("meta[name=title]").content;
        return {
            title,
            url: url.href,
        };
    } catch (error) {
        console.log(error);
    }
}

const main = () => {
    const observer = new MutationObserver(async () => {
        await addMisskeyShareButton(observer, generateNoteWord)
    });
    observer.observe(observeTarget, observerOptions);
}
main()