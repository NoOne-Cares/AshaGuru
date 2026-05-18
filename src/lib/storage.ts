import { openDB } from "idb";

const DB_NAME = "ashaguru-db";
const DB_VERSION = 2; // bumped to force upgrade
const STORE_NAME = "sessions";

export interface Session {
    id: string;
    name: string;
    messages: { role: string; content: string }[];
    lastUpdated: number;
}

export async function getAllSessions(): Promise<Session[]> {
    const db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        },
    });
    const all = await db.getAll(STORE_NAME);
    return all.sort((a, b) => b.lastUpdated - a.lastUpdated);
}

export async function saveSession(session: Session) {
    const db = await openDB(DB_NAME, DB_VERSION);
    // Ensure store exists in case of version mismatch (though upgrade should have run)
    if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.close();
        // Force delete and recreate (optional)
        await deleteDatabaseAndRecreate();
        // Fallback: just return
        return;
    }
    await db.put(STORE_NAME, { ...session, lastUpdated: Date.now() });
}

export async function deleteSession(id: string) {
    const db = await openDB(DB_NAME, DB_VERSION);
    if (db.objectStoreNames.contains(STORE_NAME)) {
        await db.delete(STORE_NAME, id);
    }
}

// Helper to regenerate the database if store missing (optional, you can remove if not needed)
async function deleteDatabaseAndRecreate() {
    return new Promise<void>((resolve) => {
        const req = indexedDB.deleteDatabase(DB_NAME);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
    });
}
