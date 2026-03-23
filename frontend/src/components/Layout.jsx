import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

const navClasses =
  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition";

const activeNavClasses = navClasses + " bg-slate-900 text-primary-300";

const Layout = ({ children }) => {
  const { user, role, logout } = useAuth();

  return (
    <div className="page-container">
      <aside className="glass-panel flex w-64 flex-col border-r border-slate-800/80">
        <div className="flex items-center gap-2 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/20 text-primary-300">
            <span className="text-lg font-bold">Ag</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">AgroCloud</p>
            <p className="text-xs text-slate-400">Smart Irrigation</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-4">
          {role === "farmer" && (
            <>
              <NavLink
                to="/farmer"
                className={({ isActive }) => (isActive ? activeNavClasses : navClasses)}
              >
                <span>Farmer Dashboard</span>
              </NavLink>
              <NavLink
                to="/farmer/prediction"
                className={({ isActive }) => (isActive ? activeNavClasses : navClasses)}
              >
                <span>Prediction</span>
              </NavLink>
              <NavLink
                to="/farmer/analytics"
                className={({ isActive }) => (isActive ? activeNavClasses : navClasses)}
              >
                <span>Analytics</span>
              </NavLink>
            </>
          )}

          {role === "admin" && (
            <>
              <NavLink
                to="/admin"
                className={({ isActive }) => (isActive ? activeNavClasses : navClasses)}
              >
                <span>Admin Dashboard</span>
              </NavLink>
              <NavLink
                to="/admin/analytics"
                className={({ isActive }) => (isActive ? activeNavClasses : navClasses)}
              >
                <span>Platform Analytics</span>
              </NavLink>
            </>
          )}

          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? activeNavClasses : navClasses)}
          >
            <span>Profile</span>
          </NavLink>
        </nav>
        <div className="border-t border-slate-800/80 px-4 py-4 text-xs text-slate-400">
          <p className="mb-2">
            Signed in as{" "}
            <span className="font-medium text-slate-200">
              {user?.email || "Guest"}
            </span>
          </p>
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
              {role === "admin" ? "Admin" : "Farmer"}
            </span>
            <button
              type="button"
              className="text-[11px] font-medium text-slate-400 hover:text-red-300"
              onClick={logout}
            >
              Log out
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40 px-8 py-4 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-400">
              AgroCloud
            </p>
            <p className="text-sm text-slate-300">
              AI-powered irrigation insights for smarter farming.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <Link
              to="/"
              className="rounded-full border border-slate-700/80 px-3 py-1 hover:border-primary-400 hover:text-primary-200"
            >
              Go to landing
            </Link>
          </div>
        </header>
        <div className="px-8 py-6">{children}</div>
      </main>
    </div>
  );
};

export default Layout;

