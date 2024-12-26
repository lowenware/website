<script lang="ts">
  import BlogListing from '$lib/ui/template/blog-listing.svelte';

  let { data } = $props();
</script>

<BlogListing
  lang={data.lang}
  posts={data.posts}
  currentPage={data.currentPage}
  totalPages={data.totalPages}
/>
