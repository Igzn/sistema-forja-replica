import Layout from "@/components/Layout";
import { Plus, Target, X, Trophy, Pause } from "lucide-react";
import { useState } from "react";

export default function Goals() {
  const [activeTab, setActiveTab] = useState("ativas");
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);

  return (
    <Layout>
      <div className="px-4 py-4 max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Metas</h1>
              <p className="text-sm text-gray-400">0 ativas · 0 concluídas</p>
            </div>
          </div>
          <button onClick={() => { setShowModal(true); setStep(1); }} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition text-sm">
            <Plus className="w-4 h-4" />
            Nova Meta
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button onClick={() => setActiveTab("ativas")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === 'ativas' ? 'bg-red-500 text-white' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400'}`}>
            <Target className="w-4 h-4" />
            Ativas
          </button>
          <button onClick={() => setActiveTab("concluidas")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === 'concluidas' ? 'bg-red-500 text-white' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400'}`}>
            <Trophy className="w-4 h-4" />
            Concluídas
          </button>
          <button onClick={() => setActiveTab("pausadas")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === 'pausadas' ? 'bg-red-500 text-white' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400'}`}>
            <Pause className="w-4 h-4" />
            Pausadas
          </button>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-[#2a2a2a] rounded-2xl flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-400 mb-4">
            {activeTab === "ativas" && "Nenhuma meta ativa"}
            {activeTab === "concluidas" && "Nenhuma meta concluída"}
            {activeTab === "pausadas" && "Nenhuma meta pausada"}
          </p>
          {activeTab === "ativas" && (
            <button onClick={() => { setShowModal(true); setStep(1); }} className="bg-[#2a2a2a] border border-[#333] text-white py-2.5 px-5 rounded-xl flex items-center gap-2 hover:bg-[#333] transition">
              <Plus className="w-4 h-4" />
              Criar meta
            </button>
          )}
        </div>
      </div>

      {/* Modal Nova Meta */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center" onClick={() => setShowModal(false)}>
          <div className="bg-[#1a1a1a] w-full max-w-lg rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Nova Meta</h2>
                  <p className="text-sm text-gray-400">Etapa {step} de 4 — {step === 1 ? 'Objetivo' : step === 2 ? 'Prazo' : step === 3 ? 'Etapas' : 'Revisão'}</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[#2a2a2a] rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            {/* Progress bar */}
            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`flex-1 h-1 rounded-full ${s <= step ? 'bg-red-500' : 'bg-[#2a2a2a]'}`}></div>
              ))}
            </div>

            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block flex items-center gap-1">
                    <span>✨</span> Qual é a sua meta? *
                  </label>
                  <input type="text" placeholder="Ex: Ler 12 livros este ano" className="w-full bg-[#2a2a2a] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none transition" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Descrição (opcional)</label>
                  <textarea placeholder="Detalhes sobre sua meta..." rows={3} className="w-full bg-[#2a2a2a] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none transition resize-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowModal(false)} className="flex-1 bg-[#2a2a2a] text-gray-300 py-3 rounded-xl font-medium hover:bg-[#333] transition">
                    Cancelar
                  </button>
                  <button onClick={() => setStep(2)} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition">
                    Próximo
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">📅 Prazo</label>
                  <input type="date" className="w-full bg-[#2a2a2a] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none transition" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep(1)} className="flex-1 bg-[#2a2a2a] text-gray-300 py-3 rounded-xl font-medium hover:bg-[#333] transition">
                    Voltar
                  </button>
                  <button onClick={() => setStep(3)} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition">
                    Próximo
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">📋 Etapas da meta</label>
                  <input type="text" placeholder="Ex: Ler 1 livro por mês" className="w-full bg-[#2a2a2a] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none transition" />
                  <button className="mt-2 text-red-500 text-sm flex items-center gap-1"><Plus className="w-4 h-4" /> Adicionar etapa</button>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep(2)} className="flex-1 bg-[#2a2a2a] text-gray-300 py-3 rounded-xl font-medium hover:bg-[#333] transition">
                    Voltar
                  </button>
                  <button onClick={() => setStep(4)} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition">
                    Próximo
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <div className="bg-[#2a2a2a] rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-2">Revisão da meta</p>
                  <p className="text-gray-500 text-sm">Revise os detalhes antes de criar.</p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep(3)} className="flex-1 bg-[#2a2a2a] text-gray-300 py-3 rounded-xl font-medium hover:bg-[#333] transition">
                    Voltar
                  </button>
                  <button onClick={() => setShowModal(false)} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition">
                    Criar Meta
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
