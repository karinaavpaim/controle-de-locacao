const name = '_blank';
const specs = ['fullscreen=yes','titlebar=yes', 'scrollbars=yes'];
const replace = true;
const url = window.location.origin;

/*
* Plugin criado por weberson.dsn.erp para impressão de modo geral.
* Esse plugin utiliza como base o css do tinymce para utilizar o mesmo layout que o
* EditorTinymceBimer.vue utiliza no editor.
*/
async function imprimir(title, htmlBody){

  htmlBody = substituirPorQuebraDePagina(htmlBody);

  const win = window.open(url, name, specs, replace);
  return new Promise((resolve, reject) => {
    try {
      win.document.write(`
        <html>
          <head>
            <link rel="stylesheet" href="${url}/skins/ui/oxide/content.min.css">
            <link rel="stylesheet" href="${url}/skins/content/default/content.css">
            <title>${title}</title>
          </head>
          <body>
            ${htmlBody}
          </body>
        </html>
      `);

      setTimeout(() => {
        win.document.close();
        win.focus();
        win.print();
        win.close();

        return resolve();
      }, 1000);  

    } catch (e) {
      return reject("O bloqueador de Pop-ups está habilitado \nAdicione este site à sua lista de exceções para que seja possível imprimir relatórios.");
    }
  })
}

function substituirPorQuebraDePagina(htmlBody){
  return htmlBody.replace(/<!-- pagebreak -->/g,
    `<img style="
      cursor: default;
      display: block;
      height: 0px;
      page-break-before: always;
      width: 100%;" 
      src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    >`
  );
}

export default  { imprimir }