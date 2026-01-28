# PWA Ikoner

För att appen ska fungera korrekt som PWA behöver du skapa ikoner i följande storlekar:

## Nödvändiga ikoner

- `public/icon-192.png` - 192x192 pixels
- `public/icon-512.png` - 512x512 pixels

## Hur du skapar ikoner

### Alternativ 1: Använd RealFaviconGenerator (Rekommenderat)
1. Gå till https://realfavicongenerator.net/
2. Ladda upp `public/icon.svg` eller en annan bild
3. Generera ikoner för alla plattformar
4. Ladda ner och ersätt filerna i `public/`

### Alternativ 2: Använd PWA Asset Generator
```bash
npx pwa-asset-generator public/icon.svg public/ --icon-only
```

### Alternativ 3: Skapa manuellt
1. Öppna `public/icon.svg` i en bildredigerare
2. Exportera som PNG i storlekarna 192x192 och 512x512
3. Spara som `icon-192.png` och `icon-512.png` i `public/`

## Temporär lösning

Tills ikonerna är skapade kommer appen att fungera, men med placeholder-ikoner.
