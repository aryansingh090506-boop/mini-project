import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import { useAuth } from "../services/AuthContext";
import { collection, onSnapshot, query, where, limit, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebaseClient";

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, "predictions"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc"),
      limit(50)
    );
    const unsub = onSnapshot(q, (snap) => {
      const docs = [];
      snap.forEach((d) => docs.push({ id: d.id, ...d.data() }));
      docs.sort(
        (a, b) =>
          (b.timestamp?.toMillis?.() || 0) - (a.timestamp?.toMillis?.() || 0)
      );
      setPredictions(docs);
    });
    return () => unsub();
  }, [user]);

  const totalPredictions = predictions.length;
  const irrigationNeeded = predictions.filter((p) => p.prediction === 1).length;
  const noIrrigation = totalPredictions - irrigationNeeded;

  const trendCounts = {};
  predictions.forEach((p) => {
    const ts = p.timestamp ? (p.timestamp.toDate?.() || new Date()) : null;
    if (!ts) return;
    const day = ts.toISOString().slice(0, 10);
    if (!trendCounts[day]) {
      trendCounts[day] = { irrigationNeeded: 0, noIrrigation: 0 };
    }
    if (p.prediction === 1) {
      trendCounts[day].irrigationNeeded += 1;
    } else {
      trendCounts[day].noIrrigation += 1;
    }
  });

  const trendLabels = Object.keys(trendCounts).sort();
  const irrigationSeries = trendLabels.map((d) => trendCounts[d].irrigationNeeded);
  const noIrrigationSeries = trendLabels.map((d) => trendCounts[d].noIrrigation);

  const trendData = {
    labels: trendLabels,
    datasets: [
      {
        label: "Irrigation Needed",
        data: irrigationSeries,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.25)",
        tension: 0.3
      },
      {
        label: "No Irrigation Needed",
        data: noIrrigationSeries,
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56,189,248,0.25)",
        tension: 0.3
      }
    ]
  };

  const trendOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#e5e7eb",
          font: { size: 11 }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: "#9ca3af", font: { size: 10 } },
        grid: { color: "rgba(31,41,55,0.6)" }
      },
      y: {
        ticks: { color: "#9ca3af", font: { size: 10 } },
        grid: { color: "rgba(31,41,55,0.6)" }
      }
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-50">
            Farmer dashboard
          </h1>
          <p className="text-xs text-slate-400">
            Monitor your irrigation recommendations and weather-driven trends.
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total predictions"
          value={totalPredictions}
          hint="All irrigation checks you requested."
        />
        <StatCard
          label="Irrigation needed"
          value={irrigationNeeded}
          hint="Times the model recommended irrigation."
          tone="warning"
        />
        <StatCard
          label="Water saved opportunities"
          value={noIrrigation}
          hint="Times irrigation was not required."
          tone="success"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <ChartCard
          title="Irrigation decisions over time"
          description="Daily view of when irrigation was or wasn't needed."
          type="line"
          data={trendData}
          options={trendOptions}
        />
        <div className="glass-panel flex flex-col rounded-2xl border border-slate-800/80 p-4">
          <p className="text-sm font-semibold text-slate-100">
            Recent predictions
          </p>
          <p className="mb-3 text-xs text-slate-400">
            Latest irrigation calls generated for your fields.
          </p>
          <div className="max-h-64 space-y-2 overflow-y-auto pr-1 text-xs">
            {predictions.length === 0 && (
              <p className="text-slate-500">
                No predictions yet. Run your first prediction from the
                Prediction page.
              </p>
            )}
            {predictions.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl bg-slate-950/70 px-3 py-2"
              >
                <div>
                  <p className="font-medium text-slate-100">
                    {p.crop} – {p.soil}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Temp {p.temperature}°C · Humidity {p.humidity}% · Rainfall{" "}
                    {p.rainfall}mm
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    p.prediction === 1
                      ? "bg-amber-500/15 text-amber-300"
                      : "bg-emerald-500/15 text-emerald-300"
                  }`}
                >
                  {p.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FarmerDashboard;
