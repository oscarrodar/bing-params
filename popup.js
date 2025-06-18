document.addEventListener('DOMContentLoaded', function () {
  const paramsForm = document.getElementById('paramsForm');

  paramsForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission

    const selectedParams = [];
    const checkboxes = paramsForm.querySelectorAll('input[type="checkbox"]:checked');

    checkboxes.forEach(function (checkbox) {
      selectedParams.push(checkbox.value); // value is "name=value"
    });

    if (selectedParams.length > 0) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0];
        if (currentTab && currentTab.id) {
          // Check if the tab has a valid URL before attempting to inject script
          if (currentTab.url && (currentTab.url.startsWith('http://') || currentTab.url.startsWith('https://'))) {
            chrome.scripting.executeScript({
              target: { tabId: currentTab.id },
              function: addParametersToUrlAndReload,
              args: [selectedParams]
            });
          } else {
            alert('Cannot add parameters to the current page. This extension only works on http or https pages.');
            // Optionally, you could disable the form or button if not on a valid page.
          }
        } else {
          console.error("Could not get current tab information.");
          alert("Error: Could not get current tab information.");
        }
      });
    } else {
      alert('Please select at least one parameter.');
    }
  });
});

function addParametersToUrlAndReload(paramsArray) {
  try {
    const url = new URL(window.location.href);
    paramsArray.forEach(paramString => {
      const parts = paramString.split('=');
      if (parts.length === 2) {
        url.searchParams.set(parts[0], parts[1]);
      }
    });
    window.location.href = url.toString();
  } catch (e) {
    // Alert if the current page is not a valid URL (e.g., about:blank) or any other error.
    alert(`Error modifying URL: ${e.message}. Please ensure you are on a valid http/https page.`);
  }
}
