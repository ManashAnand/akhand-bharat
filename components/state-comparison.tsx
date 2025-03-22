"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen,
  Landmark,
  Users,
  Globe,
  Building,
  Sparkles,
  Feather,
  History,
  Scroll,
  MapPin,
  BookMarked,
  Lightbulb,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { stateData, languageData, socialData, comparisonTypes } from "@/data/cultureData"

import { useChat } from '@ai-sdk/react';



export default function StateComparison() {

  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState("")
  const [comparisonType, setComparisonType] = useState("states")

  const [firstState, setFirstState] = useState("tamil-nadu")
  const [secondState, setSecondState] = useState("kerala")

  const [firstLanguage, setFirstLanguage] = useState("tamil")
  const [secondLanguage, setSecondLanguage] = useState("malayalam")

  const [firstSocial, setFirstSocial] = useState("brahmin")
  const [secondSocial, setSecondSocial] = useState("kshatriya")


  const handleSubmit = async () => {
    setIsLoading(true);
    setResponse('');
    
    try {
      // Fix the message construction with proper conditional logic
      const promptContent = `I want to compare ${
        comparisonType === 'states' 
          ? `states between ${firstState} and ${secondState}`
          : comparisonType === 'languages'
            ? `languages between ${firstLanguage} and ${secondLanguage}`
            : `social structures between ${firstSocial} and ${secondSocial}`
      }.`;
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: promptContent }],
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error("Response body is not readable");
      
      const decoder = new TextDecoder();
      let fullText = '';
      
      // Process the stream
      async function readStream() {
        if(!reader) return;
        const { done, value } = await reader.read();
        
        if (done) {
          setIsLoading(false);
          return;
        }
        
        // Decode the chunk
        const chunk = decoder.decode(value, { stream: true });
        
        // Process each line in the chunk
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('0:')) {
            // Extract content, remove 0: prefix and handle special characters
            let textContent = line.replace(/^0:\s*/, '');
            
            // Remove double quotes
            textContent = textContent.replace(/"/g, '');
            
            // Handle escaped newlines - convert them to actual newlines
            textContent = textContent.replace(/\\n/g, '\n');
            
            fullText += textContent;
            // Update the response as we get more text
            setResponse(fullText);
          }
        }
        
        // Continue reading
        await readStream();
      }
      
      // Start reading the stream
      await readStream();
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
      setResponse("An error occurred while fetching the response.");
    }
  };
  return (
    <div className="space-y-8">
      <div className="mb-8 relative">
        <div className="absolute -inset-4 -z-10 bg-gradient-to-r from-amber-100 to-blue-100 dark:from-amber-900/30 dark:to-blue-900/30 rounded-xl blur-sm"></div>
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg p-6 border border-amber-200/50 dark:border-amber-800/50 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-amber-800 dark:text-amber-300">Select Comparison Type</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {comparisonTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setComparisonType(type.value)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-300",
                  comparisonType === type.value
                    ? "bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900 dark:to-amber-800 border-amber-400 dark:border-amber-600 shadow-md"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700",
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    comparisonType === type.value
                      ? "bg-amber-500 text-white dark:bg-amber-600"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300",
                  )}
                >
                  <type.icon className="w-5 h-5" />
                </div>
                <span
                  className={cn(
                    "font-medium",
                    comparisonType === type.value
                      ? "text-amber-900 dark:text-amber-200"
                      : "text-slate-600 dark:text-slate-300",
                  )}
                >
                  {type.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {comparisonType === "states" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <div className="absolute -inset-2 -z-10 bg-gradient-to-r from-blue-100/50 to-blue-200/50 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl blur-sm"></div>
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg p-5 border border-blue-200/50 dark:border-blue-800/50">
                <label className="block text-sm font-medium mb-3 text-blue-800 dark:text-blue-300">
                  Select First State
                </label>
                <Select value={firstState} onValueChange={setFirstState}>
                  <SelectTrigger className="bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-800 rounded-lg h-14 text-base pl-4 pr-2 focus:ring-blue-400 dark:focus:ring-blue-600">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{stateData[firstState].icon}</span>
                      <SelectValue placeholder="Select a state" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-800 rounded-lg overflow-hidden">
                    {Object.entries(stateData).map(([key, state]) => (
                      <SelectItem key={key} value={key} className="focus:bg-blue-50 dark:focus:bg-blue-900 py-3 pl-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{state.icon}</span>
                          <span>{state.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-2 -z-10 bg-gradient-to-r from-purple-100/50 to-purple-200/50 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl blur-sm"></div>
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg p-5 border border-purple-200/50 dark:border-purple-800/50">
                <label className="block text-sm font-medium mb-3 text-purple-800 dark:text-purple-300">
                  Select Second State
                </label>
                <Select value={secondState} onValueChange={setSecondState}>
                  <SelectTrigger className="bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-800 rounded-lg h-14 text-base pl-4 pr-2 focus:ring-purple-400 dark:focus:ring-purple-600">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{stateData[secondState].icon}</span>
                      <SelectValue placeholder="Select a state" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-purple-200 dark:border-purple-800 rounded-lg overflow-hidden">
                    {Object.entries(stateData).map(([key, state]) => (
                      <SelectItem
                        key={key}
                        value={key}
                        className="focus:bg-purple-50 dark:focus:bg-purple-900 py-3 pl-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{state.icon}</span>
                          <span>{state.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

        </>
      )}

      {comparisonType === "languages" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <div className="absolute -inset-2 -z-10 bg-gradient-to-r from-blue-100/50 to-indigo-200/50 dark:from-blue-900/30 dark:to-indigo-800/30 rounded-xl blur-sm"></div>
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg p-5 border border-blue-200/50 dark:border-blue-800/50">
                <label className="block text-sm font-medium mb-3 text-blue-800 dark:text-blue-300">
                  Select First Language
                </label>
                <Select value={firstLanguage} onValueChange={setFirstLanguage}>
                  <SelectTrigger className="bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-800 rounded-lg h-14 text-base pl-4 pr-2 focus:ring-blue-400 dark:focus:ring-blue-600">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-semibold">{languageData[firstLanguage].icon}</span>
                      <SelectValue placeholder="Select a language" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-800 rounded-lg overflow-hidden">
                    {Object.entries(languageData).map(([key, language]) => (
                      <SelectItem key={key} value={key} className="focus:bg-blue-50 dark:focus:bg-blue-900 py-3 pl-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-semibold">{language.icon}</span>
                          <span>{language.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-2 -z-10 bg-gradient-to-r from-indigo-100/50 to-indigo-200/50 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-xl blur-sm"></div>
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg p-5 border border-indigo-200/50 dark:border-indigo-800/50">
                <label className="block text-sm font-medium mb-3 text-indigo-800 dark:text-indigo-300">
                  Select Second Language
                </label>
                <Select value={secondLanguage} onValueChange={setSecondLanguage}>
                  <SelectTrigger className="bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-800 rounded-lg h-14 text-base pl-4 pr-2 focus:ring-indigo-400 dark:focus:ring-indigo-600">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-semibold">{languageData[secondLanguage].icon}</span>
                      <SelectValue placeholder="Select a language" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-800 rounded-lg overflow-hidden">
                    {Object.entries(languageData).map(([key, language]) => (
                      <SelectItem
                        key={key}
                        value={key}
                        className="focus:bg-indigo-50 dark:focus:bg-indigo-900 py-3 pl-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-semibold">{language.icon}</span>
                          <span>{language.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

        </>
      )}

      {comparisonType === "social" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <div className="absolute -inset-2 -z-10 bg-gradient-to-r from-green-100/50 to-teal-200/50 dark:from-green-900/30 dark:to-teal-800/30 rounded-xl blur-sm"></div>
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg p-5 border border-green-200/50 dark:border-green-800/50">
                <label className="block text-sm font-medium mb-3 text-green-800 dark:text-green-300">
                  Select First Social Structure
                </label>
                <Select value={firstSocial} onValueChange={setFirstSocial}>
                  <SelectTrigger className="bg-white dark:bg-slate-800 border-2 border-green-200 dark:border-green-800 rounded-lg h-14 text-base pl-4 pr-2 focus:ring-green-400 dark:focus:ring-green-600">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{socialData[firstSocial].icon}</span>
                      <SelectValue placeholder="Select a social structure" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-green-200 dark:border-green-800 rounded-lg overflow-hidden">
                    {Object.entries(socialData).map(([key, social]) => (
                      <SelectItem key={key} value={key} className="focus:bg-green-50 dark:focus:bg-green-900 py-3 pl-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{social.icon}</span>
                          <span>{social.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-2 -z-10 bg-gradient-to-r from-teal-100/50 to-teal-200/50 dark:from-teal-900/30 dark:to-teal-800/30 rounded-xl blur-sm"></div>
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg p-5 border border-teal-200/50 dark:border-teal-800/50">
                <label className="block text-sm font-medium mb-3 text-teal-800 dark:text-teal-300">
                  Select Second Social Structure
                </label>
                <Select value={secondSocial} onValueChange={setSecondSocial}>
                  <SelectTrigger className="bg-white dark:bg-slate-800 border-2 border-teal-200 dark:border-teal-800 rounded-lg h-14 text-base pl-4 pr-2 focus:ring-teal-400 dark:focus:ring-teal-600">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{socialData[secondSocial].icon}</span>
                      <SelectValue placeholder="Select a social structure" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-teal-200 dark:border-teal-800 rounded-lg overflow-hidden">
                    {Object.entries(socialData).map(([key, social]) => (
                      <SelectItem key={key} value={key} className="focus:bg-teal-50 dark:focus:bg-teal-900 py-3 pl-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{social.icon}</span>
                          <span>{social.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

        </>
      )}
      <div className="mt-8 flex justify-center">
        <Button
          className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-600 hover:to-orange-600 text-white font-medium px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
          onClick={() => handleSubmit()}
        >
          Compare {comparisonType}s
        </Button>
      </div>

      <div className="">
      {isLoading && <div className="mt-4">Loading...</div>}
      {response && (
        <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800 overflow-hidden">
          <h3 className="text-lg font-medium mb-2">Comparison Result</h3>
          <div className="whitespace-pre-wrap">{response}</div>
        </div>
      )}
      </div>
    </div>
  )
}

