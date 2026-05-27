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

        if (
          Array.isArray(
            res.data
          )
        ) {

          setAudits(
            res.data
          );

        } else {

          setAudits([]);
        }

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
          "Voullez vous supprimer cette collecte?"
        );

      if (
        !confirmDelete
      ) return;

      try {

        await axios.delete(
          `${API}/api/audits/${id}`
        );

        fetchAudits();

      } catch (error) {

        console.log(error);

        alert(
          "Erreur de Suppression"
        );
      }
    };

  // =====================================
  // SAFE CHECKLIST
  // =====================================

  const parseChecklist =
    (data) => {

      try {

        const parsed =
          typeof data ===
          "string"
            ? JSON.parse(data)
            : data;

        return Array.isArray(
          parsed
        )
          ? parsed
          : [];

      } catch {

        return [];
      }
    };

  // =====================================
  // UI
  // =====================================

  return (

    <Layout title="Données Collecté">

      

      {/* ================================= */}
      {/* HERO */}
      {/* ================================= */}

      <div className="hero-section">

        <div>

        </div>

      </div>

      {/* ================================= */}
      {/* CONTENT */}
      {/* ================================= */}

      <div className="container">

        {/* ============================= */}
        {/* EMPTY */}
        {/* ============================= */}

        {!loading &&
          audits.length === 0 && (

          <div className="empty-state">

            <h2>
              Aucune donnée existant
            </h2>

            <p>
              Commencez a collecter des données 
            </p>

          </div>
        )}

        {/* ============================= */}
        {/* LOADING */}
        {/* ============================= */}

        {loading && (

          <div className="loading-card">

            Chargement des données...

          </div>
        )}

        {/* ============================= */}
        {/* AUDITS GRID */}
        {/* ============================= */}

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

                        Inspecteur:
                        {" "}
                        {
                          audit.inspector_name
                        }

                      </p>

                    </div>

                    <div className="status-badge">
                        <b>
                      Données Collecté
                         </b>
                    </div>

                  </div>

                  {/* DATE */}

                  <div className="audit-meta">

                    <div className="meta-box">

                      <span>
                        Date: 
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
                        Heure:  
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

                  {/* TOTAL EQUIPMENT */}

                  <div className="equipment-summary">

                    <div className="summary-card">

                      <h3>
                        {
                          checklist.length
                        }
                      </h3>

                      <p>
                        Equipments
                        Inspecté
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

                        Generer PDF

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

                      Supprimer

                    </button>

                  </div>

                  {/* ================================= */}
                  {/* OPEN AUDIT */}
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

                                Equipment

                              </div>

                            </div>

                            {/* IMAGE */}

                            {item.image && (

                              <img
                                src={`${API}/uploads/${item.image}`}
                                alt=""
                                className="image-preview"
                              />

                            )}

                            {/* COMMENT */}

                            <div className="equipment-info">

                              <p>

                                <strong>
                                  Inspector Comment:
                                </strong>

                              </p>

                              <p>

                                {
                                  item.comment ||
                                  "No comment provided"
                                }

                              </p>

                            </div>

                            {/* DATETIME */}

                            <div className="equipment-meta">

                              <div>

                                <span>
                                  Inspection Date
                                </span>

                                <strong>

                                  {
                                    item.date ||
                                    "N/A"
                                  }

                                </strong>

                              </div>

                              <div>

                                <span>
                                  Inspection Time
                                </span>

                                <strong>

                                  {
                                    item.time ||
                                    "N/A"
                                  }

                                </strong>

                              </div>

                            </div>

                            {/* LOCATION */}

                            {item.location && (

                              <div className="location-box">

                                <strong>
                                  GPS:
                                </strong>

                                <br />

                                {
                                  item.location
                                }

                              </div>

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