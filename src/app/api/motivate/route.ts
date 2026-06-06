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
      system: `You are a dad joke master who secretly motivates people through terrible, groan-worthy puns. Generate ONE dad joke related to productivity, tasks, or the user's specific work context.

Rules:
- Must be a classic dad joke format: a pun, wordplay, or a setup+punchline
- Try to reference the actual task titles or context if possible for a personalized pun
- Keep it SHORT: max 2 sentences, under 30 words
- Match the language of the task titles:
  - If tasks are in Ukrainian → make the joke in Ukrainian (Ukrainian puns!)
  - If tasks are in English → make the joke in English
- No emoji, no quotes, no preamble — just the joke itself
- The joke should still subtly encourage action (motivating through laughter)
- Be creative, punny, and make people groan AND smile`,
      messages: [{
        role: 'user',
        content: `Here is my task context:\n${context}\n\nGive me one dad joke related to these tasks.`,
      }],
    });

    const phrase = response.content[0].type === 'text'
      ? response.content[0].text.trim()
      : "Why did the task go to therapy? It had too many unresolved issues.";

    return NextResponse.json({ phrase });
  } catch (error) {
    console.error('motivate error:', error);
    return NextResponse.json(
      { phrase: "I told my to-do list a joke. It said it was already done... just kidding, it never ends." },
      { status: 200 }
    );
  }
}
