import { GroupStruct } from "../../types";
import Chip from "../ui/Chip";

const GroupsContainer:React.FC<{
    defaultGroup: GroupStruct,
    selectedGroup: GroupStruct,
    groups: GroupStruct[],
    selectGroupHandler: (group: GroupStruct) => void
}> = ({defaultGroup, selectedGroup, groups, selectGroupHandler}) => {

    const onDelete = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, group: GroupStruct) => {
        event.preventDefault()
    }

    return (
        <div className="group-container flex flex-wrap align-center mt-2">
            <Chip
                onClick={() => selectGroupHandler(defaultGroup)}
                group={defaultGroup}
                selected={selectedGroup.id === "default"}
                classes="mb-1"                 
               
            />
            {groups &&
                groups.map((group) => (
                    <Chip

                        onClick={() => selectGroupHandler(group)}
                        group={group}
                        selected={selectedGroup.id === group.id}      
                        classes="mb-1"    
                        onContextMenu={onDelete}              
                    />
                ))}
        </div>
    );
};

export default GroupsContainer;
