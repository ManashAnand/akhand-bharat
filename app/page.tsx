"use client";
import StateComparison from "@/components/state-comparison"


export default function Home() {

  return (

    <>
      <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 bg-fixed">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 z-0"></div>
        <div className="absolute top-0 right-0 w-full h-64 bg-[url('/mandala.svg')] bg-no-repeat bg-right-top opacity-10 z-0"></div>

        <header className="relative z-10 border-b border-amber-200/20 dark:border-amber-800/20 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-amber-800 dark:text-amber-300">
              <span className="inline-block transform -rotate-2 text-amber-600 dark:text-amber-400">भारत</span> Cultural
              Explorer
            </h1>
            {/* <ModeToggle /> */}
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* <GitaQuote /> */}

          <div className="mt-12">
            <StateComparison />
          </div>
       
        </div>
      </main>
    </>

  )
}

