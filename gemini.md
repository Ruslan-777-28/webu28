# ASSISTANT_QUICK_START.md

## Read this first

This ecosystem has **two separate repositories** and **one shared Firebase backend**.

### Repositories
1. **Website / LECTOR**
   - public-facing website
   - homepage, blog, admin-managed content, FAQ, footer, informational pages
   - brand / trust / discovery layer

2. **App / ConnectU**
   - product/application repository
   - communication, runtime platform logic, call / translation-related history
   - deeper operational layer

### Shared reality
These two repos use the **same Firebase project**.
Do not assume backend isolation.

---

## Most important rules

### 1. Never treat this as a generic boilerplate
This is a real in-progress product ecosystem, not a starter template.

### 2. Always know which repo you are in
Before changing anything, verify whether you are in:
- website repo
- app repo

### 3. Shared backend means shared risk
If a change touches:
- auth
- Firestore
- Storage
- server credentials
- shared data models
- settings documents
- user data
- session / publication / moderation / communication records

then it may affect both repos.

### 4. GitHub is the source of truth
Firebase Studio is now reference-only.
Development has been migrated to **Google Antigravity**.

### 5. Use `.env.local` for real local values
Use `.env.example` for safe templates.
Do not print secrets.
Some previously exposed secrets must be treated as compromised and rotated.

---

## Website repo quick understanding

The website repo is:
- the public entry point
- the trust / positioning / content layer
- admin-managed where practical
- not just a static landing page

### Website priorities
- preserve admin-managed content direction
- preserve blog / moderation / publication consistency
- preserve homepage hero concept

### Homepage hero special rule
The homepage hero uses a **large circular media area**.

This is a symbolic brand object, not a generic banner.

Current direction:
- circular portal / coin-like artifact
- only content inside the circle should be visible
- outside the circle should remain clean
- light premium atmosphere
- slow looped symbolic motion

Hero conceptual sides:
- **Side A:** time → value / exchange / money
- **Side B:** sacred knowledge / human / mystery / proportion

Do not flatten this into a generic stock-video hero.

---

## App repo quick understanding

The app repo is:
- the product/runtime side
- historically tied to communication, calls, translation-related work, and platform logic
- not just a front-end shell

### App priorities
- preserve runtime integrity
- handle env carefully
- respect communication / translation / service integrations
- avoid breaking shared backend behavior

---

## Migration status

Both repos already run successfully in **Antigravity**.

Confirmed:
- repo clone works
- dependencies install
- local dev works
- rendering works when correct `.env.local` is present

On Windows / PowerShell, `npm.ps1` may be blocked.
Practical commands may be:
- `npm.cmd install`
- `npm.cmd run dev`

---

## Before making any change, ask:

1. Which repo am I in?
2. Is this UI-only or backend-connected?
3. Does this touch shared Firebase structures?
4. Should this be hardcoded or admin-managed?
5. Could this affect the other repo?
6. Are env assumptions correct?

---

## Do

- reason from actual code
- mark uncertainty as "needs verification"
- preserve shared-backend awareness
- preserve website hero concept
- preserve admin/CMS extensibility
- keep changes practical and production-minded

---

## Do not

- call this a generic SaaS starter
- assume repo separation means backend separation
- expose secrets
- hardcode content that should become managed
- invent roadmap features without evidence
- oversimplify env handling
- break the symbolic homepage hero direction

---

## If unsure

Say:
- **needs verification**
- **shared-backend sensitive**
- **possible cross-repo impact**

That is better than making unsafe assumptions.
# WEBSITE_PROJECT_CONTEXT.md

## Project identity

This repository is the public-facing website layer of the broader platform ecosystem.

Working project name in current context:
- **LECTOR website**

This website is not a generic landing page. It is the discovery, trust, positioning, and content layer of the ecosystem.

It is built with:
- Next.js App Router
- TypeScript
- Tailwind CSS
- Firebase integration
- admin-managed / CMS-like content architecture

It shares the same Firebase backend project as the separate app repository, but it is a separate codebase and should be treated as its own workspace.

---

## Strategic role of the website

The website is the main entry point for:
- ad traffic
- social traffic
- cold visitors
- blog / SEO traffic

Its role is:
1. create first impression
2. establish trust and brand atmosphere
3. explain value
4. route different audiences into the correct path

Main audience directions:
- **For Experts**
- **For Community / Users**
- **Blog / content readers**

The website must support both emotional positioning and structured navigation.

---

## Product / brand positioning

The platform is built around:
- knowledge
- consultation / guidance
- meaningful exchange
- premium atmosphere
- global reach
- removal of barriers between expert and user

In the broader concept, the platform has:
- serious product mechanics
- premium clean visual language
- mystical / symbolic undertones in brand atmosphere
- admin-managed content where possible
- long-term goal of international / multi-audience positioning

The website should never feel like a cheap marketplace or generic template.

---

## Website architecture philosophy

Important content should not be hardcoded if avoidable.

Key website areas should be manageable through admin / CMS-like structures where practical.

This applies to:
- homepage content
- FAQ
- footer settings
- informational pages
- blog categories and settings
- future hero media source
- potentially other landing content blocks

This is a very important project principle.

---

## Current known implemented areas

Based on prior work and stabilization context, the website already includes or has strongly established support for:

- homepage structure
- blog flow
- admin-managed settings
- FAQ
- footer settings
- informational page management
- Firebase integration
- Firestore-backed content structures
- moderation / publication-related blog logic
- profile and author-related visibility behavior
- admin area for content / settings / blog control

Do not treat the website as an early blank prototype.
It already has meaningful architecture and existing stabilized behavior.

---

## Blog / post flow context

A significant amount of work has already gone into stabilizing the blog and post publication logic.

Important prior realities:
- blog categories and subcategories are important
- category source is tied to settings data
- post flow needed synchronization between creation, moderation, publication, and visibility
- display logic in blog and in author profile matters
- admin and public presentation need to stay aligned

When changing blog-related logic, preserve:
- moderation flow
- category/subcategory behavior
- publication state consistency
- author-facing display correctness
- admin visibility / control

---

## Admin / CMS reality

The admin area is not secondary.
It is core infrastructure for the website.

It is used for:
- content management
- settings
- blog administration
- moderation-related operations
- structured content governance

When implementing new website features, always ask:
- should this remain hardcoded?
- should this become admin-managed?
- does this fit the CMS-like direction already established?

Avoid short-term hardcoded solutions when the project direction clearly expects managed content.

---

## Homepage hero: critical context

The homepage hero is strategically important.
It is the first impression layer for cold traffic.

This hero is not meant to be a generic banner or a simple stock video.

### Current direction
The central homepage hero includes a **large circular visual area**.

This circular area is intended as a:
- portal
- symbolic object
- coin-like emblem
- looping premium brand artifact

### Current conceptual direction
The visual should communicate meaning without relying on language.

The main concept evolved toward a two-sided symbolic structure:

#### Side A
- time
- exchange
- value
- monetization
- energy becoming money

Visual language includes:
- clock
- exchange arrows
- currency transformation
- minimal symbolic motion

#### Side B
- sacred knowledge
- human-centered wisdom
- mystery
- proportion
- inner order

Visual language includes:
- sacred geometric human figure
- Vitruvian-inspired but not literal reproduction
- subtle living linework
- premium symbolic mysticism

### Visual rules
- only content inside the circle should be visible
- the circle acts as a strict mask / portal boundary
- outside the circle should remain clean
- mystical symbols should not float around the whole page
- transitional hidden symbolic layers should appear only subtly and ideally only during rotation moments
- no cheap magic effects
- no loud occult styling
- no fantasy overload
- no generic cinematic landscape treatment
- light background
- calm premium loop
- motion should be slow, meditative, and elegant

### Technical implementation direction
The practical implementation path chosen was:
- circular masked media container
- native HTML5 video
- autoplay
- muted
- loop
- no controls
- adaptive desktop / mobile handling
- later evolve toward admin-managed media source

### Future integration direction
The long-term plan is to make hero media source manageable via admin/CMS-like settings.

Likely future settings shape:
- enabled
- mediaType
- desktopVideoSrc
- mobileVideoSrc
- posterSrc
- imageSrc

But the current priority is first to stabilize the visual and practical local implementation.

---

## Migration reality

This repository has already been successfully moved from Firebase Studio workflow into **Google Antigravity**.

Confirmed:
- repository cloned successfully
- Git works
- dependencies install
- local dev server starts
- local rendering works after proper `.env.local` is provided

Firebase Studio should now be treated as a reference environment only.

GitHub is the source of truth.

---

## Environment configuration rules

### Recommended structure
Use:
- `.env.local` for real local values
- `.env.example` for safe variable template only

Do not rely long-term on a secret-filled `.env` as the primary working file if it can be avoided.

### Important
Some secrets were exposed during migration handling and must be treated as compromised.
They should later be rotated / replaced.

Do not print secret values in documentation or assistant outputs.

---

## Shared backend warning

This website repo shares the same Firebase backend as the separate app repo.

That means:
- backend changes can affect both repos
- data models may be shared
- auth flows may be shared
- collections may be shared

Never assume website changes are isolated from app consequences.

Before making backend-touching changes, verify whether the change affects:
- website only
- app only
- both

---

## How to work safely in this repo

Before implementing anything, verify:
1. whether the feature belongs in website repo or app repo
2. whether content should be admin-managed
3. whether Firebase data is shared with the app repo
4. whether env changes are safe
5. whether homepage hero visual rules are being preserved
6. whether blog/admin logic already depends on existing behavior

---

## Assistant behavior expectations

When helping in this website repo:

### Do
- reason from actual files and current code
- respect the admin-managed architecture direction
- preserve the symbolic homepage hero concept
- keep solutions practical and production-minded
- mark uncertain items as "needs verification"
- distinguish public website concerns from app concerns
- think in terms of content governance, not just UI rendering

### Do not
- describe this as a generic marketing site
- flatten the homepage hero into a generic stock-video block
- hardcode content that should become managed later
- ignore shared-backend implications
- assume unfinished roadmap features without evidence
- invent architecture from generic SaaS templates

---

## Current practical priorities

1. keep website repo stable in Antigravity
2. preserve and continue homepage hero-circle media work
3. maintain admin-managed content philosophy
4. keep blog / moderation / publication logic consistent
5. normalize env handling safely
6. avoid shared-backend regressions

---

## Short summary

This repository is the public-facing website layer of the platform ecosystem.

It handles first impression, trust, content, blog, and audience routing.
It already contains meaningful admin-managed structures.
Its homepage hero has a very specific circular symbolic media direction that must be preserved.
It shares a Firebase backend with the separate app repo and should never be treated as isolated from that reality.
# SHARED_BACKEND_CONTEXT.md

## Purpose of this document

This document explains the most important shared-backend realities between the two main repositories in this ecosystem:

1. **Website repo / LECTOR**
2. **App repo / ConnectU**

These are separate codebases, but they rely on the **same Firebase backend project**.

This means assistants, developers, and agents must not treat them as isolated systems.

---

## Core shared-backend truth

Both repositories use the same Firebase project as a backend layer.

That means they may share:
- Firebase Auth
- Firestore
- Storage
- server-side Firebase Admin usage
- environment-sensitive service configuration
- overlapping data models
- overlapping user identities
- overlapping collection structures

A change in one repo can have consequences in the other repo even if no direct code import exists between them.

---

## What is shared vs what is separate

### Separate
- repository history
- codebase structure
- UI implementation
- local workspace
- local package dependencies
- route structures
- product surface area

### Shared
- Firebase project identity
- user accounts / auth domain
- Firestore data model in overlapping areas
- Storage bucket usage
- server credentials / service account usage patterns
- operational risk when changing backend-connected behavior

Do not confuse repository separation with data separation.

---

## Main risk of misunderstanding

The biggest mistake an assistant or developer can make is:

> “This is a separate repo, so changes here cannot affect the other repo.”

That is false in this ecosystem.

If a change touches:
- auth
- shared collections
- Firebase rules
- storage paths
- server credentials
- user profile data
- communication/session data
- publication/content records
- common settings documents

then it may affect both repos.

---

## Shared Firebase considerations

Before making any backend-connected change, verify:

1. **Which Firebase project is currently configured**
2. **Which env values are active**
3. **Which collections or documents are touched**
4. **Whether those structures are used by the website, the app, or both**
5. **Whether auth/session assumptions are shared**
6. **Whether server-side credentials are involved**

Never assume a Firebase change is local to one repo until verified.

---

## Shared environment considerations

Both repos may use different local env files, but still point to the same backend project.

This means:
- local env values may differ in structure
- repo-specific third-party integrations may differ
- but the Firebase project identity may still be shared

Examples of repo-specific differences:
- website repo may focus on content/admin/public-site variables
- app repo may include call/translation/runtime variables
- both may still point to the same Firebase project

### Recommended env discipline
For both repos:
- `.env.local` = real local runtime values
- `.env.example` = template only, no secrets

Avoid long-term dependence on secret-filled `.env` files if they can be phased out safely.

---

## Security note

Some secrets were exposed during migration handling and must be treated as compromised.

This includes, where applicable:
- Firebase service account credentials
- Firebase private keys
- server-side emails / keys
- Azure keys
- Daily-related secrets
- any other real secret values shown on screen or copied into unsafe contexts

These should be rotated / replaced.

Do not assume previously exposed credentials are still safe for production use.

---

## Shared data caution zones

The following types of data should be treated as potentially shared-impact areas:

- user identity records
- profile data
- public content / publication records
- moderation / queue records
- settings documents
- communication session records
- translation session records
- billing / status / lifecycle documents
- storage paths tied to shared users or public assets

Any change in naming, shape, validation, or permissions in these areas should be treated as cross-repo sensitive.

---

## Assistant workflow rules

When helping inside either repo, always ask:

1. Is this change UI-only or backend-connected?
2. Does this touch Firebase data?
3. Is this data also used in the other repo?
4. Is the env config pointing to the shared production-like backend?
5. Could this break auth, content visibility, session handling, or admin workflows in the other repo?

If unsure, mark the issue as:
- **needs verification**
- **shared-backend sensitive**
- **possible cross-repo impact**

---

## Safe change categories

Usually lower-risk:
- isolated styling changes
- clearly local UI-only changes
- component refactors with no backend effect
- docs / comments / handoff docs
- route layout changes with no shared data assumptions

Usually higher-risk:
- Firebase config changes
- auth changes
- Firestore path changes
- collection/document schema changes
- server-side credential changes
- rules changes
- storage structure changes
- settings document changes
- moderation/publication workflow changes
- communication/session lifecycle changes

---

## Coordination rule between repos

Even when working in only one repo, maintain awareness of the other repo.

### Website repo focus
- public discovery
- content
- blog
- admin-managed website structures
- homepage hero / brand layer

### App repo focus
- product runtime
- communication / sessions / calls
- translation-related integrations
- deeper operational platform behavior

### Shared-backend rule
If a change touches backend data used by both, do not treat it as repo-local work.

---

## Post-migration operational reality

Both repos now run in **Google Antigravity**.

That means:
- Firebase Studio is reference-only
- GitHub is the source of truth
- local development can continue outside Firebase Studio
- backend coordination is now even more important, because the safety net of the old workspace mindset is gone

This is good, but it requires discipline.

---

## Recommended team rule

When changing backend-connected logic, document:
- what repo the change was made in
- what Firebase structures it touches
- whether cross-repo impact was checked
- what env assumptions were used
- whether production / preview / local values differ

Even a short note is better than silent assumptions.

---

## Short summary

The website repo and app repo are separate codebases but share the same Firebase backend project.

This makes backend-connected work cross-repo sensitive by default.

Do not assume isolation.
Verify envs, Firebase targets, data structures, and shared usage before making changes.
Treat exposed credentials as compromised and rotate them.
Use `.env.local` for real local values and `.env.example` for safe templates.
# WEBSITE_MIGRATION_STATUS.md

## Repository

Website / LECTOR

## Migration target

Google Antigravity

## Migration status

Migration to Antigravity is functionally successful.

### Confirmed completed
- repository cloned successfully from GitHub
- project opens correctly in Antigravity
- Git is installed and working
- dependencies install successfully
- local environment file was restored manually
- local dev server starts successfully
- homepage renders correctly
- page is interactive / clickable
- project can now be worked on outside Firebase Studio

## Important technical notes

### Local runtime
The website repo runs locally in Antigravity after restoring `.env.local`.

### PowerShell note on Windows
PowerShell may block `npm.ps1`.
Working command pattern may be:

- `npm.cmd install`
- `npm.cmd run dev`

or temporary execution-policy bypass for the current shell.

### Environment note
The local environment was not transferred automatically through GitHub because local env files are excluded from source control.
`.env.local` had to be recreated manually.

### Security note
Some secret values were exposed during migration handling and must be treated as compromised.
They should be rotated / replaced later.

## Firebase Studio status

Firebase Studio should now be treated as:
- legacy reference environment
- backup visual/code reference only

GitHub is the source of truth.
Antigravity is now the active development environment.

## What still needs follow-up

1. normalize environment documentation
2. create or refine `.env.example`
3. rotate compromised secrets
4. continue homepage hero-circle media work in Antigravity
5. verify key public and admin routes after migration
6. preserve admin-managed content architecture during future work

## Migration confidence

High.

The website repo is already running in the new environment and is usable for continued development.

## Homepage hero media rules

The homepage hero contains a large circular media area.
This is a critical brand element and must not be treated as a generic banner or stock-video block.

### Data/storage rules
Use a single Firestore settings document:
`siteSettings/homeHeroMedia`

Use Firebase Storage paths under:
`site/home-hero/...`

Do not invent alternative collection names or scattered settings documents unless explicitly requested.

### Media rules
Supported media types:
- video
- image

Preferred settings shape:
- enabled
- mediaType
- desktopVideoUrl
- desktopVideoPath
- mobileVideoUrl
- mobileVideoPath
- posterUrl
- posterPath
- imageUrl
- imagePath
- updatedAt
- updatedBy
- version

### Frontend rules
The media must render only inside the existing circular hero area.
Do not replace the circular visual concept with a rectangular media block.
Preserve the current hero layout and circle outline.
Use native HTML5 video only.
Video must be:
- autoplay
- muted
- loop
- playsInline
- no controls

### Admin rules
Admin must be able to:
- enable/disable media
- choose media type
- upload desktop video
- upload mobile video
- upload poster
- upload image fallback
- preview current saved media

### Fallback rules
If no Firestore settings exist, use a safe local fallback.
If mobile video is missing, use desktop video.
If media is missing or broken, do not break homepage rendering.

### Implementation rules
Prefer a minimal practical implementation.
Integrate with existing admin/settings architecture if possible.
Do not overengineer.
Do not create multiple disconnected hero media systems.

## Homepage hero media implementation status

The homepage hero circle media feature is implemented.

### Current implementation
- Firestore settings document:
  `siteSettings/homeHeroMedia`
- Firebase Storage path:
  `site/home-hero/`
- Frontend component:
  `src/components/hero-circle-media.tsx`
- Homepage integration:
  `src/app/page.tsx`
- Admin UI:
  `src/app/admin/content/hero/page.tsx`
- Admin nav entry:
  `/admin/content/hero`

### Current behavior
- media can be managed from admin
- supported media types:
  - video
  - image
- homepage reads settings from Firestore
- media assets are loaded from Firebase Storage
- the media is rendered only inside the circular homepage hero area
- layout must remain unchanged

### Rule
Do not redesign this feature unless explicitly requested.
Extend it carefully and preserve the current circular hero concept.

