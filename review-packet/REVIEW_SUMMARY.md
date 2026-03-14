# Thai Study App — Design & UX Review Packet

**App:** เรียนไทย ("Learn Thai") — คุณแคท · Thai Study
**Tech:** React 19 · Vite 7 · No external UI framework · localStorage persistence
**Date captured:** 2026-03-07
**Prepared for:** ChatGPT design / UX / product feedback

---

## 1. Screenshots included

| File | Page | Viewport |
|------|------|----------|
| `dashboard-desktop.jpg` | Dashboard / Home | 1440 × 900 |
| `dashboard-mobile.jpg` | Dashboard / Home | 390 × 844 |
| `vocabulary-desktop.jpg` | Vocabulary | 1440 × 900 |
| `vocabulary-mobile.jpg` | Vocabulary | 390 × 844 |
| `flashcards-desktop.jpg` | Flashcards (StudyPage) | 1440 × 900 |
| `flashcards-mobile.jpg` | Flashcards | 390 × 844 |
| `categories-desktop.jpg` | Categories | 1440 × 900 |
| `grammar-desktop.jpg` | Grammar | 1440 × 900 |
| `numbers-desktop.jpg` | Numbers | 1440 × 900 |
| `conversation-desktop.jpg` | Conversation Practice | 1440 × 900 |
| `conversation-mobile.jpg` | Conversation Practice | 390 × 844 |
| `sentence-builder-desktop.jpg` | Sentence Builder | 1440 × 900 |

> **Note:** No "Daily Practice" dedicated page exists. That content lives inside the Dashboard as a "Today's study" block.

---

## 2. Navigation structure

The app uses a fixed left sidebar with three labelled groups:

```
┌──────────────────┐
│  เรียนไทย        │
│  คุณแคท · Thai Study │
├──────────────────┤
│  LEARN           │
│  🏠 Dashboard    │
│  📖 Vocabulary   │
│  🃏 Flashcards   │
│  🗂️ Categories   │
├──────────────────┤
│  PRACTICE        │
│  💬 Conversation │
│  ✍️ Sentence Builder │
├──────────────────┤
│  REFERENCE       │
│  📐 Grammar      │
│  🔢 Numbers      │
└──────────────────┘
```

- Navigation is **single-page stateful** — no URL routing (no React Router). All page switches are React state changes.
- The sidebar is always visible on desktop. On mobile it stacks (no hamburger menu implemented).
- Active page is highlighted with a `.on` class.
- "Flashcards" in the sidebar is a direct entry to the study player for **all words**. A per-category entry also exists from Dashboard quick-study buttons and the Categories page.

---

## 3. Current study flow

### 3a. Daily review loop (Dashboard → tools)

```
Dashboard
  └─ "Today's study" block (auto-generated daily, day-seed based)
       ├─ Day label: "15-min daily review" OR "Deep study day" (Wed + Sat)
       ├─ 5 vocab words to review today (seeded, changes at midnight)
       ├─ Grammar of the day → [See all grammar →] → Grammar page
       ├─ Sentence to try today → [Practice in Sentence Builder →] → Sentence Builder
       └─ Conversation to revisit → [Open →] → Conversation page
```

### 3b. Vocabulary study loop

```
Dashboard / Categories
  └─ [Quick study: "All words" or category button]  ─┐
                                                      ▼
Categories page                                  Flashcards (StudyPage)
  └─ [Study] button on any category card  ────►  ├─ Phonetics shown front
                                                  ├─ Tap card → reveals Thai + English
                                                  ├─ Example sentence shown on reveal
                                                  ├─ "Review again" → stays in deck
                                                  └─ "Got it ✓" → marks as studied, advances
```

### 3c. Vocabulary management loop

```
Vocabulary page
  ├─ Tabs: All words | 📌 This week | ♥ Favourites
  ├─ Search (Thai script, phonetics, English)
  ├─ Category filter chips
  └─ Per-word actions:
       ├─ 📍 Pin  — adds to "This week" list (K_PINNED, localStorage)
       ├─ ♥ Fav   — adds to Favourites (K_FAV, localStorage)
       ├─ ✓ Studied — marks as known (K_STU, localStorage)
       └─ ✕ Delete  — only on custom words
  └─ [+ Add word] → modal (Thai, phonetics, English, category, emoji, optional example)
```

### 3d. Active production loop (Sentence Builder)

```
Sentence Builder
  ├─ Week filter: All | Week 1 | Week 2 | Week 3 | Week 4
  ├─ Prompt shown in English + grammar pattern label + hint
  ├─ User types Thai sentence (Thai keyboard)
  ├─ [Check] → reveals correct Thai + phonetics + grammar tip
  │     ├─ Correct → score +1
  │     └─ Wrong → shown correct answer + tip
  └─ [Next] → next shuffled exercise
```

### 3e. Conversation practice loop

```
Conversation page (scenario list)
  ├─ Shows all scenarios with done/not-done status
  ├─ [Add scenario] → modal to capture tutor-session scripts
  └─ Select scenario → detail view
       ├─ Turn-by-turn: English prompt shown, Thai hidden
       ├─ [Show hint] per turn → reveals Thai hint/phonetics
       ├─ [Reveal all hints] / [Hide all] bulk toggle
       └─ [Mark as done ✓] → persists completion to localStorage
```

---

## 4. Data & persistence

| What | Storage key | Type |
|------|-------------|------|
| Favourite words | `K_FAV` | Set → localStorage array |
| Studied words | `K_STU` | Set → localStorage array |
| Pinned words (this week) | `K_PINNED` | Set → localStorage array |
| Custom vocab words | `K_CUSTOM` | Array → localStorage JSON |
| Completed conversations | `K_CONV` | Array → localStorage JSON |
| Custom conversation scenarios | `K_CONV_CUSTOM` | Array → localStorage JSON |

All data lives in the browser's localStorage. No backend, no accounts, no sync.

---

## 5. Key UX observations (for reviewer context)

- **No Daily Practice page** — daily content is embedded in the Dashboard. There is no separate "daily practice" route.
- **Flashcards are phonetics-first** — the front of the card shows phonetics (romanisation), not Thai script. Thai is revealed on tap. This is intentional for a learner who reads romanisation first.
- **"This week" pinning** is a manual curation mechanism — the user pins words they want to focus on that week. There is no spaced-repetition algorithm.
- **Sentence Builder is production-only** — requires typing Thai script. No multiple-choice mode exists.
- **Grammar and Numbers are reference-only** — no interactive exercises on either page.
- **Mobile sidebar** — the sidebar doesn't collapse on mobile; it stacks above the content, which may be a pain point on small screens.
- **No onboarding** — the app opens directly to the Dashboard with no tutorial or empty-state guidance.

---

## 6. What to ask ChatGPT to review

Suggested prompts for the reviewer:

1. **Navigation & IA:** Does the sidebar grouping (Learn / Practice / Reference) make sense? Should any pages move?
2. **Dashboard overload:** The dashboard now has 4 daily-study blocks + stats + quick-study + tools + recently-studied + favourites. Is this too dense?
3. **Mobile experience:** What layout changes would make the sidebar and vocab list work better on 390px?
4. **Flashcard UX:** Phonetics-front cards — is this a good choice? Should there be a mode toggle?
5. **Progression / motivation:** There's no streak, no progress bar, no spaced repetition. What lightweight mechanisms would feel motivating without over-engineering?
6. **Sentence Builder input:** Typing Thai script in a web input is friction-heavy. Any UX suggestions?
7. **Empty states:** First-time user sees an empty "Favourites" and "Recently studied" section. How should these states be handled?
8. **Add Word / Add Scenario modals:** Are the forms well-structured for a learner capturing words from a tutor session in real time?
