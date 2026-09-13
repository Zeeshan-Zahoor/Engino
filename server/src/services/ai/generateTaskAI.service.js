import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const generateTasks = async (requirement, plan) => {
    const input = `
        REQUIREMENT:
        ${JSON.stringify(requirement, null, 2)}

        APPROVED AI PLAN:
        ${JSON.stringify(plan, null, 2)}

        Generate a set of actionable development tasks based on the
        requirement and the approved AI plan.

        Each task should represent a meaningful piece of work that
        can be independently assigned and tracked.

        Do not generate tasks that are unrelated to the requirement
        or the approved plan.

        Do not duplicate tasks.

        Break large features into practical implementation tasks,
        but do not make tasks unnecessarily small.

        For each task, provide:
        - title
        - description
        - priority
        - estimated effort in minutes
        - type
        - complexity
        - tags

        The total set of tasks should cover the major features and
        technical considerations described in the approved plan.
    `; 

    const interaction = await ai.interactions.create({
        model: "gemini-3.6-flash",
        
        system_instruction: `
            You are an experienced software project manager and
            technical task decomposition specialist.

            Your job is to convert an approved software requirement
            and its AI-generated implementation plan into a practical
            set of development tasks.

            Follow these rules:

            1. Only create tasks supported by the provided requirement
               and approved plan.

            2. Do not invent major features, integrations, business
               rules, or requirements that are not specified.

            3. Tasks must be actionable and suitable for assignment
               to a software development team.

            4. Each task should represent a meaningful unit of work.

            5. Avoid duplicate or overlapping tasks.

            6. Break complex features into multiple tasks when
               necessary.

            7. Do not make tasks excessively granular.

            8. Estimate effort realistically in minutes.

            9. Use:
               - Low priority for minor or non-critical work
               - Medium priority for normal development work
               - High priority for critical functionality,
                 security, integrations, or core functionality

            10. Complexity should reflect the technical difficulty
                of the task.

            11. Use concise and descriptive titles.

            12. Descriptions should explain what needs to be done,
                not provide source code.

            13. Do not assign tasks to users. Assignees will be
                selected by the application.

            14. Do not provide projectId, requirementId, reporter,
                or other database identifiers.

            15. Return only the structured JSON response requested
                by the schema.
        `,

        input,

        response_format: {
            type: "text",
            mime_type: "application/json",
            schema: {
                type: "object",

                properties: {
                    tasks: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                title: {
                                    type: "string",
                                },

                                description: {
                                    type: "string",
                                },

                                priority: {
                                    type: "string",
                                    enum: ["Low", "Medium", "High"],
                                },
                                
                                estimatedEffortMinutes: {
                                    type: "number",
                                    minimum: 0,
                                },

                                type: {
                                    type: "string",
                                },

                                complexity: {
                                    type: "string",
                                    enum: ["Low", "Medium", "High"],
                                },

                                tags: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                    },
                                },
                            },

                            required: [
                                "title",
                                "description",
                                "priority",
                                "estimatedEffortMinutes",
                                "type",
                                "complexity",
                                "tags",
                            ]
                        }
                    }
                },

                required: ["tasks"],
            }
        }
    });

    return JSON.parse(interaction.output_text);
}

export {
    generateTasks,
}