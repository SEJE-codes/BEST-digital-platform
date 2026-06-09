import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import BackButton from "../components/BackButton";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function AprReportsPage() {

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openedReport, setOpenedReport] = useState(null);

  // ==============================
  // FETCH REPORTS
  // ==============================
  const fetchReports = async () => {

    try {

      const res = await axios.get(
        `${API}/api/apr-reports`
      );

      setReports(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (error) {

      console.log(error);
      setReports([]);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchReports();
  }, []);

  // ==============================
  // GENERATE PDF
  // ==============================
  const generatePDF = async (id) => {

    try {

      const res = await axios.get(
        `${API}/api/apr-pdf/generate/${id}`
      );

      if (res.data?.pdf_url) {

        window.open(
          res.data.pdf_url,
          "_blank"
        );

        fetchReports();

      }

    } catch (error) {

      console.log(error);

      alert(
        "Erreur lors de la génération du PDF"
      );

    }

  };

  // ==============================
  // DELETE REPORT
  // ==============================
  const deleteReport = async (id) => {

    const confirmDelete =
      window.confirm(
        "Supprimer ce rapport ?"
      );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `${API}/api/apr-reports/${id}`
      );

      fetchReports();

    } catch (error) {

      console.log(error);

      alert(
        "Suppression échouée"
      );

    }

  };

  // ==============================
  // SAFE PARSE
  // ==============================
  const parseData = (data) => {

    try {

      return typeof data === "string"
        ? JSON.parse(data)
        : data;

    } catch {

      return [];

    }

  };

  // ==============================
  // RENDER
  // ==============================
  return (

    <Layout title="Rapports APR">

      <BackButton />

      <div className="container">

        {loading && (

          <div className="empty-state">
            <h2>
              Chargement des rapports...
            </h2>
          </div>

        )}

        {!loading &&
          reports.length === 0 && (

          <div className="empty-state">

            <h2>
              Aucun rapport trouvé
            </h2>

            <p>
              Générer un tableau APR.
            </p>

          </div>

        )}

        <div className="audit-grid">

          {!loading &&
            reports.map((r) => {

              const table =
                parseData(r.data);

              return (

                <div
                  key={r.id}
                  className="audit-card modern-card"
                >

                  {/* HEADER */}
                  <div className="card-top">

                    <div>

                      <div className="badge">
                        RAPPORT APR
                      </div>

                      <h2 className="card-title">
                        Zone {r.zone}
                      </h2>

                    </div>

                  </div>

                  {/* INFO */}
                  <div className="info-grid">

                    <div className="info-box">

                      <span>Date:</span>

                      <strong>

                        {new Date(
                          r.created_at
                        ).toLocaleDateString()}

                      </strong>

                    </div>

                    <div className="info-box">

                      <span>Rows:</span>

                      <strong>
                        {table.length}
                      </strong>

                    </div>

                  </div>

                  {/* ACTIONS */}
                  <div className="audit-actions">

                    <button
                      className="btn"
                      onClick={() =>
                        setOpenedReport(
                          openedReport === r.id
                            ? null
                            : r.id
                        )
                      }
                    >
                      {openedReport === r.id
                        ? "Hide"
                        : "View"}
                    </button>

                    {r.pdf_url ? (

  <a
    href={r.pdf_url}
    target="_blank"
    rel="noreferrer"
    className="btn btn-green"
  >
    Télécharger PDF
  </a>

) : (

  <button
    className="btn btn-green"
    onClick={() =>
      generatePDF(r.id)
    }
  >
    Générer PDF
  </button>

)}

                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        deleteReport(r.id)
                      }
                    >
                      Supprimer
                    </button>

                  </div>

                  {/* PREVIEW */}
                  {openedReport === r.id && (

                    <div className="apr-preview">

                      {table.map(
                        (row, index) => (

                        <div
                          key={index}
                          className="preview-row"
                        >

                          <div className="preview-header">

                            <h3>
                              {row.bloc}
                            </h3>

                            <span
                              className={`risk-badge ${
                                row.initial_color?.toLowerCase() || ""
                              }`}
                            >
                              {row.initial_risk}
                            </span>

                          </div>

                          <p>
                            <strong>
                              Installation:
                            </strong>{" "}
                            {row.installation}
                          </p>

                          <p>
                            <strong>
                              Event:
                            </strong>{" "}
                            {row.central_event}
                          </p>

                          <p>
                            <strong>
                              Risk:
                            </strong>{" "}
                            {row.risks}
                          </p>

                          <p>
                            <strong>
                              Measures:
                            </strong>{" "}
                            {row.existing_measures}
                          </p>

                          <p>

                            <strong>
                              Residual Risk:
                            </strong>{" "}

                            <span
                              className={`risk-badge ${
                                row.residual_color?.toLowerCase() || ""
                              }`}
                            >
                              {row.residual_risk}
                            </span>

                          </p>

                        </div>

                      ))}

                    </div>

                  )}

                </div>

              );

            })}

        </div>

      </div>

    </Layout>

  );

}

export default AprReportsPage;