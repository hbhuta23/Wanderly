"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  ArrowRight,
  MessageSquare,
  ClipboardCheck,
  Globe,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Plane,
  Camera,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { useRouter } from "next/navigation"

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("chat")
  const [loading, setLoading] = useState(false)
  const [formStep, setFormStep] = useState(0)
  const [itinerary, setItinerary] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => { setIsClient(true); }, [])

  // Form state
  const [form, setForm] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    people: 1,
    budget: "",
    preferences: "",
    visaStatus: "",
    specialRequests: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === "people" ? Number(value) : value,
    }))
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch('/api/plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        destination: form.destination,
        dates: [form.startDate, form.endDate],
        people: form.people,
        budget: form.budget,
        preferences: form.preferences.split(',').map(p => p.trim()),
        visaStatus: form.visaStatus,
        specialRequests: form.specialRequests,
      }),
    });

    const json = await res.json();

    if (!json.success) {
      throw new Error('Failed to generate itinerary');
    }

    setItinerary(json.trip.itinerary);

  } catch (err) {
    console.error(err);
    alert('Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const nextStep = () => setFormStep((prev) => prev + 1)
  const prevStep = () => setFormStep((prev) => prev - 1)

  return (
    <div className="min-h-screen bg-[#fdfaf5]">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f766e]/10 to-[#ea580c]/10 opacity-30" />
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <nav className="flex justify-between items-center mb-16">
            <div className="flex items-center gap-2">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FinalWanderly-mZZ2dHlHrGtM3v0ojB16DKQ894IAJo.webp"
                alt="Wanderly Logo"
                className="h-10 w-auto"
              />
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => router.push('/login')}>Sign In</Button>
              <Button onClick={() => router.push('/signup')}>Sign Up</Button>
            </div>
          </nav>

          <div className="flex flex-col md:flex-row items-center gap-12 py-16">
            <div className="flex-1 space-y-6">
              <motion.h1
                className="text-5xl md:text-6xl font-bold text-gray-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Travel <span className="text-[#0f766e]">smarter</span>,<br />
                explore <span className="text-[#ea580c]">deeper</span>.
              </motion.h1>

              <motion.p
                className="text-xl text-gray-600 max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Your AI travel companion that crafts personalized itineraries with minute-by-minute precision.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button
                  size="lg"
                  className="bg-[#0f766e] hover:bg-[#0f766e]/90 text-white"
                  onClick={() => {
                    router.push("/page2")
                  }}
                >
                  <MessageSquare className="mr-2 h-4 w-4" /> Chat with Wanderly
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#ea580c] text-[#ea580c] hover:bg-[#ea580c]/10"
                  onClick={() => {
                    setActiveTab("quiz")
                    document.getElementById("plan-section")?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  <ClipboardCheck className="mr-2 h-4 w-4" /> Take the Quiz
                </Button>
              </motion.div>
            </div>

            <motion.div
              className="flex-1 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative w-full max-w-2xl mx-auto">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0f766e]/20 rounded-full filter blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ea580c]/20 rounded-full filter blur-3xl" />

                {/* Floating travel icons */}
                <div className="absolute top-10 left-10 animate-bounce">
                  <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <Plane className="h-6 w-6 text-[#0f766e]" />
                  </div>
                </div>

                <div className="absolute top-20 right-20 animate-pulse">
                  <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <Camera className="h-5 w-5 text-[#ea580c]" />
                  </div>
                </div>

                <div className="absolute bottom-20 left-20 animate-bounce delay-300">
                  <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-[#0f766e]" />
                  </div>
                </div>

                {/* Main travel showcase */}
                <div className="relative z-10 grid grid-cols-2 gap-4">
                  {/* Large destination card */}
                  <div className="col-span-2 relative overflow-hidden rounded-2xl shadow-2xl">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Santorini-6dt5z3JgsAJUYLeyvspm8jxONIJXRE.webp"
                      alt="Santorini, Greece - Iconic Oia village with white buildings and blue domes at sunset"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">Santorini, Greece</h3>
                      <p className="text-sm opacity-90">Perfect 7-day itinerary ready</p>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-white text-sm font-medium">AI Planned</span>
                    </div>
                  </div>

                  {/* Smaller destination cards */}
                  <div className="relative overflow-hidden rounded-xl shadow-lg">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tokyo-GettyImages-1131743616-1000x3000.jpg-dtxKngGzoTrbPQzgTWV82A7q6IXFjc.jpeg"
                      alt="Tokyo, Japan - Spectacular night skyline with Tokyo Tower and Mount Fuji"
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-2 left-2 text-white">
                      <h4 className="font-semibold text-sm">Tokyo</h4>
                      <p className="text-xs opacity-90">10 days</p>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-xl shadow-lg">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/caption.jpg-fqGo9cUfJJwFhnLCyMvignmnlNX7eU.jpeg"
                      alt="Bali, Indonesia - Tropical beach resort with infinity pool"
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-2 left-2 text-white">
                      <h4 className="font-semibold text-sm">Bali</h4>
                      <p className="text-xs opacity-90">5 days</p>
                    </div>
                  </div>
                </div>

                {/* Chat interface overlay */}
                <div className="absolute -bottom-8 -right-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-gray-100 max-w-xs">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-2 w-2 rounded-full bg-[#ea580c]" />
                    <div className="h-2 w-2 rounded-full bg-[#0f766e]" />
                    <div className="h-2 w-2 rounded-full bg-gray-300" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#0f766e] flex items-center justify-center text-white text-xs">
                        W
                      </div>
                      <div className="bg-gray-100 rounded-lg rounded-tl-none p-2 text-xs">
                        I found 3 amazing destinations for you!
                      </div>
                    </div>

                    <div className="flex items-start gap-2 justify-end">
                      <div className="bg-[#0f766e]/10 rounded-lg rounded-tr-none p-2 text-xs">
                        Show me Santorini details
                      </div>
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                        U
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Enhanced Features Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#0f766e]/5 rounded-full -translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#ea580c]/5 rounded-full translate-x-20 translate-y-20" />

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-4">How Wanderly Works</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Our AI-powered platform makes trip planning effortless and personalized
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "Smart Recommendations",
                description: "Our AI analyzes thousands of destinations to match your preferences perfectly.",
                image:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-IujRWE05bEuiLnO293kJueyBsfXTlY.jpeg",
                color: "0f766e",
              },
              {
                icon: Calendar,
                title: "Minute-by-Minute Planning",
                description: "Get detailed itineraries with real-time availability and local insights.",
                image:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%281%29-0vVEM28UoEFxGVABJMwQQ3WYe0JBnL.jpeg",
                color: "ea580c",
              },
              {
                icon: DollarSign,
                title: "Budget Optimization",
                description: "Find the best deals on flights, accommodations, and activities within your budget.",
                image:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/caption.jpg-fqGo9cUfJJwFhnLCyMvignmnlNX7eU.jpeg",
                color: "0f766e",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
              >
                <Card className="border-none shadow-lg overflow-hidden h-full group hover:shadow-xl transition-shadow duration-300">
                  <div className="relative overflow-hidden">
                    <img
                      src={feature.image || "/placeholder.svg"}
                      alt={feature.title}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <CardContent className="pt-6 pb-6">
                    <div
                      className={`rounded-full bg-[#${feature.color}]/10 w-12 h-12 flex items-center justify-center mb-4`}
                    >
                      <feature.icon className={`h-6 w-6 text-[#${feature.color}]`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="py-16 bg-gradient-to-br from-[#0f766e]/5 to-[#ea580c]/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Discover Amazing Destinations</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From bustling cities to serene beaches, Wanderly helps you explore the world's most incredible places
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Paris, France",
                image: "/placeholder.svg?height=300&width=400",
                description: "City of lights and romance",
                duration: "5-7 days",
                highlights: ["Eiffel Tower", "Louvre Museum", "Seine River"],
              },
              {
                name: "Tokyo, Japan",
                image:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%281%29-0vVEM28UoEFxGVABJMwQQ3WYe0JBnL.jpeg",
                description: "Ancient temples and modern marvels",
                duration: "7-10 days",
                highlights: ["Tokyo Tower", "Mount Fuji Views", "Neon Districts"],
              },
              {
                name: "Santorini, Greece",
                image:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-IujRWE05bEuiLnO293kJueyBsfXTlY.jpeg",
                description: "Stunning sunsets and white cliffs",
                duration: "4-6 days",
                highlights: ["Oia Sunset", "Blue Domes", "Cliffside Views"],
              },
              {
                name: "Bali, Indonesia",
                image:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/caption.jpg-fqGo9cUfJJwFhnLCyMvignmnlNX7eU.jpeg",
                description: "Tropical paradise and culture",
                duration: "7-10 days",
                highlights: ["Beach Resorts", "Temples", "Rice Terraces"],
              },
            ].map((destination, i) => (
              <motion.div
                key={i}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-none shadow-lg overflow-hidden h-full">
                  <div className="relative overflow-hidden">
                    <img
                      src={destination.image || "/placeholder.svg"}
                      alt={destination.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <span className="text-xs font-medium text-[#0f766e]">{destination.duration}</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">{destination.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{destination.description}</p>
                    <div className="space-y-1">
                      {destination.highlights.map((highlight, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
                          <span className="text-xs text-gray-500">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-[#0f766e] hover:bg-[#0f766e]/90 text-white"
              onClick={() => document.getElementById("plan-section")?.scrollIntoView({ behavior: "smooth" })}
            >
              Plan Your Trip to Any Destination
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials/Social Proof */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Travelers Love Wanderly</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Wanderly planned my entire Tokyo trip with incredible detail. I discovered places I never would have found on my own!",
                author: "Sarah K.",
                location: "New York",
              },
              {
                quote:
                  "The minute-by-minute itinerary saved us so much time. Perfect balance of tourist spots and hidden gems.",
                author: "James L.",
                location: "London",
              },
              {
                quote:
                  "As a solo traveler, Wanderly gave me confidence with detailed plans that considered safety and local insights.",
                author: "Mia T.",
                location: "Sydney",
              },
            ].map((testimonial, i) => (
              <Card key={i} className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex flex-col h-full">
                    <div className="mb-4 text-[#ea580c]">{"★".repeat(5)}</div>
                    <p className="text-gray-700 flex-grow">"{testimonial.quote}"</p>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Wanderly-8dO78aeLR7Xu8yR5EUEC8f366IhKCR.png"
                alt="Wanderly Logo"
                className="h-8 w-auto"
              />
              <p className="text-gray-500 mt-2">Your AI travel companion</p>
            </div>

            <div className="flex gap-8">
              <div>
                <h4 className="font-medium mb-2">Company</h4>
                <ul className="space-y-1 text-gray-500">
                  <li>About</li>
                  <li>Careers</li>
                  <li>Press</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Resources</h4>
                <ul className="space-y-1 text-gray-500">
                  <li>Blog</li>
                  <li>Help Center</li>
                  <li>Contact</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Legal</h4>
                <ul className="space-y-1 text-gray-500">
                  <li>Privacy</li>
                  <li>Terms</li>
                  <li>Cookies</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Wanderly. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}