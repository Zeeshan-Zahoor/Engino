import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import ProjectDetails from "../pages/ProjectDetails";
import AIRequirements from "../pages/AIRequirements";
import Tasks from "../pages/Tasks";
import Registration from "../pages/auth/Registration";
import Login from "../pages/auth/Login";
import PublicRoute from "../pages/auth/PublicRoute";
import ProtectedRoute from "../pages/auth/ProtectedRoute";
import InvitationPage from "../pages/invitation/Invitation";
import ProjectRequirementDetails from "../components/projects/requirements/ProjectRequirementDetails";

const router = createBrowserRouter([
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    {
                        path: '/',
                        element: <Dashboard />
                    },
                    {
                        path:'projects',
                        element: <Projects />,
                    },
                    {
                        path: 'projects/:projectId',
                        element: <ProjectDetails />,
                    },
                    {
                        path: 'projects/:projectId/requirements/:requirementId',
                        element: <ProjectRequirementDetails />
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
        ]
    },

    // auth pages
    {
        element: <PublicRoute />,
        children: [
            {
                path: "/register",
                element: <Registration />
            },
            {
                path: "/login",
                element: <Login />
            },
        ]
    },
    {
        path: "/invitations/:token",
        element: <InvitationPage />
    }
]);

export default router;

