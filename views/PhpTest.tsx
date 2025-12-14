import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { PhpTrial } from '../types';
import { Check, X } from 'lucide-react';

// Constants matching Kotlin logic
const MAX_TRIALS = 32;
const MAX_REVERSALS = 6;
const MIN_OFFSET = 0.02;
const MAX_OFFSET = 0.4;
const LOG_STEP = 0.357;

const PhpTest: React.FC = () => {
  // State
  const [finished, setFinished] = useState(false);
  const [trialIndex, setTrialIndex] = useState(0);
  const [currentTrial, setCurrentTrial] = useState<PhpTrial | null>(null);
  const [correctInRow, setCorrectInRow] = useState(0);
  const [reversals, setReversals] = useState(0);
  const [directionIsDown, setDirectionIsDown] = useState(true); // reducing offset
  const [reversalOffsets, setReversalOffsets] = useState<number[]>([]);
  
  // Canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stepLog = (current: number, down: boolean) => {
    const log = Math.log(current);
    const newLog = down ? log - LOG_STEP : log + LOG_STEP;
    const raw = Math.exp(newLog);
    return Math.max(MIN_OFFSET, Math.min(MAX_OFFSET, raw));
  };

  const generateTrial = (idx: number, offset: number) => {
    return {
      trialIndex: idx,
      offsetSegment: Math.floor(Math.random() * 3), // 0, 1, 2
      offsetAmount: offset
    };
  };

  // Init
  useEffect(() => {
    setCurrentTrial(generateTrial(0, 0.25));
  }, []);

  // Draw Line
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentTrial) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const segments = 3;
    const segmentWidth = w / segments;
    const yBase = h / 2;
    const dotSpacing = 18;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#000';

    for (let x = 0; x < w; x += dotSpacing) {
      const segIndex = Math.min(segments - 1, Math.floor(x / segmentWidth));
      let offsetY = 0;

      if (segIndex === currentTrial.offsetSegment) {
        // Sine wave distortion simulation
        const ampPx = currentTrial.offsetAmount * (h / 4); 
        // Normalize x within the segment to 0..1 then to 0..2PI
        const xInSeg = (x % segmentWidth) / segmentWidth; 
        offsetY = ampPx * Math.sin(x / w * Math.PI * 4); // simplified wave across width
        
        // Better implementation matching description:
        // usually it's a Gaussian bump or localized distortion. 
        // The kotlin code used: `ampPx * sin((x / w) * PI * 2)` which is one big wave.
        // Let's stick to the Kotlin logic port:
        offsetY = ampPx * Math.sin((x / w) * Math.PI * 2);
      }

      ctx.beginPath();
      ctx.arc(x, yBase + offsetY, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw segment dividers (optional helper)
    ctx.strokeStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(w/3, 0); ctx.lineTo(w/3, h);
    ctx.moveTo(2*w/3, 0); ctx.lineTo(2*w/3, h);
    ctx.stroke();

  }, [currentTrial]);

  const handleAnswer = (segmentIndex: number) => {
    if (!currentTrial || finished) return;

    const correct = segmentIndex === currentTrial.offsetSegment;
    
    let nextCorrectInRow = correctInRow;
    let nextDirectionIsDown = directionIsDown;
    let nextReversals = reversals;
    let nextReversalOffsets = [...reversalOffsets];
    let newOffset = currentTrial.offsetAmount;

    // Staircase logic
    if (correct) {
      nextCorrectInRow += 1;
      if (nextCorrectInRow >= 2) {
        // 2 correct in a row -> make it harder (reduce offset)
        const oldDir = directionIsDown;
        nextDirectionIsDown = true;
        newOffset = stepLog(currentTrial.offsetAmount, true);
        if (!oldDir) {
           // Reversal occurred
           nextReversals++;
           nextReversalOffsets.push(currentTrial.offsetAmount);
        }
        nextCorrectInRow = 0;
      }
    } else {
      // Incorrect -> make it easier (increase offset)
      nextCorrectInRow = 0;
      const oldDir = directionIsDown;
      nextDirectionIsDown = false;
      newOffset = stepLog(currentTrial.offsetAmount, false);
      if (oldDir) {
        nextReversals++;
        nextReversalOffsets.push(currentTrial.offsetAmount);
      }
    }

    setCorrectInRow(nextCorrectInRow);
    setDirectionIsDown(nextDirectionIsDown);
    setReversals(nextReversals);
    setReversalOffsets(nextReversalOffsets);

    const nextTrialIdx = trialIndex + 1;
    if (nextTrialIdx >= MAX_TRIALS || nextReversals >= MAX_REVERSALS) {
      setFinished(true);
    } else {
      setTrialIndex(nextTrialIdx);
      setCurrentTrial(generateTrial(nextTrialIdx, newOffset));
    }
  };

  const getResult = () => {
    if (reversalOffsets.length < 1) return null;
    const relevant = reversalOffsets.slice(-4);
    const sum = relevant.reduce((a, b) => a + b, 0);
    return sum / relevant.length;
  };

  if (finished) {
    const score = getResult();
    return (
      <Layout title="نتیجه PHP">
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="bg-white p-8 rounded-2xl shadow-md w-full text-center">
             <h2 className="text-xl font-bold mb-4 text-slate-800">تست تکمیل شد</h2>
             <p className="text-slate-500 mb-6">آستانه تشخیص هایپرکیوتی شما:</p>
             <div className="text-4xl font-black text-teal-600 mb-2">
               {score ? score.toFixed(3) : 'نامشخص'}
             </div>
             <p className="text-xs text-slate-400">مقادیر کمتر نشان‌دهنده دقت بالاتر است.</p>
          </div>
          <button onClick={() => window.location.reload()} className="mt-8 text-slate-600 font-bold">تکرار تست</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="تست PHP">
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col justify-center items-center">
          <p className="text-slate-600 mb-8 text-center px-4 font-medium">
            در کدام قسمت خط نقطه‌چین، انحراف یا موج‌دار بودن بیشتری مشاهده می‌کنید؟
          </p>
          
          <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 h-40 flex items-center justify-center mb-8 overflow-hidden">
            <canvas ref={canvasRef} width={350} height={160} className="w-full h-full" />
          </div>

          <div className="grid grid-cols-3 gap-4 w-full">
            <button onClick={() => handleAnswer(2)} className="bg-slate-100 hover:bg-slate-200 h-24 rounded-xl flex items-center justify-center font-bold text-lg text-slate-700 transition-colors">
              چپ
            </button>
            <button onClick={() => handleAnswer(1)} className="bg-slate-100 hover:bg-slate-200 h-24 rounded-xl flex items-center justify-center font-bold text-lg text-slate-700 transition-colors">
              وسط
            </button>
            <button onClick={() => handleAnswer(0)} className="bg-slate-100 hover:bg-slate-200 h-24 rounded-xl flex items-center justify-center font-bold text-lg text-slate-700 transition-colors">
              راست
            </button>
          </div>
        </div>
        
        <div className="py-4 text-center text-slate-400 text-sm">
          تست {trialIndex + 1} از {MAX_TRIALS}
        </div>
      </div>
    </Layout>
  );
};

export default PhpTest;