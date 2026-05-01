import { Link, useLocation } from 'react-router-dom';

export default function MarketingLayout({ children }) {
  const location = useLocation();
  const onLogin = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-cream eq-grain flex flex-col">
      {/* announcement bar */}
      <div className="bg-analyst text-ink">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-micro">
            Welcome to Taskflow — collaborative task management for teams
          </span>
          <span className="font-mono text-[10px]">→</span>
        </div>
      </div>

      {/* top nav */}
      <header className="border-b border-ink">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="serif-italic text-2xl text-ink">Taskflow</span>
            <span className="font-mono text-[9px] uppercase tracking-micro text-slate">v1</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              to="/login"
              className={`text-sm transition-colors ${
                onLogin ? 'text-ink font-medium' : 'text-slate hover:text-ink'
              }`}
            >
              Login
            </Link>
            <Link to="/signup" className="eq-btn-primary text-sm">
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      {/* main */}
      <main className="flex-1 flex items-start justify-center px-6 py-16">
        {children}
      </main>

      {/* footer */}
      <footer className="border-t border-fog">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-micro text-slate">
            Taskflow · v1.0.0
          </span>
          <span className="font-mono text-[10px] uppercase tracking-micro text-slate">
            Editorial · Spreadsheet · Cream
          </span>
        </div>
      </footer>
    </div>
  );
}
