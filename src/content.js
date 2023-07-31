"use strict";
const popupContainer = document.getElementsByTagName("ytd-popup-container")[0];
const observerOptions = {
    childList: true,
    attributes: true,
    subtree: true
};

const generateNoteWord = () => {
    try {
        // HACK: meta titleを見たかったがyoutubeのバグでmetaタグがひとつ前に見てる者になることがあるので別のところからとってきている
        const title = document.querySelector('a[data-sessionlink="feature=player-title"]').textContent;
        const url = document.querySelector('link[rel="shortlinkUrl"]').href;
        return {
            title,
            url
        };
    } catch (error) {
        console.log(error);
    }
}
const addMisskeyShareButton = (observer) => {
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
        const words = generateNoteWord();
        misskeyShareButton.onclick = () => {
            window.open("https://misskey.io/share" + `?text=${words.title}&url=${words.url}`, "_blank");
        }
        const baseChild = document.getElementsByTagName("yt-share-target-renderer")[1];
        baseChild.parentNode.insertBefore(misskeyShareButton, baseChild);
    }
    observer.observe(popupContainer, observerOptions)
}
const main = () => {
    const observer = new MutationObserver(() => {
        addMisskeyShareButton(observer)
    });
    observer.observe(popupContainer, observerOptions);
}
main()