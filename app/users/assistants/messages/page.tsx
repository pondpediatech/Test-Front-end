"use client";
import { useState, useEffect, useRef } from "react";
import { marked } from "marked";
import useSWR from "swr";
import { useAuth } from "../../../_providers/Auth";

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
// This is the function that manages the chat interface of assistants

export default function MessagesPage() {
  const [isCreatingAssistant, setIsCreatingAssistant] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [assistants, setAssistants] = useState("");
  const [threads, setThreads] = useState([]);
  const [selectedThreadId, setSelectedThreadId] = useState("");
  //   const [selectedAssistantId, setSelectedAssistantId] = useState("");

  const { user } = useAuth();
  const selectedAssistantId = user?.assistantId;

  const requestBody = {
    assistantId: selectedAssistantId,
    userId: user?.id,
    username: user?.username,
  };

  //   // Logic For Creating A Thread
  //   const { data: createThreadResult, mutate: createThread } = useSWR(
  //     "/api/users/assistant/message",
  //     () => createThreadFetcher("/api/users/assistant/message", requestBody),
  //     {
  //       onError: (error) => {
  //         // Handle the error
  //         console.error(error);
  //       },
  //     },
  //   );

  // Logic for creating a thread for a specific assistant and user
  //   const handleCreateThread = async () => {
  //     setIsCreatingThread(true);
  //     try {
  //       await createThread({
  //         inputAssistantId: selectedAssistantId,
  //         userId: user?.id,
  //       });
  //     } catch (error) {
  //       // Handle the error
  //     }
  //     setIsCreatingThread(false);
  //   };

  //   Fetching all threads for a specific assistant
  const { data: threadsData, mutate: mutateThreads } = useSWR(
    `/api/users/assistant/thread/${selectedAssistantId}`,
  );

  useEffect(() => {
    if (threadsData) {
      setThreads(threadsData);
    }
  }, [threadsData]);

  const handleThreadChange = (event) => {
    const value = event.target.value;

    if (value === "new-thread") {
      //   handleCreateThread();
      setSelectedThreadId("");
    } else {
      setSelectedThreadId(value);
    }
  };

  const { data: createMessageResult, error } = useSWR(
    `/api/users/assistant/message/thread_veci6NWD4gckMu6BucGCQQxl`, // REMEMBER TO CHANGE THIS!
    (url) => createMessageFetcher(url, user?.assistantId, "something random")
   )

  console.log(createMessageResult);

  //   // Logic for fetching messages
  //   const [{ data: messageRecords, fetching, error }] = useFindMany(api.message, {
  //     live: true, // this allows the frontend to listen to when new messages are created and render dynamically
  //     filter: { thread: { equals: selectedThreadId } },
  //   });

  //   const messagesEndRef = useRef(null);

  //   useEffect(() => {
  //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  //   }, [messageRecords]);

  //   const submitChat = async (e) => {
  //     e.preventDefault();
  //     if (!newMessage.trim()) return;

  //     await globalCreateMessage({
  //       threadId: selectedThreadId,
  //       userQuestion: newMessage,
  //       userId: user.id,
  //     });
  //     setNewMessage("");
  //   };

  //   if (fetching) return <div>Loading messages...</div>;
  //   if (error) return <div>Error fetching messages: {error.message}</div>;

  //   const extractMessageText = (contentArray) => {
  //     if (
  //       !contentArray ||
  //       !Array.isArray(contentArray) ||
  //       contentArray.length === 0
  //     )
  //       return "";
  //     const textContent = contentArray.find((c) => c.type === "text");
  //     return textContent?.text?.value || "No message content";
  //   };

  //   // Structure of how user + assistant messages are rendered
  //   const MessagePair = ({ userMessage, assistantMessage }) => {
  //     const renderMarkdown = (markdownText) => {
  //       return marked(markdownText, { sanitize: true }); // sanitize option is for basic XSS protection
  //     };
  //     return (
  //       <div className="message-pair">
  //         <div className="user-message">
  //           <div className="message-content">{userMessage}</div>
  //         </div>
  //         <div className="assistant-message">
  //           <div
  //             className="message-content"
  //             dangerouslySetInnerHTML={{
  //               __html: renderMarkdown(assistantMessage),
  //             }}
  //           >
  //             {/* assistantMessage is now rendered as HTML */}
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   };

  //   // Rendering the experience
  //   <div className="chat-container">
  //     {/* Chat messages section */}
  //     <div className="chat-messages">
  //       {selectedThreadId && messageRecords && messageRecords.length > 0 ? (
  //         <div className="messages-container">
  //           {messageRecords.map((message) => (
  //             <MessagePair
  //               key={message.id}
  //               userMessage={extractMessageText(message.userMessage.content)}
  //               assistantMessage={extractMessageText(
  //                 message.assistantMessage.content
  //               )}
  //             />
  //           ))}
  //           <div ref={messagesEndRef} />
  //         </div>
  //       ) : (
  //         <p>Select a thread to view messages.</p>
  //       )}
  //     </div>

  //     {/* The footer contains the input/button, and drop-downs */}
  //     <div className="chat-footer">
  //       {/* Input form */}
  //       <form onSubmit={submitChat} className="message-form">
  //         <input
  //           type="text"
  //           placeholder="Type your message here..."
  //           value={newMessage}
  //           onChange={(e) => setNewMessage(e.target.value)}
  //           className="message-input"
  //           disabled={isSending || !selectedThreadId}
  //         />
  //         <button
  //           type="submit"
  //           className="send-button"
  //           disabled={isSending || !selectedThreadId}
  //         >
  //           {isSending ? <div className="spinner"></div> : "Send"}
  //         </button>
  //       </form>

  //       {sendMessageError && (
  //         <p>Error sending message: {sendMessageError.message}</p>
  //       )}

  //       {/* Drop downs */}
  //       <div className="dropdown-controls">
  //         {assistantsFetching ? (
  //           <p>Loading assistants...</p>
  //         ) : assistantsError ? (
  //           <p>Error fetching assistants: {assistantsError.message}</p>
  //         ) : (
  //           <select
  //             value={selectedAssistantId}
  //             onChange={handleAssistantChange}
  //             className="form-element"
  //           >
  //             <option value="">Select an Assistant</option>
  //             <option value="new-assistant">+ Create new assistant</option>{" "}
  //             {/* Add this line */}
  //             {assistants.map((assistant) => (
  //               <option key={assistant.id} value={assistant.id}>
  //                 {`${assistant.name}`}
  //               </option>
  //             ))}
  //           </select>
  //         )}

  //         {threadsFetching ? (
  //           <p>Loading threads...</p>
  //         ) : threadsError ? (
  //           <p>Error fetching threads: {threadsError.message}</p>
  //         ) : (
  //           <select
  //             value={selectedThreadId}
  //             onChange={handleThreadChange}
  //             disabled={!selectedAssistantId}
  //             className="form-element"
  //           >
  //             <option value="">Select a thread</option>
  //             <option value="new-thread">+ Create new thread</option>
  //             {threads.map((thread) => (
  //               <option key={thread.id} value={thread.id}>
  //                 {`${
  //                   thread.description
  //                     ? thread.description.length > 35
  //                       ? thread.description.slice(0, 35) + "..."
  //                       : thread.description
  //                     : "New blank thread"
  //                 }`}
  //               </option>
  //             ))}
  //           </select>
  //         )}
  //       </div>
  //     </div>
  //   </div>
}
