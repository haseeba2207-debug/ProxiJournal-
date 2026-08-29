import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'proxijournal.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

// --------------------------------------------------
// DATABASE CONNECTION
// --------------------------------------------------

const getDB = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DATABASE_NAME);
  }

  return dbPromise;
};

// --------------------------------------------------
// TYPES
// --------------------------------------------------

export type Note = {
  id: number;
  title: string;
  body: string;
  timestamp: string;
  tags: string;
  synced: number;
};

export type Attachment = {
  id: number;
  note_id: number;
  type: string;
  file_name: string;
  file_uri: string;
  created_at: string;
};

// --------------------------------------------------
// INITIALIZE DATABASE
// --------------------------------------------------

export const initDatabase = async () => {
  const db = await getDB();

  await db.execAsync(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL DEFAULT '',
      body TEXT NOT NULL DEFAULT '',
      timestamp TEXT NOT NULL,
      tags TEXT NOT NULL DEFAULT '',
      synced INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS attachments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      note_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_uri TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (note_id)
        REFERENCES notes(id)
        ON DELETE CASCADE
    );
  `);

  return db;
};

// --------------------------------------------------
// CREATE NOTE
// --------------------------------------------------

export const createNote = async (
  title: string,
  body: string,
  tags: string
): Promise<number> => {
  const db = await initDatabase();

  const result = await db.runAsync(
    `
      INSERT INTO notes
      (
        title,
        body,
        timestamp,
        tags,
        synced
      )
      VALUES (?, ?, ?, ?, ?)
    `,
    title,
    body,
    new Date().toISOString(),
    tags,
    0
  );

  return Number(result.lastInsertRowId);
};

// --------------------------------------------------
// UPDATE NOTE
// --------------------------------------------------

export const updateNote = async (
  id: number,
  title: string,
  body: string,
  tags: string
): Promise<void> => {
  const db = await initDatabase();

  await db.runAsync(
    `
      UPDATE notes
      SET
        title = ?,
        body = ?,
        tags = ?
      WHERE id = ?
    `,
    title,
    body,
    tags,
    id
  );
};

// --------------------------------------------------
// GET NOTE BY ID
// --------------------------------------------------

export const getNoteById = async (
  id: number
): Promise<Note | null> => {
  const db = await initDatabase();

  const note = await db.getFirstAsync<Note>(
    `
      SELECT *
      FROM notes
      WHERE id = ?
      LIMIT 1
    `,
    id
  );

  return note ?? null;
};

// --------------------------------------------------
// GET ALL NOTES
// --------------------------------------------------

export const getAllNotes = async (): Promise<Note[]> => {
  const db = await initDatabase();

  const notes = await db.getAllAsync<Note>(
    `
      SELECT *
      FROM notes
      ORDER BY datetime(timestamp) DESC
    `
  );

  return notes;
};

// --------------------------------------------------
// DELETE NOTE
// --------------------------------------------------

export const deleteNote = async (
  id: number
): Promise<void> => {
  const db = await initDatabase();

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `
        DELETE FROM attachments
        WHERE note_id = ?
      `,
      id
    );

    await db.runAsync(
      `
        DELETE FROM notes
        WHERE id = ?
      `,
      id
    );
  });
};

// --------------------------------------------------
// ADD ATTACHMENT
// --------------------------------------------------

export const addAttachment = async (
  noteId: number,
  type: string,
  fileName: string,
  fileUri: string
): Promise<number> => {
  const db = await initDatabase();

  const result = await db.runAsync(
    `
      INSERT INTO attachments
      (
        note_id,
        type,
        file_name,
        file_uri,
        created_at
      )
      VALUES (?, ?, ?, ?, ?)
    `,
    noteId,
    type,
    fileName,
    fileUri,
    new Date().toISOString()
  );

  return Number(result.lastInsertRowId);
};

// --------------------------------------------------
// GET ATTACHMENTS
// --------------------------------------------------

export const getAttachments = async (
  noteId: number
): Promise<Attachment[]> => {
  const db = await initDatabase();

  const attachments =
    await db.getAllAsync<Attachment>(
      `
        SELECT *
        FROM attachments
        WHERE note_id = ?
        ORDER BY datetime(created_at) DESC
      `,
      noteId
    );

  return attachments;
};

// --------------------------------------------------
// DATABASE STATS
// --------------------------------------------------

export const getDatabaseStats = async () => {
  const db = await initDatabase();

  const notesResult =
    await db.getFirstAsync<{ count: number }>(
      `
        SELECT COUNT(*) as count
        FROM notes
      `
    );

  const attachmentsResult =
    await db.getFirstAsync<{ count: number }>(
      `
        SELECT COUNT(*) as count
        FROM attachments
      `
    );

  return {
    notes: Number(notesResult?.count ?? 0),
    attachments: Number(
      attachmentsResult?.count ?? 0
    ),
  };
};

// --------------------------------------------------
// CLEAR DATABASE
// --------------------------------------------------

export const clearDatabase = async (): Promise<void> => {
  const db = await initDatabase();

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `DELETE FROM attachments`
    );

    await db.runAsync(
      `DELETE FROM notes`
    );
  });
};