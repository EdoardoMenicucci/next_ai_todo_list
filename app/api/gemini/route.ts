import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

/**
 * Response Json Schema
 */
const schema = {
    description: "Todo list",
    type: SchemaType.ARRAY,
    items: {
        type: SchemaType.OBJECT,
        properties: {
            operation: {
                type: SchemaType.STRING,
                description: "Type of operation to perform",
                enum: ["add", "update", "delete"]
            },
            todo: {
                type: SchemaType.STRING,
                description: "Content of todo"
            },
            state: {
                type: SchemaType.STRING,
                description: "State of todo",
                enum: ["done", "not done"]
            },
            id: {
                type: SchemaType.STRING,
                description: "ID of todo",
                nullable: true
            }
        },
        required: ["operation", "todo"]
    }
};

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
    },
});


export async function POST(request: Request) {

    const { prompt, todos } = await request.json();

    console.log(prompt);

    const result = await model.generateContent(`
        Given this todo list:
        ${todos.map((t: any, i: number) => `${i}: ${t.task} (${t.state})`).join('\n')}

        Analyze this command and generate a JSON response with:
        - operation: add/update/delete
        - todo: Content of todo
        - state: done/not done
        - id: index of todo to modify/delete

        Command: ${prompt}
    `);

    console.log(result.response.text());

    return NextResponse.json(result.response);
}