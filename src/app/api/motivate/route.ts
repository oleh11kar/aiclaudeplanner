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
      system: `Ти майстер татусевих жартів (dad jokes), який мотивує людей через жахливі каламбури. Згенеруй ОДИН жарт українською мовою про продуктивність, задачі або конкретний контекст користувача.

Правила:
- Формат класичного dad joke: каламбур, гра слів або питання+відповідь
- Спробуй обіграти назви конкретних задач для персоналізованого жарту
- КОРОТКО: максимум 2 речення, до 30 слів
- Тільки українська мова — без винятків
- Без емодзі, без лапок, без вступу — лише сам жарт
- Жарт має непомітно підбадьорювати до дії (мотивація через сміх)
- Будь креативним і смішним`,
      messages: [{
        role: 'user',
        content: `Here is my task context:\n${context}\n\nGive me one dad joke related to these tasks.`,
      }],
    });

    const phrase = response.content[0].type === 'text'
      ? response.content[0].text.trim()
      : "Чому задача пішла до психолога? Бо мала забагато невирішених питань.";

    return NextResponse.json({ phrase });
  } catch (error) {
    console.error('motivate error:', error);
    return NextResponse.json(
      { phrase: "Сказав списку задач жарт. Він відповів, що вже зроблено... жартую, він ніколи не закінчується." },
      { status: 200 }
    );
  }
}
