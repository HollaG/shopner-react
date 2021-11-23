import copy from "fast-copy";
import { useEffect, useState } from "react";
import { useChromeStorageLocal } from "use-chrome-storage";
import { SEARCH_STRING_SUBSTITUTE } from "../chromeServices/background";
import {
    DOMMessage,
    DOMMessageResponse,
    GroupStruct,
    SiteStruct,
} from "../types";
import { handleChromeError, sendMessage } from "./functions";
import Site from "./Site";
import Button from "./ui/Button";
import Chip from "./ui/Chip";
import Input from "./ui/Input";
// import { sites } from "./Editing/EditingBody";

const defaultGroup: GroupStruct = {
    id: "default",
    name: "Default",
    enabled: [],
};
const Body = () => {
    // const [sites, setSites] = useState<Site[]>([]);

    const [sites, setSites, _, __]: [SiteStruct[], any, any, any] =
        useChromeStorageLocal("sites", []);
    const [groups, setGroups, ___, ____]: [GroupStruct[], any, any, any] =
        useChromeStorageLocal("groups", []);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentUrl, setCurrentUrl] = useState("");
    const [selectedGroup, setSelectedGroup] = useState(defaultGroup);
    const [groupSites, setGroupSites] = useState<SiteStruct[]>([]);
    useEffect(() => {
        // Pass message to content script to get the highlighted text and the current URL
        sendMessage({ type: "GET_SELECTED" })
            .then((response) => {
                setSearchTerm(response.payload.text || "");
                setCurrentUrl(response.payload.currentUrl || "");
            })
            .catch(console.log);
    }, []);

    const visitStoreHandler = (site: SiteStruct) => {
        // const site = sites[index];
        // window.open(
        //     site.searchUrl.replaceAll(SEARCH_STRING_SUBSTITUTE, encodeURIComponent(selected))},
        //     "_blank"
        // );

        const url = searchTerm
            ? site.searchUrl.replaceAll(
                  SEARCH_STRING_SUBSTITUTE,
                  encodeURIComponent(searchTerm.trim().toLowerCase())
              )
            : site.url;

        // Open if site url doesn't start with the url to open
        chrome.tabs &&
            !currentUrl.startsWith(url) &&
            chrome.tabs.create({
                url,
                active: false,
            });
    };

    const visitAllHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        let sitesToVisit: SiteStruct[] = selectedGroup.id === "default" ? sites : groupSites;
        sitesToVisit.forEach(
            // Only open if the site is enabled           
            (site) => site.enabled && visitStoreHandler(site)
        );
        
    };

    const toggleStoreHandler = (site: SiteStruct) => {
        // setSites((prevState) => {
        //     const newState = [...prevState];
        //     newState[index].enabled = !newState[index].enabled;
        //     return newState;
        // });

        site.enabled = !site.enabled;
        sendMessage({
            type: `EDIT_SITE`,
            payload: { site },
        }).catch(console.log);
        // No need to update the main `sites` variable because it automatically updates whenever the local storage changes
    };

    const saveGroupHandler = () => {
        // Send request to content script to save the currently enabled sites
        sendMessage({
            type: "SAVE_GROUP",
        }).catch(console.log);
    };
    const selectGroupHandler = (group: GroupStruct) => {
        // console.log({ group });
        setSelectedGroup(group);
        // if (group.id === "default") {
        //     setGroupSites([]);
        // } else {
        //     // SET sites for this group
        //     const enabledSites: SiteStruct[] = [];
        //     const disabledSites: SiteStruct[] = [];
        //     sites.forEach((site) => {
        //         site.enabled = group.enabled.includes(site.id);
        //         if (site.enabled) enabledSites.push(site);
        //         else disabledSites.push(site);
        //     });
        //     console.log({ enabledSites, disabledSites });
        //     setGroupSites([...enabledSites, ...disabledSites]);
        // }
    };

    // Update whenever the 'groups' (from chrome storage) changes
    // or when the user selects a new group
    useEffect(() => {
        if (selectedGroup.id === "default") {
            setGroupSites([]);
        } else {
            // SET sites for this group
            const enabledSites: SiteStruct[] = [];
            const disabledSites: SiteStruct[] = [];
            // Clone the sites object so we don't affect the original
            const cloned = copy(sites);
            cloned.forEach((site) => {
                site.enabled = selectedGroup.enabled.includes(site.id);
                if (site.enabled) enabledSites.push(site);
                else disabledSites.push(site);
            });
            console.log({ enabledSites, disabledSites });
            setGroupSites([...enabledSites, ...disabledSites]);
        }
    }, [groups, selectedGroup, sites]);

    // When a site in a group is enabled, do not update the main storage. Instead, update the group's enabled property
    const toggleSiteInGroupHandler = (site: SiteStruct) => {
        if (selectedGroup.id !== "default") {
            const currentGroupEnabled = selectedGroup.enabled;
            const index = currentGroupEnabled.indexOf(site.id);
            if (index > -1) {
                // already exists, remove it
                currentGroupEnabled.splice(index, 1);
            } else {
                currentGroupEnabled.push(site.id);
            }
            sendMessage({
                type: `EDIT_GROUP`,
                payload: {
                    group: {
                        ...selectedGroup,
                        enabled: currentGroupEnabled,
                    },
                },
            }).catch(console.log);
        }
    };
    return (
        <div className="body my-2">
            <div className="search-container flex">
                <form className="w-full flex">
                    <Input
                        id="search-input"
                        type="text"
                        placeholder="Search terms"
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSearchTerm(e.target.value)
                        }
                    />
                    <Button onClick={visitAllHandler}>Auto-open</Button>
                </form>
            </div>
            
            <div className="group-container flex justify-between my-1">
                <div className="flex items-center">
                    <Chip
                        onClick={() => selectGroupHandler(defaultGroup)}
                        group={defaultGroup}
                        selected={selectedGroup.id === "default"}
                    />
                    {groups &&
                        groups.map((group) => (
                            <Chip
                                onClick={() => selectGroupHandler(group)}
                                group={group}
                                selected={selectedGroup.id === group.id}
                            />
                        ))}
                </div>
                <Button classes="align-end" onClick={() => saveGroupHandler()}>
                    Create group
                </Button>
            </div>
            <p className="text-xs text-center text-gray-800 italic">
                To control which sites are automatically opened when clicking on the 'Auto-open' button, right click on the site's icon.
            </p>
            <p className="text-xs text-center text-gray-800 italic">
                To delete a custom group, right click on it.
            </p>
            <div className="sites flex flex-wrap items-center justify-around">
                {!groupSites.length &&
                    sites &&
                    sites.map((site, index) => (
                        <Site
                            site={site}
                            key={index}
                            visitStoreHandler={visitStoreHandler}
                            toggleStoreHandler={toggleStoreHandler}
                        />
                    ))}
                {groupSites &&
                    groupSites.map((site, index) => (
                        <Site
                            site={site}
                            key={index}
                            visitStoreHandler={visitStoreHandler}
                            toggleStoreHandler={toggleSiteInGroupHandler}
                        />
                    ))}
            </div>
            
            {/* <p className="text-sm text-center text-gray-800 italic">
                Right click icon to toggle auto-open
            </p>
            <p className="text-sm text-center text-gray-800 italic">
                Right click group to delete
            </p> */}
        </div>
    );
};

export default Body;
