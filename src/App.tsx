import { useEffect, useState } from "react";
import "./App.css";
import Body from "./components/MainBody/Body";
import EditingBody from "./components/Editing/EditingBody";
import { sendMessage } from "./components/functions";
import Header from "./components/Header";


function App() {
    const [isEditing, setIsEditing] = useState(false);
    const [supported, setSupported] = useState<0 | 1 | 2>(0);
    // State 0: Loading
    // State 1: Unsupported
    // State 2: Supported

    // Check if the content script is able to be injected by sending a message to it.
    // If the message fails, it means that the user is on a page / tab with an unsupported url
    useEffect(() => {
        sendMessage({ type: "TEST_MESSAGE" })
            .then(() => setSupported(2))
            .catch(() => setSupported(1));
    }, []);

    console.log("app TSX RERENDERING")
    return (
        <div className="App p-3">
            <Header supported={supported} />
            {supported === 2 && (
                <>
                    {isEditing ? <EditingBody setIsEditing={setIsEditing} /> : <Body setIsEditing={setIsEditing} />}
                    {/* <div className="text-center">
                        <Button onClick={() => setIsEditing((prev) => !prev)}>
                            {isEditing ? "Go to home" : "Manage links"}
                        </Button>
                    </div> */}
                </>
            )}
            {supported === 1 && (
                <div className="text-center">
                    <p className="text-red-500">
                        Sorry, this extension does not work on this page.
                    </p>
                    <p>
                        Please navigate to a URL that starts with <b>http://</b>{" "}
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
