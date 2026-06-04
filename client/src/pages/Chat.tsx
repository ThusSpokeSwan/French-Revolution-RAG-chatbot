import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Send, PanelLeftClose, PanelLeftOpen, Trash2, Crown } from "lucide-react";

type Message = {
    role: "user" | "assistant";
    content: string;
};

type Chat = {
    id: number;
    title: string;
    messages: Message[];
};

function Chat() {
    const [message, setMessage] = useState("");

    const [chats, setChats] = useState<Chat[]>([
        {
            id: 1,
            title: "New Chat",
            messages: [],
        },
    ]);

    const [activeChatId, setActiveChatId] =
        useState(1);

    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const chatEndRef = useRef<HTMLDivElement>(null);

    const activeChat =
        chats.find(
            (chat) => chat.id === activeChatId
        ) || chats[0];

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [activeChatId, loading]);

    const createNewChat = () => {
        const newChat = {
            id: Date.now(),
            title: "New Chat",
            messages: [],
        };

        setChats((prev) => [...prev, newChat]);

        setActiveChatId(newChat.id);
    };

    const clearChat = () => {
        setChats((prev) =>
            prev.map((chat) =>
                chat.id === activeChatId
                    ? {
                        ...chat,
                        messages: [],
                    }
                    : chat
            )
        );
    };

    const deleteChat = async (id: number) => {
        try {
            await axios.delete(
                `http://localhost:5000/chat/${id}`
            );

            const updatedChats = chats.filter(
                (chat) => chat.id !== id
            );

            if (updatedChats.length === 0) {
                const newChat = {
                    id: Date.now(),
                    title: "New Chat",
                    messages: [],
                };

                setChats([newChat]);
                setActiveChatId(newChat.id);
                return;
            }

            setChats(updatedChats);

            if (activeChatId === id) {
                setActiveChatId(
                    updatedChats[0].id
                );
            }
        } catch (error) {
            console.error(
                "Failed to delete chat",
                error
            );
        }
    };

    const sendMessage = async () => {
        if (!message.trim()) return;

        const userMessage = message;

        setChats((prev) =>
            prev.map((chat) =>
                chat.id === activeChatId
                    ? {
                        ...chat,

                        title:
                            chat.messages.length === 0
                                ? userMessage.length > 30
                                    ? userMessage.slice(0, 30) + "..."
                                    : userMessage
                                : chat.title,

                        messages: [
                            ...chat.messages,
                            {
                                role: "user",
                                content: userMessage,
                            },
                        ],
                    }
                    : chat
            )
        );

        setMessage("");

        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:5000/chat",
                {
                    message: userMessage,
                    history: activeChat.messages,
                }
            );

            setChats((prev) =>
                prev.map((chat) =>
                    chat.id === activeChatId
                        ? {
                            ...chat,
                            messages: [
                                ...chat.messages,
                                {
                                    role: "assistant",
                                    content:
                                        response.data.answer,
                                },
                            ],
                        }
                        : chat
                )
            );
        } catch (error: any) {
            console.error(error);

            setChats((prev) =>
                prev.map((chat) =>
                    chat.id === activeChatId
                        ? {
                            ...chat,
                            messages: [
                                ...chat.messages,
                                {
                                    role: "assistant",
                                    content:
                                        error?.response?.data?.error ||
                                        "Something went wrong.",
                                },
                            ],
                        }
                        : chat
                )
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex overflow-hidden bg-slate-950 text-white">
            {/* Sidebar */}
            <aside
                className={`bg-white/5 backdrop-blur-xl border-white/10 transition-all duration-300 ease-in-out flex flex-col ${sidebarOpen
                    ? "w-72 p-4"
                    : "w-0 p-0 border-r-0"
                    } overflow-hidden`}
            >
                <button
                    onClick={createNewChat}
                    className="mb-6 flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-800"
                >
                    ✨ New Conversation
                </button>

                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Recent Chats
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto">
                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            className={`flex items-center justify-between rounded-xl ${activeChatId === chat.id
                                ? "bg-gradient-to-r from-red-600 to-red-500 text-white"
                                : "hover:bg-slate-100"
                                }`}
                        >
                            <button
                                onClick={() =>
                                    setActiveChatId(chat.id)
                                }
                                className="flex-1 truncate px-3 py-3 text-left text-sm"
                            >
                                💬 {chat.title}
                            </button>

                            <button
                                onClick={() =>
                                    deleteChat(chat.id)
                                }
                                className="px-3 opacity-60 hover:opacity-100"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex flex-1 flex-col">
                {/* Top Bar */}
                <div className="flex items-center justify-between border-b border-white/10 bg-black/20 px-6 py-4 backdrop-blur-xl">

                    {/* Left */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() =>
                                setSidebarOpen(!sidebarOpen)
                            }
                            className="rounded-xl border border-white/20 p-2 hover:bg-white/10"
                        >
                            {sidebarOpen ? (
                                <PanelLeftClose size={18} />
                            ) : (
                                <PanelLeftOpen size={18} />
                            )}
                        </button>

                        <div>
                            <div className="flex items-center gap-2">
                                <Crown
                                    size={24}
                                    className="text-yellow-400"
                                />

                                <h1 className="text-2xl font-bold text-white">
                                    French Revolution AI
                                </h1>
                            </div>

                            <p className="text-xs text-slate-300">
                                Explore revolutionary leaders,
                                events, politics and battles.
                            </p>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={clearChat}
                            className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10"
                        >
                            Clear Chat
                        </button>

                        <button
                            onClick={() => {
                                localStorage.clear();
                                window.location.href = "/";
                            }}
                            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>

                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-6xl px-6 py-8">
                        {activeChat.messages.length ===
                            0 &&
                            !loading && (
                                <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                                    <h1 className="mb-3 text-6xl font-extrabold bg-gradient-to-r from-yellow-400 via-red-400 to-yellow-400 bg-clip-text text-transparent">
                                        ⚜️ French Revolution AI
                                    </h1>

                                    <p className="mb-10 text-slate-300">
                                        Explore revolutionary leaders, events,
                                        politics, battles and historical documents.
                                    </p>

                                    <div className="mb-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                                        <h2 className="mb-3 text-2xl font-bold text-white">
                                            Explore Revolutionary France
                                        </h2>

                                        <p className="text-slate-300">
                                            Ask about Robespierre, Louis XVI,
                                            Napoleon, the Bastille, the Reign of Terror,
                                            revolutionary politics and more.
                                        </p>
                                    </div>

                                    <div className="grid w-full max-w-3xl gap-4 md:grid-cols-2">
                                        {[
                                            "Who was Robespierre?",
                                            "Who was Louis XVI?",
                                            "What was the Reign of Terror?",
                                            "How did Napoleon rise to power?",
                                        ].map((question) => (
                                            <button
                                                key={question}
                                                onClick={() =>
                                                    setMessage(question)
                                                }
                                                className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left text-white backdrop-blur-xl transition hover:bg-white/10"
                                            >
                                                <div>
                                                    <div className="mb-2 text-sm text-red-400">
                                                        Suggested Question
                                                    </div>

                                                    <div className="font-medium">
                                                        {question}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                        {activeChat.messages.map(
                            (msg, index) => (
                                <div
                                    key={index}
                                    className={`mb-6 flex ${msg.role === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-3xl px-6 py-4 shadow-sm ${msg.role === "user"
                                            ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg"
                                            : "bg-white/5 border border-white/10 backdrop-blur-md text-white"
                                            }`}
                                    >
                                        <div className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-70">
                                            {msg.role === "user"
                                                ? "You"
                                                : "Assistant"}
                                        </div>

                                        <div className="prose max-w-none prose-slate">
                                            <ReactMarkdown>
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="rounded-3xl border bg-white px-6 py-4 shadow-sm">
                                    <div className="flex gap-2">
                                        <div className="h-2 w-2 animate-bounce rounded-full bg-slate-500"></div>

                                        <div
                                            className="h-2 w-2 animate-bounce rounded-full bg-slate-500"
                                            style={{
                                                animationDelay:
                                                    "0.15s",
                                            }}
                                        ></div>

                                        <div
                                            className="h-2 w-2 animate-bounce rounded-full bg-slate-500"
                                            style={{
                                                animationDelay:
                                                    "0.3s",
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={chatEndRef}></div>
                    </div>
                </div>

                {/* Input */}
                <div className="p-6">
                    <div className="mx-auto max-w-5xl">
                        <div className="flex items-end gap-3 rounded-3xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl">
                            <textarea
                                className="flex-1 resize-none border-0 bg-transparent text-white placeholder:text-slate-400 p-2 focus:outline-none"
                                rows={2}
                                placeholder="Ask about the French Revolution..."
                                value={message}
                                onChange={(e) =>
                                    setMessage(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (
                                        e.key === "Enter" &&
                                        !e.shiftKey
                                    ) {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }}
                            />

                            <button
                                onClick={sendMessage}
                                disabled={loading}
                                className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 p-4 text-white hover:bg-slate-800 disabled:opacity-50"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Chat;