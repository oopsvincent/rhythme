// lib/focus/focus-db.ts
// IndexedDB wrapper for focus session storage using idb
import { openDB, DBSchema, IDBPDatabase } from 'idb'

export interface FocusSessionRecord {
  id: string
  type: 'focus' | 'short_break' | 'long_break'
  duration: number // in seconds
  completedAt: string // ISO date
  interrupted: boolean
  deviceId: string
  taskId?: string // optional task association
}

interface FocusDB extends DBSchema {
  sessions: {
    key: string
    value: FocusSessionRecord
    indexes: {
      'by-date': string
      'by-device': string
    }
  }
}

const DB_NAME = 'rhythme-focus'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<FocusDB>> | null = null

export async function getFocusDB(): Promise<IDBPDatabase<FocusDB>> {
  if (typeof window === 'undefined') {
    throw new Error('IndexedDB is only available in browser')
  }
  
  if (!dbPromise) {
    dbPromise = openDB<FocusDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore('sessions', { keyPath: 'id' })
        store.createIndex('by-date', 'completedAt')
        store.createIndex('by-device', 'deviceId')
      },
    })
  }
  
  return dbPromise
}

export async function saveSession(session: Omit<FocusSessionRecord, 'id'>): Promise<FocusSessionRecord> {
  const db = await getFocusDB()
  const record: FocusSessionRecord = {
    ...session,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  }
  await db.add('sessions', record)
  return record
}

export async function getSessions(limit = 100): Promise<FocusSessionRecord[]> {
  const db = await getFocusDB()
  const tx = db.transaction('sessions', 'readonly')
  const index = tx.store.index('by-date')
  
  const sessions: FocusSessionRecord[] = []
  let cursor = await index.openCursor(null, 'prev') // newest first
  
  while (cursor && sessions.length < limit) {
    sessions.push(cursor.value)
    cursor = await cursor.continue()
  }
  
  return sessions
}

export async function getSessionsByDevice(deviceId: string): Promise<FocusSessionRecord[]> {
  const db = await getFocusDB()
  return db.getAllFromIndex('sessions', 'by-device', deviceId)
}

export async function getTodaySessions(): Promise<FocusSessionRecord[]> {
  const db = await getFocusDB()
  const all = await db.getAll('sessions')
  const today = new Date().toDateString()
  
  return all.filter(s => new Date(s.completedAt).toDateString() === today)
}

export async function getSessionsForMonth(year: number, month: number): Promise<FocusSessionRecord[]> {
  const db = await getFocusDB()
  const all = await db.getAll('sessions')
  
  return all.filter(s => {
    const date = new Date(s.completedAt)
    return date.getFullYear() === year && date.getMonth() === month
  })
}

export async function deleteSession(id: string): Promise<void> {
  const db = await getFocusDB()
  await db.delete('sessions', id)
}

export async function clearAllSessions(): Promise<void> {
  const db = await getFocusDB()
  await db.clear('sessions')
}

// Device ID utilities
const DEVICE_NAME_KEY = 'rhythme-focus-device-name'

export function getDeviceId(): string {
  // Try custom name first
  const customName = localStorage.getItem(DEVICE_NAME_KEY)
  if (customName) return customName
  
  // Fallback to derived from user agent
  if (typeof navigator !== 'undefined') {
    return navigator.userAgent.slice(0, 50)
  }
  
  return 'unknown-device'
}

export function setDeviceName(name: string): void {
  localStorage.setItem(DEVICE_NAME_KEY, name)
}

export function getDeviceName(): string | null {
  return localStorage.getItem(DEVICE_NAME_KEY)
}
