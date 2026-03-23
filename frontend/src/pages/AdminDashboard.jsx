import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import {
  fetchAdminOverview,
  fetchPredictionTrends,
  fetchCropStats,
  fetchAdminUsers,
  updateUserStatus,
  uploadDataset,
  triggerRetrain
} from "../services/api";

const AdminDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [trend, setTrend] = useState(null);
  const [crops, setCrops] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [datasetFile, setDatasetFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [ov, tr, cr, us] = await Promise.all([
          fetchAdminOverview(),
          fetchPredictionTrends(),
          fetchCropStats(),
          fetchAdminUsers()
        ]);
        setOverview(ov.data);
        setTrend(tr.data);
        setCrops(cr.data);
        setUsers(us.data.users || []);
      } catch (e) {
        setMessage("Failed to load admin data. Check backend connectivity.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleToggleUser = async (userId, active) => {
    try {
      await updateUserStatus(userId, !active);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, active: !active } : u
        )
      );
    } catch {
      setMessage("Failed to update user state.");
    }
  };

  const handleDatasetUpload = async (e) => {
    e.preventDefault();
    if (!datasetFile) return;
    try {
      await uploadDataset(datasetFile);
      setMessage("Dataset uploaded. You can now retrain the model.");
      setDatasetFile(null);
    } catch {
      setMessage("Failed to upload dataset.");
    }
  };

  const handleRetrain = async () => {
    try {
      const res = await triggerRetrain();
      setMessage(res.data.message || "Model retrained.");
    } catch {
      setMessage("Failed to retrain model. Check backend logs.");
    }
  };

  const trendData = trend
    ? {
        labels: trend.labels,
        datasets: [
          {
            label: "Irrigation Needed",
            data: trend.irrigationNeeded,
            borderColor: "#22c55e",
            backgroundColor: "rgba(34,197,94,0.25)",
            tension: 0.3
          },
          {
            label: "No Irrigation Needed",
            data: trend.noIrrigationNeeded,
            borderColor: "#38bdf8",
            backgroundColor: "rgba(56,189,248,0.25)",
            tension: 0.3
          }
        ]
      }
    : null;

  const cropData = crops
    ? {
        labels: crops.labels,
        datasets: [
          {
            label: "Irrigation decisions per crop",
            data: crops.values,
            backgroundColor: "rgba(34,197,94,0.5)",
            borderColor: "#22c55e"
          }
        ]
      }
    : null;

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-50">
            Admin dashboard
          </h1>
          <p className="text-xs text-slate-400">
            Platform-wide irrigation usage, user management and ML lifecycle.
          </p>
        </div>
      </div>

      {loading && (
        <p className="text-xs text-slate-400">
          Loading platform analytics from backend...
        </p>
      )}

      {message && (
        <p className="mb-3 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/40 rounded-lg px-3 py-2">
          {message}
        </p>
      )}

      {overview && (
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            label="Total farmers"
            value={overview.totalFarmers}
            hint="Active farmer accounts in the platform."
          />
          <StatCard
            label="Total predictions"
            value={overview.totalPredictions}
            hint="All irrigation calls made so far."
          />
          <StatCard
            label="Irrigation needed"
            value={overview.irrigationNeeded}
            hint="Times water was recommended."
            tone="warning"
          />
          <StatCard
            label="No irrigation"
            value={overview.noIrrigationNeeded}
            hint="Times irrigation could be skipped."
            tone="success"
          />
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        {trendData && (
          <ChartCard
            title="Platform irrigation decisions"
            description="Daily irrigation recommendations across all farmers."
            type="line"
            data={trendData}
          />
        )}
        {cropData && (
          <ChartCard
            title="Crop irrigation patterns"
            description="How often irrigation is needed per crop."
            type="bar"
            data={cropData}
          />
        )}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="glass-panel rounded-2xl border border-slate-800/80 p-4">
          <p className="mb-2 text-sm font-semibold text-slate-100">
            User management
          </p>
          <p className="mb-3 text-xs text-slate-400">
            View farmers and toggle activation for access control.
          </p>
          <div className="max-h-72 space-y-2 overflow-y-auto pr-1 text-xs">
            {users.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between rounded-xl bg-slate-950/70 px-3 py-2"
              >
                <div>
                  <p className="font-medium text-slate-100">{u.email}</p>
                  <p className="text-[11px] text-slate-400">
                    Role: {u.role || "farmer"}
                  </p>
                </div>
                <button
                  type="button"
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    u.active
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-slate-700/60 text-slate-300"
                  }`}
                  onClick={() => handleToggleUser(u.id, u.active)}
                >
                  {u.active ? "Active" : "Inactive"}
                </button>
              </div>
            ))}
            {users.length === 0 && (
              <p className="text-slate-500">No user records found yet.</p>
            )}
          </div>
        </div>

        <div className="glass-panel rounded-2xl border border-slate-800/80 p-4">
          <p className="mb-2 text-sm font-semibold text-slate-100">
            Dataset & model lifecycle
          </p>
          <p className="mb-3 text-xs text-slate-400">
            Upload a new irrigation dataset and trigger model retraining.
          </p>
          <form
            onSubmit={handleDatasetUpload}
            className="space-y-3 text-xs text-slate-300"
          >
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setDatasetFile(e.target.files?.[0] || null)}
              className="block w-full text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-500/80 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-primary-600"
            />
            <button
              type="submit"
              className="btn-secondary w-full justify-center"
              disabled={!datasetFile}
            >
              Upload dataset
            </button>
          </form>
          <button
            type="button"
            onClick={handleRetrain}
            className="btn-primary mt-3 w-full justify-center"
          >
            Retrain model
          </button>
          <p className="mt-2 text-[11px] text-slate-500">
            Backend uses the uploaded CSV to retrain the Random Forest model and
            refreshes predictions instantly.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;

