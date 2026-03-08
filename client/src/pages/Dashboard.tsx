import Layout from "@/components/Layout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChevronDown, Info } from "lucide-react";
import { useState } from "react";

const data = [
  { day: 1, value: 0 },
  { day: 2, value: 0 },
  { day: 3, value: 0 },
  { day: 4, value: 0 },
  { day: 5, value: 0 },
  { day: 6, value: 0 },
  { day: 7, value: 0 },
  { day: 8, value: 0 },
  { day: 9, value: 0 },
  { day: 10, value: 0 },
  { day: 11, value: 0 },
  { day: 12, value: 0 },
  { day: 13, value: 0 },
  { day: 14, value: 0 },
  { day: 15, value: 0 },
  { day: 16, value: 0 },
  { day: 17, value: 0 },
  { day: 18, value: 0 },
  { day: 19, value: 0 },
  { day: 20, value: 0 },
  { day: 21, value: 0 },
  { day: 22, value: 0 },
  { day: 23, value: 0 },
  { day: 24, value: 0 },
  { day: 25, value: 0 },
  { day: 26, value: 0 },
  { day: 27, value: 0 },
  { day: 28, value: 0 },
  { day: 29, value: 0 },
  { day: 30, value: 0 },
  { day: 31, value: 0 },
];

export default function Dashboard() {
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setExpandedAccordion(expandedAccordion === id ? null : id);
  };

  const accordionItems = [
    { id: "xp", title: "Ganho de XP", icon: "⚡" },
    { id: "coins", title: "Forja Coins", icon: "💰" },
    { id: "penalties", title: "Penalidades", icon: "⚠️" },
    { id: "protection", title: "Proteção", icon: "🛡️" },
  ];

  return (
    <Layout>
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Period Selector */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 mb-6 border border-[#333333]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-400">Dia 20 - 20/03</p>
              <p className="text-red-500 font-medium">Taxa de conclusão : 0%</p>
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
                activeDot={{ r: 6 }}
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

        {/* How System Works Section */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#333333]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <Info className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-bold">Como funciona o sistema de XP</h2>
          </div>

          {/* Accordions */}
          <div className="space-y-3">
            {accordionItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#2a2a2a] rounded-xl border border-[#333333] overflow-hidden"
              >
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-[#333333] transition text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition ${
                      expandedAccordion === item.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedAccordion === item.id && (
                  <div className="px-4 py-4 bg-[#1a1a1a] border-t border-[#333333] text-sm text-gray-400">
                    Conteúdo sobre {item.title.toLowerCase()} será exibido aqui.
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
