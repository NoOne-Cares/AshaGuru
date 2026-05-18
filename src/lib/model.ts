// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// export function getModel(modelName: string = "gemma-4-26b-a4b-it") {
//     // const useOllama = process.env.USE_OLLAMA === "false";
//     // if (useOllama) {
//     //     const { ChatOllama } = require("@langchain/community/chat_models/ollama");
//     //     return new ChatOllama({ model: "gemma4:4b", temperature: 0 });
//     // }
//     return new ChatGoogleGenerativeAI({
//         model: modelName,
//         temperature: 0,

//         maxOutputTokens: 1024,
//     });
// }
// // src/lib/model.ts
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export function getModel(modelName: string = "gemma-4-31b-it") {
    // const useOllama = process.env.USE_OLLAMA === "true";

    // if (useOllama) {
    //     // Dynamic import so Ollama isn't required at build time
    //     const {
    //         ChatOllama,
    //     } = require("@langchain/community/chat_models/ollama");
    //     return new ChatOllama({
    //         model: "gemma4:4b", // adjust to your local model name
    //         temperature: 0,
    //     });
    // }

    return new ChatGoogleGenerativeAI({
        model: modelName,
        apiKey: process.env.GOOGLE_API_KEY,

        temperature: 0,
        maxOutputTokens: 1024,
    });
}
