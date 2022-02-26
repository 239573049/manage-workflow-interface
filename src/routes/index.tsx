import { useRoutes
} from 'react-router-dom';
import Error404 from '../pages/error404/index'
import Login from '../pages/login/index'
import Admin from '../pages/admin/index'
import Home from '../pages/admin/home/index'
const GetRoutes = () => {
    const routes = useRoutes([
      {
        path: "/",
        children: [
          { index: true, element: <Login/> },
          {
            path: '/admin', children: [
              { index: true, element: <Admin /> },
              {
                path: "/admin/Home", element: <Home />
              },
            ]
          },
          { path: "*", element: <Error404/> }
        ]
      }
    ]);
  
    return routes;
  }
  
  export default GetRoutes