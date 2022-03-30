import "./header.css"
import React from "react-dom"

function NavBar(){
    //               name: path
    const links = [{"Portfolio": "/"}, {"About": "/"}];
    return (<div className="navBar">
        <div className="navSection left">
        {links.map((v) => {
            return (<a className="navLink" href={v[Object.keys(v)[0]]}>{Object.keys(v)[0]}</a>)
        })}
        </div>
        <div className="navSection">
            <a className="headName" href="/">Colin Hoscheit</a>
        </div>
    </div>)

}


export default NavBar