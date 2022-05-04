import Home from "./components/home.jsx";
import NOTFOUND from "./components/404.jsx";
import {
  BrowserRouter as Router,
  Route,
  Routes 
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/*" element={<NOTFOUND/>}/>
      </Routes>
    </Router>
  );
}


export default App;
