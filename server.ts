import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));

// Shared Gemini client utility on the server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// 1. Multi-turn Chat Endpoint (gemini-3.1-pro-preview, gemini-3.5-flash, gemini-3.1-flash-lite)
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, modelTier = 'general', systemInstruction } = req.body;

    let selectedModel = 'gemini-3.5-flash';
    if (modelTier === 'complex') {
      selectedModel = 'gemini-3.1-pro-preview';
    } else if (modelTier === 'fast') {
      selectedModel = 'gemini-3.1-flash-lite';
    }

    const defaultSysInstruction =
      systemInstruction ||
      'You are PhishGuard AI, a senior cybersecurity analyst specializing in phishing URL detection, NIST SP 800-61 incident response, and comparative ML vs Deep Learning research. Provide rigorous, technical, and actionable security insights.';

    const contents = (messages || []).map((m: { role: string; text: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction: defaultSysInstruction,
      },
    });

    res.json({
      text: response.text || '',
      modelUsed: selectedModel,
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: error.message || 'Chat generation failed' });
  }
});

// 2. Google Search Grounding Endpoint (gemini-3.5-flash with googleSearch tool)
app.post('/api/grounding/search', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are a cybersecurity research agent. Search for recent phishing campaigns, newly registered suspicious top-level domains, zero-day evasion tactics, or domain reputation intelligence.',
        tools: [{ googleSearch: {} }],
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        uri: chunk.web.uri,
        title: chunk.web.title,
      }));

    res.json({
      text: response.text || '',
      sources: webSources,
      modelUsed: 'gemini-3.5-flash',
    });
  } catch (error: any) {
    console.error('Error in /api/grounding/search:', error);
    res.status(500).json({ error: error.message || 'Search grounding failed' });
  }
});

// 3. Google Maps Grounding Endpoint (gemini-3.5-flash with googleMaps tool)
app.post('/api/grounding/maps', async (req, res) => {
  try {
    const { prompt, latitude, longitude } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (latitude !== undefined && longitude !== undefined) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: Number(latitude),
            longitude: Number(longitude),
          },
        },
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config,
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const mapPlaces = groundingChunks
      .filter((chunk: any) => chunk.maps)
      .map((chunk: any) => ({
        uri: chunk.maps.uri,
        title: chunk.maps.title,
      }));

    res.json({
      text: response.text || '',
      places: mapPlaces,
      modelUsed: 'gemini-3.5-flash',
    });
  } catch (error: any) {
    console.error('Error in /api/grounding/maps:', error);
    res.status(500).json({ error: error.message || 'Maps grounding failed' });
  }
});

// 4. Veo Video Generation: 3-Step Server Pattern (veo-3.1-fast-generate-preview / veo-3.1-generate-preview)
app.post('/api/generate-video', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/png', prompt = 'Cinematic security breach alert animation', aspectRatio = '16:9' } = req.body;

    const config: any = {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9',
    };

    const payload: any = {
      model: 'veo-3.1-generate-preview',
      prompt,
      config,
    };

    if (imageBase64) {
      payload.image = {
        imageBytes: imageBase64.replace(/^data:image\/[a-z]+;base64,/, ''),
        mimeType: mimeType || 'image/png',
      };
    }

    const operation = await ai.models.generateVideos(payload);
    res.json({ operationName: operation.name });
  } catch (error: any) {
    console.error('Error in /api/generate-video:', error);
    res.status(500).json({ error: error.message || 'Video initiation failed' });
  }
});

app.post('/api/video-status', async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) return res.status(400).json({ error: 'operationName required' });

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    res.json({ done: updated.done, error: updated.error });
  } catch (error: any) {
    console.error('Error in /api/video-status:', error);
    res.status(500).json({ error: error.message || 'Video status check failed' });
  }
});

app.post('/api/video-download', async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) return res.status(400).json({ error: 'operationName required' });

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;

    if (!uri) {
      return res.status(404).json({ error: 'Video URI not found or video not finished' });
    }

    const videoRes = await fetch(uri, {
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY || '' },
    });

    res.setHeader('Content-Type', 'video/mp4');
    const arrayBuffer = await videoRes.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (error: any) {
    console.error('Error in /api/video-download:', error);
    res.status(500).json({ error: error.message || 'Video download failed' });
  }
});

// Vite Middleware mounting for local development
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  // Static files in production
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
