import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
})

const generateAIPlan = async (requirement, conversation) => {
    const input =  `
        Requirement:
            Name: 
                ${requirement.name}
            Description: 
                ${requirement.description}
            Complexity: 
                ${requirement.complexity}

            Acceptance Criteria:
                ${requirement.acceptanceCriteria.join("\n")}

            Clarification Conversation:
                ${conversation?.messages
                    ?.map(message => `${message.role}: ${message.content}`)
                    .join("\n") || "No clarification conversation available."
                }
            `;

    const interaction = await ai.interactions.create({
        model: "gemini-3.6-flash",

        system_instruction: `
            You are a senior software requirements analyst.

            The requirement provided to you has already been
            analyzed and clarified.

            Your job is to create a high-level implementation plan
            for the requirement.

            The plan should describe:
            1. The overall objective.
            2. The major features that need to be implemented.
            3. The priority of each feature.
            4. Estimated effort for each feature.
            5. Important technical considerations.
            6. Dependencies.
            7. Potential risks.

            Do not write source code.

            Do not invent features that are not supported by the
            requirement or clarification conversation.

            Do not generate individual development tasks yet.

            Keep the plan practical and implementation-oriented
        `,

        input,

        response_format: {
            type: "text",
            mime_type: "application/json",

            schema: {
                type: "object",

                properties: {

                    overview: {
                        type: "string",
                    },

                    objectives: {
                        type: "array",
                        items: {
                            type: "string",
                        },
                    },

                    features: {
                        type: "array",
                        items: {
                            type: "object",

                            properties: {

                                name: {
                                    type: "string",
                                },

                                description: {
                                    type: "string",
                                },

                                priority: {
                                    type: "string",
                                    enum: [
                                        "high",
                                        "medium",
                                        "low",
                                    ],
                                },

                                estimatedEffortMinutes: {
                                    type: "integer",
                                },

                            },

                            required: [
                                "name",
                                "description",
                                "priority",
                                "estimatedEffortMinutes",
                            ],
                        },
                    },

                    technicalConsiderations: {
                        type: "array",
                        items: {
                            type: "string",
                        },
                    },

                    dependencies: {
                        type: "array",
                        items: {
                            type: "string",
                        },
                    },

                    risks: {
                        type: "array",
                        items: {
                            type: "string",
                        },
                    },

                },

                required: [
                    "overview",
                    "objectives",
                    "features",
                    "technicalConsiderations",
                    "dependencies",
                    "risks",
                ],
            },
        },

    });
    return JSON.parse(interaction.output_text);
}

export {
    generateAIPlan,
}