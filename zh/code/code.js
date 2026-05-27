// Vanilla-JS rewrite of code.js. Zero jQuery / jQuery-UI dependencies.
// Bootstrap 5 vanilla JS API is used for modals/collapses (data-bs-* attributes
// drive most of it; programmatic toggles use bootstrap.Modal / bootstrap.Collapse).

(function () {
    'use strict';

    // ---------- Module-level state (was top-level var in the original) ----------
    let current_checked = 3;
    let visible_overlay = '#axis_set_01';
    let user_clicked = false;
    let carousel_handle = null;
    let carousel_start_handle = null;
    const CAROUSEL_START_DELAY_MS = 3000; // wait after the full map appears before the layer sequence begins
    let animating = false;
    let overlay_show = 'none'; // shared between hover-in and hover-out on .select-button

    function mod(n, m) {
        return ((n % m) + m) % m;
    }

    // ---------- Tiny fade helpers (replace jQuery .fadeIn/.fadeOut) ----------
    // Inject the CSS rule once so the helpers can use a class-based opacity transition.
    const FADE_STYLE_ID = '__vanilla_fade_style__';
    if (!document.getElementById(FADE_STYLE_ID)) {
        const styleEl = document.createElement('style');
        styleEl.id = FADE_STYLE_ID;
        styleEl.textContent =
            '.__vfade{opacity:0!important;transition:opacity var(--vfade-dur,200ms) linear;}' +
            '.__vfade-in{opacity:1!important;transition:opacity var(--vfade-dur,200ms) linear;}';
        document.head.appendChild(styleEl);
    }

    // Show an element regardless of whether CSS hides it via `display: none`
    // (jQuery's .show() semantics). Without this fallback, `style.display = ''`
    // just removes the inline override and the CSS rule keeps the element hidden.
    function show(el) {
        if (!el) return;
        el.style.display = '';
        if (getComputedStyle(el).display === 'none') {
            el.style.display = 'block';
        }
    }

    // One-shot opacity-transitionend listener. Guarantees `cb` fires exactly once,
    // either from the real `transitionend` (filtered to the `opacity` property) or
    // from a safety setTimeout fallback. Always removes the listener so it can't
    // leak into a later fade on the same element — this was the source of the
    // "second carousel cycle is too fast" regression: an interrupted fadeOut left
    // its listener attached, then the next cycle's fadeIn transitionend triggered
    // the stale listener and the element was hidden the moment it became visible.
    function _onceOpacityEnd(el, cb, fallbackMs) {
        let fired = false;
        const fire = function () {
            if (fired) return;
            fired = true;
            el.removeEventListener('transitionend', handler);
            cb();
        };
        const handler = function (e) {
            if (e.propertyName === 'opacity') fire();
        };
        el.addEventListener('transitionend', handler);
        setTimeout(fire, fallbackMs);
    }

    function fadeIn(el, ms, cb) {
        if (!el) return;
        const dur = (typeof ms === 'number') ? ms : 200;
        el.style.setProperty('--vfade-dur', dur + 'ms');
        // Make sure the element is in the layout before transitioning,
        // even if CSS sets display:none on it.
        show(el);
        // start from current opacity 0 if hidden
        el.classList.remove('__vfade-in');
        el.classList.add('__vfade');
        // Force a reflow so the next class change triggers a transition.
        void el.offsetWidth;
        el.classList.remove('__vfade');
        el.classList.add('__vfade-in');
        if (typeof cb === 'function') {
            _onceOpacityEnd(el, cb, dur + 50);
        }
    }

    function fadeOut(el, ms, cb) {
        if (!el) return;
        const dur = (typeof ms === 'number') ? ms : 200;
        el.style.setProperty('--vfade-dur', dur + 'ms');
        el.classList.remove('__vfade-in');
        el.classList.add('__vfade');
        _onceOpacityEnd(el, function () {
            // Only set display:none if the element is still being faded out.
            // If a subsequent fadeIn started before this completed, the class
            // is now `__vfade-in` and hiding the element here would cancel it.
            if (el.classList.contains('__vfade')) {
                el.style.display = 'none';
            }
            if (typeof cb === 'function') cb();
        }, dur + 50);
    }

    function isHidden(el) {
        if (!el) return true;
        // Match jQuery's :hidden semantics loosely — display:none counts as hidden.
        return el.offsetParent === null || getComputedStyle(el).display === 'none';
    }

    // Linear scroll from the current scrollY to `targetY` over `durationMs`.
    // Equivalent of jQuery $('html, body').animate({scrollTop: y}, {duration, easing:'linear'}).
    // Used (only) for the cover down-arrow so the long descent into the map
    // feels deliberate — the visitor watches galaxies pass by, not a snap.
    // A second click while a scroll is in flight cancels the previous animation.
    let _linearScrollRAF = null;
    let _scrollSeqTimeout = null;
    function _cancelScrollSeq() {
        if (_linearScrollRAF != null) {
            cancelAnimationFrame(_linearScrollRAF);
            _linearScrollRAF = null;
        }
        if (_scrollSeqTimeout != null) {
            clearTimeout(_scrollSeqTimeout);
            _scrollSeqTimeout = null;
        }
    }
    // Built-in easings. Linear = constant speed. EaseOutCubic = starts fast,
    // decelerates to a soft landing at the destination — used between cover
    // sentences so each stop doesn't feel like an abrupt halt.
    const _easings = {
        linear: function (t) { return t; },
        easeOutCubic: function (t) { return 1 - Math.pow(1 - t, 3); },
        // Soft take-off AND soft landing: accelerates gently from rest,
        // cruises, then decelerates gently into the stop.
        easeInOutCubic: function (t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        },
    };
    function scrollToLinear(targetY, durationMs, cb, easing) {
        _cancelScrollSeq();
        const startY = window.scrollY;
        const deltaY = targetY - startY;
        if (Math.abs(deltaY) < 1 || durationMs <= 0) {
            window.scrollTo(0, targetY);
            if (typeof cb === 'function') cb();
            return;
        }
        const ease = (typeof easing === 'function')
            ? easing
            : (_easings[easing] || _easings.linear);
        const startTime = (typeof performance !== 'undefined' && performance.now)
            ? performance.now()
            : Date.now();
        const step = function (now) {
            const elapsed = (typeof now === 'number' ? now : Date.now()) - startTime;
            const t = Math.min(elapsed / durationMs, 1);
            const eased = ease(t);
            window.scrollTo(0, Math.round(startY + deltaY * eased));
            if (t < 1) {
                _linearScrollRAF = requestAnimationFrame(step);
            } else {
                _linearScrollRAF = null;
                if (typeof cb === 'function') cb();
            }
        };
        _linearScrollRAF = requestAnimationFrame(step);
    }
    // One CONTINUOUS scroll from the current position to `targetY` that EASES
    // ITS SPEED DOWN near each position in `slowPoints` (to `slowRatio` of the
    // cruise speed) without ever stopping, then halts at targetY. Used by the
    // mobile down-arrow: a single tap glides all the way to the map, slowing —
    // but not pausing — as each cover sentence crosses the vertical center.
    // The whole trip is normalized to take ~durationMs regardless of distance.
    function scrollThroughSlowing(targetY, slowPoints, durationMs, slowRatio, slowWidthPx) {
        _cancelScrollSeq();
        const startY = window.scrollY;
        const dist = targetY - startY;
        if (dist < 1 || durationMs <= 0) {
            window.scrollTo(0, targetY);
            return;
        }
        const ratio = (typeof slowRatio === 'number') ? slowRatio : 0.25;
        const width = (typeof slowWidthPx === 'number') ? slowWidthPx : window.innerHeight * 0.18;
        const points = (slowPoints || []).filter(function (p) {
            return p > startY + 5 && p < targetY - 5;
        });
        // Speed multiplier at a given scroll position: 1 in open space, dipping
        // smoothly to `ratio` at a slow point.
        const scaleAt = function (pos) {
            if (!points.length || width <= 0) return 1;
            let nearest = Infinity;
            for (let i = 0; i < points.length; i++) {
                const d = Math.abs(pos - points[i]);
                if (d < nearest) nearest = d;
            }
            if (nearest >= width) return 1;
            const t = nearest / width;          // 0 at the point → 1 at the edge
            const s = t * t * (3 - 2 * t);       // smoothstep
            return ratio + (1 - ratio) * s;
        };
        // Normalize: ∫ dy / scale(y) sets the cruise speed so the trip lasts
        // durationMs even though the speed varies.
        const STEPS = 200;
        const stepPx = dist / STEPS;
        let integral = 0;
        for (let i = 0; i < STEPS; i++) {
            integral += stepPx / scaleAt(startY + (i + 0.5) * stepPx);
        }
        const vMax = integral / durationMs;      // px per ms at full (cruise) speed
        let y = startY;
        let last = null;
        const frame = function (now) {
            const t = (typeof now === 'number') ? now : Date.now();
            if (last == null) last = t;
            const dt = Math.min(t - last, 50);   // cap dt so a tab-switch can't jump
            last = t;
            y += vMax * scaleAt(y) * dt;
            if (y >= targetY) {
                window.scrollTo(0, targetY);
                _linearScrollRAF = null;
                return;
            }
            window.scrollTo(0, Math.round(y));
            _linearScrollRAF = requestAnimationFrame(frame);
        };
        _linearScrollRAF = requestAnimationFrame(frame);
    }
    // Walk through a list of {target, scrollMs, dwellMs} stops in sequence.
    // Used by the cover down-arrow to pause at each .flavor-text sentence so
    // the visitor has time to read it before the descent continues. Re-entering
    // (e.g. user clicks the arrow again) cancels the previous sequence.
    function scrollSequence(steps) {
        _cancelScrollSeq();
        let i = 0;
        const runNext = function () {
            if (i >= steps.length) return;
            const step = steps[i++];
            const afterScroll = function () {
                if (step.dwellMs && step.dwellMs > 0) {
                    _scrollSeqTimeout = setTimeout(function () {
                        _scrollSeqTimeout = null;
                        runNext();
                    }, step.dwellMs);
                } else {
                    runNext();
                }
            };
            scrollToLinear(step.target, step.scrollMs || 0, afterScroll, step.easing);
        };
        runNext();
    }

    // ---------- Convenience selector helpers ----------
    const $$ = function (sel, root) { return Array.from((root || document).querySelectorAll(sel)); };
    const $1 = function (sel, root) { return (root || document).querySelector(sel); };

    function on(selector, event, handler, opts) {
        $$(selector).forEach(function (el) {
            el.addEventListener(event, handler, opts);
        });
    }

    // ---------- Main initialisation (script has `defer`, DOM is ready) ----------
    // Hide any .more-info up front.
    $$('.more-info').forEach(function (el) { el.style.display = 'none'; });

    // ---------- Dropdown items: show only the hovered .download-click-section ----------
    on('.dropdown-item', 'mouseenter', function (e) {
        $$('.download-click-section').forEach(function (el) { el.style.display = 'none'; });
        const inner = $1('.download-click-section', this);
        if (inner) show(inner);
        e.stopPropagation();
    });
    on('.dropdown-item', 'mouseleave', function () {
        $$('.download-click-section').forEach(function (el) { el.style.display = 'none'; });
    });

    // ---------- Phone banner box click → open modal with right picture ----------
    on('.phone-banner-box', 'click', function () {
        set_modal_pic(this.id);
        const modalEl = document.getElementById('myModal');
        if (modalEl && window.bootstrap && bootstrap.Modal) {
            bootstrap.Modal.getOrCreateInstance(modalEl).toggle();
        }
    });

    // ---------- Map-effect hover: data-driven ----------
    // Map area/axis IDs to {slice, infoKey}. `slice` is the filename for #slice-map; null = no swap.
    const SLICE_BASE = 'https://menard.pha.jhu.edu/MapoftheUniverse/Images/WebMap_V02/';
    const MAP_EFFECT_TARGETS = {
        area_01: { slice: 'near.png',     infoKey: 4 },
        area_02: { slice: 'red.png',      infoKey: 3 },
        area_03: { slice: 'quasars.png',  infoKey: 2 },
        area_04: { slice: 'cmb.png',      infoKey: 1 },
        area_05: { slice: 'galaxies.png', infoKey: 9 },
        axis_01: { slice: null,           infoKey: 7 },
        axis_02: { slice: null,           infoKey: 5 },
        axis_03: { slice: null,           infoKey: 6 },
        axis_04: { slice: null,           infoKey: 8 },
    };

    on('.map-effect', 'mouseenter', function (e) {
        const cfg = MAP_EFFECT_TARGETS[e.target.id];
        if (!cfg) return;
        const container = $1('.map-container-info');
        if (container && isHidden(container)) {
            fadeIn(container, 200);
        }
        const sliceMap = document.getElementById('slice-map');
        if (cfg.slice && sliceMap) {
            sliceMap.src = SLICE_BASE + cfg.slice;
        }
        const info = information[cfg.infoKey];
        if (!info || !container) return;
        const h1 = $1('h1', container);
        const img = $1('img', container);
        const p = $1('p', container);
        if (h1) h1.textContent = info.title;
        if (img) img.src = info.img;
        if (p) p.textContent = info.caption;
    });

    on('.map-effect', 'mouseleave', function () {
        const container = $1('.map-container-info');
        if (container) fadeOut(container, 100);
        const sliceMap = document.getElementById('slice-map');
        if (sliceMap) sliceMap.src = SLICE_BASE + 'total.png';
    });

    // ---------- Centered dropdown menu: don't close when clicked, hide downloads ----------
    on('.dropdown-menu-center', 'click', function (e) {
        e.stopPropagation();
        $$('.download-click-section').forEach(function (el) { el.style.display = 'none'; });
    });

    // ---------- "Bottom arrow" smooth-scrolls to map ----------
    // Constraint: with `.mapbox > img { max-height: 110vh }`, the rendered map
    // is ~10% taller than the viewport on typical desktops, so the entire
    // map can't fit at once. The labels themselves span only ~90% of the map
    // (top one at top:8%, bottom one at bottom:2%), so on a viewport of
    // height ~1100px BOTH labels CAN fit simultaneously — but only inside a
    // narrow band of valid scroll positions.
    //
    // Compute the range of scrollY for which both labels are visible, then
    // pick the midpoint of that range. `getBoundingClientRect` honors the
    // `transform: translate(-50%, -50%)` on the labels and returns the actual
    // visual edges, which is exactly what we need for visibility checks.
    // Cover-scroll tunables, shared by the down-arrow auto-sequence AND the
    // keyboard step-through.
    const COVER_DWELL_MS = 5000;    // auto-sequence: dwell at each sentence
    const COVER_SEGMENT_MS = 1200;  // scroll BETWEEN sentences (ease-in-out)
    const COVER_TAIL_MS = 3000;     // final scroll to the map (ease-in-out)
    const COVER_EASING = 'easeInOutCubic';

    // The map landing scrollY. Mobile (< 992px): bottom of .scroll-to-map so the
    // three action buttons are in view. Desktop: midpoint of the band where both
    // axis labels are visible, biased per user fine-tuning. Falls back to .mapbox.
    function computeMapTarget() {
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const isMobile = winW < 992;
        let scrollTarget = null;
        if (isMobile) {
            const stm = $1('.scroll-to-map');
            if (stm) {
                const rect = stm.getBoundingClientRect();
                scrollTarget = rect.top + window.scrollY + stm.offsetHeight - winH;
            }
        } else {
            const top = $1('.angle-on-sky-axis');
            const bot = $1('.you-are-here-axis');
            if (top && bot) {
                const topRect = top.getBoundingClientRect();
                const botRect = bot.getBoundingClientRect();
                const topVisualPageY = topRect.top + window.scrollY;
                const botVisualPageY = botRect.bottom + window.scrollY;
                const lower = botVisualPageY - winH;
                const upper = topVisualPageY;
                const baseTarget = lower <= upper ? (lower + upper) / 2 : lower;
                scrollTarget = baseTarget - 0.0625 * bot.offsetHeight;
            }
        }
        if (scrollTarget == null) {
            const mapbox = $1('.mapbox');
            if (!mapbox) return null;
            const rect = mapbox.getBoundingClientRect();
            scrollTarget = rect.top + window.scrollY + mapbox.offsetHeight - winH;
        }
        return Math.max(0, scrollTarget);
    }

    // Ordered list of cover stops: each .flavor-text sentence centered
    // (clamped ≥ 0) — sentence 1 at top:40% clamps to ~0 since it can't be
    // centered by scrolling down — then the map landing. Each entry carries
    // the glide duration to use when scrolling TO it.
    function buildCoverStops() {
        const winH = window.innerHeight;
        const list = [];
        $$('.cover .flavor-text').forEach(function (el) {
            const rect = el.getBoundingClientRect();
            const centerPageY = rect.top + window.scrollY + el.offsetHeight / 2;
            list.push({ target: Math.max(0, centerPageY - winH / 2), ms: COVER_SEGMENT_MS });
        });
        const mapTarget = computeMapTarget();
        if (mapTarget != null) list.push({ target: mapTarget, ms: COVER_TAIL_MS });
        return list;
    }

    // Advance ONE stop below the current scroll position (manual pacing, no
    // dwell). Returns true if it moved, false if already at/past the last stop.
    // Shared by the keyboard step-through and the mobile down-arrow tap.
    function advanceOneCoverStop() {
        const stops = buildCoverStops();
        if (!stops.length) return false;
        const currentY = window.scrollY;
        const next = stops.find(function (s) { return s.target > currentY + 5; });
        if (!next) return false;
        scrollToLinear(next.target, next.ms, null, COVER_EASING);
        return true;
    }

    // Run the full automatic timed sequence — pause (dwell) at each sentence so
    // the visitor can read it, then continue to the map.
    function runCoverAutoSequence() {
        const currentY = window.scrollY;
        const all = buildCoverStops();
        const stops = [];
        all.forEach(function (s, i) {
            // Only keep stops we haven't already scrolled past (so a repeat
            // click from mid-descent doesn't bounce the user back up).
            if (s.target >= currentY - 5) {
                const isMap = (i === all.length - 1);
                stops.push({
                    target: s.target,
                    scrollMs: s.ms,
                    dwellMs: isMap ? 0 : COVER_DWELL_MS,
                    easing: COVER_EASING,
                });
            }
        });
        // First stop is usually scrollY≈0 (sentence 1 already in view) — skip its
        // zero-distance scroll but keep the dwell.
        if (stops.length > 0 && Math.abs(stops[0].target - currentY) < 5) {
            stops[0].scrollMs = 0;
        }
        if (stops.length) scrollSequence(stops);
    }

    // Cover stop scroll-positions (sentence centers), excluding the map landing.
    function coverSentenceTargets() {
        const stops = buildCoverStops();
        return stops.slice(0, -1).map(function (s) { return s.target; });
    }

    // Down-arrow tap:
    //  - Mobile (< 992px): ONE continuous slow scroll all the way to the map,
    //    easing speed down (not stopping) as each sentence crosses center.
    //  - Desktop: run the full automatic timed sequence (dwell at each sentence).
    const MOBILE_TRIP_MS = 9000; // total duration of the mobile glide to the map
    on('.bottom-arrow', 'click', function () {
        if (window.innerWidth < 992) {
            const mapTarget = computeMapTarget();
            if (mapTarget == null) return;
            scrollThroughSlowing(mapTarget, coverSentenceTargets(), MOBILE_TRIP_MS);
        } else {
            runCoverAutoSequence();
        }
    });

    // Keyboard step-through: Enter / Space / ArrowDown advance ONE stop at a
    // time (manual pacing, no dwell). From the landing, the first press centers
    // sentence 2 — sentence 1 sits at top:40% and can't be centered by scrolling
    // down, so it's the starting view — then sentence 3, then the map. Ignored
    // while typing in a control or when a modal is open.
    document.addEventListener('keydown', function (e) {
        const k = e.key;
        if (k !== 'Enter' && k !== ' ' && k !== 'Spacebar' && k !== 'ArrowDown') return;
        const t = e.target;
        if (t && t.closest && t.closest('input, textarea, select, button, a, [contenteditable]')) return;
        if (document.querySelector('.modal.show')) return;
        if (advanceOneCoverStop()) {
            e.preventDefault();
        }
        // else: already at/past the last stop — let the key do its default.
    });

    // ---------- Info-accordion: toggle column widths on open/close ----------
    on('.info-accordion', 'click', function () {
        const isCollapsed = this.classList.contains('collapsed');
        const otherCols = $$('.other-col');
        if (isCollapsed) {
            otherCols.forEach(function (el) {
                el.classList.remove('col-lg-3', 'this-col-change');
                el.classList.add('col-lg-6');
            });
        } else {
            otherCols.forEach(function (el) {
                el.classList.remove('col-lg-6');
                el.classList.add('col-lg-3', 'this-col-change');
            });
        }
        $$('.more-info').forEach(function (el) { el.style.display = 'none'; });
        $$('.read-more').forEach(function (el) { show(el); });
        $$('.info-col').forEach(function (el) {
            el.classList.remove('col-lg-6');
            el.classList.add('col-lg-3');
        });
    });

    // ---------- Description click: stop carousel, hide hover overlays ----------
    // (The image-swap loop on data-src is now dead — native loading="lazy" replaced it.)
    on('.description', 'click', function () {
        $$('.hover-map-overlay').forEach(function (el) { fadeOut(el, 100); });
        clearTimeout(carousel_start_handle);
        if (carousel_handle) {
            clearInterval(carousel_handle);
            carousel_handle = null;
        }
    });

    // ---------- Banner switch: toggle map-section <-> banner-section ----------
    let toggle_banner = false;

    // Land scroll position at the BOTTOM of `el`. The original jQuery flow was
    //   $(window).scrollTop(el.offset().top + el.outerHeight() - $(window).height())
    // fired synchronously inside the fadeOut() callback. The vanilla equivalent has
    // had repeated trouble landing at the right spot — depending on which transition
    // fires its callback first, scrollY can be auto-clamped, getBoundingClientRect
    // can return values from a layout that hasn't fully flushed yet, or the browser
    // can re-scroll behind us when the just-shown element gains focus or tab-stops.
    //
    // Robust approach: use Element.scrollIntoView({block:'end'}) — the spec-blessed
    // call that asks the browser to align the element's bottom with the viewport's
    // bottom. Then ALSO fire the legacy scrollTo(0, target) at multiple timings
    // (sync, after rAF, after setTimeout) so a clamp/race that affects one path
    // is covered by another.
    function scrollBottomTo(el) {
        if (!el) return;
        const tryScroll = function () {
            if (!el || !el.offsetParent && getComputedStyle(el).display === 'none') return;
            // 1. scrollIntoView with block:'end' — easiest correct semantics.
            try {
                el.scrollIntoView({ block: 'end', inline: 'nearest', behavior: 'auto' });
            } catch (_) {
                el.scrollIntoView(false);
            }
            // 2. Belt-and-suspenders: also compute the absolute target ourselves and
            //    issue a legacy two-arg scrollTo, which is always instant.
            const rect = el.getBoundingClientRect();
            const target = rect.top + window.scrollY + el.offsetHeight - window.innerHeight;
            window.scrollTo(0, Math.max(0, target));
        };
        // Fire immediately, after the next two animation frames, then again at
        // 100ms, 500ms and 1000ms. Mobile browsers (especially iOS Safari with
        // URL-bar transitions) can take significantly longer to settle layout
        // after a cover-hide + fadeOut + fadeIn chain than desktop browsers.
        tryScroll();
        requestAnimationFrame(function () {
            tryScroll();
            requestAnimationFrame(tryScroll);
        });
        setTimeout(tryScroll, 100);
        setTimeout(tryScroll, 500);
        setTimeout(tryScroll, 1000);
    }

    on('.banner-switch', 'click', function () {
        const mapSection = $1('.map-section');
        const bannerSection = $1('.banner-section');
        const cover = $1('.cover');

        if (!toggle_banner) {
            if (mapSection) {
                fadeOut(mapSection, 400, function () {
                    if (bannerSection) {
                        // Run the multi-attempt scroll AND request one final
                        // scroll inside fadeIn's completion callback, when
                        // layout is fully settled (especially needed on mobile
                        // where viewport/URL-bar transitions race the fade).
                        fadeIn(bannerSection, 800, function () {
                            scrollBottomTo(bannerSection);
                        });
                        scrollBottomTo(bannerSection);
                    }
                });
            }
            if (cover) cover.style.display = 'none';
            toggle_banner = true;
        } else {
            if (bannerSection) {
                fadeOut(bannerSection, 400, function () {
                    const onMapShown = function () {
                        scrollBottomTo($1('.scroll-to-map'));
                    };
                    if (mapSection) {
                        fadeIn(mapSection, 800, onMapShown);
                    }
                    if (cover) show(cover);
                    onMapShown();
                });
            }
            toggle_banner = false;
        }
    });

    // ---------- Zoom-icon clicks: cycle through zoom-level radio buttons ----------
    on('.zoom-icon', 'click', function (e) {
        let change = 1;
        if (e.target.classList.contains('plus-icon')) {
            change = -1;
        } else {
            change = 1;
        }
        clearTimeout(carousel_start_handle);
        clearInterval(carousel_handle);
        const options = ['#full', '#outer', '#near', '#close', '#near_galaxy_view'];
        const checkedEl1 = $1('input[name="options-outlined"]:checked');
        const checkedEl2 = $1('input[name="options-outlined2"]:checked');
        const checked = checkedEl1 ? checkedEl1.value : null;
        const other_checked = checkedEl2 ? checkedEl2.value : null;
        let true_checked = 0;
        const order = ['3', '2', '1', '4', '5'];
        if (checked != current_checked) {
            const r = $1('input[type="radio"][name="options-outlined2"][value="' + checked + '"]');
            if (r) r.checked = true;
            true_checked = checked;
        } else {
            const r = $1('input[type="radio"][name="options-outlined"][value="' + other_checked + '"]');
            if (r) r.checked = true;
            true_checked = other_checked;
        }
        const targetSel = options[mod(order.indexOf(true_checked) + change, 5)];
        const targetEl = $1(targetSel);
        if (targetEl) targetEl.checked = true;
        zoomlevel();
    });

    // ---------- Select-button hover: show the matching hover-map overlay ----------
    on('.select-button', 'mouseenter', function () {
        const id = this.id;
        if (current_checked == 3 && id == 'near_label') {
            overlay_show = '#near_from_full';
        } else if (current_checked == 3 && id == 'outer_label') {
            overlay_show = '#outer_from_full';
        } else if (current_checked == 2 && id == 'near_label') {
            overlay_show = '#near_from_outer';
        } else if (current_checked == 2 && (id == 'close_label' || id == 'near_galaxy_view_label')) {
            overlay_show = '#close_from_outer';
        } else if (current_checked == 3 && (id == 'close_label' || id == 'near_galaxy_view_label')) {
            overlay_show = '#close_from_full';
        } else if (current_checked == 1 && (id == 'close_label' || id == 'near_galaxy_view_label')) {
            overlay_show = '#close_from_near';
        } else {
            overlay_show = 'none';
        }
        if (overlay_show !== 'none') {
            const el = $1(overlay_show);
            if (el) show(el);
        }
    });
    on('.select-button', 'mouseleave', function () {
        if (overlay_show && overlay_show !== 'none') {
            const el = $1(overlay_show);
            if (el) el.style.display = 'none';
        }
    });

    // ---------- Any input change → zoomlevel() ----------
    $$('input').forEach(function (el) {
        el.addEventListener('change', function () {
            user_clicked = true;
            zoomlevel();
        });
    });

    // ---------- Zoom-button click clears the carousel timer ----------
    on('.zoom_button', 'click', function () {
        clearTimeout(carousel_start_handle);
        clearInterval(carousel_handle);
    });

    // ---------- Banner-switch hover: fade #overlay ----------
    on('.banner-switch-hover', 'mouseenter', function () {
        const o = document.getElementById('overlay');
        if (o) fadeIn(o, 100);
    });
    on('.banner-switch-hover', 'mouseleave', function () {
        const o = document.getElementById('overlay');
        if (o) fadeOut(o, 100);
    });

    // ---------- Term-hover inside banner-info-box: swap explanation/skyview imgs ----------
    on('.banner-info-box >p> .term-hover', 'mouseenter', function () {
        const parent = this.parentElement;
        if (!parent) return;
        const siblings = Array.from(parent.parentElement.children).filter(function (c) { return c !== parent; });
        siblings.forEach(function (s) {
            if (s.matches('img.explanation_image')) s.style.display = 'none';
            if (s.matches('img.skyview_image')) show(s);
        });
    });
    on('.banner-info-box >p> .term-hover', 'mouseleave', function () {
        const parent = this.parentElement;
        if (!parent) return;
        const siblings = Array.from(parent.parentElement.children).filter(function (c) { return c !== parent; });
        siblings.forEach(function (s) {
            if (s.matches('img.explanation_image')) show(s);
            if (s.matches('img.skyview_image')) s.style.display = 'none';
        });
    });

    // ---------- Scroll-driven effects (rAF-throttled) ----------
    const UNIVERSE_AGE_GYR = 13.7;
    let scroll_ticking = false;
    const mapbox = $1('.mapbox');
    const bannerOutline = $1('.banner-outline');
    const bannerNav = $1('.banner-navigator-section');
    const barContainer = $1('.bar_container');
    const lookbackA = document.getElementById('sidebar-lookback-time');
    const lookbackB = document.getElementById('sidebar-lookback-time_2');
    const scrollMsg = $1('.scroll-up-message');
    const fullRadio = document.getElementById('full');

    function onScroll() {
        const winH = window.innerHeight;
        const scrollY = window.scrollY;
        const bottomOfScreen = scrollY + winH;

        if (mapbox) {
            const rect = mapbox.getBoundingClientRect();
            const top_of_element = rect.top + scrollY;
            const bottom_of_element = top_of_element + mapbox.offsetHeight;
            if ((bottomOfScreen > top_of_element) && (scrollY < bottom_of_element)) {
                if (!animating) {
                    carousel_start_handle = setTimeout(carousel, CAROUSEL_START_DELAY_MS);
                    animating = true;
                }
            } else {
                if (fullRadio) fullRadio.checked = true;
                zoomlevel();
                clearTimeout(carousel_start_handle);
                clearInterval(carousel_handle);
                animating = false;
            }
        }

        if (bannerOutline) {
            const rect = bannerOutline.getBoundingClientRect();
            const elementTop = rect.top + scrollY;
            const bannerH = bannerOutline.offsetHeight;
            const percentage = Math.max(Math.min((scrollY - elementTop) / bannerH * 100, 100), 0);
            const bottomPercentage = Math.min((bottomOfScreen - elementTop) / bannerH * 100, 100);
            if (bannerNav) {
                bannerNav.style.top = percentage + '%';
                bannerNav.style.height = (bottomPercentage - percentage) + '%';
            }

            if (barContainer) {
                const barRect = barContainer.getBoundingClientRect();
                const barTop = barRect.top + scrollY;
                const barPercentage = (barTop - elementTop) / bannerH;
                const lookback = UNIVERSE_AGE_GYR - barPercentage * UNIVERSE_AGE_GYR;
                const lookbackStr = lookback.toFixed(1);
                if (lookbackA) lookbackA.innerHTML = lookbackStr;
                if (lookbackB) lookbackB.innerHTML = lookbackStr;
            }
        }

        const docH = document.documentElement.scrollHeight;
        const scrollPercent = docH > winH ? scrollY / (docH - winH) : 0;
        if (scrollMsg) scrollMsg.style.opacity = String(1 - (1 - scrollPercent) * 6);

        const center = scrollY + winH * 0.5;
        const halfWin = winH * 0.5;
        $$('.fade').forEach(function (el) {
            const r = el.getBoundingClientRect();
            const offset = r.top + scrollY + el.offsetHeight / 2;
            const perc = Math.pow((center - offset) / halfWin, 2);
            el.style.opacity = String(1 - perc);
        });

        scroll_ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!scroll_ticking) {
            window.requestAnimationFrame(onScroll);
            scroll_ticking = true;
        }
    }, { passive: true });

    // ---------- Banner-info-box click → open modal with the right picture ----------
    on('.banner-info-box', 'click', function () {
        const modalEl = document.getElementById('myModal');
        if (modalEl && window.bootstrap && bootstrap.Modal) {
            bootstrap.Modal.getOrCreateInstance(modalEl).toggle();
        }
        set_modal_pic(this.id);
    });

    // ---------- Reset modal contents when it hides ----------
    const myModalEl = document.getElementById('myModal');
    if (myModalEl) {
        myModalEl.addEventListener('hidden.bs.modal', function () {
            set_modal_pic(-1);
        });
    }

    // ---------- Banner-navigator click: scroll to corresponding lookback time ----------
    on('.banner-navigator, .edit', 'click', function (e) {
        const parent = this.parentElement;
        if (!parent) return;
        const parentRect = parent.getBoundingClientRect();
        const parentTopAbs = parentRect.top + window.scrollY;
        const height = parent.offsetHeight;
        if (!height) return;
        const percentage = (e.pageY - parentTopAbs) / height;
        const outline = $1('.banner-outline');
        if (!outline) return;
        const outRect = outline.getBoundingClientRect();
        const outlineTopAbs = outRect.top + window.scrollY;
        const pixelposition = outlineTopAbs + outline.offsetHeight * percentage - (window.innerHeight / 2);
        window.scrollTo({ top: pixelposition, left: 0, behavior: 'smooth' });
    });

    // ---------- Outside-click: close collapses, reset column widths ----------
    document.addEventListener('click', function (event) {
        const target = event.target;
        if (target instanceof Element &&
            !target.closest('.info-box') &&
            !target.closest('.accordion-button') &&
            !target.closest('.zoom-container')) {
            // Hide all currently-open Bootstrap collapses.
            $$('.collapse.show').forEach(function (el) {
                if (window.bootstrap && bootstrap.Collapse) {
                    bootstrap.Collapse.getOrCreateInstance(el, { toggle: false }).hide();
                } else {
                    el.classList.remove('show');
                }
            });
            $$('.more-info').forEach(function (el) { el.style.display = 'none'; });

            $$('.other-col').forEach(function (el) {
                el.classList.remove('col-lg-3');
                el.classList.add('col-lg-6');
            });
            $$('.this-col').forEach(function (el) {
                el.classList.remove('col-lg-6');
                el.classList.add('col-lg-3');
            });
            $$('.other-col-2').forEach(function (el) {
                el.classList.remove('col-lg-6');
                el.classList.add('col-lg-8');
            });
            $$('.this-col-2').forEach(function (el) {
                el.classList.remove('col-lg-6');
                el.classList.add('col-lg-4');
            });
        }
        $$('.download-click-section').forEach(function (el) { el.style.display = 'none'; });
    });

    // ---------- carousel(): cycle hover overlays + zoom levels ----------
    function carousel() {
        const options = ['#outer', '#near', '#close', '#near_galaxy_view', '#full'];
        const hover_options = ['#outer_from_full', '#near_from_outer', '#close_from_near', '#Galaxy_View'];
        let option_index = 0;

        carousel_handle = setInterval(function () {
            if (option_index % 2 || option_index == 6) {
                if (option_index == 7) {
                    option_index = 8;
                }
                const hov = $1(hover_options[Math.floor(option_index / 2)]);
                if (hov) fadeOut(hov, 400); // jQuery default fadeOut() = 400ms

                const opt = $1(options[Math.floor(option_index / 2)]);
                if (opt) opt.checked = true;
                zoomlevel();
            } else {
                const hov = $1(hover_options[Math.floor(option_index / 2)]);
                if (hov) fadeIn(hov, 300);
            }

            option_index += 1;
            option_index = option_index % 9;
        }, 3000);
    }

    // ---------- set_modal_pic: data-driven, accepts banner-info-N or phone-banner-N ----------
    // The selectors MUST be scoped to #myModal — otherwise querySelector returns
    // the first match in the document, which is #creditModal's .modal-header > h1
    // and .modal-footer > p (since #creditModal appears before #myModal in DOM
    // order). The original jQuery code worked accidentally because $(sel).text()
    // updates EVERY matching element, but querySelector returns only the first.
    function set_modal_pic(id) {
        const myModal = document.getElementById('myModal');
        if (!myModal) return;
        const modalImg = $1('.modal-body > img', myModal);
        const modalH1  = $1('.modal-header > h1', myModal);
        const modalP   = $1('.modal-footer > p', myModal);

        let key = null;
        if (typeof id === 'string') {
            const m = id.match(/^(?:banner-info-|phone-banner-)(\d+)$/);
            if (m) key = parseInt(m[1], 10);
        }
        const info = key !== null ? modal_info[key] : null;
        if (info) {
            if (modalImg) modalImg.src = info.img;
            if (modalH1)  modalH1.textContent  = info.header;
            if (modalP)   modalP.textContent   = info.caption;
        } else {
            if (modalImg) modalImg.src = '';
            if (modalH1)  modalH1.textContent  = '';
            if (modalP)   modalP.textContent   = '';
        }
    }

    // ---------- zoomlevel(): swap the visible axis-set with a brief fade-through black ----------
    // Matches the original jQuery flow exactly: fadeIn(blackOverlay), THEN inside the
    // completion callback hide hover overlays + old axis_set, show new axis_set, fadeOut(blackOverlay).
    // (jQuery's $.fadeIn("fast") = 200 ms, hence the 200 here.)
    function zoomlevel() {
        const checkedEl1 = $1('input[name="options-outlined"]:checked');
        const checkedEl2 = $1('input[name="options-outlined2"]:checked');
        const checked = checkedEl1 ? checkedEl1.value : null;
        const other_checked = checkedEl2 ? checkedEl2.value : null;
        let true_checked = 0;

        if (checked != current_checked) {
            const r = $1('input[type="radio"][name="options-outlined2"][value="' + checked + '"]');
            if (r) r.checked = true;
            true_checked = checked;
        } else {
            const r = $1('input[type="radio"][name="options-outlined"][value="' + other_checked + '"]');
            if (r) r.checked = true;
            true_checked = other_checked;
        }

        let axis_overlay;
        if (true_checked == 1) {
            axis_overlay = '#axis_set_03';
        } else if (true_checked == 2) {
            axis_overlay = '#axis_set_02';
        } else if (true_checked == 4) {
            axis_overlay = '#axis_set_04';
        } else if (true_checked == 5) {
            axis_overlay = '#axis_set_05';
        } else {
            axis_overlay = '#axis_set_01';
        }

        const blackOverlay = document.getElementById('black-overlay');
        if (!blackOverlay) {
            // Even without the black overlay, perform the swap.
            $$('.hover-map-overlay').forEach(function (el) { el.style.display = 'none'; });
            const oldVis = $1(visible_overlay);
            if (oldVis) oldVis.style.display = 'none';
            const newVis = $1(axis_overlay);
            if (newVis) show(newVis);
            visible_overlay = axis_overlay;
            current_checked = true_checked;
            return;
        }

        fadeIn(blackOverlay, 200, function () {
            // Black overlay is fully opaque — now swap behind it.
            $$('.hover-map-overlay').forEach(function (el) { el.style.display = 'none'; });
            const oldVis = $1(visible_overlay);
            if (oldVis) oldVis.style.display = 'none';
            const newVis = $1(axis_overlay);
            if (newVis) show(newVis);
            visible_overlay = axis_overlay;
            current_checked = true_checked;
            fadeOut(blackOverlay, 200);
        });
    }

    // ---------- Data tables (numeric keys + content fields preserved verbatim) ----------
    var information = {
        1: {title: "宇宙微波背景辐射", caption: "这是大爆炸后不久、137亿年前发出的第一道闪光的真实照片。宇宙的膨胀拉伸了这道光，使它如今以微波射电波的形式到达我们这里。它标志着可观测宇宙的边缘。", img: "Images/Explanations/cmb_illust.png"},
        2: {title: "类星体", caption: "类星体是位于某些星系中心的超大质量黑洞。当它们吸积周围的气体时，会变得极其明亮，可以在整个宇宙中被观测到。它们的光呈蓝色。在这些距离上，星系已经太暗，斯隆数字巡天望远镜无法探测到。", img: "Images/Explanations/Quasar@300x.png" },
        3: {title: "明亮红星系", caption: "明亮红星系是质量巨大的椭圆星系，亮度是银河系的数百倍。它们古老而温度较低的恒星使其呈现明显的偏红色，而其亮度让我们能够在数十亿光年之外看到它们。", img: "Images/Explanations/Redshift@300x.png"},
        4: {title: "近处星系", caption: "每个点都是一个星系。它们共同组成了丝状结构。旋涡星系暗淡且呈蓝色。椭圆星系呈黄色且明亮得多，因此我们可以在更远处看到它们。", img: "Images/Explanations/Near_placeholder.png" },
        5: {title: "红移", caption: "随着宇宙膨胀，朝我们传来的光被拉伸。这使其波长向光谱的红色端偏移——也就是天文学家所说的红移。天体越遥远，它的光被拉伸得越多，看起来也就越红。", img: "Images/Explanations/Redshift@300x.png"},
        6: {title: "回溯时间", caption: "光的传播需要时间。当我们观察一个遥远的天体时，看到的是它的光最初出发时的样子。这段延迟就是回溯时间。我们看得越远，看到的就是越久远的过去。", img: "Images/Explanations/Lookback Time@300x.png" },
        7: {title: "天球角度", caption: "地图展示的是天空中一个约10°宽的薄片。完整的巡天覆盖了更大的区域，但二维地图无法一次性全部展示，否则图像会被密密麻麻的点填满。", img: "Images/Explanations/Lookback Time@300x.png" },
        8: {title: "你在这里", caption: "我们目前位于本星系群、银河系、猎户臂、太阳系、地球上。", img: "Images/Explanations/You are Here@300x.png" },
        9: {title: "星系", caption: "星系是由恒星、气体、尘埃和暗物质组成的庞大系统，被引力束缚在一起。每个星系包含数百万到数万亿颗恒星。大多数大型星系的中心都有一个超大质量黑洞。", img: "Images/Explanations/Galaxies_wikipedia cropped.png" },
    };

    var modal_info = {
        1: {img: "https://menard.pha.jhu.edu/MapoftheUniverse/Images/Skyview/V_01/cmb.jpeg", header: "宇宙微波背景辐射", caption: "这是大爆炸后不久、137亿年前发出的第一道闪光的真实照片。这道光已被宇宙的膨胀拉伸，以射电波的形式到达我们这里。这就是可观测宇宙的边缘。"},
        2: {img: "https://menard.pha.jhu.edu/MapoftheUniverse/Images/Skyview/V_01/12.jpeg", header: "红移类星体", caption: "在这些距离上，宇宙的膨胀如此剧烈，以至于类星体发出的蓝色光子被拉伸而显得更红。再远一些，我们会遇到一个时期——宇宙中充满了氢气，阻止了我们今天本可观测到的可见光的传播。这个时期被称为“黑暗时代”。"},
        3: {img: "https://menard.pha.jhu.edu/MapoftheUniverse/Images/Skyview/V_01/8.5.jpg", header: "类星体", caption: "类星体是位于某些星系中心的超大质量黑洞。当它们吸积周围的气体和恒星时，会变得极其明亮，可以在整个宇宙中被观测到。它们的光呈蓝色。"},
        4: {img: "https://menard.pha.jhu.edu/MapoftheUniverse/Images/Skyview/V_01/4.5.jpeg", header: "红移椭圆星系", caption: "随着宇宙膨胀，光子被拉伸，天体看起来更红。椭圆星系就是这种情况。在这些距离上，它们在我们看来呈红色。由于我们不再能探测到较暗的旋涡星系，丝状结构变得不太明显。"},
        5: {img: "https://menard.pha.jhu.edu/MapoftheUniverse/Images/Skyview/V_01/1.8.jpeg", header: "椭圆星系", caption: "椭圆星系呈黄色，比旋涡星系明亮得多。我们可以在更远处看到它们。"},
        6: {img: "https://menard.pha.jhu.edu/MapoftheUniverse/Images/Skyview/V_01/0.1.jpeg", header: "旋涡星系", caption: "每个点都是一个以其表观颜色显示的星系。旋涡星系较暗且呈蓝色。我们的银河系就是一个蓝色的旋涡星系，如果我们能从外部观察它，它看起来就像其中之一。"},
    };
})();
