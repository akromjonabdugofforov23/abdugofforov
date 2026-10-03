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
    let cosmicChimeTimer = null;
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
     * Synthesizer: Preset 1 - Yomg'ir (Crystal-Clear Natural Rain & Gentle Droplets)
     */
    function createRainPreset(ctx, destination) {
        const nodesToCleanup = [];
        const presetGain = ctx.createGain();
        presetGain.gain.setValueAtTime(0.001, ctx.currentTime);
        presetGain.gain.exponentialRampToValueAtTime(1.0, ctx.currentTime + 0.3);
        presetGain.connect(destination);
        nodesToCleanup.push(presetGain);

        // 1. Soft, soothing rain bed (Filtered pink noise with gentle roll-offs)
        const pinkSrc = ctx.createBufferSource();
        pinkSrc.buffer = getPinkNoiseBuffer(ctx);
        pinkSrc.loop = true;

        const rainLowPass = ctx.createBiquadFilter();
        rainLowPass.type = 'lowpass';
        rainLowPass.frequency.setValueAtTime(750, ctx.currentTime);
        rainLowPass.Q.setValueAtTime(0.5, ctx.currentTime);

        const rainHighPass = ctx.createBiquadFilter();
        rainHighPass.type = 'highpass';
        rainHighPass.frequency.setValueAtTime(220, ctx.currentTime);
        rainHighPass.Q.setValueAtTime(0.5, ctx.currentTime);

        const rainGain = ctx.createGain();
        rainGain.gain.setValueAtTime(0.24, ctx.currentTime);

        pinkSrc.connect(rainLowPass);
        rainLowPass.connect(rainHighPass);
        rainHighPass.connect(rainGain);
        rainGain.connect(presetGain);

        pinkSrc.start(0);
        nodesToCleanup.push(pinkSrc, rainLowPass, rainHighPass, rainGain);

        // 2. Subtle rain shower breeze modulation (soft natural air movement)
        const breezeSrc = ctx.createBufferSource();
        breezeSrc.buffer = getPinkNoiseBuffer(ctx);
        breezeSrc.loop = true;

        const breezeFilter = ctx.createBiquadFilter();
        breezeFilter.type = 'bandpass';
        breezeFilter.frequency.setValueAtTime(1300, ctx.currentTime);
        breezeFilter.Q.setValueAtTime(0.8, ctx.currentTime);

        const breezeGain = ctx.createGain();
        breezeGain.gain.setValueAtTime(0.03, ctx.currentTime);

        const breezeLfo = ctx.createOscillator();
        breezeLfo.type = 'sine';
        breezeLfo.frequency.setValueAtTime(0.07, ctx.currentTime);

        const breezeLfoGain = ctx.createGain();
        breezeLfoGain.gain.setValueAtTime(0.02, ctx.currentTime);

        breezeLfo.connect(breezeLfoGain);
        breezeLfoGain.connect(breezeGain.gain);

        breezeSrc.connect(breezeFilter);
        breezeFilter.connect(breezeGain);
        breezeGain.connect(presetGain);

        breezeSrc.start(0);
        breezeLfo.start(0);
        nodesToCleanup.push(breezeSrc, breezeFilter, breezeGain, breezeLfo, breezeLfoGain);

        // 3. Realistic, natural water droplets (soft pitch-drop sines, no harsh laser beeps)
        function triggerDrop() {
            if (!state.isPlaying || state.preset !== 'rain' || !ctx || ctx.state !== 'running') return;
            try {
                const now = ctx.currentTime;
                const osc = ctx.createOscillator();
                const dropGain = ctx.createGain();
                const dropDuration = 0.038 + Math.random() * 0.025;
                const startFreq = 420 + Math.random() * 200;
                const endFreq = 200 + Math.random() * 70;

                osc.type = 'sine';
                osc.frequency.setValueAtTime(startFreq, now);
                osc.frequency.exponentialRampToValueAtTime(endFreq, now + dropDuration);

                const peakGain = 0.015 + Math.random() * 0.018;
                dropGain.gain.setValueAtTime(0.0001, now);
                dropGain.gain.exponentialRampToValueAtTime(peakGain, now + 0.002);
                dropGain.gain.exponentialRampToValueAtTime(0.0001, now + dropDuration);

                let connectionTarget = presetGain;
                let pannerNode = null;
                if (ctx.createStereoPanner) {
                    pannerNode = ctx.createStereoPanner();
                    pannerNode.pan.setValueAtTime(Math.random() * 1.5 - 0.75, now);
                    dropGain.connect(pannerNode);
                    pannerNode.connect(connectionTarget);
                } else {
                    dropGain.connect(connectionTarget);
                }

                osc.connect(dropGain);
                osc.start(now);
                osc.stop(now + dropDuration + 0.01);

                osc.onended = () => {
                    try {
                        osc.disconnect();
                        dropGain.disconnect();
                        if (pannerNode) pannerNode.disconnect();
                    } catch (_) {}
                };
            } catch (_) {}

            const nextDropDelay = 120 + Math.random() * 220;
            rainDropTimer = setTimeout(triggerDrop, nextDropDelay);
        }

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
     * Synthesizer: Preset 2 - Fokus (Warm Harmonic Drone & Binaural Alpha Flow)
     * Replaces harsh brown noise with crystal-clear 10Hz Alpha waves & lush chord pad
     */
    function createFocusPreset(ctx, destination) {
        const nodesToCleanup = [];
        const presetGain = ctx.createGain();
        presetGain.gain.setValueAtTime(0.001, ctx.currentTime);
        presetGain.gain.exponentialRampToValueAtTime(1.0, ctx.currentTime + 0.35);
        presetGain.connect(destination);
        nodesToCleanup.push(presetGain);

        // 1. 10Hz Alpha wave binaural carrier (Tranquil focus & clarity)
        const leftOsc = ctx.createOscillator();
        leftOsc.type = 'sine';
        leftOsc.frequency.setValueAtTime(128.0, ctx.currentTime);

        const rightOsc = ctx.createOscillator();
        rightOsc.type = 'sine';
        rightOsc.frequency.setValueAtTime(138.0, ctx.currentTime); // +10Hz Alpha beat

        const binauralGain = ctx.createGain();
        binauralGain.gain.setValueAtTime(0.14, ctx.currentTime);

        if (ctx.createStereoPanner) {
            const leftPan = ctx.createStereoPanner();
            leftPan.pan.setValueAtTime(-0.85, ctx.currentTime);
            const rightPan = ctx.createStereoPanner();
            rightPan.pan.setValueAtTime(0.85, ctx.currentTime);

            leftOsc.connect(leftPan);
            leftPan.connect(binauralGain);
            rightOsc.connect(rightPan);
            rightPan.connect(binauralGain);

            nodesToCleanup.push(leftPan, rightPan);
        } else {
            leftOsc.connect(binauralGain);
            rightOsc.connect(binauralGain);
        }

        binauralGain.connect(presetGain);
        leftOsc.start(0);
        rightOsc.start(0);
        nodesToCleanup.push(leftOsc, rightOsc, binauralGain);

        // 2. Warm harmonic chord voices (Pure sines: G3, C4, E4, G4 - warm, soothing chord)
        const chordVoices = [
            { freq: 196.00, gain: 0.11, pan: -0.25 },
            { freq: 261.63, gain: 0.09, pan: 0.25 },
            { freq: 329.63, gain: 0.07, pan: -0.1 },
            { freq: 392.00, gain: 0.05, pan: 0.1 }
        ];

        const chordMaster = ctx.createGain();
        chordMaster.gain.setValueAtTime(0.9, ctx.currentTime);
        chordMaster.connect(presetGain);
        nodesToCleanup.push(chordMaster);

        chordVoices.forEach(v => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(v.freq, ctx.currentTime);

            const vGain = ctx.createGain();
            vGain.gain.setValueAtTime(v.gain, ctx.currentTime);

            if (ctx.createStereoPanner) {
                const pan = ctx.createStereoPanner();
                pan.pan.setValueAtTime(v.pan, ctx.currentTime);
                osc.connect(vGain);
                vGain.connect(pan);
                pan.connect(chordMaster);
                nodesToCleanup.push(pan);
            } else {
                osc.connect(vGain);
                vGain.connect(chordMaster);
            }

            osc.start(0);
            nodesToCleanup.push(osc, vGain);
        });

        // 3. Delicate analog room warmth (heavily filtered low-frequency warmth, no harsh hiss)
        const warmSrc = ctx.createBufferSource();
        warmSrc.buffer = getBrownNoiseBuffer(ctx);
        warmSrc.loop = true;

        const warmLowpass = ctx.createBiquadFilter();
        warmLowpass.type = 'lowpass';
        warmLowpass.frequency.setValueAtTime(180, ctx.currentTime);
        warmLowpass.Q.setValueAtTime(0.5, ctx.currentTime);

        const warmGain = ctx.createGain();
        warmGain.gain.setValueAtTime(0.06, ctx.currentTime);

        warmSrc.connect(warmLowpass);
        warmLowpass.connect(warmGain);
        warmGain.connect(presetGain);

        warmSrc.start(0);
        nodesToCleanup.push(warmSrc, warmLowpass, warmGain);

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
     * Synthesizer: Preset 3 - Koinot & Meditatsiya (Celestial Pure Sine Drone & Stardust Chimes)
     * Replaces harsh triangle buzzy drone with sacred 432Hz pure sines & space chimes
     */
    function createCosmicPreset(ctx, destination) {
        const nodesToCleanup = [];
        const presetGain = ctx.createGain();
        presetGain.gain.setValueAtTime(0.001, ctx.currentTime);
        presetGain.gain.exponentialRampToValueAtTime(1.0, ctx.currentTime + 0.4);
        presetGain.connect(destination);
        nodesToCleanup.push(presetGain);

        // 1. Pure Sine Harmonic Constellation (432Hz Sacred Cosmic Tuning - 0% buzz)
        const cosmicVoices = [
            { freq: 54.00, gain: 0.16, pan: 0.0, detune: 0 },      // Sub-bass root
            { freq: 108.00, gain: 0.20, pan: 0.0, detune: 0 },     // Deep fundamental
            { freq: 162.00, gain: 0.15, pan: -0.25, detune: 0 },   // Cosmic fifth
            { freq: 216.00, gain: 0.12, pan: 0.25, detune: 2 },    // Ethereal octave
            { freq: 270.00, gain: 0.09, pan: -0.15, detune: -1.5 },// Major ninth
            { freq: 324.00, gain: 0.07, pan: 0.15, detune: 1.5 },  // Resonant fifth
            { freq: 432.00, gain: 0.05, pan: -0.1, detune: 0 }     // Celestial shimmer
        ];

        // Smooth sweeping lowpass filter (gentle Q: 0.6 to avoid harsh whistling)
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(540, ctx.currentTime);
        filter.Q.setValueAtTime(0.6, ctx.currentTime);

        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.04, ctx.currentTime); // 25s slow cosmic wave

        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(160, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start(0);
        nodesToCleanup.push(lfo, lfoGain, filter);

        // Deep Space Delay / Reverb simulation
        const delay = ctx.createDelay();
        delay.delayTime.setValueAtTime(0.42, ctx.currentTime);

        const delayFeedback = ctx.createGain();
        delayFeedback.gain.setValueAtTime(0.32, ctx.currentTime);

        const delayFilter = ctx.createBiquadFilter();
        delayFilter.type = 'lowpass';
        delayFilter.frequency.setValueAtTime(1200, ctx.currentTime);

        delay.connect(delayFilter);
        delayFilter.connect(delayFeedback);
        delayFeedback.connect(delay);
        delayFilter.connect(presetGain);
        nodesToCleanup.push(delay, delayFeedback, delayFilter);

        // Generate pure sine voice oscillators
        cosmicVoices.forEach(voice => {
            const osc = ctx.createOscillator();
            osc.type = 'sine'; // Pure sine, crystal clear, zero distortion
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

        filter.connect(presetGain);
        filter.connect(delay);

        // 2. Stardust Chimes (Delicate celestial bells in the distance)
        const chimePitches = [864, 1080, 1296, 1728];
        function triggerChime() {
            if (!state.isPlaying || state.preset !== 'cosmic' || !ctx || ctx.state !== 'running') return;
            try {
                const now = ctx.currentTime;
                const chimeOsc = ctx.createOscillator();
                const chimeGain = ctx.createGain();
                const freq = chimePitches[Math.floor(Math.random() * chimePitches.length)];

                chimeOsc.type = 'sine';
                chimeOsc.frequency.setValueAtTime(freq, now);

                const chimeVol = 0.02 + Math.random() * 0.015;
                chimeGain.gain.setValueAtTime(0.0001, now);
                chimeGain.gain.exponentialRampToValueAtTime(chimeVol, now + 0.004);
                chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

                let chimeTarget = delay;
                if (ctx.createStereoPanner) {
                    const pan = ctx.createStereoPanner();
                    pan.pan.setValueAtTime(Math.random() * 1.6 - 0.8, now);
                    chimeGain.connect(pan);
                    pan.connect(chimeTarget);
                    pan.connect(presetGain);
                } else {
                    chimeGain.connect(chimeTarget);
                    chimeGain.connect(presetGain);
                }

                chimeOsc.connect(chimeGain);
                chimeOsc.start(now);
                chimeOsc.stop(now + 2.3);

                chimeOsc.onended = () => {
                    try {
                        chimeOsc.disconnect();
                        chimeGain.disconnect();
                    } catch (_) {}
                };
            } catch (_) {}

            const nextChime = 3800 + Math.random() * 3200;
            cosmicChimeTimer = setTimeout(triggerChime, nextChime);
        }

        // Kick off first stardust chime after smooth initial fade-in
        cosmicChimeTimer = setTimeout(triggerChime, 1800);

        return {
            gainNode: presetGain,
            cleanup: () => {
                if (cosmicChimeTimer) {
                    clearTimeout(cosmicChimeTimer);
                    cosmicChimeTimer = null;
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

        if (cosmicChimeTimer) {
            clearTimeout(cosmicChimeTimer);
            cosmicChimeTimer = null;
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
