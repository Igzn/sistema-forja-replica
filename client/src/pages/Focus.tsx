import Layout from "@/components/Layout";
import { Plus, Clock, Play, Pause, RotateCcw, Maximize, Minus, ChevronDown, ChevronUp, Settings, FolderOpen, X, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  color: string;
  totalMinutes: number;
}

interface Session {
  id: string;
  projectName: string;
  duration: number;
  date: string;
  type: "focus" | "break";
}

const projectColors = ["#EF4444", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#F97316"];

export default function Focus() {
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFocus, setIsFocus] = useState(true);
  const [metaHours, setMetaHours] = useState(40);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectColor, setNewProjectColor] = useState("#EF4444");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            if (isFocus) {
              const sessionDuration = focusTime;
              const projName = projects.find(p => p.id === selectedProject)?.name || "Sem projeto";
              setSessions(prev => [{
                id: Date.now().toString(),
                projectName: projName,
                duration: sessionDuration,
                date: new Date().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }),
                type: "focus",
              }, ...prev]);
              if (selectedProject) {
                setProjects(prev => prev.map(p => p.id === selectedProject ? { ...p, totalMinutes: p.totalMinutes + sessionDuration } : p));
              }
              toast.success(`Sessão de foco concluída! ${sessionDuration}min 🎉`);
              setIsFocus(false);
              return breakTime * 60;
            } else {
              toast.info("Pausa concluída! Hora de focar novamente.");
              setIsFocus(true);
              return focusTime * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, isFocus, focusTime, breakTime, selectedProject, projects]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalTime = isFocus ? focusTime * 60 : breakTime * 60;
  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  const circumference = 2 * Math.PI * 120;
  const dashOffset = circumference - (progress / 100) * circumference;

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(focusTime * 60);
    setIsFocus(true);
  };

  const toggleTimer = () => {
    if (!isRunning && timeLeft === 0) {
      setTimeLeft(focusTime * 60);
      setIsFocus(true);
    }
    setIsRunning(!isRunning);
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

  const createProject = () => {
    if (!newProjectName.trim()) { toast.error("Digite o nome do projeto"); return; }
    const proj: Project = {
      id: Date.now().toString(),
      name: newProjectName,
      color: newProjectColor,
      totalMinutes: 0,
    };
    setProjects(prev => [...prev, proj]);
    setShowProjectModal(false);
    setNewProjectName("");
    toast.success(`Projeto "${newProjectName}" criado!`);
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (selectedProject === id) setSelectedProject(null);
    toast.info("Projeto removido");
  };

  const totalFocusMinutes = sessions.filter(s => s.type === "focus").reduce((sum, s) => sum + s.duration, 0);
  const totalFocusHours = (totalFocusMinutes / 60).toFixed(1);
  const metaPercent = metaHours > 0 ? Math.min(100, Math.round((totalFocusMinutes / 60 / metaHours) * 100)) : 0;

  const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const selectedProjectData = projects.find(p => p.id === selectedProject);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Fullscreen mode
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0D0D0D] flex flex-col items-center justify-center text-white">
        <button onClick={toggleFullscreen} className="absolute top-6 right-6 p-3 hover:bg-[#2a2a2a] rounded-lg transition">
          <X className="w-6 h-6" />
        </button>
        <div className="text-center mb-4">
          <span className="text-sm text-gray-400 tracking-[0.3em]">{isFocus ? 'FOCO' : 'PAUSA'}</span>
        </div>
        <div className="relative w-72 h-72 mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260">
            <circle cx="130" cy="130" r="120" fill="none" stroke="#2a2a2a" strokeWidth="6" />
            <circle cx="130" cy="130" r="120" fill="none" stroke={isFocus ? "#EF4444" : "#10B981"} strokeWidth="6"
              strokeDasharray={circumference} strokeDashoffset={dashOffset}
              strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl font-bold tracking-wider">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={reset} className="w-14 h-14 bg-[#2a2a2a] rounded-full flex items-center justify-center hover:bg-[#333] transition">
            <RotateCcw className="w-6 h-6 text-gray-400" />
          </button>
          <button onClick={toggleTimer} className={`${isFocus ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white font-bold py-4 px-10 rounded-xl flex items-center gap-3 transition text-lg`}>
            {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            {isRunning ? 'Pausar' : 'Iniciar'}
          </button>
        </div>
        {selectedProjectData && (
          <p className="mt-6 text-gray-400 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedProjectData.color }}></span>
            {selectedProjectData.name}
          </p>
        )}
      </div>
    );
  }

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
          <div className="flex justify-center mb-6 relative">
            <button onClick={() => setShowProjectSelector(!showProjectSelector)} className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition bg-[#2a2a2a] px-4 py-2 rounded-xl">
              {selectedProjectData ? (
                <>
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedProjectData.color }}></span>
                  <span>{selectedProjectData.name}</span>
                </>
              ) : (
                <span>Sem projeto</span>
              )}
              <ChevronDown className="w-4 h-4" />
            </button>
            {showProjectSelector && (
              <div className="absolute top-12 bg-[#2a2a2a] border border-[#333] rounded-xl p-2 w-48 z-10 shadow-lg">
                <button onClick={() => { setSelectedProject(null); setShowProjectSelector(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[#333] transition ${!selectedProject ? 'text-red-400' : 'text-gray-400'}`}>
                  Sem projeto
                </button>
                {projects.map(p => (
                  <button key={p.id} onClick={() => { setSelectedProject(p.id); setShowProjectSelector(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[#333] transition flex items-center gap-2 ${selectedProject === p.id ? 'text-white' : 'text-gray-400'}`}>
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: p.color }}></span>
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Timer Circle */}
          <div className="flex justify-center mb-6">
            <div className="relative w-64 h-64">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260">
                <circle cx="130" cy="130" r="120" fill="none" stroke="#2a2a2a" strokeWidth="6" />
                <circle cx="130" cy="130" r="120" fill="none" stroke={isFocus ? "#EF4444" : "#10B981"} strokeWidth="6"
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
            <button onClick={toggleTimer} className={`${isFocus ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition`}>
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isRunning ? 'Pausar' : 'Iniciar'}
            </button>
            <button onClick={toggleFullscreen} className="w-12 h-12 bg-[#2a2a2a] rounded-full flex items-center justify-center hover:bg-[#333] transition">
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
              <p className="text-xs text-gray-400">Semana 11 · março · {sessions.filter(s => s.type === "focus").length} sessões</p>
            </div>
          </div>
          <div className="text-center py-4">
            <span className="text-4xl font-bold">{totalFocusMinutes < 60 ? `${totalFocusMinutes}m` : `${totalFocusHours}h`}</span>
            <p className="text-sm text-gray-400 mt-1">de {metaHours}h</p>
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
              <span className="text-red-500 font-bold">{metaPercent}%</span>
            </div>
          </div>
          <div className="bg-[#2a2a2a] rounded-full h-2 mb-4">
            <div className="bg-red-500 h-full rounded-full transition-all duration-300" style={{ width: `${metaPercent}%` }}></div>
          </div>

          {/* Weekly chart */}
          <div className="flex items-end justify-between h-20 px-2 mb-2">
            {weekDays.map((_, i) => {
              const barH = Math.max(4, Math.random() * 4);
              return (
                <div key={i} className="flex-1 flex justify-center">
                  <div className="w-6 bg-red-500/30 rounded-t" style={{ height: `${barH}px` }}></div>
                </div>
              );
            })}
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
          <button onClick={() => setShowProjectModal(true)} className="text-red-500 hover:text-red-400 flex items-center gap-1 text-sm transition font-medium">
            <Plus className="w-4 h-4" />
            Novo
          </button>
        </div>

        {projects.length > 0 ? (
          <div className="space-y-3">
            {projects.map(proj => (
              <div key={proj.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: proj.color }}></div>
                  <div>
                    <p className="font-medium">{proj.name}</p>
                    <p className="text-xs text-gray-400">{proj.totalMinutes}min registrados</p>
                  </div>
                </div>
                <button onClick={() => deleteProject(proj.id)} className="p-1.5 hover:bg-[#2a2a2a] rounded-lg transition">
                  <Trash2 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 text-center">
            <FolderOpen className="w-10 h-10 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400">Crie um projeto para rastrear suas horas</p>
          </div>
        )}

        {/* Histórico */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
          <button onClick={() => setShowHistory(!showHistory)} className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <h3 className="font-bold">Histórico</h3>
              <span className="text-xs text-gray-500">({sessions.length})</span>
            </div>
            {showHistory ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          {showHistory && (
            <div className="mt-4 space-y-2">
              {sessions.length > 0 ? sessions.map(s => (
                <div key={s.id} className="flex items-center justify-between bg-[#2a2a2a] rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.type === "focus" ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                      {s.type === "focus" ? <Clock className="w-4 h-4 text-red-400" /> : <span className="text-green-400">☕</span>}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{s.projectName}</p>
                      <p className="text-xs text-gray-400">{s.date}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold">{s.duration}min</span>
                </div>
              )) : (
                <p className="text-center text-gray-500 py-4 text-sm">Nenhuma sessão registrada</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Novo Projeto */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center" onClick={() => setShowProjectModal(false)}>
          <div className="bg-[#1a1a1a] w-full max-w-lg rounded-t-3xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Novo Projeto</h2>
              <button onClick={() => setShowProjectModal(false)} className="p-2 hover:bg-[#2a2a2a] rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Nome do projeto *</label>
                <input type="text" value={newProjectName} onChange={e => setNewProjectName(e.target.value)} placeholder="Ex: Estudo, Trabalho..."
                  className="w-full bg-[#2a2a2a] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none transition" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Cor</label>
                <div className="flex gap-3">
                  {projectColors.map(c => (
                    <button key={c} onClick={() => setNewProjectColor(c)}
                      className={`w-9 h-9 rounded-full transition ${newProjectColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1a1a1a]' : ''}`}
                      style={{ backgroundColor: c }}></button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowProjectModal(false)} className="flex-1 bg-[#2a2a2a] text-gray-300 py-3 rounded-xl font-medium hover:bg-[#333] transition">Cancelar</button>
                <button onClick={createProject} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition">Criar Projeto</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
