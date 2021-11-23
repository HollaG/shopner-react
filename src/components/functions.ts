import { DOMMessage, DOMMessageResponse } from "../types";

export const handleChromeError = (error: chrome.runtime.LastError) => {
    // alert(`There was an unexpected error: ${error.message}`);
    console.log("error", error);
};
export const uid = function () {
    return (
        performance.now().toString(36) + Math.random().toString(36).substr(2)
    );
};

export const sendMessage = async (
    messageDetails: DOMMessage
    // callback: (response: DOMMessageResponse) => void
): Promise<DOMMessageResponse> => {
    return new Promise((resolve, reject) => {
        if (chrome.tabs)
            chrome.tabs.query(
                {
                    active: true,
                    currentWindow: true,
                },
                (tabs) => {
                    if (chrome.runtime.lastError) {
                        handleChromeError(chrome.runtime.lastError);
                    } else {
                        // Callback function
                        chrome.tabs.sendMessage(
                            tabs[0].id || 0,
                            messageDetails,
                            (response: DOMMessageResponse) => {
                                if (chrome.runtime.lastError) {
                                    handleChromeError(chrome.runtime.lastError);
                                    reject({ error: chrome.runtime.lastError });
                                } else {
                                    resolve(response);
                                }
                            }
                        );
                    }
                }
            );
        else reject({ error: "No tabs" });
    });
};
