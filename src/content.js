"use strict";
const observeTarget = document.getElementsByTagName("body")[0];
const observerOptions = {
    childList: true,
    attributes: true,
    subtree: true
};
const getTitleInner = (videoMetaData, url) => {
    switch(true) {
        case /shorts/.test(url.pathname):
            const shortVideoMetaData = document.querySelectorAll("a.ytd-rich-grid-slim-media");
            return Array.from(shortVideoMetaData).find(el => {
                return (new URL(el.href)).pathname.split("/")[2]=== url.pathname.split("/")[2];
            }).title;
        case /live/.test(url.pathname):
            return Array.from(videoMetaData).find(el => {
                return (new URLSearchParams((new URL(el.href)).search)).get("v") === url.pathname.split("/")[2]
            }).title;
        default:
            return Array.from(videoMetaData).find(el => {
                return (new URLSearchParams((new URL(el.href)).search)).get("v") === url.pathname.replace("/", "")
            }).title;
    }
}
const getTitle = (url) => {
    if (window.location.pathname === "/watch") {
        return document.querySelector("yt-formatted-string.ytd-watch-metadata").textContent;
    } else if (window.location.pathname === "/") {
        // NOTE: なぜかホームだけidがvideo-title-linkになってる 統一されたらこの分岐は不要になる
        const videoMetaData = document.querySelectorAll("a#video-title-link");
        return getTitleInner(videoMetaData, url);
    } else if (window.location.pathname === "/playlist") {
        // NOTE: playlist画面でのシェアは以下のようにとれば行ける
        // なぜかyoutubeは同じidを複数の同じタグに付与しておりタグ＋idだけでは特定できない
        return document.querySelectorAll("yt-formatted-string#text.yt-dynamic-sizing-formatted-string")[0].textContent;
    } else {
        // NOTE: 急上昇、検索ではidがvideo-title
        const videoMetaData = document.querySelectorAll("a#video-title");
        return getTitleInner(videoMetaData, url);
    }
}

const generateNoteWord = () => {
    try {
        const url = new URL(document.getElementById("share-url").value);
        return {
            title: getTitle(url),
            url: encodeURIComponent(url.href),
        };
    } catch (error) {
        console.log(error);
    }
}

const main = () => {
    const observer = new MutationObserver(() => {
        addMisskeyShareButton(observer, generateNoteWord)
    });
    observer.observe(observeTarget, observerOptions);
}
main()