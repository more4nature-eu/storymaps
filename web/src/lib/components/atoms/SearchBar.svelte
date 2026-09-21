<!-- src/lib/components/ui/SearchBar.svelte -->
<script lang="ts">
    let { 
        placeholder = "Look for a place or activity...",
        onselectplace
    } = $props<{
        placeholder?: string;
        onselectplace?: (place: { name: string; lng: number; lat: number; bbox?: [number, number, number, number] }) => void;
    }>();

    let query = $state("");
    let results = $state<any[]>([]);
    let isLoading = $state(false);
    let showDropdown = $state(false);
    let debounceTimer: ReturnType<typeof setTimeout>;

    async function searchPlaces(q: string) {
        if (!q.trim() || q.length < 2) {
            results = [];
            showDropdown = false;
            return;
        }

        isLoading = true;

        try {
            const viewbox = "0.15,40.52,3.33,42.86";
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=es&viewbox=${viewbox}&bounded=0&limit=5`;

            const res = await fetch(url);
            const data = await res.json();
            results = data;
            showDropdown = true;
        } catch (error) {
            console.error("Error cercant llocs:", error);
        } finally {
            isLoading = false;
        }
    }

    function handleInput(e: Event) {
        const value = (e.target as HTMLInputElement).value;
        query = value;

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            searchPlaces(query);
        }, 300);
    }

    function selectPlace(place: any) {
        query = place.display_name.split(",")[0]; 
        showDropdown = false;

        const lng = parseFloat(place.lon);
        const lat = parseFloat(place.lat);

        let bbox: [number, number, number, number] | undefined = undefined;
        if (place.boundingbox) {
            bbox = [
                parseFloat(place.boundingbox[2]), // west
                parseFloat(place.boundingbox[0]), // south
                parseFloat(place.boundingbox[3]), // east
                parseFloat(place.boundingbox[1])  // north
            ];
        }

        if (onselectplace) {
            onselectplace({
                name: place.display_name,
                lng,
                lat,
                bbox
            });
        }
    }
    
</script>

<div class="search-container">
    <div class="input-wrapper">
        <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>

        <input
            type="text"
            value={query}
            oninput={handleInput}
            onfocus={() => query.length >= 2 && (showDropdown = true)}
            {placeholder}
        />

        {#if isLoading}
            <div class="spinner"></div>
        {/if}
    </div>

    {#if showDropdown && results.length > 0}
        <ul class="dropdown">
            {#each results as place}
                <li>
                    <button type="button" onclick={() => selectPlace(place)}>
                        <span class="place-name">{place.display_name.split(",")[0]}</span>
                        <span class="place-details">{place.display_name.split(",").slice(1, 3).join(",")}</span>
                    </button>
                </li>
            {/each}
        </ul>
    {/if}
</div>

<style>
    .search-container {
        position: relative;
        width: 280px;
        font-family: var(--font-sans, sans-serif);
    }

    .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 6px;
        padding: 0 0.65rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .search-icon {
        color: #666;
        margin-right: 0.5rem;
    }

    input {
        width: 100%;
        padding: 0.55rem 0;
        border: none !important;
        outline: none !important;
        background: transparent !important;
        font-size: 0.875rem;
        color: #1a1a1a;
        box-shadow:none !important;
    }

    .dropdown {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        right: 0;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        list-style: none;
        margin: 0;
        padding: 0.25rem 0;
        max-height: 220px;
        overflow-y: auto;
        z-index: 2000;
    }

    .dropdown li button {
        width: 100%;
        text-align: left;
        padding: 0.5rem 0.85rem;
        border: none;
        background: transparent;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        transition: background 0.15s ease;
    }

    .dropdown li button:hover {
        background: #f0f4f0;
    }

    .place-name {
        font-weight: 600;
        font-size: 0.85rem;
        color: #1a1a1a;
    }

    .place-details {
        font-size: 0.725rem;
        color: #666;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .spinner {
        width: 14px;
        height: 14px;
        border: 2px solid #ccc;
        border-top-color: #333;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
</style>