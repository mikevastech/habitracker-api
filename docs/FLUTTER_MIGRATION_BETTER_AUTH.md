# Migracija Flutter aplikacije: Firebase Auth → Better Auth (NestJS API)

Plan zamenjivanja Firebase Auth u habit-tracker Flutter aplikaciji sa Better Auth koji radi na ovom NestJS API-ju.

---

## Šta je urađeno (Flutter)

- **AppUser** entitet i **AuthRepository** interfejs bez Firebase tipova (`Stream<AppUser?>`, sign-in/up/Google → `Future<AppUser>`).
- **FirebaseAuthRepository** prilagođen da implementira novi interfejs (mapiranje Firebase User → AppUser).
- **AuthCubit** i **AuthState** koriste **AppUser?**; sve reference na `FirebaseAuth.instance.currentUser` zamenjene sa `AuthRepository.currentUser` / `AuthCubit.state.user` (ili GetIt).
- **BetterAuthApiRepository** (auth deo): sign-in email, sign-up email, sign-out, get session, forgot password; **SecureTokenStore** (flutter_secure_storage). Profile/settings/follow/block/search/report trenutno bacaju `UnimplementedError` – treba dodati Dio pozive ka Nest API-ju.
- **DI**: u `injection_container.dart` i dalje je registrovan **FirebaseAuthRepository**. U istom fajlu je zakomentarisan primer registracije **BetterAuthApiRepository**; kada dodaš API pozive za profil, možeš preći na Better Auth tako što ćeš odkomentarisati taj blok i ukloniti registraciju Firebase repozitorijuma.

---

## Šta se menja

| Bilo (Firebase) | Posle (Better Auth + API) |
|-----------------|---------------------------|
| `FirebaseAuth` + `GoogleSignIn` | [better_auth_client](https://pub.dev/packages/better_auth_client) → pozivi ka `{baseUrl}/auth/*` |
| `User` / `UserCredential` | App-level tip `AppUser` (id, email, name, image) |
| `Firestore` za profile, settings, follow, block, search | HTTP pozivi ka NestJS: `/profile/*`, itd. |
| `FirebaseAuth.instance.currentUser` | `AuthRepository.currentUser` (AppUser?) ili `AuthCubit.state.user` |

---

## Koraci

1. **Domain**
   - Uvesti entitet **AppUser** (id, email, name?, image?) – zamenjuje Firebase `User` u celoj aplikaciji.
   - **AuthRepository** interfejs: `authStateChanges` → `Stream<AppUser?>`, `currentUser` → `AppUser?`, sign-in/up/Google vraćaju `Future<AppUser>` (umesto `UserCredential`). Ostale metode (getUserSettings, follow, block, …) ostaju iste; implementacija prelazi na API.

2. **Data**
   - Dodati pakete: `better_auth_client`, `dio`, `flutter_secure_storage` (za TokenStore).
   - **TokenStore**: implementacija koja čuva token u secure storage; koristi je Better Auth client.
   - **BetterAuthApiRepository** (implementacija `AuthRepository`):
     - **Auth**: Better Auth client (baseUrl = `$apiBaseUrl/auth`) za sign-in email, sign-up email, sign-in Google (OAuth), sign-out, get session, forgot password. Session/token čuvati u TokenStore i dodavati ga na sve API pozive (Dio interceptor).
     - **Profil / settings / socijalno**: Dio sa base URL = API base, interceptor koji dodaje session (cookie ili Bearer token) na svaki zahtev; pozivi ka `GET/PATCH /profile/me`, `GET/PATCH /profile/me/settings`, `POST/DELETE /profile/me/following/:id`, block, suggestions, search, report itd. (sve rute koje već postoje na NestJS).

3. **Use cases**
   - Sign-in/up/Google use case-ovi vraćaju `AppUser` (ili void, a korisnik se čita iz `currentUser`).
   - GetAuthStateUseCase vraća `Stream<AppUser?>`.
   - Ostali use case-ovi bez promene potpisa; implementacija ide kroz novi repository.

4. **AuthCubit**
   - State koristi `AppUser?` umesto `User?`.
   - Učitavanje profila (username, avatar) može ostati iz API-ja (GET profile/me) nakon uspešnog sign-in-a.
   - Greške: ukloniti `FirebaseAuthException`; koristiti generički tip ili jednostavan `AuthException` sa porukom/codom.

5. **Current user u celoj aplikaciji**
   - Ukloniti sve reference na `FirebaseAuth.instance.currentUser`.
   - Jedan izvor: `AuthRepository.currentUser` (AppUser?) ili `AuthCubit.state.user`.
   - Opciono: servis npr. `CurrentUserService` koji eksponuje `currentUser` iz repository-ja, registrovat u GetIt; svi ekrani koji treba userId koriste taj servis ili `context.read<AuthCubit>().state.user`.

6. **DI**
   - U GetIt zameniti `FirebaseAuthRepository` sa `BetterAuthApiRepository`.
   - BetterAuthApiRepository prima: base URL (env/config), Better Auth client (sa TokenStore), Dio (za API pozive, sa auth interceptorom). TokenStore i Dio mogu deliti isti token iz Better Auth session.

7. **Firebase**
   - Nakon migracije: ukloniti `firebase_auth`, `google_sign_in` iz auth toka (ostaviti samo ako još nešto koristi Firebase, npr. Firestore za nešto drugo dok se i to ne migrira).

---

## Better Auth na API-ju

- Rute: **`GET/POST .../auth/*`** (npr. `http://localhost:3001/auth/sign-in/email`, `.../auth/sign-up/email`, `.../auth/sign-out`, `.../auth/get-session`).
- Google: Better Auth OAuth flow; na mobilnom obično koristiš custom URL scheme / App Links i `signIn.social` sa providerom `google`.
- Sesija: cookie ili Bearer token (ako je na serveru uključen bearer plugin). Flutter client sa `better_auth_client` koristi TokenStore; token se šalje u headeru na sve zahteve ka API-ja (profile, tasks, itd.).

---

## Konfiguracija u Flutteru

- **API base URL**: npr. `http://10.0.2.2:3001` (Android emulator), `http://localhost:3001` (iOS simulator), ili env/build config za produkciju.
- Better Auth client: `baseUrl: "$baseUrl/auth"`, `tokenStore: MySecureTokenStore()`.
- Dio za API: `baseUrl`, interceptor koji u svaki zahtev dodaje `Authorization: Bearer <token>` iz TokenStore (ili cookie ako server to očekuje).

---

## Redosled implementacije

1. AppUser + izmena AuthRepository interfejsa (bez Firebase tipova).
2. TokenStore (secure storage) + Better Auth client + BetterAuthApiRepository (samo auth metode).
3. Dio + auth interceptor + metode u repository-ju za profile/settings/follow/block/search/suggestions/report (pozivi ka Nest API).
4. Use case-ovi i AuthCubit na AppUser; zameniti FirebaseAuthRepository sa BetterAuthApiRepository u DI.
5. Zameniti sve `FirebaseAuth.instance.currentUser` sa `AuthCubit.state.user` ili CurrentUserService.
6. Ukloniti `firebase_auth` i `google_sign_in` iz auth toka; testirati sign in, sign up, Google, sign out i zaštićene rute.
