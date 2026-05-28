import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import Layout from "../components/Layout";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function SavedAuditsPage() {

  const [
    audits,
    setAudits,
  ] = useState([]);

  const [
    openedAudit,
    setOpenedAudit,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  // =====================================
  // FETCH AUDITS
  // =====================================

  const fetchAudits =
    async () => {

      try {

        const res =
          await axios.get(
            `${API}/api/audits`
          );

        setAudits(
          Array.isArray(res.data)
            ? res.data
            : []
        );

      } catch (error) {

        console.log(error);

        setAudits([]);

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    fetchAudits();

  }, []);

  // =====================================
  // DELETE
  // =====================================

  const deleteAudit =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Voulez-vous supprimer cet audit ?"
        );

      if (!confirmDelete)
        return;

      try {

        await axios.delete(
          `${API}/api/audits/${id}`
        );

        fetchAudits();

      } catch (error) {

        console.log(error);

        alert(
          "Erreur de suppression"
        );
      }
    };

  // =====================================
  // PARSE CHECKLIST
  // =====================================

  const parseChecklist =
    (data) => {

      try {

        return typeof data ===
          "string"
          ? JSON.parse(data)
          : data;

      } catch {

        return [];
      }
    };

  // =====================================
  // UI
  // =====================================

  return (

    <Layout title="Audits Sauvegardés">

      <div className="container">

        {/* LOADING */}

        {loading && (

          <div className="loading-card">

            Chargement des audits...

          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          audits.length === 0 && (

          <div className="empty-state">

            <h2>
              Aucun audit trouvé
            </h2>

          </div>
        )}

        {/* AUDITS */}

        <div className="audit-grid">

          {audits.map(
            (audit) => {

              const checklist =
                parseChecklist(
                  audit.checklist
                );

              return (

                <div
                  key={audit.id}
                  className="modern-card"
                >

                  {/* HEADER */}

                  <div className="audit-header">

                    <div>

                      <h2 className="audit-company">

                        {
                          audit.company_name
                        }

                      </h2>

                      <p className="audit-inspector">

                        Inspecteur :
                        {" "}
                        {
                          audit.inspector_name
                        }

                      </p>

                    </div>

                    <div className="status-badge">

                      Audit

                    </div>

                  </div>

                  {/* DATE */}

                  <div className="audit-meta">

                    <div className="meta-box">

                      <span>
                        Date
                      </span>

                      <strong>

                        {audit.audit_date
                          ? new Date(
                              audit.audit_date
                            ).toLocaleDateString()
                          : "N/A"}

                      </strong>

                    </div>

                    <div className="meta-box">

                      <span>
                        Heure
                      </span>

                      <strong>

                        {audit.audit_date
                          ? new Date(
                              audit.audit_date
                            ).toLocaleTimeString()
                          : "N/A"}

                      </strong>

                    </div>

                  </div>

                  {/* SUMMARY */}

                  <div className="equipment-summary">

                    <div className="summary-card">

                      <h3>

                        {
                          checklist.length
                        }

                      </h3>

                      <p>
                        Equipements
                      </p>

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="audit-actions">

                    <button
                      className="btn"
                      onClick={() =>
                        setOpenedAudit(
                          openedAudit ===
                            audit.id
                            ? null
                            : audit.id
                        )
                      }
                    >

                      {openedAudit ===
                      audit.id
                        ? "Hide"
                        : "View"}

                    </button>

                    <a
                      href={`${API}/api/pdf/export/${audit.id}`}
                      target="_blank"
                      rel="noreferrer"
                    >

                      <button className="btn btn-green">

                        PDF

                      </button>

                    </a>

                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        deleteAudit(
                          audit.id
                        )
                      }
                    >

                      Delete

                    </button>

                  </div>

                  {/* ================================= */}
                  {/* AUDIT DETAILS */}
                  {/* ================================= */}

                  {openedAudit ===
                    audit.id && (

                    <div className="equipment-list">

                      {checklist.map(
                        (
                          item,
                          index
                        ) => (

                          <div
                            key={index}
                            className="equipment-card"
                          >

                            {/* EQUIPMENT */}

                            <div className="equipment-top">

                              <h3>

                                {
                                  item.equipment
                                }

                              </h3>

                              <div className="equipment-badge">

                                {
                                  item.inspections
                                    ?.length || 0
                                }
                                {" "}
                                Evidence(s)

                              </div>

                            </div>

                            {/* INSPECTIONS */}

                            {item.inspections &&
                              item.inspections.length > 0 ? (

                              item.inspections.map(
                                (
                                  inspection,
                                  i
                                ) => (

                                  <div
                                    key={i}
                                    className="view-evidence-card"
                                  >

                                    {/* IMAGE */}

                                    {item.inspections &&
  item.inspections.map(
    (
      inspection,
      index
    ) => (

      <div
        key={index}
        className="saved-inspection-card"
      >

        {/* IMAGE */}

        {inspection.image && (

          <img
            src={`${API}/uploads/${inspection.image}`}
            alt="Inspection"
            className="saved-inspection-image"
          />

        )}

        {/* COMMENT */}

        <div className="saved-comment">

          <strong>
            Commentaire:
          </strong>

          <p>
            {
              inspection.comment
            }
          </p>

        </div>

        {/* DATETIME */}

        <div className="saved-date">

          <strong>
            Date/Heure:
          </strong>

          <p>
            {
              inspection.datetime
            }
          </p>

        </div>

      </div>
    )
)}

                                    {/* DETAILS */}

                                    <div className="view-details">

                                      <p>

                                        <strong>
                                          Comment:
                                        </strong>

                                        {" "}

                                        {
                                          inspection.comment ||
                                          "No comment"
                                        }

                                      </p>

                                      <p>

                                        <strong>
                                          Date / Heure:
                                        </strong>

                                        {" "}

                                        {
                                          inspection.datetime ||
                                          "N/A"
                                        }

                                      </p>

                                    </div>

                                  </div>
                                )
                              )

                            ) : (

                              <p
                                style={{
                                  marginTop: "10px",
                                }}
                              >

                                Aucun élément inspecté

                              </p>
                            )}

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

export default SavedAuditsPage;