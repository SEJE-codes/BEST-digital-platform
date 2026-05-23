import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AprDashboardPage() {

  // =========================
  // STATE
  // =========================
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [opened, setOpened] = useState(null);

  // =========================
  // FETCH
  // =========================
  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API}/api/apr-reports`);
      const safe = Array.isArray(res.data) ? res.data : [];

      // PRE-PARSE DATA ONCE (performance upgrade)
      const normalized = safe.map(r => ({
        ...r,
        parsedData: safeJson(r.data)
      }));

      setReports(normalized);

    } catch (err) {
      console.log(err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // =========================
  // SAFE JSON PARSE
  // =========================
  const safeJson = (data) => {
    try {
      if (typeof data === "string") return JSON.parse(data);
      if (Array.isArray(data)) return data;
      return [];
    } catch {
      return [];
    }
  };

  // =========================
  // DELETE
  // =========================
  const deleteReport = async (id) => {
    if (!window.confirm("Delete this APR report?")) return;

    try {
      await axios.delete(`${API}/api/apr-reports/${id}`);
      setReports(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  // =========================
  // FILTERED DATA
  // =========================
  const filtered = useMemo(() => {
    return reports.filter(r => {

      const matchSearch =
        r.zone?.toLowerCase().includes(search.toLowerCase());

      const matchZone =
        zoneFilter === "" || r.zone === zoneFilter;

      const matchRisk =
        riskFilter === "" ||
        r.parsedData.some(p => p.residual_color === riskFilter);

      return matchSearch && matchZone && matchRisk;
    });
  }, [reports, search, zoneFilter, riskFilter]);

  // =========================
  // KPI CALCULATION
  // =========================
  const kpis = useMemo(() => {

    let total = reports.length;
    let red = 0;
    let orange = 0;
    let yellow = 0;
    let green = 0;

    reports.forEach(r => {
      r.parsedData.forEach(p => {
        if (p.residual_color === "RED") red++;
        if (p.residual_color === "ORANGE") orange++;
        if (p.residual_color === "YELLOW") yellow++;
        if (p.residual_color === "GREEN") green++;
      });
    });

    return { total, red, orange, yellow, green };

  }, [reports]);

  const zones = [...new Set(reports.map(r => r.zone))];

  // =========================
  // UI
  // =========================
  return (
    <div className="page">

      {/* NAVBAR */}
      <div className="navbar">
        <div className="logo">APR CONTROL CENTER</div>

        <div className="nav-links">
          <Link to="/create-audit">New Audit</Link>
          <Link to="/apr">Generate APR</Link>
          <Link to="/saved-audits">Audits</Link>
        </div>
      </div>

      <div className="container">
        <div className="card">

          <h1>Enterprise APR Dashboard</h1>

          {/* ================= KPI CARDS ================= */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "15px" }}>

            <Kpi label="Total Reports" value={kpis.total} />
            <Kpi label="RED Risks" value={kpis.red} color="red" />
            <Kpi label="ORANGE Risks" value={kpis.orange} color="orange" />
            <Kpi label="YELLOW Risks" value={kpis.yellow} color="gold" />
            <Kpi label="GREEN Risks" value={kpis.green} color="green" />

          </div>

          {/* ================= FILTERS ================= */}
          <div style={{ display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" }}>

            <input
              className="input"
              placeholder="Search zone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="input"
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
            >
              <option value="">All Zones</option>
              {zones.map((z, i) => (
                <option key={i} value={z}>{z}</option>
              ))}
            </select>

            <select
              className="input"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
            >
              <option value="">All Risks</option>
              <option value="RED">RED</option>
              <option value="ORANGE">ORANGE</option>
              <option value="YELLOW">YELLOW</option>
              <option value="GREEN">GREEN</option>
            </select>

          </div>

          <br />

          {loading && <p>Loading...</p>}

          {!loading && filtered.length === 0 && (
            <p>No reports found</p>
          )}

          {/* ================= REPORT LIST ================= */}
          {!loading && filtered.map(r => (

            <div key={r.id} className="audit-card">

              <h3>{r.zone}</h3>

              <p>
                {new Date(r.created_at).toLocaleString()}
              </p>

              {/* ACTIONS */}
              <div style={{ display: "flex", gap: "10px" }}>

                <button className="btn"
                  onClick={() => setOpened(opened === r.id ? null : r.id)}
                >
                  {opened === r.id ? "Hide" : "View"}
                </button>

                <a href={`${API}/api/apr/export/pdf/${r.id}`} target="_blank">
                  <button className="btn">PDF</button>
                </a>

                <a href={`${API}/api/apr/export/excel/${r.id}`} target="_blank">
                  <button className="btn">Excel</button>
                </a>

                <button className="btn btn-danger"
                  onClick={() => deleteReport(r.id)}
                >
                  Delete
                </button>

              </div>

              {/* ================= DETAILS ================= */}
              {opened === r.id && (
                <div style={{ marginTop: "15px" }}>

                  {r.parsedData.map((p, i) => (

                    <div key={i}
                      style={{
                        border: "1px solid #ddd",
                        padding: "10px",
                        marginBottom: "10px",
                        borderRadius: "6px"
                      }}
                    >

                      <strong>{p.installation}</strong>

                      <p>{p.central_event}</p>

                      <p>
                        Risk:
                        {" "}
                        <span style={{ fontWeight: "bold" }}>
                          {p.initial_risk} → {p.residual_risk}
                        </span>
                      </p>

                      <p>
                        Scenario:
                        {" "}
                        <b>{p.scenario}</b>
                      </p>

                    </div>

                  ))}

                </div>
              )}

            </div>

          ))}

        </div>
      </div>
    </div>
  );
}

// ================= KPI COMPONENT =================
const Kpi = ({ label, value, color }) => (
  <div style={{
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    minWidth: "120px",
    textAlign: "center",
    background: color ? color + "20" : "#f5f5f5"
  }}>
    <h4>{value}</h4>
    <small>{label}</small>
  </div>
);

export default AprDashboardPage;