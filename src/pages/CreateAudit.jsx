import { useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API =
  import.meta.env.VITE_API_URL ||
  "https://best-backend-1.onrender.com";

function CreateAudit() {

  const navigate = useNavigate();

  // ===================================
  // BASIC INFO
  // ===================================

  const [companyName, setCompanyName] =
    useState("");

  const [inspectorName, setInspectorName] =
    useState("");

  // ===================================
  // EQUIPMENT LIST
  // ===================================

  const equipmentList = [

    "LOCAL HYDROCARBURE",
    "STEP",
    "SALLE MACHINE",
    "MAGAZIN",
    "GARAGE",
    "INFIRMERIE",
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

  const [checklist, setChecklist] =
    useState(

      equipmentList.map(
        (equipment) => ({

          equipment,

          inspections: [],

          currentInspection: {

            image: "",
            comment: "",
            datetime: "",

          },

        })
      )
    );

  // ===================================
  // UPDATE CURRENT INSPECTION
  // ===================================

  const updateCurrentInspection =
    (
      equipmentIndex,
      field,
      value
    ) => {

      const updated = [...checklist];

      updated[
        equipmentIndex
      ].currentInspection[field] = value;

      setChecklist(updated);
    };

  // ===================================
  // IMAGE UPLOAD
  // ===================================

  const uploadImage =
    async (
      equipmentIndex,
      file
    ) => {

      if (!file) return;

      const formData = new FormData();

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

        const updated = [...checklist];

        updated[
          equipmentIndex
        ].currentInspection = {

          image: res.data.image,

          comment: "",

          datetime:
            new Date()
              .toLocaleString(),

        };

        setChecklist(updated);

      } catch (error) {

        console.log(error);

        alert(
          "Erreur de chargement de l'image"
        );
      }
    };

  // ===================================
  // SAVE INSPECTION
  // ===================================

  const saveInspection =
    (equipmentIndex) => {

      const updated = [...checklist];

      const equipment =
        updated[equipmentIndex];

      const current =
        equipment.currentInspection;

      if (!current.image) {

        alert(
          "Ajoutez une image"
        );

        return;
      }

      equipment.inspections.push({

        image: current.image,

        comment:
          current.comment || "",

        datetime:
          current.datetime,

      });

      equipment.currentInspection = {

        image: "",
        comment: "",
        datetime: "",

      };

      setChecklist(updated);
    };

  // ===================================
  // REMOVE INSPECTION
  // ===================================

  const removeInspection =
    (
      equipmentIndex,
      inspectionIndex
    ) => {

      const updated = [...checklist];

      updated[
        equipmentIndex
      ].inspections.splice(
        inspectionIndex,
        1
      );

      setChecklist(updated);
    };

  // ===================================
  // CANCEL CURRENT INSPECTION
  // ===================================

  const cancelCurrentInspection =
    (equipmentIndex) => {

      const updated = [...checklist];

      updated[
        equipmentIndex
      ].currentInspection = {

        image: "",
        comment: "",
        datetime: "",

      };

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
            "Veuillez remplir tous les champs"
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
          "Audit enregistré"
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

  return (

    <Layout title="Collecte des données">

      {/* FORM */}

      <div className="card">

        <div className="form-grid">

          <input
            type="text"
            className="input"
            placeholder="Nom de l'entreprise"
            value={companyName}
            onChange={(e) =>
              setCompanyName(
                e.target.value
              )
            }
          />

          <input
            type="text"
            className="input"
            placeholder="Nom de l'inspecteur"
            value={inspectorName}
            onChange={(e) =>
              setInspectorName(
                e.target.value
              )
            }
          />

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

              <h2>
                {item.equipment}
              </h2>

              {/* UPLOAD */}

              <label
                className="btn"
                style={{
                  display:
                    "inline-block",
                  cursor:
                    "pointer",
                  marginTop:
                    "15px",
                }}
              >

                Choisir une image

                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  hidden
                  onChange={(e) =>
                    uploadImage(
                      equipmentIndex,
                      e.target.files[0]
                    )
                  }
                />

              </label>

              {/* SAVED INSPECTIONS */}

              {item.inspections.map(
                (
                  inspection,
                  index
                ) => (

                  <div
                    key={index}
                    className="saved-preview-card"
                  >

                    <img
                      src={`${API}/uploads/${inspection.image}`}
                      alt=""
                      className="saved-preview-image"
                    />

                    <div className="saved-preview-info">

                      <p>
                        {inspection.comment}
                      </p>

                      <small>
                        {inspection.datetime}
                      </small>

                    </div>

                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        removeInspection(
                          equipmentIndex,
                          index
                        )
                      }
                    >
                      Supprimer
                    </button>

                  </div>
                )
              )}

              {/* CURRENT INSPECTION */}

              {item.currentInspection.image && (

                <div className="new-inspection-box">

                  <img
                    src={`${API}/uploads/${item.currentInspection.image}`}
                    alt=""
                    className="inspection-image"
                  />

                  <textarea
                    className="textarea"
                    placeholder="Ajouter un commentaire..."
                    value={
                      item.currentInspection.comment
                    }
                    onChange={(e) =>
                      updateCurrentInspection(
                        equipmentIndex,
                        "comment",
                        e.target.value
                      )
                    }
                  />

                  <div className="inspection-actions">

                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        cancelCurrentInspection(
                          equipmentIndex
                        )
                      }
                    >
                      Annuler
                    </button>

                    <button
                      className="btn btn-green"
                      onClick={() =>
                        saveInspection(
                          equipmentIndex
                        )
                      }
                    >
                      Sauvegarder
                    </button>

                  </div>

                </div>
              )}

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
          onClick={saveAudit}
        >
          Enregistrer l'audit
        </button>

      </div>

    </Layout>
  );
}

export default CreateAudit;