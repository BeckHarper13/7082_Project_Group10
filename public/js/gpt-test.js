document.getElementById("prompt-button").addEventListener("click", async () => {
  document.getElementById("gpt-output").innerHTML = "Generating response...";    
  const res = await fetch('/ai_processor', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({prompt: document.getElementById("prompt").value})
  });
    
  const gpt_res = await res.json();

  document.getElementById("gpt-output").innerHTML = gpt_res.gpt_response;
});
