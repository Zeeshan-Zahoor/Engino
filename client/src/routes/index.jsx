import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Dashboard from "../pages/Dashboard";

const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />
            }
        ]
    },
]);

export default router;

