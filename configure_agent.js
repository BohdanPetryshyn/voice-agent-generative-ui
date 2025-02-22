const agent = {
  "name": "Support agent",
  "conversation_config": {
    "agent": {
      "prompt": {
        "prompt": "You are a support agent named Eric. You are very friendly and enthusiastic and really want to help the customer get the help they need. Answer in 3 to 7 sentences in most cases.",
        "llm": "gemini-2.0-flash-001",
        "temperature": 0.5,
        "max_tokens": -1,
        "tools": [
          {
            "type": "system",
            "name": "end_call",
            "description": ""
          }
        ],
        "tool_ids": [
          "id32Q6dj9EOHEOJQ9scg"
        ],
        "knowledge_base": [],
        "knowledge_base_document_ids": [],
        "custom_llm": null
      },
      "first_message": "Hi, I'm Eric. How can I help you today?",
      "language": "en",
      "dynamic_variables": {
        "dynamic_variable_placeholders": {}
      }
    },
    "asr": {
      "quality": "high",
      "provider": "elevenlabs",
      "user_input_audio_format": "pcm_16000",
      "keywords": []
    },
    "turn": {
      "turn_timeout": 7,
      "mode": "turn"
    },
    "tts": {
      "model_id": "eleven_flash_v2",
      "voice_id": "cjVigY5qzO86Huf0OWal",
      "agent_output_audio_format": "pcm_16000",
      "optimize_streaming_latency": 3,
      "stability": 0.5,
      "similarity_boost": 0.8,
      "pronunciation_dictionary_locators": []
    },
    "conversation": {
      "max_duration_seconds": 300,
      "client_events": [
        "audio",
        "interruption",
        "user_transcript",
        "agent_response",
        "agent_response_correction"
      ]
    },
    "language_presets": {}
  },
  "platform_settings": {
    "auth": {
      "enable_auth": false,
      "allowlist": [],
      "shareable_token": null
    },
    "evaluation": {
      "criteria": []
    },
    "widget": {
      "variant": "full",
      "expandable": "never",
      "avatar": {
        "type": "orb",
        "color_1": "#6DB035",
        "color_2": "#F5CABB"
      },
      "feedback_mode": "during",
      "bg_color": "#ffffff",
      "text_color": "#000000",
      "btn_color": "#000000",
      "btn_text_color": "#ffffff",
      "border_color": "#e1e1e1",
      "focus_color": "#000000",
      "border_radius": null,
      "btn_radius": null,
      "action_text": null,
      "start_call_text": null,
      "end_call_text": null,
      "expand_text": null,
      "listening_text": null,
      "speaking_text": null,
      "shareable_page_text": null,
      "terms_text": "#### Terms and conditions\n\nBy clicking \"Agree,\" and each time I interact with this AI agent, I consent to the recording, storage, and sharing of my communications with third-party service providers, and as described in the Privacy Policy.\nIf you do not wish to have your conversations recorded, please refrain from using this service.",
      "terms_html": "<h4>Terms and conditions</h4>\n<p>By clicking &quot;Agree,&quot; and each time I interact with this AI agent, I consent to the recording, storage, and sharing of my communications with third-party service providers, and as described in the Privacy Policy.\nIf you do not wish to have your conversations recorded, please refrain from using this service.</p>\n",
      "terms_key": null,
      "show_avatar_when_collapsed": true,
      "disable_banner": false,
      "language_selector": false,
      "custom_avatar_path": null
    },
    "data_collection": {},
    "overrides": {
      "conversation_config_override": {
        "agent": {
          "prompt": {
            "prompt": false
          },
          "first_message": false,
          "language": false
        },
        "tts": {
          "voice_id": false
        }
      },
      "custom_llm_extra_body": false,
      "enable_conversation_initiation_client_data_from_webhook": false
    },
    "call_limits": {
      "agent_concurrency_limit": -1,
      "daily_limit": 100000
    },
    "ban": null,
    "privacy": {
      "record_voice": true,
      "retention_days": 730,
      "delete_transcript_and_pii": true,
      "delete_audio": true,
      "apply_to_existing_conversations": false
    },
    "safety": {
      "is_blocked_ivc": false,
      "is_blocked_non_ivc": false
    }
  }
};

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
