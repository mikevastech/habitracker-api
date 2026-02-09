import 'dotenv/config';
import { PrismaClient, HabitDirection, SubscriptionTier, TaskType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is not set');

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seeding...');
  // All seed data goes to schema.prisma schemas: auth (User) and habitracker_app
  // (reference tables, HabitProfile, Category, TaskUnit, Task templates). On a clean run
  // (migrate reset / migrate dev) habitracker tables are not created in public.

  // 0. Reference tables (notification types & achievement definitions – add new row for new type)
  const notificationTypes = [
    { code: 'FOLLOW', name: 'New follower', description: 'Someone followed you' },
    { code: 'NEW_FOLLOWER', name: 'New follower', description: 'You have a new follower' },
    { code: 'UNFOLLOW', name: 'Unfollow', description: 'Someone unfollowed you' },
    { code: 'LIKE_POST', name: 'Post liked', description: 'Someone liked your post' },
    { code: 'COMMENT_POST', name: 'New comment', description: 'Someone commented on your post' },
    {
      code: 'COMMENT_REPLY',
      name: 'Comment reply',
      description: 'Someone replied to your comment',
    },
    { code: 'TAGGED_IN_POST', name: 'Tagged in post', description: 'You were tagged in a post' },
    { code: 'MENTION', name: 'Mention', description: 'Someone mentioned you' },
    { code: 'POST_SHARED', name: 'Post shared', description: 'Your post was shared' },
    { code: 'INVITE_TO_GROUP', name: 'Group invite', description: 'Invitation to join a group' },
    {
      code: 'GROUP_INVITE_ACCEPTED',
      name: 'Invite accepted',
      description: 'Your group invite was accepted',
    },
    {
      code: 'GROUP_INVITE_DECLINED',
      name: 'Invite declined',
      description: 'Your group invite was declined',
    },
    {
      code: 'GROUP_JOIN_REQUEST',
      name: 'Join request',
      description: 'Someone requested to join your group',
    },
    {
      code: 'GROUP_JOIN_APPROVED',
      name: 'Join approved',
      description: 'Your request to join a group was approved',
    },
    {
      code: 'GROUP_ROLE_CHANGED',
      name: 'Role changed',
      description: 'Your role in the group was changed',
    },
    { code: 'GROUP_NEW_MEMBER', name: 'New member', description: 'New member joined the group' },
    {
      code: 'INVITE_TO_CHALLENGE',
      name: 'Challenge invite',
      description: 'Invitation to join a challenge',
    },
    {
      code: 'CHALLENGE_INVITE_ACCEPTED',
      name: 'Challenge invite accepted',
      description: 'Your challenge invite was accepted',
    },
    {
      code: 'CHALLENGE_INVITE_DECLINED',
      name: 'Challenge invite declined',
      description: 'Your challenge invite was declined',
    },
    {
      code: 'CHALLENGE_STARTED',
      name: 'Challenge started',
      description: 'A challenge you joined has started',
    },
    {
      code: 'CHALLENGE_COMPLETED',
      name: 'Challenge completed',
      description: 'Challenge completed',
    },
    {
      code: 'CHALLENGE_ON_TRACK',
      name: 'On track',
      description: 'You are on track in the challenge',
    },
    {
      code: 'CHALLENGE_FALLING_BEHIND',
      name: 'Falling behind',
      description: 'Reminder: you are falling behind',
    },
    {
      code: 'CHALLENGE_REMINDER',
      name: 'Challenge reminder',
      description: 'Reminder for your challenge',
    },
    {
      code: 'FRIEND_JOINED_CHALLENGE',
      name: 'Friend joined',
      description: 'A friend joined your challenge',
    },
    { code: 'TASK_REMINDER', name: 'Task reminder', description: 'Reminder for a task' },
    {
      code: 'STREAK_MILESTONE',
      name: 'Streak milestone',
      description: 'You hit a streak milestone',
    },
    { code: 'STREAK_LOST', name: 'Streak lost', description: 'You lost your streak' },
    {
      code: 'ACHIEVEMENT_UNLOCKED',
      name: 'Achievement unlocked',
      description: 'You unlocked an achievement',
    },
    { code: 'DAILY_GOAL_REACHED', name: 'Daily goal', description: 'You reached your daily goal' },
    { code: 'USER_BLOCKED', name: 'User blocked', description: 'You have been blocked' },
    { code: 'REPORT_RESOLVED', name: 'Report resolved', description: 'Your report was resolved' },
    { code: 'SYSTEM_ANNOUNCEMENT', name: 'Announcement', description: 'System announcement' },
    { code: 'WELCOME', name: 'Welcome', description: 'Welcome to the app' },
  ];
  for (const nt of notificationTypes) {
    await prisma.notificationTypeRef.upsert({
      where: { code: nt.code },
      update: { name: nt.name, description: nt.description ?? undefined },
      create: nt,
    });
  }

  const achievementDefinitions = [
    {
      code: 'CHALLENGE_COMPLETED',
      name: 'Challenge completed',
      description: 'Completed a challenge',
      pointsDefault: 50,
      sortOrder: 1,
    },
    {
      code: 'CHALLENGE_FIRST_PLACE',
      name: 'First place',
      description: 'Finished first in a challenge',
      pointsDefault: 100,
      sortOrder: 2,
    },
    {
      code: 'CHALLENGE_PARTICIPATED',
      name: 'Participant',
      description: 'Participated in a challenge',
      pointsDefault: 10,
      sortOrder: 3,
    },
    {
      code: 'STREAK_3',
      name: '3-day streak',
      description: '3 days in a row',
      pointsDefault: 5,
      sortOrder: 10,
    },
    {
      code: 'STREAK_7',
      name: '7-day streak',
      description: '7 days in a row',
      pointsDefault: 15,
      sortOrder: 11,
    },
    {
      code: 'STREAK_30',
      name: '30-day streak',
      description: '30 days in a row',
      pointsDefault: 50,
      sortOrder: 12,
    },
    {
      code: 'STREAK_100',
      name: '100-day streak',
      description: '100 days in a row',
      pointsDefault: 200,
      sortOrder: 13,
    },
    {
      code: 'FIRST_TASK_COMPLETED',
      name: 'First completion',
      description: 'Completed your first task',
      pointsDefault: 5,
      sortOrder: 20,
    },
    {
      code: 'FIRST_HABIT_CREATED',
      name: 'First habit',
      description: 'Created your first habit',
      pointsDefault: 5,
      sortOrder: 21,
    },
    {
      code: 'DAILY_GOAL_DAY',
      name: 'Daily goal',
      description: 'Reached daily goal',
      pointsDefault: 10,
      sortOrder: 22,
    },
    {
      code: 'DAILY_GOAL_WEEK',
      name: 'Weekly goal',
      description: 'Reached goals all week',
      pointsDefault: 30,
      sortOrder: 23,
    },
    {
      code: 'TASK_COMPLETION_10',
      name: '10 completions',
      description: '10 task completions',
      pointsDefault: 10,
      sortOrder: 24,
    },
    {
      code: 'TASK_COMPLETION_100',
      name: '100 completions',
      description: '100 task completions',
      pointsDefault: 50,
      sortOrder: 25,
    },
    {
      code: 'FIRST_POST',
      name: 'First post',
      description: 'Posted for the first time',
      pointsDefault: 5,
      sortOrder: 30,
    },
    {
      code: 'FIRST_FOLLOWER',
      name: 'First follower',
      description: 'Got your first follower',
      pointsDefault: 10,
      sortOrder: 31,
    },
    {
      code: 'PROFILE_COMPLETE',
      name: 'Profile complete',
      description: 'Completed your profile',
      pointsDefault: 5,
      sortOrder: 32,
    },
    {
      code: 'EARLY_ADOPTER',
      name: 'Early adopter',
      description: 'Joined early',
      pointsDefault: 25,
      sortOrder: 40,
    },
    {
      code: 'MILESTONE_CUSTOM',
      name: 'Custom milestone',
      description: 'Custom milestone reached',
      pointsDefault: 0,
      sortOrder: 99,
    },
  ];
  for (const ad of achievementDefinitions) {
    await prisma.achievementDefinition.upsert({
      where: { code: ad.code },
      update: {
        name: ad.name,
        description: ad.description ?? undefined,
        pointsDefault: ad.pointsDefault,
        sortOrder: ad.sortOrder,
      },
      create: ad,
    });
  }

  // 1. Create System User (id = UUID from @default(uuid()))
  const systemUser = await prisma.user.upsert({
    where: {
      email_originAppId: {
        email: 'system-habitracker@ainovaty.com',
        originAppId: 'habitracker',
      },
    },
    update: {},
    create: {
      email: 'system-habitracker@ainovaty.com',
      name: 'System',
      emailVerified: true,
      originAppId: 'habitracker',
    },
  });

  // 2. Create System Habit Profile
  await prisma.habitProfile.upsert({
    where: { userId: systemUser.id },
    update: {},
    create: {
      userId: systemUser.id,
      username: 'system',
      subscriptionTier: SubscriptionTier.PRO,
    },
  });

  // 3. Categories (UUID ids; colorValue = 24-bit RGB; aligned with Flutter seed_data.dart)
  const categoryKeys = [
    { key: 'health', name: 'Health', iconName: 'strokeRoundedApple', colorValue: 0x4caf50 },
    { key: 'workout', name: 'Workout', iconName: 'strokeRoundedTimer01', colorValue: 0xff5722 },
    {
      key: 'learning',
      name: 'Learning',
      iconName: 'strokeRoundedBookOpen01',
      colorValue: 0x2196f3,
    },
    {
      key: 'meditation',
      name: 'Meditation',
      iconName: 'strokeRoundedYoga01',
      colorValue: 0x9c27b0,
    },
    {
      key: 'productivity',
      name: 'Productivity',
      iconName: 'strokeRoundedTaskDaily01',
      colorValue: 0xffc107,
    },
    { key: 'nutrition', name: 'Nutrition', iconName: 'strokeRoundedApple', colorValue: 0x8bc34a },
    { key: 'focus', name: 'Focus', iconName: 'strokeRoundedNotification01', colorValue: 0x673ab7 },
    { key: 'finance', name: 'Finance', iconName: 'strokeRoundedAnalytics01', colorValue: 0x009688 },
    {
      key: 'creativity',
      name: 'Creativity',
      iconName: 'strokeRoundedAiMagic',
      colorValue: 0xe91e63,
    },
    { key: 'social', name: 'Social', iconName: 'strokeRoundedUser', colorValue: 0x3f51b5 },
  ];
  const categoryIds: Record<string, string> = {};
  for (const cat of categoryKeys) {
    const existing = await prisma.category.findFirst({
      where: { userId: systemUser.id, name: cat.name },
    });
    if (existing) {
      categoryIds[cat.key] = existing.id;
    } else {
      const c = await prisma.category.create({
        data: {
          name: cat.name,
          iconName: cat.iconName,
          colorValue: cat.colorValue,
          userId: systemUser.id,
          isPredefined: true,
        },
      });
      categoryIds[cat.key] = c.id;
    }
  }

  // 4. Units (UUID ids; aligned with Flutter seed_data.dart)
  const unitKeys = [
    { key: 'liters', name: 'Liters', symbol: 'L' },
    { key: 'km', name: 'Kilometers', symbol: 'km' },
    { key: 'minutes', name: 'Minutes', symbol: 'min' },
    { key: 'times', name: 'Times', symbol: 'x' },
    { key: 'pages', name: 'Pages', symbol: 'pgs' },
    { key: 'sessions', name: 'Sessions', symbol: 'sess' },
    { key: 'steps', name: 'Steps', symbol: 'steps' },
    { key: 'hours', name: 'Hours', symbol: 'h' },
    { key: 'words', name: 'Words', symbol: 'wds' },
    { key: 'usd', name: 'USD', symbol: '$' },
  ];
  const unitIds: Record<string, string> = {};
  for (const u of unitKeys) {
    const existing = await prisma.taskUnit.findFirst({
      where: { userId: systemUser.id, name: u.name },
    });
    if (existing) {
      unitIds[u.key] = existing.id;
    } else {
      const created = await prisma.taskUnit.create({
        data: {
          name: u.name,
          symbol: u.symbol,
          userId: systemUser.id,
          isPredefined: true,
        },
      });
      unitIds[u.key] = created.id;
    }
  }

  // 5. Template Habits (20 – from Flutter seed_data.dart; UUID ids)
  const habits = [
    {
      title: 'Drink 2.5L Water',
      categoryKey: 'health',
      goalValue: 2.5,
      unitKey: 'liters',
      direction: HabitDirection.POSITIVE,
      iconName: 'strokeRoundedApple',
    },
    {
      title: 'Morning 5km Run',
      categoryKey: 'workout',
      goalValue: 5,
      unitKey: 'km',
      direction: HabitDirection.POSITIVE,
      iconName: 'strokeRoundedTimer01',
    },
    {
      title: 'Read 30 Pages',
      categoryKey: 'learning',
      goalValue: 30,
      unitKey: 'pages',
      direction: HabitDirection.POSITIVE,
      iconName: 'strokeRoundedBookOpen01',
    },
    {
      title: 'Meditate 15 min',
      categoryKey: 'meditation',
      goalValue: 15,
      unitKey: 'minutes',
      direction: HabitDirection.POSITIVE,
      iconName: 'strokeRoundedYoga01',
    },
    {
      title: 'Daily Journaling',
      categoryKey: 'productivity',
      goalValue: 1,
      unitKey: 'sessions',
      direction: HabitDirection.POSITIVE,
      iconName: 'strokeRoundedTaskDaily01',
    },
    {
      title: 'Full Body Stretch',
      categoryKey: 'workout',
      goalValue: 10,
      unitKey: 'minutes',
      direction: HabitDirection.POSITIVE,
      iconName: 'strokeRoundedYoga01',
    },
    {
      title: '10,000 Steps',
      categoryKey: 'workout',
      goalValue: 10000,
      unitKey: 'steps',
      direction: HabitDirection.POSITIVE,
      iconName: 'strokeRoundedTimer01',
    },
    {
      title: 'Eat 2 Portions of Fruit',
      categoryKey: 'nutrition',
      goalValue: 2,
      unitKey: 'times',
      direction: HabitDirection.POSITIVE,
      iconName: 'strokeRoundedApple',
    },
    {
      title: 'No Soda Today',
      categoryKey: 'health',
      goalValue: 0,
      unitKey: 'sessions',
      direction: HabitDirection.NEGATIVE,
      iconName: 'strokeRoundedApple',
    },
    {
      title: 'Sleep 8 Hours',
      categoryKey: 'health',
      goalValue: 8,
      unitKey: 'hours',
      direction: HabitDirection.POSITIVE,
      iconName: 'strokeRoundedNotification01',
    },
    {
      title: 'Learn 5 New Words',
      categoryKey: 'learning',
      goalValue: 5,
      unitKey: 'words',
      direction: HabitDirection.POSITIVE,
      iconName: 'strokeRoundedBookOpen01',
    },
    {
      title: 'Save $10 Daily',
      categoryKey: 'finance',
      goalValue: 10,
      unitKey: 'usd',
      direction: HabitDirection.POSITIVE,
      iconName: 'strokeRoundedAnalytics01',
    },
    {
      title: 'No Screens Before Bed',
      categoryKey: 'focus',
      goalValue: 1,
      unitKey: 'sessions',
      direction: HabitDirection.POSITIVE,
      iconName: 'strokeRoundedNotification01',
    },
    {
      title: 'Quick 10min Tidy Up',
      categoryKey: 'productivity',
      goalValue: 10,
      unitKey: 'minutes',
      direction: HabitDirection.POSITIVE,
      iconName: 'strokeRoundedTaskDaily01',
    },
    {
      title: 'Cold Shower',
      categoryKey: 'health',
      goalValue: 1,
      unitKey: 'sessions',
      direction: HabitDirection.POSITIVE,
      iconName: 'strokeRoundedApple',
    },
    {
      title: 'Practice Coding',
      categoryKey: 'learning',
      goalValue: 60,
      unitKey: 'minutes',
      direction: HabitDirection.POSITIVE,
      iconName: 'strokeRoundedAiMagic',
    },
    {
      title: '3 Things I am Grateful For',
      categoryKey: 'meditation',
      goalValue: 3,
      unitKey: 'times',
      direction: HabitDirection.POSITIVE,
      iconName: 'strokeRoundedYoga01',
    },
    {
      title: 'Floss Teeth',
      categoryKey: 'health',
      goalValue: 1,
      unitKey: 'sessions',
      direction: HabitDirection.POSITIVE,
      iconName: 'strokeRoundedApple',
    },
    {
      title: 'Practice Instrument',
      categoryKey: 'creativity',
      goalValue: 20,
      unitKey: 'minutes',
      direction: HabitDirection.POSITIVE,
      iconName: 'strokeRoundedAiMagic',
    },
    {
      title: 'Call Family',
      categoryKey: 'social',
      goalValue: 1,
      unitKey: 'sessions',
      direction: HabitDirection.POSITIVE,
      iconName: 'strokeRoundedUser',
    },
  ];

  for (const h of habits) {
    const existing = await prisma.task.findFirst({
      where: { userId: systemUser.id, title: h.title, type: TaskType.HABIT, isPredefined: true },
    });
    if (existing) continue;
    await prisma.task.create({
      data: {
        title: h.title,
        type: TaskType.HABIT,
        iconName: h.iconName,
        profile: { connect: { userId: systemUser.id } },
        category: { connect: { id: categoryIds[h.categoryKey] } },
        isPredefined: true,
        habitDetails: {
          create: { goalValue: h.goalValue, unitId: unitIds[h.unitKey], direction: h.direction },
        },
      },
    });
  }

  // 6. Template Routines (10 – from Flutter seed_data.dart; UUID ids)
  const routines = [
    {
      title: 'Perfect Morning',
      categoryKey: 'productivity',
      steps: ['Water', 'Stretching', 'Meditation', 'Healthy Breakfast'],
      startTime: '07:00',
      iconName: 'strokeRoundedTaskDaily01',
    },
    {
      title: 'Nightly Reset',
      categoryKey: 'health',
      steps: ['Reflect on Day', 'Read 20 min', 'No phone 30 min before bed'],
      startTime: '22:00',
      iconName: 'strokeRoundedNotification01',
    },
    {
      title: 'Workout Fuel',
      categoryKey: 'workout',
      steps: ['Pre-workout drink', 'Change clothes', 'Dynamic warm-up'],
      startTime: undefined,
      iconName: 'strokeRoundedTimer01',
    },
    {
      title: 'Deep Work Flow',
      categoryKey: 'focus',
      steps: ['Clear desk', 'Start timer', 'Turn off notifications'],
      startTime: undefined,
      iconName: 'strokeRoundedNotification01',
    },
    {
      title: 'Healthy Pantry',
      categoryKey: 'nutrition',
      steps: ['Grocery list', 'Meal prep 3 hours', 'Organize fridge'],
      startTime: undefined,
      iconName: 'strokeRoundedApple',
    },
    {
      title: 'Quick Home Refresh',
      categoryKey: 'productivity',
      steps: ['Dishes', 'Laundry', 'Vacuum'],
      startTime: undefined,
      iconName: 'strokeRoundedTaskDaily01',
    },
    {
      title: 'Budget Review',
      categoryKey: 'finance',
      steps: ['Track expenses', 'Analyze budget', 'Plan savings'],
      startTime: undefined,
      iconName: 'strokeRoundedAnalytics01',
    },
    {
      title: 'Sunday Preparation',
      categoryKey: 'productivity',
      steps: ['Plan week', 'Iron clothes', 'Clean workspace'],
      startTime: undefined,
      iconName: 'strokeRoundedTaskDaily01',
    },
    {
      title: 'Creative Hour',
      categoryKey: 'creativity',
      steps: ['Doodle/Idea dump', 'Work on project', 'No judgment zone'],
      startTime: undefined,
      iconName: 'strokeRoundedAiMagic',
    },
    {
      title: 'Self-Care Ritual',
      categoryKey: 'meditation',
      steps: ['Skin care', 'Herbal tea', 'Breathing exercise'],
      startTime: undefined,
      iconName: 'strokeRoundedYoga01',
    },
  ];

  for (const r of routines) {
    const existing = await prisma.task.findFirst({
      where: { userId: systemUser.id, title: r.title, type: TaskType.ROUTINE, isPredefined: true },
    });
    if (existing) continue;
    await prisma.task.create({
      data: {
        title: r.title,
        type: TaskType.ROUTINE,
        iconName: r.iconName,
        profile: { connect: { userId: systemUser.id } },
        category: { connect: { id: categoryIds[r.categoryKey] } },
        isPredefined: true,
        routineDetails: { create: { steps: r.steps, startTime: r.startTime ?? undefined } },
      },
    });
  }

  // 7. Template Mindsets (10 – from Flutter seed_data.dart; UUID ids)
  const mindsets = [
    {
      title: 'Growth Mindset',
      categoryKey: 'learning',
      affirmation: 'I am not fixed, I am a work in progress.',
      durationMinutes: 5,
      iconName: 'strokeRoundedBookOpen01',
    },
    {
      title: 'Daily Resilience',
      categoryKey: 'focus',
      affirmation: 'Challenges only make me stronger.',
      durationMinutes: 5,
      iconName: 'strokeRoundedNotification01',
    },
    {
      title: 'Inner Peace',
      categoryKey: 'meditation',
      affirmation: 'I release what I cannot control.',
      durationMinutes: 10,
      iconName: 'strokeRoundedYoga01',
    },
    {
      title: 'Abundance Thinking',
      categoryKey: 'finance',
      affirmation: 'Opportunities are everywhere if I look for them.',
      durationMinutes: 5,
      iconName: 'strokeRoundedAnalytics01',
    },
    {
      title: 'Ultra Productivity',
      categoryKey: 'productivity',
      affirmation: 'My focus is my superpower.',
      durationMinutes: 5,
      iconName: 'strokeRoundedTaskDaily01',
    },
    {
      title: 'Vitality Beliefs',
      categoryKey: 'health',
      affirmation: 'My body is my temple, I treat it with respect.',
      durationMinutes: 5,
      iconName: 'strokeRoundedApple',
    },
    {
      title: 'Deep Gratitude',
      categoryKey: 'meditation',
      affirmation: 'I have everything I need right now.',
      durationMinutes: 10,
      iconName: 'strokeRoundedYoga01',
    },
    {
      title: 'Clarifying Purpose',
      categoryKey: 'focus',
      affirmation: 'Everything I do today aligns with my goals.',
      durationMinutes: 5,
      iconName: 'strokeRoundedNotification01',
    },
    {
      title: 'Compassionate Social',
      categoryKey: 'social',
      affirmation: 'I bring value to every person I meet.',
      durationMinutes: 5,
      iconName: 'strokeRoundedUser',
    },
    {
      title: 'Creative Spark',
      categoryKey: 'creativity',
      affirmation: 'My imagination has no limits.',
      durationMinutes: 10,
      iconName: 'strokeRoundedAiMagic',
    },
  ];

  for (const m of mindsets) {
    const existing = await prisma.task.findFirst({
      where: { userId: systemUser.id, title: m.title, type: TaskType.MINDSET, isPredefined: true },
    });
    if (existing) continue;
    await prisma.task.create({
      data: {
        title: m.title,
        type: TaskType.MINDSET,
        iconName: m.iconName,
        profile: { connect: { userId: systemUser.id } },
        category: { connect: { id: categoryIds[m.categoryKey] } },
        isPredefined: true,
        mindsetDetails: {
          create: { affirmation: m.affirmation, durationMinutes: m.durationMinutes },
        },
      },
    });
  }

  console.log('✅ Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
