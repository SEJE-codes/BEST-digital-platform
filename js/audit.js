const API = "http://localhost:5000/api";
const token = localStorage.getItem("token");

 const questions = [

  {
    question: "Electrical cables coated",
    yes: "Electrical cables are properly coated",
    no: "Electrical cables are not coated"
  },

  {
    question: "Fire extinguisher available",
    yes: "Fire extinguisher is available",
    no: "Fire extinguisher is not available"
  },

  {
    question: "Emergency exit accessible",
    yes: "Emergency exit is accessible",
    no: "Emergency exit is blocked"
  }

];
let data = [];

function startAudit() {
  const siteInput = document.getElementById("site");
  const site = siteInput.value.trim();

  if (!site) {
    alert("Enter site name");
    return;
  }

  localStorage.setItem("site", site);
  window.location.href = "checklist.html";
}

if (document.getElementById("list")) {
  const div = document.getElementById("list");

  questions.forEach((q, i) => {
    div.innerHTML += `
  <div class="card">

    <div class="question">${q.question}</div>

    <label>
      <input type="radio" name="q${i}" onchange="answer(${i}, 'YES')">
      Yes
    </label>

    <label style="margin-left:15px;">
      <input type="radio" name="q${i}" onchange="answer(${i}, 'NO')">
      No
    </label>

    <input 
      type="file" 
      id="f${i}" 
      accept="image/*" 
      capture="environment"
      style="display:none"
    >

    <!-- IMAGE PREVIEW -->
    <div id="preview${i}" style="margin-top:10px;"></div>

    <!-- LOCATION INFO -->
    <div id="meta${i}" class="meta"></div>

  </div>
`;
  });
}

async function answer(i, value) {

  const q = questions[i];

  data[i] = {
    question: q.question,
    answer: value,
    text: value === "YES" ? q.yes : q.no
  };

  // ONLY FOR NO
  if (value === "NO") {

    const fileInput = document.getElementById("f" + i);

    fileInput.click();

    fileInput.onchange = async () => {

      const file = fileInput.files[0];

      data[i].file = file;

      // ======================
      // IMAGE PREVIEW
      // ======================

      const preview = document.getElementById("preview" + i);

      preview.innerHTML = `
        <img 
          src="${URL.createObjectURL(file)}"
          class="preview-image"
        >

        <textarea
          id="comment${i}"
          placeholder="Inspector comment..."
          style="
            width:100%;
            margin-top:10px;
            padding:10px;
            border-radius:8px;
            border:1px solid #ccc;
          "
        ></textarea>
      `;

      // COMMENT SAVE
      document
        .getElementById("comment" + i)
        .addEventListener("input", (e) => {

          data[i].inspectorComment = e.target.value;

      });

      // ======================
      // GPS
      // ======================

      navigator.geolocation.getCurrentPosition((pos) => {

        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;

        const now = new Date();

        data[i].meta = {
          latitude,
          longitude,
          accuracy,
          date: now.toLocaleDateString(),
          time: now.toLocaleTimeString()
        };

        // SHOW META
        const meta = document.getElementById("meta" + i);

        meta.innerHTML = `
          <small>
            📍 Lat: ${latitude.toFixed(5)} <br>
            📍 Lng: ${longitude.toFixed(5)} <br>
            🕒 ${now.toLocaleString()} <br>
            🎯 Accuracy: ${accuracy.toFixed(1)} meters
          </small>
        `;

        // SHOW MAP
        initMap(latitude, longitude);

      });

    };

  }

}

async function saveAudit() {
  const site_name = localStorage.getItem("site");

  if (!site_name) {
    alert("No site found");
    return;
  }

  if (data.length !== questions.length) {
    alert("Answer all questions first");
    return;
  }

  try {

    const res = await fetch(API + "/audits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        site_name,
        checklist: data.map(d => ({
          question: d.question,
          answer: d.answer
        }))
      })
    });

    const result = await res.json();

    console.log("Audit created:", result);

    if (!result.auditId) {
      alert("Audit not saved");
      return;
    }

    const auditId = result.auditId;

    for (let i = 0; i < data.length; i++) {
      if (data[i].file) {
        const formData = new FormData();
        formData.append("image", data[i].file);
        formData.append("audit_id", auditId);
        formData.append("comment", data[i].question);
        formData.append(
  "inspector_comment",
  data[i].inspectorComment || ""
);

formData.append(
  "latitude",
  data[i].meta.latitude
);

formData.append(
  "longitude",
  data[i].meta.longitude
);

formData.append(
  "accuracy",
  data[i].meta.accuracy
);

formData.append(
  "date",
  data[i].meta.date
);

formData.append(
  "time",
  data[i].meta.time
);

        await fetch(API + "/audits/upload", {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + token
          },
          body: formData
        });
      }
    }

    alert("Audit saved successfully");

    localStorage.removeItem("site");
    data = [];

    window.location.href = "savedAudits.html";

  } catch (err) {
    console.error(err);
    alert("Error saving audit");
  }
}

if (document.getElementById("audits")) {
  loadAudits();
}

async function loadAudits() {
  try {
    const res = await fetch(API + "/audits", {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    const audits = await res.json();

    const div = document.getElementById("audits");
    div.innerHTML = "";

    audits.forEach(a => {
      div.innerHTML += `
        <div class="card">
          <h4 onclick="openAudit(${a.id})" style="cursor:pointer;">
            ${a.site_name}
          </h4>

          <button class="btn-primary small-btn" onclick="report(${a.id})">
            PDF
          </button>

          <button class="btn-no small-btn" onclick="deleteAudit(${a.id})">
            Delete
          </button>
        </div>
      `;
    });

  } catch (err) {
    console.error(err);
  }
}

async function deleteAudit(id) {
  await fetch(API + "/audits/" + id, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  alert("Deleted");
  loadAudits();
}

function openAudit(id) {
  localStorage.setItem("auditId", id);
  window.location.href = "viewAudit.html";
}

function report(id) {
  window.open(API + "/audits/report/" + id);
}

let map;
let marker;

function initMap(lat, lng) {

  if (!map) {

    map = L.map("map").setView([lat, lng], 16);

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "OpenStreetMap"
      }
    ).addTo(map);

  }

  // remove old marker
  if (marker) {
    map.removeLayer(marker);
  }

  marker = L.marker([lat, lng])
    .addTo(map)
    .bindPopup("Inspection Point")
    .openPopup();

  map.setView([lat, lng], 16);
}