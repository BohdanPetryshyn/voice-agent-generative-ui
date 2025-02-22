const fs = require("node:fs/promises");
const API_KEY = process.env.ELEVENLABS_API_KEY;
const agentId = process.argv[2];

(async () => {
  const response = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${agentId}`, {
    method: "GET",
    headers: {
      "xi-api-key": API_KEY
    },
  });
  const agent = await response.json();

  if (response.status === 200) {
    await fs.writeFile(
      "./agent.json",
      JSON.stringify({
        "conversation_config": agent["conversation_config"],
        "platform_settings": agent["platform_settings"],
        "name": agent["name"]
      }, null, 2),
      "utf8"
    );
    console.log("Agent config has been successfully downloaded");
  } else {
    console.error("Failed to download config", agent);
  }

})();
