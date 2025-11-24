const chatTextarea = document.getElementById('chatTextarea');
const sendChatBtn = document.getElementById('sendChatBtn');
const chatBody = document.getElementById('chatBody');

// Ask AI > Send chat message
sendChatBtn.addEventListener('click', async function () {
    const message = chatTextarea.value.trim();
    if (message) {
        // Add user message to chat
        addChatMessage(message, 'user');
        chatTextarea.value = '';

        // Add extra information to the prompt here (like car specs),
        // so ChatGPT gives more accurate results
        let prompt = message

        try {
            const response = await fetch("/ai_processor", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, carInfo : carDataString, liveCarInfo : liveCarDataString })
            });
            
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            // Add AI response to chat
            addChatMessage(data.gpt_response, 'ai');
        } catch (error) {
            console.error('Error sending message:', error);
            addChatMessage(`Sorry, there was an error processing your message: ${error.message}`, 'ai');
        }
    }
});

// Ask AI > Allow Enter to send message (Shift+Enter for new line)
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
