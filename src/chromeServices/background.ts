// chrome.runtime.onInstalled.addListener(() => {
//     chrome.contextMenus.create({
//         id: "search",
//         title: "Search: %s",
//         contexts: ["selection"],
//     });

import { DOMMessage, DOMMessageResponse } from "../types";

// });
export interface Site {
    name: string;
    url: string;
    searchUrl: string;
}

export const MENUITEM__OPEN_ALL = "context__open_all";

const sites: Site[] = [
    {
        name: "Shopee",
        url: "https://shopee.sg",
        searchUrl: "https://shopee.sg/search/?keyword=",
    },
    {
        name: "Lazada",
        url: "https://lazada.sg",
        searchUrl: "https://www.lazada.sg/catalog/?q=",
    },
    {
        name: "Qoo10",
        url: "https://qoo10.sg",
        searchUrl: "https://www.qoo10.sg/s/?keyword=",
    },
    {
        name: "Amazon SG",
        url: "https://amazon.sg",
        searchUrl: "https://www.amazon.sg/s?k=",
    },
];

export {};

chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        title: "Open all sites",
        contexts: ["selection"],
        id: MENUITEM__OPEN_ALL,
    });
    chrome.contextMenus.create({
        title: "Open specific site",
        contexts: ["selection"],
        id: "context__open_specific",
    });
    // Check if the local storage already contains stuff (i.e. we already loaded it before)
    // If it already has stuff, don't add anything
    chrome.storage.local.get("sites", function (result) {
        const userSites: Site[] = result.sites || sites;
        if (result.sites) {
            console.log("Found sites already set:", { sites: result.sites });
        } else {
            chrome.storage.local.set({ sites }, function () {
                console.log("Value is set to", { sites });
            });
        }

        userSites.forEach((site, index) => {
            chrome.contextMenus.create({
                title: site.name,
                contexts: ["selection"],
                id: `context__open_${index}`,
                parentId: "context__open_specific",
            });
        });
    });

    // chrome.contextMenus.create({
    //     title: "Open Shopee",
    //     contexts:["selection"],
    //     id: "context__open_specific__shopee",
    //     parentId: "context__open_specific"
    // });

    // chrome.contextMenus.onClicked.addListener((info, tab) => {
    //     if (info.menuItemId === "context__open_all") {
    //         chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    //             chrome.tabs.sendMessage(tabs[0].id || 0, {action: "open_all"});
    //         });
    //     }
    // })
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (tab) {
        const tabId = tab.id || 0;
        console.log({ tabId, type: info.menuItemId });
        chrome.tabs.sendMessage(
            tabId,
            { type: info.menuItemId } as DOMMessage,
            (response: DOMMessageResponse) => {
                const userSites = response.payload.sites;
                const selected = response.payload.text;
                if (info.menuItemId === MENUITEM__OPEN_ALL) {
                    // Open all tabs
                    userSites.forEach((site) => {
                        chrome.tabs.create({
                            url: `${site.searchUrl}${encodeURIComponent(
                                selected
                            )}`,
                            active: false,
                        });
                    });
                } else if (info.menuItemId.toString().startsWith("context__open_")) {
                    // Open specific tab
                    const index = Number(info.menuItemId.toString().split("context__open_")[1]);
                    if (!Number.isNaN(index)) { 
                        const site = userSites[index];
                        chrome.tabs.create({
                            url: `${site.searchUrl}${encodeURIComponent(
                                selected
                            )}`,
                            active: false,
                        });
                    }

                }
            }
        );
    }
    return true;
});
