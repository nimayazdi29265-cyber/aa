import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';

const SPACINGS = [0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1.0, 1.2, 1.5, 2.0];
const MAX_TRIALS = 15;
const MAX_REVERSALS = 4;

const MChartTest: React.FC = () => {
  const [finished, setFinished] = useState(false);
  const [spacingIndex, setSpacingIndex] = useState(6);
  const [trials, setTrials] = useState(0);
  const [reversals, setReversals] = useState(0);
  const [reversalSpacings, setReversalSpacings] = useState<number[]>([]);
  const [lastDirectionUp, setLastDirectionUp] = useState<boolean | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const y = h / 2;
    const dotRadius = 4;
    // Current spacing factor
    const spacingFactor = SPACINGS[spacingIndex];
    // Convert to pixels (arbitrary scale for visual)
    const pxSpacing = Math.max(6, spacingFactor * 20); 

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#000';

    for (let x = 0; x < w; x += pxSpacing) {
      ctx.beginPath();
      ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [spacingIndex]);

  const handleAnswer = (isBent: boolean) => {
    let directionUp: boolean; // Up means increasing spacing (making it easier to see separate dots, or harder?) 
    // Logic: 
    // If user sees it "Bent/Distorted" (Problem), we usually increase spacing to find where it becomes straight? 
    // OR: M-Chart measures the minimum visual angle where the distortion disappears.
    // If "Bent" -> Increase spacing (make dots further apart). 
    // If "Straight" -> Decrease spacing (make dots closer, harder to distinguish straightness).
    
    // Kotlin logic: 
    // if(isBent) { dir=false; index = max(0, index-1) } -> Decreasing index?
    // SPACINGS are [0.2 ... 2.0]. 0.2 is close (solid line-ish). 2.0 is far (dots).
    // If I see it bent, I have metamorphopsia. 
    // Actually, usually coarser dots (larger spacing) make the distortion disappear. 
    // The Kotlin logic says: isBent -> index - 1. This means moving to SMALLER spacing. 
    // This implies that user is supposed to find the point where it BECOMES bent? 
    // Let's strictly follow Kotlin logic provided.
    
    let newIndex = spacingIndex;
    
    if (isBent) {
      directionUp = false; 
      newIndex = Math.max(0, spacingIndex - 1);
    } else {
      directionUp = true;
      newIndex = Math.min(SPACINGS.length - 1, spacingIndex + 1);
    }

    let nextReversals = reversals;
    let nextReversalSpacings = [...reversalSpacings];

    if (lastDirectionUp !== null && lastDirectionUp !== directionUp) {
      nextReversals++;
      nextReversalSpacings.push(SPACINGS[spacingIndex]);
    }

    const nextTrials = trials + 1;
    if (nextTrials >= MAX_TRIALS || nextReversals >= MAX_REVERSALS) {
      setFinished(true);
      setReversalSpacings(nextReversalSpacings);
    } else {
      setSpacingIndex(newIndex);
      setTrials(nextTrials);
      setReversals(nextReversals);
      setReversalSpacings(nextReversalSpacings);
      setLastDirectionUp(directionUp);
    }
  };

  const getScore = () => {
     if (reversalSpacings.length === 0) return null;
     const sum = reversalSpacings.reduce((a,b)=>a+b,0);
     return sum / reversalSpacings.length;
  };

  if (finished) {
    const score = getScore();
    return (
      <Layout title="نتیجه M-Chart">
        <div className="flex flex-col items-center justify-center h-full p-4">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 text-center w-full">
             <h2 className="text-xl font-bold text-slate-800 mb-4">نتیجه نهایی</h2>
             <div className="text-5xl font-black text-orange-500 mb-2">
               {score ? score.toFixed(2) : '---'}
             </div>
             <p className="text-slate-500 text-sm">درجه متامورفوپسی (M-Score)</p>
           </div>
           <button onClick={() => window.location.reload()} className="mt-8 bg-slate-800 text-white w-full py-3 rounded-xl font-bold">تکرار تست</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="تست M-Chart">
      <div className="flex flex-col h-full">
        <p className="text-slate-600 mb-8 text-center px-4 font-medium mt-4 leading-relaxed">
          به خط نقطه‌چین نگاه کنید.<br/>
          آیا خط را <b>کاملاً صاف</b> می‌بینید یا <b>کج و شکسته</b>؟
        </p>

        <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 h-40 flex items-center justify-center mb-8">
            <canvas ref={canvasRef} width={350} height={120} className="w-full h-full" />
        </div>

        <div className="flex gap-4 w-full mt-auto mb-8">
            <button onClick={() => handleAnswer(false)} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold shadow-green-200 shadow-lg active:scale-95 transition-all">
              صاف
            </button>
            <button onClick={() => handleAnswer(true)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-bold shadow-red-200 shadow-lg active:scale-95 transition-all">
              کج / شکسته
            </button>
        </div>
        
        <div className="text-center text-slate-300 text-xs pb-2">
          مرحله {trials + 1}
        </div>
      </div>
    </Layout>
  );
};

export default MChartTest;