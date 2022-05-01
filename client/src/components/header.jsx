import "./../css/header.css";

function Header(){
    return(<div>
        <div className="colinh">Colin Hoscheit</div>
        <model-viewer class="globe" camera-orbit="00deg 90deg 0deg"  src="./globe.glb" autoplay />
    </div>)
}


export default Header