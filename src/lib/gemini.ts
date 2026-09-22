import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

export const isGeminiConfigured = () => {
  return apiKey !== '' && apiKey !== 'your-gemini-api-key';
};

let client: GoogleGenAI | null = null;

export const getGeminiClient = () => {
  if (!client && isGeminiConfigured()) {
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

export const RENTAL_SYSTEM_PROMPT = `You are RentProof AI, a helpful and knowledgeable rental assistant for Indian tenants and landlords.
You help with rental queries, explain tenant rights under Indian rental laws, and analyze rental data.
Always be concise, professional, and helpful. Format currency in ₹ (INR).
When referencing data, cite specific records. Never make up data that wasn't provided to you.`;
