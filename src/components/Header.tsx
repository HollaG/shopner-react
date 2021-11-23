import logo from "../logo192.png";
import logoDisabled from "../logo_disabled192.png";

const Header: React.FC<{ supported: 0 | 1 | 2 }> = ({ supported }) => {
    return (
        <div className="header flex flex-row justify-center items-center mb-3">
            <div>
                <img
                    src={supported === 2 ? logo : logoDisabled}
                    className="w-12 mr-4"
                    alt="Extension icon - shopping cart"
                />
            </div>
            <h1 className="app-name-styled text-3xl"> SimpleShopping </h1>
            {/* <img
                src={supported === 2 ? logo : logoDisabled}
                className="w-24 "
            /> */}
        </div>
    );
};
export default Header;
