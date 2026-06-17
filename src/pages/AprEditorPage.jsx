import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const API = import.meta.env.VITE_API_URL;

function AprEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [table, setTable] = useState([]);

  // ======================
  // FETCH SINGLE REPORT
  // ======================
  const fetchReport = async () => {
    try {
      const res = await axios.get(
        `${API}/api/apr-reports/${id}`
      );

      setReport(res.data);

      const parsed =
        typeof res.data.data === "string"
          ? JSON.parse(res.data.data)
          : res.data.data;

      setTable(parsed || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  // ======================
  // UPDATE FIELD
  // ======================
  const updateField = (index, field, value) => {
    const updated = [...table];
    updated[index][field] = value;
    setTable(updated);
  };

  // ======================
  // SAVE CHANGES
  // ======================
  const saveChanges = async () => {
    try {
      await axios.put(
        `${API}/api/apr-reports/${id}`,
        {
          data: table,
        }
      );

      alert("APR updated successfully");
      navigate("/apr-reports");
    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
  };

  return (
    <Layout title="APR Editor">
      <div className="container">
        <div className="card">

          <h1>APR Editor</h1>

          {table.map((row, index) => (
            <div key={index} className="audit-card">

              <h3>Bloc {index + 1}</h3>

              <input
                className="input"
                value={row.central_event || ""}
                onChange={(e) =>
                  updateField(index, "central_event", e.target.value)
                }
              />

              <textarea
                className="textarea"
                value={row.risks || ""}
                onChange={(e) =>
                  updateField(index, "risks", e.target.value)
                }
              />

              <textarea
                className="textarea"
                value={row.scenario || ""}
                onChange={(e) =>
                  updateField(index, "scenario", e.target.value)
                }
              />

            </div>
          ))}

          <button className="btn" onClick={saveChanges}>
            Save Changes
          </button>

        </div>
      </div>
    </Layout>
  );
}

export default AprEditorPage;