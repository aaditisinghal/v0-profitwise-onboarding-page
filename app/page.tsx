"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, MicOff, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"

type Message = {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function OnboardingPage() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Welcome to ProfitWise! I'm here to help you get started. You can speak to me or type your responses.",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const splineRef = useRef<any>(null)

  // Simulate AI speaking state (you'll connect this to your backend)
  useEffect(() => {
    const splineViewer = document.querySelector("spline-viewer")
    splineRef.current = splineViewer

    // Add animation class based on speaking state
    if (splineViewer) {
      if (isSpeaking) {
        splineViewer.classList.add("animate-pulse")
      } else {
        splineViewer.classList.remove("animate-pulse")
      }
    }
  }, [isSpeaking])

  const toggleListening = () => {
    setIsListening(!isListening)
    // Connect to your voice recognition backend here
    console.log("[v0] Voice listening toggled:", !isListening)
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue("")

    // Simulate AI response (connect to your backend)
    setTimeout(() => {
      setIsSpeaking(true)
      const aiResponse: Message = {
        role: "assistant",
        content: "Thank you for your response. Let me help you with that...",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])

      // Stop speaking after 2 seconds (adjust based on actual speech duration)
      setTimeout(() => setIsSpeaking(false), 2000)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header with ProfitWise Logo */}
      <header className="absolute top-6 left-6 z-10">
        <div className="relative w-12 h-12">
          <Image
            src="/images/chatgpt-image-oct-29-2c-2025-2c-02-31-32-pm.png"
            alt="ProfitWise"
            fill
            className="object-contain invert"
          />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-8 p-6 pt-24">
        {/* Left Side - Spline 3D Viewer */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-2xl flex flex-col items-center gap-8">
            <div className="relative w-full aspect-square">
              <script
                type="module"
                src="https://unpkg.com/@splinetool/viewer@1.11.2/build/spline-viewer.js"
                dangerouslySetInnerHTML={{ __html: "" }}
              />
              <spline-viewer
                url="https://prod.spline.design/XZNkMopNCClgYiQ9/scene.splinecode"
                className={`w-full h-full transition-all duration-300 ${isSpeaking ? "scale-105" : "scale-100"}`}
              />

              {/* Status Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isSpeaking ? "bg-green-500 animate-pulse" : isListening ? "bg-blue-500 animate-pulse" : "bg-muted"
                  }`}
                />
                <span className="text-sm font-medium">
                  {isSpeaking ? "AI Speaking..." : isListening ? "Listening..." : "Ready"}
                </span>
              </div>
            </div>

            {/* Voice Control Button */}
            <Button
              size="lg"
              variant={isListening ? "destructive" : "default"}
              className="rounded-full w-16 h-16 shadow-lg"
              onClick={toggleListening}
              disabled={isSpeaking}
            >
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Right Side - Chat/Transcript */}
        <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
          <div className="bg-card border rounded-lg shadow-sm flex flex-col h-[600px]">
            {/* Chat Header */}
            <div className="border-b px-6 py-4">
              <h2 className="text-xl font-semibold">Onboarding Chat</h2>
              <p className="text-sm text-muted-foreground">Type your responses or use voice</p>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t px-6 py-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage()
                  }}
                  disabled={isSpeaking}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isSpeaking} size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
