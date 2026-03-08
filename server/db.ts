import { and, eq, gte, lte, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  userProfiles, InsertUserProfile,
  habits, InsertHabit,
  habitCompletions, InsertHabitCompletion,
  tasks, InsertTask,
  goals, InsertGoal,
  transactions, InsertTransaction,
  focusProjects, InsertFocusProject,
  focusSessions, InsertFocusSession,
  waterLogs, InsertWaterLog,
  notifications, InsertNotification,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USERS ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ USER PROFILES ============

export async function getOrCreateProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const existing = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  if (existing.length > 0) return existing[0];
  await db.insert(userProfiles).values({ userId });
  const created = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  return created[0] ?? null;
}

export async function updateProfile(userId: number, data: Partial<InsertUserProfile>) {
  const db = await getDb();
  if (!db) return;
  await db.update(userProfiles).set(data).where(eq(userProfiles.userId, userId));
}

// ============ HABITS ============

export async function getHabits(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(habits).where(and(eq(habits.userId, userId), eq(habits.isActive, true)));
}

export async function createHabit(data: InsertHabit) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(habits).values(data);
  const id = result[0].insertId;
  const created = await db.select().from(habits).where(eq(habits.id, id)).limit(1);
  return created[0] ?? null;
}

export async function deleteHabit(id: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(habits).set({ isActive: false }).where(and(eq(habits.id, id), eq(habits.userId, userId)));
}

export async function getHabitCompletions(userId: number, startDate: string, endDate: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(habitCompletions).where(
    and(eq(habitCompletions.userId, userId), gte(habitCompletions.date, startDate), lte(habitCompletions.date, endDate))
  );
}

export async function toggleHabitCompletion(data: InsertHabitCompletion) {
  const db = await getDb();
  if (!db) return null;
  const existing = await db.select().from(habitCompletions).where(
    and(eq(habitCompletions.habitId, data.habitId), eq(habitCompletions.userId, data.userId), eq(habitCompletions.date, data.date))
  ).limit(1);
  if (existing.length > 0) {
    await db.delete(habitCompletions).where(eq(habitCompletions.id, existing[0].id));
    return { action: "removed" as const };
  }
  await db.insert(habitCompletions).values(data);
  return { action: "added" as const };
}

// ============ TASKS ============

export async function getTasks(userId: number, startDate?: string, endDate?: string) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(tasks.userId, userId)];
  if (startDate) conditions.push(gte(tasks.date, startDate));
  if (endDate) conditions.push(lte(tasks.date, endDate));
  return db.select().from(tasks).where(and(...conditions)).orderBy(tasks.date);
}

export async function createTask(data: InsertTask) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(tasks).values(data);
  const id = result[0].insertId;
  const created = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
  return created[0] ?? null;
}

export async function updateTask(id: number, userId: number, data: Partial<InsertTask>) {
  const db = await getDb();
  if (!db) return;
  await db.update(tasks).set(data).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
}

export async function deleteTask(id: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
}

// ============ GOALS ============

export async function getGoals(userId: number, status?: string) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(goals.userId, userId)];
  if (status) conditions.push(eq(goals.status, status as "active" | "completed" | "paused"));
  return db.select().from(goals).where(and(...conditions)).orderBy(desc(goals.createdAt));
}

export async function createGoal(data: InsertGoal) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(goals).values(data);
  const id = result[0].insertId;
  const created = await db.select().from(goals).where(eq(goals.id, id)).limit(1);
  return created[0] ?? null;
}

export async function updateGoal(id: number, userId: number, data: Partial<InsertGoal>) {
  const db = await getDb();
  if (!db) return;
  await db.update(goals).set(data).where(and(eq(goals.id, id), eq(goals.userId, userId)));
}

export async function deleteGoal(id: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(goals).where(and(eq(goals.id, id), eq(goals.userId, userId)));
}

// ============ TRANSACTIONS ============

export async function getTransactions(userId: number, year?: number, month?: number) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(transactions.userId, userId)];
  if (year !== undefined) conditions.push(eq(transactions.year, year));
  if (month !== undefined) conditions.push(eq(transactions.month, month));
  return db.select().from(transactions).where(and(...conditions)).orderBy(desc(transactions.createdAt));
}

export async function createTransaction(data: InsertTransaction) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(transactions).values(data);
  const id = result[0].insertId;
  const created = await db.select().from(transactions).where(eq(transactions.id, id)).limit(1);
  return created[0] ?? null;
}

export async function deleteTransaction(id: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(transactions).where(and(eq(transactions.id, id), eq(transactions.userId, userId)));
}

// ============ FOCUS PROJECTS ============

export async function getFocusProjects(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(focusProjects).where(eq(focusProjects.userId, userId));
}

export async function createFocusProject(data: InsertFocusProject) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(focusProjects).values(data);
  const id = result[0].insertId;
  const created = await db.select().from(focusProjects).where(eq(focusProjects.id, id)).limit(1);
  return created[0] ?? null;
}

export async function updateFocusProject(id: number, userId: number, data: Partial<InsertFocusProject>) {
  const db = await getDb();
  if (!db) return;
  await db.update(focusProjects).set(data).where(and(eq(focusProjects.id, id), eq(focusProjects.userId, userId)));
}

export async function deleteFocusProject(id: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(focusProjects).where(and(eq(focusProjects.id, id), eq(focusProjects.userId, userId)));
}

// ============ FOCUS SESSIONS ============

export async function getFocusSessions(userId: number, startDate?: string, endDate?: string) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(focusSessions.userId, userId)];
  if (startDate) conditions.push(gte(focusSessions.date, startDate));
  if (endDate) conditions.push(lte(focusSessions.date, endDate));
  return db.select().from(focusSessions).where(and(...conditions)).orderBy(desc(focusSessions.createdAt));
}

export async function createFocusSession(data: InsertFocusSession) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(focusSessions).values(data);
  const id = result[0].insertId;
  const created = await db.select().from(focusSessions).where(eq(focusSessions.id, id)).limit(1);
  return created[0] ?? null;
}

// ============ WATER LOGS ============

export async function getWaterLog(userId: number, date: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(waterLogs).where(
    and(eq(waterLogs.userId, userId), eq(waterLogs.date, date))
  ).limit(1);
  return result[0] ?? null;
}

export async function getWaterLogs(userId: number, startDate: string, endDate: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(waterLogs).where(
    and(eq(waterLogs.userId, userId), gte(waterLogs.date, startDate), lte(waterLogs.date, endDate))
  );
}

export async function upsertWaterLog(userId: number, date: string, amountMl: number) {
  const db = await getDb();
  if (!db) return null;
  const existing = await db.select().from(waterLogs).where(
    and(eq(waterLogs.userId, userId), eq(waterLogs.date, date))
  ).limit(1);
  if (existing.length > 0) {
    await db.update(waterLogs).set({ amountMl }).where(eq(waterLogs.id, existing[0].id));
    return { ...existing[0], amountMl };
  }
  await db.insert(waterLogs).values({ userId, date, amountMl });
  const created = await db.select().from(waterLogs).where(
    and(eq(waterLogs.userId, userId), eq(waterLogs.date, date))
  ).limit(1);
  return created[0] ?? null;
}

// ============ NOTIFICATIONS ============

export async function getNotifications(userId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(limit);
}

export async function createNotification(data: InsertNotification) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(notifications).values(data);
  return true;
}

export async function markNotificationsRead(userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, userId));
}

export async function clearNotifications(userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(notifications).where(eq(notifications.userId, userId));
}
