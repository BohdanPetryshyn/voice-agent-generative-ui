document.addEventListener("DOMContentLoaded", () => {
  const widget = document.querySelector("elevenlabs-convai");

  if (widget) {
    console.log("PromptUser tool initialized");

    widget.addEventListener("elevenlabs-convai:call", (event) => {
      event.detail.config.clientTools = {
        'close_form': () => {
          console.log("close_form called");
          const form = document.querySelector("form#nasha-forma");
          if (form) {
            form.remove();
          }
          console.log("close_form completed");
        },
        'get_form_state': () => {
          console.log("get_form_state called");
          const form = document.querySelector("form#nasha-forma");
          if (!form) {
            console.log("get_form_state returned: null");
            return 'There is no form to get state from.';
          }

          const formData = JSON.stringify(Object.fromEntries(new FormData(form)));
          console.log("get_form_state returned:", formData);
          return formData;
        },
        'create_form': ({ formSchema }) => {
          console.log("create_form called with:", formSchema);
          renderForm(JSON.parse(formSchema));
          return 'form_is_ready';
        },
      };
    });
  }
});


function renderForm(formSchema) {
  const form = document.createElement("form");
  form.id = "nasha-forma";

  formSchema.fields.forEach(field => {
      // Skip adding the field if it's marked as hidden
      if (field.hidden === true) {
          console.log(`Skipping hidden field: ${field.id}`);
          return;
      }

      const fieldWrapper = document.createElement("div");
      fieldWrapper.classList.add("form-group");

      const label = document.createElement("label");
      label.textContent = field.label;
      label.setAttribute("for", field.id);
      fieldWrapper.appendChild(label);

      let inputElement;

      if (field.type === "select") {
          inputElement = document.createElement("select");
          inputElement.id = field.id;
          inputElement.name = field.id;

          field.options.forEach(option => {
              const optionElement = document.createElement("option");
              optionElement.value = option.value;
              optionElement.textContent = option.label;
              inputElement.appendChild(optionElement);
          });

          // Set the pre-selected value if it exists
          if (field.value !== undefined) {
              inputElement.value = field.value;
          }
      } else if (field.type === "textarea") {
          inputElement = document.createElement("textarea");
          inputElement.id = field.id;
          inputElement.name = field.id;
          
          // Set the pre-filled text content if it exists
          if (field.value !== undefined) {
              inputElement.value = field.value;
          }
      } else {
          inputElement = document.createElement("input");
          inputElement.id = field.id;
          inputElement.name = field.id;
          inputElement.type = field.type || "text";

          if (field.validation) {
              if (field.validation.pattern) {
                  inputElement.pattern = field.validation.pattern;
              }
              if (field.validation.min !== undefined) {
                  inputElement.min = field.validation.min;
              }
              if (field.validation.max !== undefined) {
                  inputElement.max = field.validation.max;
              }
          }

          // Set the pre-filled value if it exists
          if (field.value !== undefined) {
              // For number inputs, we need to handle null value specially
              if (field.type === "number" && field.value === null) {
                  inputElement.value = "";
              } else {
                  inputElement.value = field.value;
              }
          }
      }

      fieldWrapper.appendChild(inputElement);
      form.appendChild(fieldWrapper);
  });

  document.body.appendChild(form);
}