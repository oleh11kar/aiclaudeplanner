import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: Request) {
  try {
    const { tasks } = await request.json() as {
      tasks: { title: string; priority: string | null; status: string }[];
    };

    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'done').length;
    const remaining = total - done;
    const topTasks = tasks
      .filter(t => t.status !== 'done' && t.priority === 'top')
      .map(t => t.title)
      .slice(0, 3);

    const context = [
      `Total tasks today: ${total}`,
      `Completed: ${done}`,
      `Remaining: ${remaining}`,
      topTasks.length ? `Top priority tasks: ${topTasks.join(', ')}` : '',
    ].filter(Boolean).join('\n');

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 120,
      system: `You are a concise motivational coach. Generate ONE short motivational phrase (1-2 sentences max, under 25 words) to help the user stay focused and energized.

Rules:
- Be specific, direct, and energizing — not generic
- Match the language of the task titles (Ukrainian or English)
- If tasks are in Ukrainian → respond in Ukrainian
- If tasks are in English → respond in English
- No emoji, no quotes, no preamble — just the phrase itself
- Focus on action, progress, and capability`,
      messages: [{
        role: 'user',
        content: `Here is my task context:\n${context}\n\nGive me one short motivational phrase.`,
      }],
    });

    const phrase = response.content[0].type === 'text'
      ? response.content[0].text.trim()
      : 'You have everything you need to crush today.';

    return NextResponse.json({ phrase });
  } catch (error) {
    console.error('motivate error:', error);
    return NextResponse.json(
      { phrase: 'Focus on one task at a time. Progress beats perfection.' },
      { status: 200 }
    );
  }
}
