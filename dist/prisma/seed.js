"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting seeding...');
    const systemUser = await prisma.user.upsert({
        where: { email: 'system@habit-tracker.com' },
        update: {},
        create: {
            id: 'system',
            email: 'system@habit-tracker.com',
            name: 'System',
            emailVerified: true,
            username: 'system',
            subscriptionTier: client_1.SubscriptionTier.PRO,
        },
    });
    const types = ['HABIT', 'ROUTINE', 'TODO', 'MINDSET'];
    for (const typeName of types) {
        await prisma.taskType.upsert({
            where: { name: typeName },
            update: {},
            create: { name: typeName },
        });
    }
    const taskTypeMap = await prisma.taskType.findMany().then(types => Object.fromEntries(types.map(t => [t.name, t.id])));
    const categories = [
        { id: 'cat_health', name: 'Health', iconName: 'strokeRoundedApple', colorValue: 0xFF4CAF50 },
        { id: 'cat_workout', name: 'Workout', iconName: 'strokeRoundedTimer01', colorValue: 0xFFFF5722 },
        { id: 'cat_learning', name: 'Learning', iconName: 'strokeRoundedBookOpen01', colorValue: 0xFF2196F3 },
        { id: 'cat_meditation', name: 'Meditation', iconName: 'strokeRoundedYoga01', colorValue: 0xFF9C27B0 },
        { id: 'cat_productivity', name: 'Productivity', iconName: 'strokeRoundedTaskDaily01', colorValue: 0xFFFFC107 },
        { id: 'cat_nutrition', name: 'Nutrition', iconName: 'strokeRoundedApple', colorValue: 0xFFE91E63 },
        { id: 'cat_finance', name: 'Finance', iconName: 'strokeRoundedAnalytics01', colorValue: 0xFF00BCD4 },
        { id: 'cat_focus', name: 'Focus', iconName: 'strokeRoundedNotification01', colorValue: 0xFF607D8B },
        { id: 'cat_creativity', name: 'Creativity', iconName: 'strokeRoundedAiMagic', colorValue: 0xFFFF9800 },
        { id: 'cat_social', name: 'Social', iconName: 'strokeRoundedUser', colorValue: 0xFF3F51B5 },
    ];
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { id: cat.id },
            update: cat,
            create: cat,
        });
    }
    const units = [
        { id: 'unit_liters', name: 'Liters', symbol: 'L' },
        { id: 'unit_km', name: 'Kilometers', symbol: 'km' },
        { id: 'unit_pages', name: 'Pages', symbol: 'pg' },
        { id: 'unit_minutes', name: 'Minutes', symbol: 'min' },
        { id: 'unit_sessions', name: 'Sessions', symbol: 'sess' },
        { id: 'unit_steps', name: 'Steps', symbol: 'steps' },
        { id: 'unit_times', name: 'Times', symbol: 'x' },
        { id: 'unit_words', name: 'Words', symbol: 'wds' },
        { id: 'unit_usd', name: 'USD', symbol: '$' },
    ];
    for (const unit of units) {
        await prisma.taskUnit.upsert({
            where: { id: unit.id },
            update: unit,
            create: unit,
        });
    }
    const habits = [
        {
            id: 'tpl_habit_water',
            title: 'Drink 2.5L Water',
            typeId: taskTypeMap['HABIT'],
            categoryId: 'cat_health',
            goalValue: 2.5,
            unitId: 'unit_liters',
            direction: client_1.HabitDirection.POSITIVE,
            iconName: 'strokeRoundedApple',
        },
        {
            id: 'tpl_habit_meditation',
            title: 'Meditate 15 min',
            typeId: taskTypeMap['HABIT'],
            categoryId: 'cat_meditation',
            goalValue: 15,
            unitId: 'unit_minutes',
            direction: client_1.HabitDirection.POSITIVE,
            iconName: 'strokeRoundedYoga01',
        }
    ];
    for (const h of habits) {
        const { goalValue, unitId, direction, ...taskData } = h;
        await prisma.task.upsert({
            where: { id: h.id },
            update: {},
            create: {
                ...taskData,
                userId: 'system',
                isPredefined: true,
                habitDetails: {
                    create: {
                        goalValue,
                        unitId,
                        direction,
                    }
                }
            }
        });
    }
    const routines = [
        {
            id: 'tpl_routine_morning',
            title: 'Perfect Morning',
            typeId: taskTypeMap['ROUTINE'],
            categoryId: 'cat_productivity',
            steps: ['Water', 'Stretching', 'Meditation', 'Healthy Breakfast'],
            startTime: '07:00',
            iconName: 'strokeRoundedTaskDaily01',
        }
    ];
    for (const r of routines) {
        const { steps, startTime, ...taskData } = r;
        await prisma.task.upsert({
            where: { id: r.id },
            update: {},
            create: {
                ...taskData,
                userId: 'system',
                isPredefined: true,
                routineDetails: {
                    create: {
                        steps,
                        startTime,
                    }
                }
            }
        });
    }
    const mindsets = [
        {
            id: 'tpl_mindset_growth',
            title: 'Growth Mindset',
            typeId: taskTypeMap['MINDSET'],
            categoryId: 'cat_learning',
            affirmation: 'I am not fixed, I am a work in progress.',
            durationMinutes: 5,
            iconName: 'strokeRoundedBookOpen01',
        }
    ];
    for (const m of mindsets) {
        const { affirmation, durationMinutes, ...taskData } = m;
        await prisma.task.upsert({
            where: { id: m.id },
            update: {},
            create: {
                ...taskData,
                userId: 'system',
                isPredefined: true,
                mindsetDetails: {
                    create: {
                        affirmation,
                        durationMinutes,
                    }
                }
            }
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
//# sourceMappingURL=seed.js.map