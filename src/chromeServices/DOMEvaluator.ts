import { DOMMessage, DOMMessageResponse } from "../types";
import { Site } from "./background";

// Function called when a new message is received
const messagesFromReactAppListener = (
    msg: DOMMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: DOMMessageResponse) => void
) => {
    console.log("[content.js]. Message received", msg);

    const selected = window.getSelection()?.toString() || "";

    // Get the sites that are stored in the chrome storage api

    chrome.storage.local.get("sites", function (result) {
        console.log("Value currently is ", result.sites);
        // const userSites: Site[] = result.sites ? JSON.parse(result.sites) : [];
        // if (msg.type === "OPEN_POPUP") {
            // Prepare the response object with information about the site
            const response: DOMMessageResponse = {
                title: document.title,
                payload: {
                    text: selected,
                    sites: result.sites, // JSON string
                },
            };
            sendResponse(response);
        // } 
        // else if (msg.type === "context__open_all") {
            // result.sites.forEach((site: Site) => {
            //     chrome.tabs.create({
            //         url: `${site.searchUrl}${encodeURIComponent(selected)}`,
            //         active: false,
            //     });
            // });
            // const response: DOMMessageResponse = {
            //     title: document.title,
            //     payload: {
            //         text: selected,
            //         sites: result.sites, // JSON string
            //     },
            // };
            // sendResponse(response);
        // }
    });

    return true;
};

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
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
