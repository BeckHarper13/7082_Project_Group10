document.addEventListener('input', (e) => {
  const target = e.target;
  if (!target.classList || !target.classList.contains('tempRange')) return;

  // try to find a nearby display element
  let valueEl = target.closest('.temp-slider')?.querySelector('.rangeValue');
  if (!valueEl) {
    // as a fallback, look for a sibling span
    valueEl = target.previousElementSibling?.querySelector('.rangeValue') || null;
  }
  if (valueEl) valueEl.textContent = target.value;
});

document.querySelectorAll('.start-car-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();            // prevents link navigation
    
    const card = btn.closest('.mockCarInteraction');
    const tempSlider = card.querySelector('.temp-slider');
    const textDiv = btn.querySelector('.start-car-text');

    // Toggle the class
    if (btn.classList.contains('car-started')) {
        // STOP CAR
        btn.classList.remove('car-started');
        textDiv.innerHTML = "Start<br>Car";
        tempSlider.classList.remove('show');
        tempSlider.innerHTML = "";
    } else {
        // START CAR
        btn.classList.add('car-started');
        textDiv.innerHTML = "Stop<br>Car";
        tempSlider.innerHTML = renderTempSlider();
        tempSlider.classList.add('show');
    }
  });
});

function renderTempSlider() {
    return `<div class="d-flex flex-column justify-content-center">
                <label class="form-label mb-1 small text-muted text-center">
                    A/C: <span class="rangeValue fw-bold text-dark">20</span>°C
                </label>
                <input type="range" class="form-range tempRange" min="10" max="30" value="20" step="1">
            </div>`;
}