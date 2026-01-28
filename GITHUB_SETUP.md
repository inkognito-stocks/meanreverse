# Guide: Ladda upp till GitHub

Följ dessa steg för att ladda upp projektet till GitHub:

## 1. Skapa ett nytt repository på GitHub

1. Gå till [github.com](https://github.com)
2. Klicka på "+" i övre högra hörnet
3. Välj "New repository"
4. Ge ditt repository ett namn (t.ex. "mean-reverse-v2")
5. Välj "Private" om du vill hålla det privat
6. **Välj INTE** "Initialize with README" (vi har redan en)
7. Klicka på "Create repository"

## 2. Initiera Git i ditt projekt

Öppna terminalen i projektmappen och kör:

```bash
# Initiera git
git init

# Lägg till alla filer
git add .

# Skapa första commit
git commit -m "Initial commit: Mean Reverse Dashboard med lösenordsskydd"

# Byt till main branch
git branch -M main

# Lägg till GitHub remote (ersätt DITT-ANVÄNDARNAMN med ditt GitHub-användarnamn)
git remote add origin https://github.com/DITT-ANVÄNDARNAMN/meanreverse.git

# Push till GitHub
git push -u origin main
```

**Viktigt:** Ersätt `DITT-ANVÄNDARNAMN` med ditt faktiska GitHub-användarnamn i kommandot ovan.

Till exempel, om ditt GitHub-användarnamn är `mattias123`, blir kommandot:
```bash
git remote add origin https://github.com/mattias123/meanreverse.git
```

## 3. Verifiera att allt fungerar

1. Gå till ditt GitHub-repository
2. Kontrollera att alla filer är uppladdade
3. Klicka på "Code" för att se klonings-URL:en

## 4. Klona på annan dator (valfritt)

Om du vill klona projektet på en annan dator:

```bash
git clone https://github.com/DITT-ANVÄNDARNAMN/meanreverse.git
cd meanreverse
npm install
npm run dev
```

## 5. Deployment (Valfritt)

### Vercel (Rekommenderat för Next.js)

1. Gå till [vercel.com](https://vercel.com)
2. Logga in med GitHub
3. Klicka på "New Project"
4. Välj ditt repository
5. Vercel kommer automatiskt att upptäcka Next.js
6. Klicka på "Deploy"
7. Din app kommer att vara live på en URL som `ditt-projekt.vercel.app`

### Netlify

1. Gå till [netlify.com](https://netlify.com)
2. Logga in med GitHub
3. Klicka på "Add new site" > "Import an existing project"
4. Välj ditt repository
5. Build command: `npm run build`
6. Publish directory: `.next`
7. Klicka på "Deploy site"

## Viktigt

- **Lösenordet är hårdkodat i koden** (`app/login/page.tsx`). För produktion, överväg att använda miljövariabler.
- Alla filer utom `node_modules` och `.next` kommer att pushas till GitHub.
- Lösenordet är: `mogoteshittarguld`

## Uppdatera projektet

När du gör ändringar:

```bash
git add .
git commit -m "Beskrivning av ändringarna"
git push
```

Om du har deployat till Vercel/Netlify kommer ändringarna att deployas automatiskt!
