# 🚀 Deploya appen så den är tillgänglig på internet

GitHub är bara för kod-lagring. För att appen ska vara tillgänglig på internet behöver du deploya den till en hosting-tjänst.

## Vercel (Rekommenderat - Gratis och enkelt)

Vercel är perfekt för Next.js-appar och är helt gratis för personliga projekt.

### Steg 1: Skapa konto
1. Gå till [vercel.com](https://vercel.com)
2. Klicka på "Sign Up"
3. Välj "Continue with GitHub" och logga in med ditt GitHub-konto

### Steg 2: Deploya projektet
1. Efter inloggning, klicka på "Add New..." > "Project"
2. Du kommer se alla dina GitHub-repositories
3. Hitta och välj `meanreverse`
4. Klicka på "Import"

### Steg 3: Konfigurera (Vercel gör detta automatiskt)
- **Framework Preset:** Next.js (detekteras automatiskt)
- **Root Directory:** `./` (lämna som det är)
- **Build Command:** `npm run build` (automatiskt)
- **Output Directory:** `.next` (automatiskt)

### Steg 4: Deploy!
1. Klicka på "Deploy"
2. Vänta 1-2 minuter medan Vercel bygger och deployar
3. **Klart!** 🎉

### Din URL kommer att vara:
```
https://meanreverse.vercel.app
```
eller
```
https://meanreverse-DITT-ANVÄNDARNAMN.vercel.app
```

Du kan ändra detta till ett eget domännamn senare om du vill!

---

## Netlify (Alternativ)

### Steg 1: Skapa konto
1. Gå till [netlify.com](https://netlify.com)
2. Klicka på "Sign up" och välj "GitHub"

### Steg 2: Deploya
1. Klicka på "Add new site" > "Import an existing project"
2. Välj GitHub och välj `meanreverse`
3. Konfigurera:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
4. Klicka på "Deploy site"

### Din URL kommer att vara:
```
https://meanreverse.netlify.app
```
eller ett slumpmässigt namn som:
```
https://random-name-12345.netlify.app
```

---

## Efter deployment

### Komma åt appen:
1. Öppna URL:en i webbläsaren
2. Du kommer att se login-sidan
3. Ange lösenordet: `mogoteshittarguld`
4. Nu är du inne i dashboarden!

### Automatiska uppdateringar:
- Varje gång du pushar till GitHub kommer appen automatiskt att uppdateras
- Inga extra steg behövs!

### Viktigt:
- **Lösenordet är:** `mogoteshittarguld`
- Appen är nu tillgänglig för alla som har URL:en och lösenordet
- För att göra den privatare kan du lägga till ytterligare säkerhetslager senare

---

## Testa lokalt först (valfritt)

Innan du deployar kan du testa lokalt:

```bash
npm install
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000) i webbläsaren.
