"use client"

import type React from "react"
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MessageSquare, Send, Menu, X, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import SimpleGlobe from "@/components/SimpleGlobe"
import { getUser, logout } from "@/lib/auth"

interface ChatMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export default function ChatPage() {
  const [chatInput, setChatInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mapCoords, setMapCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [currentDestination, setCurrentDestination] = useState<string>("")
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content:
        "Hey there, where would you like to go? I'm here to assist you in planning your experience. Ask me anything travel related.",
      isUser: false,
      timestamp: new Date(),
    },
  ])

  // Add state for markers
  const [mapMarkers, setMapMarkers] = useState<{ lat: number; lng: number; name: string }[]>([])

  const router = useRouter()

  // Check authentication on component mount
  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser) {
      router.push('/login')
      return
    }
    setUser(currentUser)
  }, [router])

  // Geocoding function to update map coordinates
  const geocodeDestination = async (destination: string) => {
    if (!destination) return;
    console.log('Geocoding for:', destination);
    try {
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destination)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`);
      const data = await res.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        console.log('Geocoded coordinates:', { lat, lng });
        setMapCoords({ lat, lng });
        setCurrentDestination(destination);
      } else {
        console.error('Geocoding failed:', data.status, data.error_message);
      }
    } catch (error) {
      console.log('Geocoding error:', error);
      // fallback: do nothing
    }
  };

  // Helper to extract location using OpenAI (server-side)
  const extractLocation = async (text: string): Promise<string | null> => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          mode: 'extract-location',
        }),
      });
      const data = await res.json();
      if (data.success && data.location) {
        return data.location.replace(/\n/g, "").trim();
      }
    } catch (err) {}
    return null;
  };

  // Helper: Extract place names from AI reply (bolded names after @ or in table rows)
  function extractPlaceNames(markdown: string): string[] {
    // Match @ **Place** or | ... | **Place** | ... |
    const regex1 = /@ \*\*([^*]+)\*\*/g;
    const regex2 = /\|[^|]*\*\*([^*]+)\*\*[^|]*\|/g;
    const matches1 = [...markdown.matchAll(regex1)].map(m => m[1]);
    const matches2 = [...markdown.matchAll(regex2)].map(m => m[1]);

    // New: Also match capitalized multi-word phrases (e.g., Walt Disney World, Universal Studios)
    const regex3 = /([A-Z][a-z]+(?: [A-Z][a-z]+)+)/g;
    const matches3 = [...markdown.matchAll(regex3)].map(m => m[1]);

    // New: Also match lines with common attraction keywords
    const keywords = [
      'Airport', 'Park', 'Resort', 'Studios', 'Center', 'Downtown', 'Trolley', 'Gatorland', 'SeaWorld', 'Disney', 'Universal', 'Science Center', 'Space Center', 'Bus', 'Rental', 'Hotel', 'Museum', 'Aquarium', 'Zoo', 'Theater', 'Mall', 'District', 'Drive', 'Avenue', 'Boulevard', 'Plaza', 'Square', 'Restaurant', 'Show', 'Nightlife', 'Lynx', 'I-RIDE'
    ];
    const lines = markdown.split(/\n|\r/);
    const keywordMatches: string[] = [];
    for (const line of lines) {
      for (const kw of keywords) {
        if (line.includes(kw)) {
          // Try to extract the phrase containing the keyword
          const match = line.match(new RegExp(`([A-Z][A-Za-z0-9'&. -]*${kw}[A-Za-z0-9'&. -]*)`));
          if (match && match[1].length > 2) keywordMatches.push(match[1].trim());
        }
      }
    }

    const allNames = Array.from(new Set([...matches1, ...matches2, ...matches3, ...keywordMatches]));
    console.log("Extracted place names:", allNames);
    return allNames;
  }

  // Helper: Geocode a place name
  async function geocodePlace(name: string, destination: string) {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(name + ', ' + destination)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    const data = await res.json();
    if (data.status === 'OK' && data.results.length > 0) {
      return {
        name,
        lat: data.results[0].geometry.location.lat,
        lng: data.results[0].geometry.location.lng,
      };
    }
    return null;
  }

  // Extract destination from chat messages and update map
  useEffect(() => {
    const lastMessage = chatMessages[chatMessages.length - 1];
    if (lastMessage && !lastMessage.isUser && lastMessage.content) {
      // Use OpenAI to extract the location from the AI reply
      extractLocation(lastMessage.content).then((location) => {
        console.log('Client received extracted location:', location);
        if (location) {
          console.log('Geocoding for:', location);
          geocodeDestination(location);
        }
      });
    }
  }, [chatMessages]);

  // When a new AI reply arrives, extract and geocode places
  useEffect(() => {
    const lastMessage = chatMessages[chatMessages.length - 1];
    if (lastMessage && !lastMessage.isUser && lastMessage.content) {
      const placeNames = extractPlaceNames(lastMessage.content);
      if (placeNames.length > 0 && currentDestination) {
        Promise.all(placeNames.map(name => geocodePlace(name, currentDestination)))
          .then(results => {
            const filtered = results.filter((r): r is { lat: number; lng: number; name: string } => !!r);
            console.log("Geocoded markers:", filtered);
            setMapMarkers(filtered);
          });
      }
    }
  }, [chatMessages, currentDestination]);

  const handleChatSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!chatInput.trim() || chatLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: chatInput,
      isUser: true,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setChatLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatInput }),
      })

      const data = await res.json()

      if (data.success) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: data.reply,
          isUser: false,
          timestamp: new Date(),
        }
        setChatMessages((prev) => [...prev, aiMessage])
      } else {
        throw new Error("Failed to get response")
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble responding right now. Please try again.",
        isUser: false,
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, errorMessage])
    } finally {
      setChatLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
  }

  if (!user) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:relative z-30 w-64 lg:w-[10%] h-full bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FinalWanderly-mZZ2dHlHrGtM3v0ojB16DKQ894IAJo.webp"
                alt="Wanderly Logo"
                className="h-8 w-auto"
              />
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <div className="flex items-center gap-3 p-3 bg-[#0f766e]/10 rounded-lg text-[#0f766e]">
            <MessageSquare size={20} />
            <span className="font-medium hidden xl:block">Chats</span>
            <span className="ml-auto text-sm bg-[#0f766e]/20 px-2 py-1 rounded-full hidden xl:block">1</span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-5 h-5 rounded bg-gray-300"></div>
            <span className="hidden xl:block">Explore</span>
          </Link>

          <div className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <div className="w-5 h-5 rounded bg-gray-300"></div>
            <span className="hidden xl:block">Saved</span>
          </div>

          <div className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <div className="w-5 h-5 rounded bg-gray-300"></div>
            <span className="hidden xl:block">Trips</span>
          </div>

          <div className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <div className="w-5 h-5 rounded bg-gray-300"></div>
            <span className="hidden xl:block">Updates</span>
          </div>

          <div className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <div className="w-5 h-5 rounded bg-gray-300"></div>
            <span className="hidden xl:block">Inspiration</span>
          </div>
        </nav>

        <div className="absolute bottom-4 left-2 right-2 xl:left-4 xl:right-4 space-y-2">
          {/* User info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-[#0f766e] flex items-center justify-center text-white text-sm font-medium">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden xl:block flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          
          <Button 
            onClick={handleLogout}
            variant="outline" 
            size="sm" 
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut size={16} className="mr-2" />
            <span className="hidden xl:block">Logout</span>
          </Button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row lg:w-[90%]">
        {/* Chat area */}
        <div className="flex-1 flex flex-col lg:w-[40%] lg:min-h-0">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-700">
                  <Menu size={20} />
                </button>
                <h1 className="text-xl font-semibold text-gray-900">New chat</h1>
              </div>
              <div className="hidden lg:flex items-center gap-4 text-sm text-gray-500">
                <span>Where</span>
                <span>When</span>
                <span>2 travelers</span>
                <span>Budget</span>
                <Button variant="outline" size="sm">
                  Invite
                </Button>
              </div>
            </div>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
            <div className="max-w-none">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Where to today, {user.name}?</h2>

              {chatMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 mb-4 md:mb-6 ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  {!message.isUser && (
                    <div className="w-8 h-8 rounded-full bg-[#0f766e] flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                      W
                    </div>
                  )}
                  <div
                    className={`max-w-xs sm:max-w-sm md:max-w-md p-3 md:p-4 rounded-2xl ${
                      message.isUser
                        ? "bg-[#0f766e] text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-900 rounded-bl-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm md:text-base">{message.content}</p>
                  </div>
                  {message.isUser && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium flex-shrink-0">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </motion.div>
              ))}

              {chatLoading && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 mb-4 md:mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#0f766e] flex items-center justify-center text-white text-sm font-medium">
                    W
                  </div>
                  <div className="bg-gray-100 p-3 md:p-4 rounded-2xl rounded-bl-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Chat input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="max-w-none">
              <form onSubmit={handleChatSend} className="relative">
                <Input
                  placeholder="Ask anything..."
                  className="pr-12 py-2 md:py-3 text-sm md:text-base border-gray-300 focus:border-[#0f766e] focus:ring-[#0f766e]"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={chatLoading}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0f766e] hover:bg-[#0f766e]/90 p-2"
                  disabled={chatLoading || !chatInput.trim()}
                >
                  <Send size={16} />
                </Button>
              </form>
              
              <p className="text-xs text-gray-500 mt-2 text-center hidden md:block">
                Wanderly can make mistakes. Check important info.
              </p>
            </div>
          </div>
        </div>

        {/* Map area */}
        <div className="w-full h-64 md:h-80 lg:h-auto lg:w-[50%] bg-white border-t lg:border-t-0 lg:border-l border-gray-200 relative">
          {currentDestination && (
            <div className="absolute top-2 md:top-4 left-2 md:left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-2 md:px-3 py-1 md:py-2 shadow-lg">
              <p className="text-xs md:text-sm font-medium text-gray-700">📍 {currentDestination}</p>
            </div>
          )}
          <div className="h-full w-full p-2 md:p-4">
            <div className="h-full w-full rounded-lg overflow-hidden bg-gray-100">
              <SimpleGlobe coords={mapCoords} destination={currentDestination} markers={mapMarkers} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 