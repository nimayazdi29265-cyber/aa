import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { Eye, AmslerMarkType, AmslerMark, AmslerTestResult } from '../types';
import { Undo, CheckCircle2, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// Sub-components for stages
const Intro = ({ onStart }: { onStart: (eye: Eye) => void }) => (
  <div className="flex flex-col h-full justify-center">
    <div className="bg-white p-6 rounded-2xl shadow-sm text-center mb-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">دستورالعمل</h2>
      <ul className="text-right space-y-3 text-slate-600 list-disc list-inside">
        <li>عینک مطالعه خود را بزنید.</li>
        <li>فاصله ۳۰ تا ۴۰ سانتی‌متری را حفظ کنید.</li>
        <li>یکی از چشم‌ها را با دست بپوشانید.</li>
      </ul>
    </div>
    
    <p className="text-center mb-4 font-medium text-slate-700">کدام چشم را تست می‌کنید؟</p>
    <div className="grid grid-cols-2 gap-4">
      <button 
        onClick={() => onStart(Eye.RIGHT)}
        className="bg-blue-600 text-white py-4 rounded-xl font-bold shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
      >
        چشم راست
      </button>
      <button 
        onClick={() => onStart(Eye.LEFT)}
        className="bg-blue-600 text-white py-4 rounded-xl font-bold shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
      >
        چشم چپ
      </button>
    </div>
  </div>
);

const Result = ({ result, onRetry }: { result: AmslerTestResult; onRetry: () => void }) => (
  <div className="flex flex-col h-full items-center justify-center p-4">
    <CheckCircle2 size={64} className="text-green-500 mb-6" />
    <h2 className="text-2xl font-bold text-slate-800 mb-2">تست پایان یافت</h2>
    <p className="text-slate-500 mb-8">نتایج شما ثبت گردید.</p>
    
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
      <div className="p-4 border-b border-slate-100 flex justify-between">
        <span className="text-slate-500">چشم تست شده</span>
        <span className="font-bold">{result.eyeTested === Eye.RIGHT ? 'راست' : 'چپ'}</span>
      </div>
      <div className="p-4 border-b border-slate-100 flex justify-between">
        <span className="text-slate-500">تعداد علامت‌ها</span>
        <span className="font-bold">{result.marks.length}</span>
      </div>
      <div className="p-4 border-b border-slate-100 flex justify-between">
        <span className="text-slate-500">عدم تمرکز</span>
        <span className="font-bold text-red-500">{result.fixationLossCount} بار</span>
      </div>
      <div className="p-4 flex justify-between bg-slate-50">
        <span className="text-slate-500">امتیاز اطمینان</span>
        <span className="font-bold text-blue-600">{Math.round(result.reliabilityScore * 100)}%</span>
      </div>
    </div>

    <button 
      onClick={onRetry}
      className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold hover:bg-slate-900 active:scale-95 transition-all"
    >
      بازگشت به خانه
    </button>
  </div>
);

const Test = ({ 
  eye, 
  onFinish 
}: { 
  eye: Eye; 
  onFinish: (res: AmslerTestResult) => void 
}) => {
  const [marks, setMarks] = useState<AmslerMark[]>([]);
  const [selectedType, setSelectedType] = useState<AmslerMarkType>(AmslerMarkType.DISTORTION);
  const [fixationLoss, setFixationLoss] = useState(0);
  const [startTime] = useState(Date.now());
  const [blink, setBlink] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fixation blink simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Random blink logic simulation
      if (Math.random() > 0.7) {
        setBlink(true);
        setTimeout(() => setBlink(false), 200);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Draw Grid
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const gridLines = 20;
    const cellSize = size / gridLines;

    ctx.clearRect(0, 0, size, size);
    
    // Background
    ctx.fillStyle = '#f8fafc'; // light slate
    ctx.fillRect(0, 0, size, size);

    // Grid Lines
    ctx.strokeStyle = '#cbd5e1'; // slate-300
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= gridLines; i++) {
      const pos = i * cellSize;
      // Vert
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, size);
      ctx.stroke();
      // Horiz
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(size, pos);
      ctx.stroke();
    }

    // Diagonals (optional for standard Amsler, usually just grid, but let's stick to grid)
    
    // Center Dot
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size * 0.015, 0, Math.PI * 2);
    ctx.fillStyle = blink ? '#ef4444' : '#0f172a'; // Red if blinking
    ctx.fill();

    // Marks
    marks.forEach(mark => {
      const x = mark.x * size;
      const y = mark.y * size;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      
      if (mark.type === AmslerMarkType.DISTORTION) ctx.fillStyle = 'rgba(37, 99, 235, 0.7)'; // Blue
      else if (mark.type === AmslerMarkType.SCOTOMA_DARK) ctx.fillStyle = 'rgba(15, 23, 42, 0.8)'; // Dark
      else if (mark.type === AmslerMarkType.SCOTOMA_LIGHT) ctx.fillStyle = 'rgba(251, 191, 36, 0.8)'; // Yellow/Light
      
      ctx.fill();
    });

  }, [marks, blink]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Check center tap for fixation loss ack? 
    // Simplified: Just add mark logic
    // Distance from center
    const dx = x - 0.5;
    const dy = y - 0.5;
    const dist = Math.sqrt(dx*dx + dy*dy);
    
    if (dist < 0.05 && blink) {
      setFixationLoss(prev => prev + 1);
    } else {
      setMarks([...marks, { x, y, type: selectedType }]);
    }
  };

  const handleFinish = () => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    // Calculate reliability (simple mock logic based on ViewModel)
    let score = 1.0;
    if (duration < 10000) score -= 0.4;
    if (fixationLoss > 2) score -= 0.2;
    
    onFinish({
      sessionId: uuidv4(),
      eyeTested: eye,
      marks,
      fixationLossCount: fixationLoss,
      durationMillis: duration,
      startTimestamp: startTime,
      endTimestamp: endTime,
      reliabilityScore: Math.max(0, score)
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
         <span className="text-sm font-bold bg-slate-200 px-3 py-1 rounded-full text-slate-700">
           {eye === Eye.RIGHT ? 'چشم راست' : 'چشم چپ'}
         </span>
         <button 
          onClick={() => setMarks(prev => prev.slice(0, -1))}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-full"
         >
           <Undo size={20} />
         </button>
      </div>

      <div className="relative w-full aspect-square bg-slate-100 rounded-xl overflow-hidden shadow-inner border border-slate-200 mb-4" ref={containerRef}>
        <canvas 
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full h-full cursor-crosshair touch-none"
          onClick={handleCanvasClick}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { type: AmslerMarkType.DISTORTION, label: 'کجی', color: 'bg-blue-500' },
          { type: AmslerMarkType.SCOTOMA_DARK, label: 'تیره', color: 'bg-slate-800' },
          { type: AmslerMarkType.SCOTOMA_LIGHT, label: 'روشن', color: 'bg-amber-400' },
        ].map(opt => (
          <button
            key={opt.type}
            onClick={() => setSelectedType(opt.type)}
            className={`py-2 px-1 rounded-lg text-sm font-medium transition-all ${
              selectedType === opt.type 
                ? `${opt.color} text-white shadow-md scale-105` 
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-slate-400 text-center mb-4">
        به نقطه مرکزی نگاه کنید. اگر پلک زد، آن را لمس کنید. 
        <br/>
        برای ثبت اختلال، روی شبکه ضربه بزنید.
      </p>

      <button 
        onClick={handleFinish}
        className="mt-auto w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700"
      >
        پایان تست
      </button>
    </div>
  );
};

const AmslerTest: React.FC = () => {
  const [step, setStep] = useState<'intro' | 'test' | 'result'>('intro');
  const [eye, setEye] = useState<Eye>(Eye.RIGHT);
  const [result, setResult] = useState<AmslerTestResult | null>(null);

  return (
    <Layout title="تست آمسلر">
      {step === 'intro' && <Intro onStart={(e) => { setEye(e); setStep('test'); }} />}
      {step === 'test' && <Test eye={eye} onFinish={(res) => { setResult(res); setStep('result'); }} />}
      {step === 'result' && result && <Result result={result} onRetry={() => setStep('intro')} />}
    </Layout>
  );
};

export default AmslerTest;