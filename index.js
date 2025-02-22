document.addEventListener("DOMContentLoaded", () => {
  const widget = document.querySelector("elevenlabs-convai");

  if (widget) {
    console.log("PromptUser tool initialized");

    widget.addEventListener("elevenlabs-convai:call", (event) => {
      event.detail.config.clientTools = {
        'show_form': ({ 'form_html': formHtml, 'form_css':formCss }) => {
          console.log("show_form called with:", { formHtml, formCss });
          return new Promise(resolve => {
            const existingForm = document.getElementById("vagu-form");
            if (existingForm) {
              existingForm.remove();
            }

            const form = document.createElement("form");
            form.id = "vagu-form";
            form.innerHTML = `
              <style>${formCss}</style>
              ${formHtml}
            `
          
            document.body.appendChild(form);
        
            const firstInput = form.querySelector("input");
            if (firstInput) firstInput.focus();

            form.onsubmit = (event) => {
              event.preventDefault();
          
              const formData = Object.fromEntries(new FormData(form));
          
              form.remove();
              console.log("show_form resolved with:", formData);
              resolve(formData);
            };
          });
        },
        'close_form': () => {
          console.log("close_form called");
          const form = document.getElementById("vagu-form");
          if (form) {
            form.remove();
          }
          console.log("close_form completed");
        },
        'get_form_state': () => {
          console.log("get_form_state called");
          const form = document.getElementById("vagu-form");
          if (!form) {
            console.log("get_form_state returned: null");
            return null;
          }

          const formData = JSON.stringify(Object.fromEntries(new FormData(form)));
          console.log("get_form_state returned:", formData);
          return formData;
        },

        promptUser: ({id, formHtml, formCss}) => {
          console.log("promptUser called with:", { id, formHtml, formCss });
          return new Promise((resolve) => {
            renderForm(id, formHtml, formCss, (values) => {
              console.log("promptUser onSubmit:", JSON.stringify(values));
              resolve(JSON.stringify(values));
            });
          });
        },
      };
    });
  }
});

function renderForm(id, formHtml, formCss, onSubmit) {
  console.log("renderForm called with:", { id, formHtml, formCss });

  const formId = `prompt-user-form-${id}`;
  let form = document.getElementById(formId);

  if (!form) {
    form = document.createElement("form");
    form.innerHTML = `
      <style>${formCss}</style>
      ${formHtml}
      <button type="submit">OK</button>
    `
  
    document.body.appendChild(form);

    const firstInput = form.querySelector("input");
    if (firstInput) firstInput.focus();
  }

  form.onsubmit = (event) => {
    event.preventDefault();

    const formData = Object.fromEntries(new FormData(form));

    form.remove();
    console.log("renderForm onSubmit called with:", formData);
    onSubmit(formData);
  };

  console.log("renderForm completed");
}
