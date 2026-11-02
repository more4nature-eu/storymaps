<!-- src/lib/components/organisms/EvidenceMosaic.svelte -->
<!--
  Mosaic Deep Zoom (OpenSeadragon) amb cercador i filtres.
  Les fotos que no coincideixen es tapen amb una capa SVG semitransparent
  dibuixada a sobre del mosaic: no cal tornar a generar tessel·les.
-->
<script lang="ts">
    import { onMount } from 'svelte';

    interface Item {
        i: number; // posició al mosaic
        id?: string;
        sub1?: string;
        sub2?: string;
        group?: string;
        date?: string;
        place?: string;
    }
    interface MosaicIndex {
        cols: number;
        rows: number;
        cellW: number;
        cellH: number;
        items: Item[];
    }

    let {
        dziUrl,
        indexUrl,
        dimOpacity = 0.85,
        placeholder = 'Search the evidence…',
        // Categories (Subcategory1) que surten primer, en aquest ordre
        featuredCategories = ['Logging', 'Illegal hunting', 'ELC mining', 'Illegal fishing', 'ELC plantation'],
        // Tipus (Subcategory2) que es mostren com a botons; la resta es poden trobar amb el cercador
        featuredTypes = ['Transport', 'Stump', 'Planks']
    }: {
        dziUrl: string;
        indexUrl: string;
        dimOpacity?: number;
        placeholder?: string;
        featuredCategories?: string[];
        featuredTypes?: string[];
    } = $props();

    let container: HTMLDivElement;
    // Reactiu: quan OpenSeadragon crea l'overlay, l'efecte de dibuix es torna a executar
    let dimPath = $state.raw<SVGPathElement | null>(null);

    let index = $state.raw<MosaicIndex | null>(null);
    let query = $state('');
    let categoria = $state<string | null>(null);
    let tipus = $state<string | null>(null);
    let grup = $state('');

    const norm = (s?: string) => (s ?? '').trim().toLowerCase();

    // Categories: primer les destacades (si existeixen a les dades), després la resta
    const categories = $derived.by(() => {
        if (!index) return [];
        const presents = new Map<string, string>();
        for (const d of index.items) if (d.sub1) presents.set(norm(d.sub1), d.sub1);

        const destacades = featuredCategories.filter((c) => presents.has(norm(c)));
        const resta = [...presents.values()]
            .filter((v) => !featuredCategories.some((c) => norm(c) === norm(v)))
            .sort();
        return [...destacades, ...resta];
    });

    // Tipus: només els destacats que existeixen a les dades
    const tipusList = $derived.by(() => {
        if (!index) return [];
        const presents = new Set(index.items.map((d) => norm(d.sub2)));
        return featuredTypes.filter((t) => presents.has(norm(t)));
    });

    // Grups d'usuaris per al desplegable
    const grups = $derived(
        index ? [...new Set(index.items.map((d) => d.group).filter(Boolean) as string[])].sort() : []
    );

    // null = sense filtre (es veu tot); si no, el conjunt de posicions que coincideixen
    const matches = $derived.by(() => {
        if (!index) return null;
        const q = norm(query);
        if (!q && !categoria && !tipus && !grup) return null;

        const set = new Set<number>();
        for (const d of index.items) {
            if (categoria && norm(d.sub1) !== norm(categoria)) continue;
            if (tipus && norm(d.sub2) !== norm(tipus)) continue;
            if (grup && d.group !== grup) continue;
            if (q) {
                const text = [d.id, d.sub1, d.sub2, d.group, d.date, d.place].filter(Boolean).join(' ').toLowerCase();
                if (!text.includes(q)) continue;
            }
            set.add(d.i);
        }
        return set;
    });

    const total = $derived(index?.items.length ?? 0);
    const visibles = $derived(matches ? matches.size : total);
    const filtresActius = $derived(!!(query || categoria || tipus || grup));

    function netejaFiltres() {
        query = '';
        categoria = null;
        tipus = null;
        grup = '';
    }

    // Dibuixa UN sol path amb un rectangle per cada foto que NO coincideix
    $effect(() => {
        const m = matches;
        const idx = index;
        if (!dimPath || !idx) return;

        if (!m) {
            dimPath.setAttribute('d', '');
            return;
        }

        const { cols, cellW: w, cellH: h } = idx;
        let d = '';
        for (const item of idx.items) {
            if (m.has(item.i)) continue;
            const x = (item.i % cols) * w;
            const y = Math.floor(item.i / cols) * h;
            d += `M${x} ${y}h${w}v${h}h${-w}z`;
        }
        dimPath.setAttribute('d', d);
    });

    onMount(() => {
        let viewer: any;
        let cancelled = false;

        (async () => {
            const [{ default: OpenSeadragon }, res] = await Promise.all([
                import('openseadragon'),
                fetch(indexUrl)
            ]);
            const idx: MosaicIndex = await res.json();
            if (cancelled) return;
            index = idx;

            viewer = OpenSeadragon({
                element: container,
                tileSources: dziUrl,
                showNavigationControl: false,
                visibilityRatio: 1,
                constrainDuringPan: true,
                minZoomImageRatio: 1,
                gestureSettingsMouse: { scrollToZoom: true, clickToZoom: false },
                gestureSettingsTouch: { pinchToZoom: true, flickEnabled: true }
            });

            viewer.addHandler('open', () => {
                const W = idx.cols * idx.cellW;
                const H = idx.rows * idx.cellH;
                const ns = 'http://www.w3.org/2000/svg';

                const svg = document.createElementNS(ns, 'svg');
                svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
                svg.setAttribute('preserveAspectRatio', 'none');
                svg.classList.add('ev-overlay');

                const path = document.createElementNS(ns, 'path');
                path.classList.add('ev-dim');
                path.style.fillOpacity = String(dimOpacity);
                svg.appendChild(path);
                dimPath = path;

                // L'overlay ocupa exactament tota la imatge i OpenSeadragon l'escala amb el zoom
                viewer.addOverlay({
                    element: svg,
                    location: viewer.viewport.imageToViewportRectangle(0, 0, W, H)
                });
            });
        })();

        return () => {
            cancelled = true;
            dimPath = null;
            viewer?.destroy();
        };
    });
</script>

<div class="ev-mosaic">
    <div class="ev-controls">
        <div class="ev-row">
            <div class="ev-search">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" aria-hidden="true">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                    type="search"
                    class="ev-input browser-default"
                    bind:value={query}
                    {placeholder}
                    aria-label={placeholder}
                    enterkeyhint="search"
                    autocomplete="off"
                />
            </div>

            {#if grups.length}
                <select class="ev-select browser-default" bind:value={grup} aria-label="Filter by user group">
                    <option value="">All user groups</option>
                    {#each grups as g (g)}
                        <option value={g}>{g}</option>
                    {/each}
                </select>
            {/if}
        </div>

        {#if categories.length}
            <div class="ev-chips" role="group" aria-label="Filter by activity">
                <button type="button" class="ev-chip" class:ev-active={!categoria} onclick={() => (categoria = null)}>All activities</button>
                {#each categories as c (c)}
                    <button type="button" class="ev-chip" class:ev-active={categoria === c} onclick={() => (categoria = categoria === c ? null : c)}>
                        {c}
                    </button>
                {/each}
            </div>
        {/if}

        {#if tipusList.length}
            <div class="ev-chips ev-chips-sec" role="group" aria-label="Filter by type">
                {#each tipusList as t (t)}
                    <button type="button" class="ev-chip" class:ev-active={tipus === t} onclick={() => (tipus = tipus === t ? null : t)}>
                        {t}
                    </button>
                {/each}
            </div>
        {/if}

        <div class="ev-row ev-status">
            <p class="ev-count" aria-live="polite">
                {#if matches}
                    <strong>{visibles.toLocaleString('en')}</strong> of {total.toLocaleString('en')} records
                {:else}
                    {total.toLocaleString('en')} records
                {/if}
            </p>
            {#if filtresActius}
                <button type="button" class="ev-reset" onclick={netejaFiltres}>Clear filters</button>
            {/if}
        </div>
    </div>

    <div class="ev-viewer" bind:this={container}></div>
</div>

<style>
    .ev-mosaic {
        width: 100%;
        font-family: var(--font-sans, system-ui, sans-serif);
        color: var(--text-main, #243b4a);
    }

    .ev-controls {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        max-width: 900px;
        margin: 0 auto 0.75rem;
        padding: 0 1rem;
    }

    .ev-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem 0.75rem;
    }

    /* ---------- Cercador (reset per al CMS) ---------- */
    .ev-search {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1 1 240px;
        min-height: 44px;
        box-sizing: border-box;
        padding: 0 0.75rem;
        background: #fff;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 6px;
        color: #666;
    }
    .ev-search:focus-within {
        border-color: var(--text-main, #243b4a);
    }
    .ev-search input.ev-input {
        all: unset;
        flex: 1;
        min-width: 0;
        padding: 0.55rem 0;
        font: inherit;
        font-size: 0.9rem;
        color: #1a1a1a;
    }
    .ev-search input.ev-input::placeholder {
        color: #888;
    }

    /* ---------- Desplegable de grups (reset per al CMS) ---------- */
    .ev-row select.ev-select {
        all: unset;
        display: block;
        box-sizing: border-box;
        flex: 0 1 220px;
        min-height: 44px;
        padding: 0 2rem 0 0.75rem;
        background-color: #fff;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23666' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 0.75rem center;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 6px;
        font: inherit;
        font-size: 0.85rem;
        color: #1a1a1a;
        cursor: pointer;
        align-items: center;
    }
    .ev-row select.ev-select:focus-visible {
        outline: 2px solid var(--text-main, #243b4a);
        outline-offset: 2px;
    }

    /* ---------- Xips ---------- */
    .ev-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
    }
    .ev-chips button.ev-chip {
        all: unset;
        box-sizing: border-box;
        padding: 0.35rem 0.75rem;
        border: 1px solid var(--text-main, #243b4a);
        border-radius: 999px;
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-main, #243b4a);
        cursor: pointer;
        transition: background 0.15s ease, color 0.15s ease;
    }
    .ev-chips button.ev-chip.ev-active {
        background: var(--text-main, #243b4a);
        color: #fff;
    }
    .ev-chips button.ev-chip:focus-visible {
        outline: 2px solid var(--text-main, #243b4a);
        outline-offset: 2px;
    }
    /* Els tipus, una mica més discrets que les activitats */
    .ev-chips-sec button.ev-chip {
        border-style: dashed;
        font-weight: 500;
    }

    .ev-status {
        justify-content: space-between;
    }
    .ev-count {
        margin: 0;
        font-size: 0.8rem;
        opacity: 0.8;
    }
    .ev-row button.ev-reset {
        all: unset;
        font-size: 0.8rem;
        text-decoration: underline;
        text-underline-offset: 2px;
        cursor: pointer;
    }

    /* ---------- Visor ---------- */
    .ev-viewer {
        width: 100%;
        height: 65svh;
        background: var(--bg-color, #fff);
    }
    .ev-viewer :global(.ev-overlay) {
        pointer-events: none;
    }
    .ev-viewer :global(.ev-dim) {
        fill: var(--bg-color, #fff);
    }

    @media (pointer: coarse) {
        .ev-search input.ev-input,
        .ev-row select.ev-select {
            font-size: 16px; /* evita el zoom automàtic de l'iPhone */
        }
        .ev-chips button.ev-chip {
            padding: 0.5rem 0.85rem;
        }
    }
</style>