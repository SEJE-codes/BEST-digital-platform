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

                <h2>
                  {audit.company_name}
                </h2>

                <p>
                  Inspecteur :
                  {" "}
                  {
                    audit.inspector_name
                  }
                </p>

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

                    {checklist.map(
                      (
                        item,
                        index
                      ) => (

                        <div
                          key={index}
                          className="equipment-card"
                        >

                          <h3>
                            {item.equipment}
                          </h3>

                          {item.inspections.map(
                            (
                              inspection,
                              i
                            ) => (

                              <div
                                key={i}
                                className="saved-inspection-card"
                              >

                                <img
                                  src={`${API}/uploads/${inspection.image}`}
                                  alt=""
                                  className="saved-inspection-image"
                                />

                                <p>

                                  <strong>
                                    Commentaire :
                                  </strong>

                                  {" "}

                                  {
                                    inspection.comment
                                  }

                                </p>

                                <p>

                                  <strong>
                                    Date :
                                  </strong>

                                  {" "}

                                  {
                                    inspection.datetime
                                  }

                                </p>

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

    </Layout>
  );
}

export default SavedAuditsPage;