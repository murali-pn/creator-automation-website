// tweaks.jsx — Tweaks island for the bold Pocketnori site.
// Sets brand CSS variables + headline accent word on the document.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentWord": "customers",
  "brand": ["#6D28D9", "#5B21B6", "#F1ECFD"]
}/*EDITMODE-END*/;

function applyTweaks(t) {
  document.body.setAttribute('data-accent-word', t.accentWord);
  const [main, dark, soft] = t.brand;
  const root = document.documentElement.style;
  root.setProperty('--brand', main);
  root.setProperty('--brand-dark', dark);
  root.setProperty('--brand-soft', soft);
  root.setProperty('--brand-tint', soft);
  root.setProperty('--accent', main);
}

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => { applyTweaks(t); }, [t]);

  return (
    <TweaksPanel>
      <TweakSection label="Brand color" />
      <TweakColor
        label="Accent"
        value={t.brand}
        options={[
          ["#6D28D9", "#5B21B6", "#F1ECFD"],
          ["#DB2777", "#BE185D", "#FCE7F3"],
          ["#2563EB", "#1D4ED8", "#E0EAFE"],
          ["#EF4D23", "#C2410C", "#FEE9E2"],
          ["#0D9488", "#0F766E", "#D9F2EF"]
        ]}
        onChange={(v) => setTweak('brand', v)}
      />
      <TweakSection label="Headline" />
      <TweakRadio
        label="Italic accent"
        value={t.accentWord}
        options={['customers', 'automatically', 'none']}
        onChange={(v) => setTweak('accentWord', v)}
      />
    </TweaksPanel>
  );
}

(function mountTweaks() {
  const el = document.createElement('div');
  document.body.appendChild(el);
  ReactDOM.createRoot(el).render(<TweaksApp />);
})();
