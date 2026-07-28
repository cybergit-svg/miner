let links = [];

function addCopyButtons() {
  const selectors = [
    'ytd-rich-item-renderer',           // Home e ricerca
    'ytd-compact-video-renderer',       // In coda / Video correlati
    'ytd-video-renderer',               // Risultati ricerca e canali
    'ytd-grid-video-renderer',          // Griglia canali
    'ytd-playlist-video-renderer',      // Dentro le playlist
    'ytd-playlist-panel-video-renderer' // Playlist in riproduzione / coda
  ];

  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(video => {
      if (video.querySelector('.multi-copy-btn')) return;

      const button = document.createElement('button');
      button.className = 'multi-copy-btn';
      button.innerHTML = '📋';
      button.style.cssText = `
        display: block;
        margin: 6px auto 10px auto;
        padding: 5px 12px;
        background-color: #cc0000;
        color: white;
        border: none;
        border-radius: 18px;
        cursor: pointer;
        font-size: 12.5px;
        font-weight: bold;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        width: fit-content;
      `;

      button.title = "Aggiungi questo video alla lista (Ctrl+P per copiare)";

      button.addEventListener('click', (e) => {
        e.stopImmediatePropagation();
        e.preventDefault();

        const linkElement = video.querySelector('a#thumbnail, a[href*="/watch"], a[href*="/playlist"]');
        if (linkElement) {
          let url = linkElement.href;
          if (!url.startsWith('http')) url = 'https://www.youtube.com' + url;

          if (!links.includes(url)) {
            links.push(url);
            button.style.backgroundColor = '#008800';
            button.innerHTML = '✅';
            setTimeout(() => {
              button.style.backgroundColor = '#cc0000';
              button.innerHTML = '📋';
            }, 900);
            console.log('✅ Aggiunto:', url);
          }
        }
      });

      // Inserisce il pulsante nella zona sotto la miniatura
      const metaArea = video.querySelector('#meta, #content, .metadata, ytd-video-meta-block');
      if (metaArea) {
        metaArea.insertAdjacentElement('afterbegin', button);
      } else {
        video.appendChild(button);
      }
    });
  });
}

// Ctrl + P per copiare
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'p') {
    e.preventDefault();
    if (links.length === 0) return alert("Nessun link salvato!");
    
    navigator.clipboard.writeText(links.join(' '));
    alert(`${links.length} link copiati negli appunti!`);
  }
});

// Avvio multiplo + Observer
setTimeout(addCopyButtons, 800);
setTimeout(addCopyButtons, 2500);
setTimeout(addCopyButtons, 5000);

const observer = new MutationObserver(addCopyButtons);
observer.observe(document.body, { childList: true, subtree: true });

console.log('🚀 Pulsante sotto ogni video - Versione estesa');