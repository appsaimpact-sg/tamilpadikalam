-- CreateTable
CREATE TABLE "Word" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "english_text" TEXT NOT NULL,
    "tamil_text" TEXT NOT NULL,
    "transliteration" TEXT NOT NULL,
    "meaning_tamil" TEXT NOT NULL,
    "meaning_english" TEXT NOT NULL,
    "sg_context" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT NOT NULL,
    "synonyms" TEXT NOT NULL,
    "examples" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Sorporul" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "concept_english" TEXT NOT NULL,
    "concept_tamil" TEXT NOT NULL,
    "concept_transliteration" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "synonyms" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
