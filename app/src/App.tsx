import { Navigate, useRoutes } from "react-router";
import Home from './views/Home';
import Gallery from "./views/Gallery";


function App() {
  const routes = useRoutes([{
    path: "/home",
    element: <Home></Home>
  }, {
    path: "/gallery",
    element: <Gallery></Gallery>
  }, {
    path: "/*",
    element: <Navigate to="/home"></Navigate>
  }])
  return routes
}

export default App;
