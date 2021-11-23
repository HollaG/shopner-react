import { GroupStruct } from "../../types";

const Chip: React.FC<{
    onClick: (group: GroupStruct) => void;
    onContextMenu?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, group: GroupStruct) => void
    group: GroupStruct;
    selected: boolean;
    classes?: string
}> = ({ children, onClick, group, selected, classes, onContextMenu }) => {
    return (
        <div
            className={`${selected ? 'bg-gray-200' : 'bg-transparent'} mr-1 py-1 px-2 border-2 border-gray-200 cursor-pointer  hover:bg-gray-100 rounded-full ${classes ? classes : ""}`}
            onClick={() => onClick(group)}
            onContextMenu={(e) => onContextMenu && onContextMenu(e, group)}
        >
            {group.name}
        </div>
    );
};
export default Chip;
