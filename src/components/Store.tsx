import { Site } from "../types";

const Store: React.FC<{
    index: number;
    site: Site;
    visitStoreHandler: (index: number) => void;
    toggleStoreHandler: (index: number) => void;
}> = ({ index, site, visitStoreHandler, toggleStoreHandler }) => {
    const disableHandler = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.preventDefault();
        // Disable the item
        toggleStoreHandler(index);
    };

    return (
        <div
            className={`rounded hover:bg-gray-200 flex flex-col justify-center items-center p-2 m-1 w-20 cursor-pointer`}
            onClick={() => visitStoreHandler(index)}
            onContextMenu={disableHandler}
        >
            <img
                className={`w-12 h-12 object-contain`}
                src={`${site.url}/favicon.ico`}
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

export default Store;
