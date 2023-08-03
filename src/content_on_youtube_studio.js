"use strict";
const observeTarget = document.getElementsByTagName("body")[0];
const observerOptions = {
    childList: true,
    attributes: true,
    subtree: true
};

const generateNoteWord = () => {
    try {
        const url = document.getElementById("share-url").getAttribute("href");
        const title = document.querySelector(".value.title.style-scope.ytls-broadcast-metadata").textContent;
        return {
            title,
            url,
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