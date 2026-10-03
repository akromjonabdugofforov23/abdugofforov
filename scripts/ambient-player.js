/**
 * ============================================================
 * ABDUGOFFOROV — AMBIENT FOCUS AUDIO PLAYER
 * Pure Web Audio API Synthesis — 100% Offline, Zero MP3 Downloads
 * Features:
 *   1. 🌧️ "Yomg'ir" (Rain: Filtered pink/brown noise + random raindrops)
 *   2. ☕ "Fokus / Kafe" (Warm velvety brown noise + acoustic resonance)
 *   3. 🌌 "Koinot & Meditatsiya" (Harmonic multi-oscillator binaural drone)
 * ============================================================
 */

(function () {
    'use strict';

    // Prevent duplicate initialization
    if (window.__AbduAmbientPlayerInitialized) return;
    window.__AbduAmbientPlayerInitialized = true;

    // Storage keys
    const STORAGE_KEY_VOL = 'abdu_ambient_volume';
    const STORAGE_KEY_PRESET = 'abdu_ambient_preset';
    const STORAGE_KEY_COLLAPSED = 'abdu_ambient_collapsed';

    // State
    const state = {
        isPlaying: false,
        preset: localStorage.getItem(STORAGE_KEY_PRESET) || 'rain',
        volume: parseFloat(localStorage.getItem(STORAGE_KEY_VOL) ?? '0.5'),
        isCollapsed: localStorage.getItem(STORAGE_KEY_COLLAPSED) === 'true',
        isMuted: false,
        prevVolume: 0.5
    };

    // Audio context & nodes
    let audioCtx = null;
    let masterGain = null;
    let analyserNode = null;
    let currentPresetNodes = null;
    let rainDropTimer = null;
    let visualizerAnimFrame = null;
    let cachedPinkBuffer = null;
    let cachedBrownBuffer = null;

    // Presets definition
    const PRESETS = [
        { id: 'rain', name: "Yomg'ir", emoji: '🌧️', title: "Yomg'ir & Tomchilar" },
        { id: 'focus', name: 'Fokus', emoji: '☕', title: 'Iliq Qahvaxona & Fokus' },
        { id: 'cosmic', name: 'Koinot', emoji: '🌌', title: 'Koinot & Meditatsiya' }
    ];

    /**
     * Ensure CSS is loaded
     */
    function ensureStylesLoaded() {
        if (document.querySelector('link[href*="ambient-player.css"]')) return;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/ambient-player.css';
        document.head.appendChild(link);
    }

    /**
     * Lazy init AudioContext
     */
    function initAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return null;
            audioCtx = new AudioContextClass();

            // Master Gain Node
            masterGain = audioCtx.createGain();
            masterGain.gain.setValueAtTime(state.volume, audioCtx.currentTime);

            // Analyser for real-time equalizer
            analyserNode = audioCtx.createAnalyser();
            analyserNode.fftSize = 64;
            analyserNode.smoothingTimeConstant = 0.8;

            masterGain.connect(analyserNode);
            analyserNode.connect(audioCtx.destination);
        }
        return audioCtx;
    }

    /**
     * Noise Buffers Generation (Pink & Brown noise)
     */
    function getPinkNoiseBuffer(ctx) {
        if (cachedPinkBuffer) return cachedPinkBuffer;
        const bufferSize = ctx.sampleRate * 4;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
            b6 = white * 0.115926;
        }

        // Loop crossfade
        const fade = Math.floor(ctx.sampleRate * 0.04);
        for (let i = 0; i < fade; i++) {
            const r = i / fade;
            data[i] = data[i] * r + data[bufferSize - fade + i] * (1 - r);
        }

        cachedPinkBuffer = buffer;
        return buffer;
    }

    function getBrownNoiseBuffer(ctx) {
        if (cachedBrownBuffer) return cachedBrownBuffer;
        const bufferSize = ctx.sampleRate * 4;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            lastOut = (lastOut + (0.02 * white)) / 1.02;
            data[i] = lastOut * 3.4;
        }

        // Loop crossfade
        const fade = Math.floor(ctx.sampleRate * 0.04);
        for (let i = 0; i < fade; i++) {
            const r = i / fade;
            data[i] = data[i] * r + data[bufferSize - fade + i] * (1 - r);
        }

        cachedBrownBuffer = buffer;
        return buffer;
    }

    /**
     * Synthesizer: Preset 1 - Yomg'ir (Rain)
     */
    function createRainPreset(ctx, destination) {
        const nodesToCleanup = [];
        const presetGain = ctx.createGain();
        presetGain.gain.setValueAtTime(0.001, ctx.currentTime);
        presetGain.gain.exponentialRampToValueAtTime(1.0, ctx.currentTime + 0.3);
        presetGain.connect(destination);
        nodesToCleanup.push(presetGain);

        // 1. Continuous Rain Hiss (Pink Noise + Lowpass + Highpass)
        const pinkSrc = ctx.createBufferSource();
        pinkSrc.buffer = getPinkNoiseBuffer(ctx);
        pinkSrc.loop = true;

        const rainFilter = ctx.createBiquadFilter();
        rainFilter.type = 'lowpass';
        rainFilter.frequency.setValueAtTime(1200, ctx.currentTime);
        rainFilter.Q.setValueAtTime(0.7, ctx.currentTime);

        const rainHighPass = ctx.createBiquadFilter();
        rainHighPass.type = 'highpass';
        rainHighPass.frequency.setValueAtTime(280, ctx.currentTime);

        const rainGain = ctx.createGain();
        rainGain.gain.setValueAtTime(0.45, ctx.currentTime);

        pinkSrc.connect(rainFilter);
        rainFilter.connect(rainHighPass);
        rainHighPass.connect(rainGain);
        rainGain.connect(presetGain);

        pinkSrc.start(0);
        nodesToCleanup.push(pinkSrc, rainFilter, rainHighPass, rainGain);

        // 2. Distant Rain Hum (Brown Noise)
        const brownSrc = ctx.createBufferSource();
        brownSrc.buffer = getBrownNoiseBuffer(ctx);
        brownSrc.loop = true;

        const brownFilter = ctx.createBiquadFilter();
        brownFilter.type = 'lowpass';
        brownFilter.frequency.setValueAtTime(320, ctx.currentTime);

        const brownGain = ctx.createGain();
        brownGain.gain.setValueAtTime(0.35, ctx.currentTime);

        brownSrc.connect(brownFilter);
        brownFilter.connect(brownGain);
        brownGain.connect(presetGain);

        brownSrc.start(0);
        nodesToCleanup.push(brownSrc, brownFilter, brownGain);

        // 3. Dynamic Rain Drop Generator
        function triggerDrop() {
            if (!state.isPlaying || state.preset !== 'rain' || !ctx || ctx.state !== 'running') return;
            try {
                const now = ctx.currentTime;
                const osc = ctx.createOscillator();
                const dropGain = ctx.createGain();
                const duration = 0.04 + Math.random() * 0.05;
                const startFreq = 1600 + Math.random() * 900;
                const endFreq = 800 + Math.random() * 400;

                osc.type = Math.random() > 0.35 ? 'sine' : 'triangle';
                osc.frequency.setValueAtTime(startFreq, now);
                osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

                const peakGain = 0.015 + Math.random() * 0.025;
                dropGain.gain.setValueAtTime(0.0001, now);
                dropGain.gain.exponentialRampToValueAtTime(peakGain, now + 0.004);
                dropGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

                let connectionTarget = presetGain;
                let pannerNode = null;
                if (ctx.createStereoPanner) {
                    pannerNode = ctx.createStereoPanner();
                    pannerNode.pan.setValueAtTime(Math.random() * 1.6 - 0.8, now);
                    dropGain.connect(pannerNode);
                    pannerNode.connect(connectionTarget);
                } else {
                    dropGain.connect(connectionTarget);
                }

                osc.connect(dropGain);
                osc.start(now);
                osc.stop(now + duration + 0.02);

                osc.onended = () => {
                    try {
                        osc.disconnect();
                        dropGain.disconnect();
                        if (pannerNode) pannerNode.disconnect();
                    } catch (_) {}
                };
            } catch (_) {}

            // Schedule next drop with organic randomness
            const nextDropDelay = 70 + Math.random() * 220;
            rainDropTimer = setTimeout(triggerDrop, nextDropDelay);
        }

        // Kick off raindrops
        triggerDrop();

        return {
            gainNode: presetGain,
            cleanup: () => {
                if (rainDropTimer) {
                    clearTimeout(rainDropTimer);
                    rainDropTimer = null;
                }
                nodesToCleanup.forEach(node => {
                    try {
                        if (node.stop) node.stop();
                        node.disconnect();
                    } catch (_) {}
                });
            }
        };
    }

    /**
     * Synthesizer: Preset 2 - Fokus / Kafe (Warm Velvet Brown Noise)
     */
    function createFocusPreset(ctx, destination) {
        const nodesToCleanup = [];
        const presetGain = ctx.createGain();
        presetGain.gain.setValueAtTime(0.001, ctx.currentTime);
        presetGain.gain.exponentialRampToValueAtTime(1.0, ctx.currentTime + 0.3);
        presetGain.connect(destination);
        nodesToCleanup.push(presetGain);

        // Brown noise source
        const brownSrc = ctx.createBufferSource();
        brownSrc.buffer = getBrownNoiseBuffer(ctx);
        brownSrc.loop = true;

        // Warm lowpass filter
        const lowpass = ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.setValueAtTime(480, ctx.currentTime);
        lowpass.Q.setValueAtTime(1.2, ctx.currentTime);

        // Highpass filter to eliminate sub-rumble
        const highpass = ctx.createBiquadFilter();
        highpass.type = 'highpass';
        highpass.frequency.setValueAtTime(45, ctx.currentTime);

        // Slow organic breath LFO (0.1Hz) modulating lowpass frequency
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.09, ctx.currentTime);

        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(90, ctx.currentTime); // Filter cutoff modulation depth

        lfo.connect(lfoGain);
        lfoGain.connect(lowpass.frequency);

        const focusGain = ctx.createGain();
        focusGain.gain.setValueAtTime(0.68, ctx.currentTime);

        brownSrc.connect(highpass);
        highpass.connect(lowpass);
        lowpass.connect(focusGain);
        focusGain.connect(presetGain);

        brownSrc.start(0);
        lfo.start(0);

        nodesToCleanup.push(brownSrc, lfo, lfoGain, lowpass, highpass, focusGain);

        return {
            gainNode: presetGain,
            cleanup: () => {
                nodesToCleanup.forEach(node => {
                    try {
                        if (node.stop) node.stop();
                        node.disconnect();
                    } catch (_) {}
                });
            }
        };
    }

    /**
     * Synthesizer: Preset 3 - Koinot & Meditatsiya (Cosmic Harmonic Drone)
     */
    function createCosmicPreset(ctx, destination) {
        const nodesToCleanup = [];
        const presetGain = ctx.createGain();
        presetGain.gain.setValueAtTime(0.001, ctx.currentTime);
        presetGain.gain.exponentialRampToValueAtTime(1.0, ctx.currentTime + 0.4);
        presetGain.connect(destination);
        nodesToCleanup.push(presetGain);

        // Harmonic chord: F2, C3, F3, A3, C4, E4 (Lush Fmaj7 / Fmaj9)
        const voices = [
            { freq: 87.31, type: 'sine', detune: 0, gain: 0.28, pan: -0.2 },
            { freq: 130.81, type: 'triangle', detune: -4, gain: 0.18, pan: 0.2 },
            { freq: 174.61, type: 'sine', detune: 4, gain: 0.22, pan: -0.4 },
            { freq: 220.00, type: 'triangle', detune: -6, gain: 0.14, pan: 0.4 },
            { freq: 261.63, type: 'sine', detune: 5, gain: 0.12, pan: -0.1 },
            { freq: 329.63, type: 'triangle', detune: -3, gain: 0.08, pan: 0.1 }
        ];

        // Cosmic lowpass filter with slow sweeping LFO
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(580, ctx.currentTime);
        filter.Q.setValueAtTime(1.5, ctx.currentTime);

        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.06, ctx.currentTime); // 16s cycle

        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(180, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start(0);
        nodesToCleanup.push(lfo, lfoGain, filter);

        // Delay & Reverb effect
        const delay = ctx.createDelay();
        delay.delayTime.setValueAtTime(0.35, ctx.currentTime);

        const delayFeedback = ctx.createGain();
        delayFeedback.gain.setValueAtTime(0.32, ctx.currentTime);

        const delayFilter = ctx.createBiquadFilter();
        delayFilter.type = 'lowpass';
        delayFilter.frequency.setValueAtTime(1400, ctx.currentTime);

        delay.connect(delayFilter);
        delayFilter.connect(delayFeedback);
        delayFeedback.connect(delay);
        delayFilter.connect(presetGain);
        nodesToCleanup.push(delay, delayFeedback, delayFilter);

        // Create voice oscillators
        voices.forEach(voice => {
            const osc = ctx.createOscillator();
            osc.type = voice.type;
            osc.frequency.setValueAtTime(voice.freq, ctx.currentTime);
            osc.detune.setValueAtTime(voice.detune, ctx.currentTime);

            const vGain = ctx.createGain();
            vGain.gain.setValueAtTime(voice.gain, ctx.currentTime);

            let outNode = vGain;
            if (ctx.createStereoPanner) {
                const pan = ctx.createStereoPanner();
                pan.pan.setValueAtTime(voice.pan, ctx.currentTime);
                vGain.connect(pan);
                outNode = pan;
                nodesToCleanup.push(pan);
            }

            osc.connect(vGain);
            outNode.connect(filter);

            osc.start(0);
            nodesToCleanup.push(osc, vGain);
        });

        // Filter out to preset gain & delay
        filter.connect(presetGain);
        filter.connect(delay);

        return {
            gainNode: presetGain,
            cleanup: () => {
                nodesToCleanup.forEach(node => {
                    try {
                        if (node.stop) node.stop();
                        node.disconnect();
                    } catch (_) {}
                });
            }
        };
    }

    /**
     * Stop currently active preset with smooth fade out
     */
    function stopCurrentPreset(fadeSec = 0.2) {
        if (!currentPresetNodes) return;
        const current = currentPresetNodes;
        currentPresetNodes = null;

        if (rainDropTimer) {
            clearTimeout(rainDropTimer);
            rainDropTimer = null;
        }

        if (audioCtx && current.gainNode) {
            try {
                const now = audioCtx.currentTime;
                current.gainNode.gain.setValueAtTime(current.gainNode.gain.value, now);
                current.gainNode.gain.exponentialRampToValueAtTime(0.0001, now + fadeSec);
                setTimeout(() => {
                    current.cleanup();
                }, fadeSec * 1000 + 40);
            } catch (_) {
                current.cleanup();
            }
        } else {
            current.cleanup();
        }
    }

    /**
     * Start preset sound synthesis
     */
    function startPreset(presetId) {
        initAudioContext();
        if (!audioCtx) return;

        // Clean up previous
        stopCurrentPreset(0.15);

        // Resume AudioContext if suspended
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        setTimeout(() => {
            if (!state.isPlaying) return;
            switch (presetId) {
                case 'focus':
                    currentPresetNodes = createFocusPreset(audioCtx, masterGain);
                    break;
                case 'cosmic':
                    currentPresetNodes = createCosmicPreset(audioCtx, masterGain);
                    break;
                case 'rain':
                default:
                    currentPresetNodes = createRainPreset(audioCtx, masterGain);
                    break;
            }
        }, 50);
    }

    /**
     * Play / Pause audio
     */
    function togglePlay() {
        if (state.isPlaying) {
            pause();
        } else {
            play();
        }
    }

    function play() {
        initAudioContext();
        if (!audioCtx) return;

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        state.isPlaying = true;
        updateUI();

        // Smooth master gain fade in
        const now = audioCtx.currentTime;
        masterGain.gain.setValueAtTime(0.001, now);
        masterGain.gain.exponentialRampToValueAtTime(Math.max(0.001, state.isMuted ? 0.001 : state.volume), now + 0.25);

        startPreset(state.preset);
        startVisualizer();
    }

    function pause() {
        state.isPlaying = false;
        updateUI();
        stopVisualizer();

        if (audioCtx && masterGain) {
            try {
                const now = audioCtx.currentTime;
                masterGain.gain.setValueAtTime(masterGain.gain.value, now);
                masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
            } catch (_) {}
        }

        setTimeout(() => {
            stopCurrentPreset(0.1);
            if (audioCtx && audioCtx.state === 'running') {
                audioCtx.suspend();
            }
        }, 220);
    }

    /**
     * Change Preset
     */
    function setPreset(presetId) {
        if (state.preset === presetId && state.isPlaying) return;
        state.preset = presetId;
        localStorage.setItem(STORAGE_KEY_PRESET, presetId);
        updateUI();

        if (state.isPlaying) {
            startPreset(presetId);
        }
    }

    /**
     * Volume Control
     */
    function setVolume(val) {
        const num = Math.max(0, Math.min(1, parseFloat(val)));
        state.volume = num;
        state.isMuted = num === 0;
        localStorage.setItem(STORAGE_KEY_VOL, num.toString());

        if (masterGain && audioCtx && state.isPlaying) {
            const now = audioCtx.currentTime;
            masterGain.gain.cancelScheduledValues(now);
            masterGain.gain.setValueAtTime(masterGain.gain.value, now);
            masterGain.gain.exponentialRampToValueAtTime(Math.max(0.001, num), now + 0.08);
        }
        updateUI();
    }

    function toggleMute() {
        if (state.isMuted) {
            setVolume(state.prevVolume > 0.05 ? state.prevVolume : 0.5);
            state.isMuted = false;
        } else {
            state.prevVolume = state.volume;
            setVolume(0);
            state.isMuted = true;
        }
        updateUI();
    }

    /**
     * Visualizer Animation
     */
    function startVisualizer() {
        if (visualizerAnimFrame) cancelAnimationFrame(visualizerAnimFrame);
        const bars = document.querySelectorAll('.ambient-player-dock .ambient-bar');
        if (!bars.length) return;

        const dataArray = analyserNode ? new Uint8Array(analyserNode.frequencyBinCount) : null;

        function loop() {
            if (!state.isPlaying) {
                bars.forEach(b => { b.style.height = '3px'; });
                return;
            }

            if (analyserNode && dataArray) {
                analyserNode.getByteFrequencyData(dataArray);
                // 4 distinct frequency bands
                const b0 = Math.max(4, (dataArray[2] / 255) * 16);
                const b1 = Math.max(4, (dataArray[5] / 255) * 18);
                const b2 = Math.max(4, (dataArray[9] / 255) * 16);
                const b3 = Math.max(4, (dataArray[14] / 255) * 14);

                if (bars[0]) bars[0].style.height = `${b0.toFixed(1)}px`;
                if (bars[1]) bars[1].style.height = `${b1.toFixed(1)}px`;
                if (bars[2]) bars[2].style.height = `${b2.toFixed(1)}px`;
                if (bars[3]) bars[3].style.height = `${b3.toFixed(1)}px`;
            }

            visualizerAnimFrame = requestAnimationFrame(loop);
        }

        visualizerAnimFrame = requestAnimationFrame(loop);
    }

    function stopVisualizer() {
        if (visualizerAnimFrame) {
            cancelAnimationFrame(visualizerAnimFrame);
            visualizerAnimFrame = null;
        }
        const bars = document.querySelectorAll('.ambient-player-dock .ambient-bar');
        bars.forEach(b => { b.style.height = '3px'; });
    }

    /**
     * DOM Creation & Injection
     */
    let dockEl = null;

    function renderWidget() {
        ensureStylesLoaded();

        if (document.getElementById('ambient-focus-dock')) return;

        dockEl = document.createElement('aside');
        dockEl.id = 'ambient-focus-dock';
        dockEl.className = 'ambient-player-dock' + (state.isCollapsed ? ' is-collapsed' : '') + (state.isPlaying ? ' is-playing' : '');
        dockEl.setAttribute('aria-label', 'Ambient Focus Audio Player');

        dockEl.innerHTML = `
            <!-- Collapsed Mini Bubble -->
            <button type="button" class="ambient-player-bubble" id="ambient-bubble-btn" aria-label="Ambient musiqani ochish" title="Ambient Fon Ovozlarini ochish">
                <span style="font-size: 19px;">🎧</span>
                <span class="ambient-bubble-badge" title="Ijro etilmoqda"></span>
            </button>

            <!-- Expanded Luxury Dock Panel -->
            <div class="ambient-player-panel" role="region" aria-label="Ambient ovozlar paneli">
                <!-- Play/Pause Button -->
                <button type="button" class="ambient-play-btn" id="ambient-play-toggle" aria-label="Ijro / Pauza" title="Ijro / Pauza (Bo'sh joy)">
                    <svg viewBox="0 0 24 24" id="ambient-play-icon">
                        <polygon points="6 4 20 12 6 20 6 4"></polygon>
                    </svg>
                </button>

                <!-- Equalizer / Visualizer -->
                <div class="ambient-visualizer" aria-hidden="true" title="Ovoz to'lqini">
                    <span class="ambient-bar"></span>
                    <span class="ambient-bar"></span>
                    <span class="ambient-bar"></span>
                    <span class="ambient-bar"></span>
                </div>

                <!-- Mood Switcher -->
                <div class="ambient-presets" role="radiogroup" aria-label="Atmosfera turi">
                    ${PRESETS.map(p => `
                        <button type="button" 
                                role="radio" 
                                aria-checked="${state.preset === p.id}" 
                                class="ambient-preset-btn ${state.preset === p.id ? 'is-active' : ''}" 
                                data-preset="${p.id}" 
                                title="${p.title}">
                            <span class="preset-emoji">${p.emoji}</span>
                            <span class="preset-name">${p.name}</span>
                        </button>
                    `).join('')}
                </div>

                <!-- Minimal Volume Slider -->
                <div class="ambient-volume-wrap">
                    <button type="button" class="ambient-volume-btn" id="ambient-mute-btn" aria-label="Ovozni o'chirish / yoqish" title="Ovozni o'chirish / yoqish">
                        <svg viewBox="0 0 24 24" id="ambient-vol-icon">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                        </svg>
                    </button>
                    <input type="range" 
                           id="ambient-vol-slider" 
                           class="ambient-volume-slider" 
                           min="0" 
                           max="1" 
                           step="0.02" 
                           value="${state.volume}" 
                           aria-label="Ovoz balandligi">
                </div>

                <!-- Collapse Button -->
                <button type="button" class="ambient-action-btn" id="ambient-collapse-btn" aria-label="Panelni kichraytirish" title="Kichraytirish">
                    <svg viewBox="0 0 24 24">
                        <polyline points="4 14 10 14 10 20"></polyline>
                        <polyline points="20 10 14 10 14 4"></polyline>
                        <line x1="14" y1="10" x2="21" y2="3"></line>
                        <line x1="3" y1="21" x2="10" y2="14"></line>
                    </svg>
                </button>
            </div>
        `;

        document.body.appendChild(dockEl);
        attachEventListeners();
        updateUI();
    }

    /**
     * Attach UI Event Listeners
     */
    function attachEventListeners() {
        if (!dockEl) return;

        // Play / Pause
        const playBtn = dockEl.querySelector('#ambient-play-toggle');
        if (playBtn) playBtn.addEventListener('click', togglePlay);

        // Bubble (expand)
        const bubbleBtn = dockEl.querySelector('#ambient-bubble-btn');
        if (bubbleBtn) {
            bubbleBtn.addEventListener('click', () => {
                state.isCollapsed = false;
                localStorage.setItem(STORAGE_KEY_COLLAPSED, 'false');
                updateUI();
            });
        }

        // Collapse
        const collapseBtn = dockEl.querySelector('#ambient-collapse-btn');
        if (collapseBtn) {
            collapseBtn.addEventListener('click', () => {
                state.isCollapsed = true;
                localStorage.setItem(STORAGE_KEY_COLLAPSED, 'true');
                updateUI();
            });
        }

        // Preset switcher buttons
        const presetBtns = dockEl.querySelectorAll('.ambient-preset-btn');
        presetBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetPreset = btn.getAttribute('data-preset');
                if (targetPreset) setPreset(targetPreset);
            });
        });

        // Volume slider
        const volSlider = dockEl.querySelector('#ambient-vol-slider');
        if (volSlider) {
            volSlider.addEventListener('input', (e) => {
                setVolume(e.target.value);
            });
        }

        // Mute button
        const muteBtn = dockEl.querySelector('#ambient-mute-btn');
        if (muteBtn) muteBtn.addEventListener('click', toggleMute);
    }

    /**
     * Synchronize DOM with State
     */
    function updateUI() {
        if (!dockEl) return;

        // Dock playing / collapsed classes
        dockEl.classList.toggle('is-playing', state.isPlaying);
        dockEl.classList.toggle('is-collapsed', state.isCollapsed);

        // Play / Pause Icon
        const playIcon = dockEl.querySelector('#ambient-play-icon');
        if (playIcon) {
            if (state.isPlaying) {
                // Pause Icon (two vertical bars)
                playIcon.innerHTML = `
                    <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                    <rect x="14" y="4" width="4" height="16" rx="1"></rect>
                `;
            } else {
                // Play Icon (triangle)
                playIcon.innerHTML = `<polygon points="6 4 20 12 6 20 6 4"></polygon>`;
            }
        }

        // Preset buttons active class
        const presetBtns = dockEl.querySelectorAll('.ambient-preset-btn');
        presetBtns.forEach(btn => {
            const pId = btn.getAttribute('data-preset');
            const isActive = pId === state.preset;
            btn.classList.toggle('is-active', isActive);
            btn.setAttribute('aria-checked', isActive.toString());
        });

        // Slider value
        const volSlider = dockEl.querySelector('#ambient-vol-slider');
        if (volSlider && parseFloat(volSlider.value) !== state.volume) {
            volSlider.value = state.volume;
        }

        // Volume / Mute Icon
        const volIcon = dockEl.querySelector('#ambient-vol-icon');
        if (volIcon) {
            if (state.isMuted || state.volume === 0) {
                // Muted icon
                volIcon.innerHTML = `
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line>
                    <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line>
                `;
            } else if (state.volume < 0.45) {
                // Low volume
                volIcon.innerHTML = `
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"></path>
                `;
            } else {
                // Full volume
                volIcon.innerHTML = `
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"></path>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"></path>
                `;
            }
        }
    }

    /**
     * Clean memory on unload/navigation
     */
    window.addEventListener('beforeunload', () => {
        stopCurrentPreset(0);
        stopVisualizer();
        if (audioCtx) {
            try {
                audioCtx.close();
            } catch (_) {}
            audioCtx = null;
        }
    });

    /**
     * Initialize on DOM ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderWidget);
    } else {
        renderWidget();
    }

    // Public API
    window.AbduAmbientPlayer = {
        play,
        pause,
        togglePlay,
        setPreset,
        setVolume,
        getState: () => ({ ...state })
    };
})();
