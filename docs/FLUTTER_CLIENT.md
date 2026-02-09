# Flutter klijent za ovaj API

Šta ti treba da Flutter aplikacija koristi habit-tracker API i da li da generišeš klijenta ili radiš ručne pozive.

---

## Šta ti uvek treba

1. **Base URL** – npr. `http://localhost:3001` (ili tvoj `PORT`) u dev, u produkciji `https://api.tvojdomen.com`.
2. **Auth** – Better Auth; Flutter koristi [better_auth](https://pub.dev/packages/better_auth) (ili HTTP pozive ka `/auth/*`). Sesija se drži u kukijima ili tokenu kako Better Auth klijent radi. Svaki API poziv mora da šalje kredencijale (cookie ili `Authorization` header) da bi zaštićene rute radile.
3. **HTTP klijent** – `dio` ili `http` za pozive. Preporuka: **dio** (interceptors za base URL i auth, timeout, itd.).

---

## Dve opcije: generisani klijent vs ručni pozivi

### Opcija A: Generisani klijent (OpenAPI)

- **Šta:** Iz Swagger/OpenAPI spec ovog API-ja generišeš Dart klase i metode za sve rute.
- **Kako:**  
  - API eksponuje OpenAPI JSON na: **`GET {baseUrl}/api/docs-json`** (npr. `http://localhost:3001/api/docs-json`).  
  - Koristiš [OpenAPI Generator](https://openapi-generator.tech/docs/generators/dart) (CLI) ili paket [openapi_generator](https://pub.dev/packages/openapi_generator) (Dart build_runner).  
  - Generišeš kod u neki folder u Flutter projektu (npr. `lib/generated/api`).
- **Prednosti:** Tipizovani pozivi, modeli (request/response) i serializacija automatski, manje grešaka, brže dodavanje novih endpointa.  
- **Nedostaci:** Kad menjaš API, moraš ponovo da pokreneš generisanje i eventualno da prilagodiš (npr. auth header ako generator to ne podržava out-of-the-box).

**Primer (CLI):**
```bash
# Jednom instaliraj openapi-generator-cli (npr. npm i -g @openapitools/openapi-generator-cli)
# Spec preuzmi sa pokrenutog API-ja:
curl -o openapi.json http://localhost:3001/api/docs-json

# Generiši Dart klijent
openapi-generator-cli generate -i openapi.json -g dart-dio -o ../habit-tracker/lib/generated/api
```

Zatim u Flutteru konfigurišeš base URL i auth (npr. Dio interceptor koji dodaje cookie/token) na tom generisanom klijentu.

---

### Opcija B: Ručni pozivi (dio + modeli)

- **Šta:** Ne generišeš ništa; pišeš servis/repository u Flutteru koji `dio.get/post/...` poziva konkretne URL-ove i ručno mapira JSON u svoje modele.
- **Kako:**  
  - Jedan `ApiClient` ili `BaseRepository` sa `Dio` instancom (base URL, interceptors za auth).  
  - Za svaki endpoint: metoda tipa `getTasks()`, `createPost(body)`, itd., sa svojim DTO klasama (možeš koristiti `json_serializable` za fromJson/toJson).
- **Prednosti:** Potpuna kontrola, nema koraka codegen, lako prilagoditi auth i retry logiku.  
- **Nedostaci:** Više ručnog rada, veća šansa za greške u tipovima/JSON poljima kad se API menja.

---

## Preporuka

- **Ako želiš brzo i tipizovano:** generiši klijent iz **`/api/docs-json`** (OpenAPI), pa ga u Flutteru koristi sa jednim Dio + auth interceptorom.  
- **Ako voliš sve ručno ili API još često menjaš u nepredvidiv način:** ručni dio + modeli su sasvim ok.

---

## Arhitektura: Cubit + TanStack Query (Flutter)

TanStack Query **ima Flutter verziju** – paketi [tanstack_query](https://pub.dev/packages/tanstack_query) ili [flutter_tanstack_query](https://pub.dev/packages/flutter_tanstack_query) (API inspirisan React Query v5). Odličan je par sa **Cubitom**:

| Sloj | Odgovoran za |
|------|----------------|
| **Cubit** | Logic & UI state: "korisnik je uključio filter", "otvoren je modal", "tema je promenjena". |
| **TanStack Query** | Server state: "podaci se učitavaju", "keš je istekao", "automatski retry", paginacija, invalidacija. |

**Tok:** `UI → Cubit → Query → Repository → NestJS API`

### Zašto TanStack Query umesto ručnog keširanja?

Sa sopstvenim NestJS backendom gubiš Firebase “out of the box” ponašanje. TanStack Query to nadoknađuje:

- **Stale-While-Revalidate** – UI odmah prikazuje stare (keširane) podatke, Query u pozadini osvežava sa NestJS.
- **Auto-retry** – ako NestJS vrati grešku ili nestane mreža, Query sam pokušava ponovo.
- **Query invalidation** – kad dodaš novi habit, pozoveš `invalidateQueries(['habits'])` i lista se sama osvežava.
- **Optimistic updates** – čim korisnik klikne, stavka se pojavi u listi; Query u pozadini šalje zahtev Nest-u. Ako Nest vrati grešku, Query uradi rollback.

### Infinite scroll (feed, liste)

TanStack Query (Flutter) nudi **InfiniteQuery** (ekvivalent `useInfiniteQuery`):

- On vodi računa o tome na kojoj si strani (page/cursor).
- Automatski lepi nove stavke na kraj liste dok korisnik skroluje.
- Kešira feed – ako korisnik uđe u post i izađe nazad, lista je odmah tu (bez ponovnog učitavanja).

**Paketi:** `tanstack_query` ili `flutter_tanstack_query` na pub.dev; oba podržavaju Query, Mutation, InfiniteQuery, invalidation i konfiguraciju (staleTime, retry, itd.).

---

## Persistence & Sync: lokalna baza kao ogledalo Postgresa

SharedPreferences ostaje samo za stvari tipa token/session. Za sve što dolazi sa API-ja treba **prava lokalna baza** koja služi kao cache (i eventualno outbox za offline pisanje).

### 1. Izbor lokalne baze (Persistence Layer)

| Opcija | Kada | Napomena |
|--------|------|----------|
| **Isar** (preporuka) | Želiš brzinu i jednostavan model | NoSQL, asinhroni rad, naslednik Hive-a, odlično sa Flutterom. Ekstremno brz. |
| **Drift** | Želiš da ostaneš u SQL svetu i na klijentu | SQLite, kompleksni upiti, tipizovane tabele. |

Token/session može i dalje u SharedPreferences (ili secure_storage); **podatke iz API-ja** (habits, tasks, feed) držiš u Isar-u ili Drift-u.

### 2. Repository pattern: odakle dolaze podaci

Repository odlučuje: prvo lokalno (instant UI), zatim u pozadini NestJS i osvežavanje lokala.

```dart
class HabitRepository {
  final LocalDatabase local; // Isar ili Drift
  final ApiClient remote;    // NestJS API (generisani ili dio)

  Future<List<Habit>> getHabits() async {
    // 1. Odmah vrati keš (instant UI)
    final cached = await local.getAllHabits();

    // 2. U pozadini gađaj NestJS
    try {
      final fresh = await remote.fetchHabits();
      await local.syncHabits(fresh);
      return fresh;
    } catch (e) {
      // 3. Nema neta – korisnik već vidi keširane podatke
      return cached;
    }
  }
}
```

TanStack Query poziva ovaj Repository: Query dobija podatke odavde, a Repository kombinuje **local** (Isar/Drift) i **remote** (NestJS). Stale-While-Revalidate upravo ovde dobija smisla: Query može da vrati keš iz lokala odmah, a u pozadini da pokrene `getHabits()` koji osvežava sa servera i ažurira lokalnu bazu.

### 3. Offline writes (Outbox pattern)

Kad korisnik nešto kreira/izmeni bez neta, ne možeš odmah poslati na NestJS. Rešenje je **Outbox**:

1. Korisnik klikne "Save".
2. Upis u **lokalnu bazu** sa flagom npr. `isSynced: false` (ili posebna "outbox" kolekcija/tabela).
3. Pozadinski proces (WorkManager, isolate, ili periodični timer kad se app vrati u foreground) uzima sve sa `isSynced == false` i šalje ih na NestJS.
4. Kad NestJS vrati npr. `201 Created` (ili uspešan PATCH), u lokalu postaviš `isSynced: true` (ili obrišeš iz outbox-a).
5. Pri konfliktima (isti resurs menjan i online i offline) možeš dodati strategiju (last-write-wins, ili ručno resolve).

UI može odmah da prikaže novi habit iz lokala; TanStack Query može da invalidira listu kad se sync završi, da se lista osveži.

### 4. Šta gubiš, a šta dobijaš?

| Gubiš | Dobijaš |
|-------|---------|
| **Real-time sync** – Firebase je automatski slao promene. Ovde nema "live" po defaultu. | **Performanse** – Isar reaguje u sub-milisekundama; nema čekanja na mrežu za prikaz keša. |
| Ako ti treba da se UI osveži čim neko drugi promeni podatak, moraš sam da dodaš **WebSockets** (npr. Socket.io) ili **SSE** na NestJS i da ih koristiš u Flutteru. | Potpuna kontrola nad offline, kešom i strategijom sync-a. |

### 5. Kako se uklapa u arhitekturu

- **UI → Cubit → Query → Repository → (Local + Remote)**
- **Local** = Isar ili Drift (cache + outbox za neposync-ovane izmene).
- **Remote** = NestJS API (ApiClient / dio).
- TanStack Query upravlja "kada da pozove Repository", retry i invalidation; Repository upravlja "odakle uzeti podatke" i "kako sinhronizovati sa serverom".

---

## Rezime

| Šta | Vrednost |
|-----|----------|
| Base URL | `http://localhost:3001` (ili tvoj PORT) / produkcija URL |
| OpenAPI spec | `GET {baseUrl}/api/docs-json` |
| Auth | Better Auth klijent (Flutter) + cookie/token na svaki zaštićen poziv |
| Generisani klijent | OpenAPI Generator (dart-dio) ili `openapi_generator` paket |
| Data fetching + cache | **TanStack Query** za Flutter (`tanstack_query` / `flutter_tanstack_query`) |
| UI / app state | **Cubit** (Bloc) – filteri, modali, tema |
| Lokalna baza | **Isar** (preporuka) ili **Drift** (SQLite); ne SharedPreferences za podatke iz API-ja |
| Sync strategija | Repository: prvo lokal (instant UI), zatim remote + sync lokala; offline = **Outbox** (`isSynced: false` → pozadinski sync) |
| Real-time | Nema po defaultu; ako treba – WebSockets ili SSE na NestJS |
| Arhitektura | UI → Cubit → Query → Repository → (Local + NestJS) |
