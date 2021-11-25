import { GroupStruct } from "../../types";
import { sendMessage } from "../functions";
import Chip from "../ui/Chip";

const GroupsContainer: React.FC<{
    defaultGroup: GroupStruct;
    selectedGroup: GroupStruct;
    setSelectedGroup: (group: GroupStruct) => void;
    groups: GroupStruct[];
    selectGroupHandler: (group: GroupStruct) => void;
}> = ({
    defaultGroup,
    selectedGroup,
    groups,
    selectGroupHandler,
    setSelectedGroup,
}) => {
    const onDelete = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        group: GroupStruct
    ) => {
        event.preventDefault();

        // Confirm that the user wants to delete this group
        const title = Number.isNaN(Number(group.name))
            ? group.name
            : `Group ${group.name}`;
        if (
            window.confirm(
                `Are you sure you want to delete '${title}'?`
            )
        ) {
            sendMessage({
                type: "DELETE_GROUP",
                payload: { group },
            })
                .then(() => {
                    setSelectedGroup(defaultGroup);
                })
                .catch(console.log);
        }
    };

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
