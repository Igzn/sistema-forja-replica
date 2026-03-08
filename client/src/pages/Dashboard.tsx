import Layout from "@/components/Layout";
import { useNotifications } from "@/contexts/NotificationContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ChevronDown, ChevronUp, Info, Droplets, Clock, Flame, CheckCircle, Download, Bell, Settings, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const weekDays = ["S", "T", "Q", "Q", "S", "S", "D"];
const dayNames = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default function Dashboard() {
  const { addNotification } = useNotifications();
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);
  const [waterByDay, setWaterByDay] = useLocalStorage<number[]>("life-water-by-day", [0, 0, 0, 0, 0, 0, 0]);
  const [waterGoal, setWaterGoal] = useLocalStorage<number>("life-water-goal", 2000);
  const [showWaterSettings, setShowWaterSettings] = useState(false);
  const [habitLinked, setHabitLinked] = useLocalStorage<boolean>("life-water-habit-linked", false);
  const [habitsWeekData] = useLocalStorage<number[]>("life-habits-week", [0, 0, 0, 0, 0, 0, 0]);
  const [tasksWeekData] = useLocalStorage<[number, number][]>("life-tasks-week", [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]);

  const toggleAccordion = (id: string) => setExpandedAccordion(expandedAccordion === id ? null : id);
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const waterAmount = waterByDay[todayIndex] || 0;

  const addWater = () => {
    const newByDay = [...waterByDay];
    newByDay[todayIndex] = (newByDay[todayIndex] || 0) + 250;
    setWaterByDay(newByDay);
    toast.success(`+250ml adicionado! Total: ${newByDay[todayIndex]}ml`);
    if (newByDay[todayIndex] >= waterGoal) {
      addNotification({ type: 'water', title: 'Meta de Água Atingida!', message: `Parabéns! Você atingiu sua meta de ${waterGoal}ml hoje! +10 XP`, icon: '💧', color: 'text-cyan-400' });
    } else if (newByDay[todayIndex] === Math.floor(waterGoal / 2)) {
      addNotification({ type: 'water', title: 'Metade da Meta!', message: `Você já bebeu ${newByDay[todayIndex]}ml. Continue assim!`, icon: '💧', color: 'text-cyan-400' });
    }
  };

  const removeWater = () => {
    if ((waterByDay[todayIndex] || 0) <= 0) return;
    const newByDay = [...waterByDay];
    newByDay[todayIndex] = Math.max(0, (newByDay[todayIndex] || 0) - 250);
    setWaterByDay(newByDay);
    toast.info(`-250ml removido. Total: ${newByDay[todayIndex]}ml`);
  };

  const waterPercent = Math.min(100, Math.round((waterAmount / waterGoal) * 100));
  const habitsAvg = habitsWeekData.length > 0 ? Math.round(habitsWeekData.reduce((a, b) => a + b, 0) / habitsWeekData.length) : 0;
  const tasksDone = tasksWeekData.reduce((a, b) => a + b[0], 0);
  const tasksTotal = tasksWeekData.reduce((a, b) => a + b[1], 0);
  const tasksPercent = tasksTotal > 0 ? Math.round((tasksDone / tasksTotal) * 100) : 0;

  return (
    <Layout>
      <div className="px-4 py-4 max-w-2xl mx-auto space-y-4">

        {/* Install App Bar */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 flex items-center justify-between">
          <button onClick={() => toast.info("Para instalar, use o menu do navegador > 'Adicionar à tela inicial'")} className="flex items-center gap-3 hover:opacity-80 transition flex-1">
            <Download className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-300">Instalar App</span>
          </button>
          <button onClick={() => toast.info("Abra as notificações na barra superior")} className="p-2 hover:bg-[#2a2a2a] rounded-lg transition">
            <Bell className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Main Card - Março */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
          <div className="flex items-start gap-4 mb-5">
            <div className="relative w-16 h-16 shrink-0">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2a2a2a" strokeWidth="3" />
                <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#EF4444" strokeWidth="3" strokeDasharray={`${habitsAvg}, 100`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold">{habitsAvg}%</span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold">Março</h2>
              <p className="text-red-500 text-sm">{habitsAvg >= 80 ? 'Excelente!' : habitsAvg >= 50 ? 'Bom progresso' : 'Precisa melhorar'}</p>
            </div>
          </div>

          {/* Tags - Sono, Energia, Humor */}
          <div className="flex gap-3 mb-5">
            <button onClick={() => toast.info("Sono: Sem dados registrados")} className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg hover:bg-blue-500/20 transition">
              <span className="text-blue-400">🌙</span>
              <span className="text-xs text-blue-400">Sono</span>
              <span className="text-xs text-gray-500 ml-1">-</span>
            </button>
            <button onClick={() => toast.info("Energia: Sem dados registrados")} className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-lg hover:bg-yellow-500/20 transition">
              <span className="text-yellow-400">⚡</span>
              <span className="text-xs text-yellow-400">Energia</span>
              <span className="text-xs text-gray-500 ml-1">-</span>
            </button>
            <button onClick={() => toast.info("Humor: Sem dados registrados")} className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg hover:bg-green-500/20 transition">
              <span className="text-green-400">😊</span>
              <span className="text-xs text-green-400">Humor</span>
              <span className="text-xs text-gray-500 ml-1">-</span>
            </button>
          </div>

          {/* Hábitos da Semana */}
          <div className="bg-[#111] rounded-xl p-4 mb-3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Flame className="w-4 h-4 text-orange-500" />
                </div>
                <span className="text-sm font-bold">Hábitos da Semana</span>
              </div>
              <span className="text-lg font-bold">{habitsAvg}%</span>
            </div>
            <div className="flex justify-between mb-2">
              {habitsWeekData.map((val, i) => (
                <span key={`hp-${i}`} className={`text-[10px] flex-1 text-center ${i === todayIndex ? 'text-red-500 font-bold' : 'text-gray-500'}`}>{val}%</span>
              ))}
            </div>
            <div className="flex justify-between items-end h-20 mb-2">
              {habitsWeekData.map((val, i) => (
                <div key={`hb-${i}`} className="flex flex-col items-center flex-1">
                  <div className="w-5 rounded-t transition-all duration-300" style={{ height: `${Math.max(3, val * 0.8)}px`, backgroundColor: val > 0 ? '#EF4444' : '#2a2a2a' }}></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              {weekDays.map((d, i) => (
                <span key={`wd-${i}`} className={`text-[10px] flex-1 text-center ${i === todayIndex ? 'text-red-500 font-bold' : 'text-gray-500'}`}>{d}</span>
              ))}
            </div>
          </div>

          {/* Tarefas da Semana */}
          <div className="bg-[#111] rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-sm font-bold">Tarefas da Semana</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">{tasksDone}/{tasksTotal}</span>
                <span className="text-lg font-bold">{tasksPercent}%</span>
              </div>
            </div>
            <div className="flex justify-between mb-2">
              {tasksWeekData.map(([done, total], i) => (
                <span key={`tp-${i}`} className={`text-[10px] flex-1 text-center ${i === todayIndex ? 'text-red-500 font-bold' : 'text-gray-500'}`}>{done}/{total}</span>
              ))}
            </div>
            <div className="flex justify-between items-end h-20 mb-2">
              {tasksWeekData.map(([done, total], i) => {
                const pct = total > 0 ? (done / total) * 100 : 0;
                return (
                  <div key={`tb-${i}`} className="flex flex-col items-center flex-1">
                    <div className="w-5 rounded-t transition-all duration-300" style={{ height: `${Math.max(3, pct * 0.8)}px`, backgroundColor: pct > 0 ? '#06B6D4' : '#2a2a2a' }}></div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between">
              {weekDays.map((d, i) => (
                <span key={`td-${i}`} className={`text-[10px] flex-1 text-center ${i === todayIndex ? 'text-red-500 font-bold' : 'text-gray-500'}`}>{d}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Card Água */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <Droplets className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-bold">Água</h3>
                <p className="text-xs text-gray-400">{waterAmount}ml / {waterGoal >= 1000 ? `${waterGoal / 1000}L` : `${waterGoal}ml`}</p>
              </div>
            </div>
            <button onClick={() => setShowWaterSettings(!showWaterSettings)} className="p-2 hover:bg-[#2a2a2a] rounded-lg transition">
              <Settings className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {showWaterSettings && (
            <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 mb-4">
              <h4 className="text-sm font-bold mb-3">Configurações de Água</h4>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">Meta diária</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setWaterGoal(Math.max(500, waterGoal - 250))} className="w-8 h-8 bg-[#2a2a2a] rounded-lg flex items-center justify-center hover:bg-[#333] transition">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold w-16 text-center">{waterGoal}ml</span>
                  <button onClick={() => setWaterGoal(waterGoal + 250)} className="w-8 h-8 bg-[#2a2a2a] rounded-lg flex items-center justify-center hover:bg-[#333] transition">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button onClick={() => { setShowWaterSettings(false); toast.success("Configurações salvas!"); }} className="w-full bg-cyan-500 text-white py-2 rounded-xl font-medium hover:bg-cyan-600 transition">
                Salvar
              </button>
            </div>
          )}

          <div className="flex gap-4">
            <div className="flex-1 space-y-1.5">
              {dayNames.map((day, i) => (
                <div key={day} className="flex items-center gap-2">
                  <span className={`text-xs w-8 ${i === todayIndex ? 'text-cyan-400 font-bold' : 'text-gray-500'}`}>{day}</span>
                  <div className="flex-1 bg-[#2a2a2a] rounded-full h-2">
                    <div className="bg-cyan-400 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, ((waterByDay[i] || 0) / waterGoal) * 100)}%` }}></div>
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">{(waterByDay[i] || 0) > 0 ? waterByDay[i] : '-'}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              <button onClick={addWater} className="flex flex-col items-center gap-1 text-cyan-400 hover:text-cyan-300 transition">
                <Plus className="w-5 h-5" />
                <span className="text-sm font-bold">+250ml</span>
              </button>
              <button onClick={removeWater} className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-400 transition">
                <Minus className="w-4 h-4" />
                <span className="text-xs">-250ml</span>
              </button>
              <div className="relative w-28 h-14 overflow-hidden">
                <svg className="w-28 h-28" viewBox="0 0 120 60">
                  <path d="M10 55 A50 50 0 0 1 110 55" fill="none" stroke="#2a2a2a" strokeWidth="8" strokeLinecap="round" />
                  <path d="M10 55 A50 50 0 0 1 110 55" fill="none" stroke="#06B6D4" strokeWidth="8" strokeLinecap="round" strokeDasharray="157" strokeDashoffset={157 - (157 * waterPercent / 100)} className="transition-all duration-500" />
                </svg>
              </div>
              <span className="text-sm font-bold text-cyan-400">{waterPercent}%</span>
            </div>
          </div>

          <div className="mt-4">
            {!habitLinked ? (
              <>
                <p className="text-sm text-cyan-400 text-center mb-3">Nenhum hábito de água vinculado</p>
                <button onClick={() => {
                  setHabitLinked(true);
                  toast.success('Hábito "Beber Água" criado e vinculado!');
                  addNotification({ type: 'habit', title: 'Novo Hábito Criado!', message: 'O hábito "Beber Água" foi criado e vinculado ao tracker.', icon: '💧', color: 'text-cyan-400' });
                }} className="w-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-cyan-500/20 transition">
                  <Droplets className="w-4 h-4" />
                  Criar hábito "Beber Água"
                </button>
              </>
            ) : (
              <p className="text-sm text-green-400 text-center">Hábito "Beber Água" vinculado ✓</p>
            )}
          </div>
        </div>

        {/* Card Horas de Foco */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold">Horas de Foco</h3>
                <p className="text-xs text-gray-400">0 sessões · meta 40h/sem</p>
              </div>
            </div>
            <span className="text-2xl font-bold">0m</span>
          </div>
          <div className="mt-3">
            <div className="bg-[#2a2a2a] rounded-full h-2">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: '0%' }}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">0% da meta semanal</p>
          </div>
        </div>

        {/* Como funciona o sistema de XP */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
              <Info className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-lg font-bold">Como funciona o sistema de XP</h2>
          </div>

          <div className="space-y-3">
            {[
              { id: 'xp', icon: '⚡', iconColor: 'text-red-500', label: 'Ganho de XP', content: (
                <div>
                  <div className="flex justify-between mb-3 text-sm text-gray-400"><span>Ação</span><span>XP</span></div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><div className="flex items-center gap-2"><span>🔄</span> Completar hábito</div><span className="text-red-400 font-bold">+10</span></div>
                    <div className="flex justify-between pl-6 text-gray-500"><span>└ Bônus streak 3 dias</span><span className="text-red-400 font-bold">+20</span></div>
                    <div className="flex justify-between pl-6 text-gray-500"><span>└ Bônus streak 7 dias</span><span className="text-red-400 font-bold">+50</span></div>
                    <div className="flex justify-between pl-6 text-gray-500"><span>└ Bônus streak 30 dias</span><span className="text-red-400 font-bold">+200</span></div>
                    <div className="flex justify-between"><div className="flex items-center gap-2"><span>✅</span> Completar tarefa</div><span className="text-red-400 font-bold">+10</span></div>
                    <div className="flex justify-between"><div className="flex items-center gap-2"><span>📈</span> Progresso em meta (1x/dia)</div><span className="text-red-400 font-bold">+5</span></div>
                    <div className="flex justify-between"><div className="flex items-center gap-2"><span>🎯</span> Concluir meta</div><span className="text-red-400 font-bold">+100</span></div>
                    <div className="flex justify-between"><div className="flex items-center gap-2"><span>📅</span> Login diário</div><span className="text-red-400 font-bold">+5 a +25</span></div>
                  </div>
                </div>
              )},
              { id: 'coins', icon: '💰', iconColor: 'text-yellow-400', label: 'Life Coins', content: (
                <div className="space-y-3 text-sm">
                  <p className="text-gray-400">Você ganha <span className="text-yellow-400 font-bold">20% do XP</span> em Life Coins.</p>
                  <div className="flex justify-between"><span className="text-gray-400">Completar hábito</span><span className="text-yellow-400 font-bold">+2 coins</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Completar tarefa</span><span className="text-yellow-400 font-bold">+2 coins</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Concluir meta</span><span className="text-yellow-400 font-bold">+20 coins</span></div>
                  <p className="text-gray-500 mt-2">Use na loja para comprar itens especiais, proteções e boosts.</p>
                </div>
              )},
              { id: 'penalties', icon: '⚠️', iconColor: 'text-red-500', label: 'Penalidades', content: (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Não completar hábito</span><span className="text-red-400 font-bold">-5 XP</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Perder streak de 3+ dias</span><span className="text-red-400 font-bold">-15 XP</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Perder streak de 7+ dias</span><span className="text-red-400 font-bold">-30 XP</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Tarefa atrasada</span><span className="text-red-400 font-bold">-3 XP/dia</span></div>
                  <p className="text-gray-500 mt-2">Penalidades são aplicadas automaticamente ao final do dia.</p>
                </div>
              )},
              { id: 'protection', icon: '🛡️', iconColor: 'text-blue-400', label: 'Proteção', content: (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Escudo de Streak (1 dia)</span><span className="text-yellow-400 font-bold">5 coins</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Escudo de Streak (3 dias)</span><span className="text-yellow-400 font-bold">12 coins</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Escudo de Streak (7 dias)</span><span className="text-yellow-400 font-bold">25 coins</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Proteção de XP (1 dia)</span><span className="text-yellow-400 font-bold">8 coins</span></div>
                  <p className="text-gray-500 mt-2">Compre proteções na loja usando Life Coins para evitar penalidades.</p>
                </div>
              )},
            ].map(acc => (
              <div key={acc.id} className="bg-[#111] rounded-xl border border-[#2a2a2a] overflow-hidden">
                <button onClick={() => toggleAccordion(acc.id)} className="w-full px-4 py-4 flex items-center justify-between hover:bg-[#1a1a1a] transition text-left">
                  <div className="flex items-center gap-3">
                    <span className={acc.iconColor}>{acc.icon}</span>
                    <span className="font-medium">{acc.label}</span>
                  </div>
                  {expandedAccordion === acc.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                {expandedAccordion === acc.id && (
                  <div className="px-4 pb-4 border-t border-[#2a2a2a] pt-4">
                    {acc.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
