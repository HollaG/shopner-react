interface ButtonProps {
    disabled?: boolean;
}

const Button: React.FC<{
    classes?: string;
    onClick?: (evt: React.MouseEvent<HTMLButtonElement>) => void;
    moreProps?: ButtonProps;
}> = ({ children, classes = "", onClick, moreProps }) => {
    return (
        <button
            onClick={onClick}
            className={`${classes} bg-gray-100 hover:bg-gray-200 p-2 rounded-lg border-2 border-indigo-500 shadow-md hover:outline-none hover:border-indigo-600`}
            {...moreProps}
            style={{minWidth: "7rem"}}
        >
            {children}
        </button>
    );
};
export default Button;
