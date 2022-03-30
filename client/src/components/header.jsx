import "./header.css";
import NavBar from "./navbar.jsx";

function Header(){
    var today = new Date();
    var month = today.getMonth();
    var age = today.getFullYear()-2006;
    if(month === 5){
        if(today.getDate() < 26)
            age -= 1
    }else if(month < 5){
        age -= 1
    }
    return (<div className="header">
        <NavBar/>
        <div className="missionStatement">I'm a Self-Taught Developer</div>
        <div className="info">
            <div className= "infoCell leftInfo"><i>Who?</i></div>
            <div className="infoCell">My name is Colin Hoscheit and I'm a {age} year old self-taught software developer in the Washington DC area.</div>
        </div>
    </div>);
}

export default Header;