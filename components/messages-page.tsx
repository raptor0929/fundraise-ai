"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, MoreVertical, Send, Paperclip, Smile, Phone, Video, Info } from "lucide-react"
import Link from "next/link"

export function MessagesPage() {
  const [selectedThread, setSelectedThread] = useState(0)
  const [replyMessage, setReplyMessage] = useState("")

  const messageThreads = [
    {
      id: 1,
      sender: "Alex Chen",
      company: "Sequoia Capital",
      lastMessage: "Thanks for the pitch deck. We're interested in discussing further.",
      time: "2 min ago",
      unread: 3,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      sender: "Sarah Wilson",
      company: "Andreessen Horowitz",
      lastMessage: "Can we schedule a follow-up call for next week?",
      time: "1 hour ago",
      unread: 1,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      sender: "Mike Johnson",
      company: "Kleiner Perkins",
      lastMessage: "The financial projections look solid. Let's discuss the market opportunity.",
      time: "3 hours ago",
      unread: 0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      sender: "Emma Davis",
      company: "Greylock Partners",
      lastMessage: "We'd like to invite you to present to our investment committee.",
      time: "1 day ago",
      unread: 0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const conversationMessages = [
    {
      id: 1,
      sender: "Alex Chen",
      message: "Hi there! I've reviewed your pitch deck and I'm impressed with your traction and market opportunity.",
      time: "2:30 PM",
      isOwn: false,
    },
    {
      id: 2,
      sender: "You",
      message:
        "Thank you for taking the time to review it! I'd love to discuss how Sequoia could be part of our journey.",
      time: "2:32 PM",
      isOwn: true,
    },
    {
      id: 3,
      sender: "Alex Chen",
      message:
        "Absolutely. Your revenue growth is particularly compelling. Can you tell me more about your customer acquisition strategy?",
      time: "2:35 PM",
      isOwn: false,
    },
    {
      id: 4,
      sender: "You",
      message:
        "Of course! We've been focusing on a multi-channel approach combining content marketing, strategic partnerships, and targeted digital advertising. Our CAC has decreased by 40% over the past 6 months.",
      time: "2:38 PM",
      isOwn: true,
    },
    {
      id: 5,
      sender: "Alex Chen",
      message:
        "That's impressive. We're interested in discussing further. Would you be available for a call this week to dive deeper into your business model and growth plans?",
      time: "2:40 PM",
      isOwn: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D2C4C4] via-[#F9D8C2] to-[#D2B6A2]">
      <div className="flex h-screen">
        {/* Left Sidebar - Message Threads */}
        <div className="w-80 bg-white/90 backdrop-blur-sm border-r border-white/20 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="text-[#33312E] hover:bg-[#D2C4C4]/20">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-[#33312E]">Messages</h1>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#33312E]/50 w-4 h-4" />
              <Input
                placeholder="Search messages..."
                className="pl-10 border-[#D2C4C4]/30 focus:border-[#D2B6A2] text-[#33312E]"
              />
            </div>
          </div>

          {/* Message Threads List */}
          <div className="flex-1 overflow-y-auto">
            {messageThreads.map((thread, index) => (
              <div
                key={thread.id}
                onClick={() => setSelectedThread(index)}
                className={`p-4 border-b border-white/10 cursor-pointer transition-colors ${
                  selectedThread === index ? "bg-[#D2B6A2]/20 border-l-4 border-l-[#4A737D]" : "hover:bg-[#D2C4C4]/10"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={thread.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-[#4A737D] text-white">
                      {thread.sender
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-[#33312E] truncate">{thread.sender}</h3>
                      <span className="text-xs text-[#33312E]/50">{thread.time}</span>
                    </div>
                    <p className="text-sm text-[#9F9A7F] mb-1">{thread.company}</p>
                    <p className="text-sm text-[#33312E]/70 truncate">{thread.lastMessage}</p>
                  </div>
                  {thread.unread > 0 && <Badge className="bg-[#9F9A7F] text-white text-xs">{thread.unread}</Badge>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Conversation View */}
        <div className="flex-1 flex flex-col bg-white/95 backdrop-blur-sm">
          {/* Conversation Header */}
          <div className="p-4 border-b border-white/20 bg-white/90">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={messageThreads[selectedThread]?.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-[#4A737D] text-white">
                    {messageThreads[selectedThread]?.sender
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-[#33312E]">{messageThreads[selectedThread]?.sender}</h2>
                  <p className="text-sm text-[#9F9A7F]">{messageThreads[selectedThread]?.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-[#33312E] hover:bg-[#D2C4C4]/20">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-[#33312E] hover:bg-[#D2C4C4]/20">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-[#33312E] hover:bg-[#D2C4C4]/20">
                  <Info className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-[#33312E] hover:bg-[#D2C4C4]/20">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {conversationMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs lg:max-w-md ${msg.isOwn ? "order-2" : "order-1"}`}>
                  {!msg.isOwn && (
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-[#4A737D] text-white text-xs">
                          {msg.sender
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-[#33312E]/60">{msg.sender}</span>
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-lg ${
                      msg.isOwn ? "bg-[#4A737D] text-white" : "bg-[#D2C4C4]/30 text-[#33312E]"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  <p className="text-xs text-[#33312E]/50 mt-1 px-1">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Reply Input */}
          <div className="p-4 border-t border-white/20 bg-white/90">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-[#33312E] hover:bg-[#D2C4C4]/20">
                <Paperclip className="w-4 h-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  placeholder="Type a message..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="pr-20 border-[#D2C4C4]/30 focus:border-[#D2B6A2] text-[#33312E]"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-[#33312E] hover:bg-[#D2C4C4]/20">
                    <Smile className="w-4 h-4" />
                  </Button>
                  <Button size="icon" className="h-8 w-8 bg-[#D2B6A2] hover:bg-[#D2B6A2]/90 text-white">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
