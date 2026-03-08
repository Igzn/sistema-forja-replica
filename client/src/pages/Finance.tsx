import Layout from "@/components/Layout";
import { Plus, Wallet, BarChart3, CreditCard, Calendar, ShoppingCart, Landmark, Tag, Sliders, Monitor, FileText, ArrowLeftRight, Clock, PiggyBank, Pencil, Target } from "lucide-react";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const monthlyData = [
  { month: "Jan", value: 0 }, { month: "Fev", value: 0 }, { month: "Mar", value: 0 },
  { month: "Abr", value: 0 }, { month: "Mai", value: 0 }, { month: "Jun", value: 0 },
  { month: "Jul", value: 0 }, { month: "Ago", value: 0 }, { month: "Set", value: 0 },
  { month: "Out", value: 0 }, { month: "Nov", value: 0 }, { month: "Dez", value: 0 },
];

const subTabs = [
  { id: "chart", icon: BarChart3 },
  { id: "cards", icon: CreditCard },
  { id: "calendar", icon: Calendar },
  { id: "cart", icon: ShoppingCart },
  { id: "bank", icon: Landmark },
  { id: "tags", icon: Tag },
  { id: "rules", icon: Sliders },
  { id: "monitor", icon: Monitor },
  { id: "notes", icon: FileText },
  { id: "transfers", icon: ArrowLeftRight },
  { id: "history", icon: Clock },
  { id: "allocation", icon: PiggyBank },
];

export default function Finance() {
  const [activeSubTab, setActiveSubTab] = useState("calendar");

  return (
    <Layout>
      <div className="px-4 py-4 max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Finanças</h1>
            <p className="text-sm text-gray-400">Gerenciar finanças</p>
          </div>
        </div>

        {/* Sub-tabs grid */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4">
          <div className="flex flex-wrap justify-center gap-3">
            {subTabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveSubTab(tab.id)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${activeSubTab === tab.id ? 'bg-red-500 text-white' : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#333]'}`}>
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Calendar Tab */}
        {activeSubTab === "calendar" && (
          <>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
              <h3 className="font-bold mb-4">Saldo por Mês — 2026</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthlyData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis dataKey="month" stroke="#555" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#555" tick={{ fontSize: 10 }} tickFormatter={(v) => `R$${v}k`} />
                  <Line type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"].map(month => (
                <div key={month} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold">{month}</h4>
                    <button className="p-1 hover:bg-[#2a2a2a] rounded-lg transition"><Pencil className="w-4 h-4 text-gray-400" /></button>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between"><span className="text-sm text-green-400">📈 Renda</span><span className="text-sm font-bold text-green-400">R$ 0,00</span></div>
                    <div className="flex justify-between"><span className="text-sm text-red-400">📉 Gastos</span><span className="text-sm font-bold text-red-400">R$ 0,00</span></div>
                    <div className="border-t border-[#2a2a2a] pt-1.5 flex justify-between"><span className="text-sm text-gray-400">Saldo</span><span className="text-sm font-bold text-red-500">R$ 0,00</span></div>
                    <p className="text-xs text-gray-500 text-center">0 transações</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Rules Tab */}
        {activeSubTab === "rules" && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Regras de Categorização</h3>
                <p className="text-sm text-gray-400">Automatize a categorização de transações</p>
              </div>
              <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition text-sm">
                <Plus className="w-4 h-4" />Nova Regra
              </button>
            </div>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 text-center">
              <Sliders className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400 mb-1">Nenhuma regra de categorização.</p>
              <p className="text-sm text-gray-500">Crie regras para categorizar transações automaticamente.</p>
            </div>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
              <h4 className="text-red-500 font-bold mb-3">Como funciona?</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• As regras são aplicadas automaticamente ao importar transações</li>
                <li>• Transações com descrição que corresponde ao padrão definido serão categorizadas automaticamente</li>
              </ul>
            </div>
          </>
        )}

        {/* Allocation Tab */}
        {activeSubTab === "allocation" && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center"><PiggyBank className="w-5 h-5 text-purple-400" /></div>
                <div>
                  <h3 className="font-bold">Alocação de Renda</h3>
                  <p className="text-sm text-gray-400">Planeje para onde vai seu dinheiro</p>
                </div>
              </div>
              <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition text-sm">
                <Plus className="w-4 h-4" />Nova Alocação
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4"><p className="text-xs text-gray-400">Renda do Mês</p><p className="text-xl font-bold text-red-500">R$ 0,00</p></div>
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4"><p className="text-xs text-gray-400">Total Alocado</p><p className="text-xl font-bold text-purple-400">R$ 0,00</p></div>
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4"><p className="text-xs text-gray-400">Restante</p><p className="text-xl font-bold text-red-500">R$ 0,00</p></div>
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4"><p className="text-xs text-gray-400">% Alocado</p><p className="text-xl font-bold text-yellow-400">0%</p></div>
            </div>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4"><Target className="w-4 h-4 text-gray-400" /><h3 className="font-bold">Suas Alocações</h3></div>
              <div className="text-center py-8">
                <PiggyBank className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">Nenhuma alocação criada</p>
              </div>
            </div>
          </>
        )}

        {/* Default */}
        {!["calendar", "rules", "allocation"].includes(activeSubTab) && (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 text-center">
            <p className="text-gray-400">Seção em desenvolvimento...</p>
          </div>
        )}
      </div>

      {/* FAB */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 z-30 transition">
        <Plus className="w-7 h-7 text-white" />
      </button>
    </Layout>
  );
}
