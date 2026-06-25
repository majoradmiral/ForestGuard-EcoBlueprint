import { appwriteClient, account, databases, DATABASE_ID, PROJECTS_COLLECTION_ID } from '../config/appwrite.js'

export default async function handler(req, res) {
  const { method, query, body } = req
  const { collection } = query

  try {
    switch (collection) {
      case 'projects':
        if (method === 'GET') {
          const response = await databases.listDocuments(DATABASE_ID, PROJECTS_COLLECTION_ID)
          return res.status(200).json(response)
        }
        if (method === 'POST') {
          const response = await databases.createDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, 'unique()', body)
          return res.status(201).json(response)
        }
        break
      default:
        return res.status(404).json({ error: 'Collection not found' })
    }
  } catch (error) {
    return res.status(error.code || 500).json({ error: error.message })
  }
}