import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ChartCard from "../components/ChartCard";
import { useAuth } from "../services/AuthContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseClient";
import {
  fetchPredictionTrends,
  fetchCropStats
} from "../services/api";

const AnalyticsPage = ({ mode }) => {
  const { user } = useAuth();
  const [farmerSeries, setFarmerSeries] = useState(null);
  const [adminTrends, setAdminTrends] = useState(null);
  const [adminCrops, setAdminCrops] = useState(null);

  useEffect(() => {
    if (mode === "farmer" && user) {
      const q = query(
        collection(db, "predictions"),
        where("userId", "==", user.uid)
      );
      const unsub = onSnapshot(q, (snap) => {
        const daily = {};
        snap.forEach((d) => {
          const data = d.data();
          const ts = data.timestamp?.toDate?.() || new Date();
          const day = ts.toISOString().slice(0, 10);
          if (!daily[day]) {
            daily[day] = { irrigationNeeded: 0, noIrrigation: 0 };
          }
          if (data.prediction === 1) {
            daily[day].irrigationNeeded += 1;
          } else {
            daily[day].noIrrigation += 1;
          }
        });
        const labels = Object.keys(daily).sort();
        setFarmerSeries({
          labels,
          irrigationNeeded: labels.map((d) => daily[d].irrigationNeeded),
          noIrrigation: labels.map((d) => daily[d].noIrrigation)
        });
      });
      return () => unsub();
    }
  }, [mode, user]);

  useEffect(() => {
    if (mode === "admin") {
      const load = async () => {
        try {
          const [tr, cr] = await Promise.all([
            fetchPredictionTrends(),
            fetchCropStats()
          ]);
          setAdminTrends(tr.data);
          setAdminCrops(cr.data);
        } catch {
          // ignore, surfaces as empty charts
        }
      };
      load();
    }
  }, [mode]);

  const farmerData =
    farmerSeries &&
    ({
      labels: farmerSeries.labels,
      datasets: [
        {
          label: "Irrigation Needed",
          data: farmerSeries.irrigationNeeded,
          borderColor: "#22c55e",
          backgroundColor: "rgba(34,197,94,0.25)",
          tension: 0.3
        },
        {
          label: "No Irrigation Needed",
          data: farmerSeries.noIrrigation,
          borderColor: "#38bdf8",
          backgroundColor: "rgba(56,189,248,0.25)",
          tension: 0.3
        }
      ]
    });

  const adminTrendData =
    adminTrends &&
    ({
      labels: adminTrends.labels,
      datasets: [
        {
          label: "Irrigation Needed",
          data: adminTrends.irrigationNeeded,
          borderColor: "#22c55e",
          backgroundColor: "rgba(34,197,94,0.25)",
          tension: 0.3
        },
        {
          label: "No Irrigation Needed",
          data: adminTrends.noIrrigationNeeded,
          borderColor: "#38bdf8",
          backgroundColor: "rgba(56,189,248,0.25)",
          tension: 0.3
        }
      ]
    });

  const adminCropData =
    adminCrops &&
    ({
      labels: adminCrops.labels,
      datasets: [
        {
          label: "Irrigation decisions per crop",
          data: adminCrops.values,
          backgroundColor: "rgba(34,197,94,0.5)",
          borderColor: "#22c55e"
        }
      ]
    });

  const chartOptions = {
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
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-50">
          {mode === "admin" ? "Platform analytics" : "Your irrigation analytics"}
        </h1>
        <p className="text-xs text-slate-400">
          {mode === "admin"
            ? "Understand irrigation trends and crop patterns across the platform."
            : "See how your irrigation needs evolve over time."}
        </p>
      </div>

      {mode === "farmer" && (
        <div className="grid gap-4 lg:grid-cols-1">
          {farmerData ? (
            <ChartCard
              title="Your irrigation history"
              description="How often irrigation was required or skipped."
              type="line"
              data={farmerData}
              options={chartOptions}
            />
          ) : (
            <div className="glass-panel rounded-2xl border border-slate-800/80 p-4 text-xs text-slate-400">
              No prediction history yet. Run predictions to see analytics.
            </div>
          )}
        </div>
      )}

      {mode === "admin" && (
        <div className="grid gap-4 lg:grid-cols-2">
          {adminTrendData && (
            <ChartCard
              title="Irrigation decisions over time"
              description="Daily view of platform-wide irrigation calls."
              type="line"
              data={adminTrendData}
              options={chartOptions}
            />
          )}
          {adminCropData && (
            <ChartCard
              title="Crop irrigation patterns"
              description="How often crops require irrigation."
              type="bar"
              data={adminCropData}
              options={chartOptions}
            />
          )}
          {!adminTrendData && !adminCropData && (
            <div className="glass-panel rounded-2xl border border-slate-800/80 p-4 text-xs text-slate-400">
              No analytics available yet. Ensure the backend is running and
              predictions have been made.
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default AnalyticsPage;

