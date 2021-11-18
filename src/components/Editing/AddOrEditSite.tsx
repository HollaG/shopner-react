import { useEffect, useState } from "react";
import { CUSTOM_SEARCH_INPUT, SEARCH_STRING_SUBSTITUTE } from "../../chromeServices/background";
import { DOMMessage, DOMMessageResponse, Site } from "../../types";
import Button from "../ui/Button";
import Input from "../ui/Input";



const AddOrEditSite: React.FC<{
    isEditing: boolean;
    site?: Site;
    index?: number;
    name: string;
    url: string;
    submitHandler: (site: Site, index?: number) => void;
}> = ({ isEditing, site, index, name, url, submitHandler }) => {
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

        submitHandler({ url, searchUrl, name, enabled: true }, index);

        

    };

    return (
        <form className="add-new m-2" onSubmit={formSubmitHandler}>
            {!isEditing && (
                <div className="text-center">
                    <p>
                        Please search for 'azbycxdvew' in your site, then open
                        this page in that site.
                    </p>
                </div>
            )}
            <div className="flex align-center justify-center items-center">
                <div className="w-1/4 flex">
                    <label htmlFor="new__name" className="self-center">
                        Name
                    </label>
                </div>
                <div className="w-3/4">
                    <Input
                        value={nameValue}
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                        ) => setNameValue(event.target.value)}
                        id="new__name"
                    />
                </div>
            </div>
            <div className="flex align-center justify-center my-1 items-center">
                <div className="w-1/4 flex">
                    <label htmlFor="new__search" className="self-center">
                        Search url
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
