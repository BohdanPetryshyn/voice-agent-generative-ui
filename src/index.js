import './styles.css';

// Debounce function to limit how often validation runs
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize the form functionality
function initConvaiForm() {
    const FORM_SHOW_CLASS = "convai-form-container-show";
    const widget = document.querySelector("elevenlabs-convai");

    if (!widget) {
        console.warn("ElevenLabs Conversational AI widget not found");
        return;
    }

    // Create the form element once
    const formContainer = document.createElement("div");
    formContainer.classList.add("convai-form-container");
    document.body.appendChild(formContainer);
    const form = document.createElement("form");
    formContainer.appendChild(form);

    // Function to render form fields
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

                if (field.value !== undefined) {
                    inputElement.value = field.value;
                }
            } else if (field.type === "textarea") {
                inputElement = document.createElement("textarea");
                inputElement.id = field.id;
                inputElement.name = field.id;

                if (field.rows) {
                    inputElement.rows = field.rows;
                }

                if (field.maxLength) {
                    inputElement.maxLength = field.maxLength;
                }

                if (field.value !== undefined) {
                    inputElement.value = field.value;
                }
            } else {
                inputElement = document.createElement("input");
                inputElement.id = field.id;
                inputElement.name = field.id;
                inputElement.type = field.type;

                if (field.placeholder) {
                    inputElement.placeholder = field.placeholder;
                }

                // Handle specific field types according to schema
                switch (field.type) {
                    case "text":
                        if (field.maxLength) {
                            inputElement.maxLength = field.maxLength;
                        }
                        break;
                    case "email":
                    case "tel":
                        if (field.pattern) {
                            inputElement.pattern = field.pattern;
                        }
                        break;
                    case "number":
                    case "date":
                    case "datetime-local":
                    case "time":
                        if (field.min !== undefined) {
                            inputElement.min = field.min;
                        }
                        if (field.max !== undefined) {
                            inputElement.max = field.max;
                        }
                        break;
                }

                if (field.value !== undefined) {
                    if (field.type === "number" && field.value === null) {
                        inputElement.value = "";
                    } else {
                        inputElement.value = field.value;
                    }
                }
            }

            // Add validation message element
            const validationMessage = document.createElement("div");
            validationMessage.classList.add("validation-message");

            // Create validation function
            const validateField = () => {
                if (!inputElement.validity.valid) {
                    let message = "";
                    if (inputElement.validity.valueMissing) {
                        message = "This field is required";
                    } else if (inputElement.validity.typeMismatch) {
                        switch(field.type) {
                            case "email":
                                message = "Please enter a valid email address";
                                break;
                            case "tel":
                                message = "Please enter a valid phone number";
                                break;
                            default:
                                message = `Please enter a valid ${field.type}`;
                        }
                    } else if (inputElement.validity.patternMismatch) {
                        switch(field.type) {
                            case "tel":
                                message = "Please enter a valid phone number format";
                                break;
                            case "email":
                                message = "Please enter a valid email format";
                                break;
                            default:
                                message = "Please match the requested format";
                        }
                    } else if (inputElement.validity.tooLong) {
                        message = `Please enter no more than ${inputElement.maxLength} characters`;
                    } else if (inputElement.validity.rangeUnderflow) {
                        switch(field.type) {
                            case "date":
                            case "datetime-local":
                                message = `Please select a date from ${field.min} onwards`;
                                break;
                            case "time":
                                message = `Please select a time from ${field.min} onwards`;
                                break;
                            default:
                                message = `Please enter a value greater than or equal to ${field.min}`;
                        }
                    } else if (inputElement.validity.rangeOverflow) {
                        switch(field.type) {
                            case "date":
                            case "datetime-local":
                                message = `Please select a date up to ${field.max}`;
                                break;
                            case "time":
                                message = `Please select a time up to ${field.max}`;
                                break;
                            default:
                                message = `Please enter a value less than or equal to ${field.max}`;
                        }
                    }
                    validationMessage.textContent = message;
                    inputElement.classList.add("invalid");
                } else {
                    validationMessage.textContent = "";
                    inputElement.classList.remove("invalid");
                }
            };

            // Debounce the validation with 500ms delay
            const debouncedValidate = debounce(validateField, 500);

            // Add input event listener for real-time validation
            inputElement.addEventListener("input", debouncedValidate);

            // Also validate on blur immediately (when user leaves the field)
            inputElement.addEventListener("blur", validateField);

            fieldWrapper.appendChild(inputElement);
            fieldWrapper.appendChild(validationMessage);
            form.appendChild(fieldWrapper);
        });
    }

    // Add event listener for widget initialization
    widget.addEventListener("elevenlabs-convai:call", (event) => {
        event.detail.config.clientTools = {
            'close_form': () => {
                console.log("close_form called");
                formContainer.classList.remove(FORM_SHOW_CLASS);
                setTimeout(() => form.innerHTML = '', 500);
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
                form.innerHTML = '';
                renderFormFields(JSON.parse(formSchema));
                formContainer.classList.add(FORM_SHOW_CLASS);
                return 'form_is_ready';
            },
        };
    });

    console.log("ElevenLabs Conversational AI Form extension initialized");
}

// Auto-initialize when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConvaiForm);
} else {
    initConvaiForm();
}

// Export for manual initialization if needed
export { initConvaiForm };
