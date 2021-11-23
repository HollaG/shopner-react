import { SiteStruct } from "../../types";
import ImageWithFallback from "../ui/ImageWithFallback";

const Site: React.FC<{
    
    site: SiteStruct;
    visitStoreHandler: (site: SiteStruct) => void;
    toggleStoreHandler: (site: SiteStruct) => void;
}> = ({ site, visitStoreHandler, toggleStoreHandler }) => {
    const disableHandler = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.preventDefault();
        // Disable the item
        toggleStoreHandler(site);
    };

    return (
        <div
            className={`rounded hover:bg-gray-200 flex flex-col justify-center items-center p-2 m-1 w-20 cursor-pointer`}
            onClick={() => visitStoreHandler(site)}
            onContextMenu={disableHandler}
        >
            
            <ImageWithFallback
                className={`w-12 h-12 object-contain`}
                src={`${site.url}/favicon.ico`}
                fallback={`https://www.google.com/s2/favicons?domain_url=${site.url}`}
                alt={site.name}
            />
            <div className={`text-center`}>
                <p>{site.name}</p>
                <p className={site.enabled ? "" : "text-red-500"}>
                    ({site.enabled ? "enabled" : "disabled"})
                </p>
            </div>
        </div>
    );
};

export default Site;
