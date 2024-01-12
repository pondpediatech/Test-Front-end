"use client";

import useSWR from "swr";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DropdownDefault from "@/components/Dropdowns/DropdownThreadEdit";
import { marked } from "marked";
import { useAuth } from "../../../_providers/Auth";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  fetchThreads,
  createMessageFetcher,
  createThreadFetcher,
} from "./fetcher";

interface Message {
  role: string;
  content: string;
}

const Messages: React.FC = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [fetchingMessage, setFetchingMessage] = useState(false);

  const [threadList, setThreadList] = useState<Array<{ threadId: string }>>([]);
  const [selectedThreadId, setSelectedThreadId] = useState("");
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [isDeletingThread, setIsDeletingThread] = useState(false);

  const { user } = useAuth();
  const selectedAssistantId = user?.assistantId;
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const renderMarkdown = (markdownText) => {
    return marked(markdownText); // sanitize option is for basic XSS protection
  };

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

      // Parse the response data
      const newThread = await response.json();

      console.log(newThread);

      // Add the new thread to threadsData
      // Assuming threadsData is an array
      setThreadList([...threadList, { threadId: newThread.threadId }]);

      // Continue with the rest of the logic
    } catch (error) {
      // Handle the error
      console.error(error);
    } finally {
      setIsCreatingThread(false);
    }
  }, [threadList, selectedAssistantId, user?.id, user?.username]);

  const handleChangeThread = async (event) => {
    const value = event.target.getAttribute("thread-id");

    console.log(value);

    if (value === "new-thread") {
      await handleCreateThread();
      setSelectedThreadId("");
    } else {
      setSelectedThreadId(value);
      try {
        setFetchingMessage(true);
        const response = await fetch(`/api/users/assistant/message/${value}`);
        const messageRecords = await response.json();
        if (messageRecords.success) {
          setMessages(messageRecords.conversation);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setFetchingMessage(false);
      }
    }
  };

  const handleDeleteThread = async () => {
    setIsDeletingThread(true);
    try {
      const url = `/api/users/assistant/message/${selectedThreadId}`;
      const response = await fetch(url, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Deleted successfully");
    } catch (error) {
      console.error(`Error deleting thread: ${error.message}`);
    } finally {
      setIsDeletingThread(false);
    }
  };

  const handleMessageSubmit = async (e: any) => {
    e.preventDefault();
    setSendingMessage(true);
    if (!message.trim()) return;

    // Add the user's message to the messages array immediately
    const userMessage = {
      content: message,
      role: "user",
      id: Date.now() + messages.length, // Unique key
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setMessage("");

    try {
      const url = `/api/users/assistant/message/${selectedThreadId}`;
      const createMessageResult = await createMessageFetcher(
        url,
        user?.assistantId,
        message,
      );

      // When you receive the assistant's response, add it to the messages array
      const assistantMessage = {
        content: createMessageResult.data.lastAssistantMessage,
        role: "assistant",
        id: Date.now() + messages.length, // Unique key
      };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setSendingMessage(false);
    }
  };

  // Hook for fetching threads
  const { data: threadsData, error: threadsError } = useSWR(
    `/api/users/assistant/thread/${selectedAssistantId}`,
    fetchThreads,
  );

  useEffect(() => {
    if (threadsData) {
      const threadList = threadsData.threads.docs.map((record, index) => ({
        threadId: record.threadId, // replace this with actual thread ID if available
      }));
      setThreadList(threadList);
    }
  }, [threadsData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [fetchingMessage]);

  return (
    <>
      <Breadcrumb pageName="Messages" />

      <div className="h-[calc(100vh-186px)] overflow-hidden sm:h-[calc(100vh-174px)]">
        <div className="h-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:flex">
          <div className="hidden h-full flex-col xl:flex xl:w-1/4">
            {/* <!-- ====== Chat List Start --> */}
            <div className="sticky border-b border-stroke px-6 py-5.5 dark:border-strokedark">
              <button
                onClick={handleChangeThread}
                thread-id={"new-thread"}
                className="flex w-full rounded-md bg-primary px-5.5 py-2.5 font-medium text-white"
              >
                Percakapan Baru
              </button>
            </div>
            <div className="flex max-h-full flex-col overflow-auto">
              <div className="no-scrollbar max-h-full overflow-auto py-6">
                {/* <!-- Chat List Item --> */}
                <ul className="flex flex-col gap-2">
                  {threadList.map((object, item) => {
                    return (
                      <li
                        key={item}
                        thread-id={object.threadId}
                        onClick={handleChangeThread}
                        className="relative flex cursor-pointer items-center gap-2.5 px-5 py-3.5 font-medium duration-300 ease-linear before:absolute before:left-0 before:h-0 before:w-1 before:bg-primary before:duration-300 before:ease-linear hover:bg-primary/5 hover:text-primary hover:before:h-full"
                      >
                        <svg
                          className="fill-current"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          style={{ pointerEvents: "none" }}
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.46875 10.5625H6.78125C6.40625 10.5625 6.0625 10.875 6.0625 11.2812C6.0625 11.6875 6.375 12 6.78125 12H8.46875C8.84375 12 9.1875 11.6875 9.1875 11.2812C9.1875 10.875 8.875 10.5625 8.46875 10.5625Z"
                            fill=""
                          />
                          <path
                            d="M13.1875 10.5625H11.5C11.125 10.5625 10.7812 10.875 10.7812 11.2812C10.7812 11.6875 11.0937 12 11.5 12H13.1875C13.5625 12 13.9062 11.6875 13.9062 11.2812C13.9062 10.875 13.5938 10.5625 13.1875 10.5625Z"
                            fill=""
                          />
                          <path
                            d="M17.8125 8.84375V5.15625C18.125 5.09375 18.3438 4.8125 18.3438 4.46875C18.3438 4.09375 18.0312 3.75 17.625 3.75H16.5625C16.1875 3.75 15.8438 4.0625 15.8438 4.46875C15.8438 4.78125 16.0625 5.0625 16.375 5.15625V8.6875H16C15.625 7.34375 14.375 6.3125 12.9062 6.3125H7.125C5.65625 6.3125 4.40625 7.3125 4.03125 8.6875H3.0625C1.6875 8.6875 0.53125 9.8125 0.53125 11.2188V11.3438C0.53125 12.7188 1.65625 13.875 3.0625 13.875H4.03125C4.40625 15.2188 5.65625 16.25 7.125 16.25H12.9375C14.4062 16.25 15.6562 15.25 16.0312 13.875H16.9375C18.3125 13.875 19.4688 12.75 19.4688 11.3438V11.2188C19.4688 10.125 18.75 9.1875 17.8125 8.84375ZM1.96875 11.3438V11.2188C1.96875 10.5938 2.46875 10.0938 3.09375 10.0938H3.9375V12.4375H3.0625C2.4375 12.4375 1.96875 11.9375 1.96875 11.3438ZM12.9375 14.8125H7.125C6.125 14.8125 5.3125 14 5.3125 13V9.53125C5.3125 8.53125 6.125 7.71875 7.125 7.71875H12.9375C13.9375 7.71875 14.75 8.53125 14.75 9.53125V13C14.7188 14 13.9062 14.8125 12.9375 14.8125ZM18.0625 11.3438C18.0625 11.9688 17.5625 12.4688 16.9375 12.4688H16.125V10.125H16.9375C17.5625 10.125 18.0625 10.625 18.0625 11.25V11.3438Z"
                            fill=""
                          />
                        </svg>
                        <p
                          className="text-sm"
                          style={{ pointerEvents: "none" }}
                        >{`Percakapan ${item + 1}`}</p>
                      </li>
                    );
                  })}
                </ul>
                {/* <!-- Chat List Item --> */}
              </div>
            </div>
            {/* <!-- ====== Chat List End --> */}
          </div>
          <div className="flex h-full flex-col border-l border-stroke dark:border-strokedark xl:w-3/4">
            {/* <!-- ====== Chat Box Start --> */}
            <div className="sticky flex items-center justify-between border-b border-stroke px-6 py-4.5 dark:border-strokedark">
              <div className="flex items-center">
                <div className="mr-4.5 h-13 w-full max-w-13 overflow-hidden rounded-full">
                  <Image
                    src={"/images/logo/logo-1.png"}
                    alt="avatar"
                    className="h-full w-full object-cover object-center"
                    width={52}
                    height={52}
                  />
                </div>
                <div>
                  <h5 className="font-medium text-black dark:text-white">
                    Asisten Ponder
                  </h5>
                  <p className="text-sm">
                    Status: {sendingMessage ? "Mengetik..." : "Aktif"}
                  </p>
                </div>
              </div>
              {selectedThreadId && (
                <div>
                  <button onClick={handleDeleteThread}>
                    <svg
                      className="fill-danger"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.753 2.47499H11.5874V1.99687C11.5874 1.15312 10.9124 0.478119 10.0687 0.478119H7.90303C7.05928 0.478119 6.38428 1.15312 6.38428 1.99687V2.47499H4.21865C3.40303 2.47499 2.72803 3.14999 2.72803 3.96562V4.80937C2.72803 5.42812 3.09365 5.93437 3.62803 6.15937L4.07803 15.8906C4.13428 16.8187 4.86553 17.5219 5.79365 17.5219H12.1218C13.0499 17.5219 13.8093 16.7906 13.8374 15.8906L14.3437 6.13124C14.878 5.90624 15.2437 5.37187 15.2437 4.78124V3.93749C15.2437 3.14999 14.5687 2.47499 13.753 2.47499ZM7.67803 1.99687C7.67803 1.85624 7.79053 1.74374 7.93115 1.74374H10.0968C10.2374 1.74374 10.3499 1.85624 10.3499 1.99687V2.47499H7.70615V1.99687H7.67803ZM4.02178 3.96562C4.02178 3.85312 4.10615 3.74062 4.24678 3.74062H13.753C13.8655 3.74062 13.978 3.82499 13.978 3.96562V4.80937C13.978 4.92187 13.8937 5.03437 13.753 5.03437H4.24678C4.13428 5.03437 4.02178 4.94999 4.02178 4.80937V3.96562ZM12.1499 16.2562H5.8499C5.59678 16.2562 5.3999 16.0594 5.3999 15.8344L4.9499 6.29999H13.078L12.628 15.8344C12.5999 16.0594 12.403 16.2562 12.1499 16.2562Z"
                        fill=""
                      />
                      <path
                        d="M8.9999 8.74686C8.6624 8.74686 8.35303 9.02811 8.35303 9.39373V13.7531C8.35303 14.0906 8.63428 14.4 8.9999 14.4C9.3374 14.4 9.64678 14.1187 9.64678 13.7531V9.36561C9.64678 9.02811 9.3374 8.74686 8.9999 8.74686Z"
                        fill=""
                      />
                      <path
                        d="M11.6157 9.28124C11.2782 9.25311 10.9688 9.53436 10.9407 9.87186L10.772 13.1062C10.7438 13.4437 11.0251 13.7531 11.3626 13.7812H11.3907C11.7282 13.7812 12.0095 13.5281 12.0095 13.1906L12.1782 9.95624C12.2345 9.59061 11.9532 9.30936 11.6157 9.28124Z"
                        fill=""
                      />
                      <path
                        d="M6.35624 9.28124C6.01874 9.30936 5.73749 9.59061 5.76561 9.95624L5.96249 13.2187C5.99061 13.5562 6.27186 13.8094 6.58124 13.8094H6.60936C6.94686 13.7812 7.22811 13.5 7.19999 13.1344L7.03124 9.87186C7.00311 9.53436 6.69374 9.25311 6.35624 9.28124Z"
                        fill=""
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            <div
              className="no-scrollbar max-h-full space-y-3.5 overflow-auto px-6 py-7.5"
              style={{ height: "100vh" }}
            >
              {fetchingMessage ? (
                <div>Loading...</div> // Or your custom loading component
              ) : messages.length > 0 ? (
                <>
                  {messages.map((message, index) =>
                    message.role === "user" ? (
                      <div key={index} className="ml-auto max-w-125">
                        <div className="mb-5 rounded-2xl rounded-br-none bg-primary px-5 py-3">
                          <p className="text-white">{message.content}</p>
                        </div>
                      </div>
                    ) : (
                      <div key={index} className="max-w-125">
                        <div className="mb-5 rounded-2xl rounded-tl-none bg-gray px-5 py-3 dark:bg-boxdark-2">
                          <p
                            dangerouslySetInnerHTML={{
                              __html: renderMarkdown(message.content),
                            }}
                          ></p>
                        </div>
                      </div>
                    ),
                  )}
                </>
              ) : (
                <div>No messages available</div>
              )}
            </div>
            <div className="sticky bottom-0 border-t border-stroke bg-white px-6 py-5 dark:border-strokedark dark:bg-boxdark">
              <form
                onSubmit={handleMessageSubmit}
                className="flex items-center justify-between space-x-4.5"
              >
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Type something here"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={sendingMessage || !selectedThreadId}
                    className="h-13 w-full rounded-md border border-stroke bg-gray pl-5 pr-19 text-black placeholder-body outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2 dark:text-white"
                  />
                </div>
                <button
                  disabled={!message.trim()}
                  className="flex h-13 w-full max-w-13 items-center justify-center rounded-md bg-primary text-white hover:bg-opacity-90"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22 2L11 13"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 2L15 22L11 13L2 9L22 2Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </form>
            </div>
            {/* <!-- ====== Chat Box End --> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;
