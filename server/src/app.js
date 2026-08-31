import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routers/authRoutes.js';
import workspaceRoutes from './routers/workspaceRoutes.js';
import projectRoutes from './routers/projectRoutes.js';

const app = express();

app.use(
    cors({
        origin: "http://localhost:5137",
        credentials: true,
    })
)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// mount routes
app.use('/api/auth', authRoutes);
app.use('/api/workspace', workspaceRoutes);
app.use('/api/project', projectRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Engino API is running",
    });
});


export default app;
