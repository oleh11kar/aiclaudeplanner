import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { Task } from '@/lib/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const LANG_NAMES: Record<string, string> = {
  'uk-UA': 'Ukrainian',
  'ru-RU': 'Russian',
  'en-US': 'English',
};

function buildSystemPrompt(lang: string) {
  const date = new Date().toISOString().split('T')[0];
  const langName = LANG_NAMES[lang] || 'the same language the user spoke';
  return `Today's date: ${date}.

You are a task extraction assistant. The user has provided a voice or text brain dump in ${langName}.
Extract every task mentioned and return a JSON array.

For each task return:
{
  "title": string,
  "priority": "top" | "important" | "nice" | null,
  "durationMin": number | null,
  "deadline": "YYYY-MM-DD" | null,
  "needsClarification": {
    "priority"?: "question string",
    "duration"?: "question string",
    "deadline"?: "question string"
  }
}

Rules:
- Set a field to null only if the information is genuinely absent or ambiguous.
- Write ALL text fields (title, needsClarification questions) in ${langName}.
- Add a needsClarification entry for each null field with a short, friendly question.
- Resolve relative dates ("tomorrow", "завтра", "в пятницу", "next Monday", "у п'ятницю") using today's date.
- Return only the JSON array, no other text.`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    let userContent: string;
    const lang: string = body.lang || 'uk-UA';

    if (body.text) {
      userContent = body.text;
    } else if (body.audio) {
      userContent = '[Audio brain dump received — please extract tasks from this audio recording]';
    } else {
      return NextResponse.json({ error: 'No text or audio provided' }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2048,
      system: buildSystemPrompt(lang),
      messages: [{ role: 'user', content: userContent }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';

    // Parse JSON array from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    const rawTasks = JSON.parse(jsonMatch[0]);

    const tasks: Task[] = rawTasks.map((t: Omit<Task, 'id' | 'status' | 'completedAt' | 'createdAt'>) => ({
      id: crypto.randomUUID(),
      title: t.title,
      priority: t.priority ?? null,
      durationMin: t.durationMin ?? null,
      deadline: t.deadline ?? null,
      status: 'inbox' as const,
      completedAt: null,
      createdAt: new Date().toISOString(),
      needsClarification: t.needsClarification || {},
    }));

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('process-capture error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
