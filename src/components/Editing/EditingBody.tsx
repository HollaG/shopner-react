import { useEffect, useState } from "react";
import { useChromeStorageLocal } from "use-chrome-storage";
import { SEARCH_STRING_SUBSTITUTE } from "../../chromeServices/background";
import { DOMMessage, DOMMessageResponse, SiteStruct } from "../../types";
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

    const [sites, setSites, _, __]: [SiteStruct[], any, any, any] =
        useChromeStorageLocal("sites", []);
    console.log({ sites }, "SITES IN THE EDITINGBODSY");
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

    const addSubmitHandler = (site: SiteStruct, index?: number) => {
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

    const exportHandler = async () => {
        // Copy the site JSON string to clipboard
        try {
            await navigator.clipboard.writeText(JSON.stringify(sites));
            alert("Copied to clipboard!");
        } catch (e) {
            alert(e);
            console.log(e);
        }
    };

    const [showImport, setShowImport] = useState(false);
    const [importString, setImportString] = useState("");
    const importHandler = () => {
        try {
            const parsed = JSON.parse(importString);
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
                            { type: "IMPORT", payload: parsed } as DOMMessage,
                            (response: DOMMessageResponse) => {
                                console.log(response);
                                if (chrome.runtime.lastError) {
                                    handleChromeError(chrome.runtime.lastError);
                                } else {
                                    setShowImport(false);
                                }
                            }
                        );
                    }
                );
        } catch (e) {
            alert("Invalid JSON!");
        }
    };
    return (
        <div className="body my-2">
            <div className="flex justify-center buttons mb-2">
                <Button onClick={() => exportHandler()}>Export</Button>
                <Button
                    classes="mx-1"
                    onClick={() => setShowImport((prev) => !prev)}
                >
                    Import
                </Button>
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
            {showImport && (
                <div>
                    <Input
                        placeholder="Paste the JSON string here"
                        value={importString}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setImportString(e.target.value)
                        }
                    />
                    <div className="flex justify-center">
                        <Button onClick={() => importHandler()}>Import</Button>
                    </div>
                </div>
            )}
            {sites &&
                sites.map((site: SiteStruct, index) => (
                    <SiteRow key={index} index={index} site={site} />
                ))}
        </div>
    );
};

export default EditingBody;
