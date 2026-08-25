# Trailo Dashboard — Complete Blueprint

Status: Draft for approval — no implementation started.
Grounded against the actual codebase as of 2026-08-25 (not invented specs).

---

## 1. Purpose & Scope

Redesign `/dashboard` (currently [app/dashboard/page.tsx](app/dashboard/page.tsx)) from a bare greeting + single trip card into an operational home screen that answers three questions every time an operator opens it:

1. **What's happening?** (metrics, recent activity)
2. **What needs my attention?** (risk, blockers, overdue items)
3. **What should I do next?** (quick actions, guided next step)

Scope is the dashboard shell and its zones. It does not include rebuilding Trips, Leads, Bookings, Payments as standalone pages — those already exist and the dashboard links into them.

---

## 2. Current State Audit (verified against code)

| Area | Finding | Source |
|---|---|---|
| Dashboard page | Greeting + "Plan new trip" CTA + one "Recently Updated" trip card or empty state. Nothing else. | [app/dashboard/page.tsx](app/dashboard/page.tsx) |
| Navigation | Flat list, 8 items, no grouping: Overview, Trips, Leads, Customers, WhatsApp, Bookings, Payments, Business Profile | [app/dashboard/layout.tsx:43-52](app/dashboard/layout.tsx#L43-L52) |
| Trips | 1 mock trip, status `draft`, 0 itinerary days, 0 media, no landing page linked | [lib/api/trips/mock/mock-data.ts](lib/api/trips/mock/mock-data.ts) |
| Leads | 5 mock leads: 1 negotiating, 1 new, 1 qualified, 1 contacted, 1 lost. 2 have `nextActionAt` set (follow-up dates) | [lib/api/leads/mock/mock-data.ts](lib/api/leads/mock/mock-data.ts) |
| Bookings | **Empty array** — 0 bookings exist in mock data | [lib/api/bookings/mock/mock-data.ts](lib/api/bookings/mock/mock-data.ts) |
| Payments | **Empty array** — 0 payments exist | [lib/api/payments/mock/mock-data.ts](lib/api/payments/mock/mock-data.ts) |
| Customers | **Empty array** — 0 customers | [lib/api/customers/mock/mock-data.ts](lib/api/customers/mock/mock-data.ts) |
| Departures | **Empty array** — 0 departures scheduled | [lib/api/departures/mock/mock-data.ts](lib/api/departures/mock/mock-data.ts) |
| Business | "Acme Travels", verified, 1 team member (owner) | [lib/api/business/mock/mock-data.ts](lib/api/business/mock/mock-data.ts) |
| Design tokens | Dark-only theme (no light mode toggle exists). Accent orange `#F2762E`. Destructive `#E5484D`. Success `#4ADE80`. Radius base `0.5rem`. Display font = Big Shoulders, body = Inter. | [app/globals.css:69-111](app/globals.css#L69-L111) |
| Motion tokens | Shared `EASE`/`DURATION`/`STAGGER` vocabulary already exists — must reuse, not invent new values | [lib/motion.ts](lib/motion.ts) |
| GSAP usage | Registered via [lib/gsap.ts](lib/gsap.ts). Currently used only in marketing (`Hero`, `FinalCta`, `BusinessReality`, `Reveal`, `TiltCard`, `TripToPage`, `RouteLine`) and `MagneticButton`. **Zero usage inside `/dashboard`.** | grep across `components/` |
| Button system | shadcn `Button` (base-ui primitive, cva variants: default/outline/secondary/ghost/destructive/link) + `MagneticButton` (adds GSAP magnetic-pull/tap-scale on top of the same variant recipe) | [components/ui/button.tsx](components/ui/button.tsx), [components/MagneticButton.tsx](components/MagneticButton.tsx) |

### Known data quirk (not a bug, just a fact to design around)
The mock trip is tagged `businessId: 'b_123'` while the logged-in mock session and business profile use `b_existing`. This doesn't break anything today because the mock trips adapter intentionally ignores `businessId` filtering ("Return all mock trips regardless of session" — [lib/api/trips/mock/mock-adapter.ts:34](lib/api/trips/mock/mock-adapter.ts#L34)). Flagging it so nobody "fixes" it into a regression later.

### What this means for the plan
Real seed data currently sits at **1 draft trip + 5 leads + 0 bookings + 0 payments + 0 customers + 0 departures**. That's a specific point in the maturity spectrum (Section 7) — trip creation has started, leads are already flowing in, but nothing has converted yet. The dashboard's default/demo view must look correct for exactly this state, not just the theoretical "empty" or "fully established" extremes.

---

## 3. Dashboard's Core Jobs

Every zone on the page must serve one of these three jobs. If a component doesn't answer one of them, it doesn't belong on the dashboard — it belongs on a detail page.

1. **Status** — revenue, bookings, leads, conversion at a glance
2. **Risk** — what's about to go wrong if ignored (Attention system)
3. **Action** — the fastest path to the next valuable action (Quick Actions + guided next step)

---

## 4. Information Architecture — Current vs Proposed

**Current** (flat, 8 items, [app/dashboard/layout.tsx](app/dashboard/layout.tsx)):
```
Overview · Trips · Leads · Customers · WhatsApp · Bookings · Payments · Business Profile
```

**Proposed** (grouped, 4 sections):
```
OPERATE    Dashboard · Attention · Departures
MANAGE     Trips · Bookings · Customers · Leads · Payments
GROW       Campaigns · Landing Pages · WhatsApp · Analytics
CONFIGURE  Business Profile · Team · Integrations
```

Notes on new items not yet in the codebase:
- **Attention** — new dedicated page, deep-links from the dashboard's Attention zone (Section 12)
- **Campaigns** and **Analytics** — do not exist yet; out of scope for this dashboard rebuild, listed here only so the nav hierarchy is coherent. Do not build these routes as part of this plan.
- **Team** — team members already modeled (`TeamMember` type, `useTeamMembers` hook exist) but have no dedicated page; currently folder under Business Profile
- **Integrations** — does not exist; placeholder only, not in scope

**Open question for approval:** should Campaigns/Analytics/Integrations be left out of the nav entirely until they're built, rather than showing as dead links? Recommendation: leave them out until scope is confirmed — a nav item that 404s is worse than a shorter menu.

---

## 5. Business Maturity State System

Six states, keyed off real data conditions (trips, leads, bookings, payments):

| State | Condition | Dashboard tone |
|---|---|---|
| **A — New** | 0 trips | "Create your first trip" onboarding card, no metrics |
| **B — Drafts** | ≥1 trip, all `draft` status | "Publish your trip to start getting bookings" guidance |
| **C — Published, no leads** | ≥1 `published` trip, 0 leads | Motivational tone, share-your-landing-page prompt |
| **D — Leads, no bookings** | ≥1 lead, 0 bookings | "Convert leads to bookings" framing, lead follow-up surfaced |
| **E — First booking** | ≥1 booking, revenue < some threshold (e.g. 5 bookings) | Revenue tracking introduced, payment alerts active |
| **F — Established** | ≥5 bookings (or business-configurable threshold) | Full metrics dashboard, trend comparisons |

**Current mock data maps to State D** (1 draft trip — not yet published — but 5 leads already exist, 0 bookings). This is an edge case the state machine must handle explicitly: leads can arrive before a trip is published (e.g., WhatsApp/referral leads), so state detection cannot assume `published trip → leads → bookings` as a strict linear funnel. Recommend state detection use **independent flags**, not a single linear enum:

```
hasTrips: trips.length > 0
hasPublishedTrip: trips.some(t => t.status === 'published')
hasLeads: leads.length > 0
hasBookings: bookings.length > 0
hasEstablishedVolume: bookings.length >= 5   // threshold TBD, ask user
```
Then derive the display state from the combination, with the guidance card picking the *most actionable* gap (e.g., "you have leads but no published trip yet" is a distinct, valid message state C/D doesn't cover on its own).

**Question for you:** the original 6-state list assumes a strict funnel (A→B→C→D→E→F). Real data shows that's not guaranteed. Should I build the flag-based model above instead of a strict linear state enum?

---

## 6. Dashboard Zones (7 zones, top to bottom)

```
┌─────────────────────────────────────┐
│ 1. Header (greeting + primary CTA)   │
├─────────────────────────────────────┤
│ 2. Metrics Row (4 cards)             │
├─────────────────────────────────────┤
│ 3. Attention (red/orange/yellow)     │
├─────────────────────────────────────┤
│ 4. Quick Actions (grid of buttons)   │
├─────────────────────────────────────┤
│ 5. Upcoming Departures (list)        │
├─────────────────────────────────────┤
│ 6. Performance (occupancy, avg value)│
├─────────────────────────────────────┤
│ 7. Recent Activity (feed)            │
└─────────────────────────────────────┘
```

Zones 5–7 are the first to collapse/simplify under empty states (Section 5) — e.g. State A/B shows only zones 1, 3 (onboarding-flavored), 4.

---

## 7. Zone 1 — Header

- Greeting: `Welcome back, {session.user.name}` (already implemented, keep)
- Primary CTA changes by state: State A/B → "Create/Publish trip"; State C+ → "Create Campaign" or context-appropriate action
- No metrics in header — that's Zone 2's job

---

## 8. Zone 2 — Metrics Row

4 cards, each: value, trend arrow + %, sparkline (optional, Phase-gated), link to detail page.

| Metric | Formula | Source |
|---|---|---|
| Revenue (this week) | `sum(payments.filter(paid this week).amount)` | `usePayments` |
| Bookings | `bookings.filter(status !== 'cancelled').length`, trend = vs. last period | `useBookings` |
| New Leads | `leads.filter(createdAt within period).length` | `useLeads` |
| Conversion Rate | `bookings.length / leads.length` (guard divide-by-zero → show "—" not "0%" or "Infinity%" when `leads.length === 0`) | derived |

**Question:** should Average Booking Value or Capacity Utilization be a 5th card, or live only in Zone 6 (Performance)? Recommendation: keep the metrics row to 4 — that's the number a person can actually scan at a glance; put the rest in Zone 6 where a lower-frequency check-in is expected.

---

## 9. Zone 3 — Attention System

Not a general activity feed — only things that need a decision. Three severity tiers:

**Red (revenue risk)**
- Payments with `status === 'pending'` older than 48h
- Leads with unanswered follow-up: `nextActionAt` has passed and status hasn't changed since

**Orange (operational risk)**
- Departures with `booked / capacity >= 0.95` and `status !== 'full'` (about to oversell or needs status update)
- Trips in `draft` with no `itinerary` entries (incomplete listing)
- Leads with `status === 'new'` untouched for 24h+

**Yellow (optimization)**
- Conversion rate below a rolling average
- Upcoming departure (within 7 days) reminder

Each card: severity color, one-line description, single action button (not a general "view" — the specific fix, e.g. "Follow up now" deep-links to that lead).

**Question on thresholds:** the 48h/24h/95% numbers above are reasonable defaults but arbitrary — do you want these configurable per business, or hardcoded to start?

---

## 10. Zone 4 — Quick Actions

Grid of buttons, state-aware set. Default (State D/E/F) proposal:
1. Create Trip
2. Create Campaign *(no-op until Campaigns exists — recommend omitting this button until that page ships, see Section 4)*
3. View Leads → pre-filtered to unanswered
4. View Bookings → pre-filtered to pending
5. View Payments → pre-filtered to failed/pending
6. Analytics *(same caveat as Campaigns — omit until built)*

**Revised recommendation given what actually exists today:** ship 4 buttons (Create Trip, View Leads, View Bookings, View Payments) and add Campaigns/Analytics buttons only once those routes exist, rather than linking to pages that don't exist yet.

---

## 11. Zone 5 — Upcoming Departures

- Next 5–7 departures sorted by `startDate`, using `useDepartures`
- Per-row: trip name, date range, `booked/capacity`, status badge, quick edit link
- **Currently 0 departures in mock data** — this zone's empty state matters as much as its populated state. Empty state: "No departures scheduled — add dates to your published trips."

---

## 12. Zone 6 — Performance

- Occupancy rate: `avg(departures.map(d => d.booked/d.capacity))`
- Average booking value: `avg(bookings.map(b => b.totalAmount))`
- Small sparkline per metric (GSAP-free — CSS/SVG only, see Section 25 on where GSAP is/isn't warranted)

This zone is the first to hide entirely in States A–C (nothing to show yet).

---

## 13. Zone 7 — Recent Activity

- Merged, reverse-chronological feed: new leads, new bookings, payment events, lead status changes
- Practical source: leads already carry a `timeline: LeadTimelineEvent[]` array ([types/lead.ts:5-10](types/lead.ts#L5-L10)) — reuse that shape/pattern for consistency rather than inventing a new activity-event type
- Cap at ~10 items, "View all" link (destination TBD — no unified activity page exists; could route to individual entity pages by item type)

---

## 14. Revenue Architecture

Revenue shows up in three places with three different framings — call this out explicitly so implementation doesn't duplicate logic three times:

1. **Zone 2 metric card** — single number, this week, trend %
2. **Zone 6 performance** — average booking value (a *different* revenue lens, not the same number restated)
3. **Attention (Red)** — payments *at risk* (pending/failed), not revenue earned

All three should derive from the same `usePayments`/`useBookings` hooks with different filters/aggregations — not three separate fetches or three separate mock derivations that could drift.

---

## 15. Component Architecture (proposed file map)

```
app/dashboard/page.tsx                          — orchestrates zones, fetches state
components/dashboard/
  DashboardHeader.tsx                            — Zone 1
  MetricsRow.tsx                                 — Zone 2 container
  MetricCard.tsx                                 — single metric, reusable
  AttentionSection.tsx                           — Zone 3 container
  AttentionCard.tsx                              — single alert, reusable
  QuickActions.tsx                                — Zone 4
  UpcomingDepartures.tsx                          — Zone 5
  PerformanceSection.tsx                          — Zone 6
  ActivityFeed.tsx                                — Zone 7
  BusinessStateGuidance.tsx                       — State A-D onboarding cards
lib/dashboard/
  useBusinessState.ts                             — derives state flags (Section 5)
  useDashboardMetrics.ts                          — aggregates revenue/bookings/leads/conversion
  useAttentionItems.ts                            — computes red/orange/yellow list
```

This mirrors the existing `lib/api/{domain}/hooks/` pattern already used across the codebase (`useTrips`, `useLeads`, etc.) rather than introducing a new convention.

---

## 16. Data Flow

Each zone hook composes existing domain hooks — no new API/service layer needed, since all underlying services (`useTrips`, `useLeads`, `useBookings`, `usePayments`, `useDepartures`, `useCustomers`) already exist and work against the mock adapters.

```
useDashboardMetrics()
  → useTrips(businessId)
  → useLeads(businessId)
  → useBookings(businessId)
  → usePayments(businessId)
  → derives: revenue, bookingsCount, newLeadsCount, conversionRate

useAttentionItems()
  → useLeads(businessId)   (nextActionAt checks)
  → usePayments(businessId) (pending/failed checks)
  → useDepartures(businessId) (capacity checks)
  → useTrips(businessId)   (incomplete draft checks)
```

Fetches should run in parallel (`Promise.all` / independent hook calls, not sequential awaits) — this was explicitly named in the original plan summary as a Phase 1 goal and matches how `useTrips`/`useSession` are already called independently in the current page.

---

## 17. Design System Tokens Reference

Pull directly from [app/globals.css](app/globals.css) — do not introduce new colors:

| Token | Value | Use for |
|---|---|---|
| `--background` | `#0A0A0A` | page background |
| `--card` | `#111111` | card surfaces |
| `--accent` | `#F2762E` (orange) | primary accent, active nav state, CTA highlight |
| `--destructive` | `#E5484D` | Red attention tier |
| `--success` | `#4ADE80` | positive trend arrows, confirmed states |
| Orange for Orange tier | derive from `--accent` at reduced opacity, or add a dedicated `--warning` token if design wants a 3rd distinct hue (accent orange and "orange tier" orange would otherwise be identical — needs a decision, see below) |
| `--muted-foreground` | `#9C988F` | secondary text, Yellow tier if no dedicated warning color |
| `--radius` | `0.5rem` base | all card/button radii already scale off this |
| `font-display` | Big Shoulders | headings, metric numbers |
| `font-sans` | Inter | body text |

**Decision needed:** the Attention system's "Orange" tier and the brand's `--accent` orange are the same hue in the current palette. Recommend adding a distinct `--warning` token (e.g. amber) so Orange-tier alerts don't visually compete with/get mistaken for CTAs and active nav highlights, which are already accent-orange. Should I add one?

---

## 18. Shadcn Customization Rules

- Reuse `buttonVariants` from [components/ui/button.tsx](components/ui/button.tsx) for all dashboard buttons — don't create parallel button styling
- For CTAs that want the magnetic/tap-scale treatment, use `MagneticButton` (already shares the same variant recipe — see the comment at [components/MagneticButton.tsx:70-75](components/MagneticButton.tsx#L70-L75))
- Avoid default shadcn card shadows/borders that read as generic SaaS — match the existing dark, high-contrast, minimal-border aesthetic already established in [app/dashboard/page.tsx](app/dashboard/page.tsx) (`bg-card border border-border rounded-2xl`)
- No new component library additions — everything needed (Button, Card primitives if used) should already be in `components/ui/`

---

## 19. Motion System — Where GSAP Actually Adds Value

Reuse [lib/motion.ts](lib/motion.ts) tokens (`EASE`, `DURATION`, `STAGGER`) — do not hardcode new easing curves or durations.

| Motion | Token to use | Why here, not elsewhere |
|---|---|---|
| Metric cards stagger in on load | `EASE.out`, `DURATION.base`, `STAGGER.base` | One-time orientation cue, not decoration |
| Quick action button tap scale | Already exists via `MagneticButton` — reuse, don't reimplement | Consistency with marketing CTAs |
| Revenue number counts up on change | `gsap.to` tweening a numeric value, `EASE.out`, `DURATION.base` | Makes a metric *change* legible, not just decorative |
| Attention card slide-in / dismiss | `EASE.out` in, custom short tween out | Alerts appearing/resolving should be felt, not silent |
| Tab/section transitions (if tabs are used anywhere) | `EASE.inOut`, `DURATION.fast` | Only if tabs are actually part of the final design — not committed yet |

**Explicitly no motion on:** static text, borders, background colors on hover (use CSS transitions per the existing `transition-colors` pattern already in the codebase — GSAP is reserved for the things it's already used for: physics-feel interactions and orchestrated multi-element reveals).

---

## 20. Reduced Motion & Accessibility

- Respect `prefers-reduced-motion` — check how `lib/gsap.ts`/`Reveal.tsx` currently handle this (needs verification during Phase 1 — not yet confirmed whether an existing guard exists) and extend the same guard to dashboard animations rather than writing a second mechanism
- Keyboard navigation through Quick Actions and Attention cards (tab order, visible focus — the existing `:focus-visible` outline rule in [app/globals.css:150-154](app/globals.css#L150-L154) already applies globally, verify it isn't overridden)
- Color is never the only signal for Attention severity — pair with icon/label, not just red/orange/yellow dots (contrast/colorblindness)

---

## 21. Responsive Behavior

- Metrics row: 4-across on desktop → 2×2 on tablet → stacked on mobile
- Attention/Quick Actions: full-width stack on mobile
- Sidebar nav (currently `hidden md:flex`, [app/dashboard/layout.tsx:57](app/dashboard/layout.tsx#L57)) stays desktop-only; mobile header stays the existing pattern — new OPERATE/MANAGE/GROW grouping needs a mobile nav solution (currently mobile only shows a "Trips" link in the header, [app/dashboard/layout.tsx:116-118](app/dashboard/layout.tsx#L116-L118)) — **this is a gap**: a grouped nav with 12+ items has no mobile home today. Needs a decision (mobile drawer? Bottom nav? Not currently scoped).

---

## 22. Open Questions Requiring Your Approval

1. **Nav grouping** (Section 4) — approve OPERATE/MANAGE/GROW/CONFIGURE, or modify?
2. **Campaigns/Analytics/Integrations** — omit from nav and Quick Actions until those pages actually exist, rather than linking to 404s? (Recommended: yes, omit)
3. **State model** (Section 5) — flag-based (independent booleans) instead of strict linear A→F enum, since real data doesn't follow the linear funnel? (Recommended: yes, flags)
4. **5th metric card** — stay at 4 (Revenue/Bookings/Leads/Conversion) or add Avg Booking Value / Capacity? (Recommended: stay at 4, put extras in Performance zone)
5. **Attention thresholds** — 48h/24h/95% hardcoded to start, or configurable? (Recommended: hardcoded first, configurable later if requested)
6. **Warning color token** — add a distinct `--warning` amber so Orange-tier alerts don't collide visually with the brand accent orange? (Recommended: yes)
7. **Mobile nav for the new grouped structure** — needs a pattern decision (drawer/bottom-nav), not currently scoped in original plan

---

## 23. Implementation Phases

15 phases, sequential with some parallelizable once Phase 1 lands. ~13-20 hours total.

### Phase 1 — Foundation
- [ ] Dashboard shell layout, replaces current [app/dashboard/page.tsx](app/dashboard/page.tsx)
- [ ] `useBusinessState` hook (Section 5 flags)
- [ ] Parallel data fetching wired up (trips/leads/bookings/payments/departures)

### Phase 2 — Core Metrics
- [ ] `MetricCard` component
- [ ] `useDashboardMetrics` hook with the 4 formulas (Section 8)
- [ ] Stagger entrance animation

### Phase 3 — Attention System
- [ ] `AttentionCard` + `AttentionSection`
- [ ] `useAttentionItems` hook implementing Red/Orange/Yellow rules (Section 9)
- [ ] Slide-in/dismiss animation

### Phase 4 — Quick Actions
- [ ] `QuickActions` grid, 4 buttons to start (Section 10)
- [ ] Pre-filtered deep links (unanswered leads, pending bookings, failed payments)

### Phase 5 — Business State Guidance
- [ ] `BusinessStateGuidance` component, State A/B/C onboarding cards
- [ ] Conditional zone hiding for early states

### Phase 6 — Revenue Deep Dive
- [ ] Time-period filters on the Revenue metric
- [ ] Counter animation on value change

### Phase 7 — Bookings & Leads Detail Wiring
- [ ] Conversion pipeline visual (leads → bookings)
- [ ] Filtered links from metrics into list pages

### Phase 8 — Upcoming Departures
- [ ] `UpcomingDepartures` zone + empty state copy

### Phase 9 — Performance Section
- [ ] Occupancy + average booking value calculations
- [ ] Sparkline rendering (CSS/SVG, no GSAP)

### Phase 10 — Activity Feed
- [ ] `ActivityFeed`, reusing the `LeadTimelineEvent` shape as a pattern

### Phase 11 — Navigation Restructure
- [ ] OPERATE/MANAGE/GROW/CONFIGURE grouping in [app/dashboard/layout.tsx](app/dashboard/layout.tsx)
- [ ] Only link to routes that exist (Section 22, Q2)
- [ ] Mobile nav solution for grouped structure (Section 22, Q7)

### Phase 12 — Responsive Pass
- [ ] Full mobile/tablet verification of every new zone

### Phase 13 — Theming Verification
- [ ] Contrast check on new `--warning` token (if approved)
- [ ] Confirm no new colors introduced outside Section 17's table

### Phase 14 — Motion Pass
- [ ] All animations wired to shared `EASE`/`DURATION`/`STAGGER` tokens
- [ ] `prefers-reduced-motion` guard verified/extended

### Phase 15 — Testing & Polish
- [ ] Test against all business-state flag combinations, not just the linear A→F path
- [ ] Test with current real mock data (1 draft trip, 5 leads, 0 bookings) as the primary scenario, since that's what actually renders today
- [ ] Accessibility pass (keyboard, focus, color-independent severity)
- [ ] Final visual polish

---

## 24. Success Criteria

- Dashboard answers "what's happening / what needs attention / what should I do" without clicking into another page
- Renders correctly against the actual current mock data state (State D: draft trip + leads, no bookings) — not just a hypothetical fully-populated demo
- No dead links (Campaigns/Analytics omitted until built)
- All motion reuses existing `lib/motion.ts` tokens — zero new hardcoded easing/duration values
- Attention severity is distinguishable without color alone
- Nav works on both desktop (grouped sidebar) and mobile (pattern TBD, Section 22 Q7)

---

## 25. Explicitly Out of Scope

- Building the Campaigns, Analytics, or Integrations pages themselves
- Backend/real API work — this stays on the existing mock adapter pattern
- Changing the trip editor, leads, bookings, payments, or customers pages themselves (only linking into them)
- Light mode (site is confirmed dark-only, no toggle exists or is planned)
