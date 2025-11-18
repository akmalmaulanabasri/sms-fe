export default function normalizeListResponse(payloadOrRes) {
  const payload = payloadOrRes && payloadOrRes.data ? payloadOrRes.data : payloadOrRes
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload.results)) return payload.results
  if (Array.isArray(payload.data)) return payload.data
  if (Array.isArray(payload.items)) return payload.items
  // try common named collections
  const keys = [
    'teachers',
    'students',
    'classes',
    'subjects',
    'materials',
    'tasks',
    'exams',
    'billing',
    'cards',
    'library'
  ]
  for (const k of keys) if (Array.isArray(payload[k])) return payload[k]
  return []
}
