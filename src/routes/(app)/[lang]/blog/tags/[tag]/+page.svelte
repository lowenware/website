<script lang="ts">
  import BlogTagListing from '$lib/ui/template/blog-tag-listing.svelte';

  let { data } = $props();
</script>

<BlogTagListing
  lang={data.lang}
  tag={data.tag}
  posts={data.posts}
  currentPage={data.currentPage}
  totalPages={data.totalPages}
/>
