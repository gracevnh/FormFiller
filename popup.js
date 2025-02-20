// Store CSS data in the "local" storage area.
const storage = chrome.storage.local;

const message = document.querySelector('#message');

// Check if there is CSS specified.
async function run() {
  const items = await storage.get('css');
  if (items.css) {
    const [currentTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });
    try {
      await chrome.scripting.insertCSS({
        css: items.css,
        target: {
          tabId: currentTab.id
        }
      });
      message.innerText = 'Injected style from storage!';
    } catch (e) {
      console.error(e);
      message.innerText = 'Injection of style from stroage failed.';
    }
  } else {
    message.innerText = 'No CSS style set.';
  }
}

run();
