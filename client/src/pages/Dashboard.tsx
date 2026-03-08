import Layout from "@/components/Layout";
import { ChevronDown, ChevronUp, Info, Droplets, Clock, Flame, CheckCircle, Download, Bell } from "lucide-react";
import { useState } from "react";

const weekDays = ["S", "T", "Q", "Q", "S", "S", "D"];

export default function Dashboard() {
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);
  const toggleAccordion = (id: string) => setExpandedAccordion(expandedAccordion === id ? null : id);

  return (
    <Layout>
      <div className="px-4 py-4 max-w-2xl mx-auto space-y-4">

        {/* Install App Bar */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-300">Instalar App</span>
          </div>
          <Bell className="w-5 h-5 text-gray-400" />
        </div>

        {/* Main Card - Março */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
          {/* Top section */}
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
            <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg">
              <span className="text-blue-400">🌙</span>
              <span className="text-xs text-blue-400">Sono</span>
              <span className="text-xs text-gray-500 ml-1">-</span>
            </div>
            <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-lg">
              <span className="text-yellow-400">⚡</span>
              <span className="text-xs text-yellow-400">Energia</span>
              <span className="text-xs text-gray-500 ml-1">-</span>
            </div>
            <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg">
              <span className="text-green-400">😊</span>
              <span className="text-xs text-green-400">Humor</span>
              <span className="text-xs text-gray-500 ml-1">-</span>
            </div>
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
                <p className="text-xs text-gray-400">250ml / 2L</p>
              </div>
            </div>
            <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
          </div>

          {/* Water bars by day */}
          <div className="space-y-2 mb-4">
            {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((day, i) => (
              <div key={day} className="flex items-center gap-3">
                <span className={`text-xs w-8 ${i === 6 ? 'text-cyan-400 font-bold' : 'text-gray-500'}`}>{day}</span>
                <div className="flex-1 bg-[#2a2a2a] rounded-full h-2">
                  {i === 6 && <div className="bg-cyan-400 h-full rounded-full" style={{ width: '13%' }}></div>}
                </div>
                <span className="text-xs text-gray-500 w-8 text-right">{i === 6 ? '250' : '-'}</span>
              </div>
            ))}
          </div>

          {/* Add water button */}
          <div className="flex items-center justify-between mb-4">
            <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition">
              <span className="text-lg">+</span>
              <span className="text-sm font-medium">+250ml</span>
            </button>
          </div>

          {/* Gauge */}
          <div className="flex justify-center mb-4">
            <div className="relative w-32 h-16 overflow-hidden">
              <svg className="w-32 h-32" viewBox="0 0 120 60">
                <path d="M10 55 A50 50 0 0 1 110 55" fill="none" stroke="#2a2a2a" strokeWidth="8" strokeLinecap="round" />
                <path d="M10 55 A50 50 0 0 1 110 55" fill="none" stroke="#06B6D4" strokeWidth="8" strokeLinecap="round" strokeDasharray="157" strokeDashoffset={157 - (157 * 0.13)} />
              </svg>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                <span className="text-sm font-bold text-cyan-400">13%</span>
              </div>
            </div>
          </div>

          <div className="text-center mb-3">
            <p className="text-sm text-cyan-400">Nenhum hábito de água vinculado</p>
          </div>
          <button className="w-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-cyan-500/20 transition">
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
          <p className="text-sm text-gray-500 mt-3">0% da meta semanal</p>
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
                <div className="px-4 pb-4">
                  <div className="border-t border-[#2a2a2a] pt-4">
                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                      <span className="text-gray-400">Ação</span>
                      <span className="text-gray-400 text-right">XP</span>
                      <div className="flex items-center gap-2"><span>🔄</span> Completar hábito</div>
                      <span className="text-red-400 text-right font-bold">+10</span>
                      <span className="text-gray-500 pl-6">└ Bônus streak 3 dias</span>
                      <span className="text-red-400 text-right font-bold">+20</span>
                      <span className="text-gray-500 pl-6">└ Bônus streak 7 dias</span>
                      <span className="text-red-400 text-right font-bold">+50</span>
                      <span className="text-gray-500 pl-6">└ Bônus streak 30 dias</span>
                      <span className="text-red-400 text-right font-bold">+200</span>
                      <div className="flex items-center gap-2"><span>✅</span> Completar tarefa</div>
                      <span className="text-red-400 text-right font-bold">+10</span>
                      <div className="flex items-center gap-2"><span>📈</span> Progresso em meta (1x/dia)</div>
                      <span className="text-red-400 text-right font-bold">+5</span>
                      <div className="flex items-center gap-2"><span>🎯</span> Concluir meta</div>
                      <span className="text-red-400 text-right font-bold">+100</span>
                      <div className="flex items-center gap-2"><span>📅</span> Login diário</div>
                      <span className="text-red-400 text-right font-bold">+5 a +25</span>
                    </div>
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
                <div className="px-4 pb-4 border-t border-[#2a2a2a] pt-4 text-sm text-gray-400">
                  Você ganha 20% do XP em Forja Coins. Use na loja para comprar itens especiais, proteções e boosts.
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
                <div className="px-4 pb-4 border-t border-[#2a2a2a] pt-4 text-sm text-gray-400">
                  Não completar hábitos ou tarefas pode resultar em perda de XP e streaks.
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
                <div className="px-4 pb-4 border-t border-[#2a2a2a] pt-4 text-sm text-gray-400">
                  Use Forja Coins para comprar proteções contra perda de streak e XP.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
