// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Get the car ID from the URL
    const carId = window.location.pathname.split('/')[2];
    
    // Initialize Bootstrap modal
    const editNotesModal = new bootstrap.Modal(document.getElementById('editNotesModal'));
    
    // Get elements
    const editBtn = document.getElementById('editBtn');
    const backBtn = document.getElementById('backBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const saveNoteBtn = document.getElementById('saveNoteBtn');
    const askAiBtn = document.getElementById('askAiBtn');
    const notesTextarea = document.getElementById('notesTextarea');
    const notesDisplay = document.getElementById('notesDisplay');
    
    // Edit button
    editBtn.addEventListener('click', function(e) {
        e.preventDefault();
        editNotesModal.show();
    });
    
    // Save Note button - POST to /cars/<car_id>/note 
    saveNoteBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const noteContent = notesTextarea.value;
        
        fetch(`/cars/${carId}/note`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                note: noteContent
            })
        })
        .then(response => {
            if (response.ok) {
                // Update the display with new note
                notesDisplay.textContent = noteContent;
                // Close modal
                editNotesModal.hide();
            } else {
                alert(`Failed to save note: ${response.status} ${response.statusText}\nPlease try again.`);
            }
        })
        .catch(error => {
            console.error('Error saving note:', error);
            alert('An error occurred while saving the note.');
        });
    });
    
    // Back button
    backBtn.addEventListener('click', function() {
        window.location.href = `/cars`;
    });
    
    // Delete button
    deleteBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this car?')) {
            // Handle delete logic
            window.location.href = `/cars/${carId}/delete`;
        }
    });
    
    // Ask AI button
    askAiBtn.addEventListener('click', function() {
        // Handle Ask AI logic
        window.location.href = `/cars/${carId}/ask-ai`;
    });
});