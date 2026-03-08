import Layout from "@/components/Layout";
import { Plus, ChevronLeft, ChevronRight, Calendar, X } from "lucide-react";
import { useState } from "react";

export default function Tasks() {
  const [showModal, setShowModal] = useState(false);
  const [recurrent, setRecurrent] = useState(true);
  const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5]); // S T Q Q S
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
              <p className="text-sm text-gray-400">0/0 concluídas</p>
            </div>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition text-sm">
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-1.5 rounded-xl flex gap-1">
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium bg-[#2a2a2a] text-white">
            <Calendar className="w-4 h-4" />
            Hoje
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-300 transition">
            <Calendar className="w-4 h-4" />
            Mês
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-300 transition">
            ⚠️ Alertas
          </button>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition"><ChevronLeft className="w-5 h-5" /></button>
          <p className="text-gray-400 font-medium">Semana 11 • Março</p>
          <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition"><ChevronRight className="w-5 h-5" /></button>
        </div>

        {/* Task Days */}
        <div className="space-y-3">
          {days.map((day) => (
            <div key={day.date} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-2xl font-bold">{day.date}</h3>
                  <p className="text-sm text-gray-400">{day.day}</p>
                </div>
                <button onClick={() => setShowModal(true)} className="text-red-500 hover:text-red-400 transition">
                  <Plus className="w-6 h-6" />
                </button>
              </div>
              <p className="text-center text-gray-600 py-4 text-sm">Arraste tarefas para cá</p>
            </div>
          ))}
        </div>
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
                <input type="text" placeholder="O que precisa ser feito?" className="w-full bg-[#2a2a2a] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none transition" />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Descrição</label>
                <textarea placeholder="Detalhes adicionais..." rows={3} className="w-full bg-[#2a2a2a] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none transition resize-none" />
              </div>

              {/* Tarefa Recorrente */}
              <div className="flex items-center justify-between bg-[#2a2a2a] rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-red-500">🔄</span>
                  </div>
                  <div>
                    <p className="font-medium">Tarefa Recorrente</p>
                    <p className="text-xs text-gray-400">Repetir em dias específicos</p>
                  </div>
                </div>
                <button onClick={() => setRecurrent(!recurrent)} className={`w-12 h-7 rounded-full transition ${recurrent ? 'bg-red-500' : 'bg-[#444]'}`}>
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
                        className={`w-10 h-10 rounded-lg font-bold text-sm transition ${selectedDays.includes(i) ? 'bg-red-500 text-white' : 'bg-[#2a2a2a] text-gray-500'}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Prioridade */}
              <div>
                <p className="text-sm text-gray-400 mb-2">🏳️ Prioridade</p>
                <div className="bg-[#2a2a2a] rounded-xl px-4 py-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                  <span>Média</span>
                  <ChevronLeft className="w-4 h-4 text-gray-400 ml-auto rotate-[-90deg]" />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 bg-[#2a2a2a] text-gray-300 py-3 rounded-xl font-medium hover:bg-[#333] transition">
                  Cancelar
                </button>
                <button className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition">
                  Criar Tarefa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
