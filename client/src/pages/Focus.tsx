import Layout from "@/components/Layout";
import { Plus, Clock, Play, Pause, RotateCcw, Maximize, Minus, ChevronDown, Settings, FolderOpen } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Focus() {
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFocus, setIsFocus] = useState(true);
  const [metaHours, setMetaHours] = useState(40);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalTime = isFocus ? focusTime * 60 : breakTime * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const circumference = 2 * Math.PI * 120;
  const dashOffset = circumference - (progress / 100) * circumference;

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(focusTime * 60);
    setIsFocus(true);
  };

  const adjustFocus = (delta: number) => {
    const newVal = Math.max(1, Math.min(120, focusTime + delta));
    setFocusTime(newVal);
    if (!isRunning && isFocus) setTimeLeft(newVal * 60);
  };

  const adjustBreak = (delta: number) => {
    const newVal = Math.max(1, Math.min(60, breakTime + delta));
    setBreakTime(newVal);
    if (!isRunning && !isFocus) setTimeLeft(newVal * 60);
  };

  const weekDays = ["Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  return (
    <Layout>
      <div className="px-4 py-4 max-w-2xl mx-auto space-y-4">

        {/* Timer Card */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
          {/* Controls */}
          <div className="flex items-center justify-center gap-8 mb-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <button onClick={() => adjustFocus(-5)} className="w-8 h-8 bg-[#2a2a2a] rounded-lg flex items-center justify-center hover:bg-[#333] transition">
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-xl font-bold w-8 text-center">{focusTime}</span>
              <button onClick={() => adjustFocus(5)} className="w-8 h-8 bg-[#2a2a2a] rounded-lg flex items-center justify-center hover:bg-[#333] transition">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400">☕</span>
              <button onClick={() => adjustBreak(-1)} className="w-8 h-8 bg-[#2a2a2a] rounded-lg flex items-center justify-center hover:bg-[#333] transition">
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-xl font-bold w-8 text-center">{breakTime}</span>
              <button onClick={() => adjustBreak(1)} className="w-8 h-8 bg-[#2a2a2a] rounded-lg flex items-center justify-center hover:bg-[#333] transition">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Project selector */}
          <div className="flex justify-center mb-6">
            <button className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition">
              <span>Sem projeto</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Timer Circle */}
          <div className="flex justify-center mb-6">
            <div className="relative w-64 h-64">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260">
                <circle cx="130" cy="130" r="120" fill="none" stroke="#2a2a2a" strokeWidth="6" />
                <circle cx="130" cy="130" r="120" fill="none" stroke="#EF4444" strokeWidth="6"
                  strokeDasharray={circumference} strokeDashoffset={dashOffset}
                  strokeLinecap="round" className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-bold tracking-wider">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
                <span className="text-sm text-gray-400 tracking-[0.3em] mt-1">{isFocus ? 'FOCO' : 'PAUSA'}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-6">
            <button onClick={reset} className="w-12 h-12 bg-[#2a2a2a] rounded-full flex items-center justify-center hover:bg-[#333] transition">
              <RotateCcw className="w-5 h-5 text-gray-400" />
            </button>
            <button onClick={() => setIsRunning(!isRunning)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition">
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isRunning ? 'Pausar' : 'Iniciar'}
            </button>
            <button className="w-12 h-12 bg-[#2a2a2a] rounded-full flex items-center justify-center hover:bg-[#333] transition">
              <Maximize className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Horas de Foco */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-bold">Horas de Foco</h3>
              <p className="text-xs text-gray-400">Semana 2 · março · 0 sessões</p>
            </div>
          </div>
          <div className="text-center py-4">
            <span className="text-4xl font-bold">0m</span>
            <p className="text-sm text-gray-400 mt-1">de 40h</p>
          </div>

          {/* Meta */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Meta</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setMetaHours(Math.max(1, metaHours - 5))} className="w-7 h-7 bg-[#2a2a2a] rounded flex items-center justify-center hover:bg-[#333] transition">
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-bold">{metaHours}h</span>
              <button onClick={() => setMetaHours(metaHours + 5)} className="w-7 h-7 bg-[#2a2a2a] rounded flex items-center justify-center hover:bg-[#333] transition">
                <Plus className="w-3 h-3" />
              </button>
              <span className="text-red-500 font-bold">0%</span>
            </div>
          </div>
          <div className="bg-[#2a2a2a] rounded-full h-2 mb-4">
            <div className="bg-red-500 h-full rounded-full" style={{ width: '0%' }}></div>
          </div>

          {/* Weekly chart */}
          <div className="relative h-24 mb-2">
            <div className="absolute inset-0 flex items-end justify-between px-2">
              {weekDays.map((_, i) => (
                <div key={i} className="flex-1 flex justify-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-1.5 left-2 right-2 h-0.5 bg-red-500"></div>
          </div>
          <div className="flex justify-between px-2">
            {weekDays.map(d => <span key={d} className="text-xs text-gray-500 flex-1 text-center">{d}</span>)}
          </div>
        </div>

        {/* Projetos */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-gray-400" />
            <h3 className="font-bold text-lg">Projetos</h3>
          </div>
          <button className="text-gray-400 hover:text-white flex items-center gap-1 text-sm transition">
            <Plus className="w-4 h-4" />
            Novo
          </button>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 text-center">
          <p className="text-gray-400">Crie um projeto para rastrear suas horas</p>
        </div>

        {/* Histórico */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
          <button className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <h3 className="font-bold">Histórico</h3>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </Layout>
  );
}
