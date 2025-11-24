document.addEventListener('input', (e) => {
  if (e.target.classList.contains('tempRange')) {
    const valueEl = e.target.closest('.temp-slider').querySelector('.rangeValue');
    if (valueEl) valueEl.textContent = e.target.value;
  }
});

document.querySelectorAll('.start-car-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    
    const card = btn.closest('.mockCarInteraction');
    const tempSlider = card.querySelector('.temp-slider');
    const contentDiv = btn.querySelector('.start-car-content');

    console.log(btn.classList)
    // STOP CAR
    if (btn.classList.contains('car-started')) {        
        btn.classList.add('is-loading');
        btn.classList.remove('car-started');
        
        // spinner
        contentDiv.innerHTML = `<div class="spinner-border text-primary" role="status" style="width: 1.5rem; height: 1.5rem; border-width: 3px;"></div>`;
        tempSlider.innerHTML = `<div class="text-muted small ms-2 fst-italic d-flex align-items-center" style="height: 100%;">Stopping car...</div>`;
        
        // SIMULATE DELAY
        setTimeout(() => {
            btn.classList.remove('is-loading');
            contentDiv.innerHTML = `<div class="start-car-text">Start<br>Car</div>`;
            tempSlider.innerHTML = "";
            tempSlider.classList.add('d-none');
            
        }, 1000);
  } 
    // START CAR
    else if (!btn.classList.contains('is-loading')) {        
        btn.classList.add('is-loading');
        
        // spinner 
        contentDiv.innerHTML = `<div class="spinner-border text-primary" role="status" style="width: 1.5rem; height: 1.5rem; border-width: 3px;"></div>`;
        tempSlider.innerHTML = `<div class="text-muted small ms-2 fst-italic d-flex align-items-center" style="height: 100%;">Starting car...</div>`;
        tempSlider.classList.remove('d-none');
        
        // SIMULATE DELAY
        setTimeout(() => {
            btn.classList.remove('is-loading');
            btn.classList.add('car-started'); 
            contentDiv.innerHTML = `<div class="start-car-text text-white">Stop<br>Car</div>`;            
            tempSlider.innerHTML = renderTempSlider();
            
        }, 2000); 
    }
  });
});

function renderTempSlider() {
    return `<div class="d-flex flex-column justify-content-center fade-in">
                <label class="form-label mb-1 small text-muted text-center">
                    A/C: <span class="rangeValue fw-bold text-dark">20</span>°C
                </label>
                <input type="range" class="form-range tempRange" min="10" max="30" value="20" step="1">
            </div>`;
}