import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export type TimelineStatus = 'completed' | 'current' | 'upcoming' | 'rejected';

export interface TimelineStep {
  title: string;
  description?: string;
  status: TimelineStatus;
  timestamp?: string;
}

interface StatusTimelineProps {
  steps: TimelineStep[];
}

const statusIconMap: Record<TimelineStatus, React.ReactNode> = {
  completed: <CheckCircle2 className="h-5 w-5 text-success" />,
  current: <Clock className="h-5 w-5 text-primary-500" />,
  upcoming: <Clock className="h-5 w-5 text-neutral-300" />,
  rejected: <AlertCircle className="h-5 w-5 text-error" />,
};

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ steps }) => {
  return (
    <ol className="relative space-y-4 border-l border-neutral-200 pl-6">
      {steps.map((step, index) => (
        <li key={index} className="relative">
          <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-white">
            {statusIconMap[step.status]}
          </span>
          <div className="rounded-lg bg-neutral-50 p-4">
            <h4 className="text-sm font-semibold text-neutral-800">{step.title}</h4>
            {step.description && <p className="mt-1 text-xs text-neutral-500">{step.description}</p>}
            {step.timestamp && <p className="mt-2 text-xs text-neutral-400">{step.timestamp}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
};
