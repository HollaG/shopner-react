import { useEffect, useState } from "react";
import { DOMMessage, DOMMessageResponse } from "../types";
import Store from "./Store";

export interface Site {
    name: string;
    url: string;
    searchUrl: string;
}

const Body = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sites, setSites] = useState<Site[]>([]);
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
                        { type: "OPEN_POPUP" } as DOMMessage,
                        (response: DOMMessageResponse) => {
                            console.log(response);

                            if (!response) console.log("error");
                            else {
                                setSearchTerm(response.payload.text || "");
                                console.log(response.payload.sites);
                                setSites(
                                    response.payload.sites || []
                                );
                            }
                        }
                    );
                }
            );
    }, []);

    const visitStoreHandler = (index: number) => {
        const site = sites[index];
        // window.open(
        //     `${site.searchUrl}${encodeURIComponent(searchTerm)}`,
        //     "_blank"
        // );
        chrome.tabs &&
            chrome.tabs.create({
                url: `${site.searchUrl}${encodeURIComponent(searchTerm)}`,
                active: false,
            });
    };

    const visitAllHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        sites.forEach((_, index) => visitStoreHandler(index));
    };

    return (
        <div className="body my-2">
            <div className="search-container flex">
                <form className=" flex">
                    <input
                        className="w-full bg-gray-100 p-2 rounded-lg border-2 border-indigo-500 shadow-md focus:outline-none focus:border-indigo-600 mr-1"
                        id="search-input"
                        type="text"
                        placeholder="Search terms"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        onClick={visitAllHandler}
                        className="w-32 bg-gray-100 hover:bg-gray-200 p-2 rounded-lg border-2 border-indigo-500 shadow-md hover:outline-none hover:border-indigo-600"
                    >
                        Open all
                    </button>
                </form>
            </div>
            <div className="sites flex flex-wrap items-center justify-around">
                {sites.map((site, index) => (
                    <Store
                        index={index}
                        site={site}
                        key={index}
                        visitStoreHandler={visitStoreHandler}
                    />
                ))}
            </div>
            <div className="text-center"></div>
        </div>
    );
};

export default Body;
