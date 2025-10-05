// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function () {
    // Get the car ID from the URL (assumes URL format like /cars/1)
    const carId = window.location.pathname.split('/')[2];

    // Initialize Bootstrap modal
    const editNotesModal = new bootstrap.Modal(document.getElementById('editNotesModal'));
    const aichatModal = new bootstrap.Modal(document.getElementById('aichatModal'));

    // Get elements
    const editBtn = document.getElementById('editBtn');
    const backBtn = document.getElementById('backBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const saveNoteBtn = document.getElementById('saveNoteBtn');
    const askAiBtn = document.getElementById('askAiBtn');
    const notesTextarea = document.getElementById('notesTextarea');
    const notesDisplay = document.getElementById('notesDisplay');
    const chatTextarea = document.getElementById('chatTextarea');
    const sendChatBtn = document.getElementById('sendChatBtn');
    const chatBody = document.getElementById('chatBody');

    // Edit button
    editBtn.addEventListener('click', function (e) {
        e.preventDefault();
        editNotesModal.show();
    });

    // Save Note button - POST to /cars/<car_id>/note 
    saveNoteBtn.addEventListener('click', function (e) {
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
    backBtn.addEventListener('click', function () {
        window.location.href = `/cars`;
    });

    // Delete button
    deleteBtn.addEventListener('click', function () {
        if (confirm('Are you sure you want to delete this car?')) {
            // Handle delete logic
            window.location.href = `/cars/${carId}/delete`;
        }
    });

    // Ask AI button
    askAiBtn.addEventListener('click', function () {
        aichatModal.show();
    });

    // Send chat message
    sendChatBtn.addEventListener('click', function () {
        const message = chatTextarea.value.trim();


        if (message) {
            // Add user message to chat
            addChatMessage(message, 'user');
            chatTextarea.value = '';

            // Add extra information to the prompt here (like car specs) so ChatGPT gives more accurate results
            let prompt = message

            // Send message to AI endpoint
            fetch(`/cars/${carId}/ai-chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: prompt
                })
            })
                .then(response => response.json())
                .then(data => {
                    // Add AI response to chat
                    addChatMessage(data.response, 'ai');
                })
                .catch(error => {
                    console.error('Error sending message:', error);
                    addChatMessage('Sorry, there was an error processing your message.', 'ai');
                });
        }
    });

    // Allow Enter to send message (Shift+Enter for new line)
    chatTextarea.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatBtn.click();
        }
    });

    // Helper function to add messages to chat
    function addChatMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `d-flex flex-row justify-content-${sender === 'user' ? 'end' : 'start'} mb-4`;

        if (sender === 'ai') {
            messageDiv.innerHTML = `
            <img src="../img/speccheck-tiny.png" alt="SpecCheck AI" style="width: 45px; height: 45px;">
            <div class="p-3 ms-3" style="border-radius: 15px; background-color: rgba(57, 192, 237, 0.2);">
                <p class="small mb-0">${message}</p>
            </div>
        `;
        } else {
            messageDiv.innerHTML = `
            <div class="p-3 me-3" style="border-radius: 15px; background-color: #f8f9fa;">
                <p class="small mb-0">${message}</p>
            </div>
        `;
        }

        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
});