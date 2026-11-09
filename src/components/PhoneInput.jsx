/**
 * Input nomor HP dengan prefix +62 yang selalu terlihat (Tailwind CSS).
 */
function PhoneInput({ value, onChange }) {
  function handleChange(e) {
    // Hanya izinkan digit, +, -, spasi
    const cleaned = e.target.value.replace(/[^\d\s\-+]/g, '')
    onChange(cleaned)
  }

  return (
    <div className="relative flex items-center">
      <span className="absolute left-4 font-bold text-wa-green-dark text-base pointer-events-none select-none">
        +62
      </span>
      <input
        type="tel"
        className="w-full py-3.5 pl-14 pr-4 border-2 border-gray-200 rounded-xl text-lg font-medium text-gray-900 bg-white placeholder-gray-400 outline-none transition-all focus:border-wa-green focus:ring-4 focus:ring-wa-green/15"
        placeholder="812 3456 7890"
        value={value}
        onChange={handleChange}
        inputMode="tel"
        autoComplete="tel"
        maxLength={15}
      />
    </div>
  )
}

export default PhoneInput
