import { getGeminiClient, RENTAL_SYSTEM_PROMPT, isGeminiConfigured } from '../lib/gemini';
import type { Property, RentalAgreement, Payment, RentalEvent } from '../types';

export const sendMessage = async (
  userMessage: string,
  context: {
    property: Property;
    agreement: RentalAgreement;
    recentPayments: Payment[];
    recentEvents: RentalEvent[];
  }
): Promise<string> => {
  if (!isGeminiConfigured()) {
    return "The Gemini API is not configured yet. Please set VITE_GEMINI_API_KEY in your .env file.";
  }

  const client = getGeminiClient();
  if (!client) {
    return "Error initializing AI client.";
  }

  const contextPrompt = `${RENTAL_SYSTEM_PROMPT}

You have access to the following context about the user's rental:
- Property: ${context.property?.name}, ${context.property?.address}, ${context.property?.city}
- Monthly Rent: ₹${context.agreement?.rent_amount}
- Lease Period: ${context.agreement?.start_date} to ${context.agreement?.end_date}
- Deposit: ₹${context.agreement?.deposit_amount}
- Recent Payments: ${context.recentPayments?.map(p => `₹${p.amount} due ${p.due_date} (${p.status})`).join('; ') || 'None'}
- Recent Events: ${context.recentEvents?.map(e => e.title).join('; ') || 'None'}

User's question: ${userMessage}`;

  try {
    const interaction = await client.interactions.create({
      model: 'gemini-3.8-flash',
      input: contextPrompt,
      store: false,
    });

    return interaction.output_text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Sorry, I encountered an error processing your request. Please check your API key and try again.";
  }
};
