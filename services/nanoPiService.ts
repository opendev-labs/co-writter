
// NanoPi AI Service
// Connects to the OpenDev Labs NanoPi Space (Ollama-compatible OpenAI API)
// Space: https://opendev-labs-nanopi.hf.space

const NANOPI_BASE_URL = 'https://opendev-labs-nanopi.hf.space';
const NANOPI_MODEL = 'nanopi'; // the model name in Ollama

export interface NanoPiMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface NanoPiChatSession {
    history: NanoPiMessage[];
    systemPrompt: string;
}

// Check if NanoPi is online
export const checkNanoPiStatus = async (): Promise<boolean> => {
    try {
        const res = await fetch(`${NANOPI_BASE_URL}/api/tags`, {
            signal: AbortSignal.timeout(5000),
        });
        return res.ok;
    } catch {
        return false;
    }
};

// Get available models
export const getNanoPiModels = async (): Promise<string[]> => {
    try {
        const res = await fetch(`${NANOPI_BASE_URL}/api/tags`);
        if (!res.ok) return [];
        const data = await res.json();
        return (data.models || []).map((m: any) => m.name);
    } catch {
        return [];
    }
};

// Create a new chat session
export const createNanoPiSession = (systemPrompt: string): NanoPiChatSession => ({
    history: [],
    systemPrompt,
});

// Send a message and get a streamed response
export const sendNanoPiMessage = async (
    session: NanoPiChatSession,
    userMessage: string,
    onChunk: (text: string) => void,
): Promise<{ updatedSession: NanoPiChatSession; fullResponse: string }> => {
    const messages: NanoPiMessage[] = [
        { role: 'system', content: session.systemPrompt },
        ...session.history,
        { role: 'user', content: userMessage },
    ];

    let fullResponse = '';

    try {
        const res = await fetch(`${NANOPI_BASE_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: NANOPI_MODEL,
                messages,
                stream: true,
            }),
        });

        if (!res.ok || !res.body) throw new Error(`NanoPi API error: ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(Boolean);

            for (const line of lines) {
                try {
                    const parsed = JSON.parse(line);
                    const text = parsed?.message?.content ?? '';
                    if (text) {
                        fullResponse += text;
                        onChunk(fullResponse);
                    }
                    if (parsed.done) break;
                } catch {
                    // skip invalid JSON lines
                }
            }
        }
    } catch (err) {
        console.error('[NanoPi] Stream error:', err);
        throw err;
    }

    const updatedSession: NanoPiChatSession = {
        ...session,
        history: [
            ...session.history,
            { role: 'user', content: userMessage },
            { role: 'assistant', content: fullResponse },
        ],
    };

    return { updatedSession, fullResponse };
};

// Simple one-shot message (no streaming)
export const askNanoPi = async (prompt: string, systemPrompt = ''): Promise<string> => {
    try {
        const res = await fetch(`${NANOPI_BASE_URL}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: NANOPI_MODEL,
                prompt: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt,
                stream: false,
            }),
        });
        if (!res.ok) throw new Error(`NanoPi API error: ${res.status}`);
        const data = await res.json();
        return data.response || '';
    } catch (err) {
        console.error('[NanoPi] generate error:', err);
        return '';
    }
};

export const NANOPI_SYSTEM_PROMPT = `You are NanoPi — the photonic intelligence model built by OpenDev Labs.
You are the AI co-author inside Co-Writter, a book writing and publishing platform.
You help users write books, brainstorm ideas, generate outlines, improve prose, and get publishing advice.
You are direct, intelligent, and creative. You write with depth and clarity.
When writing content, use markdown formatting. Keep your chat responses concise unless asked to write long-form content.`;
