const agent = require("./agent.json");
const API_KEY = process.env.ELEVENLABS_API_KEY;
const agentToUpdate = process.argv[2];

(async () => {

  if (agentToUpdate) {
    const resp = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${agentToUpdate}`, {
      method: "PATCH",
      headers: {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(agent),
    });

    const result = await resp.json();

    if (resp.status === 200) {
      console.log("Agent has been successfully updated");
    } else {
      console.log("Failed to update an agent", result);
    }
  } else {
    const resp = await fetch("https://api.elevenlabs.io/v1/convai/agents/create", {
      method: "POST",
      headers: {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(agent),
    });
    const result = await resp.json();

    if (resp.status === 200) {
      console.log("Agent has been successfully created");
    } else {
      console.log("Failed to create an agent", result);
    }
  }
})();
