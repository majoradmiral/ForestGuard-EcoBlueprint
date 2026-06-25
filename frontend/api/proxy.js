export default async function handler(req, res) {
  const { method, query, body } = req
  const { path } = query

  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000'
  const url = `${backendUrl}/api/${path}`

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization || ''
      },
      body: method !== 'GET' ? JSON.stringify(body) : undefined
    })

    const data = await response.text()
    let jsonData
    try {
      jsonData = JSON.parse(data)
    } catch {
      jsonData = { raw: data }
    }

    res.status(response.status).json(jsonData)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}