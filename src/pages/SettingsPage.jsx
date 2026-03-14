import { useState, useRef } from "react";
import { exportAllData, importAllData, clearAllData, getDataStats, setLastExportDate, getLastExportDate, getProxyUrl, setProxyUrl } from "../utils/storage";

export function SettingsPage() {
  const [msg, setMsg] = useState(null); // { type: "success"|"error", text }
  const [confirmClear, setConfirmClear] = useState(false);
  const [importPreview, setImportPreview] = useState(null); // parsed JSON awaiting confirmation
  const [proxyInput, setProxyInput] = useState(() => getProxyUrl());
  const [proxySaved, setProxySaved] = useState(false);
  const fileRef = useRef(null);
  const stats = getDataStats();
  const lastExport = getLastExportDate();

  const doExport = () => {
    try {
      const data = exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `katthai-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setLastExportDate();
      setMsg({ type: "success", text: "Backup downloaded!" });
    } catch (e) {
      setMsg({ type: "error", text: "Export failed: " + e.message });
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!parsed.data || typeof parsed.data !== "object") throw new Error("Invalid format");
        setImportPreview(parsed);
        setMsg(null);
      } catch {
        setMsg({ type: "error", text: "This file doesn't look like a valid backup." });
        setImportPreview(null);
      }
    };
    reader.readAsText(file);
  };

  const doImport = () => {
    try {
      const result = importAllData(importPreview);
      setImportPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      setMsg({ type: "success", text: `Restored ${result.imported} items. Reloading...` });
      setTimeout(() => window.location.reload(), 1200);
    } catch (e) {
      setMsg({ type: "error", text: "Import failed: " + e.message });
    }
  };

  const doClear = () => {
    clearAllData();
    setConfirmClear(false);
    setMsg({ type: "success", text: "All data cleared. Reloading..." });
    setTimeout(() => window.location.reload(), 1200);
  };

  return (
    <div className="page">
      <div className="ph"><h1 className="ph-t">Settings</h1><p className="ph-s">Manage your data and preferences</p></div>

      {msg && <div className={`sett-msg sett-msg-${msg.type}`}>{msg.text}</div>}

      {/* Export */}
      <div className="sett-section">
        <h2 className="sett-h">Export Data</h2>
        <p className="sett-desc">Download all your study progress as a backup file. Keep this somewhere safe!</p>
        <div className="sett-stats">
          <div className="sett-stat"><span className="sett-stat-n">{stats.studied}</span><span className="sett-stat-l">Studied</span></div>
          <div className="sett-stat"><span className="sett-stat-n">{stats.favorites}</span><span className="sett-stat-l">Favorites</span></div>
          <div className="sett-stat"><span className="sett-stat-n">{stats.customWords}</span><span className="sett-stat-l">Custom Words</span></div>
          <div className="sett-stat"><span className="sett-stat-n">{stats.srsWords}</span><span className="sett-stat-l">SRS Words</span></div>
          <div className="sett-stat"><span className="sett-stat-n">{stats.mistakes}</span><span className="sett-stat-l">Mistakes</span></div>
          <div className="sett-stat"><span className="sett-stat-n">{stats.totalXP}</span><span className="sett-stat-l">Total XP</span></div>
          <div className="sett-stat"><span className="sett-stat-n">{stats.streak}</span><span className="sett-stat-l">Day Streak</span></div>
        </div>
        <button className="btn btn-pri" onClick={doExport}>Export Data</button>
        {lastExport && <p className="sett-last-export">Last backup: {new Date(lastExport).toLocaleDateString()}</p>}
      </div>

      {/* Import */}
      <div className="sett-section">
        <h2 className="sett-h">Import Data</h2>
        <p className="sett-desc">Restore your progress from a previously exported backup file.</p>
        <div className="sett-warn">This will overwrite your current data. Export first if you want to keep it.</div>
        <input ref={fileRef} type="file" accept=".json" onChange={handleFileSelect} className="sett-file" />
        {importPreview && (
          <div className="sett-confirm">
            <p>Ready to restore backup from {importPreview.exportedAt ? new Date(importPreview.exportedAt).toLocaleDateString() : "unknown date"} ({Object.keys(importPreview.data).length} items).</p>
            <div className="sett-confirm-btns">
              <button className="btn btn-pri" onClick={doImport}>Confirm Import</button>
              <button className="btn btn-sec" onClick={() => { setImportPreview(null); if (fileRef.current) fileRef.current.value = ""; }}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* API Proxy */}
      <div className="sett-section">
        <h2 className="sett-h">API Proxy</h2>
        <p className="sett-desc">Use a Cloudflare Worker proxy to keep your API key off the browser entirely. See the <code>worker/README.md</code> file for setup instructions.</p>
        <div className="sett-proxy-row">
          <input
            type="text"
            className="sett-proxy-input"
            value={proxyInput}
            onChange={e => { setProxyInput(e.target.value); setProxySaved(false); }}
            placeholder="https://katthai-api-proxy.your-subdomain.workers.dev"
          />
          <button className="btn btn-pri" onClick={() => { setProxyUrl(proxyInput); setProxySaved(true); setMsg({ type: "success", text: proxyInput ? "Proxy URL saved!" : "Proxy removed." }); }}>
            {proxyInput ? "Save" : "Clear"}
          </button>
        </div>
        {getProxyUrl() && <div className="sett-proxy-status">Proxy active — AI Chat will use this instead of a browser API key.</div>}
      </div>

      {/* Danger Zone */}
      <div className="sett-section sett-danger">
        <h2 className="sett-h">Danger Zone</h2>
        <p className="sett-desc">Permanently erase all study progress from this browser.</p>
        {!confirmClear ? (
          <button className="btn sett-btn-clear" onClick={() => setConfirmClear(true)}>Clear All Data</button>
        ) : (
          <div className="sett-confirm">
            <p>Are you sure? This cannot be undone.</p>
            <div className="sett-confirm-btns">
              <button className="btn sett-btn-clear" onClick={doClear}>Yes, Erase Everything</button>
              <button className="btn btn-sec" onClick={() => setConfirmClear(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
