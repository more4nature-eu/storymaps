<script>
  import Logo from '$lib/components/atoms/Logo.svelte';

  let isScrolled = $state(false);
  let progress = $state(0);
  let { isOpen = $bindable()} = $props();

  function handleScroll() {
    isScrolled = window.scrollY > 50;

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      progress = Math.min((scrollTop / docHeight) * 100, 100);
    }
  }
</script>

<svelte:window onscroll={handleScroll} />

<header class:sticky={isScrolled} class:menu-active={isOpen}>
  <div class="progress-bar" style="width: {progress}%"></div>
  <Logo {isScrolled} menuOpen={isOpen}/>
  <div class="right-actions">
  </div>
</header>

<style>
  header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2%; 
    z-index: 100;
    transition: var(--transition-smooth);
  }
  header.sticky {
    padding: 1%;
  }

  .progress-bar {
    position: absolute;
    top: 0px;
    left: 0;
    height: 3px;
    background-color: var(--corporative); 
    transition: width 0.1s ease-out;
  }

  .right-actions {
    display: flex;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-2px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (min-width: 1800px) {
    header {
      padding: 1.5rem 10%;
    }
  }

  @media (max-width:768px) {
    header {
      padding: 5%;
    }
    header.sticky {
      padding: 3% 3%;
    }
  }
</style>