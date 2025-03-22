// @ts-nocheck
"use client"

import { useState } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Check,
  ChevronsUpDown,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { stateData, languageData, socialData, comparisonTypes } from "@/data/cultureData"
import {
  TwitterShareButton,
  TwitterIcon,
} from 'next-share'
// TypeScript interfaces for our data types
interface StateData {
  icon: string;
  name: string;
  [key: string]: unknown; // For any additional properties
}

interface LanguageData {
  icon: string;
  name: string;
  [key: string]: unknown; // For any additional properties
}

interface SocialData {
  icon: string;
  name: string;
  [key: string]: unknown; // For any additional properties
}

// Card components for displaying comparison results




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

  const [showComparison, setShowComparison] = useState(false)

  const handleCompare = () => {
    setShowComparison(true)
    // Scroll to the comparison section
    setTimeout(() => {
      const comparisonElement = document.getElementById("comparison-results")
      if (comparisonElement) {
        comparisonElement.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  const resetComparison = () => {
    setShowComparison(false)
  }

  // Reset the comparison display when changing comparison type
  const handleComparisonTypeChange = (type: string) => {
    setComparisonType(type)
    setShowComparison(false)
  }

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
                onClick={() => handleComparisonTypeChange(type.value)}
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
        <div className="relative">
          <div className="absolute -inset-4 -z-10 bg-gradient-to-r from-blue-100/50 to-purple-100/50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl blur-sm"></div>
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg p-6 border border-blue-200/50 dark:border-blue-800/50">
            <h2 className="text-xl font-bold mb-4 text-blue-800 dark:text-blue-300">Select States to Compare</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-blue-800 dark:text-blue-300">First State</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-800 rounded-lg h-14 text-base pl-4 pr-2 focus:ring-blue-400 dark:focus:ring-blue-600 w-full justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{stateData[firstState].icon}</span>
                        <span>{stateData[firstState].name}</span>
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search states..." />
                      <CommandList>
                        <CommandEmpty>No state found.</CommandEmpty>
                        <CommandGroup>
                          {Object.entries(stateData).map(([key, state]) => (
                            <CommandItem
                              key={key}
                              value={key}
                              onSelect={(currentValue) => {
                                setFirstState(currentValue)
                                setShowComparison(false)
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{state.icon}</span>
                                <span>{state.name}</span>
                              </div>
                              <Check
                                className={cn("ml-auto h-4 w-4", firstState === key ? "opacity-100" : "opacity-0")}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-purple-800 dark:text-purple-300">
                  Second State
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-800 rounded-lg h-14 text-base pl-4 pr-2 focus:ring-purple-400 dark:focus:ring-purple-600 w-full justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{stateData[secondState].icon}</span>
                        <span>{stateData[secondState].name}</span>
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search states..." />
                      <CommandList>
                        <CommandEmpty>No state found.</CommandEmpty>
                        <CommandGroup>
                          {Object.entries(stateData).map(([key, state]) => (
                            <CommandItem
                              key={key}
                              value={key}
                              onSelect={(currentValue) => {
                                setSecondState(currentValue)
                                setShowComparison(false)
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{state.icon}</span>
                                <span>{state.name}</span>
                              </div>
                              <Check
                                className={cn("ml-auto h-4 w-4", secondState === key ? "opacity-100" : "opacity-0")}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            
          </div>
        </div>
      )}

      {comparisonType === "languages" && (
        <div className="relative">
          <div className="absolute -inset-4 -z-10 bg-gradient-to-r from-blue-100/50 to-indigo-100/50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl blur-sm"></div>
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg p-6 border border-blue-200/50 dark:border-blue-800/50">
            <h2 className="text-xl font-bold mb-4 text-blue-800 dark:text-blue-300">Select Languages to Compare</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-blue-800 dark:text-blue-300">
                  First Language
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-800 rounded-lg h-14 text-base pl-4 pr-2 focus:ring-blue-400 dark:focus:ring-blue-600 w-full justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-semibold">{languageData[firstLanguage].icon}</span>
                        <span>{languageData[firstLanguage].name}</span>
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search languages..." />
                      <CommandList>
                        <CommandEmpty>No language found.</CommandEmpty>
                        <CommandGroup>
                          {Object.entries(languageData).map(([key, language]) => (
                            <CommandItem
                              key={key}
                              value={key}
                              onSelect={(currentValue) => {
                                setFirstLanguage(currentValue)
                                setShowComparison(false)
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xl font-semibold">{language.icon}</span>
                                <span>{language.name}</span>
                              </div>
                              <Check
                                className={cn("ml-auto h-4 w-4", firstLanguage === key ? "opacity-100" : "opacity-0")}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-indigo-800 dark:text-indigo-300">
                  Second Language
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-800 rounded-lg h-14 text-base pl-4 pr-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 w-full justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-semibold">{languageData[secondLanguage].icon}</span>
                        <span>{languageData[secondLanguage].name}</span>
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search languages..." />
                      <CommandList>
                        <CommandEmpty>No language found.</CommandEmpty>
                        <CommandGroup>
                          {Object.entries(languageData).map(([key, language]) => (
                            <CommandItem
                              key={key}
                              value={key}
                              onSelect={(currentValue) => {
                                setSecondLanguage(currentValue)
                                setShowComparison(false)
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xl font-semibold">{language.icon}</span>
                                <span>{language.name}</span>
                              </div>
                              <Check
                                className={cn("ml-auto h-4 w-4", secondLanguage === key ? "opacity-100" : "opacity-0")}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

    
          </div>
        </div>
      )}

      {comparisonType === "social" && (
        <div className="relative">
          <div className="absolute -inset-4 -z-10 bg-gradient-to-r from-green-100/50 to-teal-100/50 dark:from-green-900/30 dark:to-teal-900/30 rounded-xl blur-sm"></div>
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg p-6 border border-green-200/50 dark:border-green-800/50">
            <h2 className="text-xl font-bold mb-4 text-green-800 dark:text-green-300">
              Select Social Structures to Compare
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-green-800 dark:text-green-300">
                  First Social Structure
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="bg-white dark:bg-slate-800 border-2 border-green-200 dark:border-green-800 rounded-lg h-14 text-base pl-4 pr-2 focus:ring-green-400 dark:focus:ring-green-600 w-full justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{socialData[firstSocial].icon}</span>
                        <span>{socialData[firstSocial].name}</span>
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search social structures..." />
                      <CommandList>
                        <CommandEmpty>No social structure found.</CommandEmpty>
                        <CommandGroup>
                          {Object.entries(socialData).map(([key, social]) => (
                            <CommandItem
                              key={key}
                              value={key}
                              onSelect={(currentValue) => {
                                setFirstSocial(currentValue)
                                setShowComparison(false)
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{social.icon}</span>
                                <span>{social.name}</span>
                              </div>
                              <Check
                                className={cn("ml-auto h-4 w-4", firstSocial === key ? "opacity-100" : "opacity-0")}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-teal-800 dark:text-teal-300">
                  Second Social Structure
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="bg-white dark:bg-slate-800 border-2 border-teal-200 dark:border-teal-800 rounded-lg h-14 text-base pl-4 pr-2 focus:ring-teal-400 dark:focus:ring-teal-600 w-full justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{socialData[secondSocial].icon}</span>
                        <span>{socialData[secondSocial].name}</span>
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search social structures..." />
                      <CommandList>
                        <CommandEmpty>No social structure found.</CommandEmpty>
                        <CommandGroup>
                          {Object.entries(socialData).map(([key, social]) => (
                            <CommandItem
                              key={key}
                              value={key}
                              onSelect={(currentValue) => {
                                setSecondSocial(currentValue)
                                setShowComparison(false)
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{social.icon}</span>
                                <span>{social.name}</span>
                              </div>
                              <Check
                                className={cn("ml-auto h-4 w-4", secondSocial === key ? "opacity-100" : "opacity-0")}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

       
          </div>
        </div>
      )}

        <div id="comparison-results" className="mt-12 pt-4">
          <div className="mt-8 flex justify-center">
            <Button
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
              onClick={() => handleSubmit()}
            >
              Generate AI Comparison
            </Button>
          </div>

          {isLoading && <div className="mt-6 p-4 text-center">Loading comparison data...</div>}
          {response && (
            <div className="mt-6 p-6 bg-white dark:bg-slate-800 rounded-lg shadow bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-950 dark:to-amber-900 border border-amber-200 dark:border-amber-800">
              <h3 className="text-lg font-medium mb-4 text-amber-800 dark:text-amber-300">AI-Generated Comparison</h3>
              <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{response}</div>
              <TwitterShareButton url={response.slice(0, 250) + "..."}>
                <TwitterIcon size={32} round />
              </TwitterShareButton>
            </div>
          )}
        </div>
      
    </div>
  )
}

