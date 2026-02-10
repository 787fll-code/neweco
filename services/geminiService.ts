import { GoogleGenAI, Chat, Type } from "@google/genai";
import { PlayerState, GameEvent } from "../types";

let chatSession: Chat | null = null;

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * AI Advisor (Eddie) using high-quality Pro model for complex financial reasoning.
 */
export const getAdvisorGuidance = async (playerState: PlayerState, question: string) => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: `
          שמך EDDIE. אתה עוזר פיננסי ציני, מושחז ומדויק להפליא. 
          אתה מומחה לכלכלה, שוק ההון וניהול קריירה.
          אתה פונה לבני נוער בגובה העיניים אבל לא חוסך מהם את האמת הקשה על עולם המבוגרים.
          תפקידך לתת עצות אסטרטגיות מבוססות נתונים בלבד.
          אל תהיה נחמד מדי - תהיה מקצועי.
          ענה בעברית רהוטה וקצרה.
        `,
        temperature: 0.7,
        thinkingConfig: {
          thinkingBudget: 4000
        }
      },
    });
  }

  const contextPrompt = `
    קונטקסט שחקן נוכחי:
    - מזומן: ${playerState.money}₪
    - חסכונות: ${playerState.savings}₪
    - אושר: ${playerState.happiness}%
    - עבודה: ${playerState.job.name} (שכר: ${playerState.job.salary}₪)
    - חובות: ${playerState.loans}₪
    - נכסים: ${playerState.inventory.join(', ') || 'אין'}

    שאלה מהשחקן: "${question}"
  `;

  try {
    const response = await chatSession.sendMessage({ message: contextPrompt });
    return response.text;
  } catch (error) {
    console.error("AI Guidance Error:", error);
    chatSession = null;
    return "מצטער, יש לי תקלה בסינפסות הדיגיטליות. נסה שוב מאוחר יותר.";
  }
};

/**
 * Generates dynamic game events using the Flash model for speed.
 */
export const generateEventContent = async (type: string): Promise<Partial<GameEvent>> => {
  const prompt = `
    צור אירוע משחק חדש מסוג ${type} עבור סימולטור כלכלה לבני נוער.
    האירוע צריך להיות בעברית, חדשני ורלוונטי לחיים האמיתיים.
    
    סוגי אירועים:
    - LUCK: מזל (טוב או רע).
    - MISSION: משימה קצרה.
    - OPPORTUNITY: השקעה או רכישה.
    - DECISION: דילמה יומיומית.
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