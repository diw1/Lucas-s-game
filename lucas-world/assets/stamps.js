(() => {
  const ink = '#513f31';
  const frame = (art) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" fill="none" aria-hidden="true" focusable="false"><g stroke="${ink}" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round">${art}</g></svg>`;

  const basket = `
    <g transform="rotate(-7 48 50)">
      <path d="M22 47c2-22 10-35 24-36 17-1 26 13 31 36l-6 1c-4-20-11-30-24-30-11 0-18 12-19 30Z" fill="#d89a54"/>
      <path d="M28 34l5 2m1-15 4 3m9-12v5m12-3-3 4m11 4-4 3m11 9-5 2" stroke-width="1.4" stroke="#885c37"/>
      <path d="M13 46q33-9 70 0l-7 29q-1 5-6 6-25 4-45-1-4-1-5-5Z" fill="#e1a150"/>
      <path d="M17 58q29 7 62 1m-60 8q27 7 58 1m-54 8q25 6 51 0" stroke="#925f32" stroke-width="2"/>
      <path d="M27 53l6 26m5-24 3 24m10-24v25m11-25-2 24m14-26-6 26" stroke="#875a32" stroke-width="2"/>
      <path d="M12 44q34-7 72 1l-2 9q-34 5-68-1Z" fill="#eab56c"/>
      <path d="M33 43q13-4 27-1l8 7-4 15-12-3-8 4-8-17-7-2Z" fill="#e36b57"/>
      <path d="M36 45l10 15m-1-17 11 17m-1-17 10 14m-25-7 19-6m-15 12 20-6m-15 11 15-5" stroke="#ffdfb2" stroke-width="2.5"/>
      <path d="M15 49l14-1m44 1h8" stroke="#fff0bd" stroke-width="1.9"/>
    </g>`;

  const cat = `
    <g transform="rotate(-5 48 52)">
      <path d="M23 83q-1-20 12-30l28-2q10 13 10 31-24 6-50 1Z" fill="#e8be83"/>
      <path d="M38 63q-12 9-9 19m33-18q8 8 6 17" stroke="#9a704b" stroke-width="1.8"/>
      <path d="M21 32q-3-14 0-24 10 2 20 15 8-2 16 0L72 8q5 6 4 24 7 8 6 18-3 16-26 20-19 4-32-6-16-11-9-23Z" fill="#f7d9a8"/>
      <path d="M22 27l1-14 12 11m26 1 10-12 2 15" fill="#ac7656" stroke-width="1.7"/>
      <path d="M25 24l1-5 5 5m34 0 4-6v6" stroke="#eeac93" stroke-width="2.2"/>
      <path d="M22 35q6-9 15-8 8 1 8 9-2 11-13 13-11 0-10-7Z" fill="#aa805d" stroke="none"/>
      <path d="M56 31q5-7 12-4 10 5 8 12-3 9-10 10-11-2-10-18Z" fill="#a9805d" stroke="none"/>
      <path d="M27 42q4-8 10-3m22 0q5-6 10 1" stroke-width="3.3"/>
      <path d="M44 45q4-3 9-1l-4 5Z" fill="#a76255" stroke-width="1.8"/>
      <path d="M49 49q-1 7-8 4m8-5q2 8 8 4m-34-3L9 45m14 9-14 1m64-7 13-6m-13 11 15-1" stroke-width="1.7"/>
      <path d="M29 63q18 10 36-1l-5 12-12 6-13-9Z" fill="#edb646"/>
      <path d="M55 69q8 0 14 5l-4 4-7-4" fill="#e3a13a" stroke-width="2"/>
    </g>`;

  const bee = `
    <g transform="rotate(-14 47 49)">
      <path d="M39 42Q22 28 28 15q4-7 12-1 10 8 10 27Z" fill="#f9edce"/>
      <path d="M47 41q2-22 15-25 9-1 9 6-1 13-18 23Z" fill="#d6e9d6"/>
      <path d="M37 23q6 8 9 17m17-16-11 15" stroke="#9cae91" stroke-width="1.5"/>
      <path d="M18 49L9 54l10 4m12 11-3 7m17-5-1 7m14-9 2 6" stroke-width="2.4"/>
      <path d="M15 51q1-14 16-18 18-6 32 6 8 9 5 20-7 17-30 15-18-2-23-14Z" fill="#f1b73e"/>
      <path d="M29 34q-13 16-6 35l7 3q-6-22 8-39-4-1-9 1Zm20-1q-13 18-11 41l10-1q-3-20 10-36Z" fill="#514638" stroke-width="1.5"/>
      <path d="M61 37q4-12 1-17m10 21q8-12 13-13" stroke-width="2.5"/>
      <circle cx="62" cy="20" r="2.3" fill="#514638"/><circle cx="85" cy="28" r="2" fill="#514638"/>
      <path d="M55 47q3-10 13-10 13 1 15 13 1 13-11 17-16 3-18-9Z" fill="#f4bf4f"/>
      <path d="M64 49v3m12-4v3" stroke-width="3.5"/>
      <path d="M68 56q3 4 6 0" stroke-width="1.8"/>
      <path d="M57 56l4 1m16-2 3-1" stroke="#dd8662" stroke-width="2.7"/>
    </g>`;

  const apple = `
    <g transform="rotate(8 48 48)">
      <path d="M47 30q-3-14 5-23l5 2q-8 10-6 22Z" fill="#976540"/>
      <path d="M49 26Q31 28 22 12q16-7 27 9Z" fill="#76a260"/>
      <path d="M27 15q11 1 18 8" stroke="#486f48" stroke-width="1.5"/>
      <path d="M48 31q12-10 25-5 16 7 14 26-2 18-16 31-8 8-18 3-5-3-10 0-12 5-21-8-13-18-12-35 1-14 14-18 12-4 24 6Z" fill="#db5b44"/>
      <path d="M78 38q5 24-16 39-7 4-14 2 13 9 22 1 15-13 15-30-1-8-7-12Z" fill="#ba4c3e" stroke="none"/>
      <path d="M23 43q2-9 10-10m-12 16 1 4" stroke="#f9b28a" stroke-width="4"/>
      <path d="M42 33q7 4 15-1m8 40 4-3m-1 7 4-4" stroke="#9a533c" stroke-width="1.5"/>
    </g>`;

  const fruit = `
    <g transform="rotate(4 48 51)">
      <path d="M18 48q5-33 27-36 24-4 35 34l-6 2Q63 16 46 18 29 19 24 49Z" fill="#c48b4d"/>
      <path d="M19 50q-5-13 5-18 9-5 18 4 2 9-3 16Z" fill="#e4674e"/>
      <path d="M28 33q-1-7 2-9m-3 6q-8-1-8-7 7 0 10 5" fill="#7b9e52" stroke-width="1.7"/>
      <path d="M38 47q-4-11 6-16 9-4 17 5 5 7 0 16Z" fill="#edac3c"/>
      <path d="M48 32q-1-8 4-12 4 7-2 12Z" fill="#709958" stroke-width="1.5"/>
      <g fill="#926f93" stroke-width="2"><circle cx="65" cy="36" r="6"/><circle cx="75" cy="39" r="6"/><circle cx="60" cy="44" r="6"/><circle cx="70" cy="46" r="6"/><circle cx="77" cy="50" r="5"/></g>
      <path d="M64 31q1-9 10-12 0 8-8 12" fill="#729851" stroke-width="1.8"/>
      <path d="M13 47q33 5 69-1l-7 28-7 6q-21 4-41-1l-6-5Z" fill="#dba25b"/>
      <path d="M17 57q27 9 62 0m-59 9q25 7 56-1m-51 10q21 5 46 0m-46-23 7 26m5-25 3 26m10-26-1 26m15-27-5 27m14-28-5 24" stroke="#8c603a" stroke-width="1.8"/>
      <path d="M11 45q35 5 73-1l-2 8q-34 7-69 0Z" fill="#ecc07c"/>
      <path d="M24 47q9 2 17 1l-2 14-6-2-5 2Z" fill="#df725c" stroke-width="1.8"/>
      <path d="M29 49l2 10m3-9 1 8m-8-5h10m-8 4h9" stroke="#f7dbae" stroke-width="1.6"/>
    </g>`;

  const cake = `
    <g transform="rotate(-7 49 53)">
      <path d="M8 72q24-13 66-12l14 9q-2 9-33 14-36 6-46-4Z" fill="#82b6a2"/>
      <path d="M15 73q12 6 33 4m14-1 17-5" stroke="#f4e2aa" stroke-width="1.8"/>
      <path d="M20 40l49-13 8 7-2 34-52 6Z" fill="#edbb69"/>
      <path d="M22 60l53-9v7l-53 11Z" fill="#bd5c54" stroke-width="1.6"/>
      <path d="M21 49l53-11v9l-52 11Z" fill="#e18881" stroke-width="1.6"/>
      <path d="M19 40l38-21 19 14q3 5-1 9-3 3-7 0-2 5-6 3-3-1-4-3L27 51q-4 4-6 0Z" fill="#f5dfbd"/>
      <path d="M23 43l49-10M31 68l3-1m10-1 3-1m12-2 3-1" stroke="#c28c63" stroke-width="1.5"/>
      <path d="M49 23q-3-9 6-12 8-3 11 4 1 8-9 14-6-1-8-6Z" fill="#d8624c"/>
      <path d="M53 13l-3-4 6 1 2-6 3 6 6-1-3 5-6-2Z" fill="#779854" stroke-width="1.7"/>
      <path d="M53 18l1 2m5-4 1 2m-3 4 1 1" stroke="#ffe5b7" stroke-width="1.6"/>
    </g>`;

  const flower = `
    <g transform="rotate(10 48 48)">
      <path d="M47 51q1 20-7 35l-5-2q9-16 9-33Z" fill="#739054" stroke-width="2.3"/>
      <path d="M44 72q-16-3-20-16 13-1 21 12m0-5q8-17 23-17-2 13-23 19" fill="#81a662" stroke-width="2.2"/>
      <path d="M27 59l12 9m12-8 12-10" stroke="#577647" stroke-width="1.4"/>
      <path d="M45 29q-5-12 3-20 6-6 13 0 5 6 0 20 13-11 22-5 7 6 1 15-4 6-17 8 13 5 12 15-2 10-12 11-10 0-17-17-5 14-17 16-10 1-13-6-4-10 9-20-15-1-18-11-2-9 7-13 10-4 27 7Z" fill="#e99e9b"/>
      <path d="M48 25q1-8 5-12m11 22 10-5m-10 21 7 8m-30-6-8 9m-2-26-10-4" stroke="#cd7775" stroke-width="2.2"/>
      <path d="M38 36q3-9 12-8 13 1 14 13 0 10-11 14-11 3-16-5-5-7 1-14Z" fill="#e9b648"/>
      <path d="M44 38l1-1m9-1 1 1m-7 6 1 1m7 2 1 1m-13 0 1 1" stroke="#98733c" stroke-width="2.3"/>
    </g>`;

  const sun = `
    <g transform="rotate(-7 48 48)">
      <g stroke="#b78431" stroke-width="3.2"><path d="M47 3l1 11m10 2 5-10m4 18 10-9m-2 19 12-5m-8 15 13-1m-16 13 12 4m-19 7 10 9m-21-1 6 12m-18-10 1 14m-13-16-4 12m-9-20-10 8m4-19L5 62m9-16-11-1m16-12L8 27m19-6-7-9m18 5-3-12"/></g>
      <path d="M50 19q14 0 23 12 9 13 4 27-6 17-23 20-14 3-25-6-14-10-13-26 1-14 12-22 10-6 22-5Z" fill="#f3c755" stroke="#a37b38" stroke-width="2.6"/>
      <path d="M30 33q6-8 15-9m19 42-4 4m0-8-5 4" stroke="#dbad49" stroke-width="2"/>
      <path d="M31 46q3-6 8-2m15 0q5-5 9 0m-23 12q7 6 15-1" stroke="#776136" stroke-width="2.4"/>
      <path d="M26 53l5 1m33-3 4-1" stroke="#e89666" stroke-width="4.2"/>
    </g>`;

  const journal = `
    <g transform="rotate(-10 48 48)">
      <path d="M22 15q1-3 5-4l42-1q5 1 6 6l2 61q0 6-6 7l-43 1q-5 0-6-5Z" fill="#f0dab0"/>
      <path d="M25 72q-4 6 0 8l46-1m-41-3 39-1" stroke="#b19675" stroke-width="1.6"/>
      <path d="M22 16q1-4 6-5l40-1q5 0 5 6l2 54q0 5-5 5l-44 2q-5 0-5-5Z" fill="#659b87"/>
      <path d="M31 15v56" stroke="#4a7567" stroke-width="2.1"/>
      <path d="M35 27l30-1 1 23-31 1Z" fill="#f3ddaf" stroke-width="2"/>
      <path d="M41 34l17-1m-17 8 12-1" stroke="#94785a" stroke-width="1.8"/>
      <path d="M53 76l1 13 5-5 5 3-2-12" fill="#d46e54" stroke-width="2"/>
      <g stroke-width="2.8"><path d="M26 20q-11-7-11 1 0 4 6 4m5 8q-11-7-11 1 0 4 6 4m5 8q-11-7-11 1 0 4 6 4m5 8q-11-7-11 1 0 4 6 4"/></g>
    </g>`;

  const pencil = `
    <g transform="rotate(34 48 48)">
      <path d="M40 16q0-6 7-7l7 1q4 1 4 7l-1 11-17-1Z" fill="#e5a297"/>
      <path d="M40 25l17 1-1 45-9 16-8-17Z" fill="#dc7155"/>
      <path d="M40 67l5 3 4-3 6 3-8 17-8-17Z" fill="#edc797" stroke-width="2"/>
      <path d="M44 80l5 1-2 6Z" fill="#564838" stroke-width="1.4"/>
      <path d="M45 29l-1 37m8-36-1 35" stroke="#f1ab7d" stroke-width="2"/>
      <path d="M39 20l20 1-1 8-19-1Z" fill="#e1c99d" stroke-width="2"/>
      <path d="M43 24h11" stroke="#9f8970" stroke-width="1.4"/>
    </g>`;

  window.PicnicStamps = Object.freeze(Object.fromEntries(
    Object.entries({ basket, cat, bee, apple, fruit, cake, flower, sun, journal, pencil })
      .map(([name, art]) => [name, frame(art)])
  ));
})();
