/**
 * Format nomor HP Indonesia ke format internasional WhatsApp (tanpa +).
 *
 * Aturan:
 *  - Hapus semua karakter non-digit
 *  - Jika diawali '0', ganti dengan '62'
 *  - Jika diawali '+62', hapus '+'
 *  - Jika sudah diawali '62', biarkan
 *
 * @param {string} raw - Input nomor HP mentah
 * @returns {string} Nomor dalam format 62xxx
 */
export function formatPhoneNumber(raw) {
  // Hapus semua non-digit kecuali + di awal
  let cleaned = raw.replace(/[^\d+]/g, '')

  // Hapus + di awal jika ada
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1)
  }

  // Ganti awalan 0 dengan 62
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1)
  }

  // Jika user mengetik tanpa awalan negara (misal: 812xxxx), tambahkan 62
  if (!cleaned.startsWith('62') && cleaned.length >= 8 && cleaned.length <= 13) {
    cleaned = '62' + cleaned
  }

  return cleaned
}

/**
 * Buat URL wa.me untuk redirect ke WhatsApp.
 * Pesan bersifat opsional.
 *
 * @param {string} phone - Nomor HP (akan di-format otomatis)
 * @param {string} text  - Isi pesan (opsional)
 * @returns {string} URL lengkap wa.me
 */
export function buildWhatsAppUrl(phone, text = '') {
  const formattedPhone = formatPhoneNumber(phone)
  const trimmed = (text || '').trim()
  if (!trimmed) {
    return `https://wa.me/${formattedPhone}`
  }
  const encodedText = encodeURIComponent(trimmed)
  return `https://wa.me/${formattedPhone}?text=${encodedText}`
}
