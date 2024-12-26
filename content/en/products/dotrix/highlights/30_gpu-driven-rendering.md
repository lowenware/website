---
title: GPU Driven Rendering
---

To avoid annecessary round trips between CPU and GPU, Dotrix arranges
indirect draw calls, so GPU has enough data to render not just one
entity but complete world or significant parts or it with only one
draw call.
