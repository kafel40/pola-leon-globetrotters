

## Wymuszenie polskiego języka na ekranie zgody Google

Dodanie parametru `hl=pl` do wywołania `signInWithOAuth` w komponencie `GoogleSignInButton`. To sprawi, ze ekran zgody Google bedzie wyswietlany po polsku.

### Co sie zmieni

Plik `src/components/auth/GoogleSignInButton.tsx` -- dodanie `extraParams: { hl: "pl" }` do wywolania:

```typescript
const { error } = await lovable.auth.signInWithOAuth('google', {
  redirect_uri: window.location.origin,
  extraParams: {
    hl: "pl",
  },
});
```

### Wazne informacje

- Zmiana dotyczy tylko kodu aplikacji -- nie wymaga zadnych dzialan po stronie Google Cloud Console
- Parametr `hl=pl` wymusza polski jezyk na ekranie zgody Google (przyciski, teksty informacyjne)
- Strona posrednia Lovable Cloud pozostanie bez zmian (po angielsku) -- to ograniczenie infrastruktury

