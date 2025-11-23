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
    e.stopImmediatePropagation();  // stops ALL click behavior
    e.preventDefault();            // prevents link navigation
    // Toggle the class
    if (btn.classList.contains('car-started')) {
        btn.classList.remove('car-started');
        const card = btn.closest('.mockCarInteraction');
        const tempSlider = card.querySelector('.temp-slider');
        tempSlider.innerHTML = "";
    } else {
      btn.classList.add('car-started');
        const card = btn.closest('.mockCarInteraction');
        const tempSlider = card.querySelector('.temp-slider');
        tempSlider.innerHTML = renderTempSlider();
    }
  });
});

function renderTempSlider() {
    return `<label class="form-label">
                Temp: <span class="rangeValue fw-bold">20</span>°C
            </label>
            <input type="range" class="form-range tempRange" min="10" max="30" value="20" step="1">`;
}