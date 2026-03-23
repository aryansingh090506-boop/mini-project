import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-950">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/20 text-primary-300">
            <span className="text-lg font-bold">Ag</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">AgroCloud</p>
            <p className="text-xs text-slate-400">AI-powered irrigation platform</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Link to="/login" className="btn-secondary">
            Log in
          </Link>
          <Link to="/signup" className="btn-primary">
            Get started
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 pb-16 pt-4">
        <div className="grid w-full gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <section>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
              Smart irrigation decisions,{" "}
              <span className="bg-gradient-to-r from-primary-300 to-emerald-400 bg-clip-text text-transparent">
                powered by AI.
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-sm text-slate-300 sm:text-base">
              AgroCloud helps farmers predict when irrigation is truly needed using
              weather, soil and crop intelligence — reducing water usage while
              protecting yields.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/signup" className="btn-primary">
                Start as a farmer
              </Link>
              <span className="text-xs text-slate-400">
                Built with Random Forests, Firebase, and smart analytics.
              </span>
            </div>
            <div className="mt-8 grid max-w-xl grid-cols-2 gap-4 text-xs">
              <div className="glass-panel rounded-2xl border border-emerald-700/40 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
                  Real-time insights
                </p>
                <p className="mt-2 text-slate-200">
                  Instant irrigation recommendations from an ML model trained on
                  historical weather and soil data.
                </p>
              </div>
              <div className="glass-panel rounded-2xl border border-slate-700/60 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-300">
                  Cloud-native
                </p>
                <p className="mt-2 text-slate-200">
                  Secure Firebase auth, Firestore storage, and analytics dashboards
                  tailored for both farmers and admins.
                </p>
              </div>
            </div>
          </section>

          <section className="flex items-center">
            <div className="glass-panel w-full rounded-3xl border border-emerald-700/40 p-5 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                Live snapshot
              </p>
              <p className="mt-1 text-sm text-slate-200">
                Example irrigation insight from a farm cluster.
              </p>
              <div className="mt-5 space-y-3 text-xs">
                <div className="flex items-center justify-between rounded-xl bg-slate-900/80 px-3 py-2">
                  <span className="text-slate-400">Soil moisture band</span>
                  <span className="font-semibold text-emerald-300">Optimal</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-900/80 px-3 py-2">
                  <span className="text-slate-400">Irrigation today</span>
                  <span className="font-semibold text-amber-300">Not required</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-900/80 px-3 py-2">
                  <span className="text-slate-400">Predicted water saved</span>
                  <span className="font-semibold text-emerald-300">~18%</span>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between text-[11px] text-slate-400">
                <span>Ready to modernize your irrigation?</span>
                <Link
                  to="/signup"
                  className="rounded-full border border-emerald-600/70 px-3 py-1 text-emerald-200 hover:border-emerald-400"
                >
                  Create free account
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;

