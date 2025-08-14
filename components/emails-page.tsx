"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Search,
  MoreVertical,
  Send,
  Paperclip,
  Star,
  Archive,
  Trash2,
  Reply,
  ReplyAll,
  Forward,
  Plus,
} from "lucide-react"
import Link from "next/link"

export function EmailsPage() {
  const [selectedThread, setSelectedThread] = useState(0)
  const [isReplying, setIsReplying] = useState(false)
  const [replySubject, setReplySubject] = useState("")
  const [replyMessage, setReplyMessage] = useState("")

  const emailThreads = [
    {
      id: 1,
      sender: "Alex Chen",
      email: "venture@sequoia.com",
      subject: "Re: Series A Funding Opportunity",
      preview: "Thank you for sharing your pitch deck. After our initial review...",
      time: "10 min ago",
      unread: 2,
      starred: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      sender: "Investment Team",
      email: "partners@a16z.com",
      subject: "Investment Committee Review - Next Steps",
      preview: "We've completed our preliminary review and would like to schedule...",
      time: "2 hours ago",
      unread: 1,
      starred: false,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      sender: "Sarah Wilson",
      email: "info@kleinerperkins.com",
      subject: "Thank you for your presentation",
      preview: "It was great meeting you yesterday. The team was impressed with...",
      time: "1 day ago",
      unread: 0,
      starred: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      sender: "Emma Davis",
      email: "team@greylock.com",
      subject: "Due Diligence Materials Request",
      preview: "Following our conversation, we'd like to request the following materials...",
      time: "2 days ago",
      unread: 0,
      starred: false,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const emailMessages = [
    {
      id: 1,
      sender: "Alex Chen",
      email: "venture@sequoia.com",
      subject: "Series A Funding Opportunity",
      message: `Hi there,

Thank you for sharing your pitch deck with us. After our initial review, we're impressed with your traction and the market opportunity you're addressing.

Your revenue growth trajectory is particularly compelling, and we believe there's significant potential for scale. We'd like to move forward with the next steps in our evaluation process.

Could you please provide the following materials for our due diligence review:
- Financial statements for the past 2 years
- Customer references and case studies
- Detailed competitive analysis
- Technical architecture overview

We're looking forward to learning more about your business.

Best regards,
Alex Chen
Partner, Sequoia Capital`,
      time: "Yesterday 3:45 PM",
      isOwn: false,
    },
    {
      id: 2,
      sender: "You",
      email: "founder@yourcompany.com",
      subject: "Re: Series A Funding Opportunity",
      message: `Hi Alex,

Thank you for your interest in our company! I'm excited about the possibility of working with Sequoia Capital.

I'll prepare the requested materials and have them ready by end of week. In the meantime, I'd love to schedule a call to discuss our vision and answer any questions you might have.

I'm available next week for a deeper conversation about our growth strategy and how Sequoia could be part of our journey.

Looking forward to hearing from you.

Best,
[Your Name]
Founder & CEO`,
      time: "Yesterday 4:20 PM",
      isOwn: true,
    },
    {
      id: 3,
      sender: "Alex Chen",
      email: "venture@sequoia.com",
      subject: "Re: Series A Funding Opportunity",
      message: `Perfect! Let's schedule a call for next Tuesday at 2 PM PST. I'll send you a calendar invite.

Also, please include your customer acquisition metrics and unit economics in the materials. These will be crucial for our investment committee review.

Looking forward to our conversation.

Alex`,
      time: "Today 10:15 AM",
      isOwn: false,
    },
  ]

  const currentThread = emailThreads[selectedThread]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D2C4C4] via-[#F9D8C2] to-[#D2B6A2]">
      <div className="flex h-screen">
        {/* Left Sidebar - Email Threads */}
        <div className="w-80 bg-white/90 backdrop-blur-sm border-r border-white/20 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="text-[#33312E] hover:bg-[#D2C4C4]/20">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-[#33312E]">Emails</h1>
              <div className="ml-auto">
                <Button size="sm" className="bg-[#4A737D] hover:bg-[#4A737D]/90 text-white">
                  <Plus className="w-4 h-4 mr-1" />
                  Compose
                </Button>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#33312E]/50 w-4 h-4" />
              <Input
                placeholder="Search emails..."
                className="pl-10 border-[#D2C4C4]/30 focus:border-[#D2B6A2] text-[#33312E]"
              />
            </div>
          </div>

          {/* Email Threads List */}
          <div className="flex-1 overflow-y-auto">
            {emailThreads.map((thread, index) => (
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
                      <div className="flex items-center gap-1">
                        {thread.starred && <Star className="w-3 h-3 text-[#9F9A7F] fill-current" />}
                        <span className="text-xs text-[#33312E]/50">{thread.time}</span>
                      </div>
                    </div>
                    <p className="text-sm text-[#9F9A7F] mb-1 truncate">{thread.subject}</p>
                    <p className="text-sm text-[#33312E]/70 truncate">{thread.preview}</p>
                  </div>
                  {thread.unread > 0 && <Badge className="bg-[#9F9A7F] text-white text-xs">{thread.unread}</Badge>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Email View */}
        <div className="flex-1 flex flex-col bg-white/95 backdrop-blur-sm">
          {/* Email Header */}
          <div className="p-4 border-b border-white/20 bg-white/90">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-[#33312E] truncate">{currentThread?.subject}</h2>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-[#33312E] hover:bg-[#D2C4C4]/20">
                  <Star className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-[#33312E] hover:bg-[#D2C4C4]/20">
                  <Archive className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-[#33312E] hover:bg-[#D2C4C4]/20">
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-[#33312E] hover:bg-[#D2C4C4]/20">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-[#D2C4C4]/30 text-[#33312E] hover:bg-[#D2C4C4]/10 bg-transparent"
                onClick={() => setIsReplying(true)}
              >
                <Reply className="w-4 h-4 mr-1" />
                Reply
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-[#D2C4C4]/30 text-[#33312E] hover:bg-[#D2C4C4]/10 bg-transparent"
              >
                <ReplyAll className="w-4 h-4 mr-1" />
                Reply All
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-[#D2C4C4]/30 text-[#33312E] hover:bg-[#D2C4C4]/10 bg-transparent"
              >
                <Forward className="w-4 h-4 mr-1" />
                Forward
              </Button>
            </div>
          </div>

          {/* Email Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {emailMessages.map((email) => (
              <div key={email.id} className="bg-white/80 rounded-lg p-4 border border-white/20">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className={`text-white text-sm ${email.isOwn ? "bg-[#D2B6A2]" : "bg-[#4A737D]"}`}>
                        {email.sender
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-[#33312E]">{email.sender}</h4>
                      <p className="text-sm text-[#9F9A7F]">{email.email}</p>
                    </div>
                  </div>
                  <span className="text-sm text-[#33312E]/50">{email.time}</span>
                </div>
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-[#33312E] font-sans text-sm leading-relaxed">
                    {email.message}
                  </pre>
                </div>
              </div>
            ))}
          </div>

          {/* Reply Section */}
          {isReplying && (
            <div className="border-t border-white/20 bg-white/90 p-4">
              <div className="space-y-3">
                <Input
                  placeholder="Subject"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="border-[#D2C4C4]/30 focus:border-[#D2B6A2] text-[#33312E]"
                />
                <Textarea
                  placeholder="Write your reply..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={6}
                  className="border-[#D2C4C4]/30 focus:border-[#D2B6A2] text-[#33312E] resize-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-[#33312E] hover:bg-[#D2C4C4]/20">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsReplying(false)}
                      className="border-[#D2C4C4]/30 text-[#33312E] hover:bg-[#D2C4C4]/10"
                    >
                      Cancel
                    </Button>
                    <Button className="bg-[#4A737D] hover:bg-[#4A737D]/90 text-white">
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
