import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import {
    CUSTOM_SEARCH_INPUT,
    SEARCH_STRING_SUBSTITUTE,
} from "../../chromeServices/background";
import { DOMMessage, DOMMessageResponse, SiteStruct } from "../../types";
import { handleChromeError, sendMessage } from "../functions";
import ImageWithFallback from "../ui/ImageWithFallback";
import AddOrEditSite from "./AddOrEditSite";

const SiteRow: React.FC<{ site: SiteStruct }> = ({ site }) => {
    const [editing, setEditing] = useState(false);

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Send message to background script to toggle 'enabled' property
        site.enabled = e.target.checked;
        sendMessage({
            type: "EDIT_SITE",
            payload: { site },
        }).catch(console.log);
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
            sendMessage({
                type: "REMOVE_SITE",
                payload: { site },
            }).catch(console.log);
        }
    };

    const editSubmitHandler = (site: SiteStruct) => {
        sendMessage({
            type: "EDIT_SITE",
            payload: { site },
        }).then(() => {
            handleEdit()
        }).catch(console.log)
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
