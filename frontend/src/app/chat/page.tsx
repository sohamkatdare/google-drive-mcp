"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, Sparkles } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      const response = await fetch(
        `http://localhost:3001/chat?query=${encodeURIComponent(userMessage.content)}`,
        {
          method: "POST",
        }
      )
      let botText = "Sorry, I didn't get a response."
      if (response.ok) {
        const botResponse = await response.text()
        const botJSON = JSON.parse(botResponse);
        botText = botJSON.response === "" ? "Sorry I couldn't find anything. Please try again with a different query." : botJSON.response;
        console.log(botJSON.response)

      } else {
        botText = `Error: ${response.status} ${response.statusText}`
      }
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botText,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Error: ${err}`,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const userName = "Alex" // This could come from authentication

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Chat container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full relative z-10">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-8">
          {messages.length === 0 ? (
            // Welcome message
            <div className="flex flex-1 min-h-[60vh] items-center justify-center">
              <div className="text-center space-y-2 relative">
                <h2 className="text-2xl font-medium text-white opacity-45">Welcome to</h2>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white opacity-45">Your Drive Assistant</h1>
                <h2 className="text-2xl pt-10font-medium text-white opacity-45">What can I help with today?</h2>
              </div>
            </div>
          ) : (
            // Messages
            <div className="space-y-6 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-4 ${
                    message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-blue-500 to-purple-500"
                        : "bg-gradient-to-r from-green-500 to-blue-500"
                    }`}
                  >
                    {message.sender === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`flex-1 max-w-3xl ${message.sender === "user" ? "text-right" : "text-left"}`}>
                    <div
                      className={`prose prose-invert max-w-none inline-block p-4 rounded-2xl ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-gray-800/80 backdrop-blur-sm text-gray-100 border border-gray-700/50"
                      }`}
                    >
                      <div className="text-sm prose lg-prose-xl prose prose-headings:text-white prose-li:text-white prose-ol:text-white prose-blockquote:text-white prose-strong:text-white text-white md:text-base leading-relaxed" style={{
                        "--tw-prose-bullets": "white", // For unordered list bullets
                        "--tw-prose-counters": "white", // For ordered list numbers
                      } as React.CSSProperties}>
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-sm p-4">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
            <div className="flex space-x-4 items-end">
              <div className="flex-1">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="bg-gray-800/80 border-gray-600/50 text-white placeholder-gray-400 rounded-xl py-3 px-4 text-base focus:ring-2 focus:ring-blue-500/50 focus:border-transparent resize-none"
                  disabled={isTyping}
                />
              </div>
              <Button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-6 py-3 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
