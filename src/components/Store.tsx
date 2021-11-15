import { Site } from "./Body";

const Store:React.FC<{index: number, site: Site, visitStoreHandler: (index:number) =>void }> = ({index, site, visitStoreHandler}) => {

 

    return <div className="rounded hover:bg-gray-200 flex flex-col justify-center items-center p-2 m-1 w-20 cursor-pointer" onClick={() => visitStoreHandler(index)}>
        <img className="w-12 h-12 object-contain"  src={`${site.url}/favicon.ico`} alt={site.name} />
        <p className="text-center">{site.name}</p>
    </div>

}

export default Store;