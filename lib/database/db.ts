import type { Settings } from '@/types'

const DB_NAME = 'student-planner'
const DB_VERSION = 1

export const STORES = [
  'subjects',
  'schedules',
  'deadlines',
  'tasks',
  'notes',
  'sessions',
  'settings',
] as const

export type StoreName = (typeof STORES)[number]

let dbPromise: Promise<IDBDatabase> | null = null

function openDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('IndexedDB unavailable'))
  }
  if (dbPromise) return dbPromise

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      for (const store of STORES) {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: 'id' })
        }
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

  return dbPromise
}

function tx(db: IDBDatabase, store: StoreName, mode: IDBTransactionMode) {
  return db.transaction(store, mode).objectStore(store)
}

export async function getAll<T>(store: StoreName): Promise<T[]> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const req = tx(db, store, 'readonly').getAll()
    req.onsuccess = () => resolve(req.result as T[])
    req.onerror = () => reject(req.error)
  })
}

export async function put<T>(store: StoreName, value: T): Promise<T> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const req = tx(db, store, 'readwrite').put(value)
    req.onsuccess = () => resolve(value)
    req.onerror = () => reject(req.error)
  })
}

export async function bulkPut<T>(store: StoreName, values: T[]): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const objectStore = tx(db, store, 'readwrite')
    for (const value of values) objectStore.put(value)
    objectStore.transaction.oncomplete = () => resolve()
    objectStore.transaction.onerror = () => reject(objectStore.transaction.error)
  })
}

export async function remove(store: StoreName, id: string): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const req = tx(db, store, 'readwrite').delete(id)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

export async function clearStore(store: StoreName): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const req = tx(db, store, 'readwrite').clear()
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

export async function clearAll(): Promise<void> {
  await Promise.all(STORES.map((s) => clearStore(s)))
}

export async function getSettings(): Promise<Settings | undefined> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const req = tx(db, 'settings', 'readonly').get('app')
    req.onsuccess = () => resolve(req.result as Settings | undefined)
    req.onerror = () => reject(req.error)
  })
}
