import Layout from "@/components/Layout";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const data = Array.from({ length: 31 }, (_, i) => ({
  day: i + 1,
  value: 0,
}));

export default function Habits() {
  return (
    <Layout>
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Hábitos</h1>
            <p className="text-sm text-gray-400">0/0 hoje</p>
          </div>
          <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 transition">
            <Plus className="w-5 h-5" />
            Novo Hábito
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6 bg-[#1a1a1a] p-2 rounded-xl border border-[#333333]">
          <button className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-medium transition">
            📅 Hoje
          </button>
          <button className="flex-1 text-gray-400 py-2 px-4 rounded-lg hover:text-gray-300 transition">
            📅 Mês
          </button>
          <button className="flex-1 text-gray-400 py-2 px-4 rounded-lg hover:text-gray-300 transition">
            📊 Dashboards
          </button>
        </div>

        {/* Period */}
        <div className="text-center mb-6 text-gray-400">
          <p>Março De 2026</p>
        </div>

        {/* Chart Card */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 mb-6 border border-[#333333]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg">Evolução Mensal de hábitos</h3>
              <p className="text-sm text-red-500">Março De 2026</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
              <XAxis 
                dataKey="day" 
                stroke="#666666" 
                tick={{ fontSize: 12 }}
                interval={0}
              />
              <YAxis stroke="#666666" tick={{ fontSize: 12 }} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#FF3D3D" 
                dot={{ fill: "#FF3D3D", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[#2a1a1a] rounded-xl p-4 border border-[#4a2a2a] text-center">
            <p className="text-2xl font-bold text-red-500">0%</p>
            <p className="text-xs text-gray-400 mt-2">Taxa média</p>
          </div>
          <div className="bg-[#1a2a3a] rounded-xl p-4 border border-[#2a4a6a] text-center">
            <p className="text-2xl font-bold text-cyan-400">0</p>
            <p className="text-xs text-gray-400 mt-2">Concluídos</p>
          </div>
          <div className="bg-[#1a2a1a] rounded-xl p-4 border border-[#2a4a2a] text-center">
            <p className="text-2xl font-bold text-green-400">0%</p>
            <p className="text-xs text-gray-400 mt-2">Melhor dia</p>
          </div>
        </div>

        {/* Active Bosses Section */}
        <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#333333] text-center">
          <div className="w-16 h-16 bg-[#2a2a2a] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💀</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Nenhum chefe ativo</h3>
          <p className="text-gray-400">Novos chefes aparecerão em breve. Prepare-se!</p>
        </div>
      </div>
    </Layout>
  );
}
