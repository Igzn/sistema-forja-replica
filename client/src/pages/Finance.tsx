import Layout from "@/components/Layout";
import { Plus, Wallet, BarChart3, CreditCard, Calendar, ShoppingCart, Landmark, Tag, Sliders, Monitor, FileText, ArrowLeftRight, Clock, PiggyBank, Pencil, Target, X, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  month: number;
}

const monthlyData = [
  { month: "Jan", value: 0 }, { month: "Fev", value: 0 }, { month: "Mar", value: 0 },
  { month: "Abr", value: 0 }, { month: "Mai", value: 0 }, { month: "Jun", value: 0 },
  { month: "Jul", value: 0 }, { month: "Ago", value: 0 }, { month: "Set", value: 0 },
  { month: "Out", value: 0 }, { month: "Nov", value: 0 }, { month: "Dez", value: 0 },
];

const subTabs = [
  { id: "chart", icon: BarChart3, label: "Gráficos" },
  { id: "cards", icon: CreditCard, label: "Cartões" },
  { id: "calendar", icon: Calendar, label: "Calendário" },
  { id: "cart", icon: ShoppingCart, label: "Compras" },
  { id: "bank", icon: Landmark, label: "Contas" },
  { id: "tags", icon: Tag, label: "Categorias" },
  { id: "rules", icon: Sliders, label: "Regras" },
  { id: "monitor", icon: Monitor, label: "Monitor" },
  { id: "notes", icon: FileText, label: "Notas" },
  { id: "transfers", icon: ArrowLeftRight, label: "Transferências" },
  { id: "history", icon: Clock, label: "Histórico" },
  { id: "allocation", icon: PiggyBank, label: "Alocação" },
];

const expenseCategories = ["Alimentação", "Transporte", "Moradia", "Lazer", "Saúde", "Educação", "Roupas", "Outros"];

export default function Finance() {
  const [activeSubTab, setActiveSubTab] = useState("calendar");
  const [showModal, setShowModal] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newType, setNewType] = useState<"income" | "expense">("expense");
  const [newCategory, setNewCategory] = useState("Alimentação");

  const createTransaction = () => {
    if (!newTitle.trim()) { toast.error("Digite o título"); return; }
    if (!newAmount || parseFloat(newAmount) <= 0) { toast.error("Digite um valor válido"); return; }
    const tx: Transaction = {
      id: Date.now().toString(),
      title: newTitle,
      amount: parseFloat(newAmount),
      type: newType,
      category: newCategory,
      date: new Date().toLocaleDateString("pt-BR"),
      month: new Date().getMonth(),
    };
    setTransactions(prev => [...prev, tx]);
    setShowModal(false);
    setNewTitle(""); setNewAmount(""); setNewType("expense"); setNewCategory("Alimentação");
    toast.success(`${newType === "income" ? "Receita" : "Despesa"} "${newTitle}" adicionada!`);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast.info("Transação removida");
  };

  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

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
                <button key={tab.id} onClick={() => setActiveSubTab(tab.id)} title={tab.label}
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
                  <YAxis stroke="#555" tick={{ fontSize: 10 }} tickFormatter={(v) => `R$${v}`} />
                  <Line type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {monthNames.slice(0, 6).map((month, idx) => {
                const monthTx = transactions.filter(t => t.month === idx);
                const mIncome = monthTx.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
                const mExpense = monthTx.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
                return (
                  <div key={month} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold">{month}</h4>
                      <button className="p-1 hover:bg-[#2a2a2a] rounded-lg transition"><Pencil className="w-4 h-4 text-gray-400" /></button>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between"><span className="text-sm text-green-400">📈 Renda</span><span className="text-sm font-bold text-green-400">R$ {mIncome.toFixed(2)}</span></div>
                      <div className="flex justify-between"><span className="text-sm text-red-400">📉 Gastos</span><span className="text-sm font-bold text-red-400">R$ {mExpense.toFixed(2)}</span></div>
                      <div className="border-t border-[#2a2a2a] pt-1.5 flex justify-between"><span className="text-sm text-gray-400">Saldo</span><span className={`text-sm font-bold ${(mIncome - mExpense) >= 0 ? 'text-green-400' : 'text-red-500'}`}>R$ {(mIncome - mExpense).toFixed(2)}</span></div>
                      <p className="text-xs text-gray-500 text-center">{monthTx.length} transações</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Chart Tab */}
        {activeSubTab === "chart" && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 text-center">
                <p className="text-xs text-gray-400">Receitas</p>
                <p className="text-lg font-bold text-green-400">R$ {totalIncome.toFixed(2)}</p>
              </div>
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 text-center">
                <p className="text-xs text-gray-400">Despesas</p>
                <p className="text-lg font-bold text-red-400">R$ {totalExpense.toFixed(2)}</p>
              </div>
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 text-center">
                <p className="text-xs text-gray-400">Saldo</p>
                <p className={`text-lg font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>R$ {balance.toFixed(2)}</p>
              </div>
            </div>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
              <h3 className="font-bold mb-4">Evolução Mensal</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthlyData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis dataKey="month" stroke="#555" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#555" tick={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeSubTab === "history" && (
          <div className="space-y-3">
            {transactions.length > 0 ? (
              transactions.map(tx => (
                <div key={tx.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === "income" ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      {tx.type === "income" ? <TrendingUp className="w-5 h-5 text-green-400" /> : <TrendingDown className="w-5 h-5 text-red-400" />}
                    </div>
                    <div>
                      <p className="font-medium">{tx.title}</p>
                      <p className="text-xs text-gray-400">{tx.category} · {tx.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${tx.type === "income" ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.type === "income" ? '+' : '-'}R$ {tx.amount.toFixed(2)}
                    </span>
                    <button onClick={() => deleteTransaction(tx.id)} className="text-gray-500 hover:text-red-400 transition text-xs ml-2">✕</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 text-center">
                <Clock className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">Nenhuma transação registrada</p>
                <p className="text-sm text-gray-500 mt-1">Adicione receitas e despesas usando o botão +</p>
              </div>
            )}
          </div>
        )}

        {/* Cards Tab */}
        {activeSubTab === "cards" && (
          <div className="space-y-4">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Meus Cartões</h3>
                <button onClick={() => toast.info("Funcionalidade em breve")} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl text-sm flex items-center gap-1 transition"><Plus className="w-4 h-4" /> Novo</button>
              </div>
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">Nenhum cartão cadastrado</p>
              </div>
            </div>
          </div>
        )}

        {/* Tags Tab */}
        {activeSubTab === "tags" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Categorias</h3>
              <button onClick={() => toast.info("Funcionalidade em breve")} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl text-sm flex items-center gap-1 transition"><Plus className="w-4 h-4" /> Nova</button>
            </div>
            <div className="space-y-2">
              {expenseCategories.map(cat => (
                <div key={cat} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="font-medium">{cat}</span>
                  </div>
                  <span className="text-sm text-gray-400">R$ 0,00</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rules Tab */}
        {activeSubTab === "rules" && (
          <>
            <div className="flex items-center justify-between">
              <div><h3 className="font-bold text-lg">Regras de Categorização</h3><p className="text-sm text-gray-400">Automatize a categorização</p></div>
              <button onClick={() => toast.info("Funcionalidade em breve")} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition text-sm"><Plus className="w-4 h-4" />Nova Regra</button>
            </div>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 text-center">
              <Sliders className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400 mb-1">Nenhuma regra de categorização.</p>
              <p className="text-sm text-gray-500">Crie regras para categorizar transações automaticamente.</p>
            </div>
          </>
        )}

        {/* Allocation Tab */}
        {activeSubTab === "allocation" && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center"><PiggyBank className="w-5 h-5 text-purple-400" /></div>
                <div><h3 className="font-bold">Alocação de Renda</h3><p className="text-sm text-gray-400">Planeje para onde vai seu dinheiro</p></div>
              </div>
              <button onClick={() => toast.info("Funcionalidade em breve")} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition text-sm"><Plus className="w-4 h-4" />Nova</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4"><p className="text-xs text-gray-400">Renda do Mês</p><p className="text-xl font-bold text-red-500">R$ {totalIncome.toFixed(2)}</p></div>
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4"><p className="text-xs text-gray-400">Total Alocado</p><p className="text-xl font-bold text-purple-400">R$ 0,00</p></div>
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4"><p className="text-xs text-gray-400">Restante</p><p className="text-xl font-bold text-red-500">R$ {totalIncome.toFixed(2)}</p></div>
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4"><p className="text-xs text-gray-400">% Alocado</p><p className="text-xl font-bold text-yellow-400">0%</p></div>
            </div>
          </>
        )}

        {/* Bank Tab */}
        {activeSubTab === "bank" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Contas Bancárias</h3>
              <button onClick={() => toast.info("Funcionalidade em breve")} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl text-sm flex items-center gap-1 transition"><Plus className="w-4 h-4" /> Nova</button>
            </div>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 text-center">
              <Landmark className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">Nenhuma conta cadastrada</p>
            </div>
          </div>
        )}

        {/* Monitor Tab */}
        {activeSubTab === "monitor" && (
          <div className="space-y-4">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
              <h3 className="font-bold mb-4">Monitor Financeiro</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-400">Total Receitas</p>
                  <p className="text-xl font-bold text-green-400">R$ {totalIncome.toFixed(2)}</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-400">Total Despesas</p>
                  <p className="text-xl font-bold text-red-400">R$ {totalExpense.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeSubTab === "notes" && (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 text-center">
            <FileText className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">Nenhuma nota financeira</p>
            <p className="text-sm text-gray-500 mt-1">Adicione notas e observações sobre suas finanças</p>
          </div>
        )}

        {/* Transfers Tab */}
        {activeSubTab === "transfers" && (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 text-center">
            <ArrowLeftRight className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">Nenhuma transferência registrada</p>
            <p className="text-sm text-gray-500 mt-1">Transfira entre contas para organizar suas finanças</p>
          </div>
        )}

        {/* Cart Tab */}
        {activeSubTab === "cart" && (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 text-center">
            <ShoppingCart className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">Nenhuma lista de compras</p>
            <p className="text-sm text-gray-500 mt-1">Crie listas de compras para controlar seus gastos</p>
          </div>
        )}
      </div>

      {/* FAB */}
      <button onClick={() => setShowModal(true)} className="fixed bottom-24 right-6 w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 z-30 transition">
        <Plus className="w-7 h-7 text-white" />
      </button>

      {/* Modal Nova Transação */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center" onClick={() => setShowModal(false)}>
          <div className="bg-[#1a1a1a] w-full max-w-lg rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Nova Transação</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[#2a2a2a] rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-5">
              {/* Tipo */}
              <div className="flex gap-2">
                <button onClick={() => setNewType("expense")}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition border ${
                    newType === "expense" ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-[#2a2a2a] border-[#333] text-gray-400'
                  }`}>
                  <TrendingDown className="w-4 h-4" /> Despesa
                </button>
                <button onClick={() => setNewType("income")}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition border ${
                    newType === "income" ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-[#2a2a2a] border-[#333] text-gray-400'
                  }`}>
                  <TrendingUp className="w-4 h-4" /> Receita
                </button>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Título *</label>
                <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Ex: Salário, Mercado..."
                  className="w-full bg-[#2a2a2a] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none transition" />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Valor (R$) *</label>
                <input type="number" value={newAmount} onChange={e => setNewAmount(e.target.value)} placeholder="0,00" step="0.01"
                  className="w-full bg-[#2a2a2a] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none transition" />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Categoria</label>
                <div className="flex gap-2 flex-wrap">
                  {expenseCategories.map(cat => (
                    <button key={cat} onClick={() => setNewCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition ${newCategory === cat ? 'bg-red-500 text-white' : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#333]'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 bg-[#2a2a2a] text-gray-300 py-3 rounded-xl font-medium hover:bg-[#333] transition">Cancelar</button>
                <button onClick={createTransaction} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition">Adicionar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
