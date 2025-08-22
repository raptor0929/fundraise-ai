/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { FileText, Calendar, MessageSquare, Mail, ChevronRight, ArrowUp, Clock, Users, Moon, Upload, X, Bot, Loader2, CheckCircle, ExternalLink } from "lucide-react"
import { ConnectWallet } from "@/components/connect-wallet"
import { useContract } from "@/hooks/use-contract"
import { createClient } from '@supabase/supabase-js'
import { useAccount } from 'wagmi'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export function FundraisingDashboard() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [showCrmDatabase, setShowCrmDatabase] = useState(false)
  const [crmSpreadsheetUrl, setCrmSpreadsheetUrl] = useState<string>('')
  const [isStartingFundraise, setIsStartingFundraise] = useState(false)

  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [fundraiseProjectData, setFundraiseProjectData] = useState<any>(null)

  const [aiGeneratedFiles] = useState([
    { id: "3", name: "CRM Database", type: "sheet", icon: FileText, color: "bg-indigo-600", size: 0 },
  ])

  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [uploadingFileId, setUploadingFileId] = useState<string | null>(null)
  const isUploadingRef = useRef(false)
  const lastUploadTimeRef = useRef(0)
  const [processingFiles, setProcessingFiles] = useState<Set<string>>(new Set())

  // Contract integration
  const {
    isConnected,
    handleMint,
    isMinting,
    isMintConfirming,
    isMintSuccess,
    mintError,
    isActive,
    currentSubscriptionCost,
  } = useContract()

  // Get wallet address
  const { address: walletAddress } = useAccount()

  // Format subscription cost for display
  const formatSubscriptionCost = (cost: bigint | undefined) => {
    if (!cost) return "10 MNT"
    const costInMNT = Number(cost) / 1e18
    return `${costInMNT} MNT`
  }

  // Check subscription status when component mounts or contract state changes
  useEffect(() => {
    if (isMintSuccess || isActive) {
      setIsSubscribed(true)
    }
  }, [isMintSuccess, isActive])

  // Fetch fundraise project data when wallet connects
  useEffect(() => {
    if (walletAddress) {
      fetchFundraiseProjectData()
    }
  }, [walletAddress])

  const fetchFundraiseProjectData = async () => {
    if (!walletAddress) return
    
    try {
      const { data, error } = await supabase
        .from('fundraise_project')
        .select('*')
        .eq('user_wallet', walletAddress)
        .single()
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching fundraise project data:', error)
        return
      }
      
      if (data) {
        setFundraiseProjectData(data)
        // Load existing files into the uploadedFiles state
        loadExistingFiles(data)
      }
    } catch (error) {
      console.error('Error fetching fundraise project data:', error)
    }
  }

  const loadExistingFiles = (projectData: any) => {
    const existingFiles: any[] = []
    
    if (projectData.pitch_deck_link) {
      existingFiles.push({
        id: `pitch-deck-${Date.now()}`,
        name: 'Pitch Deck',
        type: 'pdf',
        icon: FileText,
        color: "bg-red-600",
        size: 0,
        url: projectData.pitch_deck_link,
        bucketName: 'pitch-decks',
        fileName: 'pitch-deck'
      })
    }
    
    if (projectData.funds_list_link) {
      existingFiles.push({
        id: `funds-list-${Date.now()}`,
        name: 'Funds List',
        type: 'csv',
        icon: FileText,
        color: "bg-green-600",
        size: 0,
        url: projectData.funds_list_link,
        bucketName: 'funds-lists',
        fileName: 'funds-list'
      })
    }
    
    setUploadedFiles(existingFiles)
  }

  const updateUploadedFilesList = (projectData: any) => {
    const currentFiles = [...uploadedFiles]
    
    // Check if pitch deck file already exists
    const hasPitchDeck = currentFiles.some(file => file.bucketName === 'pitch-decks')
    if (projectData.pitch_deck_link && !hasPitchDeck) {
      currentFiles.push({
        id: `pitch-deck-${Date.now()}`,
        name: 'Pitch Deck',
        type: 'pdf',
        icon: FileText,
        color: "bg-red-600",
        size: 0,
        url: projectData.pitch_deck_link,
        bucketName: 'pitch-decks',
        fileName: 'pitch-deck'
      })
    }
    
    // Check if funds list file already exists
    const hasFundsList = currentFiles.some(file => file.bucketName === 'funds-lists')
    if (projectData.funds_list_link && !hasFundsList) {
      currentFiles.push({
        id: `funds-list-${Date.now()}`,
        name: 'Funds List',
        type: 'csv',
        icon: FileText,
        color: "bg-green-600",
        size: 0,
        url: projectData.funds_list_link,
        bucketName: 'funds-lists',
        fileName: 'funds-list'
      })
    }
    
    setUploadedFiles(currentFiles)
  }

  // Monitor uploadedFiles state changes
  useEffect(() => {
    console.log('uploadedFiles state changed, count:', uploadedFiles.length)
    uploadedFiles.forEach((file, index) => {
      console.log(`File ${index}: ${file.name} (ID: ${file.id})`)
    })
  }, [uploadedFiles])

  const handleFileUpload = async (file: File) => {
    if (!isSubscribed) return // Disable file upload if not subscribed
    
    console.log('handleFileUpload called with:', file.name)
    
    const now = Date.now()
    
    // Prevent multiple calls within 1 second
    if (now - lastUploadTimeRef.current < 1000) {
      console.log('Upload called too quickly, skipping')
      return
    }
    lastUploadTimeRef.current = now
    
    // Check if file already exists to prevent duplicates
    const fileExists = uploadedFiles.some(existingFile => 
      existingFile.name === file.name && 
      existingFile.size === file.size
    )
    if (fileExists) {
      console.log('File already exists, skipping upload')
      return
    }
    
    // Check if we're already uploading this file
    const fileId = `${file.name}-${file.size}`
    if (uploadingFileId === fileId) {
      console.log('File already being uploaded, skipping')
      return
    }
    
    // Check if we're currently uploading any file
    if (isUploading || isUploadingRef.current) {
      console.log('Another file is currently uploading, skipping')
      return
    }
    
    isUploadingRef.current = true
    setUploadingFileId(fileId)
    setIsUploading(true)
    setUploadProgress(0)
    setShowUploadDialog(true)

    try {
      // Determine bucket based on file type
      let bucketName = 'documents'
      if (file.type === 'application/pdf') {
        bucketName = 'pitch-decks'
      } else if (file.type === 'text/csv' || file.type.includes('excel') || file.type.includes('spreadsheet')) {
        bucketName = 'funds-lists'
      }

      // Create unique filename with timestamp and wallet address
      const timestamp = new Date().getTime()
      const walletAddress = isConnected ? 'connected-wallet' : 'anonymous'
      const fileName = `${walletAddress}/${timestamp}-${file.name}`

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        throw error
      }

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName)

      // Add the new file to the uploaded files list
      const newFile = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.name.split('.').pop()?.toLowerCase() || 'file',
        icon: FileText,
        color: "bg-green-600",
        size: file.size,
        url: urlData.publicUrl,
        bucketName: bucketName,
        fileName: fileName
      }
      
      console.log('Adding new file to state:', newFile)
      setUploadedFiles(prev => {
        console.log('Current files count:', prev.length)
        const newFiles = [...prev, newFile]
        console.log('New files count:', newFiles.length)
        return newFiles
      })
      
      // Save or update fundraise_project record
      await saveToFundraiseProject(file, urlData.publicUrl, bucketName)
      
      setUploadProgress(100)
      
    } catch (error: any) {
      console.error('Upload error:', error)
      // You might want to show an error message to the user here
    } finally {
      // Reset all states
      setTimeout(() => {
        setIsUploading(false)
        setShowUploadDialog(false)
        setUploadProgress(0)
        setUploadingFileId(null)
        isUploadingRef.current = false
      }, 1000) // 1 second delay to show completion
    }
  }

  const handleStartFundraise = async (fileId: string) => {
    if (!isSubscribed) return // Disable fundraise if not subscribed
    
    console.log('Starting fundraise for file:', fileId)
    setProcessingFiles(prev => new Set(prev).add(fileId))
    
    try {
      // Check if we have both required files
      if (!fundraiseProjectData?.pitch_deck_link || !fundraiseProjectData?.funds_list_link) {
        console.error('Missing required files for fundraise')
        return
      }
      
      // Make webhook call to process files
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/webhook/process-files`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pitchDeckLink: fundraiseProjectData.pitch_deck_link,
          fundsListLink: fundraiseProjectData.funds_list_link
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('Fundraise processing result:', result)
      
      // Show CRM Database with the spreadsheet URL from the response
      if (result.ok && result.spreadsheetUrl) {
        setShowCrmDatabase(true)
        // Store the spreadsheet URL for the CRM database link
        setCrmSpreadsheetUrl(result.spreadsheetUrl)
        console.log('Fundraise completed successfully, CRM data available')
      } else {
        console.error('Invalid response from fundraise processing')
      }
      
    } catch (error) {
      console.error('Error during fundraise processing:', error)
      // You might want to show an error message to the user here
    } finally {
      // Remove from processing state
      setProcessingFiles(prev => {
        const newSet = new Set(prev)
        newSet.delete(fileId)
        return newSet
      })
    }
  }

  const handleActionButtonClick = (actionText: string) => {
    if (!isSubscribed) return // Disable action buttons if not subscribed
    console.log('Action clicked:', actionText)
  }

  const saveToFundraiseProject = async (file: File, fileUrl: string, bucketName: string) => {
    try {
      // Get actual wallet address
      const currentWalletAddress = walletAddress || 'anonymous'
      
      // Determine which field to update based on file type
      let updateData: any = {
        user_wallet: currentWalletAddress,
        status: 'created'
      }
      
      if (bucketName === 'pitch-decks') {
        updateData.pitch_deck_link = fileUrl
      } else if (bucketName === 'funds-lists') {
        updateData.funds_list_link = fileUrl
      }
      
      // Check if a record already exists for this wallet
      const { data: existingRecord, error: selectError } = await supabase
        .from('fundraise_project')
        .select('*')
        .eq('user_wallet', currentWalletAddress)
        .single()
      
      if (selectError && selectError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected if no record exists
        console.error('Error checking existing record:', selectError)
        return
      }
      
      if (existingRecord) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('fundraise_project')
          .update(updateData)
          .eq('user_wallet', currentWalletAddress)
        
        if (updateError) {
          console.error('Error updating fundraise_project:', updateError)
        } else {
          console.log('Updated fundraise_project record for wallet:', currentWalletAddress)
          const updatedRecord = { ...existingRecord, ...updateData }
          setFundraiseProjectData(updatedRecord)
          // Update uploadedFiles state to reflect the new file
          updateUploadedFilesList(updatedRecord)
        }
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('fundraise_project')
          .insert([updateData])
        
        if (insertError) {
          console.error('Error creating fundraise_project record:', insertError)
        } else {
          console.log('Created new fundraise_project record for wallet:', currentWalletAddress)
          setFundraiseProjectData(updateData)
          // Update uploadedFiles state to reflect the new file
          updateUploadedFilesList(updateData)
        }
      }
    } catch (error) {
      console.error('Error saving to fundraise_project:', error)
    }
  }

  const handleSubscribe = () => {
    if (!isConnected) return
    handleMint()
  }

  const handleCrmDatabaseClick = () => {
    const url = crmSpreadsheetUrl || 'https://docs.google.com/spreadsheets/d/1s1wiWbeTLt06rwWvSWjcUHxQLa5VoW61i81T3YDN19A/edit?gid=1390972581#gid=1390972581'
    window.open(url, '_blank')
  }

  const meetings = [
    {
      title: "Pitch to Sequoia Capital",
      time: "01:00 - 02:00 PM",
      attendees: [
        { name: "John", avatar: "/john.jpg?height=32&width=32" },
        { name: "Sarah", avatar: "/sarah.jpg?height=32&width=32" }
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
            <ConnectWallet />
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
              
              {/* Subscribe Button */}
              {isConnected && !isSubscribed && (
                <div className="mt-8">
                  <Button 
                    onClick={handleSubscribe}
                    disabled={isMinting || isMintConfirming}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold"
                  >
                    {isMinting || isMintConfirming ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {isMinting ? 'Minting...' : 'Confirming...'}
                      </>
                    ) : (
                      'Subscribe (' + formatSubscriptionCost(currentSubscriptionCost) + ')'
                    )}
                  </Button>
                  {mintError && (
                    <div className="mt-4 text-red-400 text-sm">
                      Error: {mintError.message}
                    </div>
                  )}
                </div>
              )}
              
              {/* Subscription Success Message */}
              {isSubscribed && (
                <div className="mt-8 flex items-center justify-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-lg font-semibold">Subscription Active!</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button 
                variant="outline" 
                className={`border-white/20 text-white hover:bg-white/10 bg-transparent ${!isSubscribed ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleActionButtonClick("Analyze my pitch deck for Series A readiness")}
                disabled={!isSubscribed}
              >
                Analyze my pitch deck for Series A readiness
              </Button>
              <Button 
                variant="outline" 
                className={`border-white/20 text-white hover:bg-white/10 bg-transparent ${!isSubscribed ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleActionButtonClick("Find VCs that invest in my industry and stage")}
                disabled={!isSubscribed}
              >
                Find VCs that invest in my industry and stage
              </Button>
              <Button 
                variant="outline" 
                className={`border-white/20 text-white hover:bg-white/10 bg-transparent ${!isSubscribed ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleActionButtonClick("Draft a follow-up email to potential investors")}
                disabled={!isSubscribed}
              >
                Draft a follow-up email to potential investors
              </Button>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Files Section */}
              <Card className={`bg-white/10 backdrop-blur-sm border-white/20 shadow-lg ${!isSubscribed ? 'opacity-50' : ''}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-white">
                    <FileText className="w-5 h-5" />
                    Files
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          console.log('File selected:', file.name)
                          // Clear the input immediately to prevent multiple triggers
                          e.target.value = ''
                          handleFileUpload(file)
                        }
                      }}
                      disabled={!isSubscribed}
                    />
                    <Button 
                      variant={isSubscribed ? "default" : "ghost"}
                      size="sm" 
                      className={`${
                        isSubscribed 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'text-gray-300 hover:bg-white/10 cursor-not-allowed'
                      }`}
                      onClick={() => {
                        if (isSubscribed) {
                          document.getElementById('file-upload')?.click()
                        }
                      }}
                      disabled={!isSubscribed}
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Upload file
                    </Button>
                    <Button 
                      variant={isSubscribed && fundraiseProjectData?.pitch_deck_link && fundraiseProjectData?.funds_list_link ? "default" : "ghost"}
                      size="sm" 
                      className={`${
                        isSubscribed && fundraiseProjectData?.pitch_deck_link && fundraiseProjectData?.funds_list_link
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'text-gray-300 hover:bg-white/10 cursor-not-allowed opacity-50'
                      }`}
                      onClick={() => {
                        if (isSubscribed && fundraiseProjectData?.pitch_deck_link && fundraiseProjectData?.funds_list_link) {
                          handleStartFundraise('dashboard-fundraise')
                        }
                      }}
                      disabled={!isSubscribed || !fundraiseProjectData?.pitch_deck_link || !fundraiseProjectData?.funds_list_link || processingFiles.has('dashboard-fundraise')}
                    >
                      {processingFiles.has('dashboard-fundraise') ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Bot className="w-4 h-4 mr-1" />
                          Start Fundraise
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Upload Progress Dialog */}
                  {showUploadDialog && (
                    <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">Uploading file...</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-300 hover:bg-white/10 h-6 w-6 p-0"
                          onClick={() => {
                            setShowUploadDialog(false)
                            setIsUploading(false)
                            setUploadProgress(0)
                            setUploadingFileId(null)
                            isUploadingRef.current = false
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full animate-pulse"></div>
                      </div>
                      <div className="text-xs text-gray-300 mt-1">Please wait...</div>
                    </div>
                  )}

                  {/* Uploaded by User Section */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-3">Uploaded by user</h3>
                    <div className="space-y-2">
                      {uploadedFiles.map((file) => {
                        const isProcessing = processingFiles.has(file.id)
                        const isPdf = file.type.toLowerCase() === 'pdf'
                        return (
                          <div
                            key={file.id}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                          >
                            <div className={`p-2 rounded-lg ${file.color}`}>
                              <file.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-white">{file.name}</p>
                              <p className="text-sm text-gray-400">{file.type.toUpperCase()}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {/* View button removed */}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Generated by Fundraise AI Section */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-3">Generated by Fundraise AI</h3>
                    <div className="space-y-2">
                      {aiGeneratedFiles.map((file) => {
                        // Only show CRM Database if showCrmDatabase is true
                        if (file.name === "CRM Database" && !showCrmDatabase) {
                          return null
                        }
                        
                        return (
                          <div
                            key={file.id}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                            onClick={file.name === "CRM Database" ? handleCrmDatabaseClick : undefined}
                          >
                            <div className={`p-2 rounded-lg ${file.color}`}>
                              <file.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-white">{file.name}</p>
                              <p className="text-sm text-gray-400">{file.type.toUpperCase()}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
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
                          {meetings[0]?.attendees?.map((attendee, idx) => (
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


      </div>
    </div>
  )
}
