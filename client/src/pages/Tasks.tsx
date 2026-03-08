import Layout from "@/components/Layout";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

export default function Tasks() {
  const days = [
    { date: 8, day: "Domingo", tasks: [] },
    { date: 9, day: "Segunda-Feira", tasks: [] },
    { date: 10, day: "Terça-Feira", tasks: [] },
  ];

  return (
    <Layout>
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Tarefas</h1>
            <p className="text-sm text-gray-400">0/0 concluídas</p>
          </div>
          <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 transition">
            <Plus className="w-5 h-5" />
            Nova Tarefa
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6 bg-[#1a1a1a] p-2 rounded-xl border border-[#333333] overflow-x-auto">
          <button className="flex items-center gap-2 bg-[#2a2a2a] text-gray-400 py-2 px-4 rounded-lg hover:text-gray-300 transition whitespace-nowrap">
            📅 Hoje
          </button>
          <button className="flex items-center gap-2 bg-red-500 text-white py-2 px-4 rounded-lg font-medium transition whitespace-nowrap">
            📅 Mês
          </button>
          <button className="flex items-center gap-2 bg-[#2a2a2a] text-gray-400 py-2 px-4 rounded-lg hover:text-gray-300 transition whitespace-nowrap">
            ⚠️ Alertas
          </button>
        </div>

        {/* Navigation and Period */}
        <div className="flex items-center justify-between mb-6">
          <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <p className="text-center text-gray-400">Semana 11 • Março</p>
          <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Task Days */}
        <div className="space-y-4">
          {days.map((day) => (
            <div
              key={day.date}
              className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#333333]"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{day.date}</h3>
                  <p className="text-sm text-gray-400">{day.day}</p>
                </div>
                <button className="text-red-500 hover:text-red-400 transition">
                  <Plus className="w-6 h-6" />
                </button>
              </div>
              
              {day.tasks.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Arraste tarefas para cá</p>
              ) : (
                <div className="space-y-2">
                  {day.tasks.map((task, idx) => (
                    <div key={idx} className="bg-[#2a2a2a] p-3 rounded-lg">
                      {task}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
