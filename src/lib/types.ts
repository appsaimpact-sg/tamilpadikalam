export interface Example {
  tamil: string
  english: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface WordEntry {
  id: string
  english_text: string
  tamil_text: string
  transliteration: string
  meaning_tamil: string
  meaning_english: string
  sg_context: boolean
  tags: string[]
  synonyms: { word: string; transliteration: string; note?: string }[]
  examples: Example[]
  created_at: Date
}

export interface SynonymEntry {
  word: string
  transliteration: string
  meaning: string
  nuance: string
  example_tamil: string
  example_english: string
}

export interface SorporulEntry {
  id: string
  concept_english: string
  concept_tamil: string
  concept_transliteration: string
  description: string
  synonyms: SynonymEntry[]
  created_at: Date
}
