# Mean Reverse V2

Dashboard för mean reverse trading analys med streak-tracking och hit rate beräkningar. **Progressive Web App (PWA)** som fungerar på både mobil och dator.

## 🔒 Lösenordsskydd

Appen är lösenordsskyddad. Lösenordet krävs för att komma åt dashboarden.

## Projektstruktur

```
/types/stock.ts          <- Datatyper (DailyData, StreakAnalysis)
/lib/calculations.ts     <- Logikmotor (Streaks + Hit Rate)
/lib/googleFinance.ts    <- Hämtar data från Google Finance
/components/Dashboard.tsx <- UI-komponenter (Dark mode, Responsiv)
/components/LogoutButton.tsx <- Logout-knapp
/app/page.tsx            <- Huvudsidan
/app/login/page.tsx      <- Login-sida
/app/manifest.ts         <- PWA Manifest
/middleware.ts           <- Autentiseringsmiddleware
/public/sw.js            <- Service Worker
/public/manifest.json     <- PWA Manifest (JSON)
```

## Installation

```bash
npm install
```

## Utveckling

```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000) i din webbläsare.

Du kommer automatiskt att omdirigeras till login-sidan om du inte är inloggad.

## Deployment till GitHub

1. Skapa ett nytt repository på GitHub
2. Initiera git i projektet:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/DITT-ANVÄNDARNAMN/DITT-REPO-NAMN.git
   git push -u origin main
   ```

3. För att deploya till Vercel/Netlify:
   - Koppla GitHub-repot till Vercel/Netlify
   - Välj Next.js som framework
   - Deploy automatiskt vid push

## PWA-installation

### På mobil (Android/iOS):
1. Öppna appen i webbläsaren
2. Logga in med lösenordet
3. Klicka på "Lägg till på startskärmen" / "Add to Home Screen"
4. Appen installeras som en PWA

### På dator:
1. Öppna appen i Chrome/Edge
2. Logga in med lösenordet
3. Klicka på install-ikonen i adressfältet
4. Eller gå till Inställningar > Appar > Installera app

## Ikoner

För produktion, ersätt placeholder-ikonerna i `/public/`:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

Du kan använda:
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- Eller skapa manuellt från `icon.svg`

## Datahämtning

Projektet använder Google Finance / Yahoo Finance API för att hämta aktiedata:

- **`lib/googleFinance.ts`**: Funktioner för att hämta historisk data och aktuell info
- **`app/api/finance/route.ts`**: API route för client-side requests (hanterar CORS)
- **`app/page.tsx`**: Huvudsidan som hämtar data från Google Finance och analyserar aktier

Data hämtas automatiskt för svenska Large Cap-aktier när sidan laddas.

## Funktioner

- **Lösenordsskydd**: Skyddad med lösenord för säker åtkomst
- **Streak Analysis**: Beräknar nuvarande nedgångsstreak för varje aktie
- **Hit Rate**: Historisk sannolikhet för vändning efter X röda dagar
- **Volymfilter**: Filtrerar bort illikvida aktier (min 1M SEK omsättning/20d)
- **Dark Mode UI**: Modern dashboard med Tailwind CSS
- **Responsiv Design**: Fungerar perfekt på både mobil och dator
- **PWA**: Kan installeras som app, fungerar offline (begränsat)

## Offline-stöd

Service Worker cachar grundläggande resurser för offline-användning. För full offline-funktionalitet behöver du implementera mer avancerad caching-strategi.
