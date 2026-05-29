import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import Layout from "../components/Layout";

const API =
  import.meta.env.VITE_API_URL ||
  "https://best-backend-1.onrender.com";

function SavedAuditsPage() {

  const [audits, setAudits] =
    useState([]);

  const [
    openedAudit,
    setOpenedAudit,
  ] = useState(null);

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
      }
    };

  useEffect(() => {

    fetchAudits();

  }, []);

  // =====================================
  // DELETE AUDIT
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

      <div className="audit-grid">

        {audits.map(
          (audit) => {

            const checklist =
              parseChecklist(
                audit.checklist
              );

            // SHOW ONLY EQUIPMENT
            // WITH INSPECTIONS

            const filteredChecklist =
              checklist.filter(
                (item) =>
                  item.inspections &&
                  item.inspections.length > 0
              );

            return (

              <div
                key={audit.id}
                className="modern-card"
              >

                {/* TITLE */}

                <h2>
                  {
                    audit.company_name
                  }
                </h2>

                <p
                  style={{
                    marginTop: "8px",
                  }}
                >

                  <strong>
                    Inspecteur :
                  </strong>

                  {" "}

                  {
                    audit.inspector_name
                  }

                </p>

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
                      ? "Masquer"
                      : "Voir"}

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

                    Supprimer

                  </button>

                </div>

                {/* DETAILS */}

                {openedAudit ===
                  audit.id && (

                  <div className="equipment-list">

                    {filteredChecklist.length >
                    0 ? (

                      filteredChecklist.map(
                        (
                          item,
                          index
                        ) => (

                          <div
                            key={index}
                            className="equipment-card"
                          >

                            {/* EQUIPMENT */}

                            <h3
                              style={{
                                marginBottom:
                                  "18px",
                              }}
                            >

                              {
                                item.equipment
                              }

                            </h3>

                            {/* INSPECTIONS */}

                            {item.inspections.map(
                              (
                                inspection,
                                i
                              ) => (

                                <div
                                  key={i}
                                  className="saved-inspection-card"
                                >

                                  {/* IMAGE */}

                                  {inspection.image && (

                                    <img
                                      src={`${API}/${inspection.image}`}
                                      alt="Inspection"
                                      className="saved-inspection-image"
                                    />

                                  )}

                                  {/* DETAILS */}

                                  <div className="saved-preview-info">

                                    <p>

                                      <strong>
                                        Commentaire :
                                      </strong>

                                      {" "}

                                      {
                                        inspection.comment ||
                                        "Aucun commentaire"
                                      }

                                    </p>

                                    <small>

                                      {
                                        inspection.datetime ||
                                        "Date inconnue"
                                      }

                                    </small>

                                  </div>

                                </div>
                              )
                            )}

                          </div>
                        )
                      )

                    ) : (

                      <p>

                        Aucun équipement inspecté

                      </p>
                    )}

                  </div>
                )}

              </div>
            );
          }
        )}

      </div>

    </Layout>
  );
}

export default SavedAuditsPage;