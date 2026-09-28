<!-- FocusImage.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';

    interface ImgProps {
        imgSrc: string;
        alt?: string;
        caption?: string;
        credits?: string;
        size?: 'wide' | 'full' | "little"; 
    }

    let {
        imgSrc, 
        alt = "", 
        caption, 
        credits,
        size = 'wide'
    }: ImgProps = $props();

    let imageRef = $state<HTMLElement | null>(null);
    let isActive = $state(false);

    onMount(() => {
        if (!imageRef) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                isActive = entry.isIntersecting;
            },
            {
                rootMargin: '-20% 0px -20% 0px',
                threshold: 0.2
            }
        );

        observer.observe(imageRef);
        return () => observer.disconnect();
    });
</script>

<figure 
    bind:this={imageRef} 
    class="focus-image {size}" 
    class:active={isActive}
>
    <div class="img-wrapper">
        <img src={imgSrc} alt={alt} loading="lazy" />
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
        margin: clamp(3rem, 7vw, 5.5rem) auto;
        opacity: 0.15;
        transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
                    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        will-change: opacity, transform;
    }

    .focus-image.wide {
        width: min(92vw, 1200px);
        left: 50%;
        transform: translateX(-50%) scale(0.97);
    }
    .focus-image.wide.active {
        transform: translateX(-50%) scale(1);
    }

    .focus-image.full {
        width: 100vw;
        left: 50%;
        margin-left: -50vw;
        transform: scale(0.98);
    }
    .focus-image.full.active {
        transform: scale(1);
    }

     .focus-image.little {
        width: 40vw;
        margin: auto;
        transform: scale(0.98);
    }

    .focus-image.active {
        opacity: 1;
    }

    .img-wrapper {
        overflow: hidden;
        border-radius: 6px;
        width: 100%;
    }

    .focus-image.full .img-wrapper {
        border-radius: 0;
    }

    img {
        width: 100%;
        object-fit: cover;
        display: block;
        transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .focus-image.active img {
        transform: scale(1.02);
    }

    .caption {
        max-width: 600px;
        margin: 0.85rem auto 0 auto;
        padding: 0 1rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        align-items: baseline;
        font-family: var(--font-sans);
        font-size: 0.825rem;
        line-height: 1.45;
        color: var(--text-muted);
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
        opacity: 0.6;
    }

    .credits::before {
        content: '— ';
        margin-right: 0.2rem;
    }

    :global(.text-wrapper:has(.focus-image.active) > *:not(.focus-image.active)) {
        opacity: 0.2;
        filter: blur(1.5px);
        transition: opacity 0.7s ease, filter 0.7s ease;
    }
</style>