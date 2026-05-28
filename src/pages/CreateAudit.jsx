import { useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API =
  import.meta.env.VITE_API_URL ||
  "https://best-backend-1.onrender.com/api/audits";

function CreateAudit() {

  const navigate =
    useNavigate();

  // ===================================
  // BASIC INFO
  // ===================================

  const [
    companyName,
    setCompanyName,
  ] = useState("");

  const [
    inspectorName,
    setInspectorName,
  ] = useState("");

  // ===================================
  // EQUIPMENT LIST
  // ===================================

  const equipmentList = [

    "LOCAL HYDROCARBURE",
    "STEP",
    "SALE MACHINE",
    "MAGAZIN",
    "GARAGE",
    "INFIMERIE",
    "PARKING",
    "BLOC ADMINISTRATIF",
    "COUR DE MANUTENTION",
    "CENTRALE HYDROTHERMIQUE",
    "LOCAL GROUPE ELECTROGENE",
    "EXTINCTEUR",
    "RIA",
    "BAC À SABLE",
    "BOUCHE D'INCENDIE",
    "PIA",

  ];

  // ===================================
  // STATE
  // ===================================

  const [
    checklist,
    setChecklist,
  ] = useState(

    equipmentList.map(
      (equipment) => ({

        equipment,

        inspections: []

      })
    )
  );

  // ===================================
  // IMAGE UPLOAD
  // ===================================

  const uploadImage =
    async (
      equipmentIndex,
      file
    ) => {

      if (!file) return;

      const formData =
        new FormData();

      formData.append(
        "image",
        file
      );

      try {

        const res =
          await axios.post(
            `${API}/api/upload`,
            formData
          );

        const updated =
          [...checklist];

        updated[
          equipmentIndex
        ].inspections.push({

          image:
            res.data.image,

          comment: "",

          datetime:
            new Date()
              .toLocaleString(),

        });

        setChecklist(updated);

      } catch (error) {

        console.log(error);

        alert(
          "Erreur de Chargement de l'image"
        );
      }
    };

  // ===================================
  // UPDATE COMMENT
  // ===================================

  const updateInspectionComment =
    (
      equipmentIndex,
      inspectionIndex,
      value
    ) => {

      const updated =
        [...checklist];

      updated[
        equipmentIndex
      ]
        .inspections[
          inspectionIndex
        ]
        .comment = value;

      setChecklist(updated);
    };

  // ===================================
  // REMOVE IMAGE
  // ===================================

  const removeInspection =
    (
      equipmentIndex,
      inspectionIndex
    ) => {

      const updated =
        [...checklist];

      updated[
        equipmentIndex
      ].inspections.splice(
        inspectionIndex,
        1
      );

      setChecklist(updated);
    };

  // ===================================
  // SAVE AUDIT
  // ===================================

  const saveAudit =
    async () => {

      try {

        if (
          !companyName ||
          !inspectorName
        ) {

          alert(
            "Veuillez remplire tous les champs"
          );

          return;
        }

        await axios.post(
          `${API}/api/audits`,
          {

            company_name:
              companyName,

            inspector_name:
              inspectorName,

            audit_date:
  new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " "),

            checklist,

          }
        );

        alert(
          "Enregistré:"
        );

        navigate(
          "/saved-audits"
        );

      } catch (error) {

        console.log(error);

        alert(
          "Erreur d'enregistrement"
        );
      }
    };

  // ===================================
  // UI
  // ===================================

  return (

    <Layout title="Collecte des données">

      {/* HEADER */}

      <div className="page-header">

      </div>

      {/* FORM */}

      <div className="card">

        <div className="form-grid">

          <div>

            <label>
              Nom de L'entreprise
            </label>

            <input
              type="text"
              className="input"
              placeholder="exemple:BEST SARL"
              value={companyName}
              onChange={(e) =>
                setCompanyName(
                  e.target.value
                )
              }
            />

          </div>

          <div>

            <label>
              Nom de L'Inspecteur
            </label>

            <input
              type="text"
              className="input"
              placeholder="exemple:Sume Ekoti"
              value={inspectorName}
              onChange={(e) =>
                setInspectorName(
                  e.target.value
                )
              }
            />

          </div>

        </div>

      </div>

      {/* EQUIPMENT GRID */}

      <div className="equipment-grid">

        {checklist.map(
          (
            item,
            equipmentIndex
          ) => (

            <div
              key={equipmentIndex}
              className="equipment-card"
            >

              {/* CARD HEADER */}

              <div className="equipment-header">

                <h3>
                  {item.equipment}
                </h3>

                <span className="badge">

                  {
                    item.inspections.length
                  } Images

                </span>

              </div>

              {/* FILE INPUT */}

              <div className="upload-section">

                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="input"
                  onChange={(e) =>
                    uploadImage(
                      equipmentIndex,
                      e.target.files[0]
                    )
                  }
                />

              </div>

              {/* IMAGE GRID */}

              <div className="evidence-grid">

                {item.inspections.map(
                  (
                    inspection,
                    inspectionIndex
                  ) => (

                    <div
                      key={inspectionIndex}
                      className="evidence-card"
                    >

                      {/* IMAGE */}

                      <div className="thumbnail-wrapper">

  <img
    src={`${API}/uploads/${inspection.image}`}
    alt="Inspection"
    className="thumbnail-image"
    onClick={() =>
      window.open(
        `${API}/uploads/${inspection.image}`,
        "_blank"
      )
    }
  />

</div>

                      {/* META */}

                      <div className="image-meta">

                        <strong>
                          Le:
                        </strong>

                        <br />

                        {
                          inspection.datetime
                        }

                      </div>

                      {/* COMMENT */}

                      <textarea
                        className="textarea comment-box"
                        placeholder="Ajouter un commentaire..."
                        value={
                          inspection.comment
                        }
                        onChange={(e) =>
                          updateInspectionComment(
                            equipmentIndex,
                            inspectionIndex,
                            e.target.value
                          )
                        }
                      />

                      {/* REMOVE */}

                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          removeInspection(
                            equipmentIndex,
                            inspectionIndex
                          )
                        }
                      >

                        Annuler

                      </button>

                    </div>
                  )
                )}

              </div>

            </div>
          )
        )}

      </div>

      {/* SAVE */}

      <div
        style={{
          marginTop: "40px",
          textAlign: "center",
        }}
      >

        <button
          className="btn"
          style={{
            padding:
              "16px 40px",
            fontSize: "16px",
          }}
          onClick={saveAudit}
        >

          Enregistrer

        </button>

      </div>

    </Layout>
  );
}

export default CreateAudit;