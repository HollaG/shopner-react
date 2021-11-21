import { useEffect, useState } from "react";
import { useChromeStorageLocal } from "use-chrome-storage";
import { SEARCH_STRING_SUBSTITUTE } from "../chromeServices/background";
import { DOMMessage, DOMMessageResponse, SiteStruct } from "../types";
import { handleChromeError, sendMessage } from "./functions";
import Site from "./Site";
import Button from "./ui/Button";
import Input from "./ui/Input";
// import { sites } from "./Editing/EditingBody";
const Body = () => {
    // const [sites, setSites] = useState<Site[]>([]);

    const [sites, setSites, _, __]: [SiteStruct[], any, any, any] =
        useChromeStorageLocal("sites", []);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentUrl, setCurrentUrl] = useState("");

    // Pass message to content script to get the highlighted text and the current URL
    useEffect(() => {
        sendMessage({ type: "GET_SELECTED" })
            .then((response) => {
                setSearchTerm(response.payload.text || "");
                setCurrentUrl(response.payload.currentUrl || "");
            })
            .catch((e) => {
                console.log(e.error);
            });

        // chrome.tabs &&
        //     chrome.tabs.query(
        //         {
        //             active: true,
        //             currentWindow: true,
        //         },
        //         (tabs) => {
        //             if (chrome.runtime.lastError) {
        //                 handleChromeError(chrome.runtime.lastError);
        //             } else {
        //                 // Callback function
        //                 chrome.tabs.sendMessage(
        //                     tabs[0].id || 0,
        //                     { type: "GET_SELECTED" } as DOMMessage,
        //                     (response: DOMMessageResponse) => {
        //                         console.log(response);

        //                         if (chrome.runtime.lastError) {
        //                             handleChromeError(chrome.runtime.lastError);
        //                         } else {
        //                             setSearchTerm(response.payload.text || "");
        //                             setCurrentUrl(
        //                                 response.payload.currentUrl || ""
        //                             );
        //                         }
        //                     }
        //                 );
        //             }
        //         }
        //     );
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
        chrome.tabs &&
            chrome.tabs.query(
                {
                    active: true,
                    currentWindow: true,
                },
                (tabs) => {
                    if (chrome.runtime.lastError) {
                        handleChromeError(chrome.runtime.lastError);
                    } else {
                        const tabId = tabs[0].id || 0;
                        chrome.tabs.sendMessage(
                            tabId,
                            {
                                type: `EDIT_SITE`,
                                payload: { site },
                            } as DOMMessage,
                            (response: DOMMessageResponse) => {
                                if (chrome.runtime.lastError) {
                                    handleChromeError(chrome.runtime.lastError);
                                }
                            }
                        );
                    }
                }
            );
    };

    const savePresetHandler = () => {};
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
                <div></div>
                <Button classes="align-end"> Save preset </Button>
            </div>
            <div className="sites flex flex-wrap items-center justify-around">
                {sites &&
                    sites.map((site, index) => (
                        <Site
                            site={site}
                            key={index}
                            visitStoreHandler={visitStoreHandler}
                            toggleStoreHandler={toggleStoreHandler}
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
