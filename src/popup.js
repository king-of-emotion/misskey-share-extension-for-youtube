chrome.storage.sync.get(["share_target_misskey_url"], result => {
  if(!result.share_target_misskey_url)  {
    chrome.storage.sync.set({share_target_misskey_url: false})
  } else {
    document.getElementById("misskeyUrl").value = result.share_target_misskey_url;
  }

});
document.querySelector("#submitButton").addEventListener("click", () => {
    const url = document.querySelector("#misskeyUrl").value;
    chrome.storage.sync.set({
      "share_target_misskey_url": url,
    })
  });