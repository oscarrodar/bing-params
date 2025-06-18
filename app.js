/* global React, ReactDOM, chrome */

const { useEffect, useState } = React;

// --- Re-define child components (FeaturesInput, ToggleSwitch, EndpointInput) here ---
// (These were defined in previous steps and are assumed to be here for completeness if running this script standalone)
function FeaturesInput(props) {
  return React.createElement('div', { style: { marginBottom: '10px' } },
    React.createElement('label', { htmlFor: 'featuresInput', style: { display: 'block', marginBottom: '3px', fontSize: '0.9em' } }, 'Features (comma-separated): '),
    React.createElement('input', {
      type: 'text',
      id: 'featuresInput',
      value: props.value,
      onChange: props.onChange,
      style: { width: 'calc(100% - 10px)', padding: '4px', border: '1px solid #ccc', borderRadius: '3px' }
    })
  );
}

function ToggleSwitch(props) {
  return React.createElement('div', { style: { margin: '8px 0', display: 'flex', alignItems: 'center' } },
    React.createElement('input', {
      type: 'checkbox',
      id: props.id,
      checked: props.checked,
      onChange: props.onChange,
      style: { marginRight: '5px' }
    }),
    React.createElement('label', { htmlFor: props.id, style: { fontSize: '0.9em' } }, props.label)
  );
}

function EndpointInput(props) {
  return React.createElement('div', { style: { marginBottom: '10px' } },
    React.createElement('label', { htmlFor: 'endpointInput', style: { display: 'block', marginBottom: '3px', fontSize: '0.9em' } }, 'Application Endpoint: '),
    React.createElement('input', {
      type: 'text',
      id: 'endpointInput',
      value: props.value,
      onChange: props.onChange,
      style: { width: 'calc(100% - 10px)', padding: '4px', border: '1px solid #ccc', borderRadius: '3px' }
    })
  );
}
// --- End of re-defined child components ---

function App() {
  const [features, setFeatures] = useState('');
  const [mobile, setMobile] = useState(false);
  const [testhooks, setTestHooks] = useState(false);
  const [endpointValue, setEndpointValue] = useState('');
  const [statusMessage, setStatusMessage] = useState('Loading parameters...');

  useEffect(() => {
    // Logic to load parameters on mount (from previous step)
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.scripting) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        if (currentTab && currentTab.id) {
          if (currentTab.url && (currentTab.url.startsWith('http://') || currentTab.url.startsWith('https://'))) {
            chrome.scripting.executeScript(
              {
                target: { tabId: currentTab.id },
                function: () => {
                  const params = new URL(window.location.href).searchParams;
                  return {
                    features: params.get('features') || '',
                    mobile: params.get('mobile') === '1',
                    testhooks: params.get('testhooks') === '1',
                    setapplicationendpoint: params.get('setapplicationendpoint') || ''
                  };
                }
              },
              (injectionResults) => {
                if (chrome.runtime.lastError) {
                  console.error('Error injecting script or getting params:', chrome.runtime.lastError.message);
                  setStatusMessage(`Error loading params: ${chrome.runtime.lastError.message}`);
                  return;
                }
                if (injectionResults && injectionResults.length > 0 && injectionResults[0].result) {
                  const loadedParams = injectionResults[0].result;
                  setFeatures(loadedParams.features);
                  setMobile(loadedParams.mobile);
                  setTestHooks(loadedParams.testhooks);
                  setEndpointValue(loadedParams.setapplicationendpoint);
                  setStatusMessage('Parameters loaded. Modify and update.');
                } else {
                  setStatusMessage('Could not retrieve parameters.');
                  setFeatures(''); setMobile(false); setTestHooks(false); setEndpointValue('');
                }
              }
            );
          } else {
            setStatusMessage('Extension works only on http/https pages.');
          }
        } else {
          setStatusMessage('Could not access current tab.');
        }
      });
    } else {
      setStatusMessage('Not in Chrome extension. Using defaults.');
      console.warn('chrome.tabs or chrome.scripting API not available.');
    }
  }, []);

  const handleUpdateUrl = () => {
    setStatusMessage('Updating URL...');
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.scripting) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        if (currentTab && currentTab.id) {
          if (currentTab.url && (currentTab.url.startsWith('http://') || currentTab.url.startsWith('https://'))) {
            chrome.scripting.executeScript(
              {
                target: { tabId: currentTab.id },
                function: updateUrlAndReload, // This function is defined below
                args: [{ features, mobile, testhooks, endpointValue }]
              },
              (injectionResults) => {
                if (chrome.runtime.lastError) {
                  console.error('Error updating URL:', chrome.runtime.lastError.message);
                  setStatusMessage(`Error: ${chrome.runtime.lastError.message}`);
                  return;
                }
                if (injectionResults && injectionResults.length > 0 && injectionResults[0].result) {
                  const result = injectionResults[0].result;
                  if (result.success) {
                    setStatusMessage('URL updated. Page may reload.');
                    // Optionally close popup: window.close();
                  } else {
                    setStatusMessage(`Failed to update URL: ${result.error}`);
                  }
                } else {
                   setStatusMessage('Failed to update URL. No result from script.');
                }
              }
            );
          } else {
            setStatusMessage('Cannot update URL on non http/https pages.');
          }
        } else {
          setStatusMessage('Could not access current tab to update URL.');
        }
      });
    } else {
      setStatusMessage('Not in Chrome extension. Cannot update URL.');
      console.warn('chrome.tabs or chrome.scripting API not available for URL update.');
    }
  };

  // This function is executed in the context of the web page (content script)
  function updateUrlAndReload(params) {
    try {
      const url = new URL(window.location.href);
      const managedKeys = ['features', 'mobile', 'testhooks', 'setapplicationendpoint'];

      // Clear existing managed parameters
      managedKeys.forEach(key => url.searchParams.delete(key));

      // Set new values
      if (params.features && params.features.trim() !== '') {
        url.searchParams.set('features', params.features.trim());
      }
      if (params.mobile) {
        url.searchParams.set('mobile', '1');
      }
      if (params.testhooks) {
        url.searchParams.set('testhooks', '1');
      }
      if (params.endpointValue && params.endpointValue.trim() !== '') {
        url.searchParams.set('setapplicationendpoint', params.endpointValue.trim());
      }

      if (window.location.href !== url.toString()) {
        window.location.href = url.toString();
      } else {
        // If URL is identical, no reload needed.
        // Consider if a visual confirmation or forced reload is desired by user.
        // For now, if no change, nothing happens.
      }
      return { success: true, newUrl: url.toString() };
    } catch (e) {
      // console.error("Error updating URL in content script:", e); // For debugging on the page
      return { success: false, error: e.message };
    }
  }

  return React.createElement('div', { style: { padding: '10px', fontFamily: 'sans-serif', minHeight: '280px' } },
    React.createElement('h1', { style: { fontSize: '1.3em', textAlign: 'center', marginBottom: '10px', marginTop: '5px'} }, 'URL Parameters'),
    React.createElement('div', { style: { fontSize: '0.8em', textAlign: 'center', marginBottom: '10px', minHeight: '1.2em', color: statusMessage.startsWith('Error') || statusMessage.startsWith('Failed') ? 'red' : 'green' } }, statusMessage),
    React.createElement(FeaturesInput, {
      value: features,
      onChange: (e) => setFeatures(e.target.value)
    }),
    React.createElement(ToggleSwitch, {
      id: 'mobileToggle',
      label: 'Mobile Mode (mobile=1)',
      checked: mobile,
      onChange: (e) => setMobile(e.target.checked)
    }),
    React.createElement(ToggleSwitch, {
      id: 'testhooksToggle',
      label: 'Test Hooks (testhooks=1)',
      checked: testhooks,
      onChange: (e) => setTestHooks(e.target.checked)
    }),
    React.createElement(EndpointInput, {
      value: endpointValue,
      onChange: (e) => setEndpointValue(e.target.value)
    }),
    React.createElement('button', {
      style: {
        marginTop: '15px',
        padding: '10px 15px',
        width: '100%',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '1em'
      },
      onClick: handleUpdateUrl
    }, 'Update URL & Reload')
  );
}

ReactDOM.render(
  React.createElement(App),
  document.getElementById('root')
);
