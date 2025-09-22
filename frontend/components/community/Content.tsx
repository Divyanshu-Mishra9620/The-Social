import React from "react";

const ChatMessage = ({
  avatar,
  user,
  text,
  isMe,
}: {
  avatar: string;
  user: string;
  text: string;
  isMe: boolean;
}) => {
  const alignment = isMe ? "justify-end" : "justify-start";
  const bubbleColor = isMe
    ? "bg-blue-600 text-white rounded-br-none"
    : "bg-gray-200 dark:bg-neutral-800 rounded-bl-none";

  return (
    <div className={`flex items-end gap-3 ${alignment}`}>
      {!isMe && (
        <img
          src={`https://placehold.co/40x40/71717A/FFFFFF?text=${avatar}`}
          alt="Avatar"
          className="w-8 h-8 rounded-full"
        />
      )}
      <div
        className={`px-4 py-3 rounded-2xl max-w-xs md:max-w-md ${bubbleColor}`}
      >
        {!isMe && <p className="text-sm font-semibold mb-1">{user}</p>}
        <p>{text}</p>
      </div>
      {isMe && (
        <img
          src={`https://placehold.co/40x40/3B82F6/FFFFFF?text=${avatar}`}
          alt="My Avatar"
          className="w-8 h-8 rounded-full"
        />
      )}
    </div>
  );
};

export default function Content() {
  const messages = [
    {
      id: 1,
      user: "Sarah",
      avatar: "S",
      text: "Hey, did you see the project update?",
      isMe: false,
    },
    {
      id: 2,
      user: "You",
      avatar: "Y",
      text: "I did! It looks great. The new dashboard is super clean.",
      isMe: true,
    },
    {
      id: 3,
      user: "You",
      avatar: "Y",
      text: "How long did that take you?",
      isMe: true,
    },
    {
      id: 4,
      user: "Sarah",
      avatar: "S",
      text: "A couple of days, mostly tweaking the UI. Glad you like it!",
      isMe: false,
    },
    {
      id: 5,
      user: "Mark",
      avatar: "M",
      text: "Joining in, the performance seems a lot better too. Good job team!",
      isMe: false,
    },
  ];

  return (
    <div className="h-full w-full rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-6 dark:border-neutral-700 dark:bg-neutral-900 flex flex-col">
      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-4">
          General Chat
        </h1>
        {messages.map((msg) => (
          <ChatMessage key={msg.id} {...msg} />
        ))}
      </div>
      <div className="mt-4 p-4 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 w-full rounded-full border border-neutral-300 bg-transparent px-4 py-2 text-neutral-900 dark:border-neutral-600 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
