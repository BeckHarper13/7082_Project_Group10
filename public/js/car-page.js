
// Get elements
const editBtn = document.getElementById('editBtn');
const backBtn = document.getElementById('backBtn');
const deleteCarModalBtn = document.getElementById('deleteCarModalBtn');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const askAiBtn = document.getElementById('askAiBtn');
const notesTextarea = document.getElementById('notesTextarea');
const notesDisplay = document.getElementById('notesDisplay');
let deleteCarBtn = null;

// ENSURE THAT THERE ARE NO HYPHENS IN CAR DATA OR LIVE CAR DATA
const carDataString = carData.replace(/&#34;|-/g,"")
const carDataJSON = carDataString
    .replace(/([{,])(\s*)([A-Za-z0-9_]+)(\s*):/g, '$1"$3":') // wrap keys in quotes
    .replace(/:([A-Za-z_][A-Za-z0-9_]*)/g, ':"$1"');         // wrap string values
const liveCarDataString = liveCarData.replace(/&#34;|-/g,"")
const liveCarDataJSON = liveCarDataString
    .replace(/([{,])(\s*)([A-Za-z0-9_]+)(\s*):/g, '$1"$3":') // wrap keys in quotes
    .replace(/:([A-Za-z_][A-Za-z0-9_]*)/g, ':"$1"');         // wrap string values

// Edit button
editBtn.addEventListener('click', function (e) {
    editNotesModal.show();
});

// Back button
backBtn.addEventListener('click', () => {
    window.location.href = document.referrer;
});

// Delete button
deleteCarModalBtn.addEventListener('click', () => {
    document.getElementById("backToAccountBtn").hidden = true;
    if (deleteCarBtn == null) {
        deleteCarBtn = document.getElementById("deleteCarBtn");
            deleteCarBtn.addEventListener('click', async () => {
            document.getElementById("responseText").innerHTML = "Deleting car...";
            const res = await fetch('/delete-car', {
                method: 'POST',
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({carId : carId})
              });
            if (res.ok) {
                document.getElementById("responseText").innerHTML = "Car deleted!";
                document.getElementById("deleteCarBtn").hidden = true;
                document.getElementById("cancelBtn").hidden = true;
                const backToAccountBtn = document.getElementById("backToAccountBtn"); 
                backToAccountBtn.hidden = false;
                backToAccountBtn.addEventListener("click", () => {
                    window.location.href = "/account";
                })
            } else {
                const data = await res.json(); // get error message from backend
                document.getElementById("responseText").innerText = data.error || "Something went wrong.";
            }
        })
    }
});

saveNoteBtn.onclick = async () => {
  const updatedNotes = notesTextarea.value;


  try {
    const res = await fetch(`/car/${carId}/note`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: updatedNotes })
    });

    if (!res.ok) {
      alert("Error saving notes!");
      return;
    }
    
    bootstrap.Modal.getInstance(document.getElementById('editNotesModal')).hide();

    // Update display on page
    notesDisplay.innerText = updatedNotes;

    //document.querySelector(".usable-notes-text").innerText = updatedNotes;
  } catch (err) {
    console.error("Save notes failed:", err);
    alert("Failed to connect to server.");
  }
};