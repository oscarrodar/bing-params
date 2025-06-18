# URL Parameter Adder Extension (React-based)

This browser extension, built with React, allows users to dynamically add, modify, or remove specific URL parameters from the current page's URL and then reloads the page to apply these changes. It loads existing parameter values from the URL when opened.

## Features

*   **Dynamic Parameter Input:**
    *   **Features**: Input field for comma-separated feature strings (e.g., `feat1,feat2,feat3`). This will be added as `features=feat1,feat2,feat3`.
    *   **Mobile**: A toggle switch to add (`mobile=1`) or remove the `mobile` parameter.
    *   **Test Hooks**: A toggle switch to add (`testhooks=1`) or remove the `testhooks` parameter.
    *   **Application Endpoint**: Input field for an application endpoint string (e.g., `BNZEEAP00033FAD`). This will be added as `setapplicationendpoint=BNZEEAP00033FAD`.
*   **Loads from URL:** When the popup is opened, it automatically loads and pre-fills the input fields with the current values of these parameters from the active tab's URL.
*   **Update and Reload:** Applies the configured parameters to the URL and reloads the page via the "Update URL & Reload" button.
*   **Works on `http` and `https` pages.** Status messages guide users if on incompatible pages.

## Quick Start Guide

### Step 1: Download React Libraries

**Important**: The React library files in this repository are placeholders. You must download the actual React libraries before the extension will work.

#### On Windows (PowerShell):

```powershell
# Navigate to the extension directory
cd "path\to\your\extension\folder"

# Download React libraries
Invoke-WebRequest -Uri "https://unpkg.com/react@18/umd/react.production.min.js" -OutFile "react.production.min.js"
Invoke-WebRequest -Uri "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" -OutFile "react-dom.production.min.js"
```

#### On Windows (Command Prompt):

```cmd
# Navigate to the extension directory
cd "path\to\your\extension\folder"

# Download React libraries using curl (available in Windows 10+)
curl -o react.production.min.js https://unpkg.com/react@18/umd/react.production.min.js
curl -o react-dom.production.min.js https://unpkg.com/react-dom@18/umd/react-dom.production.min.js
```

#### On Mac (Terminal):

```bash
# Navigate to the extension directory
cd "/path/to/your/extension/folder"

# Download React libraries using curl
curl -o react.production.min.js https://unpkg.com/react@18/umd/react.production.min.js
curl -o react-dom.production.min.js https://unpkg.com/react-dom@18/umd/react-dom.production.min.js
```

#### Alternative: Manual Download

If you prefer to download manually:

1. Visit: https://unpkg.com/react@18/umd/react.production.min.js
2. Save the file as `react.production.min.js` in your extension folder
3. Visit: https://unpkg.com/react-dom@18/umd/react-dom.production.min.js
4. Save the file as `react-dom.production.min.js` in your extension folder

### Step 2: Load the Extension in Your Browser

#### Google Chrome / Microsoft Edge (Chromium-based):

1. Open your browser and navigate to:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`

2. Enable **Developer mode** (toggle switch usually in the top right)

3. Click **"Load unpacked"**

4. Navigate to your extension folder (the one containing `manifest.json`) and select it

5. The extension should now appear in your extensions list and its icon should be visible in the browser toolbar

#### Mozilla Firefox:

1. Open Firefox and navigate to: `about:debugging#/runtime/this-firefox`

2. Click **"Load Temporary Add-on..."**

3. Navigate to your extension folder and select the `manifest.json` file

4. The extension will be loaded temporarily (until you close Firefox)

### Step 3: Test the Extension

1. **Navigate** to any website (e.g., `https://www.example.com`)
2. **Click the extension icon** in your browser toolbar to open the popup
3. **Test the features**:
   - Add features in the "Features" field (e.g., `feat1,feat2`)
   - Toggle "Mobile Mode" on/off
   - Toggle "Test Hooks" on/off
   - Add an application endpoint (e.g., `ENDPOINT123`)
4. **Click "Update URL & Reload"** to apply the parameters
5. **Verify** that the URL now includes your parameters and the page reloaded

## Development Setup & Libraries Note

This extension uses React for its user interface. The core React logic is in `app.js`.

*   **React Libraries**: It requires `react.production.min.js` and `react-dom.production.min.js` to be present in the root directory of the extension.
    *   **Important**: The files in the repository are **placeholders** (empty files with a comment). For the extension to function, you must download the actual React library files using the commands provided in the Quick Start Guide above.
*   **No JSX Build Step**: The React components in `app.js` are written using `React.createElement`. This was done to keep the setup simple and avoid requiring a JavaScript build process (e.g., Babel for JSX, and a bundler like Webpack or Parcel). For more complex development or if you prefer JSX, integrating such a build process would be the next step.

## Detailed Testing Instructions

### Testing Steps

1.  **Prerequisite**: Ensure you have downloaded the actual React library files using the Quick Start Guide above.
2.  Navigate to any website (e.g., `https://www.example.com`).
3.  Click the extension's icon in the browser toolbar. The popup should appear.
4.  **Test Initial Load**:
    *   If the URL already has parameters like `features=test`, `mobile=1`, `testhooks=1`, or `setapplicationendpoint=somevalue`, the corresponding fields in the popup should be pre-filled.
    *   Try on a clean URL (e.g., `https://www.example.com`) – fields should be empty or toggles off.
5.  **Test Input Fields**:
    *   Enter a value in "Features (comma-separated):", e.g., `myfeat,anotherfeat`.
    *   Toggle "Mobile Mode" on.
    *   Toggle "Test Hooks" on.
    *   Enter a value in "Application Endpoint:", e.g., `ENDPOINT123`.
6.  Click the "Update URL & Reload" button.
7.  **Verify URL Change**: The page should reload. The URL in the address bar should now include the parameters you set.
    *   Example: if on `https://www.example.com` and you set "Features" to `f1,f2` and "Mobile Mode" to on, the new URL should be similar to `https://www.example.com/?features=f1%2Cf2&mobile=1`. (Note: comma might be URL-encoded as `%2C`).
8.  **Test Parameter Modification/Removal**:
    *   Open the popup again. Values should be pre-filled.
    *   Change the "Features" value or clear it.
    *   Toggle "Mobile Mode" off.
    *   Click "Update URL & Reload". Verify the URL reflects these changes (e.g., `mobile=1` is removed).
9.  Test adding parameters to URLs that already have *other* (non-managed) parameters. These other parameters should be preserved.
10. Test on different websites.
11. Test on non-http/https pages (e.g., `about:blank` or a local file `file:///...`). The popup should display a message indicating it cannot operate on such pages.

## Troubleshooting

### Common Issues:

1. **Extension popup shows errors**: Make sure you've downloaded the actual React library files and replaced the placeholders.

2. **Extension doesn't appear in toolbar**: Check that Developer mode is enabled and the extension loaded successfully.

3. **Parameters not being added**: Ensure you're testing on `http://` or `https://` pages, not local files or browser-specific pages.

4. **Extension disappears after browser restart (Firefox)**: This is normal for temporary add-ons in Firefox. You'll need to reload it each time.

## Preparing for Publishing

Before publishing to extension stores, you'll need to:

1.  **Replace Placeholder Icons:** The current icons in the `icons/` directory (`icon16.png`, `icon48.png`, `icon128.png`) are placeholder text files. You should replace these with actual PNG image files of the specified dimensions.
2.  **Include Actual React Libraries:** Ensure `react.production.min.js` and `react-dom.production.min.js` are the actual library files, not placeholders (follow the Quick Start Guide above).
3.  **Thoroughly Test:** Test all features across Chrome, Firefox, and Edge as per the "Testing Steps" above.
4.  **Review Store-Specific Guidelines:**
    *   [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
    *   [Microsoft Edge Add-ons Developer Portal](https://partner.microsoft.com/en-us/dashboard/microsoftedge/)
    *   [Firefox Add-on Developer Hub](https://addons.mozilla.org/en-US/developers/)
    Each store has its own policies regarding manifest fields, permissions, UI, security, and content. Ensure your extension complies with all of them.
5.  **Create Store Listing Assets:** This typically includes:
    *   A compelling and clear extension name and description.
    *   Screenshots of your extension in action.
    *   Promotional images or videos (if applicable).
    *   A privacy policy (if your extension handles user data, though this one primarily manipulates URLs locally).
6.  **Package Your Extension:**
    *   For Chrome Web Store and Microsoft Edge Add-ons, you typically create a ZIP file containing all your extension files (`manifest.json`, `popup.html`, `app.js`, `style.css`, actual React libraries, and the `icons/` directory).
    *   Firefox also uses a ZIP file, often with a `.xpi` extension, but the packaging process is similar.

Refer to the documentation provided by each browser's extension store for the most up-to-date and detailed instructions.
