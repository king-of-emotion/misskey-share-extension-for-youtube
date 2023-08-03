chrome.storage.sync.get(["share_target_misskey_url"], result => {
  if(!result.share_target_misskey_url)  {
    chrome.storage.sync.set({share_target_misskey_url: false})
  } else {
    document.getElementById("misskey-url").value = result.share_target_misskey_url;
  }

});
document.querySelector("#misskey-url-submit-button").addEventListener("click", () => {
    const url = document.getElementById("misskey-url").value;
    chrome.storage.sync.set({
      "share_target_misskey_url": url,
    })
  });