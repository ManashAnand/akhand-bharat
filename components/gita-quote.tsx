import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"

function getRandomSlokaUrl() {
  const slokcount = [
    47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78,
  ];
  const chapter = Math.floor(Math.random() * 17) + 1;
  const slok = Math.floor(Math.random() * slokcount[chapter - 1]) + 1;
  return { chapter, slok };
}

export function GitaQuote() {
  const [sloka, setSloka] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSloka() {
      try {
        setLoading(true);
        const { chapter, slok } = getRandomSlokaUrl();
        // Use a relative URL to our own API endpoint instead of calling external API directly
        const response = await fetch(`/api/gita-sloka?chapter=${chapter}&slok=${slok}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonData = await response.json();
        setSloka(jsonData);
      } catch (error) {
        setError((error as Error).message);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSloka();
  }, []);

  return (
    <Card className="bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/lotus.svg')] bg-no-repeat bg-right-bottom opacity-10"></div>
      <CardContent className="pt-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-300 rounded-full mb-2"></div>
          
          {loading && <p className="text-amber-700 dark:text-amber-400">Loading wisdom from the Gita...</p>}
          
          {error && <p className="text-red-600 dark:text-red-400">Error: {error}</p>}
          
          {sloka && (
            <>
              <h2 className="text-xl md:text-2xl font-semibold text-amber-800 dark:text-amber-300 font-serif">
                {sloka.slok}
              </h2>
              <p className="italic text-amber-700 dark:text-amber-400 max-w-2xl">
                "{sloka.tej?.ht || sloka.translations?.[0]?.description || "Translation not available"}"
              </p>
              <div className="text-sm text-amber-600 dark:text-amber-500 max-w-2xl">
                <p>
                  Bhagavad Gita {sloka.chapter}.{sloka.verse} - {sloka.tej?.et || sloka.description || "No additional explanation available"}
                </p>
              </div>
            </>
          )}
          
          <div className="w-16 h-1 bg-gradient-to-r from-amber-600 to-amber-400 dark:from-amber-300 dark:to-amber-500 rounded-full mt-2"></div>
        </div>
      </CardContent>
    </Card>
  )
}

