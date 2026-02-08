import { Book } from '../types';

interface Recommendation {
  title: string;
  description: string;
  icon: 'brain' | 'wand' | 'book' | 'lightbulb';
  color: string;
  accentColor: string;
}

export async function generateAIRecommendations(
  books: Book[],
  apiKey: string
): Promise<Recommendation[]> {
  if (books.length === 0) {
    return [];
  }

  // Trim whitespace and validate API key format
  const trimmedKey = apiKey?.trim() || '';
  
  // Debug: Check what we're receiving
  console.log('API Key check:', {
    original: apiKey,
    trimmed: trimmedKey,
    length: trimmedKey.length,
    firstChars: trimmedKey.substring(0, 5),
    charCodes: Array.from(trimmedKey.substring(0, 5)).map(c => c.charCodeAt(0))
  });
  
  if (!trimmedKey) {
    throw new Error('API key cannot be empty. Please add your Google Gemini API key in settings.');
  }

  // Google Gemini keys start with "AIza"
  if (!trimmedKey.startsWith('AIza')) {
    throw new Error(`Invalid API key format. Key starts with "${trimmedKey.substring(0, 5)}..." but should start with "AIza"`);
  }

  const bookTitles = books.map(b => b.title).join(', ');

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-exp:generateContent?key=${trimmedKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a mystical AI oracle helping students discover new areas of knowledge. Based on the subjects they're studying, suggest 6 related topics they should explore.

Current spell books: ${bookTitles}

Format your response as a JSON array with this exact structure:
[
  {
    "title": "Topic Name",
    "description": "A compelling 1-2 sentence description in a mystical, magical tone",
    "icon": "brain" | "wand" | "book" | "lightbulb"
  }
]

Make the recommendations:
- Directly related to their current studies
- Progressively more advanced or complementary
- Varied in nature (some practical, some theoretical)
- Written in an enchanting, wizard-like tone
- Each description should be 15-25 words

Only respond with the JSON array, nothing else.`
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('Invalid API key. Please check your Google Gemini API key in settings.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      } else {
        throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error('The AI oracle provided no response. Please try again.');
    }

    // Extract JSON from the response (Gemini sometimes wraps it in markdown)
    let jsonContent = content.trim();
    if (jsonContent.startsWith('```json')) {
      jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    } else if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/```\n?/g, '').trim();
    }

    // Parse the JSON response
    const aiRecommendations = JSON.parse(jsonContent);

    // Color palettes for recommendations
    const colorPalettes = [
      { color: '#1e3a8a', accentColor: '#60a5fa' },
      { color: '#78350f', accentColor: '#fbbf24' },
      { color: '#1e1b4b', accentColor: '#818cf8' },
      { color: '#4c1d95', accentColor: '#c4b5fd' },
      { color: '#831843', accentColor: '#f472b6' },
      { color: '#134e4a', accentColor: '#5eead4' },
    ];

    // Map AI recommendations to our format with colors
    return aiRecommendations.map((rec: any, index: number) => ({
      title: rec.title,
      description: rec.description,
      icon: rec.icon || 'brain',
      ...colorPalettes[index % colorPalettes.length],
    }));

  } catch (error) {
    console.error('AI recommendation error:', error);
    throw error;
  }
}
