import { useState, useEffect } from 'react'
import defaultTemplates from '../data/templates.js'

const STORAGE_KEY = 'wa_tap_chat_templates'

/**
 * Komponen Template Pesan (Tailwind CSS):
 * - Toggle ON/OFF saat diketuk
 * - Tambah template manual langsung
 * - Simpan pesan yang sedang diketik jadi template baru
 * - Edit inline dan Hapus
 * - Reset ke 3 template bawaan
 */
function TemplateButtons({ selectedMessage, onToggle, currentMessage }) {
  const [templates, setTemplates] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      }
    } catch (e) {
      console.error('Gagal membaca template tersimpan', e)
    }
    return defaultTemplates
  })

  const [showAddForm, setShowAddForm] = useState(false)
  const [newText, setNewText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  // Simpan ke localStorage setiap ada perubahan
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
    } catch (e) {
      console.error('Gagal menyimpan template', e)
    }
  }, [templates])

  // Tambah template dari input form manual
  function handleAddManual(e) {
    if (e) e.preventDefault()
    const trimmed = newText.trim()
    if (!trimmed) return

    const newTemplate = {
      id: 'custom-' + Date.now(),
      text: trimmed,
    }
    setTemplates([...templates, newTemplate])
    setNewText('')
    setShowAddForm(false)
    onToggle(trimmed)
  }

  // Simpan isi pesan yang sedang diketik di textarea jadi template baru
  function handleSaveCurrentMessageAsTemplate() {
    const trimmed = (currentMessage || '').trim()
    if (!trimmed) return

    const exists = templates.some((t) => t.text.trim().toLowerCase() === trimmed.toLowerCase())
    if (exists) {
      alert('Template dengan isi pesan ini sudah ada di daftar.')
      return
    }

    const newTemplate = {
      id: 'custom-' + Date.now(),
      text: trimmed,
    }
    setTemplates([...templates, newTemplate])
    alert('✓ Pesan berhasil disimpan ke daftar template!')
  }

  // Hapus template
  function handleDelete(id, e) {
    e.stopPropagation()
    if (templates.length <= 1) {
      alert('Minimal sisakan 1 template.')
      return
    }
    if (window.confirm('Hapus template ini?')) {
      const target = templates.find((t) => t.id !== id)
      setTemplates(templates.filter((t) => t.id !== id))
      if (target && selectedMessage === target.text) {
        onToggle(target.text)
      }
      if (editingId === id) setEditingId(null)
    }
  }

  // Edit template
  function handleStartEdit(template, e) {
    e.stopPropagation()
    setEditingId(template.id)
    setEditText(template.text)
  }

  function handleSaveEdit(id, e) {
    e.preventDefault()
    e.stopPropagation()
    const trimmed = editText.trim()
    if (!trimmed) return
    setTemplates(
      templates.map((t) => (t.id === id ? { ...t, text: trimmed } : t))
    )
    if (selectedMessage) {
      onToggle(trimmed)
    }
    setEditingId(null)
  }

  function handleResetDefault() {
    if (window.confirm('Kembalikan ke 3 template bawaan awal?')) {
      setTemplates(defaultTemplates)
      setEditingId(null)
      setShowAddForm(false)
    }
  }

  const isCurrentMessageSavable =
    currentMessage &&
    currentMessage.trim().length > 3 &&
    !templates.some((t) => t.text.trim() === currentMessage.trim())

  return (
    <div className="mb-3">
      {/* Header Template */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-gray-500">
          Ketuk untuk ON / ketuk lagi untuk OFF:
        </span>
        <button
          type="button"
          className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-wa-green text-wa-green-dark bg-wa-light/60 hover:bg-wa-green hover:text-white transition-colors cursor-pointer"
          onClick={() => {
            setShowAddForm(!showAddForm)
            setEditingId(null)
          }}
        >
          {showAddForm ? '✕ Tutup' : '➕ Tambah Template'}
        </button>
      </div>

      {/* Form Tambah Template Manual */}
      {showAddForm && (
        <form onSubmit={handleAddManual} className="bg-emerald-50/60 border-1.5 border-wa-green rounded-xl p-3 mb-3 shadow-sm">
          <div className="text-xs font-bold text-wa-green-dark mb-1.5">
            Tambah Template Manual
          </div>
          <textarea
            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 leading-relaxed outline-none focus:border-wa-green focus:ring-2 focus:ring-wa-green/20 resize-y"
            placeholder="Tulis pesan template baru di sini..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            rows={3}
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="text-xs font-semibold px-3.5 py-2 bg-wa-green text-white rounded-lg hover:bg-wa-green-dark transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
              disabled={!newText.trim()}
            >
              ✓ Simpan Template
            </button>
            <button
              type="button"
              className="text-xs px-3 py-2 bg-transparent text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => {
                setShowAddForm(false)
                setNewText('')
              }}
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* Tombol Praktis: Simpan Pesan Yang Sedang Diketik */}
      {isCurrentMessageSavable && (
        <button
          type="button"
          className="w-full text-left text-xs font-medium text-amber-900 bg-amber-50 border border-dashed border-amber-300 rounded-lg py-2 px-3 mb-2.5 hover:bg-amber-100/80 transition-colors cursor-pointer"
          onClick={handleSaveCurrentMessageAsTemplate}
          title="Simpan pesan yang Anda ketik ke daftar template"
        >
          💾 Simpan pesan di bawah sebagai template baru
        </button>
      )}

      {/* Daftar Kartu Template */}
      <div className="flex flex-col gap-2">
        {templates.map((t, index) => {
          const isEditing = editingId === t.id
          const isActive = selectedMessage === t.text

          if (isEditing) {
            return (
              <form
                key={t.id}
                className="bg-white border-2 border-wa-green rounded-xl p-2.5 shadow-sm"
                onSubmit={(e) => handleSaveEdit(t.id, e)}
              >
                <textarea
                  className="w-full p-2 text-xs border border-gray-300 rounded-lg outline-none focus:border-wa-green resize-y"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={3}
                  autoFocus
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="submit"
                    className="text-xs font-semibold px-3 py-1 bg-wa-green text-white rounded-md cursor-pointer hover:bg-wa-green-dark"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    className="text-xs px-3 py-1 border border-gray-300 text-gray-600 rounded-md cursor-pointer hover:bg-gray-50"
                    onClick={() => setEditingId(null)}
                  >
                    Batal
                  </button>
                </div>
              </form>
            )
          }

          return (
            <div
              key={t.id}
              className={`group relative border-1.5 rounded-xl p-3 transition-all cursor-pointer select-none ${
                isActive
                  ? 'bg-emerald-50/80 border-wa-green ring-2 ring-wa-green/30 shadow-sm'
                  : 'bg-white border-gray-200 hover:border-wa-green hover:bg-emerald-50/30'
              }`}
              onClick={() => onToggle(t.text)}
              role="button"
              tabIndex={0}
              title={
                isActive
                  ? 'Ketuk lagi untuk mematikan (OFF)'
                  : 'Ketuk untuk mengaktifkan (ON)'
              }
            >
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-wa-green-dark bg-wa-green/15 px-2 py-0.5 rounded-full">
                    #{index + 1}
                  </span>
                  <span
                    className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md uppercase transition-all ${
                      isActive
                        ? 'bg-wa-green-dark text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {isActive ? '✓ AKTIF' : 'PILIH'}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="text-xs p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                    onClick={(e) => handleStartEdit(t, e)}
                    title="Edit teks template"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    className="text-xs p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                    onClick={(e) => handleDelete(t.id, e)}
                    title="Hapus template"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-gray-800 whitespace-pre-wrap break-words">
                {t.text}
              </p>
            </div>
          )
        })}
      </div>

      {/* Reset Default */}
      <div className="mt-2.5 text-center">
        <button
          type="button"
          className="text-[11px]  text-red-500 hover:text-red-600  cursor-pointer transition-colors"
          onClick={handleResetDefault}
        >
          Reset template
        </button>
      </div>
    </div>
  )
}

export default TemplateButtons
