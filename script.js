
document.addEventListener("DOMContentLoaded", function() {
    const ricerca = document.getElementById("ricerca-piatti");
    const pulsanteLingua = document.getElementById("cambia-lingua");
    const filtro = document.getElementById("seleziona-allergene");
    const messaggio = document.getElementById("messaggio-ricerca");
    const tornaSu = document.getElementById("torna-su");
    const piatti = document.querySelectorAll(".piatto");
    let lingua = "it";
    const traduzioni = {
        "Il piacere di stare a tavola": "The pleasure of dining together",
        "Sapori autentici, tradizione e convivialità": "Authentic flavours, tradition and togetherness",
        "SCOPRI IL MENÙ ↓": "DISCOVER THE MENU ↓",
        "Antipasti": "Appetizers",
        "Insalatone": "Salads",
        "Primi": "First courses",
        "Secondi": "Main courses",
        "Contorni": "Side dishes",
        "Pizze Rosse": "Tomato-based pizzas",
        "Pizze Bianche": "White pizzas",
        "Dolci": "Desserts",
        "Allergeni": "Allergens",
        "Escludi allergene:": "Exclude allergen:",
        "Nessuno": "None",
        "Glutine": "Gluten",
        "Crostacei": "Crustaceans",
        "Uova": "Eggs",
        "Pesce": "Fish",
        "Arachidi": "Peanuts",
        "Soia": "Soy",
        "Latte": "Milk",
        "Frutta a guscio": "Tree nuts",
        "Sedano": "Celery",
        "Senape": "Mustard",
        "Sesamo": "Sesame",
        "Solfiti": "Sulphites",
        "Lupini": "Lupins",
        "Molluschi": "Molluscs",
        "Consulta le informazioni sugli allergeni nella lingua che preferisci.": "Read the allergen information in your preferred language.",
        "* Prodotto surgelato all'origine.": "* Product originally frozen.",
        "Dove siamo": "Find us",
        "Contattaci": "Contact us",
        "Per info:": "For information:",
        "Per prenotazioni:": "For reservations:",
        "Seguici": "Follow us",
        "Carne alla griglia": "Grilled meat"
    };
    const elementiTraducibili = [];
    document.querySelectorAll("header .sottotitolo, header .frase-header, header .pulsante-menu, nav a, .filtro-allergeni label, #seleziona-allergene option, #legenda-allergeni .introduzione-allergeni, #legenda-allergeni .nota-surgelati, footer .footer-sottotitolo, footer h3, footer p").forEach(function(elemento) {
        const testo = elemento.textContent.trim().replace(/\s+/g, " ");
        let chiave = testo;
        let prefisso = "";
        if (elemento.tagName === "OPTION") {
            const parti = testo.match(/^(\d+\s*-\s*)(.*)$/);
            if (parti) {
                prefisso = parti[1];
                chiave = parti[2];
            }
        }
        if (traduzioni[chiave]) {
            elementiTraducibili.push({
                elemento: elemento,
                italiano: testo,
                inglese: prefisso + traduzioni[chiave]
            });
        }
    });
    document.querySelectorAll("main > section:not(#legenda-allergeni) > h2").forEach(function(titolo) {
        const parteInglese = titolo.querySelector(".inglese");
        if (!parteInglese) return;
        const parteItaliana = Array.from(titolo.childNodes).filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent).join("").trim();
        const testoInglese = parteInglese.textContent.replace(/^[\s•]+/, "").trim();
        const nodoItaliano = document.createElement("span");
        nodoItaliano.textContent = parteItaliana;
        titolo.replaceChildren(nodoItaliano, parteInglese);
        elementiTraducibili.push({
            elemento: nodoItaliano,
            italiano: parteItaliana,
            inglese: testoInglese
        });
        parteInglese.style.display = "none";
    });
    const titoloAllergeni = document.querySelector("#legenda-allergeni > h2");
    if (titoloAllergeni) {
        elementiTraducibili.push({
            elemento: titoloAllergeni,
            italiano: "Allergeni",
            inglese: "Allergens"
        });
    }
    const nomiAllergeni = document.querySelectorAll("#seleziona-allergene option");
    nomiAllergeni.forEach(function(opzione) {
        const originale = opzione.textContent.trim();
        const parti = originale.match(/^(\d+\s*-\s*)(.*)$/);
        if (!parti) return;
        const inglese = traduzioni[parti[2]];
        if (!inglese) return;
        if (!elementiTraducibili.some(t => t.elemento === opzione)) {
            elementiTraducibili.push({
                elemento: opzione,
                italiano: originale,
                inglese: parti[1] + inglese
            });
        }
    });
    const schedeLingua = document.querySelectorAll("#legenda-allergeni details.lingua-allergeni");
    function cambiaTestiPiatti() {
        piatti.forEach(function(piatto) {
            const info = piatto.querySelector(".info-piatto");
            if (!info) return;
            const titoloIT = info.querySelector(":scope > h3");
            const titoloEN = info.querySelector(":scope > .titolo-inglese");
            const descrizioneIT = info.querySelector(":scope > .descrizione");
            const descrizioneEN = info.querySelector(":scope > .inglese");
            if (titoloIT && titoloEN) {
                const allergeni = titoloIT.querySelector(".numeri-allergeni");
                if (allergeni && !titoloEN.querySelector(".numeri-allergeni")) {
                    titoloEN.appendChild(allergeni.cloneNode(true));
                }
                titoloIT.style.display = lingua === "it" ? "" : "none";
                titoloEN.style.display = lingua === "en" ? "" : "none";
            }
            if (descrizioneIT && descrizioneEN) {
                descrizioneIT.style.display = lingua === "it" ? "" : "none";
                descrizioneEN.style.display = lingua === "en" ? "" : "none";
            }
            info.querySelectorAll(".tipo-carne").forEach(function(tipo) {
                const nomeIT = tipo.querySelector("h4");
                const nomeEN = tipo.querySelector(".titolo-inglese");
                if (nomeIT && nomeEN) {
                    nomeIT.style.display = lingua === "it" ? "" : "none";
                    nomeEN.style.display = lingua === "en" ? "" : "none";
                }
            });
            if (!titoloEN && titoloIT && titoloIT.textContent.trim() === "Carne alla griglia") {
                titoloIT.textContent = lingua === "it" ? "Carne alla griglia" : "Grilled meat";
            }
        });
    }
    function cambiaLingua() {
        document.documentElement.lang = lingua;
        if (pulsanteLingua) pulsanteLingua.textContent = lingua === "it" ? "EN" : "IT";
        elementiTraducibili.forEach(function(traduzione) {
            traduzione.elemento.textContent = lingua === "it" ? traduzione.italiano : traduzione.inglese;
        });
        document.querySelectorAll("main > section:not(#legenda-allergeni) > h2").forEach(function(titolo) {
            const parteInglese = titolo.querySelector(".inglese");
            if (parteInglese) parteInglese.style.display = "none";
        });
        cambiaTestiPiatti();
        if (ricerca) ricerca.placeholder = lingua === "it" ? "Cerca un piatto..." : "Search for a dish...";
        if (messaggio) messaggio.textContent = lingua === "it" ? "Nessun piatto trovato." : "No dishes found.";
        if (tornaSu) tornaSu.setAttribute("aria-label", lingua === "it" ? "Torna all'inizio" : "Back to top");
        schedeLingua.forEach(function(scheda) {
            const codice = scheda.getAttribute("lang") || "it";
            scheda.style.display = codice === lingua ? "" : "none";
            scheda.open = codice === lingua;
        });
    }
    function filtraPiatti() {
        const testo = ricerca ? ricerca.value.toLowerCase().trim() : "";
        const allergene = filtro ? filtro.value : "";
        let trovati = 0;
        piatti.forEach(function(piatto) {
            const contenuto = piatto.textContent.toLowerCase();
            const corrisponde = contenuto.includes(testo);
            const dati = piatto.getAttribute("data-allergeni");
            const allergeni = dati ? dati.split(",").map(n => n.trim()) : [];
            const sconosciuti = !dati || dati === "da-verificare";
            const escluso = allergene !== "" && (sconosciuti || allergeni.includes(allergene));
            const visibile = corrisponde && !escluso;
            piatto.style.display = visibile ? "" : "none";
            if (visibile) trovati++;
        });
        if (messaggio) messaggio.hidden = trovati > 0;
    }
    if (pulsanteLingua) {
        pulsanteLingua.addEventListener("click", function() {
            lingua = lingua === "it" ? "en" : "it";
            cambiaLingua();
        });
    }
    if (ricerca) ricerca.addEventListener("input", filtraPiatti);
    if (filtro) filtro.addEventListener("change", filtraPiatti);
    if (tornaSu) {
        tornaSu.addEventListener("click", function() {
            window.scrollTo({top: 0, behavior: "smooth"});
        });
    }
    cambiaLingua();
    filtraPiatti();
});
