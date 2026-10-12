import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routers/authRoutes.js';
import workspaceRoutes from './routers/workspaceRoutes.js';
import projectRoutes from './routers/projectRoutes.js';
import taskRoutes from './routers/taskRoutes.js';
import requirementRoutes from './routers/requirementRoutes.js';
import aiRoutes from './routers/aiRoutes.js';
import aiPlansRoutes from './routers/aiPlansRoutes.js';
import notificationRoutes from './routers/notificationRoutes.js';

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

console.log(
  "Gemini key:",
  process.env.GEMINI_API_KEY?.slice(0, 15)
);


// mount routes
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/workspaces/:workspaceId/projects', projectRoutes);
app.use('/api/workspaces/:workspaceId/projects/:projectId/requirements', requirementRoutes);
app.use('/api/workspaces/:workspaceId/projects/:projectId/requirements/:requirementId', aiPlansRoutes);
app.use('/api/workspaces/:workspaceId/projects/:projectId/requirements/:requirementId/ai', aiRoutes);
app.use('/api/workspaces/:workspaceId/projects/:projectId/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Engino API is running",
    });
});


export default app;
