document.addEventListener("DOMContentLoaded", () => {
  const widget = document.querySelector("elevenlabs-convai");

  if (widget) {
    console.log("PromptUser tool initialized");

    widget.addEventListener("elevenlabs-convai:call", (event) => {
      event.detail.config.clientTools = {
        'show_form': ({ 'form_html': formHtml, 'form_css':formCss }) => new Promise(resolve => {
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
            resolve(formData);
          };
        }),
        'close_form': () => {
          const form = document.getElementById("vagu-form");
          if (form) {
            form.remove();
          }
        },
        'get_form_state': () => {
          const form = document.getElementById("vagu-form");
          if (!form) {
            return null;
          }

          return Object.fromEntries(new FormData(form));
        },

        // TODO: use original tool name
        promptUser: ({id, formHtml, formCss}) => {
          return new Promise((resolve) => {
            renderForm(id, formHtml, formCss, (values) => {
              console.log("onSubmit", JSON.stringify(values));
              resolve(JSON.stringify(values));
            });
          });
        },
      };
    });
  }
});

function renderForm(id, formHtml, formCss, onSubmit) {
  console.log("renderForm", id);
  console.log("formHtml", formHtml);
  console.log("formCss", formCss);

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
    onSubmit(formData);
  };
}
