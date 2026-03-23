import React from "react";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";

const ChartCard = ({ title, description, type = "line", data, options }) => {
  return (
    <div className="glass-panel flex flex-col rounded-2xl border border-slate-800/80 p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-100">{title}</p>
          {description && (
            <p className="text-xs text-slate-400">{description}</p>
          )}
        </div>
      </div>
      <div className="h-64">
        {type === "bar" ? (
          <Bar data={data} options={options} />
        ) : (
          <Line data={data} options={options} />
        )}
      </div>
    </div>
  );
};

export default ChartCard;

