import { useState } from 'react'
import PhoneInput from './components/PhoneInput.jsx'
import TemplateButtons from './components/TemplateButtons.jsx'
import MessageBox from './components/MessageBox.jsx'
import SendButton from './components/SendButton.jsx'
import Footer from './components/Footer.jsx'
import { buildWhatsAppUrl } from './utils/phone.js'

function App() {
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  // Nomor HP minimal 8 digit angka, pesan bersifat opsional
  const rawDigits = phone.replace(/[^\d]/g, '')
  const canSend = rawDigits.length >= 8

  // Toggle template: jika teks sama dengan pesan yang aktif, matikan (kosongkan)
  function handleToggleTemplate(text) {
    if (message === text) {
      setMessage('')
    } else {
      setMessage(text)
    }
  }

  function handleSend() {
    if (!canSend) return
    const url = buildWhatsAppUrl(phone, message)
    window.open(url, '_blank')
  }

  function handleClear() {
    setPhone('')
    setMessage('')
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5] text-gray-900">
      {/* Header WhatsApp Themed */}
      <header className="bg-gradient-to-r from-wa-teal to-wa-green-dark text-white px-4 py-4 sm:py-5 shadow-md">
        <div className="max-w-lg mx-auto flex  items-center gap-3">
          <div className="w-11 h-11 bg-white/15 rounded-full flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">WhatsApp Tap Chat</h1>
            <p className="text-xs text-white/85">Kirim pesan instan tanpa simpan kontak</p>
          </div>
          {/* <div>
            <p>gthub</p>
          </div> */}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 px-4 py-5 sm:py-7 flex justify-center">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-7">
          {/* Step 1: Nomor HP */}
          <section className="mb-5">
            <label className="flex items-center gap-2 font-bold text-sm text-gray-800 mb-2.5">
              <span className="w-6 h-6 rounded-full bg-wa-green text-white text-xs font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <span>Masukkan Nomor HP Customer</span>
            </label>
            <PhoneInput value={phone} onChange={setPhone} />
          </section>

          {/* Step 2: Template & Pesan */}
          <section className="mb-6">
            <label className="flex items-center gap-2 font-bold text-sm text-gray-800 mb-2.5">
              <span className="w-6 h-6 rounded-full bg-wa-green text-white text-xs font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <span>
                Pesan <span className="font-normal text-xs text-gray-400">(Opsional)</span>
              </span>
            </label>
            <TemplateButtons
              selectedMessage={message}
              currentMessage={message}
              onToggle={handleToggleTemplate}
            />
            <MessageBox value={message} onChange={setMessage} />
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <SendButton onClick={handleSend} disabled={!canSend} />
            <button
              className="py-3 px-5 rounded-xl border-1.5 border-gray-200 text-gray-500 font-semibold text-sm hover:border-red-400 hover:text-red-500 hover:bg-red-50/50 transition-colors cursor-pointer"
              onClick={handleClear}
              type="button"
            >
              🗑️ Reset
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
