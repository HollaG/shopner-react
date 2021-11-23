import { GroupStruct } from "../../types";

const Chip: React.FC<{
    onClick: (group: GroupStruct) => void;
    group: GroupStruct;
    selected: boolean;
}> = ({ children, onClick, group, selected }) => {
    return (
        <div
            className={`${selected ? 'bg-gray-200' : 'bg-transparent'} mr-1 py-1 px-2 border-2 border-gray-200 cursor-pointer  hover:bg-gray-100 rounded-full`}
            onClick={() => onClick(group)}
        >
            {group.name}
        </div>
    );
};
export default Chip;
