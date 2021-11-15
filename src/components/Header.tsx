import logo from '../logo192.png'

const Header = () => {
    return <div className="header flex justify-center flex-col items-center">
        <img src={logo} className="w-24 "/>
        <h1 className="app-name-styled" > Shopner</h1>
    </div>
}
export default Header;