import logo from '../logo192.png'
import logoDisabled from '../logo_disabled192.png'

const Header:React.FC<{supported: 0|1|2}> = ({supported}) => {
    return <div className="header flex justify-center flex-col items-center">
        <img src={supported === 2 ? logo : logoDisabled} className="w-24 "/>
        <h1 className="app-name-styled" > Shopner</h1>
    </div>
}
export default Header;