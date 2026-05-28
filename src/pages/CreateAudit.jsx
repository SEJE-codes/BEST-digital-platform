import { useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API =
  import.meta.env.VITE_API_URL ||
  "https://best-backend-1.onrender.com";

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
  // SAVE SINGLE INSPECTION
  // ===================================

  const saveInspection = (
  equipmentIndex
) => {

  const updatedChecklist =
    [...checklist];

  const equipment =
    updatedChecklist[
      equipmentIndex
    ];

  // CURRENT TEMP DATA
  const current =
    equipment.currentInspection;

  // VALIDATION
  if (
    !current.image ||
    !current.comment
  ) {
    alert(
      "Ajoutez image et commentaire"
    );

    return;
  }

  // ADD TO SAVED INSPECTIONS
  equipment.inspections.push({
    image: current.image,
    comment: current.comment,
    datetime:
      current.datetime,
  });

  // RESET CURRENT INSPECTION
  equipment.currentInspection =
    {
      image: "",
      comment: "",
      datetime: "",
    };

  setChecklist(
    updatedChecklist
  );
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

          saved: false,

        });

        setChecklist(updated);

      } catch (error) {

        console.log(error);

        alert(
          "Erreur de chargement de l'image"
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
  // REMOVE INSPECTION
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

  // ===================================
  // UI
  // ===================================

  return (

    <Layout title="Collecte des données">

      {/* FORM */}

      <div className="card">

        <div className="form-grid">

          <div>

            <label>
              Nom de l'entreprise
            </label>

            <input
              type="text"
              className="input"
              placeholder="Exemple: BEST SARL"
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
              Nom de l'inspecteur
            </label>

            <input
              type="text"
              className="input"
              placeholder="Exemple: Sume Ekoti"
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

      <div className="equipment-section">

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
          src={
            inspection.image instanceof
            File
              ? URL.createObjectURL(
                  inspection.image
                )
              : `${API}/uploads/${inspection.image}`
          }
          alt=""
          className="saved-preview-image"
        />

        <div className="saved-preview-info">

          <p>
            <strong>
              Image {index + 1}
            </strong>
          </p>

          <p>
            {
              inspection.comment
            }
          </p>

          <small>
            {
              inspection.datetime
            }
          </small>

        </div>

      </div>
    )
  )}

  {/* CURRENT INSPECTION */}

  <div className="new-inspection-box">

    {/* IMAGE */}

    {item.currentInspection
      ?.image && (

      <img
        src={
          item.currentInspection
            .image instanceof
          File
            ? URL.createObjectURL(
                item
                  .currentInspection
                  .image
              )
            : `${API}/uploads/${item.currentInspection.image}`
        }
        alt=""
        className="inspection-image"
      />

    )}

    {/* COMMENT */}

    <textarea
      value={
        item.currentInspection
          ?.comment || ""
      }
      onChange={(e) =>
        updateCurrentInspection(
          equipmentIndex,
          "comment",
          e.target.value
        )
      }
      placeholder="Commentaire..."
    />

    {/* ACTIONS */}

    <div className="inspection-actions">

      <button
        className="btn btn-danger"
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

</div>

      {/* SAVE AUDIT */}

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

          Enregistrer l'audit

        </button>

      </div>

    </Layout>
  );
}

export default CreateAudit;