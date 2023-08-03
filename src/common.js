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
const addMisskeyShareButton = async (observer, generateNoteWord) => {
    // 要素を加えることでmutationObserverが無限ループするので追加の処理中はdisconnectする
    observer.disconnect()
    const shareButtonList = document.querySelector("div #list .yt-third-party-share-target-section-renderer");
    const isVisibleShareMenuDialog = !document.getElementsByTagName("ytcp-video-share-dialog").ariaHidden;
    const renderedMisskeyShareButton = document.querySelector(".misskey-share-button");
    if(!isVisibleShareMenuDialog || renderedMisskeyShareButton)  {
        observer.observe(observeTarget, observerOptions)
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
    observer.observe(observeTarget, observerOptions)
}
