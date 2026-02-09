# User tracking (analytics)

## Šta ti treba

1. **Mixpanel nalog** – [mixpanel.com](https://mixpanel.com), napravi projekat.
2. **Env varijable** u `.env`:
   - `MIXPANEL_PROJECT_TOKEN` – Project Token iz Mixpanel Settings → Project Settings.
   - `MIXPANEL_API_SECRET` – opciono, za neke server-side API pozive; za samo slanje eventova dovoljan je token.
3. **Poštovanje privatnosti** – u aplikaciji korisnik ima `analyticsEnabled` u profile settings. Šalji evente samo ako je `analyticsEnabled === true` (ili za anonimne akcije pre logina).

## Backend (ovaj API)

- **`AnalyticsService`** – globalni servis, injektuješ ga gde treba i pozivaš `track(userId, eventName, properties?)`.
- Ako `MIXPANEL_PROJECT_TOKEN` nije setovan, `track` je no-op (ništa se ne šalje).
- Primer u use case-u ili controlleru:
  - Učitaj profile settings za usera; ako je `analyticsEnabled`, pozovi `this.analyticsService.track(user.id, 'Task Completed', { taskType: 'HABIT' })`.

### Primeri eventova koje možeš da šalješ

| Event                 | distinct_id | properties (opciono)          |
| --------------------- | ----------- | ----------------------------- |
| `User Signed Up`      | userId      | `method: 'email' \| 'google'` |
| `Task Completed`      | userId      | `taskType`, `taskId`          |
| `Challenge Joined`    | userId      | `challengeId`, `groupId`      |
| `Challenge Completed` | userId      | `challengeId`                 |
| `Post Created`        | userId      | `type`, `groupId`             |
| `Profile Updated`     | userId      | –                             |

## Flutter – šta ti treba

### 1. Paket

```yaml
# pubspec.yaml
dependencies:
  mixpanel_flutter: ^2.3.0
```

`flutter pub get`

### 2. Token

- **Mixpanel Project Token** (isti kao na backendu) – iz Mixpanel → Project Settings.
- U Flutteru ga možeš držati u build config (npr. `--dart-define=MIXPANEL_TOKEN=xxx`) ili u env fajlu koji učitavaš (npr. `flutter_dotenv`). Za produkciju ne commituj token u repo; koristi CI/env ili `--dart-define` u buildu.

### 3. Inicijalizacija

- U `main.dart` (ili odmah posle `runApp`) inicijalizuj Mixpanel **samo ako** imaš token (da ne puca u dev bez tokena):

```dart
import 'package:mixpanel_flutter/mixpanel_flutter.dart';

Mixpanel? mixpanel;
final token = String.fromEnvironment('MIXPANEL_TOKEN', defaultValue: '');

Future<void> initAnalytics() async {
  if (token.isEmpty) return;
  mixpanel = await Mixpanel.init(token, trackAutomaticEvents: true);
}
// U main(): await initAnalytics(); pa runApp(...)
```

- Za development bez tokena: `token.isEmpty` → ne zovi `Mixpanel.init`, sve ostalo može pozivati servis koji proverava `mixpanel != null`.

### 4. Identifikacija (nakon logina)

- Kad se user uloguje (Better Auth / session), pozovi:

```dart
if (mixpanel != null && userId != null) {
  mixpanel!.identify(userId);
  // opciono: mixpanel!.getPeople().set('email', email);
}
```

- Tako svi naredni eventi iz aplikacije idu pod tim `userId`.

### 5. Poštovanje privatnosti (analyticsEnabled)

- Već imaš `analyticsEnabled` u `UserSettings` / profile settings i "Usage Analytics" u Privacy postavkama.
- Pre **svakog** slanja eventa proveri da li je analytics uključen (iz lokalnog state-a ili API-ja):
  - Npr. u Bloc/Cubit koji drži `UserSettings` ili poziv na `GET /profile/me/settings`.
- Wrapper primer:

```dart
void track(String event, [Map<String, dynamic>? properties]) {
  if (mixpanel == null || !analyticsEnabled) return;
  mixpanel!.track(event, properties: properties ?? {});
}
```

- Gde uzimaš `analyticsEnabled`: iz state-a nakon učitavanja profile settings (isti kao za Privacy ekran). Kad korisnik isključi "Usage Analytics", postavi flag u memoriji i ne šalji više evente dok ne uključi ponovo.

### 6. Šta da šalješ iz Fluttera

- **Ekrani:** `track('Screen View', {'screen': 'home'})`, `screen: 'task_detail'`, itd.
- **Ključne akcije:** npr. "Task Completed", "Challenge Joined", "Post Created" – možeš i iz Fluttera (kao duplikat backend eventa) ili samo sa backenda; ako šalješ i sa Fluttera, koristi iste nazive eventova da se u Mixpanel-u sve slaže po `distinct_id`.
- **Opciono:** `trackAutomaticEvents: true` pri init-u daje osnovne stvari (npr. app open); za detaljnije ponašanje dodaj ručne `track()` pozive gde ti treba.

### 7. Rezime za Flutter

| Šta | Kako |
|-----|------|
| Paket | `mixpanel_flutter` |
| Token | `--dart-define=MIXPANEL_TOKEN=...` ili env, ne u kodu |
| Init | `Mixpanel.init(token)` u main, samo ako token nije prazan |
| Identify | `mixpanel.identify(userId)` nakon logina |
| Privatnost | Šalji evente samo kada je `analyticsEnabled == true` (iz profile settings) |
| Eventi | `mixpanel.track('Event Name', properties: {...})` |

## Rezime

- **Env:** `MIXPANEL_PROJECT_TOKEN` (obavezno za slanje), opciono `MIXPANEL_API_SECRET`.
- **Backend:** injektuj `AnalyticsService`, pozivaj `track(userId, eventName, properties)` tamo gde imaš ključne akcije; proveri `analyticsEnabled` pre slanja.
- **Privatnost:** šalji evente samo ako je korisnik pristao (profile.analyticsEnabled ili anonimni eventi).
