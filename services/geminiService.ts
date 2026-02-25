
import { GoogleGenAI, Chat, GenerateContentResponse, FunctionDeclaration, Type, Modality } from "@google/genai";
import { EBook, GeneratedImage, ChapterOutline } from '../types';
import { GEMINI_TEXT_MODEL, GEMINI_IMAGE_MODEL } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to clean JSON strings from Markdown code blocks
const cleanJsonString = (text: string): string => {
  if (!text) return "{}";
  let cleaned = text.trim();

  // 1. Try to extract from markdown code blocks first
  const jsonBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonBlockMatch) {
    cleaned = jsonBlockMatch[1];
  }

  // 2. If it still looks like it has extra text, try to find the outer braces or brackets
  const firstBrace = cleaned.search(/[{[]/);
  let lastIndex = -1;
  for (let i = cleaned.length - 1; i >= 0; i--) {
    if (cleaned[i] === '}' || cleaned[i] === ']') {
      lastIndex = i;
      break;
    }
  }

  if (firstBrace !== -1 && lastIndex !== -1 && lastIndex > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastIndex + 1);
  }

  return cleaned;
};

// --- AGENT TOOLS ---

const writeContentTool: FunctionDeclaration = {
  name: "write_content",
  description: "Writes content directly into the book editor. Use this to WRITE new prose, FIX existing text, or APPEND text. The content argument will completely replace the current editor content, so be sure to include the full text if you are just making a small edit. DO NOT use this to insert images directly as base64.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      content: { type: Type.STRING, description: "The FULL markdown content to put into the editor." },
      summary: { type: Type.STRING, description: "A very brief 1-word status (e.g. 'Writing', 'Fixing', 'Analyzing')." }
    },
    required: ["content"]
  }
};

const proposeBlueprintTool: FunctionDeclaration = {
  name: "propose_blueprint",
  description: "Propose a book title and chapter outline to the user for approval. Use this when the user asks to start a new book, create a plan, or brainstorm a structure.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "The proposed title of the book." },
      outline: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Chapter title" },
            summary: { type: Type.STRING, description: "Brief summary of chapter" }
          }
        },
        description: "List of chapters with summaries."
      }
    },
    required: ["title", "outline"]
  }
};

const generateImageTool: FunctionDeclaration = {
  name: "generate_image",
  description: "Generates a high-quality visual asset. REQUIRED for any image request. The AI must create a detailed visual description prompt based on the surrounding text context if the user does not provide one.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      prompt: { type: Type.STRING, description: "The detailed visual description of the image or diagram to generate." }
    },
    required: ["prompt"]
  }
};

// --- CORE FUNCTIONS ---

export const analyzePdfContent = async (pdfBase64: string): Promise<{ title?: string, author?: string, description?: string, genre?: string } | null> => {
  try {
    const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, "");

    const prompt = `Analyze this PDF. Extract Title, Author, Genre, and a Description (100 words). Return JSON.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: {
        parts: [
          { inlineData: { mimeType: "application/pdf", data: base64Data } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return JSON.parse(cleanJsonString(response.text || "{}"));
  } catch (e) {
    console.error("PDF Analysis failed", e);
    return null;
  }
};

export const createStudioSession = (initialContext: string): Chat | null => {
  try {
    return ai.chats.create({
      model: GEMINI_TEXT_MODEL,
      config: {
        systemInstruction: `IDENTITY: You are NanoPi — the photonic intelligence AI built by OpenDev Labs, powering Co-Writter as Co-Author.
                
MISSION: Write immersive, deeply intelligent, and market-ready books.
Blend spirituality, science, and narrative clarity into a seamless flow.

CORE BEHAVIORS:
1. **Context-Aware**: You always know the previous chapter content and the full book outline. Never contradict established facts.
2. **Chapter Continuity**: If the user says "Continue", write the next logical section or the next chapter in the sequence.
3. **High-Quality Prose**: Avoid generic AI cliches. Use varying sentence structures, sensory details, and deep philosophical or technical insight depending on the genre.
4. **Structural Integrity**: Ensure chapter titles and numbers in your internal logic match the user's provided context exactly.
5. **Auto-Correction**: If a chapter is missing or numbered incorrectly, fix it automatically without asking. Never produce empty pages or misaligned titles.

IMAGE GENERATION RULES (CRITICAL):
- **NEVER** output raw base64 image strings (e.g. "![img](data:image...)") directly in your text response or write_content tool. This crashes the editor.
- **ALWAYS** use the \`generate_image\` tool when the user asks for an image.
- **Contextual Intelligence**: If the user says "add an image" or "visualize this", you must ANALYZE the current paragraph or scene and write a HIGHLY DETAILED prompt for the tool yourself. Do not ask the user "what kind of image?". Just generate it based on the story.

TOOLS:
- **write_content**: REQUIRED for any long-form writing. Do not dump text in chat.
- **propose_blueprint**: For creating or restructuring the book.
- **generate_image**: The ONLY way to create images.

RESPONSE STYLE:
- Chat: Ultra-concise, robotic but polite (1-2 sentences). e.g., "Executing drafting sequence for Chapter 3."
- Writing: Lush, expansive, professional.

CONTEXT:
${initialContext}`,
        tools: [{ functionDeclarations: [writeContentTool, proposeBlueprintTool, generateImageTool] }],
      },
    });
  } catch (e) {
    console.error("Failed to create studio session", e);
    return null;
  }
};

export const suggestBookPrice = async (bookDetails: Pick<EBook, 'genre' | 'title' | 'description'>): Promise<string> => {
  try {
    const prompt = `Suggest a competitive market price in INR (Indian Rupees) for an eBook: "${bookDetails.title}" (${bookDetails.genre}). 
    CRITICAL: The price MUST be a "sacred" or numerologically significant number (e.g., 111, 222, 333, 444, 555, 777, 888, 999, 1111).
    Return ONLY the number.`;
    const response = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt
    });
    return response.text?.replace(/[^0-9.]/g, '').trim() || "444";
  } catch (error) {
    return "444";
  }
};

export const generateBookCover = async (prompt: string, style: string = 'Cinematic', title: string = '', author: string = ''): Promise<GeneratedImage | { error: string }> => {
  try {
    const refinedPrompt = `Professional Book Visual. Context: ${title} by ${author}. Request: ${prompt}. Mode: ${style}. Create a high-quality, clear, and relevant image/diagram. For diagrams, ensure clear labels and structure.`;

    const response = await ai.models.generateContent({
      model: GEMINI_IMAGE_MODEL,
      contents: { parts: [{ text: refinedPrompt }] },
      config: { imageConfig: { aspectRatio: '3:4' } },
    });

    const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (part?.inlineData?.data) {
      return { imageBytes: part.inlineData.data, prompt: prompt };
    }
    return { error: "Generation failed." };
  } catch (error) {
    return { error: "Service unavailable." };
  }
};

// Add generationTitleSuggestions for the wizard
export const generateTitleSuggestions = async (topic: string, genre: string, tone: string): Promise<string[]> => {
  try {
    const prompt = `Generate 5 catchy and professional eBook titles for the following concept:
    Topic: ${topic}
    Genre: ${genre}
    Tone: ${tone}
    Return ONLY a JSON array of strings.`;

    const response = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text;
    return JSON.parse(cleanJsonString(text || "[]"));
  } catch (error) {
    console.error("Title generation failed", error);
    return [];
  }
};

// Add generateBookOutline for the wizard
export const generateBookOutline = async (title: string, genre: string, tone: string): Promise<ChapterOutline[]> => {
  try {
    const prompt = `Create a structured 5-chapter outline for an eBook titled "${title}".
    Genre: ${genre}
    Tone: ${tone}
    Return ONLY a JSON array of objects with 'title' and 'summary' properties.`;

    const response = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING }
            },
            required: ["title", "summary"]
          }
        }
      }
    });

    const text = response.text;
    return JSON.parse(cleanJsonString(text || "[]"));
  } catch (error) {
    console.error("Outline generation failed", error);
    return [];
  }
};

// Add generateFullChapterContent for the wizard
export const generateFullChapterContent = async (chapterTitle: string, bookTitle: string, summary: string, tone: string): Promise<string> => {
  try {
    const prompt = `Write the full content for a chapter titled "${chapterTitle}" from the eBook "${bookTitle}".
    Chapter Summary: ${summary}
    Tone: ${tone}
    Instructions: Use professional markdown formatting. Include headers, lists, and deep insights. Aim for ~1000 words.`;

    const response = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt
    });

    return response.text || "";
  } catch (error) {
    console.error("Chapter content generation failed", error);
    return "Generation failed.";
  }
};

export const initializeGeminiChat = async (): Promise<Chat | null> => {
  return createStudioSession("Global Chat Context");
};

export const transcribeAudio = async (audioBase64: string, mimeType: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: audioBase64 } },
          { text: "Transcribe the spoken audio into text. Return only the transcription, no intro/outro." }
        ]
      }
    });
    return response.text || null;
  } catch (e) {
    console.error("Transcription failed", e);
    return null;
  }
};
