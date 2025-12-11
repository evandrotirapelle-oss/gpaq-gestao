/// <reference types="vite/client" />
import { GoogleGenerativeAI } from "@google/generative-ai";

// Configuração da API Key
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || "";

let genAI: GoogleGenerativeAI | null = null;

if (API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(API_KEY);
  } catch (error) {
    console.error("Erro ao iniciar Google AI:", error);
  }
} else {
  console.warn("⚠️ Nenhuma API Key encontrada. A IA não responderá.");
}

// Função Genérica Interna (o motor da IA)
const runGemini = async (prompt: string) => {
  if (!genAI) {
    console.error("IA não configurada (Falta API Key)");
    return "Erro: Configure a VITE_GOOGLE_API_KEY no arquivo .env para usar a IA.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Erro na requisição Gemini:", error);
    return "Erro ao processar sua solicitação. Verifique o console.";
  }
};

// --- AS FUNÇÕES QUE O SEU APP.TSX ESTÁ PROCURANDO ---

export const analyzeRequestFeasibility = async (input: any) => {
  const prompt = `Analise a viabilidade técnica e operacional da seguinte solicitação: ${JSON.stringify(input)}. Responda com prós, contras e uma conclusão.`;
  return runGemini(prompt);
};

export const generateDocumentFields = async (input: any) => {
  const prompt = `Com base nestes dados: ${JSON.stringify(input)}, gere uma lista de campos necessários para um documento formal.`;
  return runGemini(prompt);
};

export const generateMemoText = async (input: any) => {
  const prompt = `Escreva um memorando formal e profissional com base nas seguintes informações: ${JSON.stringify(input)}`;
  return runGemini(prompt);
};

// Mantemos a genérica também, caso seja usada em outro lugar
export const getGeminiResponse = async (prompt: string) => {
  return runGemini(prompt);
};