import copy from "fast-copy";
import { useEffect, useState } from "react";
import { useChromeStorageLocal } from "use-chrome-storage";
import { SEARCH_STRING_SUBSTITUTE } from "../chromeServices/background";
import {
    DOMMessage,
    DOMMessageResponse,
    PresetStruct,
    SiteStruct,
} from "../types";
import { handleChromeError, sendMessage } from "./functions";
import Site from "./Site";
import Button from "./ui/Button";
import Chip from "./ui/Chip";
import Input from "./ui/Input";
// import { sites } from "./Editing/EditingBody";

const defaultPreset: PresetStruct = {
    id: "default",
    name: "Default",
    enabled: [],
};
const Body = () => {
    // const [sites, setSites] = useState<Site[]>([]);

    const [sites, setSites, _, __]: [SiteStruct[], any, any, any] =
        useChromeStorageLocal("sites", []);
    const [presets, setPresets, ___, ____]: [PresetStruct[], any, any, any] =
        useChromeStorageLocal("presets", []);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentUrl, setCurrentUrl] = useState("");

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

        sites.forEach(
            // Only open if the site is enabled
            // TODO: and it doesn't include the term that the user is searching for? !currentUrl.includes(encodeURIComponent(searchTerm.trim().toLowerCase())) &&
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

    const [selectedPreset, setSelectedPreset] = useState(defaultPreset);
    const [presetSites, setPresetSites] = useState<SiteStruct[]>([]);
    const savePresetHandler = () => {
        // Send request to content script to save the currently enabled sites
        sendMessage({
            type: "SAVE_PRESET",
        }).catch(console.log);
    };
    const selectPresetHandler = (preset: PresetStruct) => {
        // console.log({ preset });
        setSelectedPreset(preset);
        // if (preset.id === "default") {
        //     setPresetSites([]);
        // } else {
        //     // SET sites for this preset
        //     const enabledSites: SiteStruct[] = [];
        //     const disabledSites: SiteStruct[] = [];
        //     sites.forEach((site) => {
        //         site.enabled = preset.enabled.includes(site.id);
        //         if (site.enabled) enabledSites.push(site);
        //         else disabledSites.push(site);
        //     });
        //     console.log({ enabledSites, disabledSites });
        //     setPresetSites([...enabledSites, ...disabledSites]);
        // }
    };

    // Update whenever the 'presets' (from chrome storage) changes
    // or when the user selects a new preset
    useEffect(() => {
        if (selectedPreset.id === "default") {
            setPresetSites([]);
        } else {
            // SET sites for this preset
            const enabledSites: SiteStruct[] = [];
            const disabledSites: SiteStruct[] = [];
            // Clone the sites object so we don't affect the original
            const cloned = copy(sites);
            cloned.forEach((site) => {
                site.enabled = selectedPreset.enabled.includes(site.id);
                if (site.enabled) enabledSites.push(site);
                else disabledSites.push(site);
            });
            console.log({ enabledSites, disabledSites });
            setPresetSites([...enabledSites, ...disabledSites]);
        }
    }, [presets, selectedPreset, sites])

    // When a site in a preset is enabled, do not update the main storage. Instead, update the preset's enabled property
    const toggleSiteInPresetHandler = (site: SiteStruct) => {
        if (selectedPreset.id !== "default") {
            const currentPresetEnabled = selectedPreset.enabled;
            const index = currentPresetEnabled.indexOf(site.id);
            if (index > -1) {
                // already exists, remove it
                currentPresetEnabled.splice(index, 1);
            } else {
                currentPresetEnabled.push(site.id);
            }
            sendMessage({
                type: `EDIT_PRESET`,
                payload: {
                    preset: {
                        ...selectedPreset,
                        enabled: currentPresetEnabled,
                    }
                }
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
            <div className="preset-container flex justify-between my-1">
                <div className="flex items-center">
                    <Chip
                        onClick={() => selectPresetHandler(defaultPreset)}
                        preset={defaultPreset}
                        selected={selectedPreset.id === "default"}
                    />
                    {presets &&
                        presets.map((preset) => (
                            <Chip
                                onClick={() => selectPresetHandler(preset)}
                                preset={preset}
                                selected={selectedPreset.id === preset.id}
                            />
                        ))}
                </div>
                <Button classes="align-end" onClick={() => savePresetHandler()}>
                    Save preset
                </Button>
            </div>
            <div className="sites flex flex-wrap items-center justify-around">
                {!presetSites.length &&
                    sites &&
                    sites.map((site, index) => (
                        <Site
                            site={site}
                            key={index}
                            visitStoreHandler={visitStoreHandler}
                            toggleStoreHandler={toggleStoreHandler}
                        />
                    ))}
                {presetSites &&
                    presetSites.map((site, index) => (
                        <Site
                            site={site}
                            key={index}
                            visitStoreHandler={visitStoreHandler}
                            toggleStoreHandler={toggleSiteInPresetHandler}
                        />
                    ))}
            </div>
            <p className="text-sm text-center text-gray-800 italic">
                Right click icon to toggle auto-open
            </p>
        </div>
    );
};

export default Body;
