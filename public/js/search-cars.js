
let trimsCache = []; // store trims so we can populate dropdown

const makeSelect = document.getElementById("make");
const modelSelect = document.getElementById("model");
const trimSelect = document.getElementById("trim");
const getInfoBtn = document.getElementById("getInfo");

async function loadMakes() {
  const res = await fetch('/api/makes');
  const text = await res.text();
  try {
    const json = JSON.parse(text.replace("var makes = ", "").replace(";", ""));
    makeSelect.innerHTML = '<option value="">Select a Make</option>'; // Add default option
    
    json.Makes.forEach(m => {
      let opt = document.createElement("option");
      opt.value = m.make_id;
      opt.textContent = m.make_display;
      makeSelect.appendChild(opt);
    });

  } catch (error) {
    console.error("Failed to parse makes data:", error);
    makeSelect.innerHTML = '<option value="">Error loading makes</option>';
  }
}

// Load models when a make is selected
async function loadModels(makeId) { 
  modelSelect.disabled = true;
  modelSelect.innerHTML = '<option value="">Loading Models...</option>';
  trimSelect.disabled = true;
  getInfoBtn.disabled = true;

  const res = await fetch(`/api/models?make=${makeId}`);
  const text = await res.text();
  
  try {
    const json = JSON.parse(text.replace("var models = ", "").replace(";", ""));
    modelSelect.innerHTML = '<option value="">Select a Model</option>'; // Default option
    
    json.Models.forEach(m => {
      let opt = document.createElement("option");
      opt.value = m.model_name; 
      opt.textContent = m.model_name;
      modelSelect.appendChild(opt);
    });
    
    modelSelect.disabled = false;

  } catch (error) {
    console.error("Failed to parse models data:", error);
    modelSelect.innerHTML = '<option value="">Error loading models</option>';
  }
}

//Load trim options for the make and model
async function loadTrims(makeId, modelName) {
  trimSelect.disabled = true;
  trimSelect.innerHTML = '<option value="">Loading Trims...</option>';
  getInfoBtn.disabled = true;

  const res = await fetch(`/api/trims?make=${makeId}&model=${modelName}`);
  const text = await res.text();
  
  try {
    const json = JSON.parse(text.replace("var trims = ", "").replace(";", ""));
    trimsCache = json.Trims;

    trimSelect.innerHTML = '<option value="">Select a Trim</option>'; // Default option

    trimsCache.forEach(trim => {
      let opt = document.createElement("option");
      opt.value = trim.model_id; // unique identifier
      opt.textContent = `${trim.model_year} - ${trim.model_trim || trim.model_name}`;
      trimSelect.appendChild(opt);
    });
    
    trimSelect.disabled = false;
    if (trimsCache.length > 0) {
        getInfoBtn.disabled = false;
    }
    
  } catch (error) {
    console.error("Failed to parse trims data:", error);
    trimSelect.innerHTML = '<option value="">Error loading trims</option>';
  }
}

function showTrimInfo(trimId) {
  const trim = trimsCache.find(t => t.model_id == trimId);
  if (!trim) return;

  const output = document.getElementById("output");
  output.innerHTML = `
      <div class="trim-info mb-5">
        <h2 class="text-center mb-4 fw-bold">
          ${trim.model_name} ${trim.model_trim || ""} (${trim.model_year})
        </h2>
        
        <div class="card shadow-sm mb-4">
            <div class="card-body p-3">
                <div class="d-flex align-items-center mb-3">
                    <i class="bi bi-gear-fill text-primary fs-4 me-3"></i>
                    <h3 class="section-title mb-0 fw-bold">Engine & Power</h3>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between">
                        <strong>Engine Specs:</strong>
                        <span>${trim.model_engine_cc || "N/A"} cc, ${trim.model_engine_cyl || "N/A"} cyl, ${trim.model_engine_type || "N/A"}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <strong>Horsepower:</strong>
                        <span class="fw-bold">${trim.model_engine_power_hp || "N/A"} HP</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <strong>Torque:</strong>
                        <span>${trim.model_engine_torque_nm || "N/A"} Nm</span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="card shadow-sm mb-4">
            <div class="card-body p-3">
                <div class="d-flex align-items-center mb-3">
                    <i class="bi bi-fuel-pump-fill text-primary fs-4 me-3"></i>
                    <h3 class="section-title mb-0 fw-bold">Fuel & Drivetrain</h3>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between">
                        <strong>Fuel Type:</strong>
                        <span>${trim.model_engine_fuel || "N/A"}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <strong>Transmission:</strong>
                        <span>${trim.model_transmission_type || "N/A"}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <strong>Drive:</strong>
                        <span>${trim.model_drive || "N/A"}</span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="card shadow-sm mb-4">
            <div class="card-body p-3">
                <div class="d-flex align-items-center mb-3">
                    <i class="bi bi-speedometer2 text-primary fs-4 me-3"></i>
                    <h3 class="section-title mb-0 fw-bold">Performance</h3>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between">
                        <strong>Top Speed:</strong>
                        <span class="fw-bold">${trim.model_top_speed_kph || "N/A"} kph</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <strong>0-100 km/h:</strong>
                        <span class="fw-bold">${trim.model_0_to_100_kph || "N/A"} s</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <strong>Consumption (Combined):</strong>
                        <span>${trim.model_lkm_mixed || "N/A"} L/100km</span>
                    </li>
                </ul>
            </div>
        </div>
        
        <div class="d-grid gap-2">
          <button id="saveCarBtn" class="btn btn-success btn-lg mt-3">
            <i class="bi bi-stars me-2"></i> Register This Car
          </button>
        </div>
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

// --- Event Listeners ---

makeSelect.addEventListener("change", e => {
    const makeId = e.target.value;
    if (makeId) {
        loadModels(makeId);
    } else {
        // Reset models and trims if make is unselected
        modelSelect.disabled = true;
        modelSelect.innerHTML = '<option value="">Select a Make first</option>';
        trimSelect.disabled = true;
        trimSelect.innerHTML = '<option value="">Select a Model first</option>';
        getInfoBtn.disabled = true;
    }
});

modelSelect.addEventListener("change", e => {
    const makeId = makeSelect.value;
    const modelName = e.target.value;
    if (makeId && modelName) {
        loadTrims(makeId, modelName);
    } else {
        // Reset trims if model is unselected
        trimSelect.disabled = true;
        trimSelect.innerHTML = '<option value="">Select a Model first</option>';
        getInfoBtn.disabled = true;
    }
});

trimSelect.addEventListener("change", e => {
    getInfoBtn.disabled = !e.target.value;
});

getInfoBtn.addEventListener("click", () => {
  const trimId = trimSelect.value;
  if (trimId) {
    showTrimInfo(trimId);
  }
});

// Initialize
loadMakes();