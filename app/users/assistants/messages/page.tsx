"use client";
import useSWR from "swr";
import { useState, useEffect, useRef, useCallback } from "react";
import { marked } from "marked";
import { useAuth } from "../../../_providers/Auth";
import type { Thread } from "../../../payload-types";

import "./page.css";

const createThreadFetcher = (url: string, requestBody: any) => {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  }).then((res) => res.json());
};

const createMessageFetcher = async (url, assistantId, userQuestion) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userQuestion,
      assistantId,
    }),
  });

  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }

  return response.json();
};

const fetchThreads = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

export default function MessagesPage() {
  const [newMessage, setNewMessage] = useState("");
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState("");

  const { user } = useAuth();
  const selectedAssistantId = user?.assistantId;

  const handleCreateThread = useCallback(async () => {
    const requestBody = {
      assistantId: selectedAssistantId,
      userId: user?.id,
      username: user?.username,
    };

    setIsCreatingThread(true);
    try {
      const response = await fetch("/api/users/assistant/message", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Handle the response
      if (!response.ok) {
        throw new Error("Failed to create thread");
      }

      // Continue with the rest of the logic
    } catch (error) {
      // Handle the error
      console.error(error);
    } finally {
      setIsCreatingThread(false);
    }
  }, [selectedAssistantId, user?.id, user?.username]);

  const { data: threadsData, error: threadsError } = useSWR(
    `/api/users/assistant/thread/${selectedAssistantId}`,
    fetchThreads,
  );

  const handleThreadChange = async (event) => {
    const value = event.target.value;

    if (value === "new-thread") {
      await handleCreateThread();
      setSelectedThreadId("");
    } else {
      setSelectedThreadId(value);
    }
  };

  // Hook for fetching messages
  const {
    data: messageRecords,
    mutate,
    error: sendMessageError,
  } = useSWR(
    selectedThreadId && `/api/users/assistant/message/${selectedThreadId}`,
    (url) => fetch(url).then((res) => res.json()),
  );

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (threadsData) {
      setThreads(threadsData.threads.docs);
    }
  }, [threadsData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageRecords]);

  useEffect(() => {
    if (!isSending) {
      mutate();
    }
  }, [isSending, mutate]);

  const handleMessageSubmit = async (e: any) => {
    e.preventDefault();
    setIsSending(true);
    if (!newMessage.trim()) return;

    try {
      const url = `/api/users/assistant/message/${selectedThreadId}`;
      const createMessageResult = await createMessageFetcher(
        url,
        user?.assistantId,
        newMessage,
      );
      // Handle createMessageResult as needed
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }

    setNewMessage("");
  };

  if (!threads) return <div>Loading...</div>;
  if (sendMessageError)
    return <div>Error fetching messages: {sendMessageError.message}</div>;

  // Structure of how user + assistant messages are rendered
  const MessagePair = ({ userMessage, assistantMessage }) => {
    const renderMarkdown = (markdownText) => {
      return marked(markdownText); // sanitize option is for basic XSS protection
    };

    return (
      <div className="message-pair">
        {userMessage && (
          <div className="user-message">
            <div className="message-content">{userMessage}</div>
          </div>
        )}
        {assistantMessage && (
          <div className="assistant-message">
            <div
              className="message-content"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(assistantMessage),
              }}
            />
          </div>
        )}
      </div>
    );
  };

  // Rendering the experience
  return (
    <div className="chat-container grid grid-cols-6 gap-8">
      <div className="chat-messages">
        {messageRecords ? (
          <div className="messages-container">
            {messageRecords.conversation.map((message, index) => (
              <MessagePair
                key={index}
                userMessage={message.role === "user" ? message.content : ""}
                assistantMessage={
                  message.role === "assistant" ? message.content : ""
                }
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div>No Conversation Availables</div>
        )}

        {/* The footer contains the input/button, and drop-downs */}
        <div className="chat-footer">
          {/* Input form */}
          <form onSubmit={handleMessageSubmit} className="message-form">
            <input
              type="text"
              placeholder="Type your message here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="message-input"
              disabled={isSending || !selectedThreadId}
            />
            <button
              type="submit"
              className="send-button"
              disabled={isSending || !selectedThreadId}
            >
              {isSending ? <div className="spinner"></div> : "Send"}
            </button>
          </form>

          {sendMessageError && (
            <p>Error sending message: {sendMessageError.message}</p>
          )}

          <select
            value={selectedThreadId}
            onChange={handleThreadChange}
            disabled={!selectedAssistantId}
            className="form-element"
          >
            <option value="">Select a thread</option>
            <option value="new-thread">+ Create new thread</option>
            {threads.map((thread, index) => (
              <option key={index} value={thread.threadId}>
                {`${
                  thread.threadId
                    ? thread.threadId.length > 35
                      ? thread.threadId.slice(0, 35) + "..."
                      : thread.threadId
                    : "New blank thread"
                }`}
              </option>
            ))}
          </select>
        </div>
      </div>
      ;
    </div>
  );
}
