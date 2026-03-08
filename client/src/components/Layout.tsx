import { useLocation } from "wouter";
import { 
  BarChart3, 
  CheckSquare, 
  Calendar, 
  Target, 
  Users, 
  Wallet, 
  Clock,
  Zap,
  Coins,
  Skull,
  Award,
  User
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location, navigate] = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: BarChart3 },
    { path: "/habits", label: "Hábitos", icon: CheckSquare },
    { path: "/tasks", label: "Tarefas", icon: Calendar },
    { path: "/goals", label: "Metas", icon: Target },
    { path: "/community", label: "Comunid...", icon: Users },
    { path: "/finance", label: "Finanças", icon: Wallet },
    { path: "/focus", label: "Foco", icon: Clock },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-[#333333] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium">sistemaforja.com</span>
        </div>
        <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </header>

      {/* Top Bar - Status/Badges */}
      <div className="bg-[#1a1a1a] border-b border-[#333333] px-4 py-3 flex items-center gap-4 overflow-x-auto">
        <div className="flex items-center gap-2 bg-[#2a2a2a] px-3 py-2 rounded-lg whitespace-nowrap">
          <Zap className="w-4 h-4 text-red-500" />
          <span className="text-sm font-bold text-red-500">+5</span>
        </div>
        <div className="flex items-center gap-2 bg-[#2a2a2a] px-3 py-2 rounded-lg whitespace-nowrap">
          <Coins className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-bold text-yellow-500">1</span>
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition">
            <Skull className="w-5 h-5 text-purple-500" />
          </button>
          <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition">
            <Award className="w-5 h-5 text-red-500" />
          </button>
          <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition">
            <Award className="w-5 h-5 text-yellow-500" />
          </button>
          <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition">
            <User className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-[#333333] px-4 py-3 flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition ${
                isActive
                  ? "text-red-500"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
