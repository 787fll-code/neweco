
import { GoogleGenAI, Chat, Type } from "@google/genai";
import { PlayerState, GameEvent } from "../types";

let chatSession: Chat | null = null;

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * AI Advisor (Eddie) remains dynamic as it is a real-time chat interface.
 */
export const getAdvisorGuidance = async (playerState: PlayerState, question: string) => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `
          שמך EDDIE. אתה עוזר פיננסי ציני ומדויק. 
          אתה לא נותן עצות רגשיות, רק נתונים יבשים על שוק ההון, נדל"ן וקריירה.
          ענה בקצרה ובשפה מקצועית.
        `,
        temperature: 0.8,
      },
    });
  }

  const contextPrompt = `
    מצב שחקן: ${playerState.money}₪, ${playerState.happiness}%, ג׳וב: ${playerState.job.name}, חובות: ${playerState.loans}₪.
    שאלה: "${question}"
  `;

  try {
    const response = await chatSession.sendMessage({ message: contextPrompt });
    return response.text;
  } catch (error) {
    chatSession = null;
    return "שגיאת תקשורת במערכת הבנקאית.";
  }
};

/**
 * Generates a full game event using AI
 */
export const generateEventContent = async (type: string): Promise<Partial<GameEvent>> => {
  const prompt = `
    צור אירוע משחק חדש מסוג ${type} עבור סימולטור כלכלי לבני נוער.
    האירוע צריך להיות בעברית, מעניין, ומתאים לעולם המודרני/עתידני.
    
    כללים:
    1. כותרת קצרה וקולעת.
    2. תיאור שמסביר לשחקן מה קרה.
    3. 'intel' - טיפ מקצועי/ציני מהעוזר הדיגיטלי אדי על המצב.
    4. אימפקט כלכלי (money) ואושר (happiness) מאוזנים.
    
    סוגי אירועים:
    - LUCK: משהו שקורה במקרה (זכייה, מציאה, קנס פתאומי).
    - MISSION: משימה לימודית (זיהוי פישינג, הבנת ריבית).
    - OPPORTUNITY: הזדמנות עסקית/השקעה.
    - DECISION: בחירה יומיומית בין נוחות לחיסכון.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            intel: { type: Type.STRING },
            moneyImpact: { type: Type.INTEGER },
            happinessImpact: { type: Type.INTEGER }
          },
          required: ["title", "description", "intel", "moneyImpact", "happinessImpact"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return {
      title: data.title,
      description: data.description,
      intel: data.intel,
      impact: {
        money: data.moneyImpact,
        happiness: data.happinessImpact
      }
    };
  } catch (error) {
    console.error("AI Generation failed:", error);
    throw error;
  }
};
