import { DocumentBuilder } from '@nestjs/swagger';

export function getSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('Habit Tracker API')
    .setDescription('API for habit tracking, community, challenges and gamification')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication (Better Auth)')
    .addTag('profile', 'Profile, settings, follow, suggestions')
    .addTag('tasks', 'Tasks and completions')
    .addTag('posts', 'Posts, feed, comments, likes')
    .addTag('groups', 'Groups and members')
    .addTag('challenges', 'Challenges and progress')
    .addTag('notifications', 'User notifications')
    .addTag('gamification', 'Rewards and achievements')
    .addTag('upload', 'Image upload (Cloudinary)')
    .build();
}
