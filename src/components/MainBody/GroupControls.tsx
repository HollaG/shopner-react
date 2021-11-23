import { GroupStruct } from "../../types";
import { sendMessage } from "../functions";
import Button from "../ui/Button";
import Input from "../ui/Input";

const GroupControls: React.FC<{
    groupName: string;
    setGroupName: (name: string) => void;
    setSelectedGroup: (group: GroupStruct) => void;
    // saveGroupHandler: (event: React.MouseEvent<HTMLButtonElement>, name: string) => void;
}> = ({ groupName, setGroupName, setSelectedGroup }) => {
    const saveGroupHandler = (
        event: React.MouseEvent<HTMLButtonElement>,
        name: string
    ) => {
        event.preventDefault()
        // Send request to content script to save the currently enabled sites
        sendMessage({
            type: "SAVE_GROUP",
            payload: { name },
        })
            .then((response) => {
                const newGroup: GroupStruct = response.payload.group;
                setSelectedGroup(newGroup);
                setGroupName("");
            })
            .catch(console.log);
    };
    return (
        <div className="name-container flex mt-1">
            <form className="w-full flex">
                <Input
                    id="name-input"
                    type="text"
                    placeholder="Group name"
                    value={groupName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setGroupName(e.target.value)
                    }
                />
                <Button
                    classes="ml-1"
                    onClick={(e) => saveGroupHandler(e, groupName)}
                >
                    Create Group
                </Button>
            </form>
        </div>
    );
};

export default GroupControls;
