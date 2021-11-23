// chrome.runtime.onInstalled.addListener(() => {
//     chrome.contextMenus.create({
//         id: "search",
//         title: "Search: %s",
//         contexts: ["selection"],
//     });

import { handleChromeError, uid } from "../components/functions";
import {
    DOMMessage,
    DOMMessageResponse,
    GroupStruct,
    SiteStruct,
} from "../types";

// });

export const MENUITEM__OPEN_ALL = "context__open_all";
export const SEARCH_STRING_SUBSTITUTE = "<<<SEARCH___STRING>>>";
export const CUSTOM_SEARCH_INPUT = "azbycxdvew";
const sites: SiteStruct[] = JSON.parse(
    '[{"enabled":true,"name":"Aliexpress","searchUrl":"https://www.aliexpress.com/wholesale?catid=0&initiative_id=sb_20211119232949&searchtext=<<<SEARCH___STRING>>>","url":"https://www.aliexpress.com"},{"enabled":true,"name":"Amazon (SG)","searchUrl":"https://www.amazon.sg/s?k=<<<SEARCH___STRING>>>&ref=nb_sb_noss","url":"https://www.amazon.sg"},{"enabled":true,"name":"ASOS","searchUrl":"https://www.asos.com/search/?q=<<<SEARCH___STRING>>>","url":"https://www.asos.com"},{"enabled":true,"name":"Carousell","searchUrl":"https://www.carousell.sg/search/<<<SEARCH___STRING>>>?addrecent=true&canchangekeyword=true&includesuggestions=true&searchid=bhhiy7","url":"https://www.carousell.sg"},{"enabled":true,"name":"eBay (SG)","searchUrl":"https://www.ebay.com.sg/sch/i.html?_from=r40&_trksid=m570.l1313&_nkw=<<<SEARCH___STRING>>>&_sacat=0","url":"https://www.ebay.com.sg"},{"enabled":true,"name":"ezbuy","searchUrl":"https://ezbuy.sg/category/?keywords=<<<SEARCH___STRING>>>","url":"https://ezbuy.sg"},{"enabled":true,"name":"Lazada","searchUrl":"https://www.lazada.sg/catalog/?q=<<<SEARCH___STRING>>>&_keyori=ss&from=input&spm=a2o42.home.search.go.654346b54ocwyy","url":"https://www.lazada.sg"},{"enabled":true,"name":"Newegg (SG)","searchUrl":"https://www.newegg.com/global/sg-en/p/pl?d=<<<SEARCH___STRING>>>","url":"https://www.newegg.com"},{"enabled":true,"name":"Qoo10","searchUrl":"https://www.qoo10.sg/s/<<<SEARCH___STRING>>>?keyword=<<<SEARCH___STRING>>>&keyword_auto_change=","url":"https://www.qoo10.sg"},{"enabled":true,"name":"Shopee","searchUrl":"https://shopee.sg/search?keyword=<<<SEARCH___STRING>>>","url":"https://shopee.sg"},{"enabled":true,"name":"Zalora","searchUrl":"https://www.zalora.sg/catalog/?q=<<<SEARCH___STRING>>>","url":"https://www.zalora.sg"}]'
);
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

// Sort the default sites and add unique ID to them
sites.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
sites.map((site) => {
    site.id = uid();
    return site;
});
export {};

const createGroupContextMenu = (sites: SiteStruct[], groups: GroupStruct[]) => {
    groups.forEach((group) => {
        chrome.contextMenus.create({
            title: `Group ${group.name}`,
            contexts: ["all"],
            id: `group__parent_${group.id}`,
        });
        chrome.contextMenus.create({
            title: "Open group sites",
            contexts: ["all"],
            id: `group__open_all_${group.id}`,
            parentId: `group__parent_${group.id}`,
        });
        chrome.contextMenus.create({
            type: "separator",
            contexts: ["all"],
            id: `group_${group.id}_separator`,
            parentId: `group__parent_${group.id}`,
        });
        group.enabled.forEach((siteId) => {
            const site = sites.find((site) => site.id === siteId);
            if (site)
                chrome.contextMenus.create({
                    title: site.name,
                    contexts: ["all"],
                    id: `context__open_${site.id}_${group.id}`,
                    parentId: `group__parent_${group.id}`,
                    // type: "checkbox",
                    // checked: true,
                });
        });
    });
};

// Create the entire context menu
const createContextMenu = () => {
    chrome.storage.local.get(["sites", "groups"], function (siteResults) {
        const sites: SiteStruct[] = siteResults.sites;
        const groups: GroupStruct[] = siteResults.groups;

        // Sort sites by name
        const sortedSites = sites.sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );

        // Sort groups by name
        const sortedGroups = groups.sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );

        /* Context menu structure
            - GROUP {group.name} > 
                > Open group sites
                > << SEPARATOR >>
                > ✓ Site 1
                > ✓ Site 2
                > ✓ Site 3
            - OPEN ENABLED DEFAULT SITES
            - << SEPARATOR >>
            - ✓ Site 1
            - ✓ Site 2
            -   Site 3
            - ✓ Site 4
        
        */
        chrome.contextMenus.removeAll();
        // Create the group context menu
        createGroupContextMenu(sortedSites, sortedGroups);

        // If there are groups, add a separator
        if (groups.length > 0) {
            chrome.contextMenus.create({
                type: "separator",
                contexts: ["all"],
                id: "group_separator",
            });
        }

        // Create the default sites context menu
        chrome.contextMenus.create({
            title: "Search all enabled sites",
            contexts: ["all"],
            id: MENUITEM__OPEN_ALL,
        });

        // Create the separator
        chrome.contextMenus.create({
            type: "separator",
            contexts: ["all"],
            id: "context_separator",
        });

        // Create the list of default sites along with their enabled property
        sortedSites.forEach((site) => {
            chrome.contextMenus.create({
                title: site.name,
                contexts: ["all"],
                id: `context__open_${site.id}`,
                // parentId: "context__open_specific",
                type: "checkbox",
                checked: site.enabled,
            });
        });
    });

    // // Expect an unsorted array of
    // // Sort by name
    // const sorted = sites.sort((a, b) =>
    //     a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    // );

    // // chrome.contextMenus.create({
    // //     title: "Search all sites",
    // //     contexts: ["all"],
    // //     id: MENUITEM__OPEN_ALL,
    // // });
    // chrome.contextMenus.create({
    //     title: "Search all enabled sites",
    //     contexts: ["all"],
    //     id: MENUITEM__OPEN_ALL,
    // });

    // createGroupContextMenu(groups);

    // chrome.contextMenus.create({
    //     type: "separator",
    //     contexts: ["all"],
    //     id: "context_separator",
    // });

    // sorted.forEach((site) => {
    //     chrome.contextMenus.create({
    //         title: site.name,
    //         contexts: ["all"],
    //         id: `context__open_${site.id}`,
    //         // parentId: "context__open_specific",
    //         type: "checkbox",
    //         checked: site.enabled,
    //     });
    // });
};

// Listen to storage changes so we can update the "enabled" property of the sites
chrome.storage &&
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (chrome.runtime.lastError) {
            handleChromeError(chrome.runtime.lastError);
        } else {
            createContextMenu();
            if (changes.sites) {
                // Delete all the old menu items and add again
                // Cannot just modify because when the user adds / remove sites, the indexes might change
                // Todo: possible work on assigning a unique ID to each site which would fix this issue
            } else if (changes.groups) {
                if (changes.groups) {
                }
            }
        }
        return true;
    });

// On first install, create default context menu and add sites
chrome.runtime &&
    chrome.runtime.onInstalled.addListener(function () {
        if (chrome.runtime.lastError) {
            handleChromeError(chrome.runtime.lastError);
        } else {
            // Check if the local storage already contains stuff (i.e. we already loaded it before)
            // If it already has stuff, don't add anything
            chrome.storage.local.get(["sites", "groups"], function (result) {
                if (result.sites) {
                    console.log("Found sites already set:", {
                        sites: result.sites,
                    });
                } else {
                    chrome.storage.local.set({ sites }, function () {
                        console.log("Value is set to", { sites });
                    });
                }

                if (result.groups) {
                    console.log("Found groups already set:", {
                        groups: result.groups,
                    });
                } else {
                    chrome.storage.local.set({ groups: [] }, function () {
                        console.log("Value is set to", { groups: [] });
                    });
                }
                // No need to recreate context menu bc the listener will automatically run when we set up the new sites
                // createContextMenu(userSites);
                // createContextMenu()
            });
        }
        return true;
    });

// Listen to click events and respond to them accordingly
chrome.contextMenus &&
    chrome.contextMenus.onClicked.addListener(function (info, tab) {
        if (chrome.runtime.lastError) {
            handleChromeError(chrome.runtime.lastError);
        } else if (tab) {
            const tabId = tab.id || 0;

            // Get the selected text
            chrome.tabs.sendMessage(
                tabId,
                {
                    type: "GET_SELECTED",
                } as DOMMessage,
                (response: DOMMessageResponse) => {
                    const selected = response.payload.text;
                    const encodedSelected = selected
                        ? encodeURIComponent(selected.trim().toLowerCase())
                        : "";
                    const currentUrl = response.payload.currentUrl || "";
                    // Get the current sites and groups
                    chrome.storage.local.get(
                        ["sites", "groups"],
                        function (result) {
                            const sites: SiteStruct[] = result.sites || [];
                            const groups: GroupStruct[] = result.groups || [];

                            if (info.menuItemId === MENUITEM__OPEN_ALL) {
                                // option: open all enabled sites
                                sites.forEach((site) => {
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
                                        site.enabled &&
                                        !currentUrl.startsWith(url);
                                    shouldOpen &&
                                        chrome.tabs.create({
                                            url,
                                            active: false,
                                        });
                                });
                            } else if (
                                info.menuItemId
                                    .toString()
                                    .startsWith("context__open_")
                            ) {
                                // Open individual site

                                // When the user clicks on an item with a checkbox, the state will be toggled. So, we need to reset the state
                                chrome.contextMenus.update(
                                    info.menuItemId.toString(),
                                    {
                                        checked: !info.checked,
                                    }
                                );

                                // Open specific tab (menuItemId = "cntext__open_UID") OR (menuItemId = "context__open_UID_GROUP_UID")
                                const siteId = info.menuItemId
                                    .toString()
                                    .replace("context__open_", "")
                                    .split("_")[0];
                                if (!Number.isNaN(siteId) && sites) {
                                    // const site = userSites[siteId];
                                    const site = sites.find(
                                        (site) => site.id === siteId
                                    );
                                    if (site) {
                                        chrome.tabs.create({
                                            url: selected
                                                ? site.searchUrl.replaceAll(
                                                      SEARCH_STRING_SUBSTITUTE,
                                                      encodeURIComponent(
                                                          selected
                                                              .trim()
                                                              .toLowerCase()
                                                      )
                                                  )
                                                : site.url,
                                            active: false,
                                        });
                                    }
                                }
                            } else if (
                                info.menuItemId
                                    .toString()
                                    .startsWith("group__open_all_")
                            ) {
                                // menuItemID: group__open_all_GROUP_UID
                                const groupId = info.menuItemId
                                    .toString()
                                    .replace("group__open_all_", "")
                                    .split("_")[0];

                                if (!Number.isNaN(groupId) && groups) {
                                    // Find the enabled sites in the group
                                    const group = groups.find(
                                        (group) => group.id === groupId
                                    );
                                    if (group) {
                                        sites.forEach((site) => {
                                            if (
                                                group.enabled.includes(site.id)
                                            ) {
                                                // If the site is enabled in the group, construct the URL and open it
                                                const url = selected
                                                    ? site.searchUrl.replaceAll(
                                                          SEARCH_STRING_SUBSTITUTE,
                                                          encodedSelected
                                                      )
                                                    : site.url;
                                                const shouldOpen =
                                                    !currentUrl.startsWith(url);
                                                shouldOpen &&
                                                    chrome.tabs.create({
                                                        url,
                                                        active: false,
                                                    });
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    );
                }
            );

            // chrome.tabs.sendMessage(
            //     tabId,
            //     { type: info.menuItemId } as DOMMessage,
            //     (response: DOMMessageResponse) => {
            //         const userSites = response.payload.sites;
            //         const selected = response.payload.text;
            //         const encodedSelected = selected
            //             ? encodeURIComponent(selected.trim().toLowerCase())
            //             : "";
            //         const currentUrl = response.payload.currentUrl || "";

            //         if (info.menuItemId === MENUITEM__OPEN_ALL) {
            //             // option: open all enabled sites
            //             userSites &&
            //                 userSites.forEach((site) => {
            //                     const url = selected
            //                         ? site.searchUrl.replaceAll(
            //                               SEARCH_STRING_SUBSTITUTE,
            //                               encodedSelected
            //                           )
            //                         : site.url;

            //                     // Only open if the site is enabled
            //                     // TODO and it doesn't include the term that the user is searching for
            //                     // && !currentUrl.includes(encodedSelected);

            //                     // and the URL doesn't start with the URL we want to open
            //                     const shouldOpen =
            //                         site.enabled && !currentUrl.startsWith(url);
            //                     shouldOpen &&
            //                         chrome.tabs.create({
            //                             url,
            //                             active: false,
            //                         });
            //                 });
            //         } else if (
            //             info.menuItemId.toString().startsWith("context__open_")
            //         ) {
            //             // Open individual site

            //             // When the user clicks on an item with a checkbox, the state will be toggled. So, we need to reset the state
            //             chrome.contextMenus.update(info.menuItemId.toString(), {
            //                 checked: !info.checked,
            //             });

            //             // Open specific tab (menuItemId = "cntext__open_UID") OR (menuItemId = "context__open_UID_GROUP_UID")
            //             const siteId = info.menuItemId
            //                 .toString()
            //                 .replace("context__open_", "")
            //                 .split("_")[0];
            //             if (!Number.isNaN(siteId) && userSites) {
            //                 // const site = userSites[siteId];
            //                 const site = userSites.find(
            //                     (site) => site.id === siteId
            //                 );
            //                 if (site) {
            //                     chrome.tabs.create({
            //                         url: selected
            //                             ? site.searchUrl.replaceAll(
            //                                   SEARCH_STRING_SUBSTITUTE,
            //                                   encodeURIComponent(
            //                                       selected.trim().toLowerCase()
            //                                   )
            //                               )
            //                             : site.url,
            //                         active: false,
            //                     });
            //                 }
            //             }
            //         } else if (
            //             info.menuItemId
            //                 .toString()
            //                 .startsWith("group__open_all_")
            //         ) {
            //             // menuItemID: group__open_all_GROUP_UID
            //             const groupId = info.menuItemId
            //                 .toString()
            //                 .replace("group__open_all_", "")
            //                 .split("_")[0];
            //         }
            //     }
            // );
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

// const setIcon = (tab: chrome.tabs.Tab) => {
//     const tabId = tab.id || 0;
//     console.log(tab.url);
//     if (!tab.url || tab.url === "" || tab.url.startsWith("chrome://")) {
//         // No url, possibly chrome://?
//         chrome.action.setIcon({
//             path: "/icons/logo_disabled16.png",
//             tabId,
//         });
//     } else {
//         // Valid url
//         chrome.action.setIcon(
//             {
//                 path: "/icons/logo16.png",

//                 tabId,
//             },
//             function () {}
//         );
//     }
// };

// chrome.tabs &&
//     chrome.tabs.onActivated.addListener(function (info) {
//         chrome.tabs.get(info.tabId, function (tab) {
//             setIcon(tab);
//         });
//     });

// chrome.tabs &&
//     chrome.tabs.onUpdated.addListener(function (tabId, change, updatedTab) {
//         chrome.tabs.query({ active: true }, function (activeTabs) {
//             const activeTab = activeTabs[0];
//             if (activeTab === updatedTab) {
//                 setIcon(updatedTab);
//             }
//         });
//     });
