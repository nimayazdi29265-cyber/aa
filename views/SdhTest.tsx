import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { SdhTrial } from '../types';

const MAX_TRIALS = 20;

const SdhTest: React.FC = () => {
  const [finished, setFinished] = useState(false);
  const [trialIndex, setTrialIndex] = useState(0);
  const [currentTrial, setCurrentTrial] = useState<SdhTrial | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateTrial = (idx: number) => ({
    trialIndex: idx,
    hiddenSegment: Math.floor(Math.random() * 3)
  });

  useEffect(() => {
    setCurrentTrial(generateTrial(0));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentTrial) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const segments = 3;
    const segmentWidth = w / segments;
    const centerY = h / 2;
    const dotSpacing = 18;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#000';

    for (let x = 0; x < w; x += dotSpacing) {
      const segIndex = Math.floor(x / segmentWidth);
      // Logic: Hidden segment has NO dots or fewer dots.
      // Kotlin code: `if (visible) drawCircle`
      const visible = segIndex !== currentTrial.hiddenSegment;
      
      if (visible) {
        ctx.beginPath();
        ctx.arc(x, centerY, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [currentTrial]);

  const handleAnswer = (segmentIndex: number) => {
    if (!currentTrial) return;
    
    if (segmentIndex === currentTrial.hiddenSegment) {
      setCorrectCount(prev => prev + 1);
    }

    const nextIdx = trialIndex + 1;
    if (nextIdx >= MAX_TRIALS) {
      setFinished(true);
    } else {
      setTrialIndex(nextIdx);
      setCurrentTrial(generateTrial(nextIdx));
    }
  };

  if (finished) {
    return (
      <Layout title="نتیجه SDH">
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="bg-white p-8 rounded-2xl shadow-md w-full text-center">
            <h2 className="text-xl font-bold mb-4 text-slate-800">تست تکمیل شد</h2>
            <div className="relative size-32 mx-auto mb-6">
               <svg className="size-full" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="text-indigo-500"
                    strokeDasharray={`${(correctCount / MAX_TRIALS) * 100}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-slate-700">
                  {correctCount}/{MAX_TRIALS}
                </div>
            </div>
            <p className="text-slate-600">پاسخ‌های صحیح</p>
          </div>
          <button onClick={() => window.location.reload()} className="mt-8 bg-indigo-600 text-white w-full py-3 rounded-xl font-bold">تکرار تست</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="تست SDH">
      <div className="flex flex-col h-full">
        <p className="text-slate-600 mb-8 text-center px-4 font-medium mt-4">
          در کدام بخش خط نقطه‌چین، <b>خلأ</b> یا <b>نبود نقطه</b> مشاهده می‌کنید؟
        </p>

        <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 h-40 flex items-center justify-center mb-8 overflow-hidden">
            <canvas ref={canvasRef} width={350} height={160} className="w-full h-full" />
        </div>

        <div className="grid grid-cols-3 gap-4 w-full">
            <button onClick={() => handleAnswer(2)} className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 h-24 rounded-xl flex items-center justify-center font-bold text-lg text-indigo-800 transition-colors">
              چپ
            </button>
            <button onClick={() => handleAnswer(1)} className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 h-24 rounded-xl flex items-center justify-center font-bold text-lg text-indigo-800 transition-colors">
              وسط
            </button>
            <button onClick={() => handleAnswer(0)} className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 h-24 rounded-xl flex items-center justify-center font-bold text-lg text-indigo-800 transition-colors">
              راست
            </button>
        </div>

        <div className="mt-auto text-center text-slate-400 text-sm pb-4">
          تست {trialIndex + 1} از {MAX_TRIALS}
        </div>
      </div>
    </Layout>
  );
};

export default SdhTest;