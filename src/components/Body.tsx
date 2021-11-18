import { useEffect, useState } from "react";
import { useChromeStorageLocal } from "use-chrome-storage";
import { SEARCH_STRING_SUBSTITUTE } from "../chromeServices/background";
import { DOMMessage, DOMMessageResponse, Site } from "../types";
import { handleChromeError } from "./functions";
import Store from "./Store";
import Button from "./ui/Button";
import Input from "./ui/Input";
// import { sites } from "./Editing/EditingBody";
const Body = () => {
    const [searchTerm, setSearchTerm] = useState("");
    // const [sites, setSites] = useState<Site[]>([]);
    
    const [sites, setSites, _, __]: [Site[], any, any, any] =
        useChromeStorageLocal("sites", []);
    console.log({ sites, setSites });
    useEffect(() => {
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
                        // Callback function
                        chrome.tabs.sendMessage(
                            tabs[0].id || 0,
                            { type: "GET_SELECTED" } as DOMMessage,
                            (response: DOMMessageResponse) => {
                                console.log(response);

                                if (chrome.runtime.lastError) {
                                    handleChromeError(chrome.runtime.lastError);
                                }
                                else {
                                    setSearchTerm(response.payload.text || "");
                                    // console.log(response.payload.sites);
                                    // setSites(response.payload.sites || []);
                                }
                            }
                        );
                    }
                }
            );
    }, []);

    const visitStoreHandler = (index: number) => {
        const site = sites[index];
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

        chrome.tabs &&
            chrome.tabs.create({
                url,
                active: false,
            });
    };

    const visitAllHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        sites.forEach(
            (site, index) => site.enabled && visitStoreHandler(index)
        );
    };

    const toggleStoreHandler = (index: number) => {
        // setSites((prevState) => {
        //     const newState = [...prevState];
        //     newState[index].enabled = !newState[index].enabled;
        //     return newState;
        // });
        const site = sites[index];
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
                                payload: { site, index },
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
                    <Button classes="w-32" onClick={visitAllHandler}>
                        Open all
                    </Button>
                </form>
            </div>
            <div className="sites flex flex-wrap items-center justify-around">
                {sites &&
                    sites.map((site, index) => (
                        <Store
                            index={index}
                            site={site}
                            key={index}
                            visitStoreHandler={visitStoreHandler}
                            toggleStoreHandler={toggleStoreHandler}
                        />
                    ))}
            </div>
            <p className="text-sm text-center text-gray-800 italic">
                {" "}
                Right click icon to toggle auto-open{" "}
            </p>
        </div>
    );
};

export default Body;
