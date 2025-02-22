const FORM_SHOW_CLASS = "convai-form-container-show";
document.addEventListener("DOMContentLoaded", () => {
    const widget = document.querySelector("elevenlabs-convai");

    // Create the form element once
    const formContainer = document.createElement("div");
    formContainer.classList.add("convai-form-container");
    document.body.appendChild(formContainer);
    const form = document.createElement("form");
    formContainer.appendChild(form);
    // Function to render form fields - now has access to form variable from closure
    function renderFormFields(formSchema) {
        formSchema.fields.forEach(field => {
            // Skip adding the field if it's marked as hidden
            if (field.hidden === true) {
                console.log(`Skipping hidden field: ${field.id}`);
                return;
            }

            const fieldWrapper = document.createElement("div");
            fieldWrapper.classList.add("input-group");

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
    }

    if (widget) {
        console.log("PromptUser tool initialized");

        widget.addEventListener("elevenlabs-convai:call", (event) => {


            event.detail.config.clientTools = {
                'close_form': () => {
                    console.log("close_form called");

                    formContainer.classList.remove(FORM_SHOW_CLASS)
                    setTimeout(() => form.innerHTML = '', 500)
                    
                    console.log("close_form completed");
                },
                'get_form_state': () => {
                    console.log("get_form_state called");
                    if (!form.firstChild) {
                        return 'There is no form to get state from.';
                    }

                    const formData = JSON.stringify(Object.fromEntries(new FormData(form)));
                    console.log("get_form_state returned:", formData);
                    return formData;
                },
                'create_or_update_form': ({ formSchema }) => {
                    console.log("create_or_update_form called with:", formSchema);
                    // Clear existing form contents
                    form.innerHTML = '';
                    
                    // Render new form contents
                    renderFormFields(JSON.parse(formSchema));
                    formContainer.classList.add(FORM_SHOW_CLASS);

                    return 'form_is_ready';
                },
            };
        });
    }
});