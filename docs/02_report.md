Website Strategic Audit & Redesign Analysis

## 1. Executive summary

Löwenware currently presents three different businesses at once:

1. a software consultancy,
2. an open-source engineering organization,
3. a product studio building Dotrix and Löwenbooks.

The website does not establish which of these is commercially primary. Consequently, visitors encounter products, old blog posts, client logos, technology logos, and contact details without a coherent explanation of what Löwenware wants to sell.

The strongest commercially credible position is not “software studio open to challenges.” That is broad and undifferentiated. The evidence points toward a small senior engineering studio capable of solving technically difficult software problems across web platforms, embedded systems, Rust, graphics, and troubled codebases.

That position is supported by:

- named client work for Prusa Research, Hardwario, Refsite, Sentry Company, and Solar Monitor;
- experience spanning cloud applications, embedded interfaces, firmware, protocols, and full-stack development;
- public technical work including Dotrix and an AArch64 kernel;
- a low-risk trial engagement and experience recovering projects in crisis.

Most of that evidence is absent or significantly weakened in the migration branch. The redesigned branch removes team profiles, detailed project outcomes, the contact form, and legal pages while adding a product carousel, an unreleased product, and a nonexistent “Services” destination. This moves attention away from the most plausible revenue-generating offer without replacing it with a convincing product strategy.

The website should primarily qualify and convert organizations needing senior engineering help. Open-source products and technical writing should support that proposition as evidence of expertise. They should not compete equally for the homepage’s primary message unless product revenue is now the confirmed business priority.

Primary recommendation:

> Reposition Löwenware as a senior specialist engineering studio for technically demanding products and projects, then build the site around services, evidence, working relationships, and qualified consultation requests.

Before implementation, leadership must validate whether service revenue, Dotrix adoption, or Löwenbooks is actually the top business priority.

---

## 2. What the company appears to be

### Observed facts

- Löwenware is a Czech limited company founded in 2017.
- The repository describes it as a company/product marketing site with a blog.
- Existing copy calls it a team of senior developers and artists with frontend, backend, database, networking, 3D, and firmware skills.
- The deployed About page names four team members across engineering and visual disciplines.
- It shows client work involving:
  - Prusa Research: CONNECT Cloud and Prusa-Link interfaces;
  - Hardwario: Bluetooth Low Energy and mobile development;
  - Refsite: continuing full-stack development;
  - Sentry Company: custom clients and protocol converters;
  - Solar Monitor: firmware migration.
- Dotrix is an open-source Rust 3D engine with more than 300 GitHub stars.
- Löwenware also maintains public low-level projects such as an AArch64 Rust kernel.
- The current engagement model includes team integration, sprint-based delivery, an initial trial period, and crisis-project recovery.
- There is no pricing, packaged service description, detailed case study, testimonial, measurable outcome, or stated minimum engagement.
- The current migration introduces Löwenbooks as “coming soon” and Mythstic as custom software, but Mythstic has no corresponding route.

### Reasonable inference

Löwenware is probably a small, senior-led consultancy whose client work finances internal/open-source products and experiments.

The likely commercial offer is flexible senior engineering capacity rather than standardized SaaS or a mature product portfolio.

### Assumptions requiring validation

- Whether client services remain the main revenue source.
- Whether the named team is still current.
- Whether the referenced client work can legally be described in greater detail.
- Whether “Mythstic” is a service brand, a product, or only an experimental name.
- Whether Löwenbooks has an active product strategy, launch date, or target market.
- Whether Dotrix should generate revenue, recruitment interest, community adoption, or only demonstrate capability.

---

## 3. Who the website should serve

Assuming services are commercially primary, the core audience should be:

### Primary audience

Technical founders, CTOs, engineering managers, and product owners who:

- need experienced contributors without building a permanent team;
- have a technically difficult or cross-disciplinary product;
- need help stabilizing an inherited or delayed project;
- require expertise spanning application and systems boundaries;
- value direct access to senior practitioners.

Their central question is:

> Can this small team understand our difficult problem, reduce delivery risk, and work effectively with us?

### Secondary audiences

- Rust, graphics, and game-engine developers evaluating Dotrix.
- Prospective engineering collaborators or recruits.
- Existing clients verifying capabilities and contact details.
- Authors or publishers interested in Löwenbooks—only once there is a concrete proposition.
- Readers arriving through technical search content.

The present homepage treats these audiences as equally important. They are not. A procurement-oriented visitor and a Rust engine developer have different questions and should follow separate paths.

---

## 4. Current website purpose

The deployed site appears intended to:

- establish a general software-company presence;
- show selected projects and team members;
- publish technical and company news;
- promote Dotrix;
- generate inquiries or meeting bookings.

The migration branch changes that apparent purpose. Its homepage sequence is:

1. product/custom-software carousel,
2. generic tagline,
3. six blog posts,
4. About and client logos,
5. working process,
6. products,
7. technology logos,
8. corporate contact data.

That sequence implicitly optimizes for showcasing activity and projects, not for helping a prospective client evaluate and contact the company.

The migration also removes the feedback form and reduces contact conversion to an email address plus an external booking link.

---

## 5. Recommended website purpose

### Primary objective

Generate qualified conversations with organizations that need senior specialist software engineering.

A qualified conversion could be:

- “Discuss your project,” or
- “Book a technical consultation.”

This is stronger than a generic “Contact” or “Learn more.”

### Secondary objectives

1. Prove competence through detailed client outcomes.
2. Explain when and how Löwenware engages.
3. Establish specialist authority through open-source work and selected technical writing.
4. Direct Dotrix users to its dedicated documentation/community.
5. Capture validated interest in Löwenbooks, if the project is active.
6. Support trust checks involving team, company identity, and location.

---

## 6. Biggest strategic problems

### 6.1 No hierarchy between services and products

The website calls Löwenware a software studio but gives no meaningful account of its services. Meanwhile, the new carousel gives three offers equivalent prominence:

- Dotrix,
- unreleased Löwenbooks,
- vaguely defined Mythstic/custom development.

This makes the visitor determine the business model themselves.

### 6.2 The value proposition is generic

“Software studio that is open to challenges” communicates willingness, not customer value or distinctive capability. Almost any agency could make that claim.

It omits:

- customer type;
- problem;
- engagement;
- outcome;
- differentiator.

### 6.3 Evidence has been reduced to decoration

The deployed site contains concrete descriptions of client work. The migration reduces those clients to logo cards:

```68:85:src/routes/(app)/[lang]/+page.svelte
<div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
  {#each home.about.projects as project (project.title)}
    <article class="card flex flex-col items-center p-6 text-center">
      <img src="/projects/{project.logo}" alt={project.title} />
      <h3 class="text-lg">{project.title}</h3>
    </article>
  {/each}
</div>
```

A logo proves association but not scope, skill, responsibility, or outcome. The strongest sales evidence has effectively been removed.

### 6.4 The homepage prioritizes old editorial content

Six blog cards appear immediately after the hero. The newest posts are from December 2024; by August 2026, that signals inactivity. Several posts concern events or abandoned/older technical projects rather than current client needs.

Blog content can build authority, but it should not occupy the highest-value homepage position unless publishing or inbound search is an active growth strategy.

### 6.5 No meaningful service architecture

“Services” appears in navigation, but there is no `#services` section:

```13:20:src/lib/ui/layout/site-header.svelte
const navItems = [
  { href: `/${lang}/#home`, label: 'nav.home' },
  { href: `/${lang}/#blog`, label: 'nav.blog' },
  { href: `/${lang}/#about`, label: 'nav.about' },
  { href: `/${lang}/#products`, label: 'nav.products' },
  { href: `/${lang}/#services`, label: 'nav.services' },
  { href: `/${lang}/#contact`, label: 'nav.contact' }
];
```

This is both a broken interaction and evidence that the commercial offer has not yet been defined.

### 6.6 Weak conversion path

The meeting CTA is buried after About and sends visitors to a third-party scheduler. Contact is primarily a corporate record containing company ID, VAT number, IBAN, address, and email.

That information is useful in a legal footer or company-details page. It is not a persuasive conversion experience.

### 6.7 Products lack actionable propositions

- Dotrix lists technical features but does not identify maturity, use cases, compatibility, roadmap, support, or a clear getting-started journey.
- Löwenbooks has no meaningful content or interest-capture mechanism.
- Mythstic links to a route that does not exist.
- The product carousel gives each item more confidence than its supporting content can justify.

### 6.8 Localization creates a misleading promise

Czech URLs and alternate-language metadata are generated, but Czech content falls back to English. A visitor choosing Czech may receive English page content. Search engines may also see substantially duplicate localized pages.

### 6.9 The redesign removes trust and compliance material

The migration deletes:

- team profiles;
- project details;
- feedback form;
- privacy statement;
- terms of use;
- legal footer links.

Some old legal wording was outdated and should not simply be restored, but removing legal information entirely is not an adequate replacement—particularly when using an external scheduler and Utterances comments.

---

## 7. Biggest opportunities

### 7.1 Own the difficult-engineering niche

The combination of full-stack, embedded, protocols, Rust, graphics, and project recovery is much more distinctive than “we build software.”

A credible positioning territory is:

> Senior engineers for software projects where web, systems, hardware, performance, or inherited complexity meet.

This must be narrowed based on actual sales history.

### 7.2 Turn client work into proof

Three strong case studies would outperform a large collection of technology logos. Each should state:

- client context;
- problem;
- Löwenware’s responsibility;
- technical constraints;
- working relationship;
- result;
- testimonial where possible.

### 7.3 Productize the engagement model

The existing trial approach reduces buying risk and is commercially useful. It could become a clear entry offer:

- technical discovery;
- project recovery assessment;
- first sprint;
- embedded senior engineering engagement.

This creates a more concrete next step than “Book a meeting.”

### 7.4 Use open source as evidence

Dotrix and the AArch64 work demonstrate depth, initiative, and public engineering quality. They should substantiate service claims instead of competing with the service proposition.

### 7.5 Build focused inbound content

Technical writing should align with the customers and services Löwenware wants. Potential themes include:

- stabilizing delayed software projects;
- integrating web software with embedded devices;
- when Rust is commercially appropriate;
- migrating embedded systems;
- architecture decisions in graphics-intensive products.

---

## 8. Recommended positioning

### Core positioning

> Löwenware is a senior software engineering studio for organizations building technically demanding products. The team helps clients design, deliver, and recover software across web platforms, embedded systems, Rust, graphics, and connected devices—working directly with existing teams or taking ownership of a defined delivery.

### Differentiation

The site should emphasize:

- senior practitioners rather than layered agency staffing;
- unusually broad systems-to-interface capability;
- demonstrated public engineering depth;
- experience joining existing teams;
- project-recovery capability;
- a low-risk first sprint or assessment;
- direct, small-team collaboration.

### Suggested homepage proposition

**Senior engineers for difficult software projects**

From web platforms and connected devices to Rust and real-time graphics, Löwenware helps product teams deliver complex software and recover projects that have gone off track.

Primary CTA: **Discuss your project**

Secondary CTA: **See our work**

This is a strategic draft, not final copy. It depends on validating the preferred market and highest-margin engagements.

---

## 9. Recommended information architecture

### Primary navigation

- Services
- Work
- About
- Insights
- Products
- Discuss your project

Do not include “Home,” “Technologies,” or “Contact” as equal navigation destinations.

### Services — new

- **Purpose:** Explain what clients can buy.
- **Audience:** CTOs, founders, engineering leads.
- **Question:** “Can Löwenware solve my kind of problem?”
- **Content:** Three or four outcome-oriented service areas, engagement models, fit criteria, process, FAQ.
- **CTA:** Discuss your project.
- **Action:** Create.

Possible service categories:

1. Product engineering and team extension.
2. Connected and embedded software.
3. Rust, graphics, and performance engineering.
4. Project recovery and modernization.

These categories require commercial validation.

### Work — new from current About projects

- **Purpose:** Prove capability.
- **Audience:** Buyers evaluating credibility.
- **Question:** “What comparable work have they delivered?”
- **Content:** Case studies, responsibilities, constraints, outcomes, client quotations.
- **CTA:** Talk about a similar challenge.
- **Action:** Create by expanding current project data.

### About

- **Purpose:** Establish who visitors will work with.
- **Audience:** Buyers and prospective collaborators.
- **Question:** “Who is the team, and can I trust them?”
- **Content:** Team, operating principles, history, location, direct working model.
- **CTA:** Meet the team / Discuss your project.
- **Action:** Retain but restore useful deployed-site detail and rewrite it.

### Insights — rename Blog

- **Purpose:** Demonstrate relevant expertise and attract search traffic.
- **Audience:** Technical decision-makers and developers.
- **Question:** “Do they understand this domain deeply?”
- **Content:** Curated articles, case-study lessons, engineering guides.
- **CTA:** Related service or consultation.
- **Action:** Rename and refocus.

### Products

- **Purpose:** Separate internal/open-source products from client services.
- **Audience:** Product-specific visitors.
- **Question:** “What has Löwenware built, and what can I do with it?”
- **Content:** Dotrix and only other products with a validated proposition.
- **CTA:** Product-specific.
- **Action:** Retain but demote in primary hierarchy unless product revenue is strategic.

Dotrix should ideally direct users to its dedicated site, repository, documentation, and getting-started path.

Löwenbooks should either:

- have a real landing page with audience, problem, status, and waitlist; or
- be removed until there is something visitors can evaluate.

### Contact / Project inquiry — new

- **Purpose:** Convert qualified interest.
- **Audience:** Prospective clients.
- **Question:** “How do I start, and what happens next?”
- **Content:** Short qualification form, expected response time, engagement fit, scheduler as optional next step.
- **CTA:** Send project details.
- **Action:** Create.

### Legal

- **Purpose:** Provide accurate privacy and company information.
- **Action:** Restore after legal and operational review.
- **Navigation:** Footer only.

### Remove from top-level navigation

- Home: the logo already serves this function.
- Technologies: tools are supporting evidence, not customer destinations.
- Generic Contact: replace with an action-oriented CTA.
- Blog as the second homepage destination: disproportionate to its business role.

---

## 10. Recommended homepage structure

### 1. Hero: proposition and action

- **Purpose:** Establish relevance immediately.
- **Message:** Löwenware supplies senior engineering for difficult products and troubled projects.
- **Heading:** “Senior engineers for difficult software projects.”
- **Support:** One concise sentence naming the strongest problem domains.
- **CTA:** Discuss your project.
- **Secondary CTA:** See our work.
- **Reason:** A new visitor must understand the company before seeing its products or posts.

Replace the carousel. Rotating three unrelated propositions forces visitors to wait or interact to understand the company.

### 2. Credibility strip

- **Purpose:** Reduce initial uncertainty.
- **Message:** Trusted on products for recognizable organizations.
- **Heading:** Optional; avoid unnecessary copy.
- **Support:** Client logos with a precise qualifier such as “Selected teams we have supported.”
- **CTA:** View client work.
- **Reason:** Immediate proof supports the hero claim.

Only use logos where permission and relationship wording are verified.

### 3. Problems Löwenware solves

- **Purpose:** Help visitors self-identify.
- **Heading:** “Where we make the biggest difference.”
- **Content:** Three or four problem-oriented cards:
  - complex product delivery;
  - embedded/cloud integration;
  - performance and specialist engineering;
  - delayed or unstable projects.
- **CTA:** Explore services.
- **Reason:** Buyers think in problems and risks, not technology inventories.

### 4. Selected work

- **Purpose:** Prove claims.
- **Heading:** “Engineering work in the real world.”
- **Content:** Three short case studies with context, contribution, and result.
- **CTA:** See all work.
- **Reason:** Concrete evidence should precede process and conversion.

### 5. Why Löwenware

- **Purpose:** Differentiate the studio.
- **Heading:** “Senior expertise, without agency layers.”
- **Content:** Direct access, systems breadth, open-source depth, flexible integration, recovery experience.
- **CTA:** Meet the team.
- **Reason:** Explains why a buyer should select Löwenware over a freelancer, agency, or larger consultancy.

### 6. Engagement model

- **Purpose:** Reduce purchase uncertainty.
- **Heading:** “Start with a focused first sprint.”
- **Content:**
  1. Share the situation.
  2. Define the team and objective.
  3. Complete a paid assessment or sprint.
  4. Continue, adapt, or stop based on evidence.
- **CTA:** Plan a first conversation.
- **Reason:** The trial is a useful risk-reversal mechanism.

Do not lead with notice-period terms. Contractual detail belongs in a proposal, not the persuasive core of the website.

### 7. Technical authority

- **Purpose:** Demonstrate engineering depth.
- **Heading:** “We build in public, too.”
- **Content:** Dotrix, LeOS, selected technical writing, measurable open-source signals.
- **CTA:** Explore our engineering.
- **Reason:** This turns side projects into proof of expertise.

### 8. Selected insight

- **Purpose:** Support authority without overwhelming the journey.
- **Heading:** “From our engineering notebook.”
- **Content:** Two or three carefully selected, current articles.
- **CTA:** View all insights.
- **Reason:** Editorial content should support—not interrupt—the sales narrative.

### 9. Final conversion

- **Purpose:** Convert visitors after trust has been built.
- **Heading:** “What are you trying to build—or fix?”
- **Content:** Set expectations: suitable project types, response time, and first-call purpose.
- **CTA:** Discuss your project.
- **Alternative:** Email directly.
- **Reason:** Makes the next step specific and low-friction.

### 10. Footer

Include:

- concise company identity;
- navigation;
- email;
- legal links;
- social/open-source links;
- company registration details;
- language choice.

IBAN should not occupy homepage sales space.

---

## 11. Content strategy

### Keep

- The named client relationships.
- The core descriptions of actual project contributions.
- Team information, if current.
- The first-sprint/trial concept.
- Project-recovery experience.
- Dotrix and other credible open-source work.
- High-value technical tutorials that still receive traffic.
- Corporate details in an appropriate location.

### Rewrite

- Homepage value proposition.
- About introduction.
- “How we work.”
- All service messaging.
- Dotrix introduction and feature descriptions.
- SEO titles and descriptions.
- CTAs such as “Learn more,” “Contact,” and “About.”
- Error-prone English throughout existing copy.

Examples include “usefull,” “arrangments,” “annecessary,” “Lets,” and unnatural phrases such as “end it up.” These weaken perceived engineering rigor.

### Consolidate

- Product references spread across the carousel, cards, and product pages.
- Technology logos into service or capability evidence.
- Company details into the footer/legal area.
- Old event posts into the Insights archive rather than homepage content.

### Remove or suppress

- Carousel.
- Mythstic until its meaning and destination are defined.
- Löwenbooks promotion until there is a credible proposition or waitlist.
- Empty Dotrix feature cards containing only images.
- Technology logos that all link to unrelated GitHub destinations.
- Disabled or obsolete social channels.
- Prominent old news from the homepage.
- IBAN from the main contact journey.

### Create

Highest priority:

1. Service proposition.
2. Three client case studies.
3. Project inquiry page/form.
4. Current team/company story.
5. Engagement-fit and process content.
6. Accurate privacy information.

Next:

7. Focused Dotrix landing journey.
8. Editorial themes aligned with services.
9. Buyer FAQ.
10. Testimonials and quantified outcomes.

---

## 12. Conversion strategy

### Ideal journey

**Landing → understanding**

The visitor immediately learns:

- who Löwenware helps;
- what difficult situations it handles;
- what outcome it provides.

**Understanding → trust**

Show:

- client evidence;
- concrete work;
- named senior team;
- open-source credibility;
- operating history.

**Trust → evaluation**

Answer:

- what services are available;
- how engagements start;
- whether Löwenware joins teams or owns delivery;
- typical engagement size;
- relevant domains;
- what Löwenware does not do.

**Evaluation → action**

Offer a short project-inquiry flow:

- name and work email;
- company;
- what they are building or fixing;
- desired timing;
- optional budget or engagement range.

Then offer scheduling after submission or as a secondary path.

### Current friction

- No clear service to inquire about.
- No persistent business CTA.
- Generic labels such as “Learn more.”
- External scheduler is introduced before expectations are established.
- The feedback form has been removed.
- Contact information emphasizes administration instead of assistance.
- No response-time promise.
- No qualification guidance.
- No testimonials or outcomes.
- Product and service paths compete.

### Measurement

No analytics or conversion instrumentation was found in the repository.

At minimum, measure:

- service-page visits;
- case-study engagement;
- inquiry starts and completions;
- booking clicks;
- direct email clicks;
- Dotrix outbound traffic;
- traffic source and landing page.

The tool should be privacy-appropriate and reflected accurately in the privacy statement.

---

## 13. Design and UX recommendations

### Replace the carousel

The carousel uses a fixed 760px height and distributes the primary message across slides. It also creates multiple `<h1>` elements and relies on active/hidden slide state.

A static hero is clearer, faster to comprehend, easier to make responsive, and better aligned with a single strategy.

### Restore a deliberate hierarchy

The current homepage transitions from a large carousel directly into six equally weighted blog cards. That makes editorial content feel more important than services or proof.

Recommended visual hierarchy:

1. proposition,
2. proof,
3. service/problem areas,
4. case studies,
5. differentiation and process,
6. insights,
7. conversion.

### Use fewer decorative cards

Client-logo cards, blog cards, product cards, and Dotrix feature cards create visual repetition without enough informational depth. Use cards only when items genuinely need comparison.

### Preserve the visual identity selectively

Keep:

- the lion mark;
- restrained dark/light palette;
- existing brand blue as an accent;
- technical visual tone;
- self-hosted typography if readability tests are satisfactory.

Reconsider:

- Jura as the only body typeface—it has personality but may reduce long-form readability;
- generic abstract hero imagery;
- grayscale-to-color interactions, especially on touch devices;
- excessive uppercase button and navigation labels;
- rounded pill buttons if the intended position is serious technical expertise.

### Repair mobile navigation

The primary navigation is hidden below the medium breakpoint, with no replacement menu:

```23:35:src/lib/ui/layout/site-header.svelte
<header id="header" class="sticky ...">
  <div class="...">
    <!-- logo -->
    <nav aria-label="Main" class="hidden items-center gap-6 md:flex">
      <!-- navigation -->
    </nav>
    <LangToggle {lang} />
  </div>
</header>
```

Mobile visitors effectively receive only the logo and language toggle.

### Accessibility

Important improvements include:

- one clear page-level `<h1>`;
- visible keyboard focus styles;
- minimum target sizes for carousel dots or their replacement;
- meaningful image alternatives for content images;
- skip navigation;
- heading continuity around blog previews;
- accessible labels for social links that do not depend on image alt text;
- contrast verification for gray text;
- no hover-only communication;
- language-switch behavior that does not promise untranslated content.

---

## 14. Technical recommendations

These are limited to issues affecting UX, SEO, conversion, or content operations.

### Fix broken destinations

- `#services` has no matching section.
- `/en/mythstic` has no route.
- Hero URLs are hardcoded to English, so Czech visitors are sent to English paths.
- Several legacy links inside old blog content target retired URL structures.

### Correct locale and SEO behavior

The site builds English and Czech alternate links even though Czech markdown falls back to English:

```5:11:src/lib/shared/seo.ts
export function buildAlternates(pathWithoutLang: string) {
  return (['en', 'cs'] as Locale[]).map((lang) => ({
    lang,
    href: absoluteUrl(`/${lang}${normalized}`, origin)
  }));
}
```

Either translate the content or temporarily remove Czech alternates/pages from indexing.

### Protect canonical URLs

Production metadata depends on `ORIGIN`, with `http://localhost:3000` as fallback. A missing environment variable could produce incorrect canonicals, sitemap URLs, and structured data.

Production should fail validation rather than silently emit localhost URLs.

### Improve sitemap quality

The sitemap includes both locales, including fallback content and the Löwenbooks placeholder. It omits useful metadata and tag handling. Index only pages with unique, meaningful content.

### Restore accurate legal coverage

The old policies describe data collection and functionality that no longer match the site. They need revision, not blind restoration. Cover:

- external scheduling;
- GitHub/Utterances comments;
- analytics, if added;
- inquiry handling;
- retention and processors;
- current company address.

### Improve content modeling

The markdown architecture is suitable for editorial maintenance, but case studies and services need structured fields for:

- audience;
- problem;
- contribution;
- outcome;
- technologies;
- testimonial;
- CTA;
- SEO metadata.

### Avoid dead content fields

Blog posts can define YouTube IDs, but the article template does not render them. Content fields should either be supported or removed.

### Performance

- A 760px image-heavy carousel is expensive above the fold.
- Only the active slide receives a background image, which helps, but carousel scripting and cloned slides add complexity without strategic benefit.
- Define responsive image dimensions and modern formats for case-study and blog imagery.
- Continue self-hosting fonts, but limit variants and verify preload behavior.

### Maintainability

The worktree appears to be an incomplete migration. Documentation still mentions routes and content that have been deleted, including legal pages. Strategy, route inventory, and documentation should be reconciled before launch.

---

## 15. Prioritized implementation roadmap

## P0 — Strategic

### P0.1 Decide the commercial priority

- **Problem:** Services, Dotrix, and Löwenbooks compete equally.
- **Recommendation:** Choose one primary business objective and one primary audience.
- **Rationale:** Every subsequent IA, copy, and CTA decision depends on it.
- **Expected impact:** Very high.
- **Complexity:** Low implementation effort, high organizational effort.
- **Dependencies:** Leadership, revenue and pipeline data, product roadmaps.

### P0.2 Define the service proposition

- **Problem:** Visitors cannot determine what they can hire Löwenware to do.
- **Recommendation:** Define three or four outcome-oriented services and ideal-client criteria.
- **Rationale:** Converts broad technical capability into a purchasable offer.
- **Expected impact:** Very high.
- **Complexity:** Medium.
- **Dependencies:** P0.1, project history, commercial priorities.

### P0.3 Rebuild the IA around buyer evaluation

- **Problem:** The homepage mixes audiences and uses anchors instead of substantive commercial pages.
- **Recommendation:** Adopt Services, Work, About, Insights, Products, and Project Inquiry.
- **Rationale:** Matches the questions buyers ask.
- **Expected impact:** Very high.
- **Complexity:** Medium–high.
- **Dependencies:** P0.1 and P0.2.

### P0.4 Resolve product status

- **Problem:** Unreleased or unclear projects receive prominent promotion.
- **Recommendation:** Define Dotrix, Löwenbooks, and Mythstic objectives; remove unsupported promotions.
- **Rationale:** Prevents confusion and credibility loss.
- **Expected impact:** High.
- **Complexity:** Low–medium.
- **Dependencies:** Product ownership and roadmap decisions.

## P1 — High impact

### P1.1 Replace the carousel with a static proposition

- **Problem:** The company’s identity is split across rotating slides.
- **Recommendation:** Use one buyer-oriented hero with one primary CTA.
- **Impact:** Faster comprehension and stronger conversion.
- **Complexity:** Medium.
- **Dependencies:** Positioning decision.

### P1.2 Create three case studies

- **Problem:** Client logos provide little evidence.
- **Recommendation:** Expand the strongest projects into problem/contribution/result stories.
- **Impact:** Major trust and sales improvement.
- **Complexity:** Medium–high.
- **Dependencies:** Client permissions and outcome data.

### P1.3 Create a project-inquiry journey

- **Problem:** Visitors have only email or an external scheduler.
- **Recommendation:** Add a concise qualification form and clear next-step expectations.
- **Impact:** Higher-quality and more measurable leads.
- **Complexity:** Medium.
- **Dependencies:** Lead owner, privacy policy, notification process.

### P1.4 Restore team credibility

- **Problem:** The migration removes who visitors will work with.
- **Recommendation:** Publish current senior team profiles tied to client value.
- **Impact:** High for a small consultancy.
- **Complexity:** Low–medium.
- **Dependencies:** Current team confirmation and photography.

### P1.5 Move blog content below commercial proof

- **Problem:** Stale posts dominate the early homepage.
- **Recommendation:** Feature at most two or three relevant insights after services and work.
- **Impact:** Better message hierarchy.
- **Complexity:** Low.
- **Dependencies:** Homepage redesign.

## P2 — Important

### P2.1 Refocus the editorial strategy

- **Problem:** Content topics do not consistently support current commercial priorities.
- **Recommendation:** Publish around target-client problems and update valuable evergreen posts.
- **Impact:** Better authority and qualified search traffic.
- **Complexity:** Ongoing medium effort.
- **Dependencies:** Services and audience definition.

### P2.2 Redesign Dotrix’s journey

- **Problem:** Feature descriptions are incomplete and do not lead users toward adoption.
- **Recommendation:** Clarify status, audience, documentation, examples, support, and roadmap.
- **Impact:** Better product credibility and community adoption.
- **Complexity:** Medium.
- **Dependencies:** Dotrix strategy.

### P2.3 Resolve localization

- **Problem:** Czech pages frequently present English content.
- **Recommendation:** Translate strategically important pages or temporarily operate as English-only.
- **Impact:** Improved trust and cleaner SEO.
- **Complexity:** Medium–high for full translation; low for English-only.
- **Dependencies:** Target-market decision.

### P2.4 Restore accurate legal pages

- **Problem:** Current branch removes legal information while retaining third-party integrations.
- **Recommendation:** Draft policies matching actual data handling.
- **Impact:** Trust and compliance.
- **Complexity:** Medium.
- **Dependencies:** Legal review and vendor inventory.

### P2.5 Replace the technology-logo section

- **Problem:** Tools are presented without context and several link to unrelated destinations.
- **Recommendation:** Explain capability through project examples or a concise capability matrix.
- **Impact:** Better credibility and comprehension.
- **Complexity:** Low.
- **Dependencies:** Service and case-study content.

## P3 — Polish

### P3.1 Editorial quality pass

- **Problem:** Frequent grammar and spelling errors weaken credibility.
- **Recommendation:** Professional English copyediting.
- **Impact:** Moderate trust improvement.
- **Complexity:** Low–medium.
- **Dependencies:** Final copy.

### P3.2 Accessibility pass

- **Problem:** Mobile navigation, focus treatment, heading hierarchy, and hover dependence need attention.
- **Recommendation:** Conduct keyboard, screen-reader, responsive, and contrast testing.
- **Impact:** Better usability and compliance.
- **Complexity:** Medium.
- **Dependencies:** Stable templates.

### P3.3 SEO refinement

- **Problem:** Generic metadata, duplicate locale content, placeholders, and incomplete sitemap behavior.
- **Recommendation:** Add page-specific search intent, correct indexing, and richer case-study metadata.
- **Impact:** Moderate organic-search improvement.
- **Complexity:** Medium.
- **Dependencies:** Final IA and content.

### P3.4 Performance and media refinement

- **Problem:** Large hero imagery and inconsistent media handling can slow comprehension.
- **Recommendation:** Responsive formats, explicit dimensions, compression, and removal of unnecessary carousel code.
- **Impact:** Moderate UX improvement.
- **Complexity:** Low–medium.
- **Dependencies:** Final design.

---

## 16. Questions and assumptions requiring human validation

1. What generated most company revenue in the last two years?
2. What should generate most revenue over the next two years?
3. Is Löwenware actively accepting new consulting clients?
4. Which engagements are most profitable and enjoyable?
5. Which industries or client types should be avoided?
6. Is the ideal offer team augmentation, owned delivery, consulting, recovery, or a mix?
7. What is the typical project duration and commercial range?
8. Can client names, responsibilities, results, and testimonials be published?
9. Is the deployed team list still correct?
10. Is “senior developers and artists” still an accurate description?
11. What is Mythstic?
12. Is Löwenbooks actively funded and being built?
13. What action should Dotrix visitors take?
14. Is Dotrix expected to produce revenue?
15. Is Czech-language acquisition commercially important?
16. How do inquiries currently arrive and which channels convert?
17. Does the external scheduler remain operational and preferred?
18. Who responds to inquiries, and within what timeframe?
19. Is project-recovery work a desirable specialty or merely historical?
20. Which blog posts currently receive meaningful organic traffic?
21. What analytics, if any, run outside this repository?
22. Why were the contact form and legal pages removed from the migration?
23. Is the changed company address in the repository current?
24. Does Löwenware have quantified outcomes—delivery time, uptime, performance, revenue, or cost reduction—that can be published?

---

# The 10 most important changes

1. Choose whether client services or products are the website’s primary business.
2. Replace “open to challenges” with a precise audience/problem/outcome proposition.
3. Define concrete, outcome-oriented service offerings.
4. Replace the product carousel with one static buyer-focused hero.
5. Turn client logos into detailed, credible case studies.
6. Build a qualified project-inquiry path with clear expectations.
7. Rebuild navigation around Services, Work, About, Insights, and Products.
8. Restore current team information and direct-access credibility.
9. Remove or demote unsupported product claims, particularly Mythstic and placeholder Löwenbooks.
10. Resolve mobile navigation, localization, legal coverage, and broken destinations before launch.

# If we could only change 3 things

1. **Set one commercial position:** Present Löwenware as a senior specialist engineering studio for technically demanding projects, assuming leadership confirms services as the priority.

2. **Replace the top half of the homepage:** Use one clear hero, concrete service/problem areas, and three evidence-rich client stories. Remove the carousel and early six-post blog grid.

3. **Create a credible conversion path:** Add a persistent “Discuss your project” CTA leading to a short qualification page that explains fit, process, response time, and what happens next.
