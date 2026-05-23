import {
  useState,
} from "react";

import axios from "axios";

import { Link } from "react-router-dom";

function AIGenerator() {
  const [zone, setZone] =
    useState("BAT");

  const [blocCode, setBlocCode] =
    useState("");

  const [installation,
    setInstallation] =
    useState("");

  const [operation,
    setOperation] =
    useState("");

  const [product,
    setProduct] =
    useState("");

  const [centralEvent,
    setCentralEvent] =
    useState("");

  const [causes,
    setCauses] =
    useState("");

  const [
    dangerousPhenomenon,
    setDangerousPhenomenon,
  ] = useState("");

  const [consequences,
    setConsequences] =
    useState("");

  const [
    preventiveMeasures,
    setPreventiveMeasures,
  ] = useState("");

  const [blocs,
    setBlocs] =
    useState([]);

  const [table,
    setTable] =
    useState([]);

  const addBloc = () => {
    const newBloc = {
      bloc_code: blocCode,
      installation,
      operation,
      product,
      central_event:
        centralEvent,
      causes,
      dangerous_phenomenon:
        dangerousPhenomenon,
      consequences,
      preventive_measures:
        preventiveMeasures,
    };

    setBlocs([
      ...blocs,
      newBloc,
    ]);

    alert(
      "Bloc added successfully"
    );

    setBlocCode("");
    setInstallation("");
    setOperation("");
    setProduct("");
    setCentralEvent("");
    setCauses("");
    setDangerousPhenomenon("");
    setConsequences("");
    setPreventiveMeasures("");
  };

  const generateAPR =
    async () => {
      try {
        const res =
          await axios.post(
            "http://localhost:5000/api/ai/generate-apr",
            {
              zone,
              blocs,
            }
          );

        setTable(res.data);
      } catch (error) {
        console.log(error);

        alert(
          "APR generation failed"
        );
      }
    };

  return (
    <div className="page">
      <div className="navbar">
        <div className="logo">
          QSHE SYSTEM
        </div>

        <div className="nav-links">
          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link to="/create-audit">
            New Audit
          </Link>

          <Link to="/saved-audits">
            Saved Audits
          </Link>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <h1>
            AI APR Generator
          </h1>

          <br />

          <select
            className="input"
            value={zone}
            onChange={(e) =>
              setZone(
                e.target.value
              )
            }
          >
            <option>
              BAT
            </option>

            <option>
              MAG
            </option>

            <option>
              STE
            </option>

            <option>
              ZMT
            </option>
          </select>

          <input
            className="input"
            placeholder="Bloc Code (BAT01)"
            value={blocCode}
            onChange={(e) =>
              setBlocCode(
                e.target.value
              )
            }
          />

          <input
            className="input"
            placeholder="Installation"
            value={installation}
            onChange={(e) =>
              setInstallation(
                e.target.value
              )
            }
          />

          <input
            className="input"
            placeholder="Operation"
            value={operation}
            onChange={(e) =>
              setOperation(
                e.target.value
              )
            }
          />

          <input
            className="input"
            placeholder="Product"
            value={product}
            onChange={(e) =>
              setProduct(
                e.target.value
              )
            }
          />

          <input
            className="input"
            placeholder="Central Event"
            value={centralEvent}
            onChange={(e) =>
              setCentralEvent(
                e.target.value
              )
            }
          />

          <textarea
            className="textarea"
            placeholder="Possible Causes"
            value={causes}
            onChange={(e) =>
              setCauses(
                e.target.value
              )
            }
          />

          <textarea
            className="textarea"
            placeholder="Dangerous Phenomenon"
            value={
              dangerousPhenomenon
            }
            onChange={(e) =>
              setDangerousPhenomenon(
                e.target.value
              )
            }
          />

          <textarea
            className="textarea"
            placeholder="Consequences"
            value={consequences}
            onChange={(e) =>
              setConsequences(
                e.target.value
              )
            }
          />

          <textarea
            className="textarea"
            placeholder="Preventive Measures"
            value={
              preventiveMeasures
            }
            onChange={(e) =>
              setPreventiveMeasures(
                e.target.value
              )
            }
          />

          <br />

          <button
            className="btn"
            onClick={addBloc}
          >
            Add Bloc
          </button>

          <button
            className="btn"
            style={{
              marginLeft: "10px",
            }}
            onClick={generateAPR}
          >
            Generate APR Table
          </button>

          <table className="apr-table">
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
                  Measures
                </th>

                <th>
                  Risk
                </th>
              </tr>
            </thead>

            <tbody>
              {table.map(
                (
                  row,
                  index
                ) => (
                  <tr
                    key={index}
                  >
                    <td>
                      {
                        row.bloc_code
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
                        row.existing_measures
                      }
                    </td>

                    <td
                      className={
                        row.risk_color.toLowerCase()
                      }
                    >
                      {
                        row.risk_color
                      }
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AIGenerator;