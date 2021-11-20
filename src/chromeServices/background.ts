// chrome.runtime.onInstalled.addListener(() => {
//     chrome.contextMenus.create({
//         id: "search",
//         title: "Search: %s",
//         contexts: ["selection"],
//     });

import { handleChromeError } from "../components/functions";
import { DOMMessage, DOMMessageResponse, SiteStruct } from "../types";

// });

export const MENUITEM__OPEN_ALL = "context__open_all";
export const SEARCH_STRING_SUBSTITUTE = "<<<SEARCH___STRING>>>";
export const CUSTOM_SEARCH_INPUT = "azbycxdvew";
const sites: SiteStruct[] = JSON.parse('[{"enabled":true,"name":"Aliexpress","searchUrl":"https://www.aliexpress.com/wholesale?catid=0&initiative_id=sb_20211119232949&searchtext=<<<SEARCH___STRING>>>","url":"https://www.aliexpress.com"},{"enabled":true,"name":"Amazon (SG)","searchUrl":"https://www.amazon.sg/s?k=<<<SEARCH___STRING>>>&ref=nb_sb_noss","url":"https://www.amazon.sg"},{"enabled":true,"name":"ASOS","searchUrl":"https://www.asos.com/search/?q=<<<SEARCH___STRING>>>","url":"https://www.asos.com"},{"enabled":true,"name":"Carousell","searchUrl":"https://www.carousell.sg/search/<<<SEARCH___STRING>>>?addrecent=true&canchangekeyword=true&includesuggestions=true&searchid=bhhiy7","url":"https://www.carousell.sg"},{"enabled":true,"name":"eBay (SG)","searchUrl":"https://www.ebay.com.sg/sch/i.html?_from=r40&_trksid=m570.l1313&_nkw=<<<SEARCH___STRING>>>&_sacat=0","url":"https://www.ebay.com.sg"},{"enabled":true,"name":"ezbuy","searchUrl":"https://ezbuy.sg/category/?keywords=<<<SEARCH___STRING>>>","url":"https://ezbuy.sg"},{"enabled":true,"name":"Lazada","searchUrl":"https://www.lazada.sg/catalog/?q=<<<SEARCH___STRING>>>&_keyori=ss&from=input&spm=a2o42.home.search.go.654346b54ocwyy","url":"https://www.lazada.sg"},{"enabled":true,"name":"Newegg (SG)","searchUrl":"https://www.newegg.com/global/sg-en/p/pl?d=<<<SEARCH___STRING>>>","url":"https://www.newegg.com"},{"enabled":true,"name":"Qoo10","searchUrl":"https://www.qoo10.sg/s/<<<SEARCH___STRING>>>?keyword=<<<SEARCH___STRING>>>&keyword_auto_change=","url":"https://www.qoo10.sg"},{"enabled":true,"name":"Shopee","searchUrl":"https://shopee.sg/search?keyword=<<<SEARCH___STRING>>>","url":"https://shopee.sg"},{"enabled":true,"name":"Zalora","searchUrl":"https://www.zalora.sg/catalog/?q=<<<SEARCH___STRING>>>","url":"https://www.zalora.sg"}]')
// const sites: SiteStruct[] = [
//     {
//         name: "Shopee",
//         url: "https://shopee.sg",
//         searchUrl: `https://shopee.sg/search/?keyword=${SEARCH_STRING_SUBSTITUTE}`,
//         enabled: true,
//     },
//     {
//         name: "Lazada",
//         url: "https://www.lazada.sg",
//         searchUrl: `https://www.lazada.sg/catalog/?q=${SEARCH_STRING_SUBSTITUTE}`,
//         enabled: true,
//     },
//     {
//         name: "Qoo10",
//         url: "https://www.qoo10.sg",
//         searchUrl: `https://www.qoo10.sg/s/?keyword=${SEARCH_STRING_SUBSTITUTE}`,
//         enabled: true,
//     },
//     {
//         name: "Amazon SG",
//         url: "https://amazon.sg",
//         searchUrl: `https://www.amazon.sg/s?k=${SEARCH_STRING_SUBSTITUTE}`,
//         enabled: true,
//     },
//     {
//         name: "AliExpress",
//         url: "https://www.aliexpress.com",
//         searchUrl: `https://www.aliexpress.com/wholesale?SearchText=${SEARCH_STRING_SUBSTITUTE}`,
//         enabled: true,
//     },
//     {
//         name: "ezbuy",
//         url: "https://ezbuy.sg",
//         searchUrl: `https://ezbuy.sg/category/?keyWords=${SEARCH_STRING_SUBSTITUTE}`,
//         enabled: true,
//     },
//     {
//         name: "Zalora",
//         url: "https://www.zalora.sg",
//         searchUrl: `https://www.zalora.sg/catalog/?q=${SEARCH_STRING_SUBSTITUTE}`,
//         enabled: true,
//     },
//     {
//         name: "Carousell",
//         url: "https://www.carousell.sg",
//         searchUrl: `https://www.carousell.sg/search/${SEARCH_STRING_SUBSTITUTE}`,
//         enabled: true,
//     },
//     {
//         name: "eBay SG",
//         url: "https://www.ebay.com.sg",
//         searchUrl: `https://www.ebay.com.sg/sch/i.html?_nkw=${SEARCH_STRING_SUBSTITUTE}`,
//         enabled: true,
//     },
//     {
//         name: "Newegg SG",
//         url: "https://www.newegg.com/global/sg-en",
//         searchUrl: `https://www.newegg.com/global/sg-en/p/pl?d=${SEARCH_STRING_SUBSTITUTE}`,
//         enabled: true,
//     },
//     {
//         name: "ASOS",
//         url: "https://www.asos.com",
//         searchUrl: `https://www.asos.com/search/?q=${SEARCH_STRING_SUBSTITUTE}`,
//         enabled: true,
//     },
// ];
sites.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
export {};

const createContextMenu = (sites: SiteStruct[]) => {
    // Expect an unsorted array of
    // Sort by name
    const sorted = sites.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );

    chrome.contextMenus.create({
        title: "Search all sites",
        contexts: ["all"],
        id: MENUITEM__OPEN_ALL,
    });

    chrome.contextMenus.create({
        type: "separator",
        contexts: ["all"],
        id: "context_separator",
    });

    sorted.forEach((site, index) => {
        chrome.contextMenus.create({
            title: site.name,
            contexts: ["all"],
            id: `context__open_${index}`,
            // parentId: "context__open_specific",
            type: "checkbox",
            checked: site.enabled,
        });
    });
};

// Listen to storage changes so we can update the "enabled" property of the sites
chrome.storage &&
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (chrome.runtime.lastError) {
            handleChromeError(chrome.runtime.lastError);
        } else {
            console.log({ changes });
            // Delete all the old menu items and add again
            // Cannot just modify because when the user adds / remove sites, the indexes might change
            // Todo: possible work on assigning a unique ID to each site which would fix this issue
            chrome.contextMenus.removeAll();
            createContextMenu(changes.sites.newValue || []);
        }
        return true;
    });

// On first install, create default context menu and add sites
chrome.runtime &&
    chrome.runtime.onInstalled.addListener(function () {
        if (chrome.runtime.lastError) {
            handleChromeError(chrome.runtime.lastError);
        } else {
            chrome.contextMenus.create({
                title: "Search all sites",
                contexts: ["all"],
                id: MENUITEM__OPEN_ALL,
            });

            chrome.contextMenus.create({
                type: "separator",
                contexts: ["all"],
                id: "context_separator",
            });

            // chrome.contextMenus.create({
            //     title: "Search specific site",
            //     contexts: ["all"],
            //     id: "context__open_specific",
            // });
            // Check if the local storage already contains stuff (i.e. we already loaded it before)
            // If it already has stuff, don't add anything
            chrome.storage.local.get("sites", function (result) {
                const userSites: SiteStruct[] = result.sites || sites;
                // if (result.sites) {
                //     console.log("Found sites already set:", {
                //         sites: result.sites,
                //     });
                // } else {
                chrome.storage.local.set({ sites }, function () {
                    console.log("Value is set to", { sites });
                });
                // }

                userSites.forEach((site, index) => {
                    chrome.contextMenus.create({
                        title: site.name,
                        contexts: ["all"],
                        id: `context__open_${index}`,
                        // parentId: "context__open_specific",
                        type: "checkbox",
                        checked: site.enabled,
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
        }
        return true;
    });

chrome.contextMenus &&
    chrome.contextMenus.onClicked.addListener(function (info, tab) {
        if (chrome.runtime.lastError) {
            handleChromeError(chrome.runtime.lastError);
        } else if (tab) {
            const tabId = tab.id || 0;
            console.log({ tabId, type: info.menuItemId });

            chrome.tabs.sendMessage(
                tabId,
                { type: info.menuItemId } as DOMMessage,
                (response: DOMMessageResponse) => {
                    const userSites = response.payload.sites;
                    const selected = response.payload.text;
                    const encodedSelected = selected
                        ? encodeURIComponent(selected.trim().toLowerCase())
                        : "";
                    const currentUrl = response.payload.currentUrl || "";
                    const { origin } = new URL(
                        currentUrl?.toLowerCase().trim() || ""
                    );
                    if (info.menuItemId === MENUITEM__OPEN_ALL) {
                        // Open all tabs
                        userSites &&
                            userSites.forEach((site) => {
                                const url = selected
                                    ? site.searchUrl.replaceAll(
                                          SEARCH_STRING_SUBSTITUTE,
                                          encodedSelected
                                      )
                                    : site.url;

                                // Only open if the site is enabled 
                                // TODO and it doesn't include the term that the user is searching for 
                                // && !currentUrl.includes(encodedSelected);

                                // and the URL doesn't start with the URL we want to open
                                const shouldOpen =
                                    site.enabled && !currentUrl.startsWith(url)
                                shouldOpen &&
                                    chrome.tabs.create({
                                        url,
                                        active: false,
                                    });
                            });
                    } else if (
                        info.menuItemId.toString().startsWith("context__open_")
                    ) {
                        // When the user clicks on an item with a checkbox, the state will be toggled. So, we need to reset the state
                        chrome.contextMenus.update(info.menuItemId.toString(), {
                            checked: !info.checked,
                        });

                        // Open specific tab
                        const index = Number(
                            info.menuItemId
                                .toString()
                                .split("context__open_")[1]
                        );
                        if (!Number.isNaN(index) && userSites) {
                            const site = userSites[index];
                            chrome.tabs.create({
                                url: selected
                                    ? site.searchUrl.replaceAll(
                                          SEARCH_STRING_SUBSTITUTE,
                                          encodeURIComponent(
                                              selected.trim().toLowerCase()
                                          )
                                      )
                                    : site.url,
                                active: false,
                            });
                        }
                    }
                }
            );
        }
        return true;
    });

// The below code requires the 'tabs' permission. Is this too much power?
// chrome.tabs &&
//     chrome.tabs.onActivated.addListener(function (info) {
//         chrome.tabs.get(info.tabId, function (tab) {
//             console.log({ tab });
//             if (!tab.url) {
//                 // No url, possibly chrome://?
//                 chrome.action.setIcon({
//                     path: "/icons/logo_disabled16.png",
//                     tabId: info.tabId,
//                 });
//             } else {
//                 // Valid url
//                 chrome.action.setIcon({
//                     path: "/icons/logo16.png",

//                     tabId: info.tabId,
//                 });
//             }
//         });
//     });

const setIcon = (tab: chrome.tabs.Tab) => {
    const tabId = tab.id || 0;
    console.log(tab.url);
    if (!tab.url || tab.url === "" || tab.url.startsWith("chrome://")) {
        // No url, possibly chrome://?
        chrome.action.setIcon({
            path: "/icons/logo_disabled16.png",
            tabId,
        });
    } else {
        // Valid url
        chrome.action.setIcon(
            {
                path: "/icons/logo16.png",

                tabId,
            },
            function () {}
        );
    }
};

chrome.tabs &&
    chrome.tabs.onActivated.addListener(function (info) {
        chrome.tabs.get(info.tabId, function (tab) {
            setIcon(tab);
        });
    });

chrome.tabs &&
    chrome.tabs.onUpdated.addListener(function (tabId, change, updatedTab) {
        chrome.tabs.query({ active: true }, function (activeTabs) {
            const activeTab = activeTabs[0];
            if (activeTab === updatedTab) {
                setIcon(updatedTab);
            }
        });
    });
