import { PresetStruct } from "../../types";

const Chip: React.FC<{
    onClick: (preset: PresetStruct) => void;
    preset: PresetStruct;
    selected: boolean;
}> = ({ children, onClick, preset, selected }) => {
    return (
        <div
            className={`${selected ? 'bg-gray-200' : 'bg-transparent'} mr-1 py-1 px-2 border-2 border-gray-200 cursor-pointer  hover:bg-gray-100 rounded-full`}
            onClick={() => onClick(preset)}
        >
            {preset.name}
        </div>
    );
};
export default Chip;
