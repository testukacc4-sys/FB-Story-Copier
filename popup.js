document.getElementById('copyBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab.url.includes("facebook.com")) {
    alert("Please use this on a Facebook post page.");
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      // Facebook පෝස්ට් එකේ ටෙක්ස්ට් එක තිබිය හැකි ස්ථාන (Selectors)
      const selectors = [
        'div[data-ad-preview="message"]', 
        'div[role="article"] div[dir="auto"]',
        '.x1iorvi4.x1pi3pd7.x1swvt1m' // FB අලුත් අප්ඩේට් වල බහුලව ඇති class එකක්
      ];
      
      let postText = "";
      
      for (let s of selectors) {
        const elements = document.querySelectorAll(s);
        for (let el of elements) {
          // වැඩිම අකුරු ප්‍රමාණයක් ඇති කොටස තෝරාගනී (Story එක සාමාන්‍යයෙන් දිගම කොටසයි)
          if (el.innerText.length > postText.length) {
            postText = el.innerText;
          }
        }
      }

      if (postText) {
        // "See more" වැනි අනවශ්‍ය කොටස් ඉවත් කිරීම (Optional)
        postText = postText.replace(/See more|තවත් බලන්න/g, "").trim();

        // ටෙක්ස්ට් එක Clipboard එකට Copy කිරීම
        const textArea = document.createElement("textarea");
        textArea.value = postText;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          alert("Story copied successfully!");
        } catch (err) {
          alert("Oops, unable to copy");
        }
        document.body.removeChild(textArea);
      } else {
        alert("Could not find any story text on this post.");
      }
    }
  });
});
