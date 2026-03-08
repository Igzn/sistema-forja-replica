import Layout from "@/components/Layout";
import { ChevronDown, ChevronUp, Info, Droplets, Clock, Flame, CheckCircle, Download, Bell, Settings, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const weekDays = ["S", "T", "Q", "Q", "S", "S", "D"];
const dayNames = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default function Dashboard() {
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);
  const [waterAmount, setWaterAmount] = useState(250);
  const [waterGoal, setWaterGoal] = useState(2000);
  const [waterByDay, setWaterByDay] = useState([0, 0, 0, 0, 0, 0, 250]);
  const [showWaterSettings, setShowWaterSettings] = useState(false);

  const toggleAccordion = (id: string) => setExpandedAccordion(expandedAccordion === id ? null : id);

  const addWater = () => {
    const newByDay = [...waterByDay];
    newByDay[6] = newByDay[6] + 250;
    setWaterByDay(newByDay);
    setWaterAmount(newByDay[6]);
    toast.success(`+250ml adicionado! Total: ${newByDay[6]}ml`);
  };

  const removeWater = () => {
    if (waterByDay[6] <= 0) return;
    const newByDay = [...waterByDay];
    newByDay[6] = Math.max(0, newByDay[6] - 250);
    setWaterByDay(newByDay);
    setWaterAmount(newByDay[6]);
    toast.info(`-250ml removido. Total: ${newByDay[6]}ml`);
  };

  const waterPercent = Math.min(100, Math.round((waterAmount / waterGoal) * 100));
  const gaugeOffset = 157 - (157 * waterPercent / 100);

  return (
    <Layout>
      <div className="px-4 py-4 max-w-2xl mx-auto space-y-4">

        {/* Install App Bar */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 flex items-center justify-between">
          <button onClick={() => toast.info("Para instalar, use o menu do navegador > 'Adicionar à tela inicial'")} className="flex items-center gap-3 hover:opacity-80 transition">
            <Download className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-300">Instalar App</span>
          </button>
          <button onClick={() => toast.info("Nenhuma notificação nova")} className="p-1 hover:bg-[#2a2a2a] rounded-lg transition">
            <Bell className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Main Card - Março */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
          <div className="flex items-start gap-4 mb-5">
            <div className="relative w-16 h-16 shrink-0">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2a2a2a" strokeWidth="3" />
                <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#EF4444" strokeWidth="3" strokeDasharray="0, 100" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold">0%</span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold">Março</h2>
              <p className="text-red-500 text-sm">Precisa melhorar</p>
            </div>
          </div>

          {/* Tags */}
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
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-bold">Hábitos da Semana</span>
            </div>
            <div className="flex justify-between items-end h-20">
              {weekDays.map((d, i) => (
                <div key={`h-${i}`} className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-5 bg-[#2a2a2a] rounded-t" style={{ height: '4px' }}></div>
                  <span className={`text-[10px] ${i === 6 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>{d}</span>
                  <span className="text-[10px] text-gray-600">0%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tarefas da Semana */}
          <div className="bg-[#111] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-bold">Tarefas da Semana</span>
            </div>
            <div className="flex justify-between items-end h-20">
              {weekDays.map((d, i) => (
                <div key={`t-${i}`} className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-5 bg-[#2a2a2a] rounded-t" style={{ height: '4px' }}></div>
                  <span className={`text-[10px] ${i === 6 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>{d}</span>
                  <span className="text-[10px] text-gray-600">0/0</span>
                </div>
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
                <p className="text-xs text-gray-400">{waterAmount}ml / {waterGoal / 1000}L</p>
              </div>
            </div>
            <button onClick={() => setShowWaterSettings(!showWaterSettings)} className="p-2 hover:bg-[#2a2a2a] rounded-lg transition">
              <Settings className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Water Settings Modal */}
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

          {/* Water bars by day */}
          <div className="space-y-2 mb-4">
            {dayNames.map((day, i) => (
              <div key={day} className="flex items-center gap-3">
                <span className={`text-xs w-8 ${i === 6 ? 'text-cyan-400 font-bold' : 'text-gray-500'}`}>{day}</span>
                <div className="flex-1 bg-[#2a2a2a] rounded-full h-2">
                  <div className="bg-cyan-400 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (waterByDay[i] / waterGoal) * 100)}%` }}></div>
                </div>
                <span className="text-xs text-gray-500 w-8 text-right">{waterByDay[i] > 0 ? waterByDay[i] : '-'}</span>
              </div>
            ))}
          </div>

          {/* Add/Remove water buttons */}
          <div className="flex items-center gap-3 mb-4">
            <button onClick={addWater} className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-xl hover:bg-cyan-500/20 transition">
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">+250ml</span>
            </button>
            <button onClick={removeWater} className="flex items-center gap-2 bg-[#2a2a2a] border border-[#333] text-gray-400 px-4 py-2 rounded-xl hover:bg-[#333] transition">
              <Minus className="w-4 h-4" />
              <span className="text-sm font-medium">-250ml</span>
            </button>
          </div>

          {/* Gauge */}
          <div className="flex justify-center mb-4">
            <div className="relative w-32 h-16 overflow-hidden">
              <svg className="w-32 h-32" viewBox="0 0 120 60">
                <path d="M10 55 A50 50 0 0 1 110 55" fill="none" stroke="#2a2a2a" strokeWidth="8" strokeLinecap="round" />
                <path d="M10 55 A50 50 0 0 1 110 55" fill="none" stroke="#06B6D4" strokeWidth="8" strokeLinecap="round" strokeDasharray="157" strokeDashoffset={gaugeOffset} className="transition-all duration-500" />
              </svg>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                <span className="text-sm font-bold text-cyan-400">{waterPercent}%</span>
              </div>
            </div>
          </div>

          <div className="text-center mb-3">
            <p className="text-sm text-cyan-400">{waterAmount >= waterGoal ? "Meta atingida! 🎉" : "Nenhum hábito de água vinculado"}</p>
          </div>
          <button onClick={() => toast.success("Hábito 'Beber Água' criado com sucesso!")} className="w-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-cyan-500/20 transition">
            <Droplets className="w-4 h-4" />
            Criar hábito "Beber Água"
          </button>
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
            {/* Ganho de XP */}
            <div className="bg-[#111] rounded-xl border border-[#2a2a2a] overflow-hidden">
              <button onClick={() => toggleAccordion('xp')} className="w-full px-4 py-4 flex items-center justify-between hover:bg-[#1a1a1a] transition text-left">
                <div className="flex items-center gap-3">
                  <span className="text-red-500">⚡</span>
                  <span className="font-medium">Ganho de XP</span>
                </div>
                {expandedAccordion === 'xp' ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {expandedAccordion === 'xp' && (
                <div className="px-4 pb-4 border-t border-[#2a2a2a] pt-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><div className="flex items-center gap-2"><span>🔄</span> Completar hábito</div><span className="text-red-400 font-bold">+10 XP</span></div>
                    <div className="flex justify-between pl-6 text-gray-500"><span>└ Bônus streak 3 dias</span><span className="text-red-400 font-bold">+20 XP</span></div>
                    <div className="flex justify-between pl-6 text-gray-500"><span>└ Bônus streak 7 dias</span><span className="text-red-400 font-bold">+50 XP</span></div>
                    <div className="flex justify-between pl-6 text-gray-500"><span>└ Bônus streak 30 dias</span><span className="text-red-400 font-bold">+200 XP</span></div>
                    <div className="flex justify-between"><div className="flex items-center gap-2"><span>✅</span> Completar tarefa</div><span className="text-red-400 font-bold">+10 XP</span></div>
                    <div className="flex justify-between"><div className="flex items-center gap-2"><span>📈</span> Progresso em meta</div><span className="text-red-400 font-bold">+5 XP</span></div>
                    <div className="flex justify-between"><div className="flex items-center gap-2"><span>🎯</span> Concluir meta</div><span className="text-red-400 font-bold">+100 XP</span></div>
                    <div className="flex justify-between"><div className="flex items-center gap-2"><span>📅</span> Login diário</div><span className="text-red-400 font-bold">+5 a +25 XP</span></div>
                  </div>
                </div>
              )}
            </div>

            {/* Forja Coins */}
            <div className="bg-[#111] rounded-xl border border-[#2a2a2a] overflow-hidden">
              <button onClick={() => toggleAccordion('coins')} className="w-full px-4 py-4 flex items-center justify-between hover:bg-[#1a1a1a] transition text-left">
                <div className="flex items-center gap-3">
                  <span className="text-yellow-400">💰</span>
                  <span className="font-medium">Forja Coins</span>
                </div>
                {expandedAccordion === 'coins' ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {expandedAccordion === 'coins' && (
                <div className="px-4 pb-4 border-t border-[#2a2a2a] pt-4">
                  <div className="space-y-3 text-sm">
                    <p className="text-gray-400">Você ganha <span className="text-yellow-400 font-bold">20% do XP</span> em Forja Coins.</p>
                    <div className="flex justify-between"><span className="text-gray-400">Completar hábito</span><span className="text-yellow-400 font-bold">+2 coins</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Completar tarefa</span><span className="text-yellow-400 font-bold">+2 coins</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Concluir meta</span><span className="text-yellow-400 font-bold">+20 coins</span></div>
                    <p className="text-gray-500 mt-2">Use na loja para comprar itens especiais, proteções e boosts.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Penalidades */}
            <div className="bg-[#111] rounded-xl border border-[#2a2a2a] overflow-hidden">
              <button onClick={() => toggleAccordion('penalties')} className="w-full px-4 py-4 flex items-center justify-between hover:bg-[#1a1a1a] transition text-left">
                <div className="flex items-center gap-3">
                  <span className="text-red-500">⚠️</span>
                  <span className="font-medium">Penalidades</span>
                </div>
                {expandedAccordion === 'penalties' ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {expandedAccordion === 'penalties' && (
                <div className="px-4 pb-4 border-t border-[#2a2a2a] pt-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">Não completar hábito</span><span className="text-red-400 font-bold">-5 XP</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Perder streak de 3+ dias</span><span className="text-red-400 font-bold">-15 XP</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Perder streak de 7+ dias</span><span className="text-red-400 font-bold">-30 XP</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Tarefa atrasada</span><span className="text-red-400 font-bold">-3 XP/dia</span></div>
                    <p className="text-gray-500 mt-2">Penalidades são aplicadas automaticamente ao final do dia.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Proteção */}
            <div className="bg-[#111] rounded-xl border border-[#2a2a2a] overflow-hidden">
              <button onClick={() => toggleAccordion('protection')} className="w-full px-4 py-4 flex items-center justify-between hover:bg-[#1a1a1a] transition text-left">
                <div className="flex items-center gap-3">
                  <span className="text-blue-400">🛡️</span>
                  <span className="font-medium">Proteção</span>
                </div>
                {expandedAccordion === 'protection' ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {expandedAccordion === 'protection' && (
                <div className="px-4 pb-4 border-t border-[#2a2a2a] pt-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">Escudo de Streak (1 dia)</span><span className="text-yellow-400 font-bold">5 coins</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Escudo de Streak (3 dias)</span><span className="text-yellow-400 font-bold">12 coins</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Escudo de Streak (7 dias)</span><span className="text-yellow-400 font-bold">25 coins</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Proteção de XP (1 dia)</span><span className="text-yellow-400 font-bold">8 coins</span></div>
                    <p className="text-gray-500 mt-2">Compre proteções na loja usando Forja Coins para evitar penalidades.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
