
let trimsCache = []; // store trims so we can populate dropdown

const makeSelect = document.getElementById("make");
const modelSelect = document.getElementById("model");
const trimSelect = document.getElementById("trim");
const getInfoBtn = document.getElementById("getInfo");

const wizardModalEl = document.getElementById('registrationWizardModal');
const wizardModal = new bootstrap.Modal(wizardModalEl);
const wizardLabel = document.getElementById('wizardModalLabel');
const wizardBody = document.getElementById('wizardModalBody');
const wizardFooter = document.getElementById('wizardModalFooter');
const wizardCloseBtn = document.getElementById('wizardCloseBtn');
let activeTrimData = null; // To store the trim data when wizard starts

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


document.getElementById("saveCarBtn").addEventListener("click", () => {
        // Save the trim data for the wizard to use
        activeTrimData = trim; 
        
        // Start the wizard at step 1
        showWizardStep1();
        wizardModal.show();
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

// WIZARD

function showWizardStep1() {
    wizardLabel.textContent = "Car Registration Wizard (Step 1/3)";
    wizardCloseBtn.style.display = "block"; // Show close button
    wizardBody.innerHTML = `
        <div class="wizard-step-body">
            <i class="bi bi-usb-drive"></i>
            <h5>Enter your SpecCheck Connector serial number</h5>
            <div class="form-floating mt-3 w-100">
                <input type="text" class="form-control" id="serialNumberInput" placeholder="SN-XXXXXX">
                <label for="serialNumberInput">Serial Number</label>
            </div>
            <div id="step1-error" class="text-danger mt-2 d-none">Please enter a serial number.</div>
        </div>
    `;
    wizardFooter.innerHTML = `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" id="wizardStep1Next">Next</button>
    `;

    document.getElementById("wizardStep1Next").addEventListener("click", () => {
        const serialInput = document.getElementById("serialNumberInput");
        const errorEl = document.getElementById("step1-error");
        if (serialInput.value.trim() === "") {
            errorEl.classList.remove("d-none");
            serialInput.classList.add("is-invalid");
        } else {
            errorEl.classList.add("d-none");
            serialInput.classList.remove("is-invalid");
            showWizardStep2();
        }
    });
}

function showWizardStep2() {
    wizardLabel.textContent = "Car Registration Wizard (Step 2/3)";
    wizardCloseBtn.style.display = "block"; // Show close button
    wizardBody.innerHTML = `
        <div class="wizard-step-body">
            <i class="bi bi-car-front"></i>
            <h5>Plug the SpecCheck Connector into your car</h5>
            <p class="text-muted">Once connected, press 'Next' to begin registration.</p>
        </div>
    `;
    wizardFooter.innerHTML = `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" id="wizardStep2Next">Next</button>
    `;

    document.getElementById("wizardStep2Next").addEventListener("click", () => {
        showWizardStep3_Registering();
    });
}

function showWizardStep3_Registering() {
    wizardLabel.textContent = "Car Registration Wizard (Step 3/3)";
    wizardCloseBtn.style.display = "none"; // Hide close button during "critical" step
    wizardBody.innerHTML = `
        <div class="wizard-step-body">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <h5>Registering Car...</h5>
            <p class="text-muted">Please wait, this may take a moment.</p>
        </div>
    `;
    wizardFooter.innerHTML = `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" disabled>Cancel</button>
    `;
    
    setTimeout(async () => {        
        try {
            const res = await fetch("/account/add-car", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    make: document.getElementById("make").value,
                    model: document.getElementById("model").value,
                    trimId: activeTrimData.model_id
                })
            });
            
            if (!res.ok) {
                // If API throws an error
                const errorText = await res.text();
                throw new Error(errorText || "Registration failed.");
            }
            
            // Success! Proceed to final step
            // fake some details for the success screen
            const fakeVIN = "VIN" + Math.random().toString(36).substring(2, 15).toUpperCase();
            const fakeLicense = Math.random().toString(36).substring(2, 8).toUpperCase();
            
            showWizardStep4_Success(activeTrimData, fakeVIN, fakeLicense);

        } catch (err) {
            console.error(err);
            showWizardStep_Error(err.message);
        }

    }, 2000); // 2-second simulation
}

function showWizardStep4_Success(trim, vin, license) {
    wizardLabel.textContent = "Car Registration Wizard (Step 3/3)";
    wizardCloseBtn.style.display = "block"; // Show close button again
    wizardBody.innerHTML = `
        <div class="wizard-step-body">
            <i class="bi bi-check-circle-fill text-success"></i>
            <h2 class="mb-3">Car Registered!</h2>
            <h5 class="mb-1">${trim.model_year} ${trim.model_name} ${trim.model_trim || ""}</h5>
            <div class="text-start w-100 px-4 mt-3">
                <p class="mb-1"><strong>VIN:</strong> ${vin}</p>
                <p><strong>License Plate:</strong> ${license}</p>
            </div>
        </div>
    `;
    wizardFooter.innerHTML = `
        <button type="button" class="btn btn-primary" id="wizardHomeBtn">Go to My Account</button>
    `;

    document.getElementById("wizardHomeBtn").addEventListener("click", () => {
        // Redirect user to their account page
        window.location.href = '/account'; 
    });
}

function showWizardStep_Error(errorMessage) {
    wizardLabel.textContent = "Registration Failed";
    wizardCloseBtn.style.display = "block";
    wizardBody.innerHTML = `
        <div class="wizard-step-body">
            <i class="bi bi-x-circle-fill text-danger"></i>
            <h2 class="mb-3">Error</h2>
            <p class="text-muted">${errorMessage}</p>
        </div>
    `;
    wizardFooter.innerHTML = `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    `;
}

// Initialize
loadMakes();