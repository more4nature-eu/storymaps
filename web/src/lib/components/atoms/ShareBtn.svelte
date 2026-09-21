<script lang="ts">
  let copied = $state(false);

  async function handleShare() {
    const shareData = {
      title: '',
      text: '',
      url: typeof window !== 'undefined' ? window.location.href : ''
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareData.url);
      copied = true;
      setTimeout(() => (copied = false), 2500);
    }
  }
</script>

<div class="share-wrapper">
  <button type="button" class="share-btn" onclick={handleShare} aria-label="Share">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
      <polyline points="16 6 12 2 8 6"></polyline>
      <line x1="12" y1="2" x2="12" y2="15"></line>
    </svg>
    <span>{copied ? 'Copied!' : ''}</span>
  </button>
</div>

<style>
  .share-wrapper {
    display: flex;
    justify-content: center;
    margin: .5rem auto;
  }

  .share-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background-color: var(--text-main, #111827);
    color: #ffffff;
    border: none;
    padding: 0.6rem 1.2rem;
    font-family: var(--font-sans, sans-serif);
    font-size: 0.9rem;
    font-weight: 600;
    border-radius: 50px;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.1s ease;
  }

  .share-btn:hover {
    background-color: #e36414;
    transform: translateY(-1px);
  }
</style>