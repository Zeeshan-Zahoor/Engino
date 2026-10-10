import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const extractRequirement = async (prompt) => {
    
    const interaction = await ai.interactions.create({
        model: "gemini-3.6-flash-lite",
        system_instruction: `
            You are a software requirement extraction assistant.

            Convert the user's natural-language software idea into an initial
            structured requirement draft.

            Your job is to extract information explicitly stated or strongly
            implied by the user's input.

            Return:
            - a concise requirement name
            - a clear description preserving the user's intent
            - an estimated complexity: Low, Medium, or High
                If complexity cannot be reasonably estimated from the provided information, return "Medium".
            - acceptance criteria only when they are explicitly stated or clearly
            expressed as requirements

            Rules:
            - Do not invent features.
            - Do not invent users, roles, integrations, technologies, or business rules.
            - Do not add acceptance criteria that are not supported by the input.
            - Do not ask clarification questions.
            - Do not generate an implementation plan.
            - Do not generate engineering tasks.
            - Preserve the user's intent.`,
        
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
                    name: {
                        type: "string",
                    },
                    description: {
                        type: "string",
                    },
                    complexity: {
                        type: "string",
                        enum: ["Low", "Medium", "High"],
                    },
                    acceptanceCriteria: {
                        type: "array",
                        items: {
                            type: "string",
                        }
                    }
                },
                required: [
                    "name",
                    "description",
                    "complexity",
                    "acceptanceCriteria",
                ],
            }
        }   
    });

    return JSON.parse(interaction.output_text);
}

export {
    extractRequirement,
}