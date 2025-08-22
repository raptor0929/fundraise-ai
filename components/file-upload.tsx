'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Upload, FileText, FileSpreadsheet, CheckCircle, XCircle } from 'lucide-react'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

interface FileUploadProps {
  bucketName: 'pitch-decks' | 'funds-lists' | 'documents'
  onUploadSuccess?: (fileUrl: string, fileName: string) => void
  onUploadError?: (error: string) => void
  maxFileSize?: number // in bytes
  allowedTypes?: string[]
  label?: string
  description?: string
}

export function FileUpload({
  bucketName,
  onUploadSuccess,
  onUploadError,
  maxFileSize = 52428800, // 50MB default
  allowedTypes = [],
  label = 'Upload File',
  description = 'Select a file to upload'
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    // Validate file size
    if (selectedFile.size > maxFileSize) {
      setErrorMessage(`File size must be less than ${Math.round(maxFileSize / 1024 / 1024)}MB`)
      return
    }

    // Validate file type if specified
    if (allowedTypes.length > 0 && !allowedTypes.includes(selectedFile.type)) {
      setErrorMessage(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`)
      return
    }

    setFile(selectedFile)
    setErrorMessage('')
    setUploadStatus('idle')
  }

  const uploadFile = async () => {
    if (!file) return

    setUploading(true)
    setUploadProgress(0)
    setUploadStatus('idle')
    setErrorMessage('')

    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('User not authenticated')
      }

      // Create unique filename with timestamp
      const timestamp = new Date().getTime()
      const fileExtension = file.name.split('.').pop()
      const fileName = `${session.user.id}/${timestamp}-${file.name}`

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

      setUploadStatus('success')
      setUploadProgress(100)
      
      // Call success callback
      if (onUploadSuccess) {
        onUploadSuccess(urlData.publicUrl, fileName)
      }

    } catch (error: any) {
      console.error('Upload error:', error)
      setUploadStatus('error')
      setErrorMessage(error.message || 'Upload failed')
      
      // Call error callback
      if (onUploadError) {
        onUploadError(error.message || 'Upload failed')
      }
    } finally {
      setUploading(false)
    }
  }

  const getBucketConfig = () => {
    switch (bucketName) {
      case 'pitch-decks':
        return {
          icon: <FileText className="h-5 w-5" />,
          title: 'Pitch Deck Upload',
          description: 'Upload your pitch deck (PDF format) - publicly accessible',
          allowedTypes: ['application/pdf'],
          maxSize: '50MB'
        }
      case 'funds-lists':
        return {
          icon: <FileSpreadsheet className="h-5 w-5" />,
          title: 'Funds List Upload',
          description: 'Upload your funds list (CSV or Excel format) - publicly accessible',
          allowedTypes: ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
          maxSize: '50MB'
        }
      default:
        return {
          icon: <Upload className="h-5 w-5" />,
          title: 'Document Upload',
          description: 'Upload your document - publicly accessible',
          allowedTypes: ['application/pdf', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
          maxSize: '50MB'
        }
    }
  }

  const config = getBucketConfig()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {config.icon}
          {config.title}
        </CardTitle>
        <CardDescription>
          {config.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file-upload">Select File</Label>
          <Input
            id="file-upload"
            type="file"
            onChange={handleFileSelect}
            accept={config.allowedTypes.join(',')}
            disabled={uploading}
          />
          <p className="text-sm text-muted-foreground">
            Max size: {config.maxSize} | Allowed: {config.allowedTypes.map(type => type.split('/')[1]).join(', ')}
          </p>
        </div>

        {file && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              {config.icon}
              <span className="text-sm font-medium">{file.name}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        )}

        {errorMessage && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {uploadStatus === 'success' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>File uploaded successfully!</AlertDescription>
          </Alert>
        )}

        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Uploading... {uploadProgress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <Button 
          onClick={uploadFile} 
          disabled={!file || uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

// Hook for file uploads
export function useFileUpload() {
  const uploadFile = async (
    bucketName: 'pitch-decks' | 'funds-lists' | 'documents',
    file: File,
    fileName?: string
  ) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('User not authenticated')
      }

      const timestamp = new Date().getTime()
      const fileExtension = file.name.split('.').pop()
      const finalFileName = fileName || `${session.user.id}/${timestamp}-${file.name}`

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(finalFileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        throw error
      }

      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(finalFileName)

      return {
        success: true,
        url: urlData.publicUrl,
        fileName: finalFileName,
        data
      }

    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Upload failed'
      }
    }
  }

  return { uploadFile }
}
