import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from "react-syntax-highlighter/src/styles/prism";
import { throttle } from "lodash/function";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSelector } from "react-redux";


const ChatDialog = () => {
    const [messages, setMessages] = useState([{ role: 'assistant', content: '很高兴认识你，需要帮助吗？' }]);
    const [input, setInput] = useState('');

    const [canScroll, setCanScroll] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    const currentModel = useSelector((state) => state.myApp.model);

    useEffect(() => {
        setMessages([{ role: 'assistant', content: '很高兴认识你，需要帮助吗？' }]);
    }, [currentModel]);

    // 创建消息容器的引用
    const messagesEndRef = useRef(null);

    // 自动滚动到底部(节流)
    const scrollToBottom = throttle(() => {
        if (canScroll) {
            messagesEndRef.current?.scrollIntoView();
        }
    }, 300); //

    // 每次 messages 更新时，自动滚动
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 监听鼠标滚轮
    useEffect(() => {
        const handleWheel = (event) => {
            if (event.deltaY < 0) {
                setCanScroll(false);
            }
        };

        window.addEventListener('wheel', handleWheel);

        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, []);


    const handleSend = async () => {
        if (!input.trim()) return;

        // 含义: fetching的时候点击send按钮无效
        if (isFetching) {
            return;
        } else {
            setIsFetching(true);
        }

        setCanScroll(true);


        const userMessage = { role: 'user', content: input };

        // 添加用户消息
        setMessages((prev) => [...prev, userMessage]);
        setInput('');



        try {
            // 调用流式 API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ model: currentModel, messages: [...messages.slice(-4), userMessage] }),
            });

            // 处理流式响应
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // 解析流式数据
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n\n').filter((line) => line.trim());
                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        const data = JSON.parse(line.slice(5).trim());
                        assistantMessage += data.content;
                        setMessages((prev) => {
                            const lastMessage = prev[prev.length - 1];
                            if (lastMessage?.role === 'assistant') {
                                return [...prev.slice(0, -1), { role: 'assistant', content: assistantMessage }];
                            } else {
                                return [...prev, { role: 'assistant', content: assistantMessage }];
                            }
                        });
                    }
                }
            }
            
        } catch (err) {
            console.log(err);
        } finally {
            setIsFetching(false);
        }



    };

    return (
        <div className="flex-1 flex flex-col h-screen bg-white p-0">
            <div className="relative bg-white h-12 shadow">

                <SidebarTrigger className="absolute h-12 w-12" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">AI 聊天窗口</div>
            </div>
            <div className="flex-1 overflow-y-auto mt-4 mb-4 space-y-4 ">
                {messages.map((msg, index) => (
                    <div
                        key={index} className="w-full max-w-4xl m-auto"
                    >
                        {
                            msg.role === 'user' ? (
                                <div className="flex justify-end">
                                    <div className="bg-blue-200 p-3 rounded inline-block">{msg.content}</div>
                                </div>
                            ) : (
                                <div className="flex gap-4">
                                    <div>
                                        <svg t="1735719680744" className="icon" viewBox="0 0 1024 1024" version="1.1"
                                            xmlns="http://www.w3.org/2000/svg" p-id="20857" width="32" height="32">
                                            <path
                                                d="M509.44 403.2c-26.88 0-48.64 21.76-48.64 48.64s21.76 48.64 48.64 48.64 48.64-21.76 48.64-48.64c1.28-26.88-20.48-48.64-48.64-48.64z m104.96 53.76c0 26.88 21.76 48.64 48.64 48.64s48.64-21.76 48.64-48.64-21.76-48.64-48.64-48.64c-26.88-1.28-48.64 20.48-48.64 48.64zM512 0C229.12 0 0 229.12 0 512s229.12 512 512 512 512-229.12 512-512S794.88 0 512 0z m243.2 509.44c-14.08 117.76-138.24 200.96-267.52 192-14.08-1.28-29.44 1.28-42.24 7.68l-87.04 47.36c-12.8 6.4-23.04 1.28-26.88-1.28s-12.8-10.24-12.8-24.32l2.56-70.4c1.28-19.2 3.84-46.08-12.8-58.88-56.32-44.8-57.6-97.28-51.2-152.32 12.8-111.36 115.2-195.84 234.24-195.84 10.24 0 21.76 1.28 32 2.56 65.28 7.68 128 34.56 167.68 83.2 44.8 46.08 70.4 111.36 64 170.24zM353.28 403.2c-26.88 0-48.64 21.76-48.64 48.64s21.76 48.64 48.64 48.64 48.64-21.76 48.64-48.64-21.76-48.64-48.64-48.64z"
                                                p-id="20858" fill="#1296db"></path>
                                        </svg>
                                    </div>
                                    <div className="pt-1">
                                        <ReactMarkdown components={{
                                            code({ node, inline, className, children, ...props }) {
                                                const match = /language-(\w+)/.exec(className || '');
                                                return !inline && match ? (
                                                    <SyntaxHighlighter
                                                        style={materialDark}
                                                        language={match[1]}
                                                        PreTag="div"
                                                        {...props}
                                                    >
                                                        {String(children).replace(/\n$/, '')}
                                                    </SyntaxHighlighter>
                                                ) : (
                                                    <code className={className} {...props}>
                                                        {children}
                                                    </code>
                                                );
                                            },
                                        }}>{msg.content}</ReactMarkdown>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                ))}
                {/* 用于自动滚动的空 div */}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex w-full max-w-4xl mb-4 m-auto " >
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1 h-12 p-4 border border-gray-300 rounded-l-lg focus:outline-none"
                    placeholder="给AI发送消息..."
                />

                <Button onClick={handleSend} disabled={isFetching} className="bg-blue-500 text-white h-12 py-4 px-4 rounded-l-none rounded-r-lg hover:bg-blue-600">
                    发送
                </Button>
            </div>
        </div>
    );
};

export default ChatDialog;