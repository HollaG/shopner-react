import { useEffect, useState } from "react";
import {
    CUSTOM_SEARCH_INPUT,
    SEARCH_STRING_SUBSTITUTE,
} from "../../chromeServices/background";
import { DOMMessage, DOMMessageResponse, SiteStruct } from "../../types";
import { uid } from "../functions";
import Button from "../ui/Button";
import Input from "../ui/Input";

const AddOrEditSite: React.FC<{
    isEditing: boolean;
    explainer?: string;
    site?: SiteStruct;

    name: string;
    url: string;
    submitHandler: (site: SiteStruct) => void;
}> = ({ isEditing, site, name, url, submitHandler, explainer }) => {
    const [urlValue, setUrlValue] = useState(url);
    const [nameValue, setNameValue] = useState(name);
    const formSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!nameValue || !urlValue) return;

        const { origin: hostnameOne } = new URL(urlValue.toLowerCase().trim());

        const url = hostnameOne;
        const searchUrl = urlValue
            .toLowerCase()
            .trim()
            .replaceAll(CUSTOM_SEARCH_INPUT, SEARCH_STRING_SUBSTITUTE);

        const name = nameValue.trim();

        console.log("Hey", { urlValue, url, searchUrl, name });
        setNameValue("");
        setUrlValue("");

        // If we pass in a site (aka editing), don't generate a new uid, return the current one
        submitHandler({ url, searchUrl, name, enabled: true, id: site ? site.id : uid() });
    };

    const nameValueChangeHandler = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.value.length > 50) return;
        setNameValue(event.target.value);
    };

    return (
        <form className="add-new m-2" onSubmit={formSubmitHandler}>
            {!isEditing && explainer && (
                <div className="text-center">
                    <p>{explainer}</p>
                </div>
            )}
            <div className="flex align-center justify-center items-center">
                <div className="w-1/4 flex">
                    <label htmlFor="new__name" className="self-center">
                        Name (max 50)
                    </label>
                </div>
                <div className="w-3/4">
                    <Input
                        value={nameValue}
                        onChange={nameValueChangeHandler}
                        id="new__name"
                    />
                </div>
            </div>
            <div className="flex align-center justify-center my-1 items-center">
                <div className="w-1/4 flex">
                    <label htmlFor="new__search" className="self-center">
                        Search URL
                    </label>
                </div>
                <div className="w-3/4">
                    <Input
                        value={urlValue}
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                        ) => setUrlValue(event.target.value)}
                        id="new__search"
                    />
                </div>
            </div>

            <div className="text-center my-1">
                <Button moreProps={{ disabled: !(!!nameValue && !!urlValue) }}>
                    {isEditing ? "Edit" : "Add"}
                </Button>
            </div>
        </form>
    );
};

export default AddOrEditSite;
