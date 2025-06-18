# URL Parameter Adder Extension

This browser extension allows users to select predefined URL parameters and add them to the current page's URL, then reloads the page.

## Features

*   Select from a list of parameters:
    *   `features=acftokall,finacfmgux`
    *   `mobile=1`
    *   `setapplicationendpoint=BNZEEAP00033FAD`
    *   `testhooks=1`
*   Reloads the page with the selected parameters.
*   Works on `http` and `https` pages.

## How to Test (Locally)

To test this extension locally, follow these steps for your browser:

### Google Chrome / Microsoft Edge (Chromium-based)

1.  Open your browser and navigate to `chrome://extensions` (for Chrome) or `edge://extensions` (for Edge).
2.  Enable **Developer mode**. This is usually a toggle switch on the top right of the page.
3.  Click on the **"Load unpacked"** button.
4.  In the file dialog that appears, navigate to the directory where you have the extension files (the directory containing `manifest.json`) and select this directory.
5.  The extension should now be loaded and visible in your extensions list. You can click its icon (which will be a placeholder) in the browser toolbar to open the popup.

### Mozilla Firefox

1.  Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
2.  Click on **"Load Temporary Add-on..."**.
3.  In the file dialog, navigate to the directory containing the extension files and select the `manifest.json` file (or any file in the root of the extension directory).
4.  The extension should now be loaded temporarily. You can click its icon in the browser toolbar.

### Testing Steps

1.  Navigate to any website (e.g., `https://www.example.com`).
2.  Click the extension's icon in the browser toolbar.
3.  The popup should appear with the list of parameters.
4.  Select one or more parameters using the checkboxes.
5.  Click the "Add Parameters and Reload" button.
6.  The page should reload, and the URL in the address bar should now include the parameters you selected. For example, if you selected `mobile=1` on `https://www.example.com`, the new URL should be `https://www.example.com/?mobile=1`.
7.  Test adding parameters to URLs that already have parameters.
8.  Test on different websites.
9.  Test deselecting all parameters (should show an alert).
10. Test on non-http/https pages (e.g., `about:blank` or a local file `file:///...`) to see the alert message.


## Preparing for Publishing

Before publishing to extension stores, you'll need to:

1.  **Replace Placeholder Icons:** The current icons in the `icons/` directory (`icon16.png`, `icon48.png`, `icon128.png`) are placeholder text files. You should replace these with actual PNG image files of the specified dimensions.
2.  **Thoroughly Test:** Test all features across Chrome, Firefox, and Edge as per the "Testing Steps" above.
3.  **Review Store-Specific Guidelines:**
    *   [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
    *   [Microsoft Edge Add-ons Developer Portal](https://partner.microsoft.com/en-us/dashboard/microsoftedge/)
    *   [Firefox Add-on Developer Hub](https://addons.mozilla.org/en-US/developers/)
    Each store has its own policies regarding manifest fields, permissions, UI, security, and content. Ensure your extension complies with all of them.
4.  **Create Store Listing Assets:** This typically includes:
    *   A compelling and clear extension name and description.
    *   Screenshots of your extension in action.
    *   Promotional images or videos (if applicable).
    *   A privacy policy (if your extension handles user data, though this one primarily manipulates URLs locally).
5.  **Package Your Extension:**
    *   For Chrome Web Store and Microsoft Edge Add-ons, you typically create a ZIP file containing all your extension files (`manifest.json`, `popup.html`, `popup.js`, `style.css`, and the `icons/` directory).
    *   Firefox also uses a ZIP file, often with a `.xpi` extension, but the packaging process is similar.

Refer to the documentation provided by each browser's extension store for the most up-to-date and detailed instructions.
