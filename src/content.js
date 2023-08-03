"use strict";
const observeTarget = document.getElementsByTagName("ytd-popup-container")[0];
const observerOptions = {
    childList: true,
    attributes: true,
    subtree: true
};

const generateNoteWord = async () => {
    try {
        const url = document.getElementById("share-url").value;
        const targetUrl = (new URL(url)).host === "youtu.be" ? `https://www.youtube.com/watch?v=${url.split("/")[3]}` : url;
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
            url,
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