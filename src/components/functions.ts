export const handleChromeError = (error: chrome.runtime.LastError) => {
    alert(
        `There was an unexpected error: ${error.message}`
    );
    console.log("error", error);
}
export const uid = function(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}