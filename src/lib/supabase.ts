/**
 * Contact form submission via backend API.
 * Supabase client removed — was previously used for submissions.
 * Now uses the Portifolio backend API directly.
 */
export async function submitContactForm(data: { name: string; email: string; message: string }) {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error('Contact form submission failed:', err)
    return null
  }
}
