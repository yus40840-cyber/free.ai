import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Activity, Users, FileText, DollarSign, Database, 
  Cpu, Server, RefreshCw, CheckCircle2, AlertTriangle, Sliders, 
  Key, ArrowRight, Layers
} from 'lucide-react';
import { AIProviderHealth, AIUsageRecord, UserRole } from '../types';

interface AdminPanelViewProps {
  onBackToDashboard: () => void;
  currentUserRole: UserRole;
  onChangeUserRole: (role: UserRole) => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  onBackToDashboard,
  currentUserRole,
  onChangeUserRole,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'providers' | 'prompts' | 'logs' | 'roles'>('overview');
  const [providers, setProviders] = useState<AIProviderHealth[]>([
    {
      provider: 'Google',
      model: 'gemini-3.8-flash',
      status: 'Online',
      latencyMs: 310,
      uptimePercent: 99.98,
      costPer1kTokens: '$0.00015',
      assignedTasks: 'Fast rewrites, Grammar, Outlines'
    },
    {
      provider: 'Anthropic',
      model: 'claude-3.5-sonnet',
      status: 'Online',
      latencyMs: 580,
      uptimePercent: 99.95,
      costPer1kTokens: '$0.00300',
      assignedTasks: 'Motivation letters, SOPs, Voice calibration'
    },
    {
      provider: 'DeepSeek',
      model: 'deepseek-r1',
      status: 'Online',
      latencyMs: 890,
      uptimePercent: 99.82,
      costPer1kTokens: '$0.00055',
      assignedTasks: 'Research synthesis, Deep reasoning, Claim verification'
    },
    {
      provider: 'OpenAI',
      model: 'gpt-4o',
      status: 'Online',
      latencyMs: 440,
      uptimePercent: 99.96,
      costPer1kTokens: '$0.00250',
      assignedTasks: 'Pre-flight multi-point final review'
    }
  ]);

  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/usage-logs')
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch(() => {});
  }, []);

  const promptsList = [
    { id: 'motivation_letter.generate.v3', model: 'claude-3.5-sonnet', temp: 0.7, task: 'University Application Motivation Letter' },
    { id: 'research.outline.v2', model: 'gemini-3.8-flash', temp: 0.5, task: 'Structured Empirical Paper Outline' },
    { id: 'research.synthesis.v4', model: 'deepseek-r1', temp: 0.2, task: 'Multi-Source Evidence Extraction & Claim Check' },
    { id: 'writing.clarity.v3', model: 'gemini-3.8-flash', temp: 0.3, task: 'Low-latency Academic Paraphrasing' },
    { id: 'citation.apa.v2', model: 'gemini-3.8-flash', temp: 0.1, task: 'APA 7 & IEEE Bibliographic Formatter' },
    { id: 'final.review.v5', model: 'gpt-4o', temp: 0.2, task: '9-Dimension Pre-flight Document Audit' }
  ];

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-6 sm:p-10 font-sans">
      
      {/* Admin Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mb-1">
            <span>ScholarFlow Control Console</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">All 4 AI Providers Operational</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Platform Admin & Multi-Model Telemetry
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-700">
            <span className="text-neutral-400">Current Role:</span>
            <select
              value={currentUserRole}
              onChange={(e) => onChangeUserRole(e.target.value as UserRole)}
              className="bg-transparent font-bold text-amber-400 focus:outline-none"
            >
              <option value="SUPER_ADMIN" className="bg-neutral-800 text-white">SUPER_ADMIN</option>
              <option value="ADMIN" className="bg-neutral-800 text-white">ADMIN</option>
              <option value="ORG_ADMIN" className="bg-neutral-800 text-white">ORG_ADMIN</option>
              <option value="EDITOR" className="bg-neutral-800 text-white">EDITOR</option>
              <option value="STUDENT" className="bg-neutral-800 text-white">STUDENT</option>
            </select>
          </div>

          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 bg-white text-neutral-900 hover:bg-neutral-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Exit Console
          </button>
        </div>
      </div>

      {/* Admin Navigation Strip */}
      <div className="max-w-7xl mx-auto flex items-center gap-2 border-b border-neutral-800 pb-3 mb-8 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'overview' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          System Overview & KPIs
        </button>
        <button
          onClick={() => setActiveTab('providers')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'providers' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Provider Health & Routing
        </button>
        <button
          onClick={() => setActiveTab('prompts')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'prompts' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Prompt Registry
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeTab === 'logs' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Live AI Request Stream
        </button>
      </div>

      {/* Main Content Areas */}
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TAB 1: System Overview & KPIs (Spec #50) */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-xl bg-neutral-800 border border-neutral-700">
                <div className="text-xs text-neutral-400">Total Registered Users</div>
                <div className="text-2xl font-bold font-mono-numbers text-white mt-1">12,421</div>
                <div className="text-[11px] text-emerald-400 mt-1">4,820 Monthly Active</div>
              </div>
              <div className="p-5 rounded-xl bg-neutral-800 border border-neutral-700">
                <div className="text-xs text-neutral-400">Documents Created</div>
                <div className="text-2xl font-bold font-mono-numbers text-white mt-1">38,920</div>
                <div className="text-[11px] text-neutral-400 mt-1">Research & SOPs</div>
              </div>
              <div className="p-5 rounded-xl bg-neutral-800 border border-neutral-700">
                <div className="text-xs text-neutral-400">Total AI Requests</div>
                <div className="text-2xl font-bold font-mono-numbers text-white mt-1">184,290</div>
                <div className="text-[11px] text-neutral-400 mt-1">Across 4 providers</div>
              </div>
              <div className="p-5 rounded-xl bg-neutral-800 border border-neutral-700">
                <div className="text-xs text-neutral-400">Monthly Revenue (MRR)</div>
                <div className="text-2xl font-bold font-mono-numbers text-white mt-1">$34,820</div>
                <div className="text-[11px] text-emerald-400 mt-1">AI Cost: $4,120 (88.2% Margin)</div>
              </div>
            </div>

            {/* Provider Health Summary Cards */}
            <div className="p-6 rounded-xl bg-neutral-800 border border-neutral-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">AI Provider Infrastructure (Spec #51)</h3>
                <span className="text-xs text-emerald-400 font-mono">Gateway Healthy ✓</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {providers.map((p) => (
                  <div key={p.provider} className="p-4 rounded-lg bg-neutral-900 border border-neutral-700 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{p.provider}</span>
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {p.status}
                      </span>
                    </div>
                    <div className="font-mono text-neutral-400 text-[11px]">{p.model}</div>
                    <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[11px] font-mono-numbers">
                      <span className="text-neutral-400">Latency: {p.latencyMs}ms</span>
                      <span className="text-neutral-400">Uptime: {p.uptimePercent}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Provider Health & Routing (Spec #27, #28, #29) */}
        {activeTab === 'providers' && (
          <div className="p-6 rounded-xl bg-neutral-800 border border-neutral-700 space-y-4">
            <h3 className="text-sm font-semibold text-white">Configured Model Routing Rules</h3>
            <p className="text-xs text-neutral-400">
              The internal AI Gateway evaluates latency, context size, and domain capability to route every request.
            </p>
            <div className="space-y-3 pt-2">
              {providers.map((p) => (
                <div key={p.provider} className="p-4 rounded-lg bg-neutral-900 border border-neutral-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-semibold text-white text-sm flex items-center gap-2">
                      <span>{p.provider} ({p.model})</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">
                        {p.status}
                      </span>
                    </div>
                    <div className="text-neutral-400 mt-1">
                      Assigned Domain: <strong className="text-neutral-200">{p.assignedTasks}</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 font-mono-numbers text-[11px] text-neutral-400">
                    <div>P50: {p.latencyMs}ms</div>
                    <div>Cost: {p.costPer1kTokens}/1k</div>
                    <div>Uptime: {p.uptimePercent}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Prompt Registry (Spec #52) */}
        {activeTab === 'prompts' && (
          <div className="p-6 rounded-xl bg-neutral-800 border border-neutral-700 space-y-4">
            <h3 className="text-sm font-semibold text-white">Prompt Version Management (Spec #52)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-700 text-neutral-400">
                    <th className="py-2">Prompt Identifier</th>
                    <th className="py-2">Target Model</th>
                    <th className="py-2">Temperature</th>
                    <th className="py-2">Task Purpose</th>
                    <th className="py-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-200">
                  {promptsList.map((pr) => (
                    <tr key={pr.id}>
                      <td className="py-2.5 font-bold text-amber-300">{pr.id}</td>
                      <td className="py-2.5 text-neutral-400">{pr.model}</td>
                      <td className="py-2.5">{pr.temp}</td>
                      <td className="py-2.5 font-sans text-neutral-300">{pr.task}</td>
                      <td className="py-2.5 text-right text-emerald-400">Active ✓</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Live AI Requests (Spec #56) */}
        {activeTab === 'logs' && (
          <div className="p-6 rounded-xl bg-neutral-800 border border-neutral-700 space-y-4">
            <h3 className="text-sm font-semibold text-white">Live AI Request Stream (Telemetry Table)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-700 text-neutral-400">
                    <th className="py-2">Timestamp</th>
                    <th className="py-2">Operation</th>
                    <th className="py-2">Provider & Model</th>
                    <th className="py-2">Tokens</th>
                    <th className="py-2">Credits</th>
                    <th className="py-2">Latency</th>
                    <th className="py-2">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-300">
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td className="py-2.5 text-neutral-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td className="py-2.5 font-sans font-medium text-white">{log.operation}</td>
                      <td className="py-2.5 text-amber-300">{log.provider} ({log.model})</td>
                      <td className="py-2.5">{log.inputTokens} in / {log.outputTokens} out</td>
                      <td className="py-2.5 font-bold">{log.credits} units</td>
                      <td className="py-2.5">{log.latencyMs}ms</td>
                      <td className="py-2.5 text-emerald-400">{log.estimatedCost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
