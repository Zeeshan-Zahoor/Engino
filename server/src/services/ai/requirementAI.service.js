import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const analyzeRequirement = async (requirement) => {

    const prompt = `
        Analyze the following software requirement.

        Requirement Name:
        ${requirement.name}

        Description:
        ${requirement.description || "Not provided"}

        Acceptance Criteria:
        ${requirement.acceptanceCriteria?.length
            ? requirement.acceptanceCriteria.join("\n")
            : "Not provided"
        }
    `;

    const interaction = await ai.interactions.create({
        model: "gemini-3.6-flash",
        system_instruction: `
            You are a software requirements analyst.

            Analyze the user's software requirement.

            Your job is to:

            1. Determine whether the requirement is sufficiently clear.
            2. Identify missing or ambiguous information.
            3. Generate clarification questions when necessary.
            4. Estimate your confidence that the requirement is sufficiently
            understood to proceed to planning.

            Confidence represents how confident you are in the completeness
            and clarity of the requirement, NOT how confident you are in
            your own answer.

            Use the following confidence guidelines:

            90-100:
            The requirement is very well defined. Scope, users, workflows,
            major features, constraints, integrations, and important
            business rules are sufficiently clear.

            75-89:
            The requirement is mostly clear but contains some minor
            ambiguities or assumptions.

            50-74:
            Important information is missing or ambiguous and clarification
            is required before planning.

            0-49:
            The requirement is highly incomplete or too vague to meaningfully
            plan.

            If the requirement needs clarification, identify the most
            important missing information and generate focused questions.

            If the requirement is clear, questions should be an empty array.

            Do not write code.
            Do not design the implementation yet.
            Do not invent unspecified features.
        `,
        input: [
            {
                type: "text",
                text: prompt,
            }
        ],

        response_format: {
            type: "text",
            mime_type: "application/json",
            schema: {
                type: "object",

                properties: {
                    status: {
                        type: "string",
                        enum: ["clear", "needs_clarification"]
                    },

                    summary: {
                        type: "string",
                    },

                    confidence: {
                        type: "integer",
                        minimum: 0,
                        maximum: 100,
                    },

                    questions: {
                        type: "array",
                        items: {
                            type: "string"
                        }
                    }
                },

                required: [
                    "status",
                    "summary",
                    "confidence",
                    "questions"
                ]
            }
        }
    });

    return JSON.parse(interaction.output_text);
}

const continueAnalysis = async (requirement, conversation) => {
    const prompt = `
        Analyze the software requirement again based on the clarification conversation.

        Requirement:

        Name:
        ${requirement.name}

        Description:
        ${requirement.description || "Not provided"}

        Acceptance Criteria:
        ${requirement.acceptanceCriteria?.length
            ? requirement.acceptanceCriteria.join("\n")
            : "Not provided"
        }

        Clarification conversation:
        ${conversation
            .map(message => `${message.role}: ${message.content}`)
            .join("\n")}

        Determine whether the requirement is now sufficiently clear.

        If important information is still missing or ambiguous:
        - status must be "needs_clarification"
        - generate only the necessary clarification questions.

        If the requirement is sufficiently clear:
        - status must be "clear"
        - questions must be an empty array.

        Do not write code.
        Do not design implementation.
        Do not invent unspecified features.
    `;

    const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash",

        system_instruction: `
            You are a software requirements analyst.

            Your responsibility is to eliminate ambiguity from software requirements before
            engineering work begins.

            Do not write code.
            Do not design implementation.
            Do not invent features.

            Ask clarification questions when important information is missing.
            Do not ask unnecessary questions when the requirement is already sufficiently clear.
        `,

        input: [
            {
                type: "text",
                text: prompt,
            },
        ],

        response_format: {
            type: "text",
            mime_type: "application/json",
            schema: {
                type: "object",
                properties: {
                    status: {
                        type: "string",
                        enum: ["clear", "needs_clarification"],
                    },

                    summary: {
                        type: "string",
                    },

                    confidence: {
                        type: "integer",
                        minimum: 0,
                        maximum: 100,
                    },

                    questions: {
                        type: "array",
                        items: {
                            type: "string",
                        },
                    },
                },

                required: [
                    "status",
                    "summary",
                    "confidence",
                    "questions",
                ],
            },
        },
    });

    return JSON.parse(interaction.output_text);

};

export {
    analyzeRequirement,
    continueAnalysis,
}