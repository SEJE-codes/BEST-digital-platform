import {
  useEffect,
  useState,
} from "react";

import axios from "axios";
import Layout from "../components/Layout";
import {
  Link,
} from "react-router-dom";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function AprReportsPage() {

  // ===================================
  // STATES
  // ===================================

  const [
    reports,
    setReports,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    openedReport,
    setOpenedReport,
  ] = useState(null);

  // ===================================
  // FETCH REPORTS
  // ===================================

  const fetchReports =
    async () => {

      try {

        const res =
          await axios.get(
            `${API}/api/apr-reports`
          );

        if (
          Array.isArray(
            res.data
          )
        ) {

          setReports(
            res.data
          );

        } else {

          setReports([]);
        }

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

  // ===================================
  // DELETE REPORT
  // ===================================

  const deleteReport =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Supprimmer ce rapport?"
        );

      if (!confirmDelete) return;

      try {

        await axios.delete(
          `${API}/api/apr-reports/${id}`
        );

        fetchReports();

      } catch (error) {

        console.log(error);

        alert("Suppression échoué");
      }
    };

  // ===================================
  // OPEN PDF
  // ===================================

  const openPDF = (id) => {

    window.open(
      `${API}/api/apr/export/${id}`,
      "_blank"
    );
  };

  // ===================================
  // SAFE PARSE
  // ===================================

  const parseData = (data) => {

    try {

      return typeof data ===
        "string"
        ? JSON.parse(data)
        : data;

    } catch {

      return [];
    }
  };

  // ===================================
  // RENDER
  // ===================================

  return (

    <Layout title="Rapports APR">

      {/* CONTENT */}

      <div className="container">

        {/* LOADING */}

        {loading && (

          <div className="empty-state">

            <h2>
              Chargement des rapports...
            </h2>

          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          reports.length === 0 && (

            <div className="empty-state">

              <h2>
                Aucun rapports trouvé
              </h2>

              <p>
                Generer un tableau d'APR.
              </p>

            </div>
          )}

        {/* REPORTS */}

        <div className="audit-grid">

          {!loading &&
            reports.map(
              (r) => {

                const table =
                  parseData(
                    r.data
                  );

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

                        <span>
                          Date:
                        </span>

                        <strong>

                          {new Date(
                            r.created_at
                          ).toLocaleDateString()}

                        </strong>

                      </div>

                      <div className="info-box">

                        <span>
                          Rows:
                        </span>

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

                      <button
                        className="btn btn-green"
                        onClick={() =>
                          openPDF(r.id)
                        }
                      >
                        PDF
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          deleteReport(r.id)
                        }
                      >
                        Supprimer
                      </button>

                    </div>

                    {/* TABLE PREVIEW */}

                    {openedReport ===
                      r.id && (

                      <div className="apr-preview">

                        {table.map(
                          (
                            row,
                            index
                          ) => (

                            <div
                              key={index}
                              className="preview-row"
                            >

                              <div className="preview-header">

                                <h3>
                                  {row.bloc}
                                </h3>

                                <span
                                  className={`risk-badge ${(
                                    row.initial_color ||
                                    ""
                                  ).toLowerCase()}`}
                                >
                                  {
                                    row.initial_risk
                                  }
                                </span>

                              </div>

                              <p>

                                <strong>
                                  Installation:
                                </strong>{" "}

                                {
                                  row.installation
                                }

                              </p>

                              <p>

                                <strong>
                                  Event:
                                </strong>{" "}

                                {
                                  row.central_event
                                }

                              </p>

                              <p>

                                <strong>
                                  Risk:
                                </strong>{" "}

                                {
                                  row.risks
                                }

                              </p>

                              <p>

                                <strong>
                                  Existing Measures:
                                </strong>{" "}

                                {
                                  row.existing_measures
                                }

                              </p>

                            </div>
                          )
                        )}

                      </div>
                    )}

                  </div>
                );
              }
            )}

        </div>

      </div>

    </Layout>
  );
}

export default AprReportsPage;