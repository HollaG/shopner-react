import copy from "fast-copy";
import { useEffect, useState } from "react";
import { useChromeStorageLocal } from "use-chrome-storage";
import { SEARCH_STRING_SUBSTITUTE } from "../../chromeServices/background";
import { GroupStruct, SiteStruct } from "../../types";
import { sendMessage } from "../functions";
import Site from "./Site";
import Button from "../ui/Button";
import GroupControls from "./GroupControls";
import GroupsContainer from "./GroupsContainer";
import SearchControls from "./SearchControls";
import HelpText from "./HelpText";

const defaultGroup: GroupStruct = {
    id: "default",
    name: "Default Group",
    enabled: [],
    number: 0,
};
const Body: React.FC<{
    setIsEditing: (value: React.SetStateAction<boolean>) => void;
}> = ({ setIsEditing }) => {
    // const [sites, setSites] = useState<Site[]>([]);

    const [sites]: [SiteStruct[], any, any, any] =
        useChromeStorageLocal("sites", []);
    const [groups]: [GroupStruct[], any, any, any] =
        useChromeStorageLocal("groups", []);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentUrl, setCurrentUrl] = useState("");

    const [groupName, setGroupName] = useState("");
    const [selectedGroup, setSelectedGroup] = useState(defaultGroup);
    const [groupSites, setGroupSites] = useState<SiteStruct[]>([]);

    const [showHelp, setShowHelp] = useState(false);

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
        let sitesToVisit: SiteStruct[] =
            selectedGroup.id === "default" ? sites : groupSites;
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
            <SearchControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                visitAllHandler={visitAllHandler}
            />
            <GroupControls
                groupName={groupName}
                setGroupName={setGroupName}
                setSelectedGroup={setSelectedGroup}
                // saveGroupHandler={saveGroupHandler}
            />
            {/* <Button classes="ml-1" onClick={() => saveGroupHandler()} moreProps={{disabled: (groups.length > 9)}}>
                    Create Group
                </Button> */}
            <div className="buttons-container flex justify-end mt-1">
                {/* <Button classes="invisible"/> */}
                <Button onClick={() => setShowHelp((prev) => !prev)}>
                    {showHelp ? "Hide help" : "Show help"}
                </Button>
                <Button
                    classes="ml-1"
                    onClick={() => setIsEditing((prev) => !prev)}
                >
                    Edit sites
                </Button>
            </div>

            {showHelp && (
                <HelpText/>
            )}
            <GroupsContainer
                groups={groups}
                defaultGroup={defaultGroup}
                selectGroupHandler={selectGroupHandler}
                selectedGroup={selectedGroup}
                setSelectedGroup={setSelectedGroup}
            />

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
