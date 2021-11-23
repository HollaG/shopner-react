import Button from "../ui/Button";
import Input from "../ui/Input";

const SearchControls: React.FC<{
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    visitAllHandler: (event: React.MouseEvent<HTMLButtonElement>) => void;
}> = ({ searchTerm, setSearchTerm, visitAllHandler }) => {
    return (
        <div className="search-container flex">
            <form className="w-full flex">
                <Input
                    id="search-input"
                    type="text"
                    placeholder="Search text"
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSearchTerm(e.target.value)
                    }
                    
                />
                <Button classes="ml-1" onClick={visitAllHandler}>Open all enabled</Button>
            </form>
        </div>
    );
};

export default SearchControls;
