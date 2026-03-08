import Layout from "@/components/Layout";
import { ChevronRight } from "lucide-react";

export default function Community() {
  return (
    <Layout>
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Affiliate Program */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 mb-6 border border-[#333333] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-xl">🚀</span>
            </div>
            <span className="font-bold text-cyan-400">Programa de Afiliados</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        {/* User Level Section */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 mb-6 border border-[#333333]">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <div>
                <p className="text-sm text-gray-400">Nível</p>
                <h3 className="text-xl font-bold">Iniciante</h3>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-2">
                <span className="text-2xl">⭐</span>
                <span className="text-xl font-bold">5</span>
              </div>
              <p className="text-xs text-gray-400">XP Total</p>
              <div className="flex items-center gap-2 justify-end mt-2">
                <span className="text-lg">💰</span>
                <span className="text-lg font-bold">1</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Próximo nível</span>
            <div className="flex-1 bg-[#2a2a2a] rounded-full h-2 overflow-hidden">
              <div className="bg-yellow-500 h-full" style={{ width: "5%" }}></div>
            </div>
            <span className="text-sm text-gray-400">5 / 100 XP (faltam 95)</span>
          </div>
        </div>

        {/* Achievement Tabs */}
        <div className="flex gap-3 mb-6 bg-[#1a1a1a] p-2 rounded-xl border border-[#333333]">
          <button className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-medium transition">
            💀 Chefes
          </button>
          <button className="flex-1 text-gray-400 py-2 px-4 rounded-lg hover:text-gray-300 transition">
            🎯 Objetivos
          </button>
          <button className="flex-1 text-gray-400 py-2 px-4 rounded-lg hover:text-gray-300 transition">
            🏆 Troféus
          </button>
        </div>

        {/* No Active Boss */}
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
