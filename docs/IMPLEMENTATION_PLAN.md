# Implementation plan

Foundation is in place: auth (Better Auth + Nest), Prisma schema (auth + habitracker_app), seed (categories, units, templates), profile (get/update), task (create), reference (categories, units, templates). Below is a suggested order for the rest.

---

## Phase 1: Task core (priority for app)

| #   | Feature                | Description                                                                                                                                                                       |
| --- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 | **List my tasks**      | GET `/tasks` – paginated, filter by type/deleted; use `findByUserId` from repo. Add `ListTasksUseCase`.                                                                           |
| 1.2 | **Get task by id**     | GET `/tasks/:id` – single task with details; use `findById`. Add `GetTaskUseCase`.                                                                                                |
| 1.3 | **Update task**        | PATCH `/tasks/:id` – update title, category, type-specific details; use `update`; ensure ownership (userId).                                                                      |
| 1.4 | **Delete task (soft)** | DELETE `/tasks/:id` – set `isDeleted: true` (or call repo delete if already implemented as soft).                                                                                 |
| 1.5 | **Task completions**   | POST `/tasks/:id/completions` – log completion (value, notes); GET `/tasks/:id/completions` – list (paginated). New use cases + endpoints (or sub-resource under TaskController). |

**Deliverable:** Flutter app can create, list, update, delete tasks and log completions.

---

## Phase 2: Profile & references

| #   | Feature                                | Description                                                                                                                                                    |
| --- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.1 | **Protect task/reference**             | Ensure task endpoints use `SessionGuard` and resolve `userId` from `@CurrentUser()` (not from body).                                                           |
| 2.2 | **Reference over use case (optional)** | Move categories/units/templates behind use cases + repo if you want strict Clean Architecture; otherwise keep current Prisma-in-controller for reference only. |
| 2.3 | **Profile extras**                     | Avatar upload (URL or storage), username uniqueness check, or leave as-is.                                                                                     |

---

## Phase 3: Community (posts, social)

| #   | Feature              | Description                                                                                      |
| --- | -------------------- | ------------------------------------------------------------------------------------------------ |
| 3.1 | **Posts**            | Create post (TEXT/IMAGE, visibility, groupId); list feed (user’s + followed); get by id; delete. |
| 3.2 | **Comments & likes** | Add comment, list comments; like/unlike post.                                                    |
| 3.3 | **Follows**          | Follow/unfollow user; list followers/following.                                                  |
| 3.4 | **Groups**           | Create group, list (public + mine), join/leave, members; optional invite flow.                   |

Schema already has Post, Comment, Like, Follow, Group, GroupMember.

---

## Phase 4: Challenges

| #   | Feature        | Description                                                                                                 |
| --- | -------------- | ----------------------------------------------------------------------------------------------------------- |
| 4.1 | **Challenges** | Create challenge (group, task template, dates); list (active by group/user); join/leave.                    |
| 4.2 | **Progress**   | Link task completions to challenge; “on track” / “falling behind” (use schema fields); optional auto-posts. |
| 4.3 | **Completion** | Mark challenge completed; award points (RewardEvent).                                                       |

Schema: Challenge, ChallengeMember, Task.challengeId, RewardEvent.

---

## Phase 5: Notifications & gamification

| #   | Feature              | Description                                                                                                               |
| --- | -------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 5.1 | **Notifications**    | List (by user, paginated); mark read; optional push later.                                                                |
| 5.2 | **Rewards / points** | Expose HabitProfile.points; list RewardEvent history; trigger rewards on completions/streaks (backend jobs or on-demand). |
| 5.3 | **Achievements**     | List achievement definitions; user progress toward definitions (e.g. “7-day streak”).                                     |

Schema: Notification, NotificationTypeRef, RewardEvent, AchievementDefinition.

---

## Phase 6: Polish & production

- **Flutter client** – point API base URL to this backend; use Better Auth client for sign-in/session.
- **Validation** – DTOs with class-validator where useful.
- **Tests** – e2e for auth + task CRUD; unit for use cases.
- **Deploy** – env (BETTER_AUTH_URL, DATABASE_URL, secrets), migrations, optional Redis for cache/session.

---

## Suggested next step

Start with **Phase 1.1 (list tasks)** and **1.5 (completions)** so the app can show tasks and log completions; then 1.2–1.4 (get/update/delete). After that, Phase 2 (guards + ownership) and then community/challenges as needed.
