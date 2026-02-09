import {
  PrismaClient,
  HabitDirection,
  SubscriptionTier,
  TaskType,
  TaskPriority,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding...');

  // 1. Create System User
  await prisma.user.upsert({
    where: { email: 'system@habit-tracker.com' },
    update: {},
    create: {
      id: 'system',
      email: 'system@habit-tracker.com',
      name: 'System',
      emailVerified: true,
      username: 'system',
      subscriptionTier: SubscriptionTier.PRO,
    },
  });

  // 2. Categories
  const categories = [
    { id: 'cat_health', name: 'Health', iconName: 'strokeRoundedApple', colorValue: 0xff4caf50 },
    {
      id: 'cat_workout',
      name: 'Workout',
      iconName: 'strokeRoundedTimer01',
      colorValue: 0xffff5722,
    },
    {
      id: 'cat_learning',
      name: 'Learning',
      iconName: 'strokeRoundedBookOpen01',
      colorValue: 0xff2196f3,
    },
    {
      id: 'cat_meditation',
      name: 'Meditation',
      iconName: 'strokeRoundedYoga01',
      colorValue: 0xff9c27b0,
    },
    {
      id: 'cat_productivity',
      name: 'Productivity',
      iconName: 'strokeRoundedTaskDaily01',
      colorValue: 0xffffc107,
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: cat,
      create: cat,
    });
  }

  // 3. Units
  const units = [
    { id: 'unit_liters', name: 'Liters', symbol: 'L' },
    { id: 'unit_km', name: 'Kilometers', symbol: 'km' },
    { id: 'unit_minutes', name: 'Minutes', symbol: 'min' },
    { id: 'unit_times', name: 'Times', symbol: 'x' },
  ];

  for (const unit of units) {
    await prisma.taskUnit.upsert({
      where: { id: unit.id },
      update: unit,
      create: unit,
    });
  }

  // 4. Template Habits
  const habits = [
    {
      id: 'tpl_habit_water',
      title: 'Drink 2.5L Water',
      type: TaskType.HABIT,
      categoryId: 'cat_health',
      goalValue: 2.5,
      unitId: 'unit_liters',
      direction: HabitDirection.POSITIVE,
      iconName: 'strokeRoundedApple',
    },
  ];

  for (const h of habits) {
    const { goalValue, unitId, direction, ...taskData } = h;
    await prisma.task.upsert({
      where: { id: h.id },
      update: {
        title: taskData.title,
        iconName: taskData.iconName,
        habitDetails: {
          update: { goalValue, unitId, direction },
        },
      },
      create: {
        ...taskData,
        userId: 'system',
        isPredefined: true,
        habitDetails: {
          create: { goalValue, unitId, direction },
        },
      },
    });
  }

  // 5. Template Routines
  const routines = [
    {
      id: 'tpl_routine_morning',
      title: 'Morning Ritual',
      type: TaskType.ROUTINE,
      categoryId: 'cat_productivity',
      steps: ['Water', 'Stretching', 'Meditation'],
      startTime: '07:00',
      iconName: 'strokeRoundedTaskDaily01',
    },
  ];

  for (const r of routines) {
    const { steps, startTime, ...taskData } = r;
    await prisma.task.upsert({
      where: { id: r.id },
      update: {
        title: taskData.title,
        routineDetails: {
          update: { steps, startTime },
        },
      },
      create: {
        ...taskData,
        userId: 'system',
        isPredefined: true,
        routineDetails: {
          create: { steps, startTime },
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
