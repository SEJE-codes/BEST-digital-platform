import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API =
  import.meta.env.VITE_API_URL;

function APRTablePage() {

  // =====================================
  // STATES
  // =====================================

  const [
    selectedZone,
    setSelectedZone,
  ] = useState("");

  const [
    selectedBloc,
    setSelectedBloc,
  ] = useState("");

  const [
    preventiveMeasures,
    setPreventiveMeasures,
  ] = useState("");

  const [
    blocEntries,
    setBlocEntries,
  ] = useState([]);

  const [
    generatedTable,
    setGeneratedTable,
  ] = useState([]);

  const [
    reportId,
    setReportId,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(false);

  // =====================================
  // BLOCS DATA
  // =====================================

  const blocsData = { 
    BAT: [
    {
      code: "BAT01",
      installation: "Bâtiment administratif",
    },

    {
      code: "BAT02",
      installation: "Parking",
    },

    {
      code: "BAT03",
      installation: "Zone BAT 03",
    },

    {
      code: "BAT04",
      installation: "Réfectoire",
    },
  ],

  STE: [
    {
      code: "STE01",
      installation: "Station de traitement des eaux",
    },

    {
      code: "STE02",
      installation: "Zone STE 02",
    },

    {
      code: "STE03",
      installation: "Zone STE 03",
    },

    {
      code: "STE04",
      installation: "Zone STE 04",
    },
  ],

  MAG: [
    {
      code: "MAG01",
      installation: "Tous les magasins du site",
    },

    {
      code: "MAG02",
      installation: "Magasin 02",
    },

    {
      code: "MAG03",
      installation: "Magasin 03",
    },

    {
      code: "MAG04",
      installation: "Magasin 04",
    },

    {
      code: "MAG05",
      installation: "Magasin 05",
    },

    {
      code: "MAG06",
      installation: "Zone de stockage des hydrocarbures",
    },

    {
      code: "MAG07",
      installation: "Magasin 07",
    },

    {
      code: "MAG08",
      installation: "Magasin 08",
    },

    {
      code: "MAG09",
      installation: "Magasin 09",
    },

    {
      code: "MAG10",
      installation: "Magasin 10",
    },

    {
      code: "MAG11",
      installation: "Cuve de gaz",
    },

    {
      code: "MAG12",
      installation: "Magasin 12",
    },

    {
      code: "MAG13",
      installation: "Soupape",
    },

    {
      code: "MAG14",
      installation: "Zone de trie",
    },

    {
      code: "MAG15",
      installation: "Chambre froide",
    },

    {
      code: "MAG16",
      installation: "Magasin 16",
    },
  ],

  ZMT: [
    {
      code: "ZMT01",
      installation: "Atelier maintenance",
    },

    {
      code: "ZMT02",
      installation: "Zone maintenance 02",
    },

    {
      code: "ZMT03",
      installation: "Zone maintenance 03",
    },

    {
      code: "ZMT04",
      installation: "Zone maintenance 04",
    },

    {
      code: "ZMT05",
      installation: "Zone maintenance 05",
    },

    {
      code: "ZMT06",
      installation: "Zone maintenance 06",
    },

    {
      code: "ZMT07",
      installation: "Atelier et Garage",
    },

    {
      code: "ZMT08",
      installation: "Zone maintenance 08",
    },
  ],

  CON: [
    {
      code: "CON01",
      installation: "Conditionnement",
    },

    {
      code: "CON02",
      installation: "Conditionnement 02",
    },

    {
      code: "CON03",
      installation: "Conditionnement 03",
    },

    {
      code: "CON04",
      installation: "Conditionnement 04",
    },
  ],

  MAC: [
    {
      code: "MAC01",
      installation: "Chaudière",
    },

    {
      code: "MAC02",
      installation: "Salle machine 02",
    },

    {
      code: "MAC03",
      installation: "Salle machine 03",
    },

    {
      code: "MAC04",
      installation: "Compresseur des fluides (air CO2)",
    },

    {
      code: "MAC05",
      installation: "Salle machine 05",
    },

    {
      code: "MAC06",
      installation: "Salle machine 06",
    },

    {
      code: "MAC07",
      installation: "Salle machine 07",
    },

    {
      code: "MAC08",
      installation: "Salle machine 08",
    },

    {
      code: "MAC09",
      installation: "Salle machine 09",
    },

    {
      code: "MAC10",
      installation: "Salle machine 10",
    },

    {
      code: "MAC11",
      installation: "Salle machine 11",
    },
  ],

  TRA: [
    {
      code: "TRA01",
      installation: "Matériels roulants",
    },

    {
      code: "TRA02",
      installation: "Transport 02",
    },

    {
      code: "TRA03",
      installation: "Transport 03",
    },

    {
      code: "TRA04",
      installation: "Matériels roulants",
    },
  ],

  ELT: [
    {
      code: "ELT01",
      installation: "Transformateur / Coffret électrique / Bloc électrique",
    },

    {
      code: "ELT02",
      installation: "Zone électrique 02",
    },

    {
      code: "ELT03",
      installation: "Transformateurs",
    },

    {
      code: "ELT04",
      installation: "Zone électrique 04",
    },

    {
      code: "ELT05",
      installation: "Groupe électrogène",
    },

    {
      code: "ELT06",
      installation: "Zone électrique 06",
    },

    {
      code: "ELT07",
      installation: "Zone électrique 07",
    },
  ],

  CMT: [
    {
      code: "CMT01",
      installation: "Quai de dépotage",
    },

    {
      code: "CMT02",
      installation: "Cours manutention 02",
    },

    {
      code: "CMT03",
      installation: "Cour",
    },

    {
      code: "CMT04",
      installation: "Cours manutention 04",
    },
  ],

  CAN: [
    {
      code: "CAN01",
      installation: "Canalisation de fluide",
    },

    {
      code: "CAN02",
      installation: "Canalisation 02",
    },

    {
      code: "CAN03",
      installation: "Canalisation 03",
    },

    {
      code: "CAN04",
      installation: "Canalisation 04",
    },
  ],

  LAB: [
    {
      code: "LAB01",
      installation: "Laboratoire",
    },

    {
      code: "LAB02",
      installation: "Laboratoire 02",
    },

    {
      code: "LAB03",
      installation: "Laboratoire 03",
    },
  ],

  SIL: [
    {
      code: "SIL01",
      installation: "Zone d’ensilage",
    },

    {
      code: "SIL02",
      installation: "Zone SIL 02",
    },

    {
      code: "SIL03",
      installation: "Zone d’ensilage du malt, maïs",
    },

    {
      code: "SIL04",
      installation: "Zone de désilage du maïs",
    },

    {
      code: "SIL05",
      installation: "Zone SIL 05",
    },

    {
      code: "SIL06",
      installation: "Sous-sol",
    },

    {
      code: "SIL07",
      installation: "Zone SIL 07",
    },

    {
      code: "SIL08",
      installation: "Zone SIL 08",
    },

    {
      code: "SIL09",
      installation: "Zone SIL 09",
    },

    {
      code: "SIL10",
      installation: "Zone SIL 10",
    },

    {
      code: "SIL11",
      installation: "Zone SIL 11",
    },

    {
      code: "SIL12",
      installation: "Silos",
    },

    {
      code: "SIL13",
      installation: "Zone SIL 13",
    },

    {
      code: "SIL14",
      installation: "Zone SIL 14",
    },

    {
      code: "SIL15",
      installation: "Zone SIL 15",
    },

    {
      code: "SIL16",
      installation: "Zone SIL 16",
    },

    {
      code: "SIL17",
      installation: "Zone SIL 17",
    },

    {
      code: "SIL18",
      installation: "Zone SIL 18",
    },

    {
      code: "SIL19",
      installation: "Station à gaz",
    },
  ],
   };

  // =====================================
  // ADD BLOC
  // =====================================

  const addBloc = () => {

    if (
      !selectedBloc ||
      !preventiveMeasures
    ) {

      alert(
        "Remplire tout les champs"
      );

      return;
    }

    const alreadyExists =
      blocEntries.find(
        (b) =>
          b.code ===
          selectedBloc
      );

    if (alreadyExists) {

      alert(
        "Bloc déja ajouté"
      );

      return;
    }

    const newBloc = {

      code:
        selectedBloc,

      existing_measures:
        preventiveMeasures,
    };

    setBlocEntries([
      ...blocEntries,
      newBloc,
    ]);

    setPreventiveMeasures("");
  };

  // =====================================
  // DELETE BLOC
  // =====================================

  const removeBloc = (
    code
  ) => {

    const filtered =
      blocEntries.filter(
        (b) =>
          b.code !== code
      );

    setBlocEntries(filtered);
  };

  // =====================================
  // GENERATE APR
  // =====================================

  const generateAPR =
    async () => {

      try {

        setLoading(true);

        const res =
          await axios.post(
            `${API}/api/ai/generate-apr`,
            {
              zone:
                selectedZone,

              blocs:
                blocEntries,
            }
          );

        setGeneratedTable(
          res.data.table
        );

        setReportId(
          res.data.reportId
        );

      } catch (error) {

        console.log(error);

        alert(
          "Generation APR échoué"
        );

      } finally {

        setLoading(false);
      }
    };

  // =====================================
  // COLORS
  // =====================================

  const getRiskClass = (
    value
  ) => {

    if (
      value === "RED"
    )
      return "risk-red";

    if (
      value === "ORANGE"
    )
      return "risk-orange";

    if (
      value === "YELLOW"
    )
      return "risk-yellow";

    return "risk-green";
  };

  // =====================================
  // UI
  // =====================================

  return (

    <div className="app-layout">

      {/* SIDEBAR */}

      <div className="sidebar">

        <div>

          <div className="sidebar-top">

            <h1 className="brand">
              BEST QSHE
            </h1>

            <p className="brand-subtitle">
              APR Intelligent
            </p>

          </div>

          <div className="sidebar-menu">

            <Link
              to="/dashboard"
              className="sidebar-link"
            >
              Dashboard
            </Link>

            <Link
              to="/create-audit"
              className="sidebar-link"
            >
              Collection de données
            </Link>

            <Link
              to="/saved-audits"
              className="sidebar-link"
            >
              Données Collecté
            </Link>

            <Link
              to="/apr"
              className="sidebar-link active-sidebar-link"
            >
              Génerer APR
            </Link>

            <Link
              to="/apr-reports"
              className="sidebar-link"
            >
              Raports APR
            </Link>

          </div>

        </div>

      </div>

      {/* MAIN */}

      <div className="main-layout">

        {/* TOPBAR */}

        <div className="topbar">

          <div>

            <h1 className="page-title">
              Automatic APR Generator
            </h1>

            <p className="page-subtitle">
              Analyses Automatic des Risks Industriels 
            </p>

          </div>

          <div className="user-avatar">
            BEST
          </div>

        </div>

        {/* CONTENT */}

        <div className="layout-content">

          {/* FORM CARD */}

          <div className="card">

            <h2>
              Configurer Zone Industrielle
            </h2>

            <br />

            {/* ZONE */}

            <select
              className="input"
              value={
                selectedZone
              }
              onChange={(e) => {

                setSelectedZone(
                  e.target.value
                );

                setSelectedBloc(
                  ""
                );
              }}
            >

              <option value="">
                Choisire Zone
              </option>

              {Object.keys(
                blocsData
              ).map(
                (zone) => (

                  <option
                    key={zone}
                    value={zone}
                  >
                    {zone}
                  </option>
                )
              )}

            </select>

            {/* BLOCS */}

            {selectedZone && (

              <select
                className="input"
                value={
                  selectedBloc
                }
                onChange={(e) =>
                  setSelectedBloc(
                    e.target.value
                  )
                }
              >

                <option value="">
                  Choisire Bloc
                </option>

                {blocsData[
                  selectedZone
                ].map(
                  (bloc) => (

                    <option
                      key={
                        bloc.code
                      }
                      value={
                        bloc.code
                      }
                    >
                      {
                        bloc.code
                      }{" "}
                      -
                      {" "}
                      {
                        bloc.installation
                      }
                    </option>
                  )
                )}

              </select>
            )}

            {/* MEASURES */}

            <textarea
              className="textarea"
              placeholder="Entrer les mesures existantes..."
              value={
                preventiveMeasures
              }
              onChange={(e) =>
                setPreventiveMeasures(
                  e.target.value
                )
              }
            />

            <button
              className="btn"
              onClick={addBloc}
            >
              Ajouter Bloc
            </button>

          </div>

          {/* ADDED BLOCS */}

          <br />

          <div className="card">

            <h2>
              Blocs Ajouté
            </h2>

            <br />

            {blocEntries.length ===
              0 && (

              <p>
                Aucun bloc ajouté
              </p>
            )}

            <div className="dashboard-grid">

              {blocEntries.map(
                (
                  item,
                  index
                ) => (

                  <div
                    key={index}
                    className="equipment-card"
                  >

                    <h3>
                      {
                        item.code
                      }
                    </h3>

                    <br />

                    <p>
                      {
                        item.existing_measures
                      }
                    </p>

                    <br />

                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        removeBloc(
                          item.code
                        )
                      }
                    >
                      Supprimmer
                    </button>

                  </div>
                )
              )}

            </div>

          </div>

          {/* GENERATE */}

          <br />

          <button
            className="btn"
            onClick={
              generateAPR
            }
          >

            {loading
              ? "Generating..."
              : "Generer APR"}

          </button>

          {/* PDF */}

          {reportId && (

            <a
              href={`${API}/api/pdf/export/${reportId}`}
              target="_blank"
              rel="noreferrer"
            >

              <button className="btn btn-green">

                Télécharger PDF

              </button>

            </a>
          )}

          {/* GENERATED TABLE */}

          {generatedTable.length >
            0 && (

            <>

              <br />
              <br />

              <div className="card">

                <h2>
                  Tableau D'APR
                </h2>

                <br />

                <div
                  style={{
                    overflowX:
                      "auto",
                  }}
                >

                  <table>

                    <thead>

                      <tr>

                        <th>
                          Bloc
                        </th>

                        <th>
                          Installation
                        </th>

                        <th>
                          Event
                        </th>

                        <th>
                          Risks
                        </th>

                        <th>
                          Existing Measures
                        </th>

                        <th>
                          Initial
                        </th>

                        <th>
                          Residual
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {generatedTable.map(
                        (
                          row,
                          index
                        ) => (

                          <tr
                            key={index}
                          >

                            <td>
                              {
                                row.bloc
                              }
                            </td>

                            <td>
                              {
                                row.installation
                              }
                            </td>

                            <td>
                              {
                                row.central_event
                              }
                            </td>

                            <td>
                              {
                                row.risks
                              }
                            </td>

                            <td>
                              {
                                row.existing_measures
                              }
                            </td>

                            <td>

                              <span
                                className={`risk-badge ${getRiskClass(
                                  row.initial_color
                                )}`}
                              >

                                {
                                  row.initial_risk
                                }

                              </span>

                            </td>

                            <td>

                              <span
                                className={`risk-badge ${getRiskClass(
                                  row.residual_color
                                )}`}
                              >

                                {
                                  row.residual_risk
                                }

                              </span>

                            </td>

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </>
          )}

        </div>

      </div>

    </div>
  );
}

export default APRTablePage;