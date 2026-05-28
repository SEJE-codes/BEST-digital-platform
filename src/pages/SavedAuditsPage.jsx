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
  // FETCH
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
          "Supprimer cet audit ?"
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

      }
    };

  // =====================================
  // PARSE
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

  return (

    <Layout title="Audits Sauvegardés">

      <div className="container">

        {loading && (
          <div className="loading-card">
            Chargement...
          </div>
        )}

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

                  <div className="audit-header">

                    <div>

                      <h2>
                        {
                          audit.company_name
                        }
                      </h2>

                      <p>
                        Inspecteur :
                        {" "}
                        {
                          audit.inspector_name
                        }
                      </p>

                    </div>

                  </div>

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

                  {/* DETAILS */}

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
                              item.inspections.map(
                                (
                                  inspection,
                                  i
                                ) => (

                                  <div
                                    key={i}
                                    className="saved-preview-card"
                                  >

                                    <img
                                      src={`${API}/uploads/${inspection.image}`}
                                      alt=""
                                      className="saved-preview-image"
                                    />

                                    <div className="saved-preview-info">

                                      <p>

                                        <strong>
                                          Comment:
                                        </strong>

                                        {" "}

                                        {
                                          inspection.comment
                                        }

                                      </p>

                                      <p>

                                        <strong>
                                          Date / Heure:
                                        </strong>

                                        {" "}

                                        {
                                          inspection.datetime
                                        }

                                      </p>

                                    </div>

                                  </div>
                                )
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