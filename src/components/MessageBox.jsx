/**
 * Textarea untuk menulis / mengedit pesan (Tailwind CSS).
 */
function MessageBox({ value, onChange }) {
  return (
    <textarea
      className="w-full min-h-[110px] p-3 border-2 border-gray-200 rounded-xl text-sm leading-relaxed text-gray-900 bg-white placeholder-gray-400 outline-none transition-all resize-y focus:border-wa-green focus:ring-4 focus:ring-wa-green/15"
      placeholder="Tulis pesan manual di sini (opsional) atau ketuk template di atas..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export default MessageBox
