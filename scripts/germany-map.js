// ===== 3. INTERACTIVE GERMANY EXPLORATION MAP & CITY GUIDE =====
(function() {
    const GERMAN_CITIES = [
        { id: "berlin", name: "Berlin", tag: "🏛️ Poytaxt va Tarix", img: "images/berlin.webp", desc: "Germaniya poytaxti, Brandenburg darvozasi va madaniyat o'chog'i." },
        { id: "koln", name: "Köln", tag: "⛪ Kölner Dom", img: "images/koeln.webp", desc: "800 yillik mo'jizaviy ibodatxona va Reynga tutashgan shahardir." },
        { id: "hamburg", name: "Hamburg", tag: "⚓ Shimol Darvozasi", img: "images/hamburg.webp", desc: "Germaniyaning eng yirik dengiz porti va Elbphilharmonie saroyi." },
        { id: "heidelberg", name: "Heidelberg", tag: "💖 Romantika Qasri", img: "images/heidelberg_hq.png", desc: "Sehrli Neckar daryosi va eng qadimiy universitet shahri." },
        { id: "schwarzwald", name: "Schwarzwald", tag: "🌲 Qora O'rmon", img: "images/schwarzwald.webp", desc: "Aka-uka Grimmlar ertaklaridagi sirlarga boy go'zal tabiati." },
        { id: "rothenburg", name: "Rothenburg", tag: "🕰️ O'rta Asr Mojizasi", img: "images/rothenburg.webp", desc: "Vaqt to'xtab qolgan ertaknamo nemis shaharchasi." },
        { id: "zugspitze", name: "Zugspitze", tag: "🏔️ Alplar Cho'qqisi", img: "images/zugspitze.webp", desc: "Germaniyaning eng baland 2,962 metrlik tog' cho'qqisi." },
        { id: "rheintal", name: "Rheintal", tag: "🏰 Qal'alar Vodiysi", img: "images/rheintal.webp", desc: "Uzum dalalari va Reyn daryosi bo'yidagi qadimiy qal'alar." }
    ];

    window.renderGermanyMapSection = function() {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        let section = document.getElementById('germany-map-section');
        if (!section) {
            section = document.createElement('section');
            section.id = 'germany-map-section';
            section.className = 'germany-map-section';
            mainContent.insertBefore(section, mainContent.firstChild);
        }

        const cardsHTML = GERMAN_CITIES.map(c => `
            <div class="city-exploration-card" onclick="openCityModal('${c.id}')">
                <img src="${c.img}" alt="${c.name}" class="city-card-img" loading="lazy">
                <div class="city-card-content">
                    <div class="city-card-name">${c.name}</div>
                    <div class="city-card-tag">${c.tag}</div>
                </div>
            </div>
        `).join('');

        section.innerHTML = `
            <h3 class="germany-map-title">🇩🇪 Germaniya Bo'ylab Interaktiv Sayohat</h3>
            <p class="germany-map-sub">Nemis madaniyati va eng go'zal joylari bilan tanishing!</p>
            <div class="germany-cities-grid">${cardsHTML}</div>
        `;
    };

    window.openCityModal = function(id) {
        const city = GERMAN_CITIES.find(c => c.id === id);
        if (!city) return;
        
        if (typeof openLightbox === 'function') {
            openLightbox(city.img);
        } else if (typeof showToast === 'function') {
            showToast(`🏰 ${city.name}: ${city.desc}`, 'info');
        }
        if (window.Gamification) Gamification.addXP(15);
    };

    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(renderGermanyMapSection, 500);
    });
})();
