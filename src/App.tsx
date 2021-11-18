import { useEffect, useState } from "react";
import "./App.css";
import Body from "./components/Body";
import EditingBody from "./components/Editing/EditingBody";
import { handleChromeError } from "./components/functions";
import Header from "./components/Header";
import Button from "./components/ui/Button";
import { DOMMessage, DOMMessageResponse } from "./types";

function App() {
    const [isEditing, setIsEditing] = useState(false);
    const [supported, setSupported] = useState<0|1|2>(0);
    // State 0: Loading
    // State 1: Unsupported
    // State 2: Supported

    // Check if the content script is able to be injected by sending a message to it.
    // If the message fails, it means that the user is on a page / tab with an unsupported url
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
                            { type: "TEST_MESSAGE" } as DOMMessage,
                            (response: DOMMessageResponse) => {
                                if (chrome.runtime.lastError) {
                                    console.log("Unsupported URL");
                                    setSupported(1);
                                } else {
                                    setSupported(2);
                                }
                            }
                        );
                    }
                }
            );
    }, []);

    return (
        <div className="App p-3">
            <Header supported={supported} />
            {supported === 2 && (
                <>
                    {isEditing ? <EditingBody /> : <Body />}
                    <div className="text-center">
                        <Button onClick={() => setIsEditing((prev) => !prev)}>
                            Manage links
                        </Button>
                    </div>
                </>
            )}
            {supported === 1 && (
                <div className="text-center">
                    <p className="text-red-500">
                        Sorry, this extension does not work on this page.
                    </p>
                    <p>
                        Please navigate to a URL that starts with <b>http://</b>
                        or <b>https://</b>.
                    </p>
                    <p className="mt-3">
                        Pages with URLs starting with <b>chrome://</b>, and the
                        <b> New Tab </b> page are not supported.
                    </p>
                </div>
            )}
            {supported === 0 && <p className="text-center"> Loading... </p>}
        </div>
    );
}

export default App;
