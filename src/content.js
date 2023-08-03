"use strict";
const popupContainer = document.getElementsByTagName("ytd-popup-container")[0];
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
// HACK: これ以外のパターンできたら対応しない
const generateUrl = (str) => {
    if (!str || str.length === 0 ) {
        return undefined;
    }
    if(str.startsWith("http")) {
        return str.replace(/\/$/, "");
    }
    return "https://" + str.replace(/\/$/, "");
}
const addMisskeyShareButton = async (observer) => {
    // 要素を加えることでmutationObserverが無限ループするので追加の処理中はdisconnectする
    observer.disconnect()
    const shareButtonList = document.querySelector("div #list .yt-third-party-share-target-section-renderer");
    const isVisibleShareMenuDialog = !document.getElementsByTagName("tp-yt-paper-dialog").ariaHidden;
    const renderedMisskeyShareButton = document.querySelector(".misskey-share-button");
    if(!isVisibleShareMenuDialog || renderedMisskeyShareButton)  {
        observer.observe(popupContainer, observerOptions)
        return;
    }
    if (shareButtonList) {
        const misskeyShareButton = document.createElement("button");
        misskeyShareButton.className = "misskey-share-button";
        const misskeyIcon = document.createElement("img");
        misskeyIcon.className = "misskey-icon";
        misskeyIcon.src = "https://raw.githubusercontent.com/misskey-dev/assets/main/icon.png";
        misskeyShareButton.appendChild(misskeyIcon);
        const misskeyShareButtonTitle = document.createElement("div");
        misskeyShareButtonTitle.className = "misskey-share-button-title";
        misskeyShareButtonTitle.textContent = "misskey";
        misskeyShareButton.appendChild(misskeyIcon);
        misskeyShareButton.appendChild(misskeyShareButtonTitle);
        const words = await generateNoteWord();
        misskeyShareButton.onclick = () => {
            chrome.storage.sync.get(["share_target_misskey_url"], result => {
                const misskeyUrl = result.share_target_misskey_url && result.share_target_misskey_url.length > 0 ? result.share_target_misskey_url : "https://misskey.io"
                window.open(generateUrl(misskeyUrl) + "/share" + `?text=${encodeURIComponent(words.title)}&url=${words.url}`, "_blank");
            });
        }
        const baseChild = document.getElementsByTagName("yt-share-target-renderer")[1];
        baseChild.parentNode.insertBefore(misskeyShareButton, baseChild);
    }
    observer.observe(popupContainer, observerOptions)
}
const main = () => {
    const observer = new MutationObserver(async () => {
        await addMisskeyShareButton(observer)
    });
    observer.observe(popupContainer, observerOptions);
}
main()