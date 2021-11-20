import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import {
    CUSTOM_SEARCH_INPUT,
    SEARCH_STRING_SUBSTITUTE,
} from "../../chromeServices/background";
import { DOMMessage, DOMMessageResponse, SiteStruct } from "../../types";
import { handleChromeError } from "../functions";
import ImageWithFallback from "../ui/ImageWithFallback";
import AddOrEditSite from "./AddOrEditSite";

const SiteRow: React.FC<{ site: SiteStruct; index: number }> = ({
    site,
    index,
}) => {
    const [editing, setEditing] = useState(false);
    console.log({site, index})
    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Send message to background script to toggle 'enabled' property
        site.enabled = e.target.checked;
        console.log(e.target.checked);
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
                                type: "EDIT_SITE",
                                payload: { site, index },
                            } as DOMMessage,
                            (response: DOMMessageResponse) => {
                                console.log(response);
                                // setChecked(e.target.checked);
                                if (!response) console.log("error");
                                else {
                                }
                            }
                        );
                    }
                }
            );
    };

    const handleEdit = () => {
        setEditing((prev) => !prev);
    };

    const handleDelete = () => {
        // Popup an alert asking the user if they really want to delete this site
        // If they do, delete the site
        const confirm = window.confirm(
            `Are you sure you want to delete ${site.name}?`
        );
        if (confirm) {
            // Delete the site
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
                            {
                                type: "REMOVE_SITE",
                                payload: {
                                    index,
                                },
                            } as DOMMessage,
                            (response: DOMMessageResponse) => {
                                console.log(response);

                                if (!response) console.log("error");
                                else {
                                }
                            }
                        );
                    }
                );
        }
    };

    const editSubmitHandler = (site: SiteStruct, index?: number) => {
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
                                type: "EDIT_SITE",
                                payload: { site, index },
                            } as DOMMessage,
                            (response: DOMMessageResponse) => {
                                console.log(response);
                                handleEdit();
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
        <>
            <div className="flex align-middle justify-between mb-2">
                <div className="left flex items-center">
                    <input
                        checked={site.enabled}
                        onChange={handleToggle}
                        type="checkbox"
                        className="self-center"
                    />

                    <ImageWithFallback
                        className={`w-6 h-6 object-contain mx-2`}
                        src={`${site.url}/favicon.ico`}
                        fallback={`https://www.google.com/s2/favicons?domain_url=${site.url}`}
                        alt={site.name}
                    />
                    {/* <img src={`${site.url}/favicon.ico`} alt={site.name} className={`w-6 h-6 object-contain mx-2`} /> */}
                    <p>{site.name}</p>
                </div>
                <div className="right flex items-center">
                    <FontAwesomeIcon
                        className="cursor-pointer text-indigo-500 hover:text-indigo-600 mx-2"
                        icon={faEdit}
                        onClick={() => handleEdit()}
                    />
                    <FontAwesomeIcon
                        onClick={() => handleDelete()}
                        className="cursor-pointer text-red-500 hover:text-red-600"
                        icon={faTrash}
                    />
                </div>
            </div>
            {editing && (
                <AddOrEditSite
                    submitHandler={editSubmitHandler}
                    isEditing={true}
                    site={site}
                    index={index}
                    name={site.name}
                    url={site.searchUrl.replaceAll(
                        SEARCH_STRING_SUBSTITUTE,
                        CUSTOM_SEARCH_INPUT
                    )}
                />
            )}
        </>
    );
};

export default SiteRow;
