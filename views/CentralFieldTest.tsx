import React, { useState } from 'react';
import Layout from '../components/Layout';
import { CentralStimulus } from '../types';

const GRID_SIZE = 5;
const TOTAL_STIMULI = 25;

const CentralFieldTest: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  const currentRow = Math.floor(index / GRID_SIZE);
  const currentCol = index % GRID_SIZE;

  const handleAnswer = (seen: boolean) => {
    const newResponses = [...responses, seen];
    setResponses(newResponses);
    
    if (index + 1 >= TOTAL_STIMULI) {
      setFinished(true);
    } else {
      setIndex(index + 1);
    }
  };

  if (finished) {
    const seenCount = responses.filter(r => r).length;
    return (
      <Layout title="نتیجه میدان مرکزی">
        <div className="flex flex-col items-center justify-center h-full p-4">
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-rose-100 text-center w-full">
             <h2 className="text-xl font-bold text-slate-800 mb-6">گزارش میدان دید</h2>
             <div className="grid grid-cols-5 gap-2 aspect-square w-full max-w-[200px] mx-auto mb-6">
                {responses.map((seen, i) => (
                  <div key={i} className={`rounded-sm ${seen ? 'bg-green-400' : 'bg-red-400'}`} />
                ))}
             </div>
             <p className="text-lg font-bold text-slate-700">
               {seenCount} نقطه از {TOTAL_STIMULI} نقطه
             </p>
           </div>
           <button onClick={() => window.location.reload()} className="mt-8 bg-rose-600 text-white w-full py-3 rounded-xl font-bold">تکرار تست</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="میدان مرکزی">
      <div className="flex flex-col h-full items-center">
        <p className="text-slate-600 mb-6 text-center mt-4">
          آیا نقطه قرمز را می‌بینید؟
        </p>

        <div className="w-full max-w-[300px] aspect-square bg-white shadow-sm border border-slate-200 relative mb-8">
           {/* Grid Lines */}
           <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 pointer-events-none">
             {Array.from({ length: 25 }).map((_, i) => (
               <div key={i} className="border border-slate-100" />
             ))}
           </div>
           
           {/* Stimulus */}
           <div 
             className="absolute bg-red-500 rounded-full w-4 h-4 transition-all duration-300"
             style={{
               top: `${(currentRow * 20) + 10}%`,
               left: `${(currentCol * 20) + 10}%`,
               transform: 'translate(-50%, -50%)'
             }}
           />
        </div>

        <div className="grid grid-cols-2 gap-4 w-full mt-auto">
          <button onClick={() => handleAnswer(true)} className="bg-white border-2 border-green-500 text-green-600 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors">
            دیدم
          </button>
          <button onClick={() => handleAnswer(false)} className="bg-white border-2 border-slate-300 text-slate-500 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors">
            ندیدم
          </button>
        </div>
        
        <div className="text-center text-slate-300 text-xs mt-4 pb-2">
          {index + 1} / {TOTAL_STIMULI}
        </div>
      </div>
    </Layout>
  );
};

export default CentralFieldTest;