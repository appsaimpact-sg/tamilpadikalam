'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Word = {
  id: string
  english_text: string
  tamil_text: string
  transliteration: string
  meaning_tamil: string
  meaning_english: string
  sg_context: boolean
  tags: string
  synonyms: string
  examples: string
  created_at: string
}

type Sorporul = {
  id: string
  concept_english: string
  concept_tamil: string
  concept_transliteration: string
  description: string
  synonyms: string
  created_at: string
}

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'words' | 'sorporul'>('words')
  const [words, setWords] = useState<Word[]>([])
  const [sorporulList, setSorporulList] = useState<Sorporul[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const itemsPerPage = 20

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/check-auth')
        if (!res.ok) {
          router.push('/admin/login')
        }
      } catch (error) {
        router.push('/admin/login')
      }
    }
    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Word form state
  const [wordForm, setWordForm] = useState({
    english_text: '',
    tamil_text: '',
    transliteration: '',
    meaning_tamil: '',
    meaning_english: '',
    sg_context: false,
    tags: '',
    examples: '',
  })

  // Sorporul form state
  const [sorporulForm, setSorporulForm] = useState({
    concept_english: '',
    concept_tamil: '',
    concept_transliteration: '',
    description: '',
    synonyms: '',
  })

  // Fetch words on mount and when tab changes
  useEffect(() => {
    setSearchQuery('')
    setCurrentPage(1)
    if (activeTab === 'words') {
      fetchWords()
    } else {
      fetchSorporul()
    }
  }, [activeTab])

  const fetchWords = async () => {
    try {
      const res = await fetch('/api/admin/words/all')
      const data = await res.json()
      setWords(data)
      setSelectedId(null)
      resetWordForm()
    } catch (error) {
      console.error('Error fetching words:', error)
    }
  }

  const fetchSorporul = async () => {
    try {
      const res = await fetch('/api/admin/sorporul/all')
      const data = await res.json()
      setSorporulList(data)
      setSelectedId(null)
      resetSorporulForm()
    } catch (error) {
      console.error('Error fetching sorporul:', error)
    }
  }

  const resetWordForm = () => {
    setWordForm({
      english_text: '',
      tamil_text: '',
      transliteration: '',
      meaning_tamil: '',
      meaning_english: '',
      sg_context: false,
      tags: '',
      examples: '',
    })
    setIsEditing(false)
  }

  const resetSorporulForm = () => {
    setSorporulForm({
      concept_english: '',
      concept_tamil: '',
      concept_transliteration: '',
      description: '',
      synonyms: '',
    })
    setIsEditing(false)
  }

  const selectWord = (word: Word) => {
    setSelectedId(word.id)
    setIsEditing(true)
    setWordForm({
      english_text: word.english_text,
      tamil_text: word.tamil_text,
      transliteration: word.transliteration,
      meaning_tamil: word.meaning_tamil,
      meaning_english: word.meaning_english,
      sg_context: word.sg_context,
      tags: word.tags ? JSON.parse(word.tags).join(', ') : '',
      examples: word.examples,
    })
  }

  const selectSorporul = (s: Sorporul) => {
    setSelectedId(s.id)
    setIsEditing(true)
    setSorporulForm({
      concept_english: s.concept_english,
      concept_tamil: s.concept_tamil,
      concept_transliteration: s.concept_transliteration,
      description: s.description,
      synonyms: s.synonyms,
    })
  }

  const handleAddWord = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const url = isEditing ? `/api/admin/words/${selectedId}` : '/api/admin/words'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...wordForm,
          tags: wordForm.tags ? wordForm.tags.split(',').map(t => t.trim()) : [],
          examples: wordForm.examples ? JSON.parse(wordForm.examples) : [],
        }),
      })

      if (!res.ok) throw new Error('Failed to save word')
      
      setMessage(`✓ Word ${isEditing ? 'updated' : 'added'} successfully!`)
      resetWordForm()
      fetchWords()
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('✗ Error: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSorporul = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const url = isEditing ? `/api/admin/sorporul/${selectedId}` : '/api/admin/sorporul'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...sorporulForm,
          synonyms: sorporulForm.synonyms ? JSON.parse(sorporulForm.synonyms) : [],
        }),
      })

      if (!res.ok) throw new Error('Failed to save sorporul')
      
      setMessage(`✓ Sorporul ${isEditing ? 'updated' : 'added'} successfully!`)
      resetSorporulForm()
      fetchSorporul()
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('✗ Error: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteWord = async () => {
    if (!selectedId || !confirm('Are you sure you want to delete this word?')) return

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/words/${selectedId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')

      setMessage('✓ Word deleted successfully!')
      resetWordForm()
      fetchWords()
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('✗ Error: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSorporul = async () => {
    if (!selectedId || !confirm('Are you sure you want to delete this sorporul?')) return

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/sorporul/${selectedId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')

      setMessage('✓ Sorporul deleted successfully!')
      resetSorporulForm()
      fetchSorporul()
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('✗ Error: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  // Filter and paginate items
  const getFilteredWords = () => {
    return words.filter(w => 
      w.english_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.tamil_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.transliteration.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const getFilteredSorporul = () => {
    return sorporulList.filter(s =>
      s.concept_english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.concept_tamil.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.concept_transliteration.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const filteredWords = getFilteredWords()
  const filteredSorporul = getFilteredSorporul()
  const currentList = activeTab === 'words' ? filteredWords : filteredSorporul
  const totalPages = Math.ceil(currentList.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const endIdx = startIdx + itemsPerPage
  const paginatedList = currentList.slice(startIdx, endIdx)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 24 }}>
        <div>
          <h1 className="tamil-serif" style={{ fontSize: 32, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
            Admin Panel
          </h1>
          <p style={{ color: 'var(--muted2)', marginBottom: 0 }}>Manage words and sorporul</p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: '1px solid var(--border2)',
            color: 'var(--muted)',
            padding: '8px 16px',
            borderRadius: 'var(--radius)',
            fontSize: 13,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '2px solid var(--border2)' }}>
        {(['words', 'sorporul'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '12px 16px',
              fontSize: 14,
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? 'var(--accent)' : 'var(--muted)',
              borderBottom: activeTab === tab ? '3px solid var(--accent)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab === 'words' ? 'Words' : 'Sorporul'} ({activeTab === tab ? (tab === 'words' ? words.length : sorporulList.length) : '?'})
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
        {/* List sidebar */}
        <div style={{
          background: 'white',
          border: '1px solid var(--border2)',
          borderRadius: 'var(--radius)',
          padding: 16,
          maxHeight: '70vh',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--ink)' }}>
            {activeTab === 'words' ? 'Words' : 'Sorporul'} ({currentList.length})
          </h3>
          
          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            style={{
              padding: '8px 12px',
              border: '1px solid var(--border2)',
              borderRadius: 'var(--radius)',
              marginBottom: 12,
              fontSize: 13,
              fontFamily: 'inherit',
            }}
          />

          {/* List */}
          <div style={{ flex: 1, minHeight: 0, overflow: 'auto', marginBottom: 12 }}>
            {paginatedList.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>
                {searchQuery ? 'No results found' : activeTab === 'words' ? 'No words yet' : 'No sorporul yet'}
              </p>
            ) : (
              activeTab === 'words' ? (
                (paginatedList as Word[]).map(word => (
                  <div
                    key={word.id}
                    onClick={() => selectWord(word)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 6,
                      marginBottom: 8,
                      background: selectedId === word.id ? 'var(--accent)' : 'var(--bg)',
                      color: selectedId === word.id ? 'white' : 'var(--ink)',
                      cursor: 'pointer',
                      fontSize: 13,
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontWeight: 500 }}>{word.english_text}</div>
                    <div className="tamil" style={{ fontSize: 12, opacity: 0.8 }}>{word.tamil_text}</div>
                  </div>
                ))
              ) : (
                (paginatedList as Sorporul[]).map(s => (
                  <div
                    key={s.id}
                    onClick={() => selectSorporul(s)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 6,
                      marginBottom: 8,
                      background: selectedId === s.id ? 'var(--accent)' : 'var(--bg)',
                      color: selectedId === s.id ? 'white' : 'var(--ink)',
                      cursor: 'pointer',
                      fontSize: 13,
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontWeight: 500 }}>{s.concept_english}</div>
                    <div className="tamil" style={{ fontSize: 12, opacity: 0.8 }}>{s.concept_tamil}</div>
                  </div>
                ))
              )
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid var(--border2)',
              paddingTop: 12,
              fontSize: 12,
            }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border2)',
                  padding: '4px 8px',
                  borderRadius: 4,
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.5 : 1,
                }}
              >
                Prev
              </button>
              <span style={{ color: 'var(--muted)' }}>
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border2)',
                  padding: '4px 8px',
                  borderRadius: 4,
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage === totalPages ? 0.5 : 1,
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Form */}
        <div>
          {message && (
            <div style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius)',
              marginBottom: 16,
              background: message.includes('✓') ? 'rgba(26, 122, 110, 0.1)' : 'rgba(200, 90, 30, 0.1)',
              color: message.includes('✓') ? 'var(--teal)' : 'var(--accent)',
              fontSize: 14,
            }}>
              {message}
            </div>
          )}

          {activeTab === 'words' ? (
            <form onSubmit={handleAddWord} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>English Text *</label>
                <input
                  type="text"
                  value={wordForm.english_text}
                  onChange={e => setWordForm({ ...wordForm, english_text: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--border2)',
                    borderRadius: 'var(--radius)',
                    fontFamily: 'inherit',
                    fontSize: 14,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Tamil Text *</label>
                <input
                  type="text"
                  value={wordForm.tamil_text}
                  onChange={e => setWordForm({ ...wordForm, tamil_text: e.target.value })}
                  required
                  className="tamil"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--border2)',
                    borderRadius: 'var(--radius)',
                    fontFamily: "'Noto Sans Tamil', sans-serif",
                    fontSize: 16,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Transliteration *</label>
                <input
                  type="text"
                  value={wordForm.transliteration}
                  onChange={e => setWordForm({ ...wordForm, transliteration: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--border2)',
                    borderRadius: 'var(--radius)',
                    fontFamily: 'inherit',
                    fontSize: 14,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Meaning Tamil *</label>
                <textarea
                  value={wordForm.meaning_tamil}
                  onChange={e => setWordForm({ ...wordForm, meaning_tamil: e.target.value })}
                  required
                  className="tamil"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--border2)',
                    borderRadius: 'var(--radius)',
                    fontFamily: "'Noto Sans Tamil', sans-serif",
                    fontSize: 14,
                    minHeight: 80,
                    resize: 'vertical',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Meaning English *</label>
                <textarea
                  value={wordForm.meaning_english}
                  onChange={e => setWordForm({ ...wordForm, meaning_english: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--border2)',
                    borderRadius: 'var(--radius)',
                    fontFamily: 'inherit',
                    fontSize: 14,
                    minHeight: 80,
                    resize: 'vertical',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={wordForm.sg_context}
                    onChange={e => setWordForm({ ...wordForm, sg_context: e.target.checked })}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>Singapore Context</span>
                </label>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Tags (comma-separated)</label>
                <input
                  type="text"
                  value={wordForm.tags}
                  onChange={e => setWordForm({ ...wordForm, tags: e.target.value })}
                  placeholder="e.g. transport, singapore, daily-life"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--border2)',
                    borderRadius: 'var(--radius)',
                    fontFamily: 'inherit',
                    fontSize: 14,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Examples (JSON)</label>
                <textarea
                  value={wordForm.examples}
                  onChange={e => setWordForm({ ...wordForm, examples: e.target.value })}
                  placeholder='[{"tamil":"...", "english":"...", "difficulty":"easy"}]'
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--border2)',
                    borderRadius: 'var(--radius)',
                    fontFamily: "'Courier New', monospace",
                    fontSize: 12,
                    minHeight: 100,
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    background: 'var(--accent)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: 'var(--radius)',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? 'Saving...' : (isEditing ? 'Update Word' : 'Add Word')}
                </button>
                {isEditing && (
                  <>
                    <button
                      type="button"
                      onClick={() => resetWordForm()}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--border2)',
                        color: 'var(--ink)',
                        padding: '12px 24px',
                        borderRadius: 'var(--radius)',
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteWord}
                      disabled={loading}
                      style={{
                        background: 'rgba(200, 90, 30, 0.1)',
                        border: '1px solid var(--accent)',
                        color: 'var(--accent)',
                        padding: '12px 24px',
                        borderRadius: 'var(--radius)',
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1,
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </form>
          ) : (
            <form onSubmit={handleAddSorporul} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Concept English *</label>
                <input
                  type="text"
                  value={sorporulForm.concept_english}
                  onChange={e => setSorporulForm({ ...sorporulForm, concept_english: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--border2)',
                    borderRadius: 'var(--radius)',
                    fontFamily: 'inherit',
                    fontSize: 14,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Concept Tamil *</label>
                <input
                  type="text"
                  value={sorporulForm.concept_tamil}
                  onChange={e => setSorporulForm({ ...sorporulForm, concept_tamil: e.target.value })}
                  required
                  className="tamil"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--border2)',
                    borderRadius: 'var(--radius)',
                    fontFamily: "'Noto Sans Tamil', sans-serif",
                    fontSize: 16,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Concept Transliteration *</label>
                <input
                  type="text"
                  value={sorporulForm.concept_transliteration}
                  onChange={e => setSorporulForm({ ...sorporulForm, concept_transliteration: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--border2)',
                    borderRadius: 'var(--radius)',
                    fontFamily: 'inherit',
                    fontSize: 14,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Description *</label>
                <textarea
                  value={sorporulForm.description}
                  onChange={e => setSorporulForm({ ...sorporulForm, description: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--border2)',
                    borderRadius: 'var(--radius)',
                    fontFamily: 'inherit',
                    fontSize: 14,
                    minHeight: 80,
                    resize: 'vertical',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Synonyms (JSON) *</label>
                <textarea
                  value={sorporulForm.synonyms}
                  onChange={e => setSorporulForm({ ...sorporulForm, synonyms: e.target.value })}
                  placeholder='[{"word":"...", "transliteration":"...", "meaning":"...", "nuance":"...", "example_tamil":"...", "example_english":"..."}]'
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--border2)',
                    borderRadius: 'var(--radius)',
                    fontFamily: "'Courier New', monospace",
                    fontSize: 12,
                    minHeight: 150,
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    background: 'var(--accent)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: 'var(--radius)',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? 'Saving...' : (isEditing ? 'Update Sorporul' : 'Add Sorporul')}
                </button>
                {isEditing && (
                  <>
                    <button
                      type="button"
                      onClick={() => resetSorporulForm()}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--border2)',
                        color: 'var(--ink)',
                        padding: '12px 24px',
                        borderRadius: 'var(--radius)',
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteSorporul}
                      disabled={loading}
                      style={{
                        background: 'rgba(200, 90, 30, 0.1)',
                        border: '1px solid var(--accent)',
                        color: 'var(--accent)',
                        padding: '12px 24px',
                        borderRadius: 'var(--radius)',
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1,
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

