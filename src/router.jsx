import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import Home from './Pages/Home';
import Info from './Pages/Info';
import Plans from './Pages/Plans';
import Statistics from './Pages/Statistics';
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'

const myRouter = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "",
                element: <Home />,
            },   
            {
                path: "statistics",
                element: <Statistics />,
            },
            {
                path: "plans",
                element: <Plans />,
            },
            {
                path: "info",
                element: <Info />,
            },
            {
                path: "register",
                element: <Register />,
            },
            {
                path: "login",
                element: <Login />,
            }
        ],
    },
]);

export default myRouter;
