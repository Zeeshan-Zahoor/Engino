import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import ProjectDetails from "../pages/ProjectDetails";
import AIRequirements from "../pages/AIRequirements";
import Tasks from "../pages/Tasks";
import Registration from "../pages/auth/Registration";
import Login from "../pages/auth/Login";

const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />
            },
            {
                path:'projects',
                element: <Projects />,
            },
            {
                path: 'projects/:projectId',
                element: <ProjectDetails />
            },
            {
                path: 'requirements',
                element: <AIRequirements />
            },
            {
                path: 'tasks',
                element: <Tasks />
            }
        ],
    },

    // auth pages
    {
        path: "/register",
        element: <Registration />
    },
    {
        path: "/login",
        element: <Login />
    },
]);

export default router;

