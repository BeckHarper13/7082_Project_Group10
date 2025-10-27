
let trimsCache = []; // store trims so we can populate dropdown



async function loadMakes() {
  const res = await fetch('/api/makes'); // call your proxy
  const text = await res.text();
  const json = JSON.parse(text.replace("var makes = ", "").replace(";", ""));
  const makeSelect = document.getElementById("make");

  json.Makes.forEach(m => {
    let opt = document.createElement("option");
    opt.value = m.make_id;
    opt.textContent = m.make_display;
    makeSelect.appendChild(opt);
  });
}

// Load models when a make is selected
async function loadModels(make) {
  const res = await fetch(`/api/models?make=${make}`);
  const text = await res.text();
  const json = JSON.parse(text.replace("var models = ", "").replace(";", ""));
  const modelSelect = document.getElementById("model");
  modelSelect.innerHTML = "";

  json.Models.forEach(m => {
    let opt = document.createElement("option");
    opt.value = m.model_name;
    opt.textContent = m.model_name;
    modelSelect.appendChild(opt);
  });
}

//Load trim options for the make and model
async function loadTrims(make, model) {
  const res = await fetch(`/api/trims?make=${make}&model=${model}`);
  const text = await res.text();
  const json = JSON.parse(text.replace("var trims = ", "").replace(";", ""));
  trimsCache = json.Trims;

  const trimSelect = document.getElementById("trim");
  trimSelect.innerHTML = "";

  trimsCache.forEach(trim => {
    let opt = document.createElement("option");
    opt.value = trim.model_id; // unique identifier
    opt.textContent = trim.model_trim || trim.model_name;
    trimSelect.appendChild(opt);
  });
}

function showTrimInfo(trimId) {
  const trim = trimsCache.find(t => t.model_id == trimId);
  if (!trim) return;

  const output = document.getElementById("output");
  output.innerHTML = `
    <div class="trim-info">
      <h2>${trim.model_name} ${trim.model_trim || ""} (${trim.model_year})</h2>
      
      <h3>Engine & Power</h3>
      <p><strong>Engine:</strong> ${trim.model_engine_cc || "N/A"} cc, ${trim.model_engine_cyl || "N/A"} cylinders, ${trim.model_engine_type || "N/A"}</p>
      <p><strong>Power:</strong> ${trim.model_engine_power_ps || "N/A"} PS / ${trim.model_engine_power_hp || "N/A"} HP</p>
      <p><strong>Torque:</strong> ${trim.model_engine_torque_nm || "N/A"} Nm / ${trim.model_engine_torque_lbft || "N/A"} lb-ft</p>
      
      <h3>Transmission & Drivetrain</h3>
      <p><strong>Transmission:</strong> ${trim.model_transmission_type || "N/A"}, ${trim.model_drive || "N/A"}</p>
      
      <h3>Fuel & Economy</h3>
      <p><strong>Fuel Type:</strong> ${trim.model_engine_fuel || "N/A"}</p>
      <p><strong>Fuel Consumption:</strong> City: ${trim.model_lkm_city || "N/A"} L/100km, Highway: ${trim.model_lkm_hwy || "N/A"} L/100km, Combined: ${trim.model_lkm_mixed || "N/A"} L/100km</p>
      
      <h3>Performance</h3>
      <p><strong>Top Speed:</strong> ${trim.model_top_speed_kph || "N/A"} kph</p>
      <p><strong>0-100 km/h:</strong> ${trim.model_0_to_100_kph || "N/A"} s</p>
      
      <button id="saveCarBtn" class="btn btn-success mt-3">Save Car</button>
    </div>
  `;


  document.getElementById("saveCarBtn").addEventListener("click", async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("You must be logged in to save a car.");
            return;
        }

        try {
            const res = await fetch("/account/add-car", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    make: document.getElementById("make").value,
                    model: document.getElementById("model").value,
                    trimId: trim.model_id
                })
            });

            const text = await res.text();
            alert(text); // Show success or error message
        } catch (err) {
            console.error(err);
            alert("Error saving car. Please try again.");
        }
    });

}

// Event listeners
document.getElementById("make").addEventListener("change", e => loadModels(e.target.value));
document.getElementById("model").addEventListener("change", e => {
  const make = document.getElementById("make").value;
  loadTrims(make, e.target.value);
});
document.getElementById("getInfo").addEventListener("click", () => {
  const trimId = document.getElementById("trim").value;
  showTrimInfo(trimId);
});

// Initialize
loadMakes();