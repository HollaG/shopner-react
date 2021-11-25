import { useState } from "react";
import {
    CUSTOM_SEARCH_INPUT,
    SEARCH_STRING_SUBSTITUTE,
} from "../../chromeServices/background";
import { SiteStruct } from "../../types";
import { uid } from "../functions";
import Button from "../ui/Button";
import Input from "../ui/Input";

const AddOrEditSite: React.FC<{
    isEditing: boolean;
    copiedSuccess?: boolean;
    site?: SiteStruct;

    name: string;
    url: string;
    submitHandler: (site: SiteStruct) => void;
}> = ({ isEditing, site, name, url, submitHandler, copiedSuccess }) => {
    const [urlValue] = useState(url);
    const [nameValue, setNameValue] = useState(name); // don't autofil the 'name' we get from the website's document.title unless we're editing
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

        setNameValue("");
        // setUrlValue("");

        // If we pass in a site (aka editing), don't generate a new uid, return the current one
        submitHandler({
            url,
            searchUrl,
            name,
            enabled: true,
            id: site ? site.id : uid(),
        });
    };

    const nameValueChangeHandler = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.value.length > 50) return;
        setNameValue(event.target.value);
    };

    console.log({
        urlValue,
        disalbed: !urlValue.includes("azbycxdvew") || !nameValue,
    });

    return (
        <form className="add-new m-2" onSubmit={formSubmitHandler}>
            {!isEditing && (
                <div className="help-text text-xs text-center text-gray-800 my-1">
                    <b> ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ ADDING A SITE ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</b>
                    <p>
                        {" "}
                        In your desired website, search for an item using this
                        search term: <b>azbycxdvew</b>.
                    </p>
                    {copiedSuccess && (
                        <p>
                            {" "}
                            This custom search term has been{" "}
                            <b>copied to your clipboard</b>.{" "}
                        </p>
                    )}
                    <p>
                        {" "}
                        Once searched, open up this extension. Input the
                        website's name in the input below and click on{" "}
                        <b>"Add"</b>.
                    </p>
                </div>
            )}
            <div className="flex align-center justify-between items-center">
                <Input
                    value={nameValue}
                    onChange={nameValueChangeHandler}
                    id="new__name"
                    placeholder="Site name (max 50 characters)"
                />
                <Button
                    moreProps={{
                        disabled:
                            !urlValue.includes("azbycxdvew") || !nameValue,
                    }}
                    classes="ml-1"
                >
                    {isEditing ? "Edit" : "Add"}
                </Button>
            </div>
            {/* <div className="flex align-center justify-center my-1 items-center">
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
            </div> */}

            {/* <div className="text-center my-1">
                <Button
                    moreProps={{
                        disabled:
                            !urlValue.includes("azbycxdvew") || !nameValue,
                    }}
                >
                    {isEditing ? "Edit" : "Add"}
                </Button>
            </div> */}
        </form>
    );
};

export default AddOrEditSite;
