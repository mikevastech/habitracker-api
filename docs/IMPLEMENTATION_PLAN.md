# Implementation plan

Foundation is in place: auth (Better Auth + Nest), Prisma schema (auth + habitracker_app), seed (categories, units, templates), profile (get/update), task (create), reference (categories, units, templates). Below is the order and what each phase covers.

---

## User vs profile vs task settings (schema)

- **UserSetting (auth schema)** – key/value per user for _global_ prefs: theme, locale, security. Managed by Better Auth or optional API `GET/PATCH /user/settings` (key/value). Not required for Flutter if app uses local storage for theme/locale.
- **ProfileSettings (habitracker_app)** – 1:1 with HabitProfile. _App-specific_: privacy (isSearchable, analyticsEnabled, profileVisibility, challengeVisibility, challengePostVisibility), **task defaults** (taskDailyReminderTime, taskWeekStartDay, taskArchiveVisible), **pomodoro defaults** (focus/break/longBreak duration). Implement as `GET/PATCH /profile/me/settings`. Flutter “Privacy & Social” and “task defaults” map here.
- **Task-level settings** – Per-task: reminders (TaskReminder), pomodoro (PomodoroSettings). Already covered by task CRUD or can be extended. No separate “task settings” API needed beyond task update.

**Conclusion:** Implement **ProfileSettings** only (GET/PATCH). UserSetting (auth) can be added later if we need theme/locale in API.

---

## Phase 1: Task core ✅ Implemented

| #   | Feature                | Description                                             |
| --- | ---------------------- | ------------------------------------------------------- |
| 1.1 | **List my tasks**      | GET `/tasks` – paginated, filter by type/deleted.       |
| 1.2 | **Get task by id**     | GET `/tasks/:id` – ownership enforced.                  |
| 1.3 | **Update task**        | PATCH `/tasks/:id` – ownership enforced.                |
| 1.4 | **Delete task (soft)** | DELETE `/tasks/:id`.                                    |
| 1.5 | **Task completions**   | POST/GET `/tasks/:id/completions` – ownership enforced. |

---

## Phase 2: Profile & references ✅ Done

| #   | Feature                    | Status                                                                          |
| --- | -------------------------- | ------------------------------------------------------------------------------- |
| 2.1 | **Protect task/reference** | Task endpoints use `SessionGuard` + `@CurrentUser()`; reference has use cases.  |
| 2.2 | **Reference use cases**    | Categories, units, task templates behind use cases + repo + Redis cache.        |
| 2.3 | **Profile extras**         | Username uniqueness (`check-username`); avatar via profile update (User.image). |

---

## Phase 3: Profile settings ✅ Implemented

| #   | Feature              | Description                                                                                    |
| --- | -------------------- | ---------------------------------------------------------------------------------------------- |
| 3.1 | **Profile settings** | GET `/profile/me/settings` – return ProfileSettings (create with defaults if missing).         |
| 3.2 | **Update settings**  | PATCH `/profile/me/settings` – privacy, task defaults, pomodoro defaults (align with Flutter). |

Schema: `ProfileSettings` (userId PK, 1:1 HabitProfile); fields: isSearchable, analyticsEnabled, profileVisibility, challengeVisibility, challengePostVisibility, taskDailyReminderTime, taskWeekStartDay, taskArchiveVisible, pomodoro\*.

---

## Phase 4: Community (follows, groups, posts)

| #   | Feature     | Status  | Description                                                                                                                         |
| --- | ----------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 4.1 | **Follows** | ✅      | POST `/profile/me/following/:userId` follow, DELETE unfollow; GET `/profile/me/followers`, GET `/profile/me/following` (paginated). |
| 4.2 | **Groups**  | TODO    | Create group, list (public + mine), get by id, join/leave, list members.                                                            |
| 4.3 | **Posts**   | partial | Create, list, like, comments exist; add GET by id, DELETE, feed by followed.                                                        |

Schema: Follow, Group, GroupMember, Post, Comment, Like.

---

## Phase 5: Challenges

| #   | Feature        | Description                                                             |
| --- | -------------- | ----------------------------------------------------------------------- |
| 5.1 | **Challenges** | Create (group, task template, dates); list (by group/user); join/leave. |
| 5.2 | **Progress**   | Link task completions to challenge; on track / falling behind.          |
| 5.3 | **Completion** | Mark challenge completed; award points (RewardEvent).                   |

Schema: Challenge, ChallengeMember, Task.challengeId, RewardEvent.

---

## Phase 6: Notifications & gamification

| #   | Feature              | Description                                    |
| --- | -------------------- | ---------------------------------------------- |
| 6.1 | **Notifications**    | List (by user, paginated); mark read.          |
| 6.2 | **Rewards / points** | HabitProfile.points; list RewardEvent history. |
| 6.3 | **Achievements**     | List achievement definitions; user progress.   |

---

## Phase 7: Polish & production

- Flutter client – API base URL, Better Auth client.
- Validation – DTOs with class-validator.
- Tests – e2e/unit.
- Deploy – env, migrations, Redis.

---

## Data sources & cache (existing)

- **Task**: remote (Prisma) + local (Redis) – task by id cache, completions counter.
- **Reference**: remote + local (Redis) – categories/units/templates, TTL 7 days.
- **Profile**: remote + local (Redis) for profile; **Follow** has dedicated **IFollowLocalDataSource** (Redis):
  - **Counters**: `user:{id}:followers_count`, `user:{id}:following_count` – INCR/DECR on follow/unfollow; used for profile counts and instant SCARD-style read. TTL 30 days, refresh on access.
  - **Sets**: `user:{id}:following`, `user:{id}:followers` – SADD/SREM on follow/unfollow; SISMEMBER for isFollowing, SMEMBERS for fan-out and SINTER for mutual follows. TTL 30 days.
  - **Feed inbox**: `user:{id}:feed` – Sorted Set (score = timestamp); fan-out on post create (add post to each follower’s feed); GET feed = ZREVRANGE. TTL 7 days.
  - **Invalidation**: Unfollow updates Postgres then Redis (SREM both sets, DECR both counters).
  - **Reconcile**: Counts are warmed when read from DB (setCounters). Optional: cron or on-login job to repopulate sets from DB for active users.
