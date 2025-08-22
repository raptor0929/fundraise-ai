'use client'

import { useEffect } from 'react'

export function RelevanceChat() {
  useEffect(() => {
    // Create and append the script
    const script = document.createElement('script')
    script.defer = true
    script.setAttribute('data-relevanceai-share-id', 'd7b62b/afc0e4a3-9c64-4f1b-9bf6-dfb047a7ee51/0f263e8a-29e0-43a0-bd7e-a175001c08b3')
    script.src = 'https://app.relevanceai.com/embed/chat-bubble.js'
    script.setAttribute('data-share-styles', 'hide_tool_steps=false&hide_file_uploads=false&hide_conversation_list=false&bubble_style=agent&primary_color=%23685FFF&bubble_icon=pd%2Fchat&input_placeholder_text=Type+your+message...&hide_logo=false&hide_description=false')
    
    document.body.appendChild(script)

    // Cleanup function to remove the script when component unmounts
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  return null
}
