import Layout from "@/components/Layout";
import { Plus, ChevronLeft, ChevronRight, Calendar, X, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
  dayIndex: number;
  recurrent: boolean;
  days: number[];
}

const priorityColors: Record<string, { bg: string; text: string; dot: string }> = {
  "Alta": { bg: "bg-red-500/10 border-red-500/30", text: "text-red-400", dot: "bg-red-500" },
  "Média": { bg: "bg-yellow-500/10 border-yellow-500/30", text: "text-yellow-400", dot: "bg-yellow-500" },
  "Baixa": { bg: "bg-green-500/10 border-green-500/30", text: "text-green-400", dot: "bg-green-500" },
};

export default function Tasks() {
  const [showModal, setShowModal] = useState(false);
  const [targetDay, setTargetDay] = useState(0);
  const [recurrent, setRecurrent] = useState(false);
  const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5]);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState("Média");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState("hoje");

  const days = [
    { date: 8, day: "Domingo", month: "Março" },
    { date: 9, day: "Segunda-Feira", month: "Março" },
    { date: 10, day: "Terça-Feira", month: "Março" },
    { date: 11, day: "Quarta-Feira", month: "Março" },
    { date: 12, day: "Quinta-Feira", month: "Março" },
    { date: 13, day: "Sexta-Feira", month: "Março" },
    { date: 14, day: "Sábado", month: "Março" },
  ];
  const weekDayLabels = ["D", "S", "T", "Q", "Q", "S", "S"];

  const toggleDay = (i: number) => {
    setSelectedDays(prev => prev.includes(i) ? prev.filter(d => d !== i) : [...prev, i]);
  };

  const createTask = () => {
    if (!newTitle.trim()) { toast.error("Digite o título da tarefa"); return; }
    if (recurrent) {
      selectedDays.forEach(dayIdx => {
        const task: Task = {
          id: Date.now().toString() + dayIdx,
          title: newTitle, description: newDesc, priority: newPriority,
          completed: false, dayIndex: dayIdx, recurrent: true, days: selectedDays,
        };
        setTasks(prev => [...prev, task]);
      });
      toast.success(`Tarefa recorrente "${newTitle}" criada para ${selectedDays.length} dias!`);
    } else {
      const task: Task = {
        id: Date.now().toString(),
        title: newTitle, description: newDesc, priority: newPriority,
        completed: false, dayIndex: targetDay, recurrent: false, days: [],
      };
      setTasks(prev => [...prev, task]);
      toast.success(`Tarefa "${newTitle}" criada para ${days[targetDay].day}!`);
    }
    setShowModal(false);
    setNewTitle(""); setNewDesc(""); setNewPriority("Média"); setRecurrent(false);
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const newCompleted = !t.completed;
        if (newCompleted) toast.success("Tarefa concluída! +10 XP 🎉");
        return { ...t, completed: newCompleted };
      }
      return t;
    }));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    toast.info("Tarefa removida");
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;

  return (
    <Layout>
      <div className="px-4 py-4 max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Tarefas</h1>
              <p className="text-sm text-gray-400">{completedTasks}/{totalTasks} concluídas</p>
            </div>
          </div>
          <button onClick={() => { setShowModal(true); setTargetDay(0); }} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition text-sm">
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-1.5 rounded-xl flex gap-1">
          <button onClick={() => setActiveTab("hoje")} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'hoje' ? 'bg-[#2a2a2a] text-white' : 'text-gray-400 hover:text-gray-300'}`}>
            <Calendar className="w-4 h-4" /> Hoje
          </button>
          <button onClick={() => setActiveTab("mes")} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'mes' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-gray-300'}`}>
            <Calendar className="w-4 h-4" /> Mês
          </button>
          <button onClick={() => setActiveTab("alertas")} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'alertas' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-gray-300'}`}>
            <AlertTriangle className="w-4 h-4" /> Alertas
          </button>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition"><ChevronLeft className="w-5 h-5" /></button>
          <p className="text-gray-400 font-medium">Semana 11 · Março</p>
          <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition"><ChevronRight className="w-5 h-5" /></button>
        </div>

        {/* Tab Hoje - Task Days */}
        {activeTab === "hoje" && (
          <div className="space-y-3">
            {days.map((day, dayIdx) => {
              const dayTasks = tasks.filter(t => t.dayIndex === dayIdx);
              return (
                <div key={day.date} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-2xl font-bold">{day.date}</h3>
                      <p className="text-sm text-gray-400">{day.day}</p>
                    </div>
                    <button onClick={() => { setShowModal(true); setTargetDay(dayIdx); }} className="text-red-500 hover:text-red-400 transition">
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                  {dayTasks.length > 0 ? (
                    <div className="space-y-2">
                      {dayTasks.map(task => {
                        const prio = priorityColors[task.priority] || priorityColors["Média"];
                        return (
                          <div key={task.id} className={`flex items-center gap-3 p-3 rounded-xl border ${task.completed ? 'bg-green-500/5 border-green-500/20' : `${prio.bg}`} transition`}>
                            <button onClick={() => toggleTask(task.id)}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                                task.completed ? 'bg-green-500 border-green-500' : 'border-gray-500 hover:border-red-500'
                              }`}>
                              {task.completed && <span className="text-white text-xs">✓</span>}
                            </button>
                            <div className="flex-1">
                              <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</p>
                              {task.description && <p className="text-xs text-gray-500">{task.description}</p>}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${prio.dot}`}></span>
                              <button onClick={() => deleteTask(task.id)} className="text-gray-500 hover:text-red-400 transition text-xs">✕</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-center text-gray-600 py-4 text-sm">Nenhuma tarefa para este dia</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab Mês */}
        {activeTab === "mes" && (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5 text-center">
            <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">Visão mensal das tarefas</p>
            <p className="text-sm text-gray-500 mt-2">{totalTasks} tarefas criadas · {completedTasks} concluídas</p>
          </div>
        )}

        {/* Tab Alertas */}
        {activeTab === "alertas" && (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5 text-center">
            <AlertTriangle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">Nenhum alerta pendente</p>
            <p className="text-sm text-gray-500 mt-2">Alertas de tarefas atrasadas aparecerão aqui</p>
          </div>
        )}
      </div>

      {/* Modal Nova Tarefa */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center" onClick={() => setShowModal(false)}>
          <div className="bg-[#1a1a1a] w-full max-w-lg rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Nova Tarefa</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[#2a2a2a] rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Título *</label>
                <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="O que precisa ser feito?"
                  className="w-full bg-[#2a2a2a] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none transition" />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Descrição</label>
                <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Detalhes adicionais..." rows={3}
                  className="w-full bg-[#2a2a2a] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none transition resize-none" />
              </div>

              {/* Tarefa Recorrente */}
              <div className="flex items-center justify-between bg-[#2a2a2a] rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center"><span className="text-red-500">🔄</span></div>
                  <div><p className="font-medium">Tarefa Recorrente</p><p className="text-xs text-gray-400">Repetir em dias específicos</p></div>
                </div>
                <button onClick={() => setRecurrent(!recurrent)} className={`w-12 h-7 rounded-full transition-colors ${recurrent ? 'bg-red-500' : 'bg-[#444]'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${recurrent ? 'translate-x-6' : 'translate-x-1'}`}></div>
                </button>
              </div>

              {/* Dias da semana */}
              {recurrent && (
                <div>
                  <p className="text-sm text-gray-400 mb-3">Dias da semana</p>
                  <div className="flex gap-2">
                    {weekDayLabels.map((d, i) => (
                      <button key={i} onClick={() => toggleDay(i)}
                        className={`w-10 h-10 rounded-lg font-bold text-sm transition ${selectedDays.includes(i) ? 'bg-red-500 text-white' : 'bg-[#2a2a2a] text-gray-500 hover:bg-[#333]'}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Prioridade */}
              <div>
                <p className="text-sm text-gray-400 mb-2">Prioridade</p>
                <div className="flex gap-2">
                  {["Alta", "Média", "Baixa"].map(p => {
                    const prio = priorityColors[p];
                    return (
                      <button key={p} onClick={() => setNewPriority(p)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition border ${
                          newPriority === p ? `${prio.bg} ${prio.text}` : 'bg-[#2a2a2a] border-[#333] text-gray-400 hover:bg-[#333]'
                        }`}>
                        <span className={`w-2 h-2 rounded-full ${prio.dot}`}></span>
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 bg-[#2a2a2a] text-gray-300 py-3 rounded-xl font-medium hover:bg-[#333] transition">Cancelar</button>
                <button onClick={createTask} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition">Criar Tarefa</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
