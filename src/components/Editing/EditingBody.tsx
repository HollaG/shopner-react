import { useEffect, useState } from "react";
import { useChromeStorageLocal } from "use-chrome-storage";
import { SEARCH_STRING_SUBSTITUTE } from "../../chromeServices/background";
import { DOMMessage, DOMMessageResponse, Site } from "../../types";
import { handleChromeError } from "../functions";
import Button from "../ui/Button";
import Input from "../ui/Input";
import AddOrEditSite from "./AddOrEditSite";
import SiteRow from "./SiteRow";
// export const sites: Site[] = [
//     {
//         name: "Shopee",
//         url: "https://shopee.sg",
//         searchUrl: `https://shopee.sg/search/?keyword=${SEARCH_STRING_SUBSTITUTE}`,
//         enabled: true,
//     },
//     {
//         name: "Lazada",
//         url: "https://lazada.sg",
//         searchUrl: `https://www.lazada.sg/catalog/?q=${SEARCH_STRING_SUBSTITUTE}`,
//         enabled: true,
//     },
//     {
//         name: "Qoo10",
//         url: "https://qoo10.sg",
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
// ];

const EditingBody = () => {
    const [showAddNew, setShowAddNew] = useState(false);

    const [sites, setSites, _, __]: [Site[], any, any, any] =
        useChromeStorageLocal("sites", []);
    const [nameValue, setNameValue] = useState("");
    const [urlValue, setUrlValue] = useState("");

    useEffect(() => {
        chrome.tabs &&
            chrome.tabs.query(
                {
                    active: true,
                    currentWindow: true,
                },
                (tabs) => {
                    // Callback function
                    chrome.tabs.sendMessage(
                        tabs[0].id || 0,
                        { type: "GET_SITE_INFO" } as DOMMessage,
                        (response: DOMMessageResponse) => {
                            console.log(response);

                            if (!response) console.log("error");
                            else {
                                setNameValue(response.payload.title || "");
                                setUrlValue(response.payload.searchUrl || "");
                            }
                        }
                    );
                }
            );
    }, []);

    const addSubmitHandler = (site: Site, index?: number) => {
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
                            {
                                type: "ADD_SITE",
                                payload: site,
                            } as DOMMessage,
                            (response: DOMMessageResponse) => {
                                console.log(response);
                                setShowAddNew(false);
                                if (!response) console.log("error");
                                else {
                                }
                            }
                        );
                    }
                }
            );
    };

    return (
        <div className="body my-2">
            <div className="text-center">
                <Button onClick={() => setShowAddNew((prev) => !prev)}>
                    Add new site
                </Button>
            </div>
            {showAddNew && (
                <AddOrEditSite
                    submitHandler={addSubmitHandler}
                    name={nameValue}
                    url={urlValue}
                    isEditing={false}
                />
            )}
            {sites &&
                sites.map((site: Site, index) => (
                    <SiteRow key={index} index={index} site={site} />
                ))}
        </div>
    );
};

export default EditingBody;
