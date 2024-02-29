import React from 'react';

import type { MessageHistory } from '@/types';
import { ChatRole } from '@/types';

type ChatHistoryProps = {
  messages: MessageHistory[];
};

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
  const renderMessage = (message: MessageHistory, index: number) => {
    const { role, content } = message;
    const isSystem = role === ChatRole.system;
    const isUser = role === ChatRole.user;
    const isAssistant = role === ChatRole.assistant;
    const textColor = isSystem
      ? 'text-red-600'
      : isUser
      ? 'text-blue-300 talking-user'
      : isAssistant
      ? 'text-black talking-mivoz'
      : 'text-gray-900 talking-mivoz';

    return (
      <div key={index} className={`w-full rounded-lg`}>
        <div className={`text-sm ${textColor} py-1`}>{content}</div>
      </div>
    );
  };

  return (
    <div className="chathistory mt-5 w-full overflow-y-auto px-4">
      {messages.filter((s) => s.role !== ChatRole.system).map(renderMessage)}
    </div>
  );
};

export default ChatHistory;
