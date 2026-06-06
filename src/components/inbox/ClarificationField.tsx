'use client';
import { useState } from 'react';
import { Task, Priority } from '@/lib/types';
// duration clarification is intentionally skipped

type Props = {
  task: Task;
  onUpdate: (patch: Partial<Task>) => void;
};

export default function ClarificationField({ task, onUpdate }: Props) {
  const { needsClarification } = task;
  const [deadlineInput, setDeadlineInput] = useState('');

  // Show one at a time: priority → duration → deadline
  if (needsClarification.priority) {
    return (
      <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
        <p className="text-sm text-amber-800 font-medium mb-2">{needsClarification.priority}</p>
        <div className="flex gap-2 flex-wrap">
          {(['top', 'important', 'nice'] as Priority[]).map(p => (
            <button key={p} onClick={() => {
              const nc = { ...needsClarification };
              delete nc.priority;
              onUpdate({ priority: p, needsClarification: nc });
            }}
              className="px-3 py-2 rounded-lg text-sm font-medium min-h-[44px] border transition-colors
                bg-white border-gray-300 text-gray-700 active:bg-gray-100">
              {p === 'top' ? '🔴 Top Priority' : p === 'important' ? '🟠 Important' : '⚪ Nice to do'}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (needsClarification.deadline) {
    return (
      <div className="mt-3 p-3 bg-green-50 rounded-xl border border-green-200">
        <p className="text-sm text-green-800 font-medium mb-2">{needsClarification.deadline}</p>
        <div className="flex gap-2">
          <input type="date"
            value={deadlineInput} onChange={e => setDeadlineInput(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-base min-h-[44px]"
            style={{ fontSize: '16px' }}
          />
          <button onClick={() => {
            if (!deadlineInput) return;
            const nc = { ...needsClarification };
            delete nc.deadline;
            onUpdate({ deadline: deadlineInput, needsClarification: nc });
          }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold min-h-[44px]">
            OK
          </button>
        </div>
      </div>
    );
  }

  return null;
}
