import React from "react";

const StatCard = ({ label, value, hint, tone = "default" }) => {
  const toneClasses =
    tone === "success"
      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
      : tone === "warning"
      ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
      : "bg-slate-900/80 text-slate-100 border-slate-800/80";

  return (
    <div className={`glass-panel rounded-2xl border px-4 py-4 shadow-card ${toneClasses}`}>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
};

export default StatCard;

