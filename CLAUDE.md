# தமிழ் கற்போம் — PSLE Tamil Learning Platform

## Goal
A Tamil vocabulary learning website targeting Singapore P6 students preparing for PSLE Tamil.
**Go-live: 1 May 2025.** MVP1 must be live on Vercel by then.

## Stack
- **Framework**: Next.js 14 (App Router)
- **ORM**: Prisma
- **DB**: SQLite (local dev) → Neon Postgres (production on Vercel)
- **Styling**: Tailwind CSS + custom CSS variables
- **Fonts**: Noto Sans Tamil + Noto Serif Tamil (Google Fonts)
- **Deploy**: Vercel (free tier)

## Design System
- Background: warm cream `#faf6ef`
- Ink: dark brown `#1a1208`
- Accent: orange `#c85a1e`
- Teal: `#1a7a6e` (meanings, positive)
- Gold: `#b88a20` (sorporul headers)
- All Tamil text uses `font-family: 'Noto Sans Tamil'` or `'Noto Serif Tamil'`
- Warm, editorial feel — like a well-designed textbook, not a flashcard app

## Content Types (MVP1)
1. **Words** — English word → Tamil meaning, with sg_context flag for Singapore-specific words (MRT, void deck, hawker centre, zebra crossing etc.)
2. **Sorporul** — Tamil synonym groups. One concept (e.g. happiness) → multiple Tamil words (மகிழ்ச்சி, ஆனந்தம், சந்தோஷம்) each with nuance explanation + example sentence

## MVP2 (after May 1)
- Thirukkural — verses grouped by concept (நட்பு, அன்பு, கல்வி etc.)
- Palamozhi — Tamil proverbs with English equivalent
- Concept pages — search "friendship" → see related kural + proverb + word all together
- AI Q&A practice using Claude API

## Database Schema (Prisma)
```prisma
model Word {
  id              String   @id @default(cuid())
  english_text    String
  tamil_text      String
  transliteration String
  meaning_tamil   String
  meaning_english String
  sg_context      Boolean  @default(false)
  tags            String   // JSON array e.g. ["values","psle-core"]
  synonyms        String   // JSON array of {word, transliteration, note}
  examples        String   // JSON array of {tamil, english, difficulty}
  created_at      DateTime @default(now())
}

model Sorporul {
  id                      String   @id @default(cuid())
  concept_english         String
  concept_tamil           String
  concept_transliteration String
  description             String
  synonyms                String   // JSON array of {word, transliteration, meaning, nuance, example_tamil, example_english}
  created_at              DateTime @default(now())
}
```

## Seed Data
All seed data lives in `/data/words.json` and `/data/sorporul.json`.
Run seed with: `npx ts-node prisma/seed.ts`

### Words seeded (10)
- Singapore-specific (sg_context: true): MRT, Zebra crossing, Hawker centre, Void deck
- Values/PSLE core: Friendship (நட்பு), Kindness (இரக்கம்), Courage (தைரியம்), Education (கல்வி), Respect (மரியாதை), Perseverance (விடாமுயற்சி)

### Sorporul seeded (5 groups)
- Happiness: மகிழ்ச்சி · ஆனந்தம் · சந்தோஷம் · உவகை
- Sadness: துயரம் · வருத்தம் · அழுகை · கண்ணீர்
- Talking: பேசுதல் · கூறுதல் · உரைத்தல் · கதைத்தல்
- Beauty: அழகு · இன்பம் · நலம் · கவின்
- Walking: நடத்தல் · செல்லுதல் · விரைதல் · வருதல்

## Pages (MVP1)
- `/` — Home: search bar hero + 4 feature cards (Words, Sorporul, Kural coming soon, Palamozhi coming soon)
- `/words` — Word list with search + filter (All / Singapore / Values / PSLE Core)
- `/words/[id]` — Word detail: full meanings, examples, tags
- `/sorporul` — Synonym group cards, searchable
- `/sorporul/[id]` — Full synonym group detail

## Key Conventions
- Parse JSON fields from DB: `JSON.parse(word.tags)`, `JSON.parse(word.examples)`
- Tamil text always wrapped in a div/span with className `tamil` (Noto Sans Tamil)
- Tamil headings/titles use `tamil-serif` class (Noto Serif Tamil)
- Singapore words get an orange left border + 🇸🇬 badge
- Difficulty levels on examples: easy (teal dot) / medium (gold dot) / hard (orange dot)
- Search works across: english_text, tamil_text, transliteration, meaning_english, meaning_tamil

## Commands
```bash
npm run dev          # start dev server
npx prisma studio    # browse DB visually
npx prisma migrate dev --name init   # run first migration
npx ts-node prisma/seed.ts           # seed the database
npx prisma generate  # regenerate client after schema change
```

## HTML Prototype
A working single-file HTML prototype exists at `reference/prototype.html`.
It contains the full UI, all seed data embedded, and the design system implemented.
Use it as visual reference when building components.
