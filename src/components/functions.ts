export const handleChromeError = (error: chrome.runtime.LastError) => {
    alert(
        `There was an unexpected error: ${error.message}`
    );
    console.log("error", error);
}