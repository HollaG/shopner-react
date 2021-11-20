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

            if (msg.type.startsWith("TOGGLE_AUTOOPEN__")) {
                // Toggle the 'auto open' property of the site (enabled/disabled)
                // const index = Number(msg.type.split("__")[1]);
                // // Set the enabled property of the site at the index to be opposite
                // const sites = [...result.sites];
                // sites[index].enabled = !sites[index].enabled;
                // chrome.storage.local.set({ sites }, function () {
                //     console.log("Value is set to ", { sites });
                //     const response: DOMMessageResponse = {
                //         payload: {
                //             text: selected,
                //             sites,
                //         },
                //     };
                //     sendResponse(response);
                // });
            } else {
                console.log("MESSAGE TYPE", msg.type);
                switch (msg.type) {
                    case "GET_SELECTED": {
                        sendResponse({ payload: { text: selected, currentUrl: document.URL } });
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
                        const payload: SiteStruct = msg.payload;
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
                        const index: number = msg.payload.index;
                        const sites = [...result.sites];
                        const site = msg.payload.site;
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

                        const index: number = msg.payload.index;
                        const sites = [...result.sites];
                        if (index >= 0 && index < sites.length) {
                            sites.splice(index, 1);
                            console.log("Spliced sites,", { sites, index });
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
                        }
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
