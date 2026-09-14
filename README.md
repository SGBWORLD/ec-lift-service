# EC Lift Service — PWA setup

This turns the single-file app into an installable Android/iPhone app with real
cross-device sync (technician phone ↔ back office dashboard), at zero recurring cost.

Two things you need to do once: **(A) create a free Firebase project** so all
devices share live data, and **(B) host the files somewhere** so there's a link
to install from. Both are free.

## A. Create your free Firebase project (~5 minutes)

1. Go to https://console.firebase.google.com and sign in with any Google account.
2. Click **Add project** → name it (e.g. `ec-lift-service`) → keep default settings → **Create project**.
3. In the left sidebar, click **Build → Firestore Database** → **Create database** →
   choose a location close to Bahrain (e.g. `europe-west` or `me-central1` if offered) → start in **production mode**.
4. Once created, go to the **Rules** tab of Firestore and replace the contents with
   what's in `firestore.rules` in this folder → **Publish**.
5. Back in the project overview, click the **web icon (</>)** to register a web app →
   name it anything → **Register app**. Firebase will show a code block with a
   `firebaseConfig` object — copy those 6 values (`apiKey`, `authDomain`, `projectId`,
   `storageBucket`, `messagingSenderId`, `appId`).
6. Open `EC_Lift_Service_App.html`, find the `firebaseConfig` block near the top of
   the `<script>` section, and paste your real values in place of the `YOUR_...` placeholders.

Once that's saved, every phone that opens the app will read and write the same
shared data — that's what makes technician and back-office views sync live.

## B. Host the files (pick one — both are free)

**Easiest: GitHub Pages**
1. Create a free GitHub account if you don't have one, and a new repository (e.g. `ec-lift-service`).
2. Upload all the files in this folder (`EC_Lift_Service_App.html`, `manifest.json`,
   `service-worker.js`, `icons/`) to the repository — keep the same folder structure.
3. In the repo, go to **Settings → Pages** → set source to the `main` branch, root folder → **Save**.
4. GitHub gives you a link like `https://yourname.github.io/ec-lift-service/EC_Lift_Service_App.html` —
   that's the link technicians and office staff will open.

## C. Install it like an app

On an Android phone, open that link in Chrome → tap the **⋮ menu → Add to Home screen**.
It installs with the EC icon and opens full-screen, no browser bar — same as a Play Store app,
just without the Play Store step. Works the same way on iPhone Safari (Share → Add to Home Screen).

## Notes & honest limits

- **No real login security.** The name + PIN screen is a courtesy check, not authentication —
  see the note in `firestore.rules`. Fine for an internal team tool; don't put anything
  sensitive behind it.
- **Offline**: the app shell (screens, styling) loads instantly even with no signal, thanks to
  the service worker. Firestore also queues writes made while offline and syncs them once the
  phone reconnects — handy in machine rooms/pits with poor signal.
- **Photos** are stored per-job in their own Firestore documents (not crammed into one big file),
  so there's no realistic size limit from normal day-to-day use.
- **Job numbers** (`JOB-001`, `JOB-002`...) increment from a shared counter. If two technicians
  create a brand-new job at the exact same moment while both offline, there's a small chance of
  a duplicate number — rare for a small team, and easy to spot/rename if it ever happens.
