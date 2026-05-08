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
    // The user wants to land on the map with BOTH "angle on the sky" (top axis
    // label) and "you are here" (bottom axis label) readable. Targeting
    // `.scroll-to-map` and centering its box can drift either way (top label
    // clipped, or bottom label clipped) because of padding/positioning around
    // the .mapbox child. Instead, measure the labels themselves and place
    // the scroll so the bottom label sits at the bottom of the viewport, then
    // back off if the top label would be clipped above.
    on('.bottom-arrow', 'click', function () {
        const youAreHere = $1('.you-are-here-axis');
        const angleOnSky = $1('.angle-on-sky-axis');
        const winHeight = window.innerHeight;
        let scrollTarget;
        if (youAreHere && angleOnSky) {
            const yhRect = youAreHere.getBoundingClientRect();
            const asRect = angleOnSky.getBoundingClientRect();
            const yhBottomPageY = yhRect.bottom + window.scrollY;
            const asTopPageY = asRect.top + window.scrollY;
            // Anchor: place "you are here" at the viewport bottom (matches the
            // original jQuery intent of landing at the bottom of the map).
            const anchored = yhBottomPageY - winHeight;
            // If "angle on the sky" would be clipped (above viewport.top),
            // back off so it just enters the viewport. This loses the strict
            // bottom-alignment but is what the user explicitly asked for.
            scrollTarget = Math.min(anchored, asTopPageY);
        } else {
            // Fallback if labels aren't in the DOM for some reason.
            const target = $1('.scroll-to-map');
            if (!target) return;
            const rect = target.getBoundingClientRect();
            scrollTarget = rect.top + window.scrollY + target.offsetHeight - winHeight;
        }
        scrollTarget = Math.max(0, scrollTarget);
        window.scrollTo({ top: scrollTarget, left: 0, behavior: 'smooth' });
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
        // Fire immediately (in case layout is already settled),
        // then again after the next two animation frames (covers paint races),
        // then once more after a short timeout (covers everything else).
        tryScroll();
        requestAnimationFrame(function () {
            tryScroll();
            requestAnimationFrame(tryScroll);
        });
        setTimeout(tryScroll, 100);
    }

    on('.banner-switch', 'click', function () {
        const mapSection = $1('.map-section');
        const bannerSection = $1('.banner-section');
        const cover = $1('.cover');

        if (!toggle_banner) {
            if (mapSection) {
                fadeOut(mapSection, 400, function () {
                    if (bannerSection) {
                        fadeIn(bannerSection, 800);
                        // Land at the bottom of the banner — the Milky Way / present time —
                        // so the user scrolls UP to "travel through the universe" (the page intent).
                        scrollBottomTo(bannerSection);
                    }
                });
            }
            if (cover) cover.style.display = 'none';
            toggle_banner = true;
        } else {
            if (bannerSection) {
                fadeOut(bannerSection, 400, function () {
                    if (mapSection) fadeIn(mapSection, 800);
                    if (cover) show(cover);
                    scrollBottomTo($1('.scroll-to-map'));
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
                    carousel();
                    animating = true;
                }
            } else {
                if (fullRadio) fullRadio.checked = true;
                zoomlevel();
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
    function set_modal_pic(id) {
        const modalImg = $1('.modal-body > img');
        const modalH1  = $1('.modal-header > h1');
        const modalP   = $1('.modal-footer > p');

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
        1: {title: "The Cosmic Microwave Background", caption: "This is an actual photograph of the first flash of light emitted soon after the Big Bang, 13.7 billion years ago. The expansion of the Universe has stretched this light, so it now reaches us as microwave radio waves. It marks the edge of the observable Universe.", img: "Images/Explanations/cmb_illust.png"},
        2: {title: "Quasars", caption: "Quasars are massive black holes at the centers of certain galaxies. As they accrete surrounding gas, they become extremely bright and can be seen across the Universe. Their light is blueish. At these distances, galaxies have become too faint for the Sloan Digital Sky Survey telescope to detect.", img: "Images/Explanations/Quasar@300x.png" },
        3: {title: "Luminous Red Galaxy", caption: "Luminous Red Galaxies are massive elliptical galaxies hundreds of times brighter than the Milky Way. Their old, cool stars give them a distinctly reddish color, and their brightness lets us see them billions of light years away.", img: "Images/Explanations/Redshift@300x.png"},
        4: {title: "Near Galaxies", caption: "Each dot is a galaxy. Together they form a filamentary structure. Spiral galaxies are faint and blue. Elliptical galaxies are yellowish and much brighter, so we can see them farther away.", img: "Images/Explanations/Near_placeholder.png" },
        5: {title: "Redshift", caption: "As the Universe expands, light traveling toward us gets stretched. This shifts its wavelength toward the red end of the spectrum — what astronomers call redshift. The more distant an object, the more its light is stretched, and the redder it appears.", img: "Images/Explanations/Redshift@300x.png"},
        6: {title: "Lookback Time", caption: "Light takes time to travel. When we look at a distant object, we see it as it was when its light first set out. This delay is the lookback time. The farther we look, the further back in time we see.", img: "Images/Explanations/Lookback Time@300x.png" },
        7: {title: "Angle on the Sky", caption: "The map shows a thin slice of the sky, about 10° wide. The full survey covers a larger region, but a 2D map could not display it all at once without saturating the image with dots.", img: "Images/Explanations/Lookback Time@300x.png" },
        8: {title: "You are Here", caption: "We are currently in the Local Group, in the Milky Way galaxy, in the Orion Arm, in the Solar System, on Planet Earth.", img: "Images/Explanations/You are Here@300x.png" },
        9: {title: "Galaxies", caption: "A galaxy is a vast system of stars, gas, dust, and dark matter held together by gravity. Each contains millions to trillions of stars. Most large galaxies host a supermassive black hole at their center.", img: "Images/Explanations/Galaxies_wikipedia cropped.png" },
    };

    var modal_info = {
        1: {img: "https://menard.pha.jhu.edu/MapoftheUniverse/Images/Skyview/V_01/cmb.jpeg", header: "the cosmic microwave background", caption: "This is an actual photograph of the first flash of light emitted soon afterthe big bang, 13.7 billion years ago. This light has been stretched by the expansion of the Universe and arrives at us as radiowaves. This is the edge of the observable Universe."},
        2: {img: "https://menard.pha.jhu.edu/MapoftheUniverse/Images/Skyview/V_01/12.jpeg", header: "redshifted quasars", caption: " At these distances, the expansion of the Universe is so great that the blue photons from quasars get stretched and appear redder. A bit farther, we encounter an epoch during which the Universe is filled with hydrogen gas that prevents the propagation of visible light we could observe today. This epoch is called the \"dark ages\"."},
        3: {img: "https://menard.pha.jhu.edu/MapoftheUniverse/Images/Skyview/V_01/8.5.jpg", header: "quasars", caption: "Quasars are massive black holes located at the center of certain galaxies. As they accrete surrounding gas and stars, they become extremely bright and can be seen across the Universe. Their light is blueish."},
        4: {img: "https://menard.pha.jhu.edu/MapoftheUniverse/Images/Skyview/V_01/4.5.jpeg", header: "redshifted elliptical galaxies", caption: "As the Universe expands, photons gets stretched and objects appear redder. This is the case for the elliptical galaxies. At these distances, they appear red to us.As we no longer detect the fainter spiral galaxies, the filamentary structure is less visible."},
        5: {img: "https://menard.pha.jhu.edu/MapoftheUniverse/Images/Skyview/V_01/1.8.jpeg", header: "elliptical galaxies", caption: "Elliptical galaxies are yellowish and much brighter than spiral galaxies. We can see them farther away."},
        6: {img: "https://menard.pha.jhu.edu/MapoftheUniverse/Images/Skyview/V_01/0.1.jpeg", header: "spiral galaxies", caption: "Each dot is a galaxy shown with its apparent color. Spiral galaxies are faint and blue. Our galaxy, the Milky Way, is a blue spiral that would look like one of these if we could observe it from the outside."},
    };
})();
