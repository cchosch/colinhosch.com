import "./../css/header.css";

function Globe(){
    return(<div className="gwrapper">
            <model-viewer  id="globe" class="globe" camera-orbit="00deg 90deg 0deg"  src="./models/globe.glb" autoplay />
    </div>)
}




export default Globe;