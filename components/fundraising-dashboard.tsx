"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { FileText, Calendar, MessageSquare, Mail, ChevronRight, ArrowUp, Clock, Users, Moon } from "lucide-react"

export function FundraisingDashboard() {
  const [chatMessage, setChatMessage] = useState("")

  const files = [
    { name: "Pitch Deck - Series A", type: "pdf", icon: FileText, color: "bg-blue-600" },
    { name: "Target Funds List", type: "csv", icon: FileText, color: "bg-purple-600" },
    { name: "CRM Database", type: "sheet", icon: FileText, color: "bg-indigo-600" },
  ]

  const meetings = [
    {
      title: "Pitch to Sequoia Capital",
      time: "01:00 - 02:00 PM",
      attendees: [
        { name: "John", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Sarah", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Mike", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      additionalCount: 2,
    },
    {
      title: "Follow-up with Andreessen Horowitz",
      time: "02:30 - 03:00 PM",
      description: "Discuss term sheet and next steps",
    },
  ]

  const messages = [
    {
      sender: "Alex Chen",
      preview: "Thanks for the pitch deck. We're interested in...",
      time: "2 min ago",
      unread: true,
    },
    {
      sender: "Sarah Wilson",
      preview: "Can we schedule a follow-up call for next week?",
      time: "1 hour ago",
      unread: false,
    },
    {
      sender: "Mike Johnson",
      preview: "The financial projections look solid. Let's discuss...",
      time: "3 hours ago",
      unread: false,
    },
  ]

  const emails = [
    { sender: "venture@sequoia.com", subject: "Re: Series A Funding Opportunity", time: "10 min ago", unread: true },
    { sender: "partners@a16z.com", subject: "Investment Committee Review", time: "2 hours ago", unread: true },
    { sender: "info@kleinerperkins.com", subject: "Thank you for your presentation", time: "1 day ago", unread: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <div className="relative pb-32">
        <div className="flex items-center justify-between p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FA</span>
            </div>
            <h1 className="text-xl font-bold text-white">FundraiseAgent</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
              Get Early Access
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Moon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center space-y-4 py-12">
              <h1 className="text-5xl font-bold text-white">
                Meet <span className="text-blue-400">FundraiseAgent</span>. Your AI-powered fundraising assistant.
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Your AI co-pilot for pitch deck analysis, VC outreach, and fundraising strategy. Get institutional-grade
                insights in seconds.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                Analyze my pitch deck for Series A readiness
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                Find VCs that invest in my industry and stage
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                Draft a follow-up email to potential investors
              </Button>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Files Section */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-white">
                    <FileText className="w-5 h-5" />
                    Files
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-white/10">
                    Recent <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${file.color}`}>
                        <file.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">{file.name}</p>
                        <p className="text-sm text-gray-400">{file.type.toUpperCase()}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Upcoming Meetings */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-white">
                    <Calendar className="w-5 h-5" />
                    Upcoming meetings
                  </CardTitle>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-4 rounded-lg border border-white/10">
                    <h3 className="font-semibold text-white mb-2">{meetings[0].title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
                      <Clock className="w-4 h-4" />
                      {meetings[0].time}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-300" />
                        <div className="flex -space-x-2">
                          {meetings[0].attendees.map((attendee, idx) => (
                            <Avatar key={idx} className="w-6 h-6 border-2 border-white/20">
                              <AvatarImage src={attendee.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs bg-blue-600 text-white">
                                {attendee.name[0]}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          <div className="w-6 h-6 bg-white/20 rounded-full border-2 border-white/20 flex items-center justify-center">
                            <span className="text-xs text-white">+{meetings[0].additionalCount}</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        Join
                      </Button>
                    </div>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-medium text-white">{meetings[1].title}</h4>
                    <p className="text-sm text-gray-300 mt-1">{meetings[1].description}</p>
                    <p className="text-sm text-gray-400 mt-2">{meetings[1].time}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Messages Section */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-white">
                    <MessageSquare className="w-5 h-5" />
                    Messages
                  </CardTitle>
                  <Link href="/messages">
                    <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-white/10">
                      Recent <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-3">
                  {messages.map((message, index) => (
                    <Link key={index} href="/messages">
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-colors">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-blue-600 text-white">
                            {message.sender
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-white truncate">{message.sender}</p>
                            <span className="text-xs text-gray-400">{message.time}</span>
                          </div>
                          <p className="text-sm text-gray-300 truncate mt-1">{message.preview}</p>
                        </div>
                        {message.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              {/* Emails Section */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-white">
                    <Mail className="w-5 h-5" />
                    Emails
                  </CardTitle>
                  <Link href="/emails">
                    <Button variant="ghost" size="icon" className="text-gray-300 hover:bg-white/10">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-3">
                  {emails.map((email, index) => (
                    <Link key={index} href="/emails">
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-colors">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                          <Mail className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-white truncate">{email.sender}</p>
                            <span className="text-xs text-gray-400">{email.time}</span>
                          </div>
                          <p className="text-sm text-gray-300 truncate mt-1">{email.subject}</p>
                        </div>
                        {email.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm border-t border-white/10 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Input
                  placeholder="Ask anything..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="pr-12 bg-white/10 border-white/20 focus:border-blue-400 text-white placeholder:text-gray-400 h-12 text-base"
                />
                <Button
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 pb-2">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div>© 2025 FundraiseAgent by YourCompany</div>
              <div className="flex gap-4">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
              </div>
            </div>
            <div className="text-center text-xs text-gray-500 mt-2">
              FundraiseAgent is an AI assistant for informational purposes and does not provide financial, legal, or
              investment advice. Always consult a qualified professional before making fundraising decisions.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
