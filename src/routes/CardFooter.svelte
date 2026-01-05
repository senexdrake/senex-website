<script>
    const memeSrcFallback = "https://pbs.twimg.com/media/FYHxKyYXEAEdW6I.jpg"

    let { memeSrc = memeSrcFallback } = $props();
</script>

<section class="card-footer">
    <hr class="default">
    <img class="footer-img" src={memeSrc} alt="graphic design is my passion meme" fetchpriority="low">
</section>

<style lang="scss">
  .card-footer {
    width: 100%;
  }
	.footer-img {
      display: block;
      margin: auto;
      width: 100%;
      max-width: 150px;
      height: auto;
	}
</style>