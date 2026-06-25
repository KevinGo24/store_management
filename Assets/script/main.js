import '../Css/style.css'

window.addEventListener('hashchange', () => {
    // Le pasamos el nuevo hash modificado
    enreutanamiento(window.location.hash);
});
