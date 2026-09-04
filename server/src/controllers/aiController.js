import AIConversation from "../models/aiConversation.model.js";
import AIPlan from "../models/aiPlan.model.js";
import Project from "../models/project.model.js";
import Requirement from "../models/requirement.model.js";
import { generateAIPlan } from "../services/ai/planAI.service.js";
import { analyzeRequirement, continueAnalysis } from "../services/ai/requirementAI.service.js";

const aiAnalysis = async (req, res) => {
    try {
        const userId = req.user.userId;
        const workspaceId = req.workspaceId;
        const membership = req.membership;

        const { projectId, requirementId } = req.params;

        if (!projectId) {
            return res.status(404).json({
                success: false,
                message: "Project ID is required!",
            });
        }

        const project = await Project.findOne({
            _id: projectId,
            workspaceId,
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project is not in the workspace.",
            });
        }

        const requirement = await Requirement.findOne({
            _id: requirementId,
            projectId,
        });

        if (!requirement) {
            return res.status(404).json({
                success: false,
                message: "Requirement does not belong to this project",
            });
        }

        if (membership.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can trigger AI analysis",
            });
        }

        const analysis = await analyzeRequirement({
            name: requirement.name,
            description: requirement.description,
            acceptanceCriteria: requirement.acceptanceCriteria,
        });

        if (!analysis) {
            return res.status(400).json({
                success: false,
                message: "AI analysis failed!",
            });
        }

        
        requirement.aiConfidence = analysis.confidence;

        if(analysis.status === "needs_clarification") {
            requirement.aiStatus = "Needs Clarification";
        } else if (analysis.status === "clear") {
            requirement.aiStatus = "Clear";
        } else {
            requirement.aiStatus = "Pending";
        }

        await requirement.save();

        const aiConversation = new AIConversation({
            requirementId,
            userId,
            messages: [
                {
                    role: "assistant",
                    content: analysis.summary,
                }
            ],
        });

        await aiConversation.save();
        
        return res.status(200).json({
            success: true,
            analysis,
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message,
            message: "Internal server error",
            success: false,
        });
    }
}

const answerClarification = async (req, res) => {
    try {
        const userId = req.user.userId;
        const workspaceId = req.workspaceId;
        const membership = req.membership;

        const { projectId, requirementId } = req.params;
        const { answer } = req.body;

        if (!projectId || !requirementId) {
            return res.status(400).json({
                success: false,
                message: "Project ID and requirement ID are required!",
            });
        }

        if (!answer || !answer.trim()) {
            return res.status(400).json({
                success: false,
                message: "Clarification answer is required!",
            });
        }

        if (membership.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins can answer AI clarification questions",
            });
        }

        const project = await Project.findOne({
            _id: projectId,
            workspaceId,
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project is not in the workspace.",
            });
        }

        const requirement = await Requirement.findOne({
            _id: requirementId,
            projectId,
        });

        if (!requirement) {
            return res.status(404).json({
                success: false,
                message: "Requirement does not belong to this project",
            });
        }

        const conversation = await AIConversation.findOne({
            requirementId,
            status: "active",
        });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "No active AI conversation found for this requirement",
            });
        }


        // store admin's answer
        conversation.messages.push({
            role: "user",
            content: answer.trim(),
        });

        const analysis = await continueAnalysis(
            requirement,
            conversation.messages,
        );

        if(!analysis) {
           return res.status(500).json({
                success: false,
                message: "AI analysis failed!",
            }); 
        }

        //store the AI response
        conversation.messages.push({
            role: "assistant",
            content: analysis.summary,
        });

        if(analysis.questions?.length) {
            conversation.messages.push({
                role: "assistant",
                content: analysis.questions.join("\n"),
            });
        }

        // Update requirement state
        requirement.aiConfidence = analysis.confidence;

        if(analysis.status === "needs_clarification") {
            requirement.aiStatus = "Needs Clarification";
        } else if (analysis.status === "clear") {
            requirement.aiStatus = "Clear";
        } else {
            requirement.aiStatus = "Pending";
        }

        requirement.updatedBy = userId;
        
        await requirement.save();

        if(analysis.status === "clear") {
            conversation.status = "completed";
        }

        await conversation.save();

        return res.status(200).json({
            success: true,
            analysis,
            conversation,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

const generatePlan = async (req, res) => {
    try {
        const userId = req.user.userId;
        const workspaceId = req.workspaceId;
        const membership = req.membership;

        const { projectId, requirementId } = req.params;

        if (!projectId || !requirementId) {
            return res.status(400).json({
                success: false,
                message: "Project ID and requirement ID are required!",
            });
        }

        if (membership.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins can generate AI plans",
            });
        }

        const project = await Project.findOne({
            _id: projectId,
            workspaceId,
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found in the workspace",
            });
        }

        const requirement = await Requirement.findOne({
            _id: requirementId,
            projectId,
        });

        if (!requirement) {
            return res.status(404).json({
                success: false,
                message: "Requirement not found in the project",
            });
        }

        if(requirement.aiStatus !== "Clear") {
            return res.status(400).json({
                success: false,
                message: "Requirement must be clear before generating an AI plan",
            });
        }

        const conversation = await AIConversation.findOne({
            requirementId,
        }).sort({ updatedAt: -1 });

        const estimatedEffortMinutes = plan.features.reduce(
            (total, feature) => total + feature.estimatedEffortMinutes,
            0
        );
        
        const plan = await generateAIPlan(requirement, conversation);


        if(!plan) {
            return res.status(400).json({
                success: false,
                message: "AI Plan generation failed!",
            });
        }

        const latestPlan = await AIPlan.findOne({
            requirementId,
        }).sort({ version: -1 });

        const version = latestPlan ? latestPlan.version + 1 : 1;

        const aiPlan =  new AIPlan({
            requirementId,
            generatedBy: "AI",
            status: "Generated",
            content: plan,
            version,
        });

        await aiPlan.save();

        requirement.estimatedEffortMinutes = estimatedEffortMinutes;
        requirement.aiStatus = "Plan Generated";
        requirement.updatedBy = userId;

        await requirement.save();

        return res.status(201).json({
            success: true,
            message: "AI plan generated successfully!",
            plan: aiPlan,
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal server error",
        });
    }
}

export {
    aiAnalysis,
    answerClarification,
    generatePlan,
}