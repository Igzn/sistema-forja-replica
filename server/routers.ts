import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============ USER PROFILE ============
  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return db.getOrCreateProfile(ctx.user.id);
    }),
    update: protectedProcedure.input(z.object({
      xp: z.number().optional(),
      coins: z.number().optional(),
      level: z.number().optional(),
      streak: z.number().optional(),
      waterMl: z.number().optional(),
      waterGoalMl: z.number().optional(),
      sleepRating: z.string().optional(),
      energyRating: z.string().optional(),
      humorRating: z.string().optional(),
      focusHoursGoal: z.number().optional(),
    })).mutation(async ({ ctx, input }) => {
      await db.updateProfile(ctx.user.id, input);
      return db.getOrCreateProfile(ctx.user.id);
    }),
    addXp: protectedProcedure.input(z.object({
      amount: z.number(),
    })).mutation(async ({ ctx, input }) => {
      const profile = await db.getOrCreateProfile(ctx.user.id);
      if (!profile) return null;
      const newXp = profile.xp + input.amount;
      const newLevel = Math.floor(newXp / 100) + 1;
      await db.updateProfile(ctx.user.id, { xp: newXp, level: newLevel });
      return { xp: newXp, level: newLevel };
    }),
    addCoins: protectedProcedure.input(z.object({
      amount: z.number(),
    })).mutation(async ({ ctx, input }) => {
      const profile = await db.getOrCreateProfile(ctx.user.id);
      if (!profile) return null;
      const newCoins = profile.coins + input.amount;
      await db.updateProfile(ctx.user.id, { coins: newCoins });
      return { coins: newCoins };
    }),
  }),

  // ============ HABITS ============
  habits: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getHabits(ctx.user.id);
    }),
    create: protectedProcedure.input(z.object({
      name: z.string().min(1),
      icon: z.string().default("💪"),
      frequency: z.enum(["daily", "weekly", "custom"]).default("daily"),
      dailyGoal: z.number().default(1),
      customDays: z.array(z.number()).optional(),
    })).mutation(async ({ ctx, input }) => {
      return db.createHabit({ ...input, userId: ctx.user.id });
    }),
    delete: protectedProcedure.input(z.object({
      id: z.number(),
    })).mutation(async ({ ctx, input }) => {
      await db.deleteHabit(input.id, ctx.user.id);
      return { success: true };
    }),
    completions: protectedProcedure.input(z.object({
      startDate: z.string(),
      endDate: z.string(),
    })).query(async ({ ctx, input }) => {
      return db.getHabitCompletions(ctx.user.id, input.startDate, input.endDate);
    }),
    toggle: protectedProcedure.input(z.object({
      habitId: z.number(),
      date: z.string(),
    })).mutation(async ({ ctx, input }) => {
      return db.toggleHabitCompletion({
        habitId: input.habitId,
        userId: ctx.user.id,
        date: input.date,
      });
    }),
  }),

  // ============ TASKS ============
  tasks: router({
    list: protectedProcedure.input(z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }).optional()).query(async ({ ctx, input }) => {
      return db.getTasks(ctx.user.id, input?.startDate, input?.endDate);
    }),
    create: protectedProcedure.input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      date: z.string(),
      time: z.string().optional(),
      priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
      isRecurring: z.boolean().default(false),
      recurringDays: z.array(z.number()).optional(),
      xpReward: z.number().default(10),
    })).mutation(async ({ ctx, input }) => {
      return db.createTask({ ...input, userId: ctx.user.id });
    }),
    update: protectedProcedure.input(z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      date: z.string().optional(),
      time: z.string().optional(),
      priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
      isCompleted: z.boolean().optional(),
      isRecurring: z.boolean().optional(),
      recurringDays: z.array(z.number()).optional(),
    })).mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await db.updateTask(id, ctx.user.id, data);
      return { success: true };
    }),
    delete: protectedProcedure.input(z.object({
      id: z.number(),
    })).mutation(async ({ ctx, input }) => {
      await db.deleteTask(input.id, ctx.user.id);
      return { success: true };
    }),
  }),

  // ============ GOALS ============
  goals: router({
    list: protectedProcedure.input(z.object({
      status: z.string().optional(),
    }).optional()).query(async ({ ctx, input }) => {
      return db.getGoals(ctx.user.id, input?.status);
    }),
    create: protectedProcedure.input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      category: z.string().optional(),
      icon: z.string().default("🎯"),
      deadline: z.string().optional(),
      milestones: z.array(z.object({ text: z.string(), done: z.boolean() })).optional(),
    })).mutation(async ({ ctx, input }) => {
      return db.createGoal({ ...input, userId: ctx.user.id });
    }),
    update: protectedProcedure.input(z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      category: z.string().optional(),
      icon: z.string().optional(),
      deadline: z.string().optional(),
      status: z.enum(["active", "completed", "paused"]).optional(),
      progress: z.number().optional(),
      milestones: z.array(z.object({ text: z.string(), done: z.boolean() })).optional(),
    })).mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await db.updateGoal(id, ctx.user.id, data);
      return { success: true };
    }),
    delete: protectedProcedure.input(z.object({
      id: z.number(),
    })).mutation(async ({ ctx, input }) => {
      await db.deleteGoal(input.id, ctx.user.id);
      return { success: true };
    }),
  }),

  // ============ FINANCE ============
  finance: router({
    list: protectedProcedure.input(z.object({
      year: z.number().optional(),
      month: z.number().optional(),
    }).optional()).query(async ({ ctx, input }) => {
      return db.getTransactions(ctx.user.id, input?.year, input?.month);
    }),
    create: protectedProcedure.input(z.object({
      title: z.string().min(1),
      amount: z.number().positive(),
      type: z.enum(["income", "expense"]),
      category: z.string().default("Outros"),
      date: z.string(),
      month: z.number(),
      year: z.number(),
      notes: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      return db.createTransaction({ ...input, userId: ctx.user.id });
    }),
    delete: protectedProcedure.input(z.object({
      id: z.number(),
    })).mutation(async ({ ctx, input }) => {
      await db.deleteTransaction(input.id, ctx.user.id);
      return { success: true };
    }),
  }),

  // ============ FOCUS ============
  focus: router({
    projects: router({
      list: protectedProcedure.query(async ({ ctx }) => {
        return db.getFocusProjects(ctx.user.id);
      }),
      create: protectedProcedure.input(z.object({
        name: z.string().min(1),
        color: z.string().default("#EF4444"),
      })).mutation(async ({ ctx, input }) => {
        return db.createFocusProject({ ...input, userId: ctx.user.id });
      }),
      update: protectedProcedure.input(z.object({
        id: z.number(),
        totalMinutes: z.number().optional(),
      })).mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updateFocusProject(id, ctx.user.id, data);
        return { success: true };
      }),
      delete: protectedProcedure.input(z.object({
        id: z.number(),
      })).mutation(async ({ ctx, input }) => {
        await db.deleteFocusProject(input.id, ctx.user.id);
        return { success: true };
      }),
    }),
    sessions: router({
      list: protectedProcedure.input(z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }).optional()).query(async ({ ctx, input }) => {
        return db.getFocusSessions(ctx.user.id, input?.startDate, input?.endDate);
      }),
      create: protectedProcedure.input(z.object({
        projectId: z.number().optional(),
        projectName: z.string().default("Sem projeto"),
        duration: z.number(),
        type: z.enum(["focus", "break"]).default("focus"),
        date: z.string(),
        time: z.string(),
      })).mutation(async ({ ctx, input }) => {
        return db.createFocusSession({ ...input, userId: ctx.user.id });
      }),
    }),
  }),

  // ============ WATER ============
  water: router({
    get: protectedProcedure.input(z.object({
      date: z.string(),
    })).query(async ({ ctx, input }) => {
      return db.getWaterLog(ctx.user.id, input.date);
    }),
    getRange: protectedProcedure.input(z.object({
      startDate: z.string(),
      endDate: z.string(),
    })).query(async ({ ctx, input }) => {
      return db.getWaterLogs(ctx.user.id, input.startDate, input.endDate);
    }),
    update: protectedProcedure.input(z.object({
      date: z.string(),
      amountMl: z.number().min(0),
    })).mutation(async ({ ctx, input }) => {
      return db.upsertWaterLog(ctx.user.id, input.date, input.amountMl);
    }),
  }),

  // ============ NOTIFICATIONS ============
  notifications: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getNotifications(ctx.user.id);
    }),
    create: protectedProcedure.input(z.object({
      type: z.string(),
      title: z.string(),
      message: z.string(),
      icon: z.string().default("🔔"),
      color: z.string().default("text-yellow-400"),
    })).mutation(async ({ ctx, input }) => {
      return db.createNotification({ ...input, userId: ctx.user.id });
    }),
    markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
      await db.markNotificationsRead(ctx.user.id);
      return { success: true };
    }),
    clearAll: protectedProcedure.mutation(async ({ ctx }) => {
      await db.clearNotifications(ctx.user.id);
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
