import React, { useState } from 'react';
import Layout from '../components/Layout';
import { ReadingSentence } from '../types';
import { Play, Square, FastForward } from 'lucide-react';

const SENTENCES: ReadingSentence[] = [
    { text: "این یک جمله نمونه برای تست سرعت خواندن است.", wordCount: 9 },
    { text: "لطفاً هر جمله را با سرعت خواندن معمول خود بخوانید.", wordCount: 9 },
    { text: "در این تست فقط زمان خواندن جمله‌ها اندازه‌گیری می‌شود.", wordCount: 9 },
    { text: "این جملات جنبه آموزشی دارند و محتوای پزشکی خاصی ندارند.", wordCount: 11 }
];

const ReadingTest: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [lastWpm, setLastWpm] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const currentSentence = SENTENCES[index];

  const handleStart = () => {
    setIsReading(true);
    setStartTime(Date.now());
    setLastWpm(null);
  };

  const handleStop = () => {
    if (startTime) {
      const durationMs = Date.now() - startTime;
      const minutes = durationMs / 60000;
      const wpm = Math.round(currentSentence.wordCount / minutes);
      setLastWpm(wpm);
    }
    setIsReading(false);
    setStartTime(null);
  };

  const handleNext = () => {
    if (index + 1 >= SENTENCES.length) {
      setFinished(true);
    } else {
      setIndex(index + 1);
      setLastWpm(null);
    }
  };

  if (finished) {
    return (
       <Layout title="نتیجه خواندن">
         <div className="flex flex-col items-center justify-center h-full p-4">
           <h2 className="text-2xl font-bold text-emerald-600 mb-4">پایان تست</h2>
           <p className="text-slate-600 text-center mb-8">شما تمام جملات را خواندید.</p>
           <button onClick={() => window.location.reload()} className="bg-emerald-600 text-white w-full py-3 rounded-xl font-bold">بازگشت</button>
         </div>
       </Layout>
    );
  }

  return (
    <Layout title="سرعت خواندن">
      <div className="flex flex-col h-full">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 min-h-[200px] flex items-center justify-center mb-8">
           <p className={`text-xl text-center leading-loose text-slate-800 transition-opacity duration-300 ${isReading ? 'opacity-100 blur-0' : 'opacity-20 blur-sm select-none'}`}>
             {currentSentence.text}
           </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-6 mt-auto">
          {!isReading && lastWpm === null && (
            <button 
              onClick={handleStart}
              className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-emerald-200 shadow-xl hover:scale-105 transition-transform"
            >
              <Play size={32} fill="currentColor" />
            </button>
          )}

          {isReading && (
            <button 
              onClick={handleStop}
              className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white shadow-red-200 shadow-xl hover:scale-105 transition-transform"
            >
              <Square size={32} fill="currentColor" />
            </button>
          )}

          {lastWpm !== null && (
             <div className="w-full text-center animate-in fade-in slide-in-from-bottom-4">
               <p className="text-slate-500 mb-2">سرعت خواندن</p>
               <p className="text-4xl font-black text-slate-800 mb-6">{lastWpm} <span className="text-sm font-normal text-slate-400">کلمه/دقیقه</span></p>
               
               <button 
                 onClick={handleNext}
                 className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
               >
                 جمله بعدی <FastForward size={18} />
               </button>
             </div>
          )}
        </div>
        
        <div className="text-center text-slate-300 text-xs mt-6">
          جمله {index + 1} از {SENTENCES.length}
        </div>
      </div>
    </Layout>
  );
};

export default ReadingTest;