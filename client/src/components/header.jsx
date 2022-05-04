import React, {Component} from "react";
import "./../css/header.css";

class Globe extends Component{
    render(){
        return(<div className="gwrapper">
                <model-viewer  id="globe" class="globe" camera-orbit="00deg 90deg 0deg"  src="./models/globe.glb" autoplay />
        </div>)
    }
}




export default Globe;