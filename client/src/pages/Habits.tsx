import Layout from "@/components/Layout";
import { useNotifications } from "@/contexts/NotificationContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Plus, ChevronLeft, ChevronRight, Calendar, LayoutGrid, TrendingUp, X } from "lucide-react";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

const monthData = Array.from({ length: 31 }, (_, i) => ({ day: i + 1, value: 0 }));

interface Habit {
  id: string;
  name: string;
  icon: string;
  frequency: string;
  target: number;
  progress: number;
}

export default function Habits() {
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState("hoje");
  const [showModal, setShowModal] = useState(false);
  const [habits, setHabits] = useLocalStorage<Habit[]>("life-habits", [
    { id: "1", name: "Beber Água", icon: "💧", frequency: "Diário", target: 8, progress: 0 },
  ]);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitIcon, setNewHabitIcon] = useState("💪");
  const [newHabitTarget, setNewHabitTarget] = useState(1);
  const [newHabitFrequency, setNewHabitFrequency] = useState("Diário");
  const [productivity, setProductivity] = useState<number | null>(null);
  const [humor, setHumor] = useState<number | null>(null);

  const toggleHabitProgress = (habitId: string, index: number) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const newProgress = index < h.progress ? index : index + 1;
        if (newProgress === h.target) {
          toast.success(`${h.name} concluído! +10 XP 🎉`);
          addNotification({ type: 'habit', title: `${h.name} Concluído!`, message: `Você completou o hábito "${h.name}" hoje! +10 XP ganhos.`, icon: h.icon, color: 'text-green-400' });
        }
        return { ...h, progress: newProgress };
      }
      return h;
    }));
  };

  const createHabit = () => {
    if (!newHabitName.trim()) {
      toast.error("Digite o nome do hábito");
      return;
    }
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName,
      icon: newHabitIcon,
      frequency: newHabitFrequency,
      target: newHabitTarget,
      progress: 0,
    };
    setHabits(prev => [...prev, newHabit]);
    setShowModal(false);
    setNewHabitName("");
    setNewHabitIcon("💪");
    setNewHabitTarget(1);
    toast.success(`Hábito "${newHabitName}" criado com sucesso!`);
    addNotification({ type: 'habit', title: 'Novo Hábito Criado!', message: `O hábito "${newHabitName}" foi adicionado à sua rotina.`, icon: newHabitIcon, color: 'text-orange-400' });
  };

  const totalDone = habits.reduce((acc, h) => acc + (h.progress >= h.target ? 1 : 0), 0);
  const icons = ["💪", "📚", "🏃", "💧", "🧘", "🎯", "✍️", "🍎", "😴", "🎵", "💊", "🧹"];

  return (
    <Layout>
      <div className="px-4 py-4 max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">Hábitos</h1>
              <p className="text-sm text-gray-400">{totalDone}/{habits.length} hoje</p>
            </div>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition text-sm">
            <Plus className="w-4 h-4" />
            Novo Hábito
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-1.5 rounded-xl flex gap-1">
          <button onClick={() => setActiveTab("hoje")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'hoje' ? 'bg-[#2a2a2a] text-white' : 'text-gray-400 hover:text-gray-300'}`}>
            <Calendar className="w-4 h-4" />
            Hoje
            <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{habits.length}</span>
          </button>
          <button onClick={() => setActiveTab("mes")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'mes' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-gray-300'}`}>
            <Calendar className="w-4 h-4" />
            Mês
          </button>
          <button onClick={() => setActiveTab("dashboards")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'dashboards' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-gray-300'}`}>
            <LayoutGrid className="w-4 h-4" />
            Dashboards
          </button>
        </div>

        {/* Tab Hoje */}
        {activeTab === "hoje" && (
          <div className="space-y-4">
            <p className="text-center text-gray-400">Março De 2026</p>
            {habits.map(habit => (
              <div key={habit.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-lg">{habit.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">{habit.name}</h3>
                    <p className="text-xs text-gray-400">{habit.frequency} · {habit.progress}/{habit.target} {habit.target > 1 ? 'vezes' : 'vez'}</p>
                  </div>
                  {habit.progress >= habit.target && (
                    <span className="text-green-400 text-sm font-bold">✓ Feito</span>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {Array.from({ length: habit.target }).map((_, i) => (
                    <button key={i} onClick={() => toggleHabitProgress(habit.id, i)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition ${
                        i < habit.progress
                          ? 'bg-green-500 text-white border border-green-400'
                          : 'bg-[#2a2a2a] border border-[#333] text-gray-500 hover:bg-[#333]'
                      }`}>
                      {i < habit.progress ? '✓' : i + 1}
                    </button>
                  ))}
                </div>
                {/* Progress bar */}
                <div className="mt-3">
                  <div className="bg-[#2a2a2a] rounded-full h-1.5">
                    <div className="bg-green-500 h-full rounded-full transition-all duration-300" style={{ width: `${(habit.progress / habit.target) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
            {habits.length === 0 && (
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 text-center">
                <p className="text-gray-400 mb-3">Nenhum hábito criado</p>
                <button onClick={() => setShowModal(true)} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl text-sm transition">
                  Criar primeiro hábito
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab Mês */}
        {activeTab === "mes" && (
          <div className="space-y-4">
            <p className="text-center text-gray-400">Março De 2026</p>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-bold">Evolução Mensal de hábitos</h3>
                    <p className="text-sm text-red-500">Março De 2026</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 hover:bg-[#2a2a2a] rounded-lg transition"><ChevronLeft className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:bg-[#2a2a2a] rounded-lg transition"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={monthData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis dataKey="day" stroke="#555" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#555" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                  <Line type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-red-500">0%</p>
                  <p className="text-xs text-gray-400">Taxa média</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-red-400">0</p>
                  <p className="text-xs text-gray-400">Concluídos</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-red-400">0%</p>
                  <p className="text-xs text-gray-400">Melhor dia</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 bg-[#1a1a1a] border border-red-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2"><div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center"><span className="text-sm">🎯</span></div><div><p className="text-sm font-bold">Esta Semana</p><p className="text-xs text-gray-400">1 dias</p></div></div>
              </div>
              <div className="flex-1 bg-[#1a1a1a] border border-green-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2"><div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center"><span className="text-sm">✅</span></div><div><p className="text-sm font-bold">março</p><p className="text-xs text-gray-400">8 dias</p></div></div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Dashboards */}
        {activeTab === "dashboards" && (
          <div className="space-y-4">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3">
              <div className="flex gap-2 overflow-x-auto">
                {[4, 5, 6, 7, 8, 9, 10, 11, 12].map(d => (
                  <button key={d} className={`w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0 transition ${d === 9 ? 'border-2 border-green-500 text-green-400' : 'text-gray-400 hover:bg-[#2a2a2a]'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Produtividade */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center"><span>⚡</span></div>
                <div>
                  <h3 className="font-bold">Produtividade</h3>
                  <p className="text-xs text-gray-400">Média: {productivity !== null ? productivity : '-'}</p>
                </div>
              </div>
              <div className="flex gap-1.5">
                {Array.from({ length: 11 }).map((_, i) => (
                  <button key={i} onClick={() => { setProductivity(i); toast.success(`Produtividade: ${i}/10`); }}
                    className={`flex-1 h-9 rounded text-xs font-bold transition ${
                      productivity !== null && i <= productivity ? 'bg-yellow-500 text-black' : 'bg-[#2a2a2a] text-gray-500 hover:bg-[#333]'
                    }`}>{i}</button>
                ))}
              </div>
            </div>

            {/* Humor */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center"><span>😊</span></div>
                <div>
                  <h3 className="font-bold">Humor</h3>
                  <p className="text-xs text-gray-400">Média: {humor !== null ? humor : '-'}</p>
                </div>
              </div>
              <div className="flex gap-1.5">
                {Array.from({ length: 11 }).map((_, i) => (
                  <button key={i} onClick={() => { setHumor(i); toast.success(`Humor: ${i}/10`); }}
                    className={`flex-1 h-9 rounded text-xs font-bold transition ${
                      humor !== null && i <= humor ? 'bg-green-500 text-black' : 'bg-[#2a2a2a] text-gray-500 hover:bg-[#333]'
                    }`}>{i}</button>
                ))}
              </div>
            </div>

            {/* Tendências */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center"><TrendingUp className="w-5 h-5 text-red-500" /></div>
                  <div><h3 className="font-bold">Tendências de Bem-estar</h3><p className="text-sm text-gray-400">Março De 2026</p></div>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 hover:bg-[#2a2a2a] rounded-lg transition"><ChevronLeft className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:bg-[#2a2a2a] rounded-lg transition"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-400">✏️ Clique em um ponto do gráfico para editar dias anteriores</p>
              </div>
              <p className="text-center text-gray-500 py-8">Sem dados de bem-estar para este mês</p>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-400"></span><span className="text-xs text-gray-400">🌙 Sono</span></div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-400"></span><span className="text-xs text-gray-400">⚡ Produtividade</span></div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-400"></span><span className="text-xs text-gray-400">😊 Humor</span></div>
              </div>
            </div>

            {/* Histórico */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2"><span className="text-gray-400">📊</span><h3 className="font-bold">Histórico de Hábitos</h3></div>
                <div className="flex gap-1 bg-[#2a2a2a] rounded-lg p-1">
                  <button className="px-3 py-1 rounded text-xs bg-[#333] text-white">Mensal</button>
                  <button className="px-3 py-1 rounded text-xs text-gray-400">Anual</button>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <button className="p-1"><ChevronLeft className="w-4 h-4 text-gray-400" /></button>
                <span className="font-bold">2026</span>
                <button className="p-1"><ChevronRight className="w-4 h-4 text-gray-400" /></button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {["Jan", "Fev", "Mar"].map(m => (
                  <div key={m} className="bg-[#2a2a2a] rounded-xl p-3 text-center"><p className="text-xs text-gray-400">{m}</p><p className="text-lg font-bold text-red-500">0%</p></div>
                ))}
              </div>
            </div>

            {/* Comparativo */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4"><Calendar className="w-4 h-4 text-gray-400" /><h3 className="font-bold">Comparativo Anual</h3></div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">2025 <span className="font-bold">0%</span></span>
                <span className="text-gray-500">—</span>
                <span className="text-sm">2026 <span className="font-bold">0%</span></span>
              </div>
              <p className="text-center text-gray-500 text-sm">0%</p>
            </div>

            {/* Melhor Mês / Menor Taxa */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2"><span className="text-sm">🏆</span><span className="text-xs text-red-400">Melhor Mês</span></div>
                <p className="font-bold">Janeiro</p><p className="text-red-500 text-sm">0%</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2"><span className="text-sm">🎯</span><span className="text-xs text-green-400">Menor Taxa</span></div>
                <p className="font-bold">Março</p><p className="text-green-500 text-sm">0%</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Novo Hábito */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center" onClick={() => setShowModal(false)}>
          <div className="bg-[#1a1a1a] w-full max-w-lg rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Novo Hábito</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[#2a2a2a] rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-5">
              {/* Ícone */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Ícone</label>
                <div className="flex gap-2 flex-wrap">
                  {icons.map(ic => (
                    <button key={ic} onClick={() => setNewHabitIcon(ic)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition ${newHabitIcon === ic ? 'bg-red-500 ring-2 ring-red-400' : 'bg-[#2a2a2a] hover:bg-[#333]'}`}>
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nome */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Nome do hábito *</label>
                <input type="text" value={newHabitName} onChange={e => setNewHabitName(e.target.value)} placeholder="Ex: Meditar, Ler, Exercício..."
                  className="w-full bg-[#2a2a2a] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none transition" />
              </div>

              {/* Frequência */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Frequência</label>
                <div className="flex gap-2">
                  {["Diário", "Semanal", "Personalizado"].map(f => (
                    <button key={f} onClick={() => setNewHabitFrequency(f)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${newHabitFrequency === f ? 'bg-red-500 text-white' : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#333]'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meta diária */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Meta diária (vezes)</label>
                <div className="flex items-center gap-4">
                  <button onClick={() => setNewHabitTarget(Math.max(1, newHabitTarget - 1))} className="w-10 h-10 bg-[#2a2a2a] rounded-xl flex items-center justify-center hover:bg-[#333] transition">-</button>
                  <span className="text-2xl font-bold w-8 text-center">{newHabitTarget}</span>
                  <button onClick={() => setNewHabitTarget(newHabitTarget + 1)} className="w-10 h-10 bg-[#2a2a2a] rounded-xl flex items-center justify-center hover:bg-[#333] transition">+</button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 bg-[#2a2a2a] text-gray-300 py-3 rounded-xl font-medium hover:bg-[#333] transition">Cancelar</button>
                <button onClick={createHabit} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition">Criar Hábito</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
