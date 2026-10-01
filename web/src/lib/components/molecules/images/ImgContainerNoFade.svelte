<script lang="ts">
    import { onMount } from 'svelte';

    interface ImgProps {
        imgSrc: string;
        alt?: string;
        caption?: string;
        credits?: string;
        size?: 'wide' | 'full';
        isLcp?: boolean;
        aspectRatio?: string;
        width?: number | string;
        height?: number | string;
    }

    let {
        imgSrc, 
        alt = "", 
        caption, 
        credits,
        size = 'wide',
        isLcp = false,
        aspectRatio,
        width,
        height
    }: ImgProps = $props();

    let imageRef = $state<HTMLElement | null>(null);
    let isActive = $state(false);
    let shouldLoad = $state(false);

    onMount(() => {
        if (!imageRef) return;
        const loadObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    shouldLoad = true;
                    loadObserver.disconnect(); 
                }
            },
            {
                rootMargin: '400px 0px 400px 0px'
            }
        );
        const activeObserver = new IntersectionObserver(
            ([entry]) => {
                isActive = entry.isIntersecting;
            },
            {
                rootMargin: '-20% 0px -20% 0px',
                threshold: 0.2
            }
        );

        loadObserver.observe(imageRef);
        activeObserver.observe(imageRef);

        return () => {
            loadObserver.disconnect();
            activeObserver.disconnect();
        };
    });
</script>

<figure 
    bind:this={imageRef} 
    class="focus-image {size}" 
    class:active={isActive}
>
    <div 
        class="img-wrapper"
        style:aspect-ratio={aspectRatio}
    >
        <img 
            src={isLcp || shouldLoad ? imgSrc : undefined} 
            alt={alt} 
            {width}
            {height}
            loading={isLcp ? 'eager' : 'lazy'}
            fetchpriority={isLcp ? 'high' : 'auto'}
        />
    </div>

    {#if caption || credits}
        <figcaption class="caption">
            {#if caption}
                <span class="caption-text">{caption}</span>
            {/if}
            {#if credits}
                <span class="credits">{credits}</span>
            {/if}
        </figcaption>
    {/if}
</figure>

<style>
    .focus-image {
        position: relative;
        margin: clamp(1.25rem, 4vw, 2.5rem) auto;
    }

    .focus-image.wide {
        width: min(92vw, 1200px);
        left: 50%;
        transform: translateX(-50%);
    }

    .focus-image.full {
        width: 100vw;
        left: 50%;
        margin-left: -50vw;
    }

    .img-wrapper {
        overflow: hidden;
        border-radius: 6px;
        width: 100%;
        background-color: var(--bg-color); 
    }

    .focus-image.full .img-wrapper {
        border-radius: 0;
        height: 95vh;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }

    .caption {
        max-width: 600px;
        margin: 0.85rem auto 0 auto;
        padding: 0 1rem;
        display: block;
        font-family: var(--font-sans);
        font-size: 0.825rem;
        line-height: 1.45;
        color: var(--text-main);
        opacity: 0;
        transform: translateY(6px);
        transition: opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s;
    }

    .focus-image.active .caption {
        opacity: 1;
        transform: translateY(0);
    }

    .caption-text {
        color: var(--text-main);
    }

    .credits {
        font-size: 0.75rem;
        opacity: 0.9;
    }

    .credits::before {
        content: '— ';
        margin-right: 0.2rem;
    }
    @media (max-width: 768px) {
        .focus-image.full .img-wrapper {
            height: auto; 
        }
        .focus-image.wide {
            width: 100%;
            left: 0;
            transform: none;
        }
    }
</style>