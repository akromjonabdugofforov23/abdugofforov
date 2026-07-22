// ===== 3. DUNYO BO'YLAB INTERAKTIV SAYOHAT XARITASI (VIZASIZ & HAMYONBOP TABIAT) =====
(function() {
    const WORLD_DESTINATIONS = [
        { id: "issyk_kul", name: "Issiqko'l (Qirg'iziston)", tag: "🏔️ Vizasiz & Hamyonbop Ko'l", img: "images/schwarzwald.webp", desc: "Tien-Shan tog'lari bag'ridagi zumrad dek musaffo issiq ko'l. Hamyonbop va vizasiz sayohat!" },
        { id: "fann_mountains", name: "Fann Tog'lari (Tojikiston)", tag: "🌊 Vizasiz Mo'jizaviy Tog'lar", img: "images/zugspitze.webp", desc: "Iskandarko'l va zangori ko'llar vodiysi. Arzon va vizasiz tabiat maskani." },
        { id: "antalya", name: "Antalya va Kemer (Turkiya)", tag: "🏖️ 90 kun Vizasiz Dengiz", img: "images/rheintal.webp", desc: "O'rta yer dengizining firuza ko'rfazlari, ulug'vor Toros tog'lari va vizasiz qulaylik." },
        { id: "batumi", name: "Batumi va Kavkaz (Gruziya)", tag: "🌴 Vizasiz Qora Dengiz", img: "images/heidelberg_hq.png", desc: "Qora dengiz va Kavkaz tog'larining ajoyib uyg'unligi. Vizasiz va arzon taomlar." },
        { id: "dubai", name: "Dubay va BAA (BAA)", tag: "🏜️ 30 kun Vizasiz Voha", img: "images/rothenburg.webp", desc: "O'zbekiston fuqarolari uchun 30 kunlik vizasiz rejim! Fors ko'rfazi va zamonaviy shahar." },
        { id: "shahdag", name: "Shahdag (Ozarbayjon)", tag: "🏔️ Vizasiz Kaspiy va Tog'", img: "images/koelner-dom.webp", desc: "Kaspiy dengizi va Shahdag tog' kurorti. Vizasiz hamda budjetbop hordiq." },
        { id: "kolsai", name: "Kolsay Ko'llari (Qozog'iston)", tag: "🌲 Vizasiz Alp Tabiati", img: "images/neuschwanstein.webp", desc: "Olmaota yaqinidagi Alplarga teng mo'jizaviy tog' ko'llari va toza havo." },
        { id: "halong", name: "Halong Bay va Phu Quoc (Vyetnam)", tag: "🏖️ Oson E-Viza Tropik Dengiz", img: "images/hamburg.webp", desc: "3 kunda online e-viza! Ekzotik okean qirg'oqlari va juda arzon mevalar hamda tabiat." }
    ];

    window.renderGermanyMapSection = function() {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        let section = document.getElementById('germany-map-section');
        if (!section) {
            section = document.createElement('section');
            section.id = 'germany-map-section';
            section.className = 'germany-map-section';
            
            const toolbar = mainContent.querySelector('.toolbar');
            if (toolbar && toolbar.nextSibling) {
                mainContent.insertBefore(section, toolbar.nextSibling);
            } else {
                mainContent.appendChild(section);
            }
        }

        const cardsHTML = WORLD_DESTINATIONS.map(c => `
            <div class="city-exploration-card" onclick="openCityModal('${c.id}')">
                <img src="${c.img}" alt="${c.name}" class="city-card-img" loading="lazy">
                <div class="city-card-content">
                    <div class="city-card-name">${c.name}</div>
                    <div class="city-card-tag">${c.tag}</div>
                </div>
            </div>
        `).join('');

        section.innerHTML = `
            <h3 class="germany-map-title">🌍 Dunyo Bo'ylab Interaktiv Sayohat Xaritasi</h3>
            <p class="germany-map-sub">O'zbekiston fuqarolari uchun vizasiz, hamyonbop va eng go'zal tabiat maskanlari!</p>
            <div class="germany-cities-grid">${cardsHTML}</div>
        `;
    };

    window.openCityModal = function(id) {
        const item = WORLD_DESTINATIONS.find(c => c.id === id);
        if (!item) return;
        
        if (typeof showToast === 'function') {
            showToast(`🏞️ ${item.name}: ${item.desc}`, 'info');
        }
        if (window.Gamification) Gamification.addXP(15);
    };

    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(renderGermanyMapSection, 300);
    });
})();
