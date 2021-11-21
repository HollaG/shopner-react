import { handleChromeError } from "../components/functions";

import { DOMMessage, DOMMessageResponse, SiteStruct } from "../types";

// Function called when a new message is received
const messagesFromReactAppListener = (
    msg: DOMMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: DOMMessageResponse) => void
) => {
    if (chrome.runtime.lastError) {
        handleChromeError(chrome.runtime.lastError);
    } else {
        console.log("[content.js]. Message received", msg);

        const selected = window.getSelection()?.toString() || "";

        // Get the sites that are stored in the chrome storage api

        chrome.storage.local.get("sites", function (result) {
            console.log("Value currently is ", result.sites);

            console.log("MESSAGE TYPE", msg.type);
            switch (msg.type) {
                case "GET_SELECTED": {
                    sendResponse({
                        payload: { text: selected, currentUrl: document.URL },
                    });
                    break;
                }
                case "GET_SITE_INFO": {
                    const response: DOMMessageResponse = {
                        payload: {
                            title: document.title,
                            searchUrl: document.URL,
                        },
                    };
                    sendResponse(response);
                    break;
                }
                case "ADD_SITE": {
                    console.log("SWITCH ADD SITE");
                    const payload: SiteStruct = msg.payload.site;

                    const sites = [...result.sites, payload].sort((a, b) =>
                        a.name.localeCompare(b.name)
                    );
                    chrome.storage.local.set({ sites }, function () {
                        console.log("Value is set to ", { sites });
                        const response: DOMMessageResponse = {
                            payload: {
                                text: selected,
                                sites,
                            },
                        };
                        sendResponse(response);
                    });
                    break;
                }

                case "EDIT_SITE": {
                    /* Required payload: 
                        {
                            payload: {
                                site: SiteStruct[],
                            }  
                        }
                        References: 
                        - Body.tsx (enabling/disabling)
                        - SiteRow.tsx (enabling/disabling, editing fields)
                    */
                    const sites: SiteStruct[] = [...result.sites];
                    const site: SiteStruct = msg.payload.site;
                    // const index: number = msg.payload.index;
                    const index = sites.findIndex(
                        (oldSite) => oldSite.id === site.id
                    );
                    sites[index] = site;
                    chrome.storage.local.set({ sites }, function () {
                        console.log("Value is set to ", { sites });
                        const response: DOMMessageResponse = {
                            payload: {
                                text: selected,
                                sites,
                            },
                        };
                        sendResponse(response);
                    });

                    break;
                }

                case "REMOVE_SITE": {
                    console.log("SWITCH REMOVE SITE");

                    const site: SiteStruct = msg.payload.site;
                    const sites: SiteStruct[] = [...result.sites];
                    const filtered = sites.filter(
                        (oldSite) => oldSite.id !== site.id
                    );

                    // if (index >= 0 && index < sites.length) {
                    //     sites.splice(index, 1);
                    //     console.log("Spliced sites,", { sites, index });
                    chrome.storage.local.set({ sites: filtered }, function () {
                        console.log("Value is set to ", { sites });
                        const response: DOMMessageResponse = {
                            payload: {
                                text: selected,
                                sites,
                            },
                        };
                        sendResponse(response);
                    });
                    // }
                    break;
                }
                case "IMPORT": {
                    const sites = msg.payload;
                    chrome.storage.local.set({ sites }, function () {
                        console.log("Value is set to ", { sites });
                        const response: DOMMessageResponse = {
                            payload: {
                                text: selected,
                                sites,
                            },
                        };
                        sendResponse(response);
                    });
                    break;
                }
                case "SAVE_PRESET": {
                    chrome.storage.local.get("sites", function (result) {
                        const sites = result.sites;
                        chrome.storage.local.get(
                            "presets",
                            function (presetResult) {
                                const presets = presetResult.presets;
                                let newPresets = {};
                            }
                        );
                    });
                    break;
                }
                default: {
                    const response: DOMMessageResponse = {
                        payload: {
                            text: selected,
                            sites: result.sites,
                            currentUrl: document.URL,
                        },
                    };
                    sendResponse(response);
                }
            }
        });
    }
    return true;
};

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime &&
    chrome.runtime.onMessage.addListener(messagesFromReactAppListener);

// chrome.contextMenus.onClicked.addListener(function (info, tab) {
//     chrome.storage.local.get("sites", function (result) {
//         const selected = window.getSelection()?.toString() || "";

//         const userSites:Site[] = result.sites ? JSON.parse(result.sites) : []

//         if (info.menuItemId === "context__open_all") {
//             userSites.forEach(site => {
//                 chrome.tabs.create({
//                     url: `${site.searchUrl}${encodeURIComponent(selected)}`,
//                     active: false,
//                 });
//             })
//         }
//     })
//     return true
// })
