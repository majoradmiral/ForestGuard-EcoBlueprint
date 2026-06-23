import { Client, Account, Databases, Storage } from 'appwrite'

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '')

export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)

export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'forestguard_db'
export const PROJECTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROJECTS_COLLECTION_ID || 'projects'
export const SENSORS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_SENSORS_COLLECTION_ID || 'sensors'
export const ALERTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_ALERTS_COLLECTION_ID || 'alerts'