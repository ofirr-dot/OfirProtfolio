<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="תיק Ofir">
<meta name="mobile-web-app-capable" content="yes">
<!-- ✅ v11.6.0.0: PWA — אייקון אמיתי במסך הבית (iOS) + manifest להתקנה כאפליקציה (Android) -->
<link rel="apple-touch-icon" sizes="180x180" href="https://base44.app/api/apps/6a842d761d7eee2c44efba6d/files/mp/public/6a842d761d7eee2c44efba6d/7d8be1e26_icon-180.png">
<link rel="apple-touch-icon" sizes="192x192" href="https://base44.app/api/apps/6a842d761d7eee2c44efba6d/files/mp/public/6a842d761d7eee2c44efba6d/6d15ed61f_icon-192.png">
<link rel="manifest" href='data:application/manifest+json,{"name":"תיק Ofir","short_name":"תיק Ofir","description":"מעקב תיק השקעות אישי","display":"standalone","start_url":".","background_color":"%230a0e1a","theme_color":"%232D5BFF","icons":[{"src":"https://base44.app/api/apps/6a842d761d7eee2c44efba6d/files/mp/public/6a842d761d7eee2c44efba6d/6d15ed61f_icon-192.png","sizes":"192x192","type":"image/png"},{"src":"https://base44.app/api/apps/6a842d761d7eee2c44efba6d/files/mp/public/6a842d761d7eee2c44efba6d/43da92337_icon-512.png","sizes":"512x512","type":"image/png"},{"src":"https://base44.app/api/apps/6a842d761d7eee2c44efba6d/files/mp/public/6a842d761d7eee2c44efba6d/cab8088d8_icon-maskable-512.png","sizes":"512x512","type":"image/png","purpose":"maskable"}]}'>
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#FFFFFF">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0a0e1a">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%232D5BFF'/%3E%3Ctext x='50' y='68' font-size='52' font-weight='900' fill='white' text-anchor='middle' font-family='Arial'%3E%E2%82%AA%3C/text%3E%3C/svg%3E">
<title>תיק השקעות | Ofir</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;900&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root {--bg:#F0F2F8;--bg2:#FFFFFF;--bg3:#EEF3FF;--card:#FFFFFF;
  --border:#E0E6F2;--border2:#C8D5F0;--text:#0F1729;--muted:#5A6B92;--muted2:#94A3C0;
  --blue:#2D5BFF;--blue2:#1A47E0;--blue-light:#EAF1FF;
  --green:#00A862;--green-light:#E6F9F0;
  --red:#E8394A;--red-light:#FEF0F2;
  --yellow:#F5A623;--yellow-light:#FFF7E6;
  --purple:#7C5CFC;--purple-light:#F2EFFE;
  --cyan:#00B8D9;
  --shadow:0 2px 8px rgba(45,91,255,0.08),0 8px 24px rgba(45,91,255,0.08);
  --shadow-sm:0 1px 3px rgba(15,23,41,0.08);
  --shadow-lg:0 4px 16px rgba(45,91,255,0.12),0 12px 40px rgba(45,91,255,0.08);}
html.dark {--bg:#0A0D14;--bg2:#121620;--bg3:#1A1F2E;--card:#1A1F2E;
  --border:#252D3F;--border2:#324056;--text:#F0F4FB;--muted:#8B9BB8;--muted2:#5E6F8E;
  --blue-light:rgba(59,111,232,0.18);--green-light:rgba(12,175,96,0.15);
  --red-light:rgba(232,57,74,0.15);--yellow-light:rgba(245,166,35,0.15);
  --purple-light:rgba(124,92,252,0.15);
  --shadow:0 1px 3px rgba(0,0,0,0.4),0 4px 20px rgba(0,0,0,0.25);
  --shadow-sm:0 1px 2px rgba(0,0,0,0.3);
  --shadow-lg:0 4px 16px rgba(59,111,232,0.15),0 12px 40px rgba(0,0,0,0.3)}
html.dark .card {background:rgba(26,31,46,0.65);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-color:rgba(45,91,255,0.1)}
html.dark .kpi {background:rgba(26,31,46,0.7);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(45,91,255,0.15)}
html.dark .kpi:hover {box-shadow:var(--shadow-lg),0 0 20px rgba(45,91,255,0.1);border-color:rgba(59,111,232,0.4)}
html.dark .kpi-icon {width:56px;height:56px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:8px;flex-shrink:0}
html.dark .table-wrap {background:var(--card);border-color:var(--border)}
html.dark tr:hover {background:rgba(59,111,232,0.06)}
html.dark .header {background:rgba(10,13,20,0.8);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-color:rgba(45,91,255,0.1)}
html.dark .m-tile {background:linear-gradient(135deg,var(--card) 0%,#121721 100%)}
html.dark .m-tile:active {border-color:rgba(59,111,232,0.4)}
html.dark .cash-hero {box-shadow:0 8px 40px rgba(45,91,255,0.25)}
html.dark .btn-refresh {display:flex;align-items:center;gap:8px;padding:14px 24px;border-radius:16px;border:none;background:linear-gradient(135deg,var(--blue) 0%,var(--blue2) 100%);color:#fff;font-size:18px;font-weight:700;font-family:Heebo,sans-serif;cursor:pointer;box-shadow:0 4px 16px rgba(45,91,255,0.3);transition:all 0.2s;-webkit-tap-highlight-color:transparent}.btn-refresh:hover{box-shadow:0 6px 24px rgba(45,91,255,0.4);transform:translateY(-1px)}
html.dark .bottom-nav {background:rgba(18,22,32,0.95);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-color:var(--border)}
html.dark .sec::after {background:linear-gradient(90deg,var(--border) 0%,transparent 100%)}
html.dark .search-bar {background:rgba(18,22,32,0.85);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}
body {background:var(--bg);color:var(--text);font-family:'Heebo',sans-serif;min-height:100vh;direction:rtl;padding-bottom:calc(72px + env(safe-area-inset-bottom));overflow-x:hidden;-webkit-text-size-adjust:100%;text-size-adjust:100%}
.mono {font-family:'JetBrains Mono',monospace}
.hist-periods {display:flex;gap:8px;margin-bottom:1rem;flex-wrap:wrap}
.hist-period-btn {padding:8px 16px;border-radius:10px;border:1px solid var(--border);background:var(--bg3);color:var(--muted);font-family:'Heebo',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.18s;-webkit-tap-highlight-color:transparent}
.hist-period-btn:hover {border-color:var(--blue);color:var(--text)}
.hist-period-btn.active {background:var(--blue);color:#fff;border-color:var(--blue)}


/* ══════ Mobile Touch Optimization ══════ */
*{ -webkit-tap-highlight-color: transparent; }

button,a,.m-tile,.tab,.kpi,.card {background:rgba(255,255,255,0.65);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.4);border-radius:20px;padding:24px;margin-bottom:1rem;box-shadow:var(--shadow-sm)}
/* ✅ v11.6.1.3: תיקון "ניפוח טקסט" של אנדרואיד כרום (Font Boosting) — כרום מנפח טקסט
   במיכלים צרים כשה"מותאם למחשב" כבוי, מה שגרם למספרים לגלוש מהמסך. text-size-adjust:100%
   על html+body+כל אלמנט (עם !important) מבטל את הניפוח לצמיתות; overflow-x:hidden כרשת ביטחון. */
html {touch-action: manipulation; -webkit-text-size-adjust: 100% !important; text-size-adjust: 100% !important; overflow-x: hidden;}
* {-webkit-text-size-adjust: 100% !important; text-size-adjust: 100% !important;}
input,textarea {-webkit-user-select: text; user-select: text;}


/* ══════ Bottom Nav (mobile only) ══════ */

.bottom-nav {position:fixed;bottom:0;left:0;right:0;background:var(--bg2);border-top:1px solid var(--border);display:flex;justify-content:space-around;z-index:200;padding:10px 4px calc(10px + env(safe-area-inset-bottom));box-shadow:0 -2px 20px rgba(0,0,0,0.08)}
.bottom-nav-item {display:flex;flex-direction:column;align-items:center;gap:5px;padding:8px 10px;border-radius:12px;cursor:pointer;color:var(--muted);font-size:13px;font-weight:700;min-width:60px;-webkit-tap-highlight-color:transparent;transition:color 0.15s,transform 0.1s}
.bottom-nav-item:active {transform:scale(0.92)}
.bottom-nav-item.active {color:var(--blue)}
.bottom-nav-icon {font-size:26px;line-height:1}

@media(min-width:769px){.bottom-nav{display:none !important}}
@media(max-width:768px){body.has-bottomnav{padding-bottom:64px}}


.search-bar {position:sticky;top:96px;z-index:95;background:var(--bg2);border-bottom:1px solid var(--border);padding:10px 1.5rem;display:flex;align-items:center;gap:10px;transition:opacity 0.2s,transform 0.2s}
.search-bar.hidden {opacity:0;transform:translateY(-100%);pointer-events:none;height:0;padding:0;overflow:hidden;border:none}
.search-input {flex:1;max-width:400px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:10px 16px;font-family:'Heebo',sans-serif;font-size:15px;color:var(--text);outline:none;transition:border 0.2s,box-shadow 0.2s}
.search-input:focus {border-color:var(--blue);box-shadow:0 0 0 3px rgba(45,91,255,0.15)}
.search-input::placeholder {color:var(--muted)}
.search-clear {width:36px;height:36px;border-radius:10px;border:1px solid var(--border);background:var(--bg3);color:var(--muted);cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;-webkit-tap-highlight-color:transparent;flex-shrink:0}
.search-clear:active {background:var(--bg2)}
.search-count {font-size:13px;color:var(--muted);white-space:nowrap;flex-shrink:0}


.header {background:rgba(255,255,255,0.75);border-bottom:1px solid rgba(255,255,255,0.3);padding:0 2.5rem;height:110px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;box-shadow:var(--shadow-sm);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}
.logo {font-size:3rem;font-weight:900;background:linear-gradient(135deg,var(--text) 0%,var(--blue) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:-1px}
.logo em{color:var(--blue);font-style:normal}

.header-right {display:flex;align-items:center;gap:14px}
.btn-theme {width:64px;height:64px;border-radius:16px;border:1px solid var(--border);background:var(--bg3);cursor:pointer;font-size:30px;display:flex;align-items:center;justify-content:center;transition:all 0.2s;-webkit-tap-highlight-color:transparent}.btn-theme:hover{border-color:var(--blue);box-shadow:0 2px 12px rgba(45,91,255,0.15)}
.btn-theme:active {background:var(--blue-light)}
.pill {display:flex;align-items:center;gap:10px;font-size:18px;font-weight:600;padding:10px 20px;border-radius:28px;border:1px solid}
.pill-green {color:var(--green);background:var(--green-light);border-color:rgba(12,175,96,0.2)}
.pill-red {color:var(--red);background:var(--red-light);border-color:rgba(232,57,74,0.2)}
.dot {width:8px;height:8px;border-radius:50%;background:currentColor;animation:blink 2s infinite}

@keyframes blink{0%,100%{opacity:1}50%{opacity:0.25}}

.clock {font-size:18px;color:var(--muted);font-family:'JetBrains Mono',monospace}
.ver-badge {font-size:13px;font-weight:700;font-family:'JetBrains Mono',monospace;color:var(--muted);background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:4px 10px;cursor:pointer;letter-spacing:0.5px;white-space:nowrap}
.btn-refresh {display:flex;align-items:center;gap:8px;padding:14px 24px;border-radius:16px;border:none;background:linear-gradient(135deg,var(--blue) 0%,var(--blue2) 100%);color:#fff;font-size:18px;font-weight:700;font-family:Heebo,sans-serif;cursor:pointer;box-shadow:0 4px 16px rgba(45,91,255,0.3);transition:all 0.2s;-webkit-tap-highlight-color:transparent}.btn-refresh:hover{box-shadow:0 6px 24px rgba(45,91,255,0.4);transform:translateY(-1px)}
.btn-refresh:hover {background:var(--blue2);transform:translateY(-1px)}
.btn-refresh:active{transform:translateY(0)}

.btn-refresh.spinning svg {animation:spin 0.7s linear infinite}

@keyframes spin{to{transform:rotate(360deg)}}

.tabs {flex-wrap:wrap;display:flex;gap:6px;padding:0 2rem;border-bottom:1px solid var(--border);overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.tab {padding:14px 22px;font-size:18px;font-weight:600;color:var(--muted);border:none;background:none;cursor:pointer;white-space:nowrap;border-radius:12px 12px 0 0;transition:all 0.15s;-webkit-tap-highlight-color:transparent}
.tab:hover:not(.active) {color:var(--text)}
.tab.active{color:var(--blue);border-bottom-color:var(--blue);font-weight:600}

.content {padding:2rem;display:none}.content.active{display:block;animation:tabSlideIn 0.35s cubic-bezier(0.16,1,0.3,1)}
.content.active{display:block}
@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes tabSlideIn{from{opacity:0;transform:translateY(12px) scale(0.99)}to{opacity:1;transform:translateY(0) scale(1)}}

.kpi-grid {display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.25rem;margin-bottom:1.5rem}
.kpi {background:rgba(255,255,255,0.7);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.5);border-radius:20px;padding:24px 22px;display:flex;flex-direction:column;gap:6px;position:relative;overflow:hidden;transition:all 0.3s;box-shadow:var(--shadow-sm)}.kpi:hover{transform:translateY(-3px);box-shadow:var(--shadow-lg);border-color:rgba(45,91,255,0.3)}
.kpi:hover {box-shadow:var(--shadow-lg);transform:translateY(-2px)}
.kpi-icon {width:56px;height:56px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:8px;flex-shrink:0}
.kpi-label {font-size:15px;font-weight:600;color:var(--muted);margin-bottom:4px;letter-spacing:0.3px}
.kpi-value {font-size:2.5rem;font-weight:900;font-family:JetBrains Mono,monospace;line-height:1.1;letter-spacing:-1px}
.kpi-sub {font-size:14px;color:var(--muted);margin-top:4px;font-weight:500}
.badge-delta {display:inline-flex;align-items:center;gap:3px;font-size:12px;font-weight:600;padding:3px 9px;border-radius:20px;margin-top:8px}
.up {background:var(--green-light);color:var(--green)}
.dn{background:var(--red-light);color:var(--red)}

.pos {color:var(--green);font-weight:600}
.neg{color:var(--red);font-weight:600}

.sec {font-size:18px;font-weight:700;color:var(--text);margin:1.75rem 0 1rem;letter-spacing:0.5px;position:relative;padding-bottom:8px}.sec::after{content:"";position:absolute;bottom:0;right:0;width:60px;height:3px;background:linear-gradient(90deg,var(--blue),transparent);border-radius:3px}
.sec::after {content:'';flex:1;height:1px;background:var(--border)}
.card {background:rgba(255,255,255,0.65);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.4);border-radius:20px;padding:24px;margin-bottom:1rem;box-shadow:var(--shadow-sm)}
.card-head {display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem}
.card-title {font-size:14px;font-weight:600;color:var(--text)}
.card-sub{font-size:12px;color:var(--muted)}

.table-wrap {background:var(--card);border:1px solid var(--border);border-radius:16px;overflow:hidden;margin-bottom:1.5rem;box-shadow:var(--shadow-sm);overflow-x:auto;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain}
table {width:100%;border-collapse:collapse;font-size:16px}
thead tr {background:var(--bg3)}
th {padding:16px 18px;text-align:right;font-size:13px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.8px;white-space:nowrap;position:sticky;top:0;z-index:2;background:var(--bg2)}
td {padding:16px 18px;font-size:16px;border-bottom:1px solid var(--border);white-space:nowrap}
tr:hover td {background:var(--blue-light)}
.chip {display:inline-block;padding:3px 9px;border-radius:6px;font-size:11px;font-weight:600}
.chip-blue {background:var(--blue-light);color:var(--blue)}
.chip-green{background:var(--green-light);color:var(--green)}.chip-purple{background:var(--purple-light);color:var(--purple)}

.pie-grid {display:grid;grid-template-columns:200px 1fr;gap:2rem;align-items:center}
.leg-list {display:flex;flex-direction:column;gap:8px}
.leg-row {display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text)}
.leg-sq {width:10px;height:10px;border-radius:3px;flex-shrink:0}
.leg-pct {font-size:11px;color:var(--muted);font-family:'JetBrains Mono',monospace;margin-right:auto}
.alloc-row {margin-bottom:14px}
.alloc-lbl {display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px;color:var(--text)}
.alloc-lbl span:last-child {font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--muted)}
.bar-bg {background:var(--bg3);border-radius:6px;height:8px;overflow:hidden}
.bar-fg{height:8px;border-radius:6px;transition:width 1s cubic-bezier(.4,0,.2,1)}

.cash-hero {background:linear-gradient(135deg,var(--blue) 0%,#5B8FFF 100%);border-radius:20px;padding:2rem 2.25rem;margin-bottom:1.5rem;color:#fff;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;box-shadow:0 8px 30px rgba(45,91,255,0.3)}
.cash-hero-title {font-size:14px;font-weight:700;opacity:0.85;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px}
.cash-hero-val {font-size:2.6rem;font-weight:900;font-family:'JetBrains Mono',monospace;line-height:1}
.cash-hero-sub{font-size:14px;opacity:0.8;margin-top:6px}

.cash-grid {display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;margin-bottom:1.5rem grid-template-columns:repeat(auto-fit,minmax(150px,1fr))}
.cash-card {background:var(--card);border:1px solid var(--border);border-radius:14px;padding:1.25rem;box-shadow:var(--shadow-sm);border-right:3px solid var(--blue)}
.cash-card.ils {border-right-color:var(--green)}
.cash-inst {font-size:14px;font-weight:700;color:var(--text);margin-bottom:2px}
.cash-acc{font-size:11px;color:var(--muted);margin-bottom:12px}

.cash-amt {font-family:'JetBrains Mono',monospace;font-size:1.3rem;font-weight:700;color:var(--blue)}
.cash-card.ils .cash-amt {color:var(--green)}
.cash-fx{font-size:11px;color:var(--muted);margin-top:4px}

.loading {display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4rem;gap:1rem;color:var(--muted)}
.spinner {width:32px;height:32px;border:3px solid var(--border);border-top-color:var(--blue);border-radius:50%;animation:spin 0.8s linear infinite}
.error-box {background:var(--red-light);border:1px solid rgba(232,57,74,0.2);border-radius:12px;padding:1.5rem;color:var(--red);text-align:center}
.footer {display:none !important}
.m-screen {display:flex;flex-direction:column;padding:12px 14px calc(28px + env(safe-area-inset-bottom));gap:12px;overflow-y:auto;-webkit-overflow-scrolling:touch;box-sizing:border-box;min-height:calc(100vh - 72px)}
.m-hero {background:linear-gradient(135deg,#2D5BFF 0%,#5B8FFF 100%);border-radius:24px;padding:1.75rem 1.75rem 1.5rem;color:#fff;cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:0 8px 30px rgba(45,91,255,0.3)}
.m-hero:active {opacity:0.93;transform:scale(0.98)}
.m-hero-label {font-size:16px;font-weight:800;opacity:0.75;text-transform:uppercase;letter-spacing:1.4px;margin-bottom:10px}
.m-hero-val {font-size:clamp(3.2rem,16vw,4.5rem);font-weight:900;font-family:'JetBrains Mono',monospace;line-height:1.0}
.m-hero-sub {font-size:24px;margin-top:12px;font-weight:800}
.m-hero-sub.pos{color:#7FFFB8}.m-hero-sub.neg{color:#FFB3B3}

.m-hero-rate {font-size:17px;opacity:0.65;margin-top:8px}
.m-tiles {display:flex;flex-direction:column;gap:14px}
.m-tile {background:var(--card);border:1px solid var(--border);border-right:8px solid var(--accent,var(--blue));border-radius:24px;padding:32px 28px 32px 24px;display:flex;flex-direction:row;align-items:center;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform 0.12s,opacity 0.12s;position:relative;gap:24px;min-height:160px;box-shadow:var(--shadow-sm)}
.m-tile:active {transform:scale(0.98);opacity:0.9}
.m-tile-icon-circle {width:100px;height:100px;border-radius:24px;background:var(--tile-bg,var(--blue-light));display:flex;align-items:center;justify-content:center;font-size:56px;flex-shrink:0}
.m-tile-body {flex:1;display:flex;flex-direction:column;gap:6px;min-width:0}
.m-tile-label {font-size:21px;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;line-height:1.2}
.m-tile-val {font-size:clamp(3rem,14vw,4rem);font-weight:900;font-family:'JetBrains Mono',monospace;color:var(--accent,var(--blue));line-height:1.0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.m-tile-sub {font-size:20px;color:var(--muted);line-height:1.3;font-weight:600}
.m-tile-badge {font-size:24px;font-weight:900;line-height:1.4}
.m-tile-badge.pos{color:var(--green)}.m-tile-badge.neg{color:var(--red)}

.m-tile-arrow {font-size:48px;color:var(--muted2);flex-shrink:0;line-height:1}
html.is-mobile .kpi-grid {display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.25rem;margin-bottom:1.5rem}
html.is-mobile .kpi {background:rgba(255,255,255,0.7);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.5);border-radius:20px;padding:24px 22px;display:flex;flex-direction:column;gap:6px;position:relative;overflow:hidden;transition:all 0.3s;box-shadow:var(--shadow-sm)}.kpi:hover{transform:translateY(-3px);box-shadow:var(--shadow-lg);border-color:rgba(45,91,255,0.3)}
html.is-mobile .kpi-icon {width:84px !important;height:84px !important;border-radius:22px !important;font-size:44px !important;margin-bottom:0 !important;flex-shrink:0 !important;display:flex !important;align-items:center !important;justify-content:center !important}
html.is-mobile .kpi-label {font-size:19px !important;font-weight:800 !important;letter-spacing:0.4px !important;margin-bottom:5px !important;text-transform:uppercase !important}
html.is-mobile .kpi-value {font-size:2.5rem;font-weight:900;font-family:JetBrains Mono,monospace;line-height:1.1;letter-spacing:-1px}
html.is-mobile .kpi-sub {font-size:18px !important;margin-top:5px !important}
html.is-mobile .badge-delta {font-size:18px !important;padding:6px 16px !important;margin-top:7px !important}
html.is-mobile .cash-hero-val {font-size:3rem !important}
html.is-mobile .cash-grid {display:flex !important;flex-direction:column !important;gap:10px !important}
html.is-mobile .cash-card {padding:22px !important;border-radius:20px !important;border-right:7px solid var(--blue) !important}
html.is-mobile .alloc-lbl {font-size:18px !important;margin-bottom:10px !important}
html.is-mobile .bar-bg {height:14px !important;border-radius:8px !important}
html.is-mobile .sec {font-size:18px;font-weight:700;color:var(--text);margin:1.75rem 0 1rem;letter-spacing:0.5px;position:relative;padding-bottom:8px}.sec::after{content:"";position:absolute;bottom:0;right:0;width:60px;height:3px;background:linear-gradient(90deg,var(--blue),transparent);border-radius:3px}
html.is-mobile #mobile-detail-body {padding:1.5rem !important}
.m-back-bar {background:var(--bg2);padding:0 1.5rem;height:88px;display:flex;align-items:center;gap:18px;border-bottom:2px solid var(--border);position:sticky;top:72px;z-index:99;box-shadow:var(--shadow-sm)}
.m-back-btn {width:72px;height:72px;display:flex;align-items:center;justify-content:center;background:var(--blue);border:none;border-radius:20px;font-size:48px;font-weight:900;color:#fff;cursor:pointer;-webkit-tap-highlight-color:transparent;flex-shrink:0;line-height:1}
.m-back-btn:active {background:var(--blue2);transform:scale(0.93)}
.m-back-title {font-size:32px;font-weight:900;color:var(--text)}
html.is-mobile .tabs {display:flex;gap:6px;padding:0 2rem;border-bottom:1px solid var(--border);overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.html.is-mobile .clock{display:none !important}

html.is-mobile .content {padding:2rem;display:none}.content.active{display:block;animation:tabSlideIn 0.35s cubic-bezier(0.16,1,0.3,1)}
html.is-mobile .footer {display:none !important}

@media(max-width:768px){

.logo{font-size:2rem}.clock{display:none}
.header{height:72px}


  .btn-theme,.btn-theme[id="searchToggleBtn"]{font-size:24px;width:48px;height:48px}
  .btn-refresh{padding:8px 14px;font-size:16px;gap:4px}


  /* Better tables */

td:first-child,th:first-child {position:sticky;right:0;background:var(--bg3);z-index:3;font-weight:700;box-shadow:-3px 0 6px rgba(0,0,0,0.05)}
tr:hover td:first-child {background:var(--blue-light)}
td strong {font-size:16px}
table{font-size:16px}
th{padding:14px 12px;font-size:12px;letter-spacing:0.3px}

  /* KPI grid */

.kpi{padding:16px 14px;border-radius:18px}
.kpi-icon{width:42px;height:42px;font-size:24px}
.kpi-value{font-size:1.5rem}

  /* Pie chart */

.pie-grid>div:first-child{height:220px !important}
.pie-grid{grid-template-columns:1fr;gap:1rem}
  /* Cash hero */

.cash-hero-val{font-size:2.2rem}

.cash-hero>div:last-child {text-align:right !important}
.cash-hero{padding:1.25rem;flex-direction:column;gap:0.5rem}
.cash-card{padding:16px;border-radius:18px}

  /* Section headers & cards */

.sec{font-size:14px;margin-bottom:1rem;letter-spacing:0.3px}
.card{padding:1rem;border-radius:16px;margin-bottom:0.875rem}
.content{padding:0.75rem}

  /* Search bar */

.search-bar{top:80px;padding:10px 1rem}
.search-input{font-size:17px;padding:12px 16px}

  /* History period buttons */

.hist-periods{gap:6px}
.hist-period-btn{padding:6px 12px;font-size:13px;border-radius:8px}

  /* Bottom nav padding */

body.has-bottomnav .content {padding:2rem;display:none}.content.active{display:block;animation:tabSlideIn 0.35s cubic-bezier(0.16,1,0.3,1)}

}
/* ═══ ✅ v11.6.0.4: מצב אריחים — אפס חלל לבן: כל חלק בכרטיס הוא בלוק צבעוני מלא ═══ */
html.is-mobile .m-cards {display:flex;flex-direction:column;gap:14px;margin-bottom:1.25rem}
html.is-mobile .m-card-row {background:var(--card);border:1px solid var(--border);border-right:8px solid var(--blue);border-radius:22px;padding:0;box-shadow:var(--shadow-sm);animation:tabSlideIn 0.35s cubic-bezier(0.16,1,0.3,1);overflow:hidden}
html.is-mobile .m-card-row.m-card-total {background:rgba(45,91,255,0.10);border-right-width:11px}
/* כותרת — פס צבעוני מלא-רוחב, לא טקסט צף על לבן */
html.is-mobile .m-card-title {font-size:clamp(1.7rem,8.5vw,2.5rem);font-weight:900;padding:16px 20px;background:linear-gradient(135deg,rgba(45,91,255,0.13),rgba(45,91,255,0.04));display:flex;align-items:center;gap:10px;flex-wrap:wrap}
html.is-mobile .m-card-title .chip {font-size:16px;padding:5px 12px}
/* רשת — כל שדה = אריח עם רקע משלו */
html.is-mobile .m-card-grid {display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:10px}
html.is-mobile .m-cell {background:var(--bg3);border-radius:14px;padding:10px 12px;display:flex;flex-direction:column;justify-content:center;min-height:76px}
html.is-mobile .m-cell-l {font-size:clamp(0.95rem,4.4vw,1.15rem);font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:0.2px;margin-bottom:4px}
/* ✅ v11.6.0.5: פונט הערך גדל לפי רוחב המסך (vw) כדי שימלא את האריח בפועל — לא ריווח מת */
html.is-mobile .m-cell-v {font-size:clamp(1.7rem,10.2vw,2.9rem);font-weight:900;line-height:1.1;font-family:'JetBrains Mono',monospace;letter-spacing:-0.5px}
html.is-mobile .m-cell-v .chip {font-size:16px;font-family:Heebo,sans-serif;font-weight:800}
html.is-mobile .m-cell-v canvas.sparkline {width:110px;height:44px}
/* פס תשואה — מלא-רוחב, גדול, צבעוני */
html.is-mobile .m-card-hero {margin:0;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;gap:12px}
html.is-mobile .m-card-hero.pos {background:linear-gradient(135deg,rgba(12,175,96,0.18),rgba(12,175,96,0.06))}
html.is-mobile .m-card-hero.neg {background:linear-gradient(135deg,rgba(232,57,74,0.18),rgba(232,57,74,0.06))}
html.is-mobile .m-card-hero .m-cell-l {margin-bottom:6px;font-size:clamp(1rem,4.8vw,1.3rem)}
html.is-mobile .m-card-hero .m-cell-v {font-size:clamp(2.4rem,14vw,3.9rem);font-weight:900;line-height:1.05}
html.is-mobile .m-card-hero.pos .m-cell-v {color:var(--green)}
html.is-mobile .m-card-hero.neg .m-cell-v {color:var(--red)}
@media(max-width:375px){html.is-mobile .m-card-grid{grid-template-columns:1fr}html.is-mobile .m-card-title{font-size:23px}html.is-mobile .m-cell{min-height:64px}}

/* ══════ Extra small phones (iPhone SE etc.) ══════ */
@media(max-width:375px){


}
@media(min-width:769px){.bottom-nav{display:none !important}}

/* Utility classes from repeated inline styles */
.kpi-icon-blue{background:var(--blue-light)}
.kpi-icon-green{background:var(--green-light)}
.kpi-icon-yellow{background:var(--yellow-light)}
.kpi-icon-purple{background:var(--purple-light)}
.kpi-icon-red{background:var(--red-light)}
.row-total{background:var(--bg3);font-weight:700}
.empty-state{text-align:center;color:var(--muted);padding:2rem}

/* ══════ Heatmap ══════ */
.heatmap-grid {display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:6px;margin-bottom:1rem}
.heatmap-cell {border-radius:10px;padding:12px 10px;cursor:pointer;transition:transform 0.15s,box-shadow 0.15s;display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:80px;text-align:center;border:1px solid rgba(255,255,255,0.05)}
.heatmap-cell:hover {transform:scale(1.05);box-shadow:0 4px 12px rgba(0,0,0,0.2);z-index:1}
.heatmap-cell .hm-sym {font-size:14px;font-weight:800;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.5);margin-bottom:2px}
.heatmap-cell .hm-pct {font-size:13px;font-weight:700;color:rgba(255,255,255,0.9);text-shadow:0 1px 2px rgba(0,0,0,0.4)}
.heatmap-cell .hm-val {font-size:10px;color:rgba(255,255,255,0.7);margin-top:2px;text-shadow:0 1px 2px rgba(0,0,0,0.4)}
.heatmap-cell.hm-large {grid-column:span 2;grid-row:span 2;min-height:120px}
.heatmap-cell.hm-large .hm-sym{font-size:18px}
.heatmap-cell.hm-large .hm-pct{font-size:16px}
.heatmap-cell.hm-large .hm-val{font-size:12px}
.heatmap-legend {display:flex;align-items:center;gap:8px;font-size:12px;color:var(--muted);margin-bottom:1rem;justify-content:center}
.heatmap-legend .hm-gradient {width:120px;height:10px;border-radius:5px;background:linear-gradient(90deg,#E8394A 0%,#3a3a3a 50%,#00A862 100%)}
html.dark .heatmap-legend .hm-gradient {background:linear-gradient(90deg,#E8394A 0%,#2a2a2a 50%,#00A862 100%)}


/* ══════ Sparklines ══════ */
.spark-cell {width:64px;text-align:center;padding:6px 4px}
canvas.sparkline {width:56px;height:28px;vertical-align:middle}


/* ══════ חשיפת מט"ח ══════ */
.fx-exposure {display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap}
.fx-donut {position:relative;width:160px;height:160px;flex-shrink:0}
.fx-legend {flex:1;min-width:200px}
.fx-row {display:flex;align-items:center;gap:8px;margin-bottom:8px;font-size:14px}
.fx-dot {width:12px;height:12px;border-radius:50%;flex-shrink:0}
.fx-bar {flex:1;height:8px;border-radius:4px;background:var(--bg3);overflow:hidden;margin:0 8px}
.fx-bar-fill {height:100%;border-radius:4px;transition:width 0.4s}

/* ══════ יומן דיבידנדים ══════ */
.div-cal-grid {display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px;margin-bottom:1rem}
.div-cal-month {background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px 12px;text-align:center;transition:transform 0.15s;box-shadow:var(--shadow-sm)}
.div-cal-month:hover {transform:translateY(-2px);box-shadow:var(--shadow)}
.div-cal-month .dc-month {font-size:14px;color:var(--muted);font-weight:700}
.div-cal-month .dc-amount {font-size:22px;font-weight:800;margin:6px 0;color:var(--green)}
.div-cal-month .dc-symbols {font-size:12px;color:var(--muted);line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* ══════ FAB — כפתור פעולות מהירות (מובייל) ══════ */
.fab-container {position:fixed;bottom:calc(80px + env(safe-area-inset-bottom));left:16px;z-index:9999;display:none}
.fab-btn {width:160px;height:160px;border-radius:50%;background:linear-gradient(135deg,#2D5BFF 0%,#1A40CC 100%);border:none;color:#fff;font-size:80px;cursor:pointer;box-shadow:0 12px 48px rgba(45,91,255,0.6);display:flex;align-items:center;justify-content:center;transition:transform 0.2s;line-height:1}
.fab-btn:active {transform:scale(0.92)}
.fab-menu {position:absolute;bottom:176px;left:0;display:none;flex-direction:column;gap:20px}
.fab-menu.open {display:flex;animation:slideUp 0.2s ease}
.fab-item {display:flex;align-items:center;gap:24px;background:var(--card);border:1px solid var(--border);border-radius:48px;padding:28px 40px;cursor:pointer;font-size:32px;font-weight:600;color:var(--text);box-shadow:var(--shadow-lg);white-space:nowrap;transition:transform 0.15s}
.fab-item:active {transform:scale(0.96)}
.fab-item .fab-icon {font-size:40px}
/* FAB visibility controlled by JS */


/* ══════ Skeleton Loaders ══════ */
.skeleton-wrap {padding:1.5rem;display:flex;flex-direction:column;gap:1rem}
.skeleton-card {background:var(--card);border:1px solid var(--border);border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:12px}
.skeleton-line {height:16px;border-radius:8px;background:linear-gradient(90deg,var(--bg3) 0%,var(--border) 50%,var(--bg3) 100%);background-size:200% 100%;animation:shimmer 1.5s infinite}
.skeleton-line.short {width:60%}.skeleton-line.medium {width:80%}.skeleton-line.long {width:100%}
.skeleton-line.big {height:36px;width:50%}
.skeleton-grid {display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.25rem;margin-bottom:1.5rem}
.skeleton-tile {background:var(--card);border:1px solid var(--border);border-radius:20px;padding:24px;height:120px;display:flex;flex-direction:column;justify-content:space-between}
@keyframes shimmer {0%{background-position:200% 0}100%{background-position:-200% 0}}

html.dark .skeleton-card, html.dark .skeleton-tile {background:rgba(26,31,46,0.5);border-color:var(--border)}
html.dark .skeleton-line {background:linear-gradient(90deg,var(--bg3) 0%,#2a3140 50%,var(--bg3) 100%);background-size:200% 100%}

/* ══════ Dynamic Animated Background ══════ */
body::before {content:'';position:fixed;top:0;left:0;right:0;bottom:0;z-index:-1;background:linear-gradient(135deg,#F0F2F8 0%,#EEF3FF 25%,#F0F2F8 50%,#F5F0FF 75%,#F0F2F8 100%);background-size:400% 400%;animation:gradientShift 20s ease infinite;pointer-events:none}
html.dark body::before {background:linear-gradient(135deg,#0A0D14 0%,#0F1420 25%,#0A0D14 50%,#0D1118 75%,#0A0D14 100%);background-size:400% 400%;animation:gradientShift 25s ease infinite}
@keyframes gradientShift {0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}

/* ══════ Batch 2 Features CSS ══════ */
/* Pull to Refresh */
.pull-indicator {position:fixed;top:0;left:0;right:0;text-align:center;padding:12px;font-size:14px;font-weight:600;color:var(--muted);transform:translateY(-60px);transition:transform 0.3s ease;z-index:9998;pointer-events:none}
.pull-indicator.show {transform:translateY(0)}
.pull-indicator.refreshing {transform:translateY(0);color:var(--blue)}
.pull-spinner {display:inline-block;width:20px;height:20px;border:2px solid var(--border);border-top-color:var(--blue);border-radius:50%;animation:spin 0.8s linear infinite;vertical-align:middle;margin-left:8px}
/* Refresh Flash */
@keyframes flashRefresh {0%{background:rgba(45,91,255,0.15)}100%{background:transparent}}
.flash-refresh {animation:flashRefresh 0.6s ease}
/* Tab Badges */
.tab-badge {display:inline-block;min-width:20px;height:20px;border-radius:10px;background:var(--red);color:#fff;font-size:11px;font-weight:700;line-height:20px;text-align:center;padding:0 6px;margin-right:4px;vertical-align:middle;animation:badgePulse 2s infinite}
@keyframes badgePulse {0%,100%{opacity:1}50%{opacity:0.7}}
/* Compact Mode */
html.compact .kpi-sub {display:none}
html.compact .kpi {padding:14px 16px}
html.compact .kpi-value {font-size:1.6rem}
html.compact .kpi-label {font-size:12px}
html.compact .card {padding:14px}
html.compact .sec {font-size:14px;margin-bottom:0.5rem}
html.compact .table-wrap table {font-size:12px}
html.compact .kpi-spark {height:24px !important}
/* Alert Modal */
.alert-modal-overlay {position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);z-index:10000;display:none;align-items:center;justify-content:center}
.alert-modal-overlay.show {display:flex}
.alert-modal {background:var(--card);border:1px solid var(--border);border-radius:20px;padding:2rem;max-width:400px;width:90%;box-shadow:var(--shadow-lg)}
.alert-modal h3 {font-size:20px;font-weight:800;margin-bottom:1rem;color:var(--text)}
.alert-modal label {font-size:14px;font-weight:600;display:block;margin-bottom:6px;color:var(--muted)}
.alert-modal select, .alert-modal input {width:100%;padding:12px;border:1px solid var(--border);border-radius:12px;background:var(--bg2);color:var(--text);font-size:16px;margin-bottom:1rem;font-family:inherit}
.alert-modal-btn {background:linear-gradient(135deg,#2D5BFF,#1A40CC);color:#fff;border:none;padding:14px 24px;border-radius:12px;font-size:16px;font-weight:700;cursor:pointer;width:100%}

/* ══════ טאב חירום ══════ */
.emg-gate { max-width: 420px; margin: 2rem auto; text-align: center; }
.emg-gate-icon { font-size: 72px; margin-bottom: 1rem; }
.emg-gate-title { font-size: 1.6rem; font-weight: 800; margin-bottom: 0.5rem; }
.emg-gate-sub { color: var(--muted); margin-bottom: 2rem; font-size: 0.95rem; }
.emg-pwd-input { width: 100%; padding: 16px; border: 2px solid var(--border); border-radius: 14px; font-size: 20px; text-align: center; font-family: 'Heebo', sans-serif; outline: none; transition: border 0.2s; background: var(--bg2); color: var(--text); }
.emg-pwd-input:focus { border-color: var(--red); }
.emg-btn { width: 100%; margin-top: 12px; padding: 16px; background: linear-gradient(135deg, #E8394A, #FF6B6B); color: #fff; border: none; border-radius: 14px; font-size: 20px; font-weight: 700; cursor: pointer; font-family: 'Heebo', sans-serif; transition: opacity 0.2s, transform 0.1s; }
.emg-btn:active { transform: scale(0.97); }
.emg-btn:disabled { opacity: 0.5; }
.emg-msg { margin-top: 12px; font-size: 14px; min-height: 20px; }
.emg-msg.error { color: var(--red); }
.emg-msg.success { color: var(--green); }

.emg-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap; }
.emg-title { font-size: 1.5rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem; }
.emg-actions { display: flex; gap: 8px; }
.emg-action-btn { padding: 10px 16px; border-radius: 10px; border: none; font-weight: 700; cursor: pointer; font-family: 'Heebo', sans-serif; font-size: 14px; transition: opacity 0.2s; }
.emg-action-btn:active { transform: scale(0.95); }
.emg-add-btn { background: var(--blue); color: #fff; }
.emg-logout-btn { background: var(--red); color: #fff; }

.emg-cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; margin-bottom: 2rem; }
.emg-cat-card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; box-shadow: var(--shadow-sm); }
.emg-cat-header { padding: 16px 20px; background: var(--bg3); font-weight: 700; font-size: 1.05rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); }
.emg-cat-icon { font-size: 24px; }
.emg-cat-count { background: var(--blue-light); color: var(--blue); font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 20px; }
.emg-item { padding: 14px 20px; border-bottom: 1px solid var(--border); }
.emg-item:last-child { border-bottom: none; }
.emg-item-name { font-weight: 700; font-size: 0.95rem; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center; }
.emg-item-value { color: var(--muted); font-size: 0.9rem; font-family: 'JetBrains Mono', monospace; margin-bottom: 4px; word-break: break-all; }
.emg-item-notes { color: var(--muted2); font-size: 0.82rem; }
.emg-item-actions { display: flex; gap: 6px; }
.emg-edit, .emg-del { font-size: 13px; padding: 4px 10px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; }
.emg-edit { background: var(--blue-light); color: var(--blue); }
.emg-del { background: var(--red-light); color: var(--red); }

.emg-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 1rem; }
.emg-modal { background: var(--card); border-radius: 20px; padding: 28px; max-width: 480px; width: 100%; max-height: 85vh; overflow-y: auto; box-shadow: var(--shadow-lg); }
.emg-modal-title { font-size: 1.3rem; font-weight: 800; margin-bottom: 1.5rem; }
.emg-field { margin-bottom: 16px; }
.emg-field-label { display: block; font-size: 0.85rem; font-weight: 700; color: var(--muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
.emg-field-input { width: 100%; padding: 12px 14px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 15px; font-family: 'Heebo', sans-serif; background: var(--bg2); color: var(--text); outline: none; transition: border 0.2s; }
.emg-field-input:focus { border-color: var(--blue); }
.emg-field-textarea { width: 100%; padding: 12px 14px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 15px; font-family: 'JetBrains Mono', monospace; background: var(--bg2); color: var(--text); outline: none; transition: border 0.2s; min-height: 80px; resize: vertical; }
.emg-field-textarea:focus { border-color: var(--blue); }
.emg-field-select { width: 100%; padding: 12px 14px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 15px; font-family: 'Heebo', sans-serif; background: var(--bg2); color: var(--text); outline: none; }
.emg-modal-actions { display: flex; gap: 10px; margin-top: 20px; }
.emg-save-btn { flex: 1; padding: 14px; background: var(--blue); color: #fff; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; }
.emg-cancel-btn { flex: 1; padding: 14px; background: var(--bg3); color: var(--text); border: 1px solid var(--border); border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; }

.emg-setup { max-width: 420px; margin: 2rem auto; text-align: center; }
.emg-setup-warn { background: var(--yellow-light); border: 1px solid var(--yellow); border-radius: 12px; padding: 16px; margin: 1rem 0; font-size: 0.9rem; color: #B8860B; text-align: right; }


@keyframes emgToast { 0%{opacity:0;transform:translateX(-50%) translateY(-20px)} 15%{opacity:1;transform:translateX(-50%) translateY(0)} 85%{opacity:1;transform:translateX(-50%) translateY(0)} 100%{opacity:0;transform:translateX(-50%) translateY(-20px)} }


/* ═══════════════════════════════════════════════════════════════
   🔐 Login Screen — Full-screen PIN
   ═══════════════════════════════════════════════════════════════ */
.login-overlay {
  position: fixed; inset: 0; z-index: 99999;
  background: var(--bg);
  display: flex; flex-direction: column;
  align-items: stretch; justify-content: stretch;
  width: 100%; height: 100%;
  min-height: 100vh; min-height: 100dvh;
  animation: fadeIn 0.3s ease;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.login-overlay.hidden { display: none; }

.login-card {
  /* ✅ v11.6.1.0: היה justify-content:space-between על כל גובה המסך — לוגו דבוק למעלה,
     מקלדת דבוקה למטה, ופער ריק אדיר באמצע ("נראה כמו אתר דסקטופ"). מרכז אחד קומפקטי במקום זה. */
  flex: 1;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 5vh;
  width: 100%; max-width: 480px;
  margin: 0 auto;
  padding: 3vh 16px 2vh;
  min-height: 100vh; min-height: 100dvh;
  box-sizing: border-box;
  text-align: center;
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.login-top { flex-shrink: 0; width: 100%; }
.login-bottom { flex-shrink: 0; width: 100%; }
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.login-logo {
  font-size: clamp(40px, 11vw, 54px); font-weight: 900;
  font-family: 'Heebo', sans-serif;
  margin-bottom: 8px;
}
.login-logo em { color: var(--blue); font-style: normal; }
.login-subtitle {
  color: var(--muted); font-size: 17px;
  margin-bottom: 20px;
}
.login-pin-dots {
  display: flex; gap: 18px; justify-content: center;
  margin-bottom: 14px;
}
.login-pin-dot {
  width: clamp(20px, 6vw, 28px); height: clamp(20px, 6vw, 28px); border-radius: 50%;
  border: 3px solid var(--border2);
  transition: all 0.2s;
}
.login-pin-dot.filled {
  background: var(--blue);
  border-color: var(--blue);
  transform: scale(1.15);
}
.login-error {
  color: var(--red);
  font-size: 15px;
  min-height: 22px;
  opacity: 0;
  transition: opacity 0.3s;
}
.login-error.show { opacity: 1; }

/* Keypad — real viewport now works correctly, simple responsive CSS */
.login-keypad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(12px, 4vw, 20px);
  /* ✅ v11.6.1.2: 800px לא אפשרי על מסך טלפון (יגלוש) — במקום זה ממלאים כמעט כל הרוחב
     (96%) עם לחצנים ריבועיים גדולים בהרבה מקודם */
  width: 96%;
  max-width: 460px;
  margin: 0 auto;
  direction: ltr;
}
.login-key {
  aspect-ratio: 1;
  width: 100%;
  min-height: 76px;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: var(--card);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  font-size: clamp(28px, 10vw, 38px); font-weight: 700;
  font-family: 'Heebo', sans-serif;
  color: var(--text);
  cursor: pointer;
  transition: all 0.1s;
  -webkit-tap-highlight-color: transparent;
  display: flex; align-items: center; justify-content: center;
  user-select: none;
}
.login-key:active {
  background: var(--blue);
  color: #fff;
  transform: scale(0.93);
}
.login-key.delete {
  background: transparent;
  border: none;
  box-shadow: none;
  font-size: clamp(16px, 5vw, 20px);
  color: var(--muted);
}
.login-key.delete:active {
  color: var(--red);
  background: var(--red-light);
}
.login-keypad-actions {
  display: flex; justify-content: space-between;
  width: 100%; max-width: 420px;
  margin: 14px auto 0;
}
.login-keypad-actions button {
  background: none; border: none;
  color: var(--muted); font-size: 16px;
  font-family: 'Heebo', sans-serif;
  cursor: pointer; padding: 10px 20px;
  border-radius: 10px;
  -webkit-tap-highlight-color: transparent;
}
.login-keypad-actions button:active {
  background: var(--bg3);
}
.login-setup-hint {
  margin-top: 12px;
  font-size: 13px; color: var(--muted2);
  text-align: center;
  max-width: 90%;
  flex-shrink: 0;
}
.login-bio-divider {
  display: flex; align-items: center; gap: 12px;
  margin: 20px 0 16px;
  color: var(--muted2); font-size: 13px;
}
.login-bio-divider::before, .login-bio-divider::after {
  content: ''; flex: 1; height: 1px;
  background: var(--border);
}
.login-bio-btn {
  width: 64px; height: 64px; border-radius: 50%;
  border: 2px solid var(--blue);
  background: var(--blue-light);
  font-size: 28px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto;
  transition: all 0.2s;
  -webkit-tap-highlight-color: transparent;
}
.login-bio-btn:active {
  transform: scale(0.92);
  background: var(--blue);
}

</style>
</head>
<body>

<!-- 🔐 Login Screen -->
<div class="login-overlay" id="loginOverlay">
  <div class="login-card">
    <div class="login-top">
      <div class="login-logo">תיק <em>Ofir</em></div>
      <div class="login-subtitle" id="loginSubtitle">הזן קוד כניסה</div>

      <!-- PIN dots -->
      <div class="login-pin-dots" id="loginPinDots">
        <div class="login-pin-dot"></div>
        <div class="login-pin-dot"></div>
        <div class="login-pin-dot"></div>
        <div class="login-pin-dot"></div>
      </div>

      <div class="login-error" id="loginError"></div>
    </div>

    <div class="login-bottom">
      <!-- Keypad — פורמט ישראלי RTL -->
      <div class="login-keypad" id="loginKeypad" dir="ltr">
        <button class="login-key" onclick="loginPress(1)">1</button>
        <button class="login-key" onclick="loginPress(2)">2</button>
        <button class="login-key" onclick="loginPress(3)">3</button>
        <button class="login-key" onclick="loginPress(4)">4</button>
        <button class="login-key" onclick="loginPress(5)">5</button>
        <button class="login-key" onclick="loginPress(6)">6</button>
        <button class="login-key" onclick="loginPress(7)">7</button>
        <button class="login-key" onclick="loginPress(8)">8</button>
        <button class="login-key" onclick="loginPress(9)">9</button>
        <button class="login-key" style="visibility:hidden">&nbsp;</button>
        <button class="login-key" onclick="loginPress(0)">0</button>
        <button class="login-key delete" onclick="loginDelete()" title="מחק">⌫</button>
      </div>
      <div class="login-keypad-actions">
        <button onclick="loginDeleteAll()">נקה</button>
        <button onclick="loginCancel()">ביטול</button>
      </div>
      <div class="login-setup-hint" id="loginSetupHint"></div>
    </div>
  </div>
</div>


<div class="header">
  <div class="logo" style="cursor:pointer" onclick="goHome()">תיק <em>Ofir</em></div>
  <div class="header-right">
    <span class="clock" id="clock"></span>
    <span class="pill pill-green" id="statusPill"><span class="dot"></span><span id="statusTxt">טוען...</span></span>
    <span class="ver-badge" id="verBadge" onclick="showVersionToast()"></span>
    <button class="btn-theme" id="searchToggleBtn" onclick="toggleSearch()" title="חיפוש">🔍</button>
    <button class="btn-theme" id="themeBtn" onclick="toggleTheme()" title="מצב לילה/יום">🌙</button>
    <button class="btn-theme" id="pdfBtn" onclick="exportPDF()" title="ייצוא PDF" style="font-size:28px">📄</button>
    <button class="btn-theme" id="compactBtn" onclick="toggleCompact()" title="מצב מצומצם" style="font-size:28px">📐</button>
    <button class="btn-theme" id="alertBtn" onclick="openAlertsModal()" title="התראת מחיר" style="font-size:28px">🔔</button>
    <button class="btn-theme" id="loginSettingsBtn" onclick="openLoginSettings()" title="הגדרות כניסה ואבטחה" style="font-size:24px">🔐</button>
    <button class="btn-refresh" id="refreshBtn" onclick="refreshFromIBKR()">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <path d="M1 4v6h6"/><path d="M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/>
      </svg> רענן
    </button>
  </div>
</div>
<div class="search-bar hidden" id="searchBar">
  <input type="text" class="search-input" id="globalSearch" placeholder="חיפוש נייר, קרן, עסקה..." oninput="debouncedSearch(this.value)">
  <button class="search-clear" onclick="clearSearch()">✕</button>
  <span class="search-count" id="searchCount"></span>
</div>

<div class="tabs">
  <button class="tab active" onclick="go('overview')">סקירה כללית</button>
  <button class="tab" onclick="go('ibkr')">IBKR</button>
  <button class="tab" onclick="go('fair')">FAIR</button>
  <button class="tab" onclick="go('cash')">מזומן ובנקים</button>
  <button class="tab" onclick="go('alloc')">הקצאה</button>
  <button class="tab" onclick="go('dividends')">📅 דיבידנדים</button>
  <button class="tab" onclick="go('commissions')">💸 עמלות</button>
  <button class="tab" onclick="go('integrity')">🔍 שלמות</button>
  <button class="tab" onclick="go('analysis')">📊 ניתוח וחדשות</button>
  <button class="tab" onclick="go('heatmap')">🔥 Heatmap</button>
  <button class="tab" onclick="go('history')">📈 היסטוריה</button>
  <button class="tab" onclick="go('savings')">👶 חיסכון לכל ילד</button>
  <button class="tab" onclick="go('tax')">🧾 מחשבון מס</button>
  <button class="tab" onclick="go('emergency')" style="border-color:#E8394A;color:#E8394A">🆘 חירום</button>
</div>

<div class="content active" id="tab-overview"><div class="skeleton-wrap"><div class="skeleton-grid"><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div></div><div class="skeleton-card"><div class="skeleton-line long"></div><div class="skeleton-line long"></div><div class="skeleton-line medium"></div><div class="skeleton-line long"></div></div></div></div>
<div class="content" id="tab-ibkr"><div class="skeleton-wrap"><div class="skeleton-grid"><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div></div><div class="skeleton-card"><div class="skeleton-line long"></div><div class="skeleton-line long"></div><div class="skeleton-line medium"></div><div class="skeleton-line long"></div></div></div></div>
<div class="content" id="tab-fair"><div class="skeleton-wrap"><div class="skeleton-grid"><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div></div><div class="skeleton-card"><div class="skeleton-line long"></div><div class="skeleton-line long"></div><div class="skeleton-line medium"></div><div class="skeleton-line long"></div></div></div></div>
<div class="content" id="tab-cash"><div class="skeleton-wrap"><div class="skeleton-grid"><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div></div><div class="skeleton-card"><div class="skeleton-line long"></div><div class="skeleton-line long"></div><div class="skeleton-line medium"></div><div class="skeleton-line long"></div></div></div></div>
<div class="content" id="tab-alloc"><div class="skeleton-wrap"><div class="skeleton-grid"><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div></div><div class="skeleton-card"><div class="skeleton-line long"></div><div class="skeleton-line long"></div><div class="skeleton-line medium"></div><div class="skeleton-line long"></div></div></div></div>
<div class="content" id="tab-dividends"><div class="skeleton-wrap"><div class="skeleton-grid"><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div></div><div class="skeleton-card"><div class="skeleton-line long"></div><div class="skeleton-line long"></div><div class="skeleton-line medium"></div><div class="skeleton-line long"></div></div></div></div>
<div class="content" id="tab-commissions"><div class="skeleton-wrap"><div class="skeleton-grid"><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div></div><div class="skeleton-card"><div class="skeleton-line long"></div><div class="skeleton-line long"></div><div class="skeleton-line medium"></div><div class="skeleton-line long"></div></div></div></div>
<div class="content" id="tab-integrity"><div class="skeleton-wrap"><div class="skeleton-grid"><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div></div><div class="skeleton-card"><div class="skeleton-line long"></div><div class="skeleton-line long"></div><div class="skeleton-line medium"></div><div class="skeleton-line long"></div></div></div></div>
<div class="content" id="tab-analysis"><div class="skeleton-wrap"><div class="skeleton-grid"><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div></div><div class="skeleton-card"><div class="skeleton-line long"></div><div class="skeleton-line long"></div><div class="skeleton-line medium"></div><div class="skeleton-line long"></div></div></div></div>
<div class="content" id="tab-heatmap"><div class="skeleton-wrap"><div class="skeleton-grid"><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div></div><div class="skeleton-card"><div class="skeleton-line long"></div><div class="skeleton-line long"></div><div class="skeleton-line medium"></div><div class="skeleton-line long"></div></div></div></div>
<div class="content" id="tab-history"><div class="skeleton-wrap"><div class="skeleton-grid"><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div></div><div class="skeleton-card"><div class="skeleton-line long"></div><div class="skeleton-line long"></div><div class="skeleton-line medium"></div><div class="skeleton-line long"></div></div></div></div>
<div class="content" id="tab-savings"><div class="skeleton-wrap"><div class="skeleton-grid"><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div></div><div class="skeleton-card"><div class="skeleton-line long"></div><div class="skeleton-line long"></div><div class="skeleton-line medium"></div><div class="skeleton-line long"></div></div></div></div>
<div class="content" id="tab-tax"><div class="skeleton-wrap"><div class="skeleton-grid"><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div></div><div class="skeleton-card"><div class="skeleton-line long"></div><div class="skeleton-line long"></div><div class="skeleton-line medium"></div><div class="skeleton-line long"></div></div></div></div>
<div class="content" id="tab-emergency"><div style="padding:2rem;text-align:center"><div style="font-size:64px;margin-bottom:1rem">🆘</div><h2 style="font-size:1.5rem;margin-bottom:0.5rem">דף חירום</h2><p style="color:var(--muted);margin-bottom:2rem">הוראות ודרכי גישה לכל חשבון</p><div style="max-width:400px;margin:0 auto"><input type="password" id="emgPwd" placeholder="סיסמה" style="width:100%;padding:14px;border:2px solid var(--border);border-radius:12px;font-size:18px;text-align:center;font-family:Heebo,sans-serif;outline:none;transition:border 0.2s" onfocus="this.style.borderColor='var(--blue)'" onblur="this.style.borderColor='var(--border)'"><button onclick="emgUnlock()" style="width:100%;margin-top:12px;padding:14px;background:linear-gradient(135deg,#2D5BFF,#5B8FFF);color:#fff;border:none;border-radius:12px;font-size:18px;font-weight:700;cursor:pointer;font-family:Heebo,sans-serif">פתח</button><div id="emgMsg" style="margin-top:12px;color:var(--red);font-size:14px;display:none"></div></div></div></div>
<div id="mobile-home" style="display:none;background:var(--bg);min-height:100vh"></div>
<div id="mobile-detail" style="display:none;background:var(--bg);min-height:100vh">
  <div class="m-back-bar"><button class="m-back-btn" onclick="mobileBack()">‹</button><span id="mobile-detail-title" class="m-back-title"></span></div>
  <div id="mobile-detail-body" style="padding:1rem"></div>
</div>

<div class="footer" id="footer">מתחבר לנתונים...</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
<script>
const C = ['#3B6FE8','#0CAF60','#F5A623','#7C5CFC','#E8394A','#00B8D9','#FB923C','#EC4899','#14B8A6','#6366F1'];
let charts = {};
setInterval(()=>{document.getElementById('clock').textContent=new Date().toLocaleTimeString('he-IL')},1000);
const fmt  = n => Math.round(Number(n)||0).toLocaleString('he-IL');
const fmtD = n => '$'+Math.round(Number(n)||0).toLocaleString('en-US');
const pct  = n => ((Number(n)||0)*100).toFixed(1)+'%';
const sgn  = n => (Number(n)||0)>=0?'+':'';
const cls  = n => (Number(n)||0)>=0?'pos':'neg';
const delt = (n,p) => `<span class="badge-delta ${(Number(n)||0)>=0?'up':'dn'}">${sgn(n)}₪${fmt(Math.abs(Number(n)||0))} (${sgn(p)}${pct(p)})</span>`;

// ══════ PDF Export ══════
function exportPDF(){
  var btn = document.getElementById('pdfBtn');
  if(btn) { btn.textContent='⏳'; haptic(30); }
  var activeTab = document.querySelector('.content.active');
  if(!activeTab) activeTab = document.getElementById('tab-overview');
  var tabName = 'תיק Ofir';
  var dateStr = new Date().toLocaleDateString('he-IL');
  var opt = {
    margin: [10, 10, 10, 10],
    filename: 'תיק_Ofir_' + dateStr.replace(/\//g,'-') + '.pdf',
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#FFFFFF' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };
  // Create a clean wrapper for PDF
  var wrapper = document.createElement('div');
  wrapper.style.padding = '20px';
  wrapper.innerHTML = '<h1 style="font-family:Heebo,sans-serif;font-size:28px;color:#2D5BFF;text-align:center;margin-bottom:8px">תיק השקעות — Ofir</h1>'
    + '<p style="text-align:center;font-family:Heebo,sans-serif;font-size:14px;color:#666;margin-bottom:20px">דוח תיק — ' + dateStr + '</p>'
    + '<div style="border-top:3px solid #2D5BFF;margin-bottom:20px"></div>'
    + activeTab.innerHTML;
  document.body.appendChild(wrapper);
  html2pdf().set(opt).from(wrapper).save().then(function(){
    document.body.removeChild(wrapper);
    if(btn) btn.textContent='📄';
  }).catch(function(e){
    console.error('PDF export error:', e);
    if(wrapper.parentNode) document.body.removeChild(wrapper);
    if(btn) btn.textContent='📄';
    alert('שגיאה בייצוא PDF. נסה שנית.');
  });
}

// ══════ KPI Sparklines ══════
function drawKPISparks(histData) {
  if(!histData || histData.length < 2) return;
  var recent = histData.slice(-30); // last 30 points
  var sparkDefs = [
    {id:'spark-total', key:'totalValue', color:'#3B6FE8'},
    {id:'spark-ibkr', key:'ibkr', color:'#3B6FE8'},
    {id:'spark-fair', key:'fair', color:'#0CAF60'}
  ];
  sparkDefs.forEach(function(def){
    var el = document.getElementById(def.id);
    if(!el) return;
    var values = recent.map(function(r){return Number(r[def.key])||0;});
    if(values.length < 2) return;
    var ctx = el.getContext('2d');
    var w = el.offsetWidth, h = el.offsetHeight;
    el.width = w * 2; el.height = h * 2; // retina
    ctx.scale(2,2);
    var min = Math.min.apply(null,values), max = Math.max.apply(null,values);
    var range = max - min || 1;
    var stepX = w / (values.length - 1);
    // Gradient fill
    var grad = ctx.createLinearGradient(0,0,0,h);
    grad.addColorStop(0, def.color + '33');
    grad.addColorStop(1, def.color + '00');
    ctx.beginPath();
    ctx.moveTo(0, h);
    values.forEach(function(v,i){
      var x = i * stepX;
      var y = h - ((v - min) / range) * (h - 4) - 2;
      if(i===0) ctx.lineTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    // Line
    ctx.beginPath();
    values.forEach(function(v,i){
      var x = i * stepX;
      var y = h - ((v - min) / range) * (h - 4) - 2;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.strokeStyle = def.color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
    // Last point dot
    var lastX = (values.length-1) * stepX;
    var lastY = h - ((values[values.length-1] - min) / range) * (h - 4) - 2;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 3, 0, Math.PI*2);
    ctx.fillStyle = def.color;
    ctx.fill();
  });
}

// ══════ Haptic Feedback ══════
function haptic(ms) {
  try { if(navigator.vibrate) navigator.vibrate(ms || 15); } catch(e){}
}
// Auto-haptic on all buttons, tabs, tiles, nav items
document.addEventListener('click', function(e){
  if(e.target.closest('.tab,.btn-theme,.btn-refresh,.m-tile,.bottom-nav-item,.fab-btn,.fab-item,.m-back-btn,.kpi,.card')) haptic(15);
}, true);

// ══════ BATCH 2: All 10 features ══════
// 7. Pull to Refresh
(function(){
  var pullStart=0,pulling=false,pullDist=0;
  var ind=document.createElement('div');
  ind.className='pull-indicator';ind.innerHTML='↓ משוך לרענון';ind.id='pullIndicator';
  document.body.appendChild(ind);
  var active=false;
  document.addEventListener('touchstart',function(e){
    if(window.innerWidth>768)return;
    if(window.scrollY<=0){pullStart=e.touches[0].clientY;active=true;}else{active=false;}
  },{passive:true});
  document.addEventListener('touchmove',function(e){
    if(!active)return;
    pullDist=e.touches[0].clientY-pullStart;
    if(pullDist>0&&pullDist<120){
      pulling=true;
      ind.style.transform='translateY('+(pullDist-60)+'px)';
      if(pullDist>60)ind.innerHTML='↑ שחרר לרענון';else ind.innerHTML='↓ משוך לרענון';
    }
  },{passive:true});
  document.addEventListener('touchend',function(){
    if(!active)return;active=false;
    if(pullDist>60&&pulling){
      ind.className='pull-indicator refreshing';
      ind.innerHTML='טוען...<span class="pull-spinner"></span>';
      haptic(30);
      if(typeof refreshFromIBKR==='function')refreshFromIBKR();
      setTimeout(function(){ind.className='pull-indicator';ind.innerHTML='↓ משוך לרענון';ind.style.transform='';},2000);
    }else{ind.style.transform='';}
    pulling=false;pullDist=0;
  },{passive:true});
})();

// 8. Refresh Flash
function flashRefresh(){
  document.querySelectorAll('.kpi-value,.kpi-sub,.m-hero-val,.m-tile-val').forEach(function(el){
    el.classList.add('flash-refresh');
    setTimeout(function(){el.classList.remove('flash-refresh');},600);
  });
  setTimeout(function(){if(typeof animateAllNumbers==='function')animateAllNumbers();},100);
  if(window._portfolioData&&window._portfolioData.history&&window._portfolioData.history.history){
    setTimeout(function(){if(typeof drawKPISparks==='function')drawKPISparks(window._portfolioData.history.history);},300);
  }
}

// 9. Compact Mode
function toggleCompact(){
  document.documentElement.classList.toggle('compact');
  localStorage.setItem('compact',document.documentElement.classList.contains('compact')?'1':'0');
  haptic(15);
}
(function(){if(localStorage.getItem('compact')==='1')document.documentElement.classList.add('compact');})();

// 10. Tab Badges
function updateTabBadges(d){
  var divCount=0;
  if(window._divCalendarData&&window._divCalendarData.calendar){
    var now=new Date();
    window._divCalendarData.calendar.forEach(function(m){
      var parts=m.month.split('/');
      if(parts.length===2){
        var mDate=new Date(2026,parseInt(parts[0])-1,1);
        if((mDate-now)/(1000*60*60*24)>=0&&(mDate-now)/(1000*60*60*24)<=60)divCount++;
      }
    });
  }
  setBadge('dividends',divCount);
  setBadge('integrity',(d.integrity&&d.integrity.issues)?d.integrity.issues.length:0);
  setBadge('analysis',(d.analysis&&d.analysis.rebalance)?d.analysis.rebalance.length:0);
}
function setBadge(tabId,count){
  if(count<=0){removeBadge(tabId);return;}
  var tab=document.querySelector('.tab[onclick*="'+tabId+'"]');
  if(!tab)return;
  var ex=tab.querySelector('.tab-badge');
  if(ex){ex.textContent=count;return;}
  var b=document.createElement('span');b.className='tab-badge';b.textContent=count;
  tab.insertBefore(b,tab.firstChild);
}
function removeBadge(tabId){
  var tab=document.querySelector('.tab[onclick*="'+tabId+'"]');
  if(!tab)return;
  var b=tab.querySelector('.tab-badge');
  if(b)b.remove();
}

// 1. Performance Attribution
function renderPerfAttribution(ib){
  if(!ib||!ib.positions||!ib.positions.length)return '';
  var sorted=ib.positions.slice().sort(function(a,b){return(Number(b.retILS)||0)-(Number(a.retILS)||0);});
  var top3=sorted.slice(0,3),bottom3=sorted.slice(-3).reverse();
  var maxAbs=Math.max(Math.abs(Number(top3[0]&&top3[0].retILS)||0),Math.abs(Number(bottom3[0]&&bottom3[0].retILS)||0))||1;
  var h='<div class="sec">🏆 תרומה לתשואה</div><div class="card" style="padding:1.5rem">';
  h+='<div style="font-size:14px;font-weight:700;color:var(--green);margin-bottom:8px">🟢 מובילים</div>';
  top3.forEach(function(p){
    var w=Math.abs(Number(p.retILS)||0)/maxAbs*100;
    h+='<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px"><div style="font-weight:700;min-width:70px">'+p.sym+'</div><div style="flex:1;background:var(--bg3);border-radius:10px;height:22px;overflow:hidden"><div style="background:linear-gradient(90deg,#0CAF60,#0CAF60dd);height:100%;width:'+w+'%;border-radius:10px"></div></div><div style="font-weight:700;color:var(--green);min-width:90px;text-align:left;font-size:13px">+'+fmt(Math.abs(Number(p.retILS)||0))+'₪</div></div>';
  });
  h+='<div style="font-size:14px;font-weight:700;color:var(--red);margin:12px 0 8px">🔴 מפגרים</div>';
  bottom3.forEach(function(p){
    var w=Math.abs(Number(p.retILS)||0)/maxAbs*100;
    h+='<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px"><div style="font-weight:700;min-width:70px">'+p.sym+'</div><div style="flex:1;background:var(--bg3);border-radius:10px;height:22px;overflow:hidden"><div style="background:linear-gradient(90deg,#E8394A,#E8394Add);height:100%;width:'+w+'%;border-radius:10px"></div></div><div style="font-weight:700;color:var(--red);min-width:90px;text-align:left;font-size:13px">-'+fmt(Math.abs(Number(p.retILS)||0))+'₪</div></div>';
  });
  h+='</div>';
  return h;
}

// 3. FX Exposure
function renderFXExposure(s,ib,fa,usd){
  var ibkrVal=(ib.totalVal||0)+(ib.cash||0);
  var fairVal=(fa.totalVal||0)+(fa.cash||0);
  var banksVal=s.banksVal||0;
  var total=s.grandTotal||(ibkrVal+fairVal+banksVal);
  var usdPct=total>0?(ibkrVal/total*100):0;
  var ilsPct=total>0?((fairVal+banksVal)/total*100):0;
  var h='<div class="sec">💱 חשיפת מט"ח</div><div class="card" style="padding:1.5rem">';
  h+='<div style="margin-bottom:1rem"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span style="font-weight:700">🇺🇸 דולר</span><span style="font-weight:800;font-size:20px;color:'+(usdPct>70?'var(--red)':'var(--green)')+'">'+usdPct.toFixed(1)+'%</span></div>';
  h+='<div style="background:var(--bg3);border-radius:12px;height:28px;overflow:hidden"><div style="background:linear-gradient(90deg,#3B6FE8,#5B8FFF);height:100%;width:'+usdPct+'%;border-radius:12px;transition:width 0.6s"></div></div>';
  h+='<div style="font-size:13px;color:var(--muted);margin-top:4px">₪'+fmt(ibkrVal)+'</div></div>';
  h+='<div style="margin-bottom:1rem"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span style="font-weight:700">🇮🇱 שקל</span><span style="font-weight:800;font-size:20px;color:var(--green)">'+ilsPct.toFixed(1)+'%</span></div>';
  h+='<div style="background:var(--bg3);border-radius:12px;height:28px;overflow:hidden"><div style="background:linear-gradient(90deg,#0CAF60,#0CAF60dd);height:100%;width:'+ilsPct+'%;border-radius:12px;transition:width 0.6s"></div></div>';
  h+='<div style="font-size:13px;color:var(--muted);margin-top:4px">₪'+fmt(fairVal+banksVal)+'</div></div>';
  if(usdPct>70){
    h+='<div style="padding:1rem;background:rgba(232,57,74,0.1);border:1px solid rgba(232,57,74,0.3);border-radius:12px"><div style="font-weight:700;color:var(--red)">⚠️ חשיפת דולר גבוהה</div><div style="font-size:13px;color:var(--muted)">מעל 70%. שקול גידור מט"ח.</div></div>';
  }else if(usdPct<30){
    h+='<div style="padding:1rem;background:rgba(45,91,255,0.1);border:1px solid rgba(45,91,255,0.2);border-radius:12px"><div style="font-weight:700;color:var(--blue)">ℹ️ חשיפת דולר נמוכה</div><div style="font-size:13px;color:var(--muted)">מתחת ל-30%. שקול פיזור לחו"ל.</div></div>';
  }else{
    h+='<div style="padding:1rem;background:rgba(12,175,96,0.1);border:1px solid rgba(12,175,96,0.2);border-radius:12px"><div style="font-weight:700;color:var(--green)">✅ חשיפה מאוזנת</div><div style="font-size:13px;color:var(--muted)">פיזור תקין (30%-70%).</div></div>';
  }
  h+='</div>';
  return h;
}

// 4. Price Alert Modal
function openAlertModal(){
  var ov=document.getElementById('alertModalOverlay');
  if(!ov){
    ov=document.createElement('div');ov.id='alertModalOverlay';ov.className='alert-modal-overlay';
    ov.innerHTML='<div class="alert-modal"><h3>🔔 הגדרת התראת מחיר</h3><label>סימבול</label><select id="alertSymbol"></select><label>סוג</label><select id="alertType"><option value="above">מעל מחיר</option><option value="below">מתחת למחיר</option><option value="change5">שינוי 5% ביום</option><option value="change10">שינוי 10% ביום</option></select><label>מחיר יעד ($)</label><input type="number" id="alertPrice" step="0.01" placeholder="0.00"><button class="alert-modal-btn" onclick="saveAlert()">שמור</button></div>';
    document.body.appendChild(ov);
    ov.addEventListener('click',function(e){if(e.target===ov)ov.classList.remove('show');});
    if(window._portfolioData&&window._portfolioData.ibkr&&window._portfolioData.ibkr.positions){
      var sel=ov.querySelector('#alertSymbol');
      window._portfolioData.ibkr.positions.forEach(function(p){
        if(p.sym&&p.sym!=='CASH-USD'){var o=document.createElement('option');o.value=p.sym;o.textContent=p.sym+' ($'+fmt(p.price)+')';sel.appendChild(o);}
      });
    }
  }
  ov.classList.add('show');haptic(20);
}
function saveAlert(){
  var sym=document.getElementById('alertSymbol').value;
  var type=document.getElementById('alertType').value;
  var price=document.getElementById('alertPrice').value;
  if(!sym||!type){alert('נא למלא שדות');return;}
  var alerts=JSON.parse(localStorage.getItem('priceAlerts')||'[]');
  alerts.push({sym:sym,type:type,price:price,created:Date.now()});
  localStorage.setItem('priceAlerts',JSON.stringify(alerts));
  document.getElementById('alertModalOverlay').classList.remove('show');
  haptic(30);
  var t=document.createElement('div');
  t.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--card);border:1px solid var(--green);border-radius:12px;padding:12px 24px;font-size:14px;font-weight:600;z-index:10001;box-shadow:var(--shadow-lg)';
  t.textContent='✅ התראה נשמרה עבור '+sym;
  document.body.appendChild(t);
  setTimeout(function(){t.remove();},3000);
}

// 5. Financial Calendar
function renderFinancialCalendar(divData){
  var events=[];
  if(divData&&divData.calendar){
    divData.calendar.forEach(function(m){
      if(m.totalUSD>0)events.push({date:m.month,icon:'💵',title:'דיבידנדים',detail:'$'+m.totalUSD.toFixed(1)+' ('+m.symbols.join(', ')+')',color:'var(--green)'});
    });
  }
  if(!events.length)return '';
  events.sort(function(a,b){return a.date.localeCompare(b.date);});
  var h='<div class="sec">📅 לוח שנה פיננסי</div><div class="card" style="padding:1.5rem"><div style="position:relative;padding-right:20px">';
  events.slice(0,8).forEach(function(e,i){
    var last=i===Math.min(events.length,8)-1;
    h+='<div style="display:flex;align-items:flex-start;gap:16px;margin-bottom:'+(last?'0':'1rem')+'"><div style="flex-shrink:0;width:36px;height:36px;border-radius:50%;background:'+e.color+'20;display:flex;align-items:center;justify-content:center;font-size:18px;position:relative">'+e.icon+(last?'':'<div style="position:absolute;top:36px;left:50%;width:2px;height:calc(100% + 0.5rem);background:var(--border);transform:translateX(-50%)"></div>')+'</div><div style="flex:1;padding-top:4px"><div style="font-size:13px;color:var(--muted);font-weight:600">'+e.date+'</div><div style="font-weight:700;font-size:15px">'+e.title+'</div><div style="font-size:13px;color:var(--muted)">'+e.detail+'</div></div></div>';
  });
  h+='</div></div>';
  return h;
}


// ══════ Count-Up Animation ══════
function countUp(el, target, duration, prefix) {
  if(!el || isNaN(Number(target))) { if(el) el.textContent = (prefix||'') + fmt(target); return; }
  prefix = prefix || el.getAttribute('data-prefix') || '';
  var startTime = null;
  var isNeg = Number(target) < 0;
  var absTarget = Math.abs(Number(target));
  function step(ts) {
    if(!startTime) startTime = ts;
    var progress = Math.min((ts - startTime) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    var current = Math.round(absTarget * eased);
    el.textContent = prefix + (isNeg && progress > 0.1 ? '-' : '') + current.toLocaleString('he-IL');
    if(progress < 1) requestAnimationFrame(step);
    else el.textContent = prefix + (isNeg ? '-' : '') + absTarget.toLocaleString('he-IL');
  }
  requestAnimationFrame(step);
}

function animateAllNumbers(container) {
  if(!container) container = document;
  // Animate KPI values
  container.querySelectorAll('.kpi-value[data-count]').forEach(function(el){
    var target = el.getAttribute('data-count');
    var prefix = el.getAttribute('data-prefix') || '';
    el.textContent = prefix + '0';
    countUp(el, target, 1200, prefix);
  });
  // Animate mobile hero value
  var hero = container.querySelector('.m-hero-val[data-count]');
  if(hero) {
    var hp = hero.getAttribute('data-prefix') || '₪';
    countUp(hero, parseFloat(hero.getAttribute('data-count')), 1500, hp);
  }
  // Animate mobile tile values
  container.querySelectorAll('.m-tile-val[data-count]').forEach(function(el){
    var prefix = el.getAttribute('data-prefix') || '';
    var target = parseFloat(el.getAttribute('data-count'));
    countUp(el, target, 1200, prefix);
  });
}


// ══════ Global Search — searches ALL tabs, auto-jumps to matches ══════
var _searchTimer = null;
function debouncedSearch(q){
  clearTimeout(_searchTimer);
  _searchTimer = setTimeout(function(){ filterTables(q); }, 250);
}
var tabLabels = {overview:'סקירה',ibkr:'IBKR',fair:'FAIR',cash:'מזומן',alloc:'הקצאה',dividends:'דיבידנדים',commissions:'עמלות',integrity:'שלמות',analysis:'ניתוח',history:'היסטוריה',savings:'חיסכון',tax:'מס'};


function filterTables(q){
  q = (q || '').trim().toLowerCase();
  var countEl = document.getElementById('searchCount');

  if(!q){
    // Reset: show all rows in all tabs
    document.querySelectorAll('.content table tbody tr').forEach(function(tr){ tr.style.display = ''; });
    if(countEl) countEl.textContent = '';
    return;
  }

  // Search ALL tabs — count matches per tab
  var tabIds = ['overview','ibkr','fair','cash','alloc','dividends','commissions','integrity','analysis','history','savings','tax'];
  var bestTab = null, bestCount = 0, totalCount = 0;

  tabIds.forEach(function(tid){
    var container = document.getElementById('tab-' + tid);
    if(!container) return;
    var tabMatches = 0;
    container.querySelectorAll('table tbody tr').forEach(function(tr){
      var text = tr.textContent.toLowerCase();
      if(text.indexOf(q) !== -1){ tr.style.display = ''; tabMatches++; }
      else { tr.style.display = 'none'; }
    });
    totalCount += tabMatches;
    if(tabMatches > bestCount){ bestCount = tabMatches; bestTab = tid; }
  });

  // Auto-switch to the tab with the most matches
  if(bestTab && bestCount > 0){
    var currentActive = document.querySelector('.tab.active');
    var currentId = currentActive ? (currentActive.getAttribute('onclick').match(/'([^']+)'/)||[])[1] : '';
    if(currentId !== bestTab){
      go(bestTab);
      // Re-apply filter after tab switch (rendering may have re-created rows)
      setTimeout(function(){
        document.querySelectorAll('.content table tbody tr').forEach(function(tr){
          var text = tr.textContent.toLowerCase();
          tr.style.display = (text.indexOf(q) !== -1) ? '' : 'none';
        });
      }, 50);
    }
  }

  if(countEl) countEl.textContent = totalCount > 0 ? (totalCount + ' תוצאות' + (bestTab ? ' · ' + tabLabels[bestTab] : '')) : 'לא נמצא';
}
// ══════ History Time Periods ══════
var histPeriod = 'all';
function setHistPeriod(p){
  histPeriod = p;
  document.querySelectorAll('.hist-period-btn').forEach(function(b){
    b.classList.toggle('active', b.getAttribute('data-period') === p);
  });
  if(window._lastData) renderHistory(window._lastData);
}

function go(id){
  const tabIds = ['overview','ibkr','fair','cash','alloc','dividends','commissions','integrity','analysis','history','savings','tax','emergency'];
  document.querySelectorAll('.tab').forEach((t,i)=>t.classList.toggle('active',tabIds[i]===id));
  document.querySelectorAll('.content').forEach(c=>c.classList.toggle('active',c.id==='tab-'+id));
  // טעינה עצלה של ניתוח — רק כשלוחצים על הטאב
  if(id==='analysis' && window._lastData){
    renderAnalysis(window._lastData);
  }
  // Don't close search bar on tab switch if user is actively searching
  window.scrollTo({top:0,behavior:'smooth'});
}

// ── Refresh: update live prices (Yahoo for IBKR, TASE for FAIR) then reload ──
function refreshFromIBKR(){
  const btn = document.getElementById('refreshBtn');
  if(btn){ btn.classList.add('spinning'); btn.disabled = true; }
  google.script.run.withSuccessHandler(function(res){
    // Prices updated in the sheet — now reload fresh data into the UI
    google.script.run.withSuccessHandler(function(jsonStr){
      if(btn){ btn.classList.remove('spinning'); btn.disabled = false; }
      try {
        const d = JSON.parse(jsonStr);
        if(d.error) throw new Error(d.error);
        window._lastData = d;
        renderAll(d);
      } catch(e){
        if(btn){ btn.classList.remove('spinning'); btn.disabled = false; }
        if(_handleAuthError(e)) return;
        alert('שגיאה בטעינת נתונים: ' + e.message);
      }
    }).withFailureHandler(function(err){
      if(btn){ btn.classList.remove('spinning'); btn.disabled = false; }
      alert('שגיאת טעינה: ' + (err.message || err));
    }).getPortfolioData(_getSessionToken());
  }).withFailureHandler(function(err){
    if(btn){ btn.classList.remove('spinning'); btn.disabled = false; }
    if(err && String(err.message || err).indexOf('unauthorized') > -1){ showLogin(); return; }
    alert('שגיאת רענון מחירים: ' + (err.message || err));
  }).silentPriceRefresh(_getSessionToken());
}

// ── Search toggle ──
function toggleSearch(){
  const bar = document.getElementById('searchBar');
  const input = document.getElementById('globalSearch');
  if(bar.classList.contains('hidden')){
    bar.classList.remove('hidden');
    if(input) input.focus();
  } else {
    bar.classList.add('hidden');
    if(input) input.value = '';
    filterTables('');
  }
}

// ── Clear search ──
function clearSearch(){
  const input = document.getElementById('globalSearch');
  const bar = document.getElementById('searchBar');
  if(input) input.value = '';
  bar.classList.add('hidden');
  filterTables('');
}

// ── Mobile back button ──
function mobileBack(){
  const home = document.getElementById('mobile-home');
  const detail = document.getElementById('mobile-detail');
  if(detail){ detail.style.display = 'none'; }
  if(home){ home.style.display = 'block'; }
}

function loadData(){ callAPI('getPortfolioData'); }


function callAPI(funcName, onComplete){
  const btn=document.getElementById('refreshBtn'); btn.classList.add('spinning');
  document.getElementById('statusTxt').textContent='טוען...'; document.getElementById('statusPill').className='pill pill-green';
  google.script.run.withSuccessHandler(function(jsonStr){
    btn.classList.remove('spinning'); if(onComplete) onComplete();
    try { const d = JSON.parse(jsonStr); if(d.error) throw new Error(d.error); window._lastData = d; renderAll(d);
      document.getElementById('statusTxt').textContent='עודכן '+d.meta.updatedAt;
      document.getElementById('footer').textContent='עודכן: '+d.meta.updatedAt+' | USD/ILS: '+(Number(d.meta.usdIls)||0).toFixed(4)+' | לחץ רענן למשיכה מ-IBKR';
    } catch(e) { if(_handleAuthError(e)) return; document.getElementById('statusTxt').textContent='שגיאה'; document.getElementById('statusPill').className='pill pill-red';
      document.querySelectorAll('[id^="tab-"]').forEach(el=>el.innerHTML='<div class="error-box">שגיאה: '+e.message+'</div>'); }
  }).withFailureHandler(function(err){
    btn.classList.remove('spinning'); if(onComplete) onComplete();
    document.getElementById('statusTxt').textContent='שגיאה'; document.getElementById('statusPill').className='pill pill-red';
    document.querySelectorAll('[id^="tab-"]').forEach(el=>el.innerHTML='<div class="error-box">שגיאה: '+err.message+'</div>');
  })[funcName](_getSessionToken());
}

function safeRender(fn, name, d){
  try { fn(d); }
  catch(e) { console.error('renderAll ['+name+']:', e.message); var el=document.getElementById('tab-'+name); if(el) el.innerHTML='<div class="error-box">שגיאה ב'+name+': '+e.message+'</div>'; }
}
function renderAll(d){
  window._lastData = d;
  safeRender(renderOverview,'overview',d);
  safeRender(renderIBKR,'ibkr',d);
  safeRender(renderFAIR,'fair',d);
  safeRender(renderCash,'cash',d);
  safeRender(renderAlloc,'alloc',d);
  safeRender(renderDividends,'dividends',d);
  safeRender(renderCommissions,'commissions',d);
  safeRender(renderIntegrity,'integrity',d);
  safeRender(renderHistory,'history',d);
  safeRender(renderSavings,'savings',d);
  safeRender(renderTax,'tax',d);
  safeRender(renderHeatmap,'heatmap',d);
  if(isMobileDevice()) { try { renderMobileHome(d); } catch(e){ console.error('renderMobileHome:', e.message); } }
  setTimeout(initFAB, 500);
  // Count-up animation on all numbers
  setTimeout(function(){ animateAllNumbers(); }, 100);
  setTimeout(function(){ flashRefresh(); }, 50);
  setTimeout(function(){ updateTabBadges(d); }, 500);
  setTimeout(function(){ if(window._divCalendarData){var ch=renderFinancialCalendar(window._divCalendarData);if(ch)document.getElementById('tab-overview').insertAdjacentHTML('beforeend',ch);}}, 2500);
  setTimeout(function(){ if(d.history && d.history.history) drawKPISparks(d.history.history); }, 400);
  // Fallback: retry FAB init after 2s if not visible
  setTimeout(function(){
    if(isMobileDevice() && !document.querySelector('.fab-container')) {
      console.log('FAB retry...');
      initFAB();
    }
  }, 2000);
}

function isMobileDevice(){ return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent); }

function renderMobileHome(d){
  const s=d.summary, ib=d.ibkr, fa=d.fair, usd=d.meta.usdIls;
  const rg=d.realizedGains||{totalILS:0,totalUSD:0};
  const dv=d.dividends||{totals:{netUSD:0,netILS:0}};
  function tile(dest, accent, tileBg, icon, label, val, sub, badge, badgeCls){
    return `<div class="m-tile" onclick="mobileGoTo('${dest}')" style="--accent:${accent};--tile-bg:${tileBg}">
      <div class="m-tile-icon-circle">${icon}</div>
      <div class="m-tile-body">
        <div class="m-tile-label">${label}</div><div class="m-tile-val">${val}</div>
        ${sub?`<div class="m-tile-sub">${sub}</div>`:''}
        ${badge?`<div class="m-tile-badge ${badgeCls||''}">${badge}</div>`:''}
      </div><div class="m-tile-arrow">›</div></div>`;
  }
  fillVersionBadges();
  document.getElementById('mobile-home').innerHTML = `
  <div class="m-screen">
    <div class="m-hero" onclick="mobileGoTo('overview')">
      <div class="m-hero-label">שווי כולל תיק</div>
      <div class="m-hero-val" data-count="${s.grandTotal}" data-prefix="₪">₪0</div>
      <div class="m-hero-sub ${cls(s.totalReturn)}">${sgn(s.totalReturn)}₪${fmt(Math.abs(s.totalReturn))} (${sgn(s.totalRetPct)}${pct(s.totalRetPct)}) · כולל רווח ממומש</div>
      <div class="m-hero-rate">USD/ILS ${(Number(usd)||0).toFixed(4)} · ${d.meta.updatedAt}</div>
      <div class="ver-badge" id="verBadgeM" onclick="showVersionToast()" style="display:inline-block;margin-top:6px"></div>
    </div>
    <div class="m-tiles">
      ${tile('fair','#0CAF60','rgba(12,175,96,0.12)','🇮🇱','FAIR — קרנות נאמנות','₪'+fmt(s.fairVal),fa.positions.length+' קרנות',sgn(fa.totalPL)+'₪'+fmt(Math.abs(fa.totalPL)),cls(fa.totalPL))}
      ${tile('ibkr','#3B6FE8','rgba(59,111,232,0.12)','📈','IBKR — ניירות ערך','₪'+fmt(s.ibkrVal),fmtD(s.ibkrVal/usd),sgn(ib.totalRet)+'₪'+fmt(Math.abs(ib.totalRet)),cls(ib.totalRet))}
      ${tile('dividends','#F5A623','rgba(245,166,35,0.12)','📅','דיבידנדים (נטו)','₪'+fmt(dv.totals.netILS||0),'$'+fmt(dv.totals.netUSD||0)+' נטו','','')}
      ${tile('cash','#7C5CFC','rgba(124,92,252,0.12)','🏦','מזומן ובנקים','₪'+fmt(d.cash.total),'IBKR: ₪'+fmt(ib.cash)+' | בנקים: ₪'+fmt(d.cash.banks),'','')}
      ${tile('ibkr','#E8394A','rgba(232,57,74,0.12)','💸','רווח ממומש','₪'+fmt(rg.totalILS),'$'+fmt(rg.totalUSD),'','pos')}
      ${tile('alloc','#F5A623','rgba(245,166,35,0.12)','🥧','הקצאת תיק',pct(s.ibkrVal/s.grandTotal),'IBKR מתוך סה"כ התיק','','')}
      ${tile('commissions','#E8394A','rgba(232,57,74,0.12)','💸','עמלות','$'+fmt(d.commissions?d.commissions.totals.totalUSD:0),d.commissions?d.commissions.totals.txCount+' עסקאות':'','')}
      ${tile('integrity','#0CAF60','rgba(12,175,96,0.12)','🔍','בדיקות שלמות',d.integrity?(d.integrity.passed?'✅ תקין':'⚠️ '+d.integrity.issues.length+' בעיות'):'-','לחץ לפרטים','','')}
      ${tile('analysis','#3B6FE8','rgba(59,111,232,0.12)','📊','ניתוח וחדשות','לחץ לפרטים','benchmarks, sectors, news','','')}
      ${tile('heatmap','#FF6B35','rgba(255,107,53,0.12)','🔥','Heatmap תיק','מפת חום','רווחים והפסדים במבט אחד','heatmap','')}
      ${tile('fx','#2D5BFF','rgba(45,91,255,0.12)','💱','חשיפת מט"ח','USD/ILS','פילוח מטבעי של התיק','fx','')}
      ${tile('history','#7C5CFC','rgba(124,92,252,0.12)','📈','היסטוריית תיק','לחץ לפרטים','מגמת שווי לאורך זמן','','')}
      ${tile('savings','#00B8D9','rgba(0,184,217,0.12)','👶','חיסכון לכל ילד','₪'+fmt(d.savings?d.savings.total:0),(d.savings?d.savings.kids.length:0)+' ילדים','','')}
    ${tile('tax','#E8394A','rgba(232,57,74,0.12)','🧾','מחשבון מס','₪'+fmt(d.taxData?d.taxData.totals.taxDueILS:0),'מס שנתי לתשלום','','')}
    ${tile('emergency','#E8394A','rgba(232,57,74,0.12)','🆘','דף חירום','🔒 מאובטח','הוראות ודרכי גישה','','')}
    </div>
  </div>`;
}

// ══════════════════════════════════════════════════════════
// ✅ v11.6.0.3: מצב כרטיסים — מלא, גדול, מודגש. כל טבלה רחבה (4+ עמודות)
// הופכת לכרטיסים: כותרת (עמודה 1) + רשת "תווית: ערך" בפונט גדול, ואם יש
// עמודת תשואה/רווח (מסומנת pos/neg בקוד) — היא מתבלטת כפס צבעוני גדול בתחתית.
// ההמרה מעבירה nodes קיימים (לא innerHTML) — ספארקליינים ואינטראקציות נשמרים.
// ══════════════════════════════════════════════════════════
function mobilizeTables(root){
  if(!root || !document.documentElement.classList.contains('is-mobile')) return;
  Array.prototype.slice.call(root.querySelectorAll('.table-wrap')).forEach(function(wrap){
    var table = wrap.querySelector('table');
    if(!table || !table.rows.length) return;
    var headRow = (table.tHead && table.tHead.rows[0]) || null;
    var headers = headRow ? Array.prototype.map.call(headRow.cells, function(c){ return (c.textContent||'').trim(); }) : null;
    var bodyRows = table.tBodies.length ? Array.prototype.slice.call(table.tBodies[0].rows) : [];
    if(!bodyRows.length) return;
    var nCols = headers ? headers.length : bodyRows[0].cells.length;
    if(nCols < 4) return; // טבלה צרה — נשארת כטבלה, היא נכנסת למסך
    var cards = document.createElement('div');
    cards.className = 'm-cards';
    bodyRows.forEach(function(tr){
      var cells = Array.prototype.slice.call(tr.cells);
      if(!cells.length) return;
      var isPosNeg = function(cell){ return cell.classList.contains('pos') || cell.classList.contains('neg') || !!cell.querySelector('.pos,.neg'); };
      // עמודת ה"תשואה" — האחרונה מבין העמודות המסומנות pos/neg (ממוקמת בד"כ בסוף השורה בקוד הקיים)
      var heroIdx = -1;
      for(var k=cells.length-1;k>=1;k--){ if(isPosNeg(cells[k])){ heroIdx = k; break; } }
      var card = document.createElement('div');
      card.className = 'm-card-row' + ((tr.className||'').indexOf('row-total') >= 0 ? ' m-card-total' : '');
      var title = document.createElement('div');
      title.className = 'm-card-title';
      while(cells[0].firstChild) title.appendChild(cells[0].firstChild);
      card.appendChild(title);
      var grid = document.createElement('div');
      grid.className = 'm-card-grid';
      for(var i=1;i<cells.length;i++){
        if(i === heroIdx) continue; // הועבר לפס הגדול בתחתית
        var cell = document.createElement('div');
        cell.className = 'm-cell'; // ✅ v11.6.0.4: אריח עם רקע — לא טקסט צף על לבן
        var lbl = document.createElement('div');
        lbl.className = 'm-cell-l';
        lbl.textContent = (headers && headers[i]) ? headers[i] : '';
        cell.appendChild(lbl);
        var val = document.createElement('div');
        val.className = 'm-cell-v';
        while(cells[i].firstChild) val.appendChild(cells[i].firstChild);
        cell.appendChild(val);
        grid.appendChild(cell);
      }
      if(grid.children.length) card.appendChild(grid);
      if(heroIdx > -1){
        var heroCell = cells[heroIdx];
        var sign = heroCell.classList.contains('neg') || !!heroCell.querySelector('.neg') ? 'neg' : 'pos';
        var hero = document.createElement('div');
        hero.className = 'm-card-hero ' + sign;
        var hlbl = document.createElement('div');
        hlbl.className = 'm-cell-l';
        hlbl.textContent = (headers && headers[heroIdx]) ? headers[heroIdx] : '';
        var hval = document.createElement('div');
        hval.className = 'm-cell-v';
        while(heroCell.firstChild) hval.appendChild(heroCell.firstChild);
        var heroInner = document.createElement('div');
        heroInner.appendChild(hlbl);
        heroInner.appendChild(hval);
        hero.appendChild(heroInner);
        card.appendChild(hero);
      }
      cards.appendChild(card);
    });
    wrap.parentNode.replaceChild(cards, wrap);
  });
}

function mobileGoTo(id){
  // Auto-lock emergency when navigating away
  if(id !== 'emergency' && _emgUnlocked){
    if(typeof emgLockMobile === 'function') emgLockMobile();
    if(_emgTimer){ clearTimeout(_emgTimer); _emgTimer = null; }
  }
  document.getElementById('mobile-home').style.display='none';
  document.getElementById('mobile-detail').style.display='block';
  const labels={overview:'סקירה כללית',ibkr:'IBKR',fair:'FAIR',cash:'מזומן ובנקים',alloc:'הקצאה',dividends:'📅 דיבידנדים',commissions:'💸 עמלות',integrity:'🔍 שלמות',analysis:'📊 ניתוח וחדשות',heatmap:'🔥 Heatmap',fx:'💱 חשיפת מט"ח',history:'📈 היסטוריה',savings:'חיסכון לכל ילד',tax:'🧾 מחשבון מס',emergency:'🆘 חירום'};
  document.getElementById('mobile-detail-title').textContent = labels[id]||id;
  window.scrollTo(0,0);
  const body = document.getElementById('mobile-detail-body');
  body.innerHTML = '<div class="skeleton-wrap"><div class="skeleton-grid"><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div><div class="skeleton-tile"><div class="skeleton-line short"></div><div class="skeleton-line big"></div><div class="skeleton-line medium"></div></div></div><div class="skeleton-card"><div class="skeleton-line long"></div><div class="skeleton-line long"></div><div class="skeleton-line medium"></div><div class="skeleton-line long"></div></div></div>';
  setTimeout(()=>{
    const d = window._lastData; if(!d) return;
    const realTab = document.getElementById('tab-'+id);
    const origHTML = realTab ? realTab.innerHTML : '';
    if(id==='overview')  renderOverview(d);
    if(id==='ibkr')      renderIBKR(d);
    if(id==='fair')      renderFAIR(d);
    if(id==='cash')      renderCash(d);
    if(id==='alloc')     renderAlloc(d);
    if(id==='dividends')   renderDividends(d);
    if(id==='commissions') renderCommissions(d);
    if(id==='integrity')   renderIntegrity(d);
    if(id==='analysis')    { body.innerHTML='<div class="loading"><div class="spinner"></div><span>טוען ניתוח וחדשות...</span></div>'; loadAnalysisData(body); return; }
    if(id==='history')     renderHistory(d);
    if(id==='savings')     renderSavings(d);
    if(id==='tax')         renderTax(d);
    if(id==='heatmap')   { renderHeatmap(d); body.innerHTML = document.getElementById('tab-heatmap').innerHTML; try{ mobilizeTables(body); }catch(e){} return; }
    if(id==='fx')        { body.innerHTML = '<div id="fxExposureMobile"></div>'; renderCurrencyExposure(d, 'fxExposureMobile'); try{ mobilizeTables(body); }catch(e){} return; }
    if(id==='emergency') { 
      body.innerHTML = '<div style="padding:2rem;text-align:center">' +
        '<div style="font-size:64px;margin-bottom:1rem">🆘</div>' +
        '<h2 style="font-size:1.5rem;margin-bottom:0.5rem">דף חירום</h2>' +
        '<p style="color:var(--muted);margin-bottom:2rem">הוראות ודרכי גישה לכל חשבון</p>' +
        '<div style="max-width:400px;margin:0 auto">' +
        '<input type="password" id="emgPwdM" placeholder="סיסמה" style="width:100%;padding:14px;border:2px solid var(--border);border-radius:12px;font-size:18px;text-align:center;font-family:Heebo,sans-serif;outline:none;transition:border 0.2s;background:var(--bg2);color:var(--text)">' +
        '<button onclick="emgUnlockMobile()" style="width:100%;margin-top:12px;padding:14px;background:linear-gradient(135deg,#E8394A,#FF6B6B);color:#fff;border:none;border-radius:12px;font-size:18px;font-weight:700;cursor:pointer;font-family:Heebo,sans-serif">פתח</button>' +
        '<div id="emgMsgM" style="margin-top:12px;font-size:14px;min-height:20px"></div>' +
        '</div></div>';
      return; }
    if(realTab){ body.innerHTML = realTab.innerHTML; realTab.innerHTML = origHTML; }
    if(id==='alloc') renderAllocInBody(d, body);
    if(id==='overview') renderOverviewInBody(d, body);
    if(id==='dividends') renderDividendsInBody(d, body);
    if(id==='commissions') renderCommissionsInBody(d, body);
    // ✅ v11.6.0.2: המרת טבלאות רחבות לכרטיסים
    try{ mobilizeTables(body); }catch(e){ console.warn('mobilize: ' + e.message); }
  }, 50);
}


// ══════════════════════════════════
// ✅ חדש: דף דיבידנדים
// ══════════════════════════════════
function renderDividends(d){
  const dv = d.dividends || { summary: [], forecast: [], totals: { grossUSD: 0, taxUSD: 0, netUSD: 0, netILS: 0 } };
  const t = dv.totals || {};
  let h = `
  <div class="kpi-grid">
    <div class="kpi"><div class="kpi-icon kpi-icon-green">💵</div>
      <div class="kpi-label">סה"כ גולמי</div>
      <div class="kpi-value">$${fmt(t.grossUSD||0)}</div>
      <div class="kpi-sub">₪${fmt(t.netILS||0)} (נטו)</div>
    </div>
    <div class="kpi"><div class="kpi-icon kpi-icon-red">🔴</div>
      <div class="kpi-label">ניכוי מס ארה"ב</div>
      <div class="kpi-value neg">-$${fmt(Math.abs(t.taxUSD||0))}</div>
      <div class="kpi-sub">25% ניכוי ממקור</div>
    </div>
    <div class="kpi"><div class="kpi-icon kpi-icon-blue">✅</div>
      <div class="kpi-label">סה"כ נטו</div>
      <div class="kpi-value pos">$${fmt(t.netUSD||0)}</div>
      <div class="kpi-sub pos">₪${fmt(t.netILS||0)}</div>
    </div>
    <div class="kpi"><div class="kpi-icon kpi-icon-yellow">📊</div>
      <div class="kpi-label">מספר ניירות</div>
      <div class="kpi-value">${(dv.summary||[]).length}</div>
      <div class="kpi-sub">ניירות עם דיבידנד</div>
    </div>
  </div>

  <div class="sec">גרף דיבידנדים לפי נייר (נטו)</div>
  <div class="card">
    <div class="pie-grid">
      <div style="position:relative;height:220px"><canvas id="divPieC" role="img" aria-label="גרף דיבידנדים לפי נייר"></canvas></div>
      <div class="leg-list" id="divPieLeg"></div>
    </div>
  </div>

  <div class="sec">סיכום לפי נייר (נטו לאחר מס)</div>
  <div class="table-wrap"><table>
    <thead><tr><th>סימבול</th><th>גולמי ($)</th><th>מס ($)</th><th>נטו ($)</th><th>נטו (₪)</th></tr></thead>
    <tbody>`;
  (dv.summary||[]).forEach(r=>{
    h+=`<tr>
      <td><strong>${r.symbol}</strong></td>
      <td class="mono">$${fmt(r.grossUSD)}</td>
      <td class="mono neg">-$${fmt(Math.abs(r.taxUSD))}</td>
      <td class="mono pos">$${fmt(r.netUSD)}</td>
      <td class="mono pos">₪${fmt(r.netILS)}</td>
    </tr>`;
  });
  h+=`<tr class="row-total">
    <td>סה"כ</td>
    <td class="mono">$${fmt(t.grossUSD||0)}</td>
    <td class="mono neg">-$${fmt(Math.abs(t.taxUSD||0))}</td>
    <td class="mono pos">$${fmt(t.netUSD||0)}</td>
    <td class="mono pos">₪${fmt(t.netILS||0)}</td>
  </tr>`;
  h+=`</tbody></table></div>

  <div class="sec">📅 צפי דיבידנדים עד סוף 2026</div>
  <div class="table-wrap"><table>
    <thead><tr><th>סימבול</th><th>דיבידנד אחרון</th><th>צפי הבא</th><th>צפי שנתי ($)</th><th>תדירות</th></tr></thead>
    <tbody>`;
  (dv.forecast||[]).forEach(f=>{
    if(!f.symbol) return;
    h+=`<tr>
      <td><strong>${f.symbol}</strong></td>
      <td class="mono">${f.lastDividend||'-'}</td>
      <td class="mono">${f.nextEstimate||'-'}</td>
      <td class="mono">$${(Number(f.annualEstUSD)||0).toFixed(4)}</td>
      <td><span class="chip chip-blue">${f.frequency||'-'}</span></td>
    </tr>`;
  });
  h+=`</tbody></table></div>`;
  h += '<div id="divCalendarDesktop"></div>';
  document.getElementById('tab-dividends').innerHTML=h;

  // Dividend calendar (lazy load)
  setTimeout(function(){ renderDividendCalendar('divCalendarDesktop'); }, 200);

  // Pie chart
  const sum = dv.summary||[];
  const pieData = sum.filter(r=>r.netUSD>0);
  const labels = pieData.map(r=>r.symbol);
  const values = pieData.map(r=>r.netUSD);
  const total = values.reduce((a,b)=>a+b,0);
  const lg = document.getElementById('divPieLeg');
  if(lg){
    pieData.forEach((r,i)=>{
      lg.innerHTML += `<div class="leg-row"><div class="leg-sq" style="background:${C[i%C.length]}"></div><span>${r.symbol}</span><span class="leg-pct">${pct(r.netUSD/total)}</span></div>`;
    });
  }
  const pieEl = document.getElementById('divPieC');
  if(pieEl){
    if(charts.divPie) charts.divPie.destroy();
    charts.divPie = new Chart(pieEl,{
      type:'doughnut',
      data:{labels:labels,datasets:[{data:values,backgroundColor:labels.map((_,i)=>C[i%C.length]),borderWidth:2,borderColor:'var(--card)'}]},
      options:{responsive:true,maintainAspectRatio:false,cutout:'60%',plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>' $'+fmt(ctx.raw)+' ('+pct(ctx.raw/total)+')'}}}}
    });
  }
}

function renderDividendsInBody(d, body){
  const pieEl = body.querySelector('#divPieC');
  if(!pieEl) return;
  // Add dividend calendar container to mobile body
  var calDiv = document.createElement('div');
  calDiv.id = 'divCalendarMobile';
  body.appendChild(calDiv);
  setTimeout(function(){ renderDividendCalendar('divCalendarMobile'); }, 300);
  const dv = d.dividends||{summary:[]};
  const pieData = (dv.summary||[]).filter(r=>r.netUSD>0);
  const labels = pieData.map(r=>r.symbol);
  const values = pieData.map(r=>r.netUSD);
  const total = values.reduce((a,b)=>a+b,0)||1;
  if(charts.divPieM) charts.divPieM.destroy();
  charts.divPieM = new Chart(pieEl,{
    type:'doughnut',
    data:{labels:labels,datasets:[{data:values,backgroundColor:labels.map((_,i)=>C[i%C.length]),borderWidth:2,borderColor:'var(--card)'}]},
    options:{responsive:true,maintainAspectRatio:false,cutout:'60%',plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>' $'+fmt(ctx.raw)+' ('+pct(ctx.raw/total)+')'}}}}
  });
}

// ══════════════════════════════════
// ══════════════════════════════════════════════════════════
// ✅ חדש: דף עמלות
// ══════════════════════════════════════════════════════════
function renderCommissions(d){
  const cm = d.commissions || { totals: { totalUSD: 0, totalILS: 0, txCount: 0 }, bySymbol: [], byMonth: [], transactions: [] };
  const fc = d.fairCommissions || { totals: { totalILS: 0, txCount: 0 }, bySymbol: [], transactions: [] };
  const t = cm.totals || {};
  const ft = fc.totals || {};
  const combinedILS = (t.totalILS||0) + (ft.totalILS||0);
  let h = `
  <div class="kpi-grid">
    <div class="kpi"><div class="kpi-icon kpi-icon-red">💸</div>
      <div class="kpi-label">סה"כ עמלות (IBKR+FAIR)</div>
      <div class="kpi-value neg">₪${fmt(combinedILS)}</div>
      <div class="kpi-sub">IBKR: $${fmt(t.totalUSD||0)} · FAIR: ₪${fmt(ft.totalILS||0)}</div>
    </div>
    <div class="kpi"><div class="kpi-icon kpi-icon-blue">📊</div>
      <div class="kpi-label">מספר עסקאות</div>
      <div class="kpi-value">${(t.txCount||0)+(ft.txCount||0)}</div>
      <div class="kpi-sub">IBKR: ${t.txCount||0} · FAIR: ${ft.txCount||0}</div>
    </div>
    <div class="kpi"><div class="kpi-icon kpi-icon-yellow">📈</div>
      <div class="kpi-label">ממוצע לעסקה (IBKR)</div>
      <div class="kpi-value">$${(t.avgPerTrade||0).toFixed(2)}</div>
      <div class="kpi-sub">₪${fmt((t.avgPerTrade||0)*(d.meta?.usdIls||3))}</div>
    </div>
    <div class="kpi"><div class="kpi-icon kpi-icon-purple">🎯</div>
      <div class="kpi-label">ניירות/קרנות פעילים</div>
      <div class="kpi-value">${(cm.bySymbol||[]).length + (fc.bySymbol||[]).length}</div>
      <div class="kpi-sub">IBKR: ${(cm.bySymbol||[]).length} · FAIR: ${(fc.bySymbol||[]).length}</div>
    </div>
  </div>

  <div class="sec">🏦 IBKR — עמלות לפי נייר</div>
  <div class="table-wrap"><table>
    <thead><tr><th>סימבול</th><th>סה"כ עמלה ($)</th><th>עסקאות</th><th>קנייה</th><th>מכירה</th><th>ממוצע ($)</th></tr></thead>
    <tbody>`;
  (cm.bySymbol||[]).forEach(r=>{
    h+=`<tr>
      <td><strong>${r.symbol}</strong></td>
      <td class="mono neg">$${(r.totalUSD||0).toFixed(2)}</td>
      <td class="mono">${r.count}</td>
      <td class="mono">${r.buys||0}</td>
      <td class="mono">${r.sells||0}</td>
      <td class="mono">$${(r.totalUSD||0).toFixed(2)}</td>
    </tr>`;
  });
  h+=`<tr class="row-total">
    <td>סה"כ</td>
    <td class="mono neg">$${fmt(t.totalUSD||0)}</td>
    <td class="mono">${t.txCount||0}</td>
    <td class="mono">${t.buyCount||0}</td>
    <td class="mono">${t.sellCount||0}</td>
    <td class="mono">$${(t.avgPerTrade||0).toFixed(2)}</td>
  </tr>`;
  h+=`</tbody></table></div>

  <div class="sec">🇮🇱 FAIR — עמלות לפי קרן</div>
  <div class="table-wrap"><table>
    <thead><tr><th>קרן</th><th>סה"כ עמלה (₪)</th><th>עסקאות</th><th>קנייה</th><th>מכירה</th><th>ממוצע (₪)</th></tr></thead>
    <tbody>`;
  (fc.bySymbol||[]).forEach(r=>{
    h+=`<tr>
      <td><strong>${r.symbol}</strong></td>
      <td class="mono neg">₪${(r.totalILS||0).toFixed(2)}</td>
      <td class="mono">${r.count}</td>
      <td class="mono">${r.buys||0}</td>
      <td class="mono">${r.sells||0}</td>
      <td class="mono">₪${(r.count>0?(Number(r.totalILS)||0)/r.count:0).toFixed(2)}</td>
    </tr>`;
  });
  h+=`<tr class="row-total">
    <td>סה"כ</td>
    <td class="mono neg">₪${fmt(ft.totalILS||0)}</td>
    <td class="mono">${ft.txCount||0}</td>
    <td class="mono">${ft.buyCount||0}</td>
    <td class="mono">${ft.sellCount||0}</td>
    <td class="mono">₪${(ft.avgPerTrade||0).toFixed(2)}</td>
  </tr>`;
  h+=`</tbody></table></div>

  <div class="sec">📊 IBKR — עמלות לפי חודש</div>
  <div class="card"><div style="position:relative;height:220px"><canvas id="commBarC" role="img" aria-label="עמלות לפי חודש"></canvas></div></div>

  <div class="sec">🏦 IBKR — פירוט עסקאות (אחרונות)</div>
  <div class="table-wrap" style="max-height:400px;overflow-y:auto"><table>
    <thead><tr><th>תאריך</th><th>סימבול</th><th>סוג</th><th>כמות</th><th>מחיר ($)</th><th>עמלה ($)</th></tr></thead>
    <tbody>`;
  (cm.transactions||[]).slice(0,50).forEach(tx=>{
    h+=`<tr>
      <td class="mono">${tx.date||'-'}</td>
      <td><strong>${tx.symbol}</strong></td>
      <td><span class="chip ${tx.type==='BUY'?'chip-green':'chip-blue'}">${tx.type||'-'}</span></td>
      <td class="mono">${tx.qty||0}</td>
      <td class="mono">$${(Number(tx.price)||0).toFixed(2)}</td>
      <td class="mono neg">$${(Number(tx.commission)||0).toFixed(2)}</td>
    </tr>`;
  });
  h+=`</tbody></table></div>

  <div class="sec">🇮🇱 FAIR — פירוט עסקאות</div>
  <div class="table-wrap" style="max-height:400px;overflow-y:auto"><table>
    <thead><tr><th>תאריך</th><th>קרן</th><th>סוג</th><th>כמות</th><th>עמלה (₪)</th></tr></thead>
    <tbody>`;
  (fc.transactions||[]).forEach(tx=>{
    h+=`<tr>
      <td class="mono">${tx.date||'-'}</td>
      <td><strong>${tx.name||tx.symbol}</strong></td>
      <td><span class="chip ${tx.type==='BUY'?'chip-green':'chip-blue'}">${tx.type||'-'}</span></td>
      <td class="mono">${fmt(tx.qty||0)}</td>
      <td class="mono neg">₪${(Number(tx.commission)||0).toFixed(2)}</td>
    </tr>`;
  });
  h+=`</tbody></table></div>`;

  document.getElementById('tab-commissions').innerHTML=h;

  // Bar chart — monthly commissions
  const months = cm.byMonth||[];
  if(months.length > 0 && document.getElementById('commBarC')){
    if(charts.commBar) charts.commBar.destroy();
    const labels = months.map(m => {
      const parts = (m.month||'').split('-');
      const names = ['ינו','פבר','מרץ','אפר','מאי','יונ','יול','אוג','ספט','אוק','נוב','דצמ'];
      return names[parseInt(parts[1])-1] + ' ' + parts[0].slice(2);
    });
    const data = months.map(m => m.totalUSD);
    const gc=getComputedStyle(document.body).getPropertyValue('--border')||'#E4EAF4';
    const tc=getComputedStyle(document.body).getPropertyValue('--muted')||'#6B7FA8';
    const bc=getComputedStyle(document.body).getPropertyValue('--blue')||'#3B6FE8';
    charts.commBar = new Chart(document.getElementById('commBarC'),{
      type:'bar',
      data:{labels:labels,datasets:[{label:'עמלה ($)',data:data,backgroundColor:bc,borderWidth:0,borderRadius:4}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>' $'+ctx.raw.toFixed(2)}}},
        scales:{x:{ticks:{color:tc,font:{size:11}},grid:{display:false}},y:{ticks:{color:tc,callback:v=>'$'+v},grid:{color:gc}}}}
    });
  }
}

function renderCommissionsInBody(d, body){
  const months = (d.commissions||{}).byMonth||[];
  if(months.length === 0) return;
  const canvas = body.querySelector('#commBarC');
  if(!canvas) return;
  const labels = months.map(m => {
    const parts = (m.month||'').split('-');
    const names = ['ינו','פבר','מרץ','אפר','מאי','יונ','יול','אוג','ספט','אוק','נוב','דצמ'];
    return names[parseInt(parts[1])-1] + ' ' + parts[0].slice(2);
  });
  const data = months.map(m => m.totalUSD);
  const gc=getComputedStyle(document.body).getPropertyValue('--border')||'#E4EAF4';
  const tc=getComputedStyle(document.body).getPropertyValue('--muted')||'#6B7FA8';
  const bc=getComputedStyle(document.body).getPropertyValue('--blue')||'#3B6FE8';
  if(charts.commBarM) charts.commBarM.destroy();
  charts.commBarM = new Chart(canvas,{
    type:'bar',
    data:{labels:labels,datasets:[{label:'עמלה ($)',data:data,backgroundColor:bc,borderWidth:0,borderRadius:4}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>' $'+ctx.raw.toFixed(2)}}},
      scales:{x:{ticks:{color:tc,font:{size:11}},grid:{display:false}},y:{ticks:{color:tc,callback:v=>'$'+v},grid:{color:gc}}}}
  });
}

// ══════════════════════════════════════════════════════════
// ✅ דף שלמות — בדיקות אוטומטיות
// ══════════════════════════════════════════════════════════
function renderIntegrity(d){
  const it = d.integrity || { issues: [], passed: true };
  const issues = it.issues || [];
  let h = `
  <div class="kpi-grid">
    <div class="kpi"><div class="kpi-icon" style="background:${it.passed?'var(--green-light)':'var(--red-light)'}">${it.passed?'✅':'⚠️'}</div>
      <div class="kpi-label">סטטוס מערכת</div>
      <div class="kpi-value ${it.passed?'pos':'neg'}">${it.passed?'תקין':'בעיות'}</div>
      <div class="kpi-sub">${issues.length} בדיקות${issues.length>0?' נכשלו':''}</div>
    </div>
    <div class="kpi"><div class="kpi-icon kpi-icon-blue">📊</div>
      <div class="kpi-label">סה"כ בדיקות</div>
      <div class="kpi-value">${issues.length}</div>
      <div class="kpi-sub">בעיות שזוהו</div>
    </div>
  </div>`;

  if(issues.length === 0){
    h += `<div class="card" style="text-align:center;padding:3rem"><div style="font-size:48px;margin-bottom:1rem">✅</div><div style="font-size:18px;font-weight:700;color:var(--green)">כל הבדיקות עברו בהצלחה</div><div style="margin-top:0.5rem;color:var(--muted)">אין פערים בין IBKR לעלויות קנייה, מזומן תקין, שערים תקינים</div></div>`;
  } else {
    h += `<div class="sec">פירוט בעיות (${issues.length})</div><div class="table-wrap"><table><thead><tr><th>#</th><th>בעיה</th></tr></thead><tbody>`;
    issues.forEach((issue, i) => {
      h += `<tr><td class="mono">${i+1}</td><td style="white-space:normal">${issue}</td></tr>`;
    });
    h += `</tbody></table></div>`;
  }

  // Run integrity check button
  h += `<div style="text-align:center;margin-top:1.5rem"><button class="btn-refresh" onclick="runIntegrityFromWeb()">🔍 הרץ בדיקת שלמות מחדש</button></div>`;
  document.getElementById('tab-integrity').innerHTML = h;
}

function runIntegrityFromWeb(){
  document.getElementById('tab-integrity').innerHTML = '<div class="loading"><div class="spinner"></div><span>בודק שלמות...</span></div>';
  google.script.run.withSuccessHandler(function(jsonStr){
    try {
      const result = JSON.parse(jsonStr);
      if(result.error) throw new Error(result.error);
      window._lastData.integrity = result;
      renderIntegrity(window._lastData);
    } catch(e){
      if(_handleAuthError(e)) return;
      document.getElementById('tab-integrity').innerHTML = '<div class="error-box">שגיאה: '+e.message+'</div>';
    }
  }).withFailureHandler(function(err){
    document.getElementById('tab-integrity').innerHTML = '<div class="error-box">שגיאה: '+(err.message||err)+'</div>';
  }).getIntegrityData(_getSessionToken());
}

// ══════════════════════════════════════════════════════════
// ✅ דף ניתוח וחדשות
// ══════════════════════════════════════════════════════════
// טעינה עצלה של ניתוח וחדשות
function loadAnalysisData(targetBody){
  const target = targetBody || document.getElementById('tab-analysis');
  if(!targetBody) target.innerHTML = '<div class="loading"><div class="spinner"></div><span>טוען ניתוח וחדשות...</span></div>';
  google.script.run.withSuccessHandler(function(jsonStr){
    try {
      const an = JSON.parse(jsonStr);
      if(an.error) throw new Error(an.error);
      if(window._lastData) window._lastData.analysis = an;
      if(targetBody){
        // Mobile — render into body
        renderAnalysisContent(an, targetBody);
        try{ mobilizeTables(targetBody); }catch(e){} // ✅ v11.6.0.2
      } else {
        renderAnalysisContent(an, document.getElementById('tab-analysis'));
      }
    } catch(e){
      if(_handleAuthError(e)) return;
      if(targetBody) targetBody.innerHTML = '<div class="error-box">שגיאה: '+e.message+'</div>';
      else document.getElementById('tab-analysis').innerHTML = '<div class="error-box">שגיאה: '+e.message+'</div>';
    }
  }).withFailureHandler(function(err){
    if(targetBody) targetBody.innerHTML = '<div class="error-box">שגיאה: '+(err.message||err)+'</div>';
    else document.getElementById('tab-analysis').innerHTML = '<div class="error-box">שגיאה: '+(err.message||err)+'</div>';
  }).getAnalysisAndNews(_getSessionToken());
}

function renderAnalysisContent(an, target){
  const d = window._lastData || {};
  const bm = an.benchmarks || {};
  let h = `
  <div class="sec">תשואה מול מדדים</div>
  <div class="table-wrap"><table>
    <thead><tr><th>מדד</th><th>תשואה שנתית</th></tr></thead>
    <tbody>
      <tr class="kpi-icon kpi-icon-blue" style="font-weight:700"><td>התיק שלי</td><td class="mono pos">${((Number(bm.portfolio)||0)*100).toFixed(1)}%</td></tr>
      <tr><td>S&P 500</td><td class="mono">${((Number(bm.sp500)||0)*100).toFixed(1)}%</td></tr>
      <tr><td>Nasdaq</td><td class="mono">${((Number(bm.nasdaq)||0)*100).toFixed(1)}%</td></tr>
      <tr><td>MSCI World (URTH)</td><td class="mono">${((Number(bm.msciWorld)||0)*100).toFixed(1)}%</td></tr>
    </tbody>
  </table></div>`;

  const rk = an.risk || {};
  const dd = d.drawdown || {};
  h += `<div class="sec">📏 מדדי סיכון</div>`;
  h += `<div class="kpi-grid">
    <div class="kpi"><div class="kpi-icon kpi-icon-yellow">📊</div><div class="kpi-label">תנודתיות שנתית</div><div class="kpi-value">${((Number(rk.volatility)||0)*100).toFixed(1)}%</div></div>
    <div class="kpi"><div class="kpi-icon kpi-icon-green">🎯</div><div class="kpi-label">Sharpe</div><div class="kpi-value">${(Number(rk.sharpe)||0).toFixed(2)}</div></div>
    <div class="kpi"><div class="kpi-icon kpi-icon-blue">⬇️</div><div class="kpi-label">Sortino</div><div class="kpi-value">${(Number(rk.sortino)||0).toFixed(2)}</div></div>
    <div class="kpi"><div class="kpi-icon kpi-icon-purple">📐</div><div class="kpi-label">Calmar</div><div class="kpi-value">${(Number(rk.calmar)||0).toFixed(2)}</div></div>
    <div class="kpi"><div class="kpi-icon kpi-icon-red">📉</div><div class="kpi-label">מקס' שפל</div><div class="kpi-value">${((Number(dd.maxDrawdownPct)||0)*100).toFixed(1)}%</div></div>
    <div class="kpi"><div class="kpi-icon kpi-icon-yellow">⚡</div><div class="kpi-label">Beta</div><div class="kpi-value">${(Number(dd.beta)||1).toFixed(2)}</div></div>
  </div>`;

  // Benchmark chart for mobile too
  if(an.benchmarkChart && an.benchmarkChart.data && an.benchmarkChart.data.length > 3){
    h += `<div id="benchChartMobile"></div>`;
  }

  const mv = an.movers || {};
  h += `<div class="sec">עולים מובילים</div>
  <div class="table-wrap"><table><thead><tr><th>סימבול</th><th>תשואה</th><th>שווי ₪</th></tr></thead><tbody>`;
  (mv.gainers||[]).forEach(p => { h += `<tr><td><strong>${p.sym}</strong></td><td class="mono pos">+${((Number(p.retPct)||0)*100).toFixed(1)}%</td><td class="mono">₪${fmt(p.valILS)}</td></tr>`; });
  h += `</tbody></table></div>`;

  h += `<div class="sec">יורדים מובילים</div>
  <div class="table-wrap"><table><thead><tr><th>סימבול</th><th>תשואה</th><th>שווי ₪</th></tr></thead><tbody>`;
  (mv.losers||[]).forEach(p => { h += `<tr><td><strong>${p.sym}</strong></td><td class="mono neg">${((Number(p.retPct)||0)*100).toFixed(1)}%</td><td class="mono">₪${fmt(p.valILS)}</td></tr>`; });
  h += `</tbody></table></div>`;

  if(an.sectors && an.sectors.length > 0){
    h += `<div class="sec">חשיפה לסקטורים</div>
    <div class="card"><div class="pie-grid"><div style="position:relative;height:220px"><canvas id="sectorPie" role="img"></canvas></div><div class="leg-list" id="sectorLeg"></div></div></div>
    <div class="table-wrap" style="margin-top:1rem"><table><thead><tr><th>סקטור</th><th>שווי ₪</th><th>אחוז</th></tr></thead><tbody>`;
    an.sectors.forEach(s => { h += `<tr><td>${s.name}</td><td class="mono">₪${fmt(s.valILS)}</td><td class="mono">${((Number(s.pct)||0)*100).toFixed(1)}%</td></tr>`; });
    h += `</tbody></table></div>`;
  }

  if(an.rebalance && an.rebalance.length > 0){
    h += `<div class="sec">⚖️ המלצות איזון תיק</div>
    <div class="card" style="padding:1.5rem">
      <div style="font-size:14px;color:var(--muted);margin-bottom:1rem">ניירות מעל 12% משקל — שקול הקטנת פוזיציה</div>
      <div style="display:flex;flex-direction:column;gap:12px">`;
    an.rebalance.forEach(r => {
      var w = ((Number(r.weight)||0)*100).toFixed(1);
      var barW = Math.min(100, Number(r.weight)*100 * 3); // scale for visual
      var color = Number(r.weight) > 0.15 ? '#E8394A' : '#F5A623';
      h += `<div style="display:flex;align-items:center;gap:16px">
        <div style="font-weight:800;font-size:18px;min-width:80px">${r.sym}</div>
        <div style="flex:1;background:var(--bg3);border-radius:12px;height:28px;overflow:hidden;position:relative">
          <div style="background:${color};height:100%;width:${barW}%;border-radius:12px;transition:width 0.6s ease"></div>
        </div>
        <div style="font-weight:700;font-size:18px;min-width:70px;text-align:left;color:${color}">${w}%</div>
        <div style="font-size:14px;color:var(--muted);min-width:100px;text-align:left">₪${fmt(r.valILS)}</div>
      </div>`;
    });
    h += `</div></div>`;
  }

  if(an.news && an.news.length > 0){
    h += `<div class="sec">📰 חדשות אחרונות</div><div style="display:flex;flex-direction:column;gap:8px">`;
    an.news.slice(0, 15).forEach(article => {
      const date = new Date(article.publishTime || 0).toLocaleDateString('he-IL');
      h += `<div class="card" style="padding:1rem 1.25rem;margin-bottom:0.5rem;cursor:pointer" onclick="window.open('${article.link||'#'}','_blank')">
        <div style="font-size:12px;color:var(--muted);margin-bottom:4px">${article.symbol} · ${article.publisher} · ${date}</div>
        <div style="font-size:14px;font-weight:500">${article.title}</div>
      </div>`;
    });
    h += `</div>`;
  }

  target.innerHTML = h;
  // Sector pie chart
  if(an.sectors && an.sectors.length > 0 && document.getElementById('sectorPie')){
    var sLabels = an.sectors.map(s => s.name);
    var sData = an.sectors.map(s => Number(s.pct)*100);
    var sColors = C.slice(0, sLabels.length);
    if(charts.sectorPie) charts.sectorPie.destroy();
    charts.sectorPie = new Chart(document.getElementById('sectorPie'), {
      type:'doughnut',
      data:{labels:sLabels, datasets:[{data:sData, backgroundColor:sColors, borderWidth:0}]},
      options:{responsive:true, maintainAspectRatio:false, cutout:'55%', plugins:{legend:{display:false}, tooltip:{callbacks:{label:ctx=>' '+ctx.label+': '+ctx.raw.toFixed(1)+'%'}}}}
    });
    var sLeg = document.getElementById('sectorLeg');
    if(sLeg) sLeg.innerHTML = sLabels.map((l,i) => '<div style="display:flex;align-items:center;gap:8px;font-size:14px"><span style="width:12px;height:12px;border-radius:3px;background:'+sColors[i]+'"></span>'+l+' <strong>'+sData[i].toFixed(1)+'%</strong></div>').join('');
  }
  // Mobile benchmark chart — from lazy-loaded analysis data
  if(an.benchmarkChart && an.benchmarkChart.data && an.benchmarkChart.data.length > 3){
    setTimeout(function(){ renderBenchmarkChart(an.benchmarkChart, 'benchChartMobile'); }, 100);
  }
}

function renderAnalysis(d){
  // טעינה עצלה — מציג כפתור טעינה אם אין נתונים
  if(!d.analysis){
    document.getElementById('tab-analysis').innerHTML = `
    <div class="card" style="text-align:center;padding:3rem">
      <div style="font-size:48px;margin-bottom:1rem">📊</div>
      <div style="font-size:18px;font-weight:700;margin-bottom:0.5rem">ניתוח וחדשות</div>
      <div style="color:var(--muted);margin-bottom:1.5rem">טען נתוני ניתוח מול מדדים, סקטורים, וחדשות שוק</div>
      <button class="btn-refresh" onclick="loadAnalysisData()">📊 טען ניתוח</button>
    </div>`;
    return;
  }
  const an = d.analysis;
  const bm = an.benchmarks || {};
  let h = `
  <div class="sec">תשואה מול מדדים</div>
  <div class="table-wrap"><table>
    <thead><tr><th>מדד</th><th>תשואה שנתית</th></tr></thead>
    <tbody>
      <tr class="kpi-icon kpi-icon-blue" style="font-weight:700"><td>התיק שלי</td><td class="mono pos">${((Number(bm.portfolio)||0)*100).toFixed(1)}%</td></tr>
      <tr><td>S&P 500</td><td class="mono">${((Number(bm.sp500)||0)*100).toFixed(1)}%</td></tr>
      <tr><td>Nasdaq</td><td class="mono">${((Number(bm.nasdaq)||0)*100).toFixed(1)}%</td></tr>
      <tr><td>MSCI World (URTH)</td><td class="mono">${((Number(bm.msciWorld)||0)*100).toFixed(1)}%</td></tr>
    </tbody>
  </table></div>`;

  // Risk metrics — enhanced with Sharpe, Sortino, Volatility, Calmar
  const rk = an.risk || {};
  const dd = d.drawdown || {};
  h += `<div class="sec">📏 מדדי סיכון מקצועיים</div>`;
  h += `<div class="kpi-grid">
    <div class="kpi"><div class="kpi-icon kpi-icon-yellow">📊</div><div class="kpi-label">תנודתיות שנתית</div><div class="kpi-value">${((Number(rk.volatility)||0)*100).toFixed(1)}%</div><div class="kpi-sub">סטיית תקן יומית × √252</div></div>
    <div class="kpi"><div class="kpi-icon kpi-icon-green">🎯</div><div class="kpi-label">Sharpe Ratio</div><div class="kpi-value">${(Number(rk.sharpe)||0).toFixed(2)}</div><div class="kpi-sub">${(rk.sharpe||0) > 1 ? '✅ מצוין' : (rk.sharpe||0) > 0.5 ? '✡️ סביר' : '⚠️ נמוך'}</div></div>
    <div class="kpi"><div class="kpi-icon kpi-icon-blue">⬇️</div><div class="kpi-label">Sortino Ratio</div><div class="kpi-value">${(Number(rk.sortino)||0).toFixed(2)}</div><div class="kpi-sub">תנודתיות חלק תחתון בלבד</div></div>
    <div class="kpi"><div class="kpi-icon kpi-icon-purple">📐</div><div class="kpi-label">Calmar Ratio</div><div class="kpi-value">${(Number(rk.calmar)||0).toFixed(2)}</div><div class="kpi-sub">תשואה / מקס' שפל</div></div>
    <div class="kpi"><div class="kpi-icon kpi-icon-red">📉</div><div class="kpi-label">מקס' שפל</div><div class="kpi-value">${((Number(dd.maxDrawdownPct)||0)*100).toFixed(1)}%</div><div class="kpi-sub">${fmt(dd.maxDrawdown||0)} ₪</div></div>
    <div class="kpi"><div class="kpi-icon kpi-icon-yellow">⚡</div><div class="kpi-label">Beta (vs S&P)</div><div class="kpi-value">${(Number(dd.beta)||1).toFixed(2)}</div><div class="kpi-sub">${dd.betaMethod === 'regression' ? 'R²=' + ((dd.betaR2||0)*100).toFixed(0) + '%' : 'אומדן'}</div></div>
  </div>`;

  // Benchmark comparison chart (from lazy-loaded analysis data)
  if(an.benchmarkChart && an.benchmarkChart.data && an.benchmarkChart.data.length > 3){
    h += `<div id="benchChartContainer"></div>`;
  }

  // Top movers
  const mv = an.movers || {};
  h += `<div class="sec">עולים מובילים</div>
  <div class="table-wrap"><table><thead><tr><th>סימבול</th><th>תשואה</th><th>שווי ₪</th></tr></thead><tbody>`;
  (mv.gainers||[]).forEach(p => {
    h += `<tr><td><strong>${p.sym}</strong></td><td class="mono pos">+${((Number(p.retPct)||0)*100).toFixed(1)}%</td><td class="mono">₪${fmt(p.valILS)}</td></tr>`;
  });
  h += `</tbody></table></div>`;

  h += `<div class="sec">יורדים מובילים</div>
  <div class="table-wrap"><table><thead><tr><th>סימבול</th><th>תשואה</th><th>שווי ₪</th></tr></thead><tbody>`;
  (mv.losers||[]).forEach(p => {
    h += `<tr><td><strong>${p.sym}</strong></td><td class="mono neg">${((Number(p.retPct)||0)*100).toFixed(1)}%</td><td class="mono">₪${fmt(p.valILS)}</td></tr>`;
  });
  h += `</tbody></table></div>`;

  // Sector exposure
  if(an.sectors && an.sectors.length > 0){
    h += `<div class="sec">חשיפה לסקטורים</div>
    <div class="table-wrap"><table><thead><tr><th>סקטור</th><th>שווי ₪</th><th>אחוז</th></tr></thead><tbody>`;
    an.sectors.forEach(s => {
      h += `<tr><td>${s.name}</td><td class="mono">₪${fmt(s.valILS)}</td><td class="mono">${((Number(s.pct)||0)*100).toFixed(1)}%</td></tr>`;
    });
    h += `</tbody></table></div>`;
  }

  // Rebalancing
  if(an.rebalance && an.rebalance.length > 0){
    h += `<div class="sec">⚠️ ניירות מעל 12% משקל</div>
    <div class="table-wrap"><table><thead><tr><th>סימבול</th><th>משקל</th><th>שווי ₪</th><th>תשואה</th></tr></thead><tbody>`;
    an.rebalance.forEach(r => {
      h += `<tr><td><strong>${r.sym}</strong></td><td class="mono">${((Number(r.weight)||0)*100).toFixed(1)}%</td><td class="mono">₪${fmt(r.valILS)}</td><td class="mono ${r.retPct>=0?'pos':'neg'}">${((Number(r.retPct)||0)*100).toFixed(1)}%</td></tr>`;
    });
    h += `</tbody></table></div>`;
  }

  // ── 📈 Performance Attribution ──
  if(d.attribution){
    const at = d.attribution;
    h += `<div class="sec">📈 תרומת ניירות לרווח (Attribution)</div>
    <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr)">
      <div class="kpi"><div class="kpi-icon kpi-icon-green">📈</div><div class="kpi-label">תורמים חיוביים</div><div class="kpi-value pos">₪${fmt(at.totalPositive)}</div></div>
      <div class="kpi"><div class="kpi-icon kpi-icon-red">📉</div><div class="kpi-label">מושכים שליליים</div><div class="kpi-value neg">-₪${fmt(at.totalNegative)}</div></div>
      <div class="kpi"><div class="kpi-icon kpi-icon-blue">💎</div><div class="kpi-label">תרומה נטו</div><div class="kpi-value ${at.netContribution>=0?'pos':'neg'}">${at.netContribution>=0?'+':'-'}₪${fmt(Math.abs(at.netContribution))}</div></div>
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th>נייר/קרן</th><th>מקור</th><th>שווי ₪</th><th>תרומה ₪</th><th>תשואה</th></tr></thead><tbody>`;
    at.positions.forEach(function(p){
      h += `<tr>
        <td><strong>${p.name}</strong></td>
        <td><span class="chip ${p.source==='IBKR'?'chip-blue':'chip-green'}">${p.source}</span></td>
        <td class="mono">₪${fmt(p.valueILS)}</td>
        <td class="mono ${p.contribution>=0?'pos':'neg'}">${p.contribution>=0?'+':'-'}₪${fmt(Math.abs(p.contribution))}</td>
        <td class="mono ${p.returnPct>=0?'pos':'neg'}">${p.returnPct>=0?'+':''}${(p.returnPct*100||0).toFixed(1)}%</td>
      </tr>`;
    });
    h += `</tbody></table></div>`;
  }

  // News
  if(an.news && an.news.length > 0){
    h += `<div class="sec">📰 חדשות אחרונות</div><div style="display:flex;flex-direction:column;gap:8px">`;
    an.news.slice(0, 15).forEach(article => {
      const date = new Date(article.publishTime || 0).toLocaleDateString('he-IL');
      h += `<div class="card" style="padding:1rem 1.25rem;margin-bottom:0.5rem;cursor:pointer" onclick="window.open('${article.link||'#'}','_blank')">
        <div style="font-size:12px;color:var(--muted);margin-bottom:4px">${article.symbol} · ${article.publisher} · ${date}</div>
        <div style="font-size:14px;font-weight:500">${article.title}</div>
      </div>`;
    });
    h += `</div>`;
  }

  document.getElementById('tab-analysis').innerHTML = h;
  // Desktop benchmark chart — from lazy-loaded analysis data
  if(d.analysis && d.analysis.benchmarkChart && d.analysis.benchmarkChart.data && d.analysis.benchmarkChart.data.length > 3){
    setTimeout(function(){ renderBenchmarkChart(d.analysis.benchmarkChart, 'benchChartContainer'); }, 100);
  }
}

// ══════════════════════════════════════════════════════════
// ✅ דף היסטוריה
// ══════════════════════════════════════════════════════════
function renderHistory(d){
  const hi = d.history || { history: [] };
  const allHist = hi.history || [];

  // Filter by selected period
  var hist = allHist;
  if(histPeriod !== 'all' && allHist.length > 0){
    var now = new Date();
    var cutoff = new Date();
    if(histPeriod === '1m') cutoff.setMonth(now.getMonth() - 1);
    else if(histPeriod === '3m') cutoff.setMonth(now.getMonth() - 3);
    else if(histPeriod === '6m') cutoff.setMonth(now.getMonth() - 6);
    else if(histPeriod === 'ytd') cutoff = new Date(now.getFullYear(), 0, 1);
    else if(histPeriod === '1y') cutoff.setFullYear(now.getFullYear() - 1);

    // Parse dates (format: dd/MM/yyyy)
    hist = allHist.filter(function(r){
      var parts = r.date.split('/');
      if(parts.length === 3){
        var d = new Date(parts[2], parts[1] - 1, parts[0]);
        return d >= cutoff;
      }
      return true;
    });
    if(hist.length === 0) hist = allHist;
  }

  let h = `
  <div class="kpi-grid">
    <div class="kpi"><div class="kpi-icon kpi-icon-blue">📈</div>
      <div class="kpi-label">נקודות רישום</div>
      <div class="kpi-value">${hist.length}</div>
      <div class="kpi-sub">סך הכל תצפיות</div>
    </div>`;

  if(hist.length > 0){
    const latest = hist[hist.length - 1];
    const first = hist[0];
    const growth = latest.totalValue - first.totalValue;
    const growthPct = first.totalValue > 0 ? growth / first.totalValue : 0;

    h += `<div class="kpi"><div class="kpi-icon kpi-icon-green">💹</div>
      <div class="kpi-label">צמיחה כוללת</div>
      <div class="kpi-value ${growth>=0?'pos':'neg'}">${growth>=0?'+':''}₪${fmt(Math.abs(growth))}</div>
      <div class="kpi-sub">${growth>=0?'+':''}${((Number(growthPct)||0)*100).toFixed(1)}% מאז ${first.date}</div>
    </div>
    <div class="kpi"><div class="kpi-icon kpi-icon-purple">💰</div>
      <div class="kpi-label">שווי נוכחי</div>
      <div class="kpi-value">₪${fmt(latest.totalValue)}</div>
      <div class="kpi-sub">${latest.date}</div>
    </div>
    <div class="kpi"><div class="kpi-icon kpi-icon-yellow">💵</div>
      <div class="kpi-label">USD/ILS נוכחי</div>
      <div class="kpi-value">${(Number(latest.usdIls)||0).toFixed(4)}</div>
      <div class="kpi-sub">${latest.date}</div>
    </div>`;
  } else {
    h += `<div class="kpi"><div class="kpi-label">אין נתונים</div><div class="kpi-value">—</div></div>`;
  }
  h += `</div>`;

  if(allHist.length > 1){
    h += `<div class="hist-periods">
      <button class="hist-period-btn" data-period="1m" onclick="setHistPeriod('1m')">חודש</button>
      <button class="hist-period-btn" data-period="3m" onclick="setHistPeriod('3m')">3 חודשים</button>
      <button class="hist-period-btn" data-period="6m" onclick="setHistPeriod('6m')">6 חודשים</button>
      <button class="hist-period-btn" data-period="ytd" onclick="setHistPeriod('ytd')">מתחילת שנה</button>
      <button class="hist-period-btn" data-period="1y" onclick="setHistPeriod('1y')">שנה</button>
      <button class="hist-period-btn active" data-period="all" onclick="setHistPeriod('all')">הכל</button>
    </div>`;
  }

  if(hist.length > 1){
    h += `<div class="sec">גרף שווי תיק לאורך זמן</div>
    <div class="card"><div style="position:relative;height:300px"><canvas id="histLineC" role="img" aria-label="גרף היסטוריית תיק"></canvas></div></div>`;

    h += `<div class="sec">IBKR vs FAIR — השוואה לאורך זמן</div>
    <div class="card"><div style="position:relative;height:300px"><canvas id="histCompareC" role="img" aria-label="השוואת IBKR ו-FAIR לאורך זמן"></canvas></div></div>`;

    h += `<div class="sec">פירוט נקודות</div>
    <div class="table-wrap" style="max-height:400px;overflow-y:auto"><table>
    <thead><tr><th>תאריך</th><th>סה"כ ₪</th><th>IBKR ₪</th><th>FAIR ₪</th><th>בנקים ₪</th><th>תשואה ₪</th><th>תשואה %</th><th>USD/ILS</th></tr></thead>
    <tbody>`;
    hist.slice().reverse().forEach(r => {
      h += `<tr><td class="mono">${r.date}</td><td class="mono" style="font-weight:700">₪${fmt(r.totalValue)}</td><td class="mono">₪${fmt(r.ibkr)}</td><td class="mono">₪${fmt(r.fair)}</td><td class="mono">₪${fmt(r.banks)}</td><td class="mono ${r.returnILS>=0?'pos':'neg'}">${r.returnILS>=0?'+':''}₪${fmt(Math.abs(r.returnILS))}</td><td class="mono ${r.returnPct>=0?'pos':'neg'}">${r.returnPct>=0?'+':''}${((Number(r.returnPct)||0)*100).toFixed(1)}%</td><td class="mono">${(Number(r.usdIls)||0).toFixed(4)}</td></tr>`;
    });
    h += `</tbody></table></div>`;
  } else {
    h += `<div class="card" class="empty-state" style=");padding:2rem">אין מספיק נתוני היסטוריה. הפעל את הטריגר לשמירת נתונים יומית.</div>`;
  }

  document.getElementById('tab-history').innerHTML = h;

  // Line chart
  if(hist.length > 1 && document.getElementById('histLineC')){
    if(charts.histLine) charts.histLine.destroy();
    const labels = hist.map(r => r.date);
    const totalData = hist.map(r => r.totalValue);
    const ibkrData = hist.map(r => r.ibkr);
    const fairData = hist.map(r => r.fair);
    const gc=getComputedStyle(document.body).getPropertyValue('--border')||'#E4EAF4';
    const tc=getComputedStyle(document.body).getPropertyValue('--muted')||'#6B7FA8';
    charts.histLine = new Chart(document.getElementById('histLineC'),{
      type:'line',
      data:{labels:labels,datasets:[
        {label:'סה"כ תיק',data:totalData,borderColor:'#3B6FE8',backgroundColor:'rgba(59,111,232,0.1)',fill:true,borderWidth:2,pointRadius:3},
        {label:'IBKR',data:ibkrData,borderColor:'#0CAF60',borderWidth:1.5,pointRadius:2,fill:false},
        {label:'FAIR',data:fairData,borderColor:'#F5A623',borderWidth:1.5,pointRadius:2,fill:false}
      ]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:tc,font:{size:12}}}},scales:{x:{ticks:{color:tc,font:{size:10}},grid:{color:gc}},y:{ticks:{color:tc,callback:v=>'₪'+Math.round(v/1000)+'K'},grid:{color:gc}}}}
    });
  }

  // IBKR vs FAIR comparison chart
  if(hist.length > 1 && document.getElementById('histCompareC')){
    if(charts.histCompare) charts.histCompare.destroy();
    const cLabels = hist.map(r => r.date);
    const ibkrData2 = hist.map(r => r.ibkr);
    const fairData2 = hist.map(r => r.fair);
    const cgc=getComputedStyle(document.body).getPropertyValue('--border')||'#E4EAF4';
    const ctc=getComputedStyle(document.body).getPropertyValue('--muted')||'#6B7FA8';
    const ibkrC=getComputedStyle(document.body).getPropertyValue('--blue')||'#2D5BFF';
    const fairC=getComputedStyle(document.body).getPropertyValue('--green')||'#00A862';
    charts.histCompare = new Chart(document.getElementById('histCompareC'),{
      type:'line',
      data:{labels:cLabels,datasets:[
        {label:'IBKR (₪)',data:ibkrData2,borderColor:ibkrC,backgroundColor:'rgba(45,91,255,0.06)',fill:true,borderWidth:2.5,pointRadius:0,tension:0.3},
        {label:'FAIR (₪)',data:fairData2,borderColor:fairC,backgroundColor:'rgba(0,168,98,0.06)',fill:true,borderWidth:2.5,pointRadius:0,tension:0.3}
      ]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true,labels:{color:ctc,font:{size:13}}},tooltip:{callbacks:{label:ctx=>' '+ctx.dataset.label+': ₪'+fmt(ctx.raw)}}},scales:{x:{ticks:{color:ctc,font:{size:11},maxTicksLimit:8},grid:{display:false}},y:{ticks:{color:ctc,callback:v=>'₪'+Math.round(v/1000)+'K'},grid:{color:cgc}}}}
    });
  }
}

// שאר הדפים (זהה למקור)
// ══════════════════════════════════
function renderOverview(d){
  const s=d.summary,ib=d.ibkr,fa=d.fair,usd=d.meta.usdIls;
  let h=`
  <div class="kpi-grid">
    <div class="kpi"><div class="kpi-icon kpi-icon-blue">💰</div><div class="kpi-label">שווי כולל תיק</div><div class="kpi-value" data-count="${s.grandTotal}" data-prefix="₪">₪0</div><div class="kpi-sub pos">כולל רווח ממומש</div>${delt(s.totalReturn,s.totalRetPct)}<canvas class="kpi-spark" id="spark-total" style="width:100%;height:36px;margin-top:6px"></canvas></div>
    <div class="kpi"><div class="kpi-icon" style="background:#EEF3FD">🏦</div><div class="kpi-label">IBKR</div><div class="kpi-value" data-count="${s.ibkrVal}" data-prefix="₪">₪0</div><div class="kpi-sub">${fmtD(s.ibkrVal/usd)} | ${pct(s.ibkrVal/s.grandTotal)}</div><canvas class="kpi-spark" id="spark-ibkr" style="width:100%;height:36px;margin-top:6px"></canvas></div>
    <div class="kpi"><div class="kpi-icon kpi-icon-green">🇮🇱</div><div class="kpi-label">FAIR</div><div class="kpi-value" data-count="${s.fairVal}" data-prefix="₪">₪0</div><div class="kpi-sub">${pct(s.fairVal/s.grandTotal)}</div><canvas class="kpi-spark" id="spark-fair" style="width:100%;height:36px;margin-top:6px"></canvas></div>
    <div class="kpi"><div class="kpi-icon kpi-icon-purple">🏛</div><div class="kpi-label">בנקים ומזומן</div><div class="kpi-value">₪${fmt(s.banksVal+ib.cash+fa.cash)}</div><div class="kpi-sub">בנקים: ₪${fmt(s.banksVal)} | IBKR: ₪${fmt(ib.cash)}</div></div>
  </div>
  <div class="sec">הרכב תיק</div>
  <div class="card"><div class="pie-grid"><div style="position:relative;height:200px"><canvas id="pieC-m" role="img"></canvas></div><div class="leg-list" id="pieLeg"></div></div></div>
  <div class="sec">תשואה לפי מקור</div>
  <div class="card"><div style="position:relative;height:180px"><canvas id="barC-m" role="img"></canvas></div></div>
  h += renderFXExposure(s, d.ibkr, d.fair, d.meta.usdIls);
  h += renderPerfAttribution(d.ibkr);`;
  // ── 🎯 Goal Tracking + Trend Projection ──
  const goal = d.goal;
  if(goal && goal.goalILS > 0){
    const progPct = Math.min(100, goal.progress * 100);
    const barColor = progPct >= 75 ? '#0CAF60' : progPct >= 50 ? '#F5A623' : '#3B6FE8';
    const growthSign = goal.monthlyGrowthRate >= 0 ? '+' : '';
    const growthColor = goal.monthlyGrowthRate >= 0 ? '#0CAF60' : '#E74C3C';
    const usdSign = goal.usdTrendPct >= 0 ? '+' : '';
    const usdColor = goal.usdTrendPct >= 0 ? '#0CAF60' : '#E74C3C';

    h += `<div class="sec">🎯 מעקב יעד — תחזית מגמתית</div>
    <div class="card" style="padding:1.5rem">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem">
        <div><span style="font-size:16px;color:var(--muted)">יעד:</span> <strong style="font-size:20px">₪${fmt(goal.goalILS)}</strong></div>
        <div><span style="font-size:16px;color:var(--muted)">נוכחי:</span> <strong style="font-size:20px">₪${fmt(goal.currentVal)}</strong></div>
      </div>
      <div style="background:var(--bg3);border-radius:16px;height:36px;overflow:hidden;position:relative;box-shadow:inset 0 2px 4px rgba(0,0,0,0.06)">
        <div style="background:linear-gradient(90deg,${barColor} 0%,${barColor}dd 100%);height:100%;width:${progPct}%;border-radius:16px;transition:width 1.2s cubic-bezier(0.16,1,0.3,1);display:flex;align-items:center;justify-content:flex-end;padding-right:12px;font-size:16px;font-weight:800;color:#fff;white-space:nowrap;box-shadow:0 2px 8px ${barColor}66">${(Number(progPct)||0).toFixed(1)}%</div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:0.75rem;font-size:13px;color:var(--muted)">
        <span style="font-size:15px">נותר: ₪${fmt(goal.remaining)}</span>
        ${goal.monthsToGoal > 0 ? `<span>תחזית: ${goal.estimatedDate} (${goal.monthsToGoal} ח׳)</span>` : '<span style="color:var(--muted)">אין מגמה חיובית</span>'}
      </div>
      <!-- פירוט מגמות -->
      <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border)">
        <div style="font-size:13px;font-weight:600;margin-bottom:0.5rem;color:var(--text)">📊 ניתוח מגמות (${goal.histPoints || 0} נקודות היסטוריה)</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;font-size:12px">
          <div style="padding:0.5rem;background:var(--bg3);border-radius:8px">
            <div style="color:var(--muted)">מגמת תיק חודשית</div>
            <div style="font-weight:700;color:${growthColor};font-size:16px">${growthSign}${(Number(goal.monthlyGrowthPct)||0).toFixed(2)}%</div>
          </div>
          <div style="padding:0.5rem;background:var(--bg3);border-radius:8px">
            <div style="color:var(--muted)">מגמת USD/ILS חודשית</div>
            <div style="font-weight:700;color:${usdColor};font-size:16px">${usdSign}${(Number(goal.usdTrendPct)||0).toFixed(3)}%</div>
          </div>
        </div>
        <div style="margin-top:0.5rem;font-size:11px;color:var(--muted)">בסיס: ${goal.trendBasis || 'אין מספיק נתונים'}</div>
      </div>
      <!-- גרף תחזית -->
      ${goal.projectedValues && goal.projectedValues.length > 1 ? `
      <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border)">
        <div style="font-size:13px;font-weight:600;margin-bottom:0.5rem">📈 תחזית קומפאונדינג</div>
        <div style="position:relative;height:160px"><canvas id="goalProjChart"></canvas></div>
      </div>` : ''}
    </div>`;

    // ── ציור גרף תחזית ──
    if(goal.projectedValues && goal.projectedValues.length > 1) {
      setTimeout(function(){
        var pv = goal.projectedValues;
        var labels = pv.map(function(p){return 'ח׳' + p.month;});
        var data = pv.map(function(p){return p.value;});
        var gc = '#E4EAF4', tc = '#6B7FA8';
        var el = document.getElementById('goalProjChart');
        if(!el) return;
        if(charts.goalProj) charts.goalProj.destroy();
        charts.goalProj = new Chart(el, {
          type:'line',
          data:{
            labels: labels,
            datasets:[{
              label:'שווי תחזית (₪)',
              data: data,
              borderColor:'#3B6FE8',
              backgroundColor:'rgba(59,111,232,0.1)',
              fill:true,
              borderWidth:2,
              pointRadius:3,
              pointBackgroundColor:'#3B6FE8',
              tension:0.3
            }]
          },
          options:{
            responsive:true,
            maintainAspectRatio:false,
            plugins:{
              legend:{display:false},
              tooltip:{callbacks:{label:function(ctx){return ' ₪'+fmt(ctx.raw);}}}
            },
            scales:{
              x:{ticks:{color:tc,maxTicksLimit:6},grid:{color:gc}},
              y:{ticks:{color:tc,callback:function(v){return '₪'+Math.round(v/1000)+'K';}},grid:{color:gc}}
            }
          }
        });
      }, 100);
    }
  }

  // ── 💱 Currency Exposure ──
  const ce = d.currencyExposure;
  if(ce && ce.total > 0){
    h += `<div class="sec">💱 חשיפת מטבע</div>
    <div class="card" style="padding:1.5rem">
      <div style="display:flex;gap:1rem;align-items:center;margin-bottom:1rem">
        <div style="flex:1;text-align:center">
          <div style="font-size:24px">💵</div>
          <div style="font-size:13px;color:var(--muted);margin-top:4px">USD</div>
          <div style="font-size:20px;font-weight:700">${((Number(ce.usd.pct)||0)*100).toFixed(1)}%</div>
          <div style="font-size:12px;color:var(--muted)">₪${fmt(ce.usd.valueILS)}</div>
        </div>
        <div style="flex:1;text-align:center">
          <div style="font-size:24px">🇮🇱</div>
          <div style="font-size:13px;color:var(--muted);margin-top:4px">ILS</div>
          <div style="font-size:20px;font-weight:700">${((Number(ce.ils.pct)||0)*100).toFixed(1)}%</div>
          <div style="font-size:12px;color:var(--muted)">₪${fmt(ce.ils.valueILS)}</div>
        </div>
      </div>
      <div style="background:var(--bg3);border-radius:10px;height:16px;overflow:hidden;display:flex">
        <div style="background:#3B6FE8;height:100%;width:${ce.usd.pct*100}%"></div>
        <div style="background:#0CAF60;height:100%;width:${ce.ils.pct*100}%"></div>
      </div>
      <div style="font-size:12px;color:var(--muted);margin-top:0.5rem">שער נוכחי: ₪${(Number(ce.usdIls)||0).toFixed(4)}</div>
    </div>`;
  }

  // ── 📉 Risk metrics (drawdown + beta) ──
  const dd = d.drawdown;
  if(dd && (dd.maxDrawdown > 0 || dd.beta)){
    h += `<div class="sec">📊 מדדי סיכון</div>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-icon kpi-icon-red">📉</div><div class="kpi-label">Max Drawdown</div><div class="kpi-value neg">-${((Number(dd.maxDrawdownPct)||0)*100).toFixed(1)}%</div><div class="kpi-sub">₪${fmt(dd.maxDrawdown)}</div></div>
      <div class="kpi"><div class="kpi-icon kpi-icon-purple">β</div><div class="kpi-label">Beta (מול שוק)</div><div class="kpi-value">${(Number(dd.beta)||1).toFixed(2)}</div><div class="kpi-sub">${dd.beta < 0.8 ? 'נמוך — פחות תנודתי' : dd.beta > 1.2 ? 'גבוה — יותר תנודתי' : 'מתון — עוקב שוק'}</div></div>
    </div>`;
    if(dd.peakDate && dd.troughDate){
      h += `<div style="font-size:12px;color:var(--muted);padding:0 1rem">פסגה: ${dd.peakDate} → שפל: ${dd.troughDate}</div>`;
    }
  }

  // ── Now inject to DOM and render charts ──
  document.getElementById('tab-overview').innerHTML=h;
  const pv=[ib.totalVal,ib.cash,fa.totalVal,fa.cash,s.banksVal],pl=['IBKR ניירות','IBKR מזומן','FAIR קרנות','FAIR מזומן','בנקים'];
  const tot=pv.reduce((a,b)=>a+b,0);
  const lg=document.getElementById('pieLeg');
  if(lg) pl.forEach((l,i)=>{if(pv[i]<100)return;lg.innerHTML+=`<div class="leg-row"><div class="leg-sq" style="background:${C[i]}"></div><span>${l}</span><span class="leg-pct">${pct(pv[i]/tot)}</span></div>`;});
  const pieEl=document.getElementById('pieC-m');
  if(pieEl){if(charts.pie)charts.pie.destroy();charts.pie=new Chart(pieEl,{type:'doughnut',data:{labels:pl,datasets:[{data:pv,backgroundColor:C,borderWidth:2,borderColor:'var(--card)'}]},options:{responsive:true,maintainAspectRatio:false,cutout:'65%',plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>' ₪'+fmt(ctx.raw)+' ('+pct(ctx.raw/tot)+')'}}}}});}
  const gc='#E4EAF4',tc='#6B7FA8';
  const barEl=document.getElementById('barC-m');
  if(barEl){if(charts.bar)charts.bar.destroy();charts.bar=new Chart(barEl,{type:'bar',data:{labels:['IBKR','FAIR'],datasets:[{label:'עלות מקורית',data:[ib.totalCost,fa.totalVal-fa.totalPL],backgroundColor:'rgba(59,111,232,0.2)',borderColor:'#3B6FE8',borderWidth:1.5},{label:'שווי נוכחי',data:[ib.totalVal,fa.totalVal],backgroundColor:'rgba(12,175,96,0.2)',borderColor:'#0CAF60',borderWidth:1.5}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:tc,font:{size:12}}}},scales:{x:{ticks:{color:tc},grid:{color:gc}},y:{ticks:{color:tc,callback:v=>'₪'+Math.round(v/1000)+'K'},grid:{color:gc}}}}});}
}

function renderIBKR(d){
  const ib=d.ibkr,usd=d.meta.usdIls;
  let h=`
  <div class="kpi-grid">
    <div class="kpi"><div class="kpi-icon kpi-icon-blue">📈</div><div class="kpi-label">שווי ניירות</div><div class="kpi-value">₪${fmt(ib.totalVal)}</div><div class="kpi-sub">${fmtD(ib.totalVal/usd)}</div></div>
    <div class="kpi"><div class="kpi-icon kpi-icon-green">💹</div><div class="kpi-label">תשואה עדכנית</div><div class="kpi-value ${cls(ib.totalRetUSD||ib.totalRet)}">${sgn(ib.totalRetUSD||0)}$${fmt(Math.abs(ib.totalRetUSD||0))} (${sgn(ib.totalRetPctUSD||ib.totalRetPct)}${pct(ib.totalRetPctUSD||ib.totalRetPct)})</div><div class="kpi-sub ${cls(ib.totalRet)}">${sgn(ib.totalRet)}₪${fmt(Math.abs(ib.totalRet))}</div></div>
    <div class="kpi"><div class="kpi-icon kpi-icon-yellow">💵</div><div class="kpi-label">מזומן IBKR</div><div class="kpi-value">₪${fmt(ib.cash)}</div><div class="kpi-sub">${fmtD(ib.cash/usd)}</div></div>
    <div class="kpi"><div class="kpi-icon kpi-icon-purple">🗂</div><div class="kpi-label">פוזיציות</div><div class="kpi-value">${ib.positions.length}</div></div>
    <div class="kpi"><div class="kpi-icon kpi-icon-red">💸</div><div class="kpi-label">רווח ממומש</div><div class="kpi-value ${cls(d.realizedGains?d.realizedGains.totalILS:0)}">${sgn(d.realizedGains?d.realizedGains.totalILS:0)}₪${fmt(Math.abs(d.realizedGains?d.realizedGains.totalILS:0))}</div><div class="kpi-sub">${sgn(d.realizedGains?d.realizedGains.totalUSD:0)}$${fmt(Math.abs(d.realizedGains?d.realizedGains.totalUSD:0))}</div></div>
  </div>
  <div class="sec">פוזיציות פתוחות</div>
  <div class="table-wrap"><table id="ibkrTable">
    <thead><tr><th>סימבול</th><th>סוג</th><th>כמות</th><th>קנייה $</th><th>שער קנייה</th><th>עלות ₪</th><th>נוכחי $</th><th>שינוי</th><th>שווי ₪</th><th>תשואה</th></tr></thead>
    <tbody>`;
  ib.positions.forEach(p=>{
    h+=`<tr><td><strong>${p.sym}</strong></td><td><span class="chip chip-blue">${p.type}</span></td><td class="mono">${p.qty}</td><td class="mono">$${(Number(p.buyP)||0).toFixed(2)}</td><td class="mono">₪${(Number(p.buyFX)||0).toFixed(3)}</td><td class="mono">₪${fmt(p.costILS)}</td><td class="mono" style="color:${(Number(p.curP)||0)>=(Number(p.buyP)||0)?'var(--green)':'var(--red)'};font-weight:700">$${(Number(p.curP)||0).toFixed(2)}</td><td class="mono" style="color:${(Number(p.curP)||0)>=(Number(p.buyP)||0)?'var(--green)':'var(--red)'}">${(Number(p.curP)||0)>=(Number(p.buyP)||0)?'▲':'▼'} ${((Number(p.curP)||0)>0&&Number(p.buyP)>0)?(((Number(p.curP)||0)/(Number(p.buyP)||0)-1)*100).toFixed(1):'0'}%</td><td class="mono">₪${fmt(p.valILS)}</td><td class="mono ${p.curP>0?cls(p.retILS):'neg'}">${p.curP>0?sgn(p.retILS)+'₪'+fmt(Math.abs(p.retILS))+' ('+sgn(p.retPct)+((Number(p.retPct)||0)*100).toFixed(1)+'%)':'— מחיר לא זמין'}</td></tr>`;
  });
  h+=`</tbody></table></div>`;
  const rg=d.realizedGains;
  if(rg&&rg.entries&&rg.entries.length>0){
    h+=`<div class="sec">רווח ממומש (עסקאות שנסגרו)</div><div class="table-wrap"><table>
      <thead><tr><th>תקופה</th><th>סימבול</th><th>תיאור</th><th>תאריך מכירה</th><th>עלות ($)</th><th>תמורה ($)</th><th>רווח ($)</th><th>USD/ILS</th><th>רווח (₪)</th></tr></thead><tbody>`;
    rg.entries.forEach(e=>{
      h+=`<tr><td>${e.period}</td><td><strong>${e.sym}</strong></td><td style="max-width:160px;white-space:normal">${e.desc}</td><td class="mono">${e.saleDate}</td><td class="mono">$${fmt(e.costUSD)}</td><td class="mono">$${fmt(e.proceedsUSD)}</td><td class="mono ${cls(e.gainUSD)}">${sgn(e.gainUSD)}$${fmt(Math.abs(e.gainUSD))}</td><td class="mono">${(Number(e.usdIls)||0).toFixed(4)}</td><td class="mono ${cls(e.gainILS)}">${sgn(e.gainILS)}₪${fmt(Math.abs(e.gainILS))}</td></tr>`;
    });
    h+=`<tr class="row-total"><td colspan="6">סה"כ רווח ממומש</td><td class="mono ${cls(rg.totalUSD)}">${sgn(rg.totalUSD)}$${fmt(Math.abs(rg.totalUSD))}</td><td></td><td class="mono ${cls(rg.totalILS)}">${sgn(rg.totalILS)}₪${fmt(Math.abs(rg.totalILS))}</td></tr></tbody></table></div>`;
  } else {
    h+=`<div class="sec">רווח ממומש</div><div class="card" class="empty-state" style=");padding:2rem">אין נתונים — הזן עסקאות מכירה בגיליון "רווח ממומש"</div>`;
  }
  document.getElementById('tab-ibkr').innerHTML=h;
  // Sparklines — load real Yahoo 7-day data
  var ibkrSyms = (d.ibkr.positions||[]).map(function(p){ return p.sym; });
  if(ibkrSyms.length > 0){
    setTimeout(function(){ loadSparklines(ibkrSyms, 'ibkrTable'); }, 300);
  }

}

function renderFAIR(d){
  const fa=d.fair;
  let h=`
  <div class="kpi-grid">
    <div class="kpi"><div class="kpi-icon kpi-icon-green">🏦</div><div class="kpi-label">שווי קרנות</div><div class="kpi-value">₪${fmt(fa.totalVal)}</div></div>
    <div class="kpi"><div class="kpi-icon kpi-icon-blue">📊</div><div class="kpi-label">רווח כולל</div><div class="kpi-value ${cls(fa.totalPL)}">${sgn(fa.totalPL)}₪${fmt(Math.abs(fa.totalPL))}</div>${delt(fa.totalPL,fa.totalPLPct)}</div>
    <div class="kpi"><div class="kpi-icon kpi-icon-yellow">💰</div><div class="kpi-label">מזומן FAIR</div><div class="kpi-value">₪${fmt(fa.cash)}</div></div>
    <div class="kpi"><div class="kpi-icon kpi-icon-purple">📁</div><div class="kpi-label">מספר קרנות</div><div class="kpi-value">${fa.positions.length}</div></div>
  </div>
  <div class="sec">קרנות נאמנות</div>
  <div class="table-wrap"><table>
    <thead><tr><th>שם הקרן</th><th>סוג</th><th>כמות</th><th>שווי ₪</th><th>רווח/הפסד ₪</th><th>תשואה</th></tr></thead>
    <tbody>`;
  fa.positions.forEach(p=>{
    h+=`<tr><td style="max-width:200px;white-space:normal">${p.name}</td><td><span class="chip chip-green">${p.type||'קרן נאמנות'}</span></td><td class="mono">${fmt(p.qty)}</td><td class="mono">₪${fmt(p.valILS)}</td><td class="mono ${cls(p.pl)}">${sgn(p.pl)}₪${fmt(Math.abs(p.pl))}</td><td class="mono ${cls(p.plPct)}">${sgn(p.plPct)}${((Number(p.plPct)||0)*100).toFixed(1)}%</td></tr>`;
  });
  h+=`</tbody></table></div>`;
  document.getElementById('tab-fair').innerHTML=h;
}

function renderCash(d){
  const c=d.cash,usd=d.meta.usdIls;
  let h=`
  <div class="cash-hero">
    <div><div class="cash-hero-title">סה"כ מזומן ונזיל</div><div class="cash-hero-val">₪${fmt(c.total)}</div><div class="cash-hero-sub">${fmtD(c.total/usd)} לפי שער ${(Number(usd)||0).toFixed(4)}</div></div>
    <div style="text-align:left"><div class="cash-hero-title">פירוט</div><div style="font-size:13px;opacity:0.85;line-height:1.8">IBKR: ₪${fmt(c.ibkr)}<br>FAIR: ₪${fmt(c.fair)}<br>בנקים: ₪${fmt(c.banks)}</div></div>
  </div>
  <div class="sec">פירוט מקורות</div>
  <div class="cash-grid">`;
  if(c.ibkr>0){h+=`<div class="cash-card"><div class="cash-inst">IBKR</div><div class="cash-acc">מזומן USD</div><div class="cash-amt">${fmtD(c.ibkr/usd)}</div><div class="cash-fx">× ${(Number(usd)||0).toFixed(4)} = ₪${fmt(c.ibkr)}</div></div>`;}
  if(c.fair>0){h+=`<div class="cash-card ils"><div class="cash-inst">FAIR</div><div class="cash-acc">מזומן</div><div class="cash-amt">₪${fmt(c.fair)}</div></div>`;}
  const byI={};d.banks.forEach(b=>{if(!byI[b.institution])byI[b.institution]=[];byI[b.institution].push(b)});
  Object.keys(byI).forEach(inst=>{byI[inst].forEach(b=>{if(b.valueILS===0)return;const isILS=b.ccy==='ILS';h+=`<div class="cash-card ${isILS?'ils':''}"><div class="cash-inst">${b.institution}</div><div class="cash-acc">${b.accType}</div><div class="cash-amt">${isILS?'₪'+fmt(b.balance):fmtD(b.balance)+' '+b.ccy}</div>${!isILS?`<div class="cash-fx">× ${(Number(b.rate)||0).toFixed(4)} = ₪${fmt(b.valueILS)}</div>`:''}</div>`;});});
  h+=`</div>`;
  document.getElementById('tab-cash').innerHTML=h;
}

function renderAlloc(d){
  const s=d.summary,tot=s.grandTotal;
  const items=[{l:'ניירות IBKR',v:d.ibkr.totalVal,c:'#3B6FE8'},{l:'קרנות FAIR',v:d.fair.totalVal,c:'#0CAF60'},{l:'מזומן IBKR',v:d.ibkr.cash,c:'#00B8D9'},{l:'מזומן FAIR',v:d.fair.cash,c:'#14B8A6'},{l:'חשבונות בנק',v:s.banksVal,c:'#7C5CFC'}];
  let h=`<div class="kpi-grid">${items.map(a=>`<div class="kpi" style="border-right-color:${a.c}"><div class="kpi-icon" style="background:${a.c}22;font-size:28px">📊</div><div style="flex:1;min-width:0"><div class="kpi-label">${a.l}</div><div class="kpi-value">${pct(a.v/tot)}</div><div class="kpi-sub">₪${fmt(a.v)}</div></div></div>`).join('')}</div>
  <div class="sec">הקצאה ויזואלית</div><div class="card">`;
  items.forEach(a=>{h+=`<div class="alloc-row"><div class="alloc-lbl"><span style="display:flex;align-items:center;gap:10px"><span style="width:14px;height:14px;border-radius:4px;background:${a.c};display:inline-block;flex-shrink:0"></span>${a.l}</span><span>₪${fmt(a.v)} · ${pct(a.v/tot)}</span></div><div class="bar-bg"><div class="bar-fg" style="width:${((Number(a.v)||0)/(Number(tot)||1)*100).toFixed(1)}%;background:${a.c}"></div></div></div>`;});
  h+=`</div><div class="sec">גרף הקצאה</div><div class="card"><div style="position:relative;height:280px"><canvas id="allocC-m" role="img"></canvas></div></div>`;
  document.getElementById('tab-alloc').innerHTML=h;
  if(charts.alloc)charts.alloc.destroy();
  charts.alloc=new Chart(document.getElementById('allocC-m'),{type:'doughnut',data:{labels:items.map(a=>a.l),datasets:[{data:items.map(a=>a.v),backgroundColor:items.map(a=>a.c),borderWidth:2,borderColor:'var(--card)'}]},options:{responsive:true,maintainAspectRatio:false,cutout:'58%',plugins:{legend:{position:'bottom',labels:{color:'#6B7FA8',font:{size:14},boxWidth:14,padding:14}},tooltip:{callbacks:{label:ctx=>' ₪'+fmt(ctx.raw)+' ('+pct(ctx.raw/tot)+')'}}}}});
}

function renderSavings(d){
  const kids=d.savings?d.savings.kids:[],total=d.savings?d.savings.total:0;
  let h=`
  <div class="kpi-grid">
    <div class="kpi"><div class="kpi-icon kpi-icon-purple">👶</div><div class="kpi-label">סה"כ חיסכון</div><div class="kpi-value">₪${fmt(total)}</div><div class="kpi-sub">${kids.length} ילדים</div></div>
    <div class="kpi"><div class="kpi-icon kpi-icon-green">🏛</div><div class="kpi-label">סה"כ ב"ל</div><div class="kpi-value">₪${fmt(kids.reduce((s,k)=>s+k.bituachLeumi,0))}</div></div>
    <div class="kpi"><div class="kpi-icon kpi-icon-blue">👨‍👩‍👧</div><div class="kpi-label">סה"כ הורים</div><div class="kpi-value">₪${fmt(kids.reduce((s,k)=>s+k.parents,0))}</div></div>
  </div>
  <div class="sec">פירוט לפי ילד</div>
  <div class="cash-grid">`;
  if(kids.length===0){h+=`<div style="padding:2rem;color:var(--muted);text-align:center;width:100%">אין נתונים עדיין — עדכן את גיליון "חיסכון לכל ילד"</div>`;}
  kids.forEach(k=>{if(!k.name)return;h+=`<div class="cash-card ils" style="border-right-color:var(--purple)"><div class="cash-inst">👶 ${k.name}</div><div class="cash-acc">${k.fund||''} ${k.track?'· '+k.track:''}</div><div class="cash-amt" style="color:var(--purple)">₪${fmt(k.total)}</div><div class="cash-fx">ב"ל: ₪${fmt(k.bituachLeumi)} | הורים: ₪${fmt(k.parents)}${k.updatedAt?'<br>עודכן: '+k.updatedAt:''}</div></div>`;});
  h+=`</div><div class="sec">פירוט מלא</div><div class="table-wrap"><table>
    <thead><tr><th>שם הילד</th><th>קופת גמל</th><th>מסלול</th><th>תאריך עדכון</th><th>סה"כ ב"ל</th><th>סה"כ הורים</th><th>סה"כ חיסכון</th><th>% הורים</th></tr></thead><tbody>`;
  kids.forEach(k=>{if(!k.name)return;const p=k.total>0?((Number(k.parents)||0)/(Number(k.total)||1)*100).toFixed(1)+'%':'-';h+=`<tr><td><strong>${k.name}</strong></td><td>${k.fund||'-'}</td><td><span class="chip chip-purple">${k.track||'-'}</span></td><td class="mono">${k.updatedAt||'-'}</td><td class="mono">₪${fmt(k.bituachLeumi)}</td><td class="mono">₪${fmt(k.parents)}</td><td class="mono" style="font-weight:700;color:var(--purple)">₪${fmt(k.total)}</td><td class="mono">${p}</td></tr>`;});
  h+=`</tbody></table></div>`;
  document.getElementById('tab-savings').innerHTML=h;
}

// ══════════════════════════════════════════════════════════
// ✅ טאב מחשבון מס ישראלי
// ══════════════════════════════════════════════════════════
function renderTax(d){
  var tx = d.taxData || {};
  if(tx.error){
    document.getElementById("tab-tax").innerHTML = '<div class="card" style="text-align:center;padding:2rem;color:var(--muted)"><div style="font-size:2rem;margin-bottom:1rem">⚠️</div><div>שגיאה בטעינת נתוני מס</div><div style="font-size:13px;margin-top:0.5rem">'+tx.error+'</div><div style="font-size:13px;margin-top:1rem">ודא שהגיליונות "רווח ממומש" ו"דיבידנדים" קיימים ותקינים</div></div>';
    return;
  }
  var usd = (tx.meta||{}).usdToday || d.meta.usdIls || 3.6;
  var year = (tx.meta||{}).taxYear || new Date().getFullYear();
  var cg = tx.capitalGains || {};
  var dv = tx.dividends || {};
  var fifo = tx.fifo || {};
  var un = tx.unrealized || {};
  var tt = tx.totals || {};

  var h = "";

  // ══════ KPI Grid ══════
  h += '<div class="kpi-grid">';

  var cgThisYear = cg.thisYear || { totalUSD: 0, totalILS: 0 };
  var cgTax = cg.taxDueILS || 0;
  h += '<div class="kpi"><div class="kpi-icon kpi-icon-blue">📈</div><div class="kpi-label">רווח הון ממומש ' + year + '</div><div class="kpi-value ' + (cgThisYear.totalILS>=0?"pos":"neg") + '">' + sgn(cgThisYear.totalILS) + '₪' + fmt(Math.abs(cgThisYear.totalILS)) + '</div><div class="kpi-sub">$' + fmt(cgThisYear.totalUSD) + ' · 25% מס</div><span class="badge-delta ' + (cgTax>=0?"dn":"up") + '">מס: ₪' + fmt(Math.abs(cgTax)) + '</span></div>';

  var divNetTax = dv.taxDueILS_net || 0;
  h += '<div class="kpi"><div class="kpi-icon kpi-icon-green">💵</div><div class="kpi-label">מס דיבידנדים</div><div class="kpi-value neg">₪' + fmt(divNetTax) + '</div><div class="kpi-sub">25% על גולמי פחות מס ארה"ב</div><span class="badge-delta dn">שולם בארה"ב: $' + fmt(dv.taxPaidUS||0) + '</span></div>';

  h += '<div class="kpi"><div class="kpi-icon kpi-icon-red">🧾</div><div class="kpi-label">סה"כ מס לתשלום ' + year + '</div><div class="kpi-value neg">₪' + fmt(tt.taxDueILS||0) + '</div><div class="kpi-sub">רווח הון + דיבידנדים</div></div>';

  h += '<div class="kpi"><div class="kpi-icon kpi-icon-purple">🌍</div><div class="kpi-label">מס זר ששולם</div><div class="kpi-value">₪' + fmt(tt.taxPaidForeign_ILS||0) + '</div><div class="kpi-sub">$' + fmt(dv.taxPaidUS||0) + ' · זיכוי בישראל</div></div>';

  h += '<div class="kpi"><div class="kpi-icon kpi-icon-yellow">🔮</div><div class="kpi-label">רווח לא ממומש</div><div class="kpi-value pos">₪' + fmt(un.gainsILS||0) + '</div><div class="kpi-sub">אם תמכור הכל היום</div><span class="badge-delta dn">מס פוטנציאלי: ₪' + fmt(un.potentialTaxILS||0) + '</span></div>';

  var fcr = dv.foreignTaxCreditRemaining || 0;
  h += '<div class="kpi"><div class="kpi-icon" style="background:rgba(0,184,217,0.12)">🔄</div><div class="kpi-label">יתרת זיכוי מס זר</div><div class="kpi-value ' + (fcr>0?"pos":"") + '">₪' + fmt(fcr) + '</div><div class="kpi-sub">ניתן לנכות בשנים הבאות</div></div>';

  h += '</div>';

  // ══════ סיכום מס שנתי ══════
  h += '<div class="sec">סיכום מס שנתי ' + year + '</div>';
  h += '<div class="card" style="padding:0;overflow:hidden"><table><thead><tr><th>סוג הכנסה</th><th>סכום (₪)</th><th>מס זר ששולם</th><th>מס בישראל</th><th>שיעור</th></tr></thead><tbody>';
  h += '<tr><td><strong>רווח הון ממומש</strong></td><td class="mono ' + (cgThisYear.totalILS>=0?"pos":"neg") + '">' + sgn(cgThisYear.totalILS) + '₪' + fmt(Math.abs(cgThisYear.totalILS)) + '</td><td class="mono">—</td><td class="mono neg">₪' + fmt(cgTax) + '</td><td><span class="chip chip-blue">25%</span></td></tr>';
  h += '<tr><td><strong>דיבידנדים (נטו)</strong></td><td class="mono pos">₪' + fmt(dv.netILS||0) + '</td><td class="mono neg">₪' + fmt(dv.taxPaidUS_ILS||0) + '</td><td class="mono neg">₪' + fmt(divNetTax) + '</td><td><span class="chip chip-green">25%</span></td></tr>';
  h += '<tr class="row-total"><td>סה"כ</td><td class="mono">₪' + fmt((cgThisYear.totalILS||0)+(dv.netILS||0)) + '</td><td class="mono neg">₪' + fmt(tt.taxPaidForeign_ILS||0) + '</td><td class="mono neg">₪' + fmt(tt.taxDueILS||0) + '</td><td></td></tr>';
  h += '</tbody></table></div>';

  // ══════ פירוט רווח הון לפי נייר ══════
  var cgEntries = (cg.thisYear||{}).entries || [];
  if(cgEntries.length > 0){
    h += '<div class="sec">רווח הון ממומש — פירוט (' + year + ')</div>';
    h += '<div class="table-wrap"><table><thead><tr><th>תקופה</th><th>סימבול</th><th>תיאור</th><th>תאריך מכירה</th><th>עלות $</th><th>תמורה $</th><th>רווח $</th><th>רווח ₪</th><th>מס 25% ₪</th></tr></thead><tbody>';
    var totalTaxPerEntry = 0;
    cgEntries.forEach(function(e){
      var taxEntry = e.gainILS * 0.25;
      totalTaxPerEntry += taxEntry;
      h += '<tr><td>' + (e.period||'') + '</td><td><strong>' + (e.sym||'') + '</strong></td><td style="max-width:140px;white-space:normal">' + (e.desc||'') + '</td><td class="mono">' + (e.saleDate||'') + '</td><td class="mono">$' + fmt(e.costUSD) + '</td><td class="mono">$' + fmt(e.proceedsUSD) + '</td><td class="mono ' + (e.gainUSD>=0?"pos":"neg") + '">' + sgn(e.gainUSD) + '$' + fmt(Math.abs(e.gainUSD)) + '</td><td class="mono ' + (e.gainILS>=0?"pos":"neg") + '">' + sgn(e.gainILS) + '₪' + fmt(Math.abs(e.gainILS)) + '</td><td class="mono neg">₪' + fmt(Math.abs(taxEntry)) + '</td></tr>';
    });
    h += '<tr class="row-total"><td colspan="7">סה"כ</td><td class="mono ' + (cgThisYear.totalILS>=0?"pos":"neg") + '">' + sgn(cgThisYear.totalILS) + '₪' + fmt(Math.abs(cgThisYear.totalILS)) + '</td><td class="mono neg">₪' + fmt(Math.abs(totalTaxPerEntry)) + '</td></tr>';
    h += '</tbody></table></div>';
  } else {
    h += '<div class="sec">רווח הון ממומש</div><div class="card" class="empty-state" style=");padding:2rem">אין מכירות בשנת ' + year + ' — אין מס רווח הון ✅</div>';
  }

  // ══════ FIFO ══════
  var fifoMatches = fifo.matches || [];
  if(fifoMatches.length > 0){
    h += '<div class="sec">חישוב FIFO — התאמת קניות למכירות</div>';
    h += '<div class="table-wrap"><table><thead><tr><th>סימבול</th><th>תאריך קנייה</th><th>מחיר $</th><th>כמות</th><th>תאריך מכירה</th><th>מחיר $</th><th>עלות ₪</th><th>תמורה ₪</th><th>רווח ₪</th></tr></thead><tbody>';
    fifoMatches.forEach(function(m){
      h += '<tr><td><strong>' + (m.sym||'') + '</strong></td><td class="mono">' + (m.buyDate||'') + '</td><td class="mono">$' + (m.buyPrice||0).toFixed(2) + '</td><td class="mono">' + (m.buyQty||0) + '</td><td class="mono">' + (m.sellDate||'') + '</td><td class="mono">$' + (m.sellPrice||0).toFixed(2) + '</td><td class="mono">₪' + fmt(m.costILS||0) + '</td><td class="mono">₪' + fmt(m.proceedsILS||0) + '</td><td class="mono ' + ((m.gainILS||0)>=0?"pos":"neg") + '">' + sgn(m.gainILS||0) + '₪' + fmt(Math.abs(m.gainILS||0)) + '</td></tr>';
    });
    var fifoSum = fifo.summary || {};
    h += '<tr class="row-total"><td colspan="8">סה"כ FIFO</td><td class="mono ' + ((fifoSum.totalGainILS||0)>=0?"pos":"neg") + '">' + sgn(fifoSum.totalGainILS||0) + '₪' + fmt(Math.abs(fifoSum.totalGainILS||0)) + '</td></tr>';
    h += '</tbody></table></div>';
  } else {
    h += '<div class="sec">חישוב FIFO</div><div class="card" class="empty-state" style=");padding:2rem">לחישוב FIFO מדויק, ודא שגיליון "מכירות" כולל פירוט מלא: סימבול, כמות, מחיר, תאריך.</div>';
  }

  // ══════ דיבידנדים פילוח מס ══════
  h += '<div class="sec">מס דיבידנדים — פילוח מלא</div>';
  h += '<div class="card" style="padding:0;overflow:hidden"><table><thead><tr><th></th><th>$</th><th>₪</th><th>הסבר</th></tr></thead><tbody>';
  h += '<tr><td><strong>דיבידנד גולמי</strong></td><td class="mono">$' + fmt(dv.grossUSD||0) + '</td><td class="mono">₪' + fmt((dv.grossUSD||0)*usd) + '</td><td>לפני מס</td></tr>';
  h += '<tr><td><strong>מס ארה"ב (25%)</strong></td><td class="mono neg">-$' + fmt(dv.taxPaidUS||0) + '</td><td class="mono neg">-₪' + fmt(dv.taxPaidUS_ILS||0) + '</td><td>נוכה במקור</td></tr>';
  h += '<tr><td><strong>נטו שהתקבל</strong></td><td class="mono pos">$' + fmt(dv.netUSD||0) + '</td><td class="mono pos">₪' + fmt(dv.netILS||0) + '</td><td>אחרי מס ארה"ב</td></tr>';
  h += '<tr style="border-top:2px solid var(--border)"><td><strong>מס ישראלי (25%)</strong></td><td class="mono">$' + fmt((dv.grossUSD||0)*0.25) + '</td><td class="mono neg">₪' + fmt(dv.taxDueILS_gross||0) + '</td><td>25% על גולמי</td></tr>';
  h += '<tr><td><strong>זיכוי מס זר</strong></td><td class="mono pos">-$' + fmt(dv.taxPaidUS||0) + '</td><td class="mono pos">-₪' + fmt(dv.foreignTaxCreditUsed||0) + '</td><td>מס ששולם בארה"ב</td></tr>';
  h += '<tr class="row-total"><td>מס נוסף בישראל</td><td></td><td class="mono neg">₪' + fmt(dv.taxDueILS_net||0) + '</td><td>לתשלום בדו"ח</td></tr>';
  if(fcr > 0){
    h += '<tr style="color:var(--green)"><td>יתרת זיכוי לעתיד</td><td></td><td class="mono pos">₪' + fmt(fcr) + '</td><td>ניתן לנכות בשנים הבאות</td></tr>';
  }
  h += '</tbody></table></div>';

  // ══════ שנים קודמות ══════
  var prevYears = cg.prevYears || { totalUSD: 0, totalILS: 0 };
  if(prevYears.totalILS !== 0){
    h += '<div class="sec">רווח הון — שנים קודמות</div>';
    h += '<div class="card" style="padding:1rem 1.5rem"><div style="display:flex;justify-content:space-between"><div><div style="font-size:13px;color:var(--muted)">לפני ' + year + '</div><div class="mono ' + (prevYears.totalILS>=0?"pos":"neg") + '" style="font-size:1.5rem;font-weight:700">' + sgn(prevYears.totalILS) + '₪' + fmt(Math.abs(prevYears.totalILS)) + '</div></div><div><div style="font-size:13px;color:var(--muted)">$</div><div class="mono ' + (prevYears.totalUSD>=0?"pos":"neg") + '" style="font-size:1.2rem;font-weight:600">' + sgn(prevYears.totalUSD) + '$' + fmt(Math.abs(prevYears.totalUSD)) + '</div></div></div></div>';
  }

  // ══════ הדמיית מכירה ══════
  h += '<div class="sec">הדמיית מכירה — מס פוטנציאלי</div>';
  h += '<div class="card">';
  h += '<div style="font-size:14px;color:var(--muted);margin-bottom:1rem">אם תמכור את כל הפוזיציות היום:</div>';
  h += '<div style="display:flex;justify-content:space-between;margin-bottom:0.75rem"><span style="font-size:14px">רווח לא ממומש</span><span class="mono pos" style="font-size:1.3rem;font-weight:700">₪' + fmt(un.gainsILS||0) + '</span></div>';
  h += '<div style="display:flex;justify-content:space-between;margin-bottom:0.75rem"><span style="font-size:14px">מס רווח הון (25%)</span><span class="mono neg" style="font-size:1.3rem;font-weight:700">₪' + fmt(un.potentialTaxILS||0) + '</span></div>';
  h += '<div style="display:flex;justify-content:space-between;padding-top:0.75rem;border-top:1px solid var(--border)"><span style="font-size:14px;font-weight:700">נטו אחרי מס</span><span class="mono" style="font-size:1.5rem;font-weight:800">₪' + fmt(Math.max(0,(un.gainsILS||0)-(un.potentialTaxILS||0))) + '</span></div>';
  h += '</div>';

  document.getElementById("tab-tax").innerHTML = h;
  // Currency exposure
  if(d.currencyExposure && d.currencyExposure.total > 0){
    setTimeout(function(){ renderCurrencyExposure(d, 'fxExposureDesktop'); }, 100);
  }

}

function renderAllocInBody(d, body){
  const s=d.summary,tot=s.grandTotal;
  const items=[{l:'ניירות IBKR',v:d.ibkr.totalVal,c:'#3B6FE8'},{l:'קרנות FAIR',v:d.fair.totalVal,c:'#0CAF60'},{l:'מזומן IBKR',v:d.ibkr.cash,c:'#00B8D9'},{l:'מזומן FAIR',v:d.fair.cash,c:'#14B8A6'},{l:'חשבונות בנק',v:s.banksVal,c:'#7C5CFC'}];
  const gc=body.querySelector('canvas');if(!gc)return;
  if(charts.allocM)charts.allocM.destroy();
  charts.allocM=new Chart(gc,{type:'doughnut',data:{labels:items.map(a=>a.l),datasets:[{data:items.map(a=>a.v),backgroundColor:items.map(a=>a.c),borderWidth:2,borderColor:'var(--card)'}]},options:{responsive:true,maintainAspectRatio:false,cutout:'58%',plugins:{legend:{position:'bottom',labels:{color:'#6B7FA8',font:{size:14},boxWidth:14,padding:14}},tooltip:{callbacks:{label:ctx=>' ₪'+fmt(ctx.raw)+' ('+pct(ctx.raw/tot)+')'}}}}});
}
function renderOverviewInBody(d, body){
  const s=d.summary,ib=d.ibkr,fa=d.fair;
  const pv=[ib.totalVal,ib.cash,fa.totalVal,fa.cash,s.banksVal],pl=['IBKR ניירות','IBKR מזומן','FAIR קרנות','FAIR מזומן','בנקים'];
  const tot=pv.reduce((a,b)=>a+b,0);
  const pieEl=body.querySelector('#pieC-m');
  if(pieEl){if(charts.pieM)charts.pieM.destroy();charts.pieM=new Chart(pieEl,{type:'doughnut',data:{labels:pl,datasets:[{data:pv,backgroundColor:C,borderWidth:2,borderColor:'var(--card)'}]},options:{responsive:true,maintainAspectRatio:false,cutout:'65%',plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>' ₪'+fmt(ctx.raw)+' ('+pct(ctx.raw/tot)+')'}}}}});}
  const barEl=body.querySelector('#barC-m');
  if(barEl){const tc='#6B7FA8',gc='#E4EAF4';if(charts.barM)charts.barM.destroy();charts.barM=new Chart(barEl,{type:'bar',data:{labels:['IBKR','FAIR'],datasets:[{label:'עלות מקורית',data:[ib.totalCost,fa.totalVal-fa.totalPL],backgroundColor:'rgba(59,111,232,0.2)',borderColor:'#3B6FE8',borderWidth:1.5},{label:'שווי נוכחי',data:[ib.totalVal,fa.totalVal],backgroundColor:'rgba(12,175,96,0.2)',borderColor:'#0CAF60',borderWidth:1.5}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:tc,font:{size:12}}}},scales:{x:{ticks:{color:tc},grid:{color:gc}},y:{ticks:{color:tc,callback:v=>'₪'+Math.round(v/1000)+'K'},grid:{color:gc}}}}});}
}

function toggleTheme(){const isDark=document.documentElement.classList.toggle('dark');document.getElementById('themeBtn').textContent=isDark?'☀️':'🌙';localStorage.setItem('theme',isDark?'dark':'light');}
(function(){
var saved=localStorage.getItem('theme');
if(saved==='dark'){
document.documentElement.classList.add('dark');
document.getElementById('themeBtn').textContent='☀️';
}else if(!saved||saved==='auto'){
var hr=new Date().getHours();
if(hr>=19||hr<7){
document.documentElement.classList.add('dark');
document.getElementById('themeBtn').textContent='☀️';
}
}
})();

// ═══════════════════════════════════════════════════════════════
// 🔥 HEATMAP — מפת חום של כל החזקות התיק
// ═══════════════════════════════════════════════════════════════
function renderHeatmap(d){
  const target = document.getElementById('tab-heatmap');
  if(!target) return;

  // איסוף כל החזקות (IBKR + FAIR)
  var holdings = [];

  (d.ibkr.positions||[]).forEach(function(p){
    holdings.push({ sym: p.sym, name: p.sym, value: p.valILS, retPct: p.retPct, source: 'IBKR' });
  });
  (d.fair.positions||[]).forEach(function(p){
    holdings.push({ sym: p.name, name: p.name, value: p.valILS, retPct: p.plPct || (p.pl / (p.valILS - p.pl || 1)) * 100, source: 'FAIR' });
  });

  if(holdings.length === 0){
    target.innerHTML = '<div class="card" style="text-align:center;padding:2rem;color:var(--muted)">אין נתונים להצגה</div>';
    return;
  }

  // מיון לפי שווי (גדול לקטן)
  holdings.sort(function(a,b){ return b.value - a.value; });

  var totalVal = holdings.reduce(function(s,h){ return s + h.value; }, 0);
  if(totalVal <= 0) totalVal = 1;

  // צבע לפי תשואה: ירוק = רווח, אדום = הפסד
  function heatColor(retPct){
    var pct = Math.max(-20, Math.min(20, retPct));
    if(pct >= 0){
      // ירוק — ככל שהתשואה גבוהה יותר, הצבע עמוק יותר
      var intensity = Math.min(1, pct / 15);
      var r = Math.round(0 + (1 - intensity) * 80);
      var g = Math.round(120 + intensity * 55);
      var b = Math.round(60 + intensity * 30);
      return 'rgb(' + r + ',' + g + ',' + b + ')';
    } else {
      // אדום
      var intensity = Math.min(1, Math.abs(pct) / 15);
      var r = Math.round(180 + intensity * 40);
      var g = Math.round(40 + (1 - intensity) * 40);
      var b = Math.round(50 + (1 - intensity) * 30);
      return 'rgb(' + r + ',' + g + ',' + b + ')';
    }
  }

  var h = '<div class="sec">🔥 מפת חום — החזקות התיק</div>';

  // מקרא
  h += '<div class="heatmap-legend"><span>הפסד</span><div class="hm-gradient"></div><span>רווח</span></div>';

  h += '<div class="heatmap-grid">';
  holdings.forEach(function(holding, idx){
    var weight = (holding.value / totalVal * 100);
    var isLarge = weight > 15; // ניירות גדולים מקבלים תא כפול
    var cls = isLarge ? 'heatmap-cell hm-large' : 'heatmap-cell';
    var bg = heatColor(holding.retPct);
    var retSign = holding.retPct >= 0 ? '+' : '';
    h += '<div class="' + cls + '" style="background:' + bg + '" onclick="showHeatmapDetail(\'' + holding.sym + '\',' + holding.value + ',' + holding.retPct + ',\'' + holding.source + '\')">';
    h += '<div class="hm-sym">' + holding.sym + '</div>';
    h += '<div class="hm-pct">' + retSign + (Number(holding.retPct)||0).toFixed(1) + '%</div>';
    h += '<div class="hm-val">' + fmt(holding.value) + ' ₪</div>';
    h += '</div>';
  });
  h += '</div>';

  // סיכום
  h += '<div class="card" style="text-align:center;padding:1.25rem;margin-top:1rem">';
  h += '<div style="font-size:13px;color:var(--muted);margin-bottom:5px">סה"כ ' + holdings.length + ' ניירות | ' + fmt(totalVal) + ' ₪</div>';
  h += '<div style="font-size:11px;color:var(--muted)">גודל התא לפי משקל בתיק · צבע לפי תשואה</div>';
  h += '</div>';

  target.innerHTML = h;
}

function showHeatmapDetail(sym, value, retPct, source){
  var sign = retPct >= 0 ? '+' : '';
  var color = retPct >= 0 ? 'var(--green)' : 'var(--red)';
  var msg = '<div class="card" style="text-align:center;padding:2rem">';
  msg += '<div style="font-size:28px;font-weight:900;margin-bottom:8px">' + sym + '</div>';
  msg += '<div style="font-size:16px;color:var(--muted);margin-bottom:12px">' + source + '</div>';
  msg += '<div style="font-size:22px;font-weight:800;color:' + color + '">' + sign + (Number(retPct)||0).toFixed(2) + '%</div>';
  msg += '<div style="font-size:18px;color:var(--text);margin-top:8px">' + fmt(value) + ' ₪</div>';
  msg += '</div>';

  // Mobile: show in detail view; Desktop: show inline modal
  if(isMobileDevice()){
    document.getElementById('mobile-detail-title').textContent = sym;
    document.getElementById('mobile-detail-body').innerHTML = msg;
    document.getElementById('mobile-detail').style.display = 'block';
    document.getElementById('mobile-home').style.display = 'none';
  } else {
    // Desktop: replace heatmap with detail
    var target = document.getElementById('tab-heatmap');
    target.innerHTML = '<button class="btn-refresh" onclick="renderHeatmap(window._lastData)" style="margin-bottom:1rem">‹ חזרה</button>' + msg;
  }
}

// ═══════════════════════════════════════════════════════════════
// 📈 SPARKLINES — מיני-גרפים בטבלאות
// ═══════════════════════════════════════════════════════════════
function renderSparkline(canvasId, data, color){
  var canvas = document.getElementById(canvasId);
  if(!canvas || !data || data.length < 2) return;

  canvas.width = 56 * 2; // retina
  canvas.height = 28 * 2;
  canvas.style.width = '56px';
  canvas.style.height = '28px';

  var ctx = canvas.getContext('2d');
  ctx.scale(2, 2);

  var min = Math.min.apply(null, data);
  var max = Math.max.apply(null, data);
  var range = max - min || 1;
  var step = 56 / (data.length - 1);

  ctx.strokeStyle = color || 'var(--blue)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();

  for(var i = 0; i < data.length; i++){
    var x = i * step;
    var y = 26 - ((data[i] - min) / range) * 22 - 2;
    if(i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Fill area
  ctx.lineTo(56, 28);
  ctx.lineTo(0, 28);
  ctx.closePath();
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = color || 'var(--blue)';
  ctx.fill();
  ctx.globalAlpha = 1;
}

function generateSparklineData(){
  // Generate a simple 7-point trend (real data will come from API later)
  var points = [];
  var val = 100;
  for(var i = 0; i < 7; i++){
    val += (Math.random() - 0.48) * 3;
    points.push(val);
  }
  return points;
}

function addSparklinesToTable(tableId, symbols){
  var table = document.getElementById(tableId);
  if(!table || !symbols || symbols.length === 0) return;

  // Add header cell for sparklines (only once)
  var thead = table.querySelector('thead tr');
  if(thead && !thead.querySelector('.spark-th')){
    var th = document.createElement('th');
    th.className = 'spark-th';
    th.textContent = 'מגמה';
    th.style.cssText = 'width:64px;text-align:center';
    thead.appendChild(th);
  }

  // Add sparkline cells to each body row
  var rows = table.querySelectorAll('tbody tr');
  rows.forEach(function(row, idx){
    if(row.querySelector('.spark-cell')) return;

    var td = document.createElement('td');
    td.className = 'spark-cell';

    var sym = symbols[idx] || '';
    var canvasId = 'spark_' + sym.replace(/[^a-zA-Z0-9]/g, '_') + '_' + idx;

    var canvas = document.createElement('canvas');
    canvas.className = 'sparkline';
    canvas.id = canvasId;
    td.appendChild(canvas);

    row.appendChild(td);

    // Draw sparkline
    var data = generateSparklineData();
    var isUp = data[data.length-1] >= data[0];
    setTimeout(function(){
      renderSparkline(canvasId, data, isUp ? '#00A862' : '#E8394A');
    }, 50);
  });
}

// ═══════════════════════════════════════════════════════════════
// 📊 BENCHMARK CHART — גרף השוואה מול S&P 500
// ═══════════════════════════════════════════════════════════════
function renderBenchmarkChart(benchData, containerId){
  var container = document.getElementById(containerId);
  if(!container) return;

  if(!benchData || !benchData.data || benchData.data.length < 3){
    container.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--muted)">נתוני השוואה אינם זמינים כרגע</div>';
    return;
  }

  var h = '<div class="sec">📈 תשואה מול S&P 500</div>';
  h += '<div class="card"><div style="position:relative;height:300px"><canvas id="' + containerId + '_chart" role="img"></canvas></div></div>';

  // טבלת סיכום
  var last = benchData.data[benchData.data.length - 1];
  var portfolioRet = ((Number(last.portfolio)||0) * 100).toFixed(2);
  var spRet = ((Number(last.benchmark)||0) * 100).toFixed(2);
  var alpha = (last.portfolio - last.benchmark) * 100;
  var alphaSign = alpha >= 0 ? '+' : '';

  h += '<div class="kpi-grid" style="grid-template-columns:repeat(3,1fr);margin-top:1rem">';
  h += '<div class="kpi"><div class="kpi-icon kpi-icon-blue">📁</div><div class="kpi-label">התיק</div><div class="kpi-value">' + portfolioRet + '%</div></div>';
  h += '<div class="kpi"><div class="kpi-icon kpi-icon-yellow">🇺🇸</div><div class="kpi-label">S&P 500</div><div class="kpi-value">' + spRet + '%</div></div>';
  h += '<div class="kpi"><div class="kpi-icon ' + (alpha >= 0 ? 'kpi-icon-green' : 'kpi-icon-red') + '">' + (alpha >= 0 ? '✅' : '⚠️') + '</div><div class="kpi-label">Alpha</div><div class="kpi-value ' + (alpha >= 0 ? 'pos' : 'neg') + '">' + alphaSign + (Number(alpha)||0).toFixed(2) + '%</div></div>';
  h += '</div>';

  container.innerHTML = h;

  // Draw chart
  var canvas = document.getElementById(containerId + '_chart');
  if(!canvas) return;

  if(charts[containerId]) charts[containerId].destroy();
  charts[containerId] = new Chart(canvas, {
    type: 'line',
    data: {
      labels: benchData.data.map(function(d){ return d.date; }),
      datasets: [
        {
          label: 'התיק שלי',
          data: benchData.data.map(function(d){ return (d.portfolio * 100).toFixed(2); }),
          borderColor: '#2D5BFF',
          backgroundColor: 'rgba(45,91,255,0.1)',
          fill: true,
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 5
        },
        {
          label: 'S&P 500',
          data: benchData.data.map(function(d){ return (d.benchmark * 100).toFixed(2); }),
          borderColor: '#F5A623',
          backgroundColor: 'transparent',
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 5,
          borderDash: [5, 3]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top', labels: { color: getComputedStyle(document.body).getPropertyValue('--text'), font: { family: 'Heebo', size: 13 } } },
        tooltip: {
          callbacks: {
            label: function(ctx){ return ctx.dataset.label + ': ' + ctx.parsed.y + '%'; }
          }
        }
      },
      scales: {
        x: { ticks: { color: getComputedStyle(document.body).getPropertyValue('--muted'), maxTicksLimit: 6, font: { size: 10 } }, grid: { display: false } },
        y: { ticks: { color: getComputedStyle(document.body).getPropertyValue('--muted'), callback: function(v){ return v + '%'; }, font: { size: 10 } }, grid: { color: getComputedStyle(document.body).getPropertyValue('--border') } }
      }
    }
  });
}



// ═══════════════════════════════════════════════════════════════
// 💱 חשיפת מט"ח — דונאט + לגנדה
// ═══════════════════════════════════════════════════════════════
function renderCurrencyExposure(d, containerId){
  var container = document.getElementById(containerId);
  if(!container) return;

  var fx = d.currencyExposure;
  if(!fx || fx.total <= 0){
    container.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--muted)">אין נתוני חשיפת מט"ח</div>';
    return;
  }

  var h = '<div class="sec">💱 חשיפת מט"ח</div>';
  h += '<div class="card"><div class="fx-exposure">';
  h += '<div class="fx-donut"><canvas id="' + containerId + '_chart" role="img"></canvas></div>';
  h += '<div class="fx-legend">';

  // USD row
  var usdPct = ((Number(fx.usd.pct)||0) * 100).toFixed(1);
  h += '<div class="fx-row"><div class="fx-dot" style="background:#2D5BFF"></div>';
  h += '<span style="font-weight:700">USD</span>';
  h += '<div class="fx-bar"><div class="fx-bar-fill" style="background:#2D5BFF;width:' + usdPct + '%"></div></div>';
  h += '<span class="mono" style="font-weight:700">' + usdPct + '%</span>';
  h += '<span class="mono" style="color:var(--muted);font-size:12px">₪' + fmt(fx.usd.valueILS) + '</span></div>';

  // ILS row
  var ilsPct = ((Number(fx.ils.pct)||0) * 100).toFixed(1);
  h += '<div class="fx-row"><div class="fx-dot" style="background:#0CAF60"></div>';
  h += '<span style="font-weight:700">ILS</span>';
  h += '<div class="fx-bar"><div class="fx-bar-fill" style="background:#0CAF60;width:' + ilsPct + '%"></div></div>';
  h += '<span class="mono" style="font-weight:700">' + ilsPct + '%</span>';
  h += '<span class="mono" style="color:var(--muted);font-size:12px">₪' + fmt(fx.ils.valueILS) + '</span></div>';

  h += '</div></div></div>';

  // Summary KPIs
  h += '<div class="kpi-grid" style="margin-top:1rem">';
  h += '<div class="kpi"><div class="kpi-icon kpi-icon-blue">💵</div><div class="kpi-label">חשיפה לדולר</div><div class="kpi-value">' + usdPct + '%</div><div class="kpi-sub">₪' + fmt(fx.usd.valueILS) + '</div></div>';
  h += '<div class="kpi"><div class="kpi-icon kpi-icon-green">₪</div><div class="kpi-label">חשיפה לשקל</div><div class="kpi-value">' + ilsPct + '%</div><div class="kpi-sub">₪' + fmt(fx.ils.valueILS) + '</div></div>';
  h += '<div class="kpi"><div class="kpi-icon kpi-icon-yellow">⚠️</div><div class="kpi-label">סיכון מטבעי</div><div class="kpi-value">' + (fx.usd.pct > 0.7 ? 'גבוה' : fx.usd.pct > 0.4 ? 'בינוני' : 'נמוך') + '</div><div class="kpi-sub">' + (fx.usd.pct > 0.7 ? 'רגיש לשער דולר' : 'מאוזן') + '</div></div>';
  h += '</div>';

  container.innerHTML = h;

  // Draw donut chart
  var canvas = document.getElementById(containerId + '_chart');
  if(!canvas) return;
  var chartId = containerId + '_chart';
  if(charts[chartId]) charts[chartId].destroy();
  charts[chartId] = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['USD', 'ILS'],
      datasets: [{
        data: [fx.usd.valueILS, fx.ils.valueILS],
        backgroundColor: ['#2D5BFF', '#0CAF60'],
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '65%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(ctx){ return ctx.label + ': ₪' + fmt(ctx.parsed) + ' (' + (ctx.parsed / fx.total * 100).toFixed(1) + '%)'; }
          }
        }
      }
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// 📅 יומן דיבידנדים — תצוגה חודשית
// ═══════════════════════════════════════════════════════════════
function renderDividendCalendar(targetId){
  var target = document.getElementById(targetId);
  if(!target) return;

  target.innerHTML = '<div class="skeleton-wrap"><div class="skeleton-card"><div class="skeleton-line long"></div><div class="skeleton-line medium"></div><div class="skeleton-line long"></div></div></div>';

  fetchDividendCalendar(function(){
    var data = window._divCalendarData;
    if(!data || !data.available || data.calendar.length === 0){
      target.innerHTML = '<div class="card" style="text-align:center;padding:2rem;color:var(--muted)">אין נתוני דיבידנדים צפויים. ודא שיש נתוני חיזוי בגיליון הדיבידנדים.</div>';
      return;
    }

    var h = '<div class="sec">📅 יומן דיבידנדים — 12 חודשים</div>';

    // Summary KPIs
    h += '<div class="kpi-grid">';
    h += '<div class="kpi"><div class="kpi-icon kpi-icon-green">💰</div><div class="kpi-label">סה"כ שנתי</div><div class="kpi-value">$' + fmt(data.annualUSD) + '</div><div class="kpi-sub">₪' + fmt(data.annualILS) + ' נטו</div></div>';
    h += '<div class="kpi"><div class="kpi-icon kpi-icon-blue">📊</div><div class="kpi-label">ממוצע חודשי</div><div class="kpi-value">₪' + fmt(data.monthlyAvgILS) + '</div><div class="kpi-sub">נטו (25% מס)</div></div>';
    h += '</div>';

    // Monthly grid
    h += '<div class="div-cal-grid">';
    data.calendar.forEach(function(m){
      h += '<div class="div-cal-month">';
      h += '<div class="dc-month">' + m.month + '</div>';
      h += '<div class="dc-amount">$' + m.totalUSD.toFixed(1) + '</div>';
      h += '<div class="dc-symbols">' + m.symbols.join(', ') + '</div>';
      h += '</div>';
    });
    h += '</div>';

    target.innerHTML = h;
  });
}

// Separate API callers for lazy-loaded data (don't override callAPI)
function fetchDividendCalendar(onComplete){
  google.script.run.withSuccessHandler(function(jsonStr){
    try {
      window._divCalendarData = JSON.parse(jsonStr);
    } catch(e) { window._divCalendarData = { calendar: [], available: false }; }
    if(onComplete) onComplete();
  }).withFailureHandler(function(){
    window._divCalendarData = { calendar: [], available: false };
    if(onComplete) onComplete();
  }).getDividendCalendar(_getSessionToken());
}

function fetchSparklineData(onComplete){
  google.script.run.withSuccessHandler(function(jsonStr){
    try {
      var parsed = JSON.parse(jsonStr);
      window._sparklineData = parsed.sparklines || {};
    } catch(e) { window._sparklineData = {}; }
    if(onComplete) onComplete();
  }).withFailureHandler(function(){
    window._sparklineData = {};
    if(onComplete) onComplete();
  }).getSparklineData(_getSessionToken());
}

// ═══════════════════════════════════════════════════════════════
// 📈 SPARKLINES — חיבור נתונים אמיתיים לטבלאות
// ═══════════════════════════════════════════════════════════════
function loadSparklines(symbols, tableId){
  if(!window._sparklineData || Object.keys(window._sparklineData).length === 0){
    // Fetch sparkline data if not already loaded
    fetchSparklineData(function(){
      applySparklinesToTable(symbols, tableId);
    });
  } else {
    applySparklinesToTable(symbols, tableId);
  }
}

function applySparklinesToTable(symbols, tableId){
  var table = document.getElementById(tableId);
  if(!table) return;
  var sparkData = window._sparklineData || {};

  // Add header if not exists
  var thead = table.querySelector('thead tr');
  if(thead && !thead.querySelector('.spark-th')){
    var th = document.createElement('th');
    th.className = 'spark-th';
    th.textContent = 'מגמה';
    th.style.cssText = 'width:64px;text-align:center';
    thead.appendChild(th);
  }

  // Add sparkline cells
  var rows = table.querySelectorAll('tbody tr');
  rows.forEach(function(row, idx){
    if(row.querySelector('.spark-cell')) return;
    var sym = symbols[idx] || '';
    var td = document.createElement('td');
    td.className = 'spark-cell';
    var canvasId = 'spark_' + sym.replace(/[^a-zA-Z0-9]/g, '_') + '_' + idx;
    var canvas = document.createElement('canvas');
    canvas.className = 'sparkline';
    canvas.id = canvasId;
    td.appendChild(canvas);
    row.appendChild(td);

    var data = sparkData[sym];
    if(data && data.length >= 2){
      var isUp = data[data.length-1] >= data[0];
      setTimeout(function(){
        renderSparkline(canvasId, data, isUp ? '#0CAF60' : '#E8394A');
      }, 50);
    } else {
      // No data — show placeholder
      canvas.style.opacity = '0.2';
      var ctx2 = canvas.getContext('2d');
      canvas.width = 56 * 2;
      canvas.height = 28 * 2;
      canvas.style.width = '56px';
      canvas.style.height = '28px';
      ctx2.font = '10px Heebo';
      ctx2.textAlign = 'center';
      ctx2.fillStyle = getComputedStyle(document.body).getPropertyValue('--muted');
      ctx2.fillText('—', 56, 28);
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// ⚡ FAB — כפתור פעולות מהירות (מובייל)
// ═══════════════════════════════════════════════════════════════
function initFAB(){
  try {
  if(!isMobileDevice()) return;
  if(document.querySelector('.fab-container')) return; // Already exists

  var fab = document.createElement('div');
  fab.className = 'fab-container';
  fab.innerHTML = `
    <div class="fab-menu" id="fabMenu">
      <div class="fab-item" onclick="document.getElementById('refreshBtn').click();toggleFAB()">
        <span class="fab-icon">🔄</span> רענן נתונים
      </div>
      <div class="fab-item" onclick="toggleSearch();toggleFAB()">
        <span class="fab-icon">🔍</span> חיפוש
      </div>
      <div class="fab-item" onclick="mobileGoTo('heatmap');toggleFAB()">
        <span class="fab-icon">🔥</span> Heatmap
      </div>
      <div class="fab-item" onclick="openAlertsModal();toggleFAB()">
        <span class="fab-icon">🔔</span> התראות מחיר
      </div>
      <div class="fab-item" onclick="mobileGoTo('emergency');toggleFAB()">
        <span class="fab-icon">🆘</span> חירום
      </div>
    </div>
    <button class="fab-btn" onclick="toggleFAB()" id="fabBtn">⚡</button>
  `;
  document.body.appendChild(fab);
  // Explicitly show — don't rely on CSS @media
  fab.style.display = 'block';
  fab.style.opacity = '0';
  fab.style.transition = 'opacity 0.3s ease';
  requestAnimationFrame(function(){
    fab.style.opacity = '1';
  });
  console.log('FAB initialized');
  } catch(e) { console.error('initFAB error:', e.message); }
}

function toggleFAB(){
  var menu = document.getElementById('fabMenu');
  var btn = document.getElementById('fabBtn');
  if(menu.classList.contains('open')){
    menu.classList.remove('open');
    btn.style.transform = 'rotate(0deg)';
    btn.textContent = '⚡';
  } else {
    menu.classList.add('open');
    btn.style.transform = 'rotate(45deg)';
    btn.textContent = '✕';
  }
}

function toggleSearch(){
  var bar = document.querySelector('.search-bar');
  if(bar){
    bar.style.display = bar.style.display === 'none' || !bar.style.display ? 'flex' : 'none';
    if(bar.style.display === 'flex'){
      var input = bar.querySelector('input');
      if(input) input.focus();
    }
  }
}

function showAlertsDialog(){
  var title = document.getElementById('mobile-detail-title');
  var body = document.getElementById('mobile-detail-body');
  if(!title || !body) return;

  var d = window._lastData || window._portfolioData;
  if(!d){ body.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--muted)">טוען נתונים...</div>'; return; }

  title.textContent = '🔔 התראות מחיר';

  // Collect all symbols from IBKR and FAIR
  var symbols = [];
  if(d.ibkr && d.ibkr.positions){
    d.ibkr.positions.forEach(function(p){
      if(p.sym && p.sym !== 'CASH-USD'){
        symbols.push({ sym: p.sym, name: p.sym, price: p.price, currency: '$', source: 'IBKR', valILS: p.valILS || (p.price * p.qty * (d.meta.usdIls||3.7)) });
      }
    });
  }
  if(d.fair && d.fair.positions){
    d.fair.positions.forEach(function(p){
      symbols.push({ sym: p.name, name: p.name, price: p.valILS || 0, currency: '₪', source: 'FAIR', valILS: p.valILS || 0 });
    });
  }

  // Load existing alerts
  var alerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');

  var html = '<div style="padding:1rem">';

  // Existing alerts section
  if(alerts.length > 0){
    html += '<div style="margin-bottom:1.5rem">';
    html += '<h3 style="font-size:1.1rem;font-weight:800;margin-bottom:0.75rem;display:flex;align-items:center;gap:6px">📋 התראות פעילות <span style="background:var(--blue-light,rgba(45,91,255,0.1));color:var(--blue);font-size:12px;padding:2px 8px;border-radius:20px">' + alerts.length + '</span></h3>';
    alerts.forEach(function(a, i){
      html += '<div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px 16px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center">';
      html += '<div><div style="font-weight:700;font-size:0.95rem">' + escapeHtml(a.sym) + '</div>';
      var typeText = a.type === 'above' ? 'מעל $' + (a.price||'') : a.type === 'below' ? 'מתחת $' + (a.price||'') : a.type === 'change5' ? 'שינוי 5% ביום' : 'שינוי 10% ביום';
      html += '<div style="color:var(--muted);font-size:0.85rem">' + typeText + '</div></div>';
      html += '<button onclick="deleteAlert(' + i + ')" style="background:var(--red-light,rgba(232,57,74,0.1));color:var(--red);border:none;border-radius:8px;padding:6px 12px;cursor:pointer;font-size:13px;font-weight:600">🗑️</button>';
      html += '</div>';
    });
    html += '</div>';
  }

  // Symbol list
  html += '<h3 style="font-size:1.1rem;font-weight:800;margin-bottom:0.75rem;display:flex;align-items:center;gap:6px">📊 בחר נייר להתראה <span style="background:var(--blue-light,rgba(45,91,255,0.1));color:var(--blue);font-size:12px;padding:2px 8px;border-radius:20px">' + symbols.length + '</span></h3>';
  html += '<div style="max-height:60vh;overflow-y:auto;border-radius:12px">';

  symbols.forEach(function(s){
    var sourceColor = s.source === 'IBKR' ? 'var(--blue)' : 'var(--green)';
    var sourceBg = s.source === 'IBKR' ? 'rgba(45,91,255,0.1)' : 'rgba(12,175,96,0.1)';
    var priceStr = s.currency + (s.price ? (s.price > 100 ? s.price.toFixed(0) : s.price.toFixed(2)) : '—');
    html += '<div onclick="openAlertModalFor(\'' + s.sym.replace(/'/g, '') + '\',\'' + s.source + '\')" style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px 18px;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;transition:transform 0.1s" ontouchstart="this.style.transform=\'scale(0.98)\'" ontouchend="this.style.transform=\'\'">';
    html += '<div style="display:flex;align-items:center;gap:12px">';
    html += '<div style="width:48px;height:48px;border-radius:12px;background:' + sourceBg + ';display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:' + sourceColor + ';flex-shrink:0">' + s.sym.substring(0,2).toUpperCase() + '</div>';
    html += '<div><div style="font-weight:700;font-size:1rem">' + escapeHtml(s.name) + '</div>';
    html += '<div style="display:flex;align-items:center;gap:8px"><span style="font-size:0.85rem;color:var(--muted);font-family:JetBrains Mono,monospace">' + priceStr + '</span>';
    html += '<span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:10px;background:' + sourceBg + ';color:' + sourceColor + '">' + s.source + '</span></div></div>';
    html += '</div><div style="font-size:28px;color:var(--muted2)">›</div></div>';
  });

  html += '</div></div>';

  body.innerHTML = html;
  document.getElementById('mobile-detail').style.display = 'block';
  document.getElementById('mobile-home').style.display = 'none';
}

function deleteAlert(idx){
  var alerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
  alerts.splice(idx, 1);
  localStorage.setItem('priceAlerts', JSON.stringify(alerts));
  showAlertsDialog(); // refresh
}

function openAlertModalFor(sym, source){
  var isIBKR = source === 'IBKR';
  var currencyLabel = isIBKR ? 'מחיר יעד ($)' : 'מחיר יעד (₪)';
  var currencySym = isIBKR ? '$' : '₪';

  // Find current price for this symbol
  var d = window._lastData || window._portfolioData;
  var currentPrice = 0;
  var valILS = 0;
  if(d) {
    if(isIBKR && d.ibkr && d.ibkr.positions) {
      var pos = d.ibkr.positions.find(function(p){ return p.sym === sym; });
      if(pos) { currentPrice = pos.price || 0; valILS = pos.valILS || 0; }
    } else if(d.fair && d.fair.positions) {
      var pos = d.fair.positions.find(function(p){ return p.name === sym; });
      if(pos) { currentPrice = pos.valILS || 0; valILS = pos.valILS || 0; }
    }
  }

  var priceHint = currentPrice > 0
    ? '<div style="background:var(--bg3);border-radius:10px;padding:10px 14px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center">'
      + '<span style="font-size:14px;color:var(--muted)">מחיר נוכחי</span>'
      + '<span style="font-size:18px;font-weight:800;font-family:JetBrains Mono,monospace">' + currencySym + (currentPrice > 100 ? currentPrice.toFixed(0) : currentPrice.toFixed(2)) + '</span>'
      + '</div>'
    : '';

  var ov = document.createElement('div');
  ov.className = 'emg-modal-overlay';
  ov.id = 'alertPickOverlay';
  ov.innerHTML = '<div class="emg-modal">' +
    '<div class="emg-modal-title">🔔 התראה עבור ' + escapeHtml(sym) + '</div>' +
    priceHint +
    '<div class="emg-field"><label class="emg-field-label">סוג התראה</label>' +
      '<select class="emg-field-select" id="alertTypePick">' +
        '<option value="above">מעל מחיר 📈</option>' +
        '<option value="below">מתחת למחיר 📉</option>' +
        '<option value="change5">שינוי 5% ביום ⚡</option>' +
        '<option value="change10">שינוי 10% ביום 🔥</option>' +
      '</select></div>' +
    '<div class="emg-field" id="alertPriceField"><label class="emg-field-label">' + currencyLabel + '</label>' +
      '<input type="number" class="emg-field-input" id="alertPricePick" step="0.01" placeholder="' + (currentPrice > 0 ? currentPrice.toFixed(2) : '0.00') + '"></div>' +
    '<div style="font-size:13px;color:var(--muted);margin-bottom:12px;line-height:1.6">'
    + '📲 תקבל התראה בטלגרם + דחיפה בטלפון<br>'
    + '⏰ נבדק פעמיים ביום: 08:00 ו-18:00'
    + '</div>' +
    '<div class="emg-modal-actions">' +
      '<button class="emg-cancel-btn" onclick="document.getElementById(\'alertPickOverlay\').remove()">ביטול</button>' +
      '<button class="emg-save-btn" onclick="saveAlertPick(\'' + sym + '\')">שמור התראה</button>' +
    '</div></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click', function(e){ if(e.target === ov) ov.remove(); });

  // Pre-fill with current price as default
  if(currentPrice > 0) {
    var priceInput = document.getElementById('alertPricePick');
    // Don't auto-fill, just use as placeholder
  }

  // Hide price field for change alerts
  var typeSel = document.getElementById('alertTypePick');
  typeSel.addEventListener('change', function(){
    var priceField = document.getElementById('alertPriceField');
    priceField.style.display = (this.value === 'change5' || this.value === 'change10') ? 'none' : 'block';
  });
}

function saveAlertPick(sym){
  var type = document.getElementById('alertTypePick').value;
  var price = document.getElementById('alertPricePick').value;
  if(!type){ alert('נא לבחור סוג התראה'); return; }
  if((type === 'above' || type === 'below') && !price){ alert('נא להזין מחיר יעד'); return; }

  // Save to localStorage (instant UI)
  var alerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
  alerts.push({ sym: sym, type: type, price: price, created: Date.now() });
  localStorage.setItem('priceAlerts', JSON.stringify(alerts));

  // Also save to backend for Telegram + push notifications
  try {
    google.script.run.savePriceAlert(sym, type, price || '0', _getSessionToken());
  } catch(e) { console.log('Backend save skipped: ' + e); }

  // Request notification permission for push
  if('Notification' in window && Notification.permission === 'default'){
    Notification.requestPermission();
  }

  var ov = document.getElementById('alertPickOverlay');
  if(ov) ov.remove();

  // Toast
  var t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--card);border:1px solid var(--green);border-radius:12px;padding:12px 24px;font-size:14px;font-weight:600;z-index:10001;box-shadow:var(--shadow-lg)';
  t.textContent = '✅ התראה נשמרה עבור ' + sym;
  document.body.appendChild(t);
  setTimeout(function(){ t.remove(); }, 3000);

  // Refresh the list
  if(document.getElementById('alertsListOverlay')){ openAlertsModal(); }
  else if(document.getElementById('mobile-detail') && document.getElementById('mobile-detail').style.display !== 'none'){ showAlertsDialog(); }
}


// ═══ ✅ v11.4: תג גרסה — מוזרק מהשרת ב-doGet (window.APP_VERSION) ═══
function fillVersionBadges(){
  var v = window.APP_VERSION || null;
  var label = v ? ('v' + v) : 'v ?';
  ['verBadge','verBadgeM'].forEach(function(id){
    var el = document.getElementById(id);
    if(!el) return;
    el.textContent = label;
    el.title = v ? 'גרסה ' + v + ' פעילה' : 'לא נמצאה גרסה — פרסם גרסה חדשה (Deploy)';
  });
}
function showVersionToast(){
  var v = window.APP_VERSION;
  if(v) showToast('גרסה ' + v + ' פעילה 🚀');
  else showToast('⚠️ הגרסה לא זמינה — כנראה לא פורסמה גרסה חדשה אחרי העדכון');
}
// הגרסה מוזרקת מהשרת בסוף הטעינה — לכן ממלאים את התג רק אחרי שהמסמך מוכן
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fillVersionBadges);
else fillVersionBadges();
(function(){const isMobile=window.innerWidth<=768||/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);if(isMobile){document.documentElement.classList.add('is-mobile');document.querySelector('.tabs').style.display='none';document.getElementById('mobile-home').style.display='block';const clk=document.getElementById('clock');if(clk)clk.style.display='none';document.querySelectorAll('.content').forEach(c=>c.style.display='none');}})();

// ═══════════════════════════════════════════════════════════════
// 🔐 Login Logic — PIN + WebAuthn (Fingerprint / Face ID)
// ═══════════════════════════════════════════════════════════════

var _loginPin = '';
var _loginMaxLen = 4;
var _loginToken = null;
var _loginBioAvailable = false;
var _loginCredId = null;

// ✅ v11: טוקן הסשן — כל קריאה לשרת עוברת דרך כאן
function _getSessionToken(){ return _loginToken || sessionStorage.getItem('loginToken'); }
function _handleAuthError(e){ if(e && (e.message === 'unauthorized' || String(e).indexOf('unauthorized') > -1)){ showLogin(); return true; } return false; }
var _loginIsMobile = false;

// Check if mobile device
function _isLoginMobile() {
  var ua = navigator.userAgent || '';
  var touch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  var small = window.innerWidth <= 768;
  var mobileUA = /Android|iPhone|iPad|iPod|Mobile|Silk/i.test(ua);
  _loginIsMobile = (touch && (small || mobileUA)) || mobileUA;
  return _loginIsMobile;
}

// Check WebAuthn availability — try multiple approaches
function _checkBioSupport() {
  var hasCredentials = !!(navigator.credentials && window.PublicKeyCredential);
  var isMobile = _isLoginMobile();

  console.log('BioCheck: hasCredentials=' + hasCredentials + ' isMobile=' + isMobile + ' innerWidth=' + window.innerWidth + ' UA=' + navigator.userAgent.substring(0,50));

  if (!hasCredentials) {
    console.log('BioCheck: navigator.credentials not available');
    _loginBioAvailable = false;
    return;
  }

  if (!isMobile) {
    console.log('BioCheck: not mobile, skipping biometric');
    _loginBioAvailable = false;
    return;
  }

  // Check if platform authenticator is available
  if (PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
    PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then(function(available) {
      _loginBioAvailable = available;
      console.log('BioCheck: platformAuthenticatorAvailable=' + available);
    }).catch(function(e) {
      console.log('BioCheck: error checking platform authenticator: ' + e);
      _loginBioAvailable = false;
    });
  } else {
    // Older API — assume available if credentials API exists
    _loginBioAvailable = isMobile;
  }
}

_checkBioSupport();

// ✅ v11.6.2.0: זיהוי מעטפת — true רק כשהאפליקציה נטענת בתוך ה-Shell בגיטהאב.
// בגישה ישירה ל-/exec מצד הדפדפן top === parent, ובתוך המעטפת יש רמת iframe נוספת (top ≠ parent).
function _isInShell() {
  try { return window.top !== window.parent; } catch(e) { return false; }
}

// ✅ v11.6.2.0: זכירת מכשיר — בתוך המעטפת, טוקן localStorage שעדיין תקף בשרת (7 ימים) = כניסה אוטומטית.
// טביעת האצבע עצמה נבדקת בשער של המעטפת (שם WebAuthn עובד) — לא ב-iframe של גוגל שחוסם אותה.
function initLogin() {
  var lToken = localStorage.getItem('loginTokenL');
  if (lToken && _isInShell()) {
    google.script.run.withSuccessHandler(function(res) {
      try {
        var r = JSON.parse(res);
        if (r.valid) {
          _loginToken = lToken;
          sessionStorage.setItem('loginToken', lToken);
          unlockApp();
          return;
        }
      } catch(e) {}
      localStorage.removeItem('loginTokenL'); // תוקף פג — מנקים וממשיכים לקוד
      _initLoginFlow();
    }).withFailureHandler(function() {
      _initLoginFlow(); // שרת לא זמין — ממשיכים בזרימה הרגילה
    }).checkLoginSession(lToken);
    return;
  }
  _initLoginFlow();
}

function _initLoginFlow() {
  // Check if session token exists in sessionStorage
  var sessionToken = sessionStorage.getItem('loginToken');
  if (sessionToken) {
    // Verify with server
    google.script.run.withSuccessHandler(function(res) {
      try {
        var r = JSON.parse(res);
        if (r.valid) {
          _loginToken = sessionToken;
          unlockApp();
          return;
        }
      } catch(e) {}
      // Session invalid — show login
      showLogin();
    }).withFailureHandler(function() {
      showLogin();
    }).checkLoginSession(sessionToken);
    return;
  }
  showLogin();
}

function showLogin() {
  // Check if login is enabled
  google.script.run.withSuccessHandler(function(res) {
    try {
      var r = JSON.parse(res);
      if (r.needsSetup) {
        // First time — show setup
        document.getElementById('loginSubtitle').textContent = 'הגדר קוד כניסה חדש (4 ספרות)';
        document.getElementById('loginSetupHint').textContent = 'קוד כניסה ראשוני — זכור את הקוד! ניתן לשנות בהגדרות';
        _loginMode = 'setup';
      } else {
        _loginMode = 'login';
      }
    } catch(e) {
      _loginMode = 'login';
    }
    document.getElementById('loginOverlay').classList.remove('hidden');
  }).withFailureHandler(function() {
    // If GAS fails, just load the app (don't lock out)
    unlockApp();
  }).getWebAuthnCredentialId();
}

var _loginMode = 'login'; // 'login' | 'setup'

function loginPress(num) {
  if (_loginPin.length >= _loginMaxLen) return;
  haptic(15);
  _loginPin += num.toString();
  updateLoginDots();
  if (_loginPin.length === _loginMaxLen) {
    setTimeout(submitLogin, 200);
  }
}

function loginDelete() {
  haptic(10);
  _loginPin = _loginPin.slice(0, -1);
  updateLoginDots();
  hideLoginError();
}
function loginDeleteAll() {
  haptic(15);
  _loginPin = '';
  updateLoginDots();
  hideLoginError();
}
function loginCancel() {
  haptic(20);
  _loginPin = '';
  updateLoginDots();
  hideLoginError();
  // On desktop, can't really cancel — just clear
  // On mobile, could close webview but we stay
}

function updateLoginDots() {
  var dots = document.querySelectorAll('#loginPinDots .login-pin-dot');
  dots.forEach(function(dot, i) {
    if (i < _loginPin.length) dot.classList.add('filled');
    else dot.classList.remove('filled');
  });
}

function showLoginError(msg) {
  var el = document.getElementById('loginError');
  el.textContent = msg;
  el.classList.add('show');
  // Shake animation
  var card = document.querySelector('.login-card');
  card.style.animation = 'none';
  setTimeout(function() {
    card.style.animation = 'slideUp 0.3s';
  }, 10);
  haptic(50);
}

function hideLoginError() {
  document.getElementById('loginError').classList.remove('show');
}

function submitLogin() {
  if (_loginMode === 'setup') {
    // First time setup — save PIN
    google.script.run.withSuccessHandler(function(res) {
      try {
        var r = JSON.parse(res);
        if (r.success) {
          // After setup, offer WebAuthn registration
          // ✅ v11: משתמשים בטוקן האמיתי שהוחזר מהשרת (במקום 'setup' שנחסם ע"י ה-gate)
          _loginToken = r.token || 'setup';
          sessionStorage.setItem('loginToken', _loginToken);
          if (r.token) localStorage.setItem('loginTokenL', r.token); // ✅ v11.6.2.0: זכירת מכשיר
          hideLoginError();
          // Ask about biometric
          var card = document.querySelector('.login-card');
          card.innerHTML = '<div class="login-logo">תיק <em>Ofir</em></div>' +
            '<div class="login-subtitle">קוד הוגדר בהצלחה! ✅</div>' +
            '<div style="font-size:15px;color:var(--muted);margin-bottom:24px;line-height:1.6">הכניסה מאובטחת עם קוד PIN ונעילה אוטומטית תוך 3 דקות</div>' +
            '<button class="login-key" style="width:100%;aspect-ratio:auto;padding:14px;border-radius:14px;background:var(--blue);color:#fff;font-size:18px" onclick="unlockApp()">כניסה לאתר</button>';
        } else {
          showLoginError(r.error || 'שגיאה');
          _loginPin = '';
          updateLoginDots();
        }
      } catch(e) {
        showLoginError('שגיאת מערכת');
        _loginPin = '';
        updateLoginDots();
      }
    }).withFailureHandler(function() {
      showLoginError('שגיאת תקשורת');
      _loginPin = '';
      updateLoginDots();
    }).setupLoginPIN(_loginPin);
  } else {
    // Normal login
    google.script.run.withSuccessHandler(function(res) {
      try {
        var r = JSON.parse(res);
        if (r.success) {
          _loginToken = r.token;
          sessionStorage.setItem('loginToken', r.token);
          localStorage.setItem('loginTokenL', r.token); // ✅ v11.6.2.0: זכירת מכשיר (7 ימים)
          hideLoginError();
          _unlockAfterAuth();
          unlockApp();
        } else if (r.needSetup) {
          // Switch to setup mode
          _loginMode = 'setup';
          document.getElementById('loginSubtitle').textContent = 'הגדר קוד כניסה חדש (4 ספרות)';
          document.getElementById('loginSetupHint').textContent = 'קוד כניסה ראשוני — זכור את הקוד!';
          _loginPin = '';
          updateLoginDots();
          hideLoginError();
        } else {
          showLoginError(r.error || 'קוד שגוי');
          _loginPin = '';
          updateLoginDots();
        }
      } catch(e) {
        showLoginError('שגיאת מערכת');
        _loginPin = '';
        updateLoginDots();
      }
    }).withFailureHandler(function() {
      showLoginError('שגיאת תקשורת');
      _loginPin = '';
      updateLoginDots();
    }).verifyLoginPIN(_loginPin);
  }
}

function unlockApp() {
  var overlay = document.getElementById('loginOverlay');
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.3s';
  setTimeout(function() {
    overlay.classList.add('hidden');
    overlay.style.opacity = '';
    overlay.style.transition = '';
  }, 300);
  // Reset lock state and start inactivity timer
  _isLocked = false;
  _resetLockTimer();
  // Now load the app
  loadData();
}

// ══════ WebAuthn — Biometric Registration & Authentication ══════

async function registerBiometric(fromSettings) {
  console.log('registerBiometric called, fromSettings=' + fromSettings, '_loginBioAvailable=' + _loginBioAvailable);

  if (!_loginBioAvailable) {
    var msg = 'המכשיר לא תומך בטביעת אצבע';
    if (fromSettings) {
      showToast(msg);
    } else {
      showToast(msg);
      setTimeout(unlockApp, 1500);
    }
    return;
  }

  // Check if navigator.credentials actually works (not just exists)
  if (!navigator.credentials || !navigator.credentials.create) {
    var msg2 = 'דפדפן לא תומך ב-WebAuthn';
    console.error(msg2);
    showToast(msg2);
    if (!fromSettings) setTimeout(unlockApp, 1500);
    return;
  }

  try {
    var rpId = location.hostname;
    console.log('WebAuthn register — rpId:', rpId, 'origin:', location.origin);

    var challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    var userId = new Uint8Array(16);
    crypto.getRandomValues(userId);

    var publicKey = {
      challenge: challenge,
      rp: { name: 'תיק Ofir', id: rpId },
      user: {
        id: userId,
        name: 'Ofir',
        displayName: 'Ofir'
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },   // ES256
        { type: 'public-key', alg: -257 }  // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'preferred'
      },
      timeout: 60000,
      attestation: 'none'
    };

    console.log('WebAuthn: calling navigator.credentials.create()...');
    var credential = await navigator.credentials.create({ publicKey: publicKey });
    console.log('WebAuthn: create() succeeded!', credential);

    // Store credential ID (base64)
    var credIdBytes = new Uint8Array(credential.rawId);
    var credIdBase64 = btoa(String.fromCharCode.apply(null, credIdBytes));
    _loginCredId = credIdBase64;

    // Save to server
    google.script.run.withSuccessHandler(function(res) {
      try {
        var r = JSON.parse(res);
        if (r.success) {
          localStorage.setItem('webauthn_cred_id', credIdBase64);
          showToast('טביעת אצבע נשמרה בהצלחה! 👆');
          if (!fromSettings) {
            setTimeout(unlockApp, 1200);
          } else {
            // Close settings modal if open
            var old = document.getElementById('loginSettingsOverlay');
            if (old) old.remove();
          }
        } else {
          showToast('שגיאה בשמירה: ' + (r.error || ''));
          if (!fromSettings) setTimeout(unlockApp, 1500);
        }
      } catch(e) {
        showToast('שגיאה בשמירה');
        if (!fromSettings) setTimeout(unlockApp, 1500);
      }
    }).withFailureHandler(function(err) {
      console.error('GAS registerWebAuthn failed:', err);
      showToast('שגיאת תקשורת עם השרת');
      if (!fromSettings) setTimeout(unlockApp, 1500);
    }).registerWebAuthn(credIdBase64);

  } catch(e) {
    console.error('WebAuthn registration error:', e.name, e.message, e);
    var errMsg = '';
    if (e.name === 'NotAllowedError') {
      errMsg = 'בוטל על ידי המשתמש';
    } else if (e.name === 'SecurityError') {
      errMsg = 'חסום על ידי הדפדפן (iframe)';
    } else if (e.name === 'NotSupportedError') {
      errMsg = 'לא נתמך במכשיר';
    } else if (e.name === 'InvalidStateError') {
      errMsg = 'טביעת אצבע כבר רשומה';
    } else {
      errMsg = 'שגיאה: ' + (e.message || e.name || 'לא ידוע');
    }
    showToast('טביעת אצבע: ' + errMsg);
    if (!fromSettings) setTimeout(unlockApp, 2000);
  }
}

async function loginBiometric() {
  if (!_loginBioAvailable || !_loginCredId) {
    showLoginError('טביעת אצבע לא מוגדרת');
    return;
  }
  try {
    var rpId = location.hostname;
    console.log('WebAuthn auth rpId:', rpId);

    // Decode stored credential ID
    var credIdBytes = Uint8Array.from(atob(_loginCredId), function(c) { return c.charCodeAt(0); });

    var challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    var publicKey = {
      challenge: challenge,
      timeout: 60000,
      rpId: rpId,
      userVerification: 'preferred',
      allowCredentials: [{
        id: credIdBytes,
        type: 'public-key',
        transports: ['internal']
      }]
    };

    var assertion = await navigator.credentials.get({ publicKey: publicKey });

    if (assertion) {
      var assertCredId = btoa(String.fromCharCode.apply(null, new Uint8Array(assertion.rawId)));
      var assertionData = JSON.stringify({
        credentialId: assertCredId,
        type: assertion.type
      });

      google.script.run.withSuccessHandler(function(res) {
        try {
          var r = JSON.parse(res);
          if (r.success) {
            _loginToken = r.token;
            sessionStorage.setItem('loginToken', r.token);
            localStorage.setItem('loginTokenL', r.token); // ✅ v11.6.2.0: זכירת מכשיר (7 ימים)
            hideLoginError();
            _unlockAfterAuth();
            unlockApp();
          } else {
            showLoginError('אימות נכשל');
            _loginPin = '';
            updateLoginDots();
          }
        } catch(e) {
          showLoginError('שגיאת אימות');
          _loginPin = '';
          updateLoginDots();
        }
      }).withFailureHandler(function() {
        showLoginError('שגיאת תקשורת');
        _loginPin = '';
        updateLoginDots();
      }).verifyWebAuthn(assertionData);
    }
  } catch(e) {
    console.error('WebAuthn auth error:', e);
    if (e.name === 'NotAllowedError') {
      // User cancelled — just stay on PIN screen, no scary message
      _loginPin = '';
      updateLoginDots();
    } else {
      showLoginError('טביעת אצבע לא זמינה — הקלד קוד');
      _loginPin = '';
      updateLoginDots();
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// 🔐 Login Settings — מסך הגדרות כניסה ואבטחה
// ═══════════════════════════════════════════════════════════════

function openLoginSettings() {
  google.script.run.withSuccessHandler(function(res) {
    try {
      var r = JSON.parse(res);
      var hasBio = !!r.credentialId;
      var hasPin = !!r.hasPin;

      var ov = document.createElement('div');
      ov.className = 'emg-modal-overlay';
      ov.id = 'loginSettingsOverlay';
      ov.innerHTML = '<div class="emg-modal" style="max-width:420px">' +
        '<div class="emg-modal-title">🔐 הגדרות כניסה ואבטחה</div>' +

        '<div style="background:var(--bg3);border-radius:12px;padding:16px;margin-bottom:16px">' +
          '<div style="font-size:16px;font-weight:700;margin-bottom:8px">קוד כניסה (PIN)</div>' +
          '<div style="font-size:14px;color:var(--muted);margin-bottom:12px">' + (hasPin ? 'קוד פעיל ✅' : 'לא מוגדר ❌') + '</div>' +
          '<button class="emg-save-btn" style="width:100%" onclick="changeLoginPIN()">שנה קוד כניסה</button>' +
        '</div>' +

        '<div style="background:var(--bg3);border-radius:12px;padding:16px;margin-bottom:16px">' +
          '<div style="font-size:16px;font-weight:700;margin-bottom:8px">טביעת אצבע / Face ID</div>' +
          '<div style="font-size:14px;color:var(--muted);line-height:1.5">לא זמין ב-Apps Script — גוגל חוסמת WebAuthn ב-iframe. השתמש בקוד PIN לכניסה מאובטחת.</div>' +
        '</div>' +

        '<div style="background:var(--bg3);border-radius:12px;padding:16px;margin-bottom:16px">' +
          '<div style="font-size:16px;font-weight:700;margin-bottom:8px">נעילה אוטומטית</div>' +
          '<div style="font-size:14px;color:var(--muted)">3 דקות חוסר פעילות · דקה ברקע</div>' +
          '<div style="font-size:14px;color:var(--muted);margin-top:4px">סטטוס: ' + (_isLocked ? '🔴 נעול' : '🟢 פעיל') + '</div>' +
        '</div>' +

        '<div style="background:var(--bg3);border-radius:12px;padding:16px;margin-bottom:16px;font-size:13px;color:var(--muted);line-height:1.6">' +
          '<b>בדיקת מערכת:</b><br>' +
          'מכשיר נייד: ' + (_loginIsMobile ? '✅ כן' : '❌ לא') + '<br>' +
          'WebAuthn: ' + (_loginBioAvailable ? '✅ זמין' : '❌ לא זמין') + '<br>' +
          'רוחב מסך: ' + window.innerWidth + 'px<br>' +
          'דפדפן: ' + (navigator.userAgent || '').substring(0, 60) +
        '</div>' +

        '<div class="emg-modal-actions">' +
          '<button class="emg-cancel-btn" onclick="document.getElementById(\'loginSettingsOverlay\').remove()">סגור</button>' +
        '</div>' +
      '</div>';
      document.body.appendChild(ov);
      ov.addEventListener('click', function(e) { if(e.target === ov) ov.remove(); });
    } catch(e) {
      showToast('שגיאה בטעינת הגדרות');
    }
  }).withFailureHandler(function() {
    showToast('שגיאת תקשורת');
  }).getWebAuthnCredentialId();
}

function changeLoginPIN() {
  // Remove old overlay
  var old = document.getElementById('loginSettingsOverlay');
  if (old) old.remove();

  // Show PIN setup screen
  _loginMode = 'setup';
  _loginPin = '';
  var overlay = document.getElementById('loginOverlay');
  overlay.classList.remove('hidden');
  overlay.style.opacity = '1';
  document.getElementById('loginSubtitle').textContent = 'הזן קוד כניסה חדש (4 ספרות)';
  document.getElementById('loginSetupHint').textContent = 'שינוי קוד כניסה — זכור את הקוד החדש!';
  updateLoginDots();
}

async function registerBiometricFromSettings() {
  // DON'T remove the settings overlay — keep it so user sees result
  await registerBiometric(true);
}

function removeBiometric() {
  google.script.run.withSuccessHandler(function(res) {
    _loginCredId = null;
    localStorage.removeItem('webauthn_cred_id');
    showToast('טביעת אצבע הוסרה');
    var old = document.getElementById('loginSettingsOverlay');
    if (old) old.remove();
  }).withFailureHandler(function() {
    showToast('שגיאה בהסרה');
  }).removeWebAuthn(_getSessionToken());
}

// ═══════════════════════════════════════════════════════════════
// 🔒 Auto-Lock — 3 דקות חוסר פעילות או מעבר לאפליקציה אחרת
// ═══════════════════════════════════════════════════════════════

var _lockTimer = null;
var _lockTimeoutMs = 180000; // 3 דקות חוסר פעילות בתוך האפליקציה
var _lockHiddenMs = 60000; // ✅ v11.6.0.1: דקה ברקע לפני נעילה (היה 10 שניות — נעל מהר מדי)
var _isLocked = false;
var _hasBiometric = false; // מתעדכן אחרי רישום/כניסה

function _resetLockTimer() {
  if (_isLocked) return; // Don't reset if already locked
  if (_lockTimer) clearTimeout(_lockTimer);
  _lockTimer = setTimeout(_autoLock, _lockTimeoutMs);
}

function _autoLock() {
  if (_isLocked) return;
  _isLocked = true;
  _lockTimer = null;

  // Save whether biometric is available for re-auth
  _hasBiometric = !!_loginCredId && _loginBioAvailable;

  // Show login overlay
  var overlay = document.getElementById('loginOverlay');
  if (overlay) {
    overlay.classList.remove('hidden');
    overlay.style.opacity = '1';
    overlay.style.transition = 'opacity 0.3s';

    // Update subtitle
    var sub = document.getElementById('loginSubtitle');
    if (sub) sub.textContent = 'ננעל מחוסר פעילות — הזן קוד כניסה';




  }

  // ✅ v11.6.2.0: בתוך המעטפת — מודיעים לה להציג שער טביעת אצבע במקום קוד
  try { if (_isInShell()) window.parent.parent.postMessage({ cmd: 'app-locked' }, '*'); } catch(e) {}

  // Clear session
  sessionStorage.removeItem('loginToken');
  _loginPin = '';
  if (typeof updateLoginDots === 'function') updateLoginDots();

  haptic(30);
  console.log('🔒 Auto-locked after inactivity');
}

function _unlockAfterAuth() {
  _isLocked = false;
  _resetLockTimer();
}

// Reset timer on any user activity
['click', 'touchstart', 'keydown', 'mousemove', 'scroll'].forEach(function(evt) {
  document.addEventListener(evt, function() {
    if (!_isLocked) _resetLockTimer();
  }, { passive: true });
});

// Lock when tab becomes hidden (user switched apps)
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    // ✅ v11.6.0.1: ירידה לרקע — דקה של רחמים לפני נעילה (היה 10 שניות)
    if (_lockTimer) clearTimeout(_lockTimer);
    _lockTimer = setTimeout(_autoLock, _lockHiddenMs);
  } else {
    // User came back — if not yet locked, reset to full 3 min
    if (!_isLocked) {
      _resetLockTimer();
    }
  }
});

// Also lock on blur (mobile backgrounding)
window.addEventListener('blur', function() {
  // ✅ v11.6.0.1: רק ירידה אמיתית לרקע נועלת (document.hidden) —
  // חלונות מערכת כמו Face ID / מקלדת מציתים blur מבלי לצאת מהאפליקציה, ואסור שינעלו
  if (!_isLocked && document.hidden) {
    if (_lockTimer) clearTimeout(_lockTimer);
    _lockTimer = setTimeout(_autoLock, _lockHiddenMs);
  }
});

window.addEventListener('focus', function() {
  if (!_isLocked) {
    _resetLockTimer();
  }
});



// Start the login flow
initLogin();
</script>

<script>
// ══════ הסתרת בר "דיווח על התנהגות פוגעת" של Google ══════
// הבר נמצא מחוץ ל-iframe שלנו — מנסים להסתיר אותו דרך CSS injection
(function(){
  try {
    // נסיון 1: inject CSS ל-parent frame (עובד רק באותו origin)
    var style = document.createElement('style');
    style.textContent = '[role="banner"],.docs-butterbar-container,#docs-butterbar-container,.butterbar,#reportAbuse,.report-abuse,div[aria-label*="Report"],div[aria-label*="דיווח"]{display:none !important;visibility:hidden !important;height:0 !important}';
    document.head.appendChild(style);
  } catch(e){}
})();
</script>


<script>
// ══════ Pull-to-Refresh ══════
(function(){
  var startY=0, pulling=false, threshold=70;
  var ptr = document.createElement('div');
  ptr.id='ptrIndicator';
  ptr.style.cssText = 'position:fixed;top:0;left:0;right:0;height:0;z-index:9999;overflow:hidden;display:flex;align-items:center;justify-content:center;background:var(--bg2);transition:height 0.2s ease;font-size:14px;color:var(--muted);font-family:Heebo,sans-serif;gap:8px';
  ptr.innerHTML = '<span id="ptrIcon" style="font-size:20px;transition:transform 0.2s">↓</span><span id="ptrText">משוך לרענון</span>';
  document.body.appendChild(ptr);

  document.addEventListener('touchstart', function(e){
    if(window.scrollY <= 0){
      startY = e.touches[0].clientY;
      pulling = true;
    } else { pulling = false; }
  }, {passive: true});

  document.addEventListener('touchmove', function(e){
    if(!pulling) return;
    var diff = e.touches[0].clientY - startY;
    if(diff > 0 && diff < 120){
      ptr.style.height = diff + 'px';
      ptr.style.transition = 'none';
      var icon = document.getElementById('ptrIcon');
      var text = document.getElementById('ptrText');
      if(diff > threshold){
        icon.style.transform = 'rotate(180deg)';
        text.textContent = 'שחרר לרענון';
      } else {
        icon.style.transform = 'rotate(0deg)';
        text.textContent = 'משוך לרענון';
      }
    }
  }, {passive: true});

  document.addEventListener('touchend', function(e){
    if(!pulling) return;
    pulling = false;
    ptr.style.transition = 'height 0.25s ease';
    var diff = parseInt(ptr.style.height) || 0;
    if(diff > threshold){
      ptr.style.height = '50px';
      document.getElementById('ptrText').textContent = 'מרענן...';
      document.getElementById('ptrIcon').textContent = '🔄';
      // Trigger refresh
      if(typeof refreshFromIBKR === 'function') refreshFromIBKR();
      setTimeout(function(){
        ptr.style.height = '0px';
        document.getElementById('ptrIcon').textContent = '↓';
        document.getElementById('ptrIcon').style.transform = 'rotate(0deg)';
        document.getElementById('ptrText').textContent = 'משוך לרענון';
      }, 2000);
    } else {
      ptr.style.height = '0px';
    }
  }, {passive: true});
})();
</script>
<!-- Bottom Navigation (mobile only) -->
<div class="bottom-nav" id="bottomNav">
  <div class="bottom-nav-item active" onclick="go('overview')"><div class="bottom-nav-icon">🏠</div>סקירה</div>
  <div class="bottom-nav-item" onclick="go('ibkr')"><div class="bottom-nav-icon">📈</div>IBKR</div>
  <div class="bottom-nav-item" onclick="go('fair')"><div class="bottom-nav-icon">🏦</div>FAIR</div>
  <div class="bottom-nav-item" onclick="go('dividends')"><div class="bottom-nav-icon">📅</div>דיבידנדים</div>
  <div class="bottom-nav-item" onclick="go('history')"><div class="bottom-nav-icon">📊</div>היסטוריה</div>
  <div class="bottom-nav-item" onclick="go('emergency')"><div class="bottom-nav-icon" style="color:#E8394A">🆘</div>חירום</div>
</div>
<script>
// Update bottom nav active state on tab change
(function(){
  var origGo = window.go;
  window.go = function(id){
    // Auto-lock emergency when navigating away
    if(id !== 'emergency' && _emgUnlocked){
      if(typeof emgLock === 'function') emgLock();
      if(_emgTimer){ clearTimeout(_emgTimer); _emgTimer = null; }
    }
    origGo(id);
    var navItems = document.querySelectorAll('.bottom-nav-item');
    var navMap = {overview:0, ibkr:1, fair:2, dividends:3, history:4, emergency:4};
    navItems.forEach(function(item, i){
      item.classList.toggle('active', i === navMap[id]);
    });
    // Show bottom nav only on desktop tabs, hide on mobile home
    var mobileHome = document.getElementById('mobile-home');
    if(mobileHome){
      var bn = document.getElementById('bottomNav');
      if(mobileHome.style.display !== 'none') bn.style.display = 'flex';
      else bn.style.display = 'flex';
    }
  };
})();
</script>

<script>
// ══════ PWA: Smart Install Detection ══════
// Shows install hint on first visit (dismissible, localStorage)
(function(){
  var dismissed = localStorage.getItem('pwa_hint_dismissed');
  if(dismissed) return;

  var isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  if(isStandalone) return; // Already installed

  var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if(!isMobile) return;

  var isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  var isAndroid = /Android/i.test(navigator.userAgent);

  setTimeout(function(){
    var hint = document.createElement('div');
    hint.id = 'pwaHint';
    hint.style.cssText = 'position:fixed;bottom:calc(76px + env(safe-area-inset-bottom));left:12px;right:12px;background:var(--card);border:1px solid var(--border);border-radius:16px;padding:16px;z-index:9998;box-shadow:0 4px 24px rgba(0,0,0,0.15);font-family:Heebo,sans-serif;animation:slideUp 0.3s ease';

    var title, instructions;
    if(isIOS){
      title = '📱 התקן כאפליקציה ב-iPhone';
      instructions = 'לחץ <b>שתף</b> ↗ ואז <b>הוסף למסך הבית</b>';
    } else {
      title = '📱 התקן כאפליקציה';
      instructions = 'לחץ על <b>תפריט ⋮</b> ואז <b>הוסף למסך הבית</b>';
    }

    hint.innerHTML = '<div style="font-weight:800;font-size:15px;margin-bottom:8px">' + title + '</div><div style="font-size:13px;color:var(--muted);line-height:1.6">' + instructions + '</div><div style="text-align:left;margin-top:10px"><button id="pwaDismiss" style="background:none;border:none;color:var(--blue);font-weight:700;font-size:14px;cursor:pointer;padding:4px 8px">הבנתי, סגור</button></div>';
    document.body.appendChild(hint);

    document.getElementById('pwaDismiss').onclick = function(){
      localStorage.setItem('pwa_hint_dismissed', '1');
      var el = document.getElementById('pwaHint');
      if(el) el.style.display = 'none';
    };
  }, 4000);
})();

// Add slideUp animation
var style = document.createElement('style');
style.textContent = '@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}';
document.head.appendChild(style);

// ═══════════════════════════════════════════════════════════════
// 🆘 טאב חירום — ניהול הוראות ודרכי גישה מאובטחים
// ═══════════════════════════════════════════════════════════════
var EMG_CATEGORIES = [
  {id:'bank', icon:'🏦', label:'חשבונות בנק'},
  {id:'investment', icon:'📈', label:'חשבונות השקעה'},
  {id:'insurance', icon:'🛡️', label:'ביטוחים'},
  {id:'crypto', icon:'₿', label:'קריפטו'},
  {id:'passwords', icon:'🔑', label:'סיסמאות ו-2FA'},
  {id:'documents', icon:'📄', label:'מסמכים'},
  {id:'contacts', icon:'📞', label:'אנשי קשר חירום'},
  {id:'other', icon:'📋', label:'אחר'}
];
var _emgUnlocked = false;
var _emgPassword = '';
var _emgData = null;

// ═══ ✅ v11.2: ליבה משותפת לחירום — דסקטופ ומובייל משתמשים באותה לוגיקה ═══
// m=false → דסקטופ (מזהים ללא סיומת, רינדור ל-tab-emergency) | m=true → מובייל (מזהים עם M, רינדור ל-mobile-detail-body)

function _emgUnlockCore(m){
  var sfx = m ? 'M' : '';
  var pwd = document.getElementById('emgPwd' + sfx).value;
  var msg = document.getElementById('emgMsg' + sfx);
  function say(t, isChecking){
    if(m){ msg.textContent = t; msg.style.color = isChecking ? 'var(--muted)' : 'var(--red)'; }
    else if(isChecking){ msg.textContent = t; msg.className = 'emg-msg'; msg.style.display = 'block'; }
    else emgShowMsg(t, 'error');
  }
  if(!pwd){ say('נא להזין סיסמה'); return; }
  say('בודק...', true);
  google.script.run.withSuccessHandler(function(jsonStr){
    try {
      var res = JSON.parse(jsonStr);
      if(res.needSetup){ if(m) emgShowSetupMobile(); else emgShowSetup(pwd); return; }
      if(res.error){ say(res.error); return; }
      _emgUnlocked = true;
      _emgPassword = pwd;
      _emgData = res;
      if(m) emgRenderMobile(); else emgRender();
    } catch(e){ say('שגיאה: ' + e.message); }
  }).withFailureHandler(function(err){
    say('שגיאת תקשורת: ' + (err.message || err));
  }).getEmergencyData(pwd);
}

function _emgSetupCore(m){
  var sfx = m ? 'M' : '';
  var p1 = document.getElementById('emgNewPwd' + sfx).value;
  var p2 = document.getElementById('emgNewPwd2' + sfx).value;
  var msg = document.getElementById('emgSetupMsg' + sfx);
  function say(t){ if(m){ msg.textContent = t; msg.style.color = 'var(--red)'; } else { msg.textContent = t; msg.className = 'emg-msg error'; } }
  if(p1 !== p2){ say('הסיסמאות אינן תואמות'); return; }
  if(p1.length < 4){ say('הסיסמה חייבת להיות לפחות 4 תווים'); return; }
  google.script.run.withSuccessHandler(function(jsonStr){
    try {
      var res = JSON.parse(jsonStr);
      if(res.error){ say(res.error); return; }
      _emgPassword = p1;
      _emgUnlocked = true;
      if(m) emgLoadMobile(); else emgLoad();
    } catch(e){ say('שגיאה: ' + e.message); }
  }).withFailureHandler(function(err){
    say('שגיאה: ' + (err.message || err));
  }).setupEmergencyPassword(p1);
}

function _emgLoadCore(m){
  google.script.run.withSuccessHandler(function(jsonStr){
    try {
      var res = JSON.parse(jsonStr);
      if(res.error){ if(!m) emgShowMsg(res.error, 'error'); return; }
      _emgData = res;
      if(m) emgRenderMobile(); else emgRender();
    } catch(e){ console.error(e); }
  }).withFailureHandler(function(err){
    console.error(err);
  }).getEmergencyData(_emgPassword);
}

function _emgOpenModalCore(item, m){
  var sfx = m ? 'M' : '';
  var isEdit = !!item;
  var catOptions = EMG_CATEGORIES.map(function(cat){
    var sel = item && item.category === cat.id ? 'selected' : '';
    return '<option value="' + cat.id + '" ' + sel + '>' + cat.icon + ' ' + cat.label + '</option>';
  }).join('');
  var closeFn = m ? 'emgCloseModalMobile()' : 'emgCloseModal()';
  var saveCall = (m ? 'emgSaveMobile(' : 'emgSave(') + (isEdit ? "'" + item.id + "'" : 'null') + ')';
  var overlay = document.createElement('div');
  overlay.className = 'emg-modal-overlay';
  overlay.id = 'emgOverlay' + sfx;
  overlay.innerHTML = '<div class="emg-modal">' +
    '<div class="emg-modal-title">' + (isEdit ? '✏️ עריכת פריט' : '➕ פריט חדש') + '</div>' +
    '<div class="emg-field"><label class="emg-field-label">קטגוריה</label>' +
      '<select class="emg-field-select" id="emgCat' + sfx + '">' + catOptions + '</select></div>' +
    '<div class="emg-field"><label class="emg-field-label">שם פריט</label>' +
      '<input class="emg-field-input" id="emgName' + sfx + '" placeholder="לדוגמה: בנק הפועלים - חשבון ראשי" value="' + escapeAttr(item ? item.name : '') + '"></div>' +
    '<div class="emg-field"><label class="emg-field-label">ערך / הוראות / דרכי גישה</label>' +
      '<textarea class="emg-field-textarea" id="emgVal' + sfx + '" placeholder="מספר חשבון, סיסמה, קוד גישה, הוראות...">' + escapeHtml(item ? item.value : '') + '</textarea></div>' +
    '<div class="emg-field"><label class="emg-field-label">הערות</label>' +
      '<input class="emg-field-input" id="emgNotes' + sfx + '" placeholder="הערות נוספות" value="' + escapeAttr(item ? item.notes : '') + '"></div>' +
    '<div class="emg-modal-actions">' +
      '<button class="emg-cancel-btn" onclick="' + closeFn + '">ביטול</button>' +
      '<button class="emg-save-btn" onclick="' + saveCall + '">שמור</button>' +
    '</div></div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target === overlay){ if(m) emgCloseModalMobile(); else emgCloseModal(); } });
}

function _emgSaveCore(id, m){
  var sfx = m ? 'M' : '';
  var cat = document.getElementById('emgCat' + sfx).value;
  var name = document.getElementById('emgName' + sfx).value.trim();
  var val = document.getElementById('emgVal' + sfx).value;
  var notes = document.getElementById('emgNotes' + sfx).value.trim();
  if(!name){ alert('נא להזין שם פריט'); return; }
  var btn = event ? event.target : null;
  if(btn){ btn.disabled = true; btn.textContent = 'שומר...'; }
  google.script.run.withSuccessHandler(function(jsonStr){
    try {
      var res = JSON.parse(jsonStr);
      if(res.error){ alert(res.error); if(btn){ btn.disabled = false; btn.textContent = 'שמור'; } return; }
      if(m){ emgCloseModalMobile(); emgLoadMobile(); } else { emgCloseModal(); emgLoad(); }
    } catch(e){ alert('שגיאה: ' + e.message); if(btn){ btn.disabled = false; btn.textContent = 'שמור'; } }
  }).withFailureHandler(function(err){
    alert('שגיאה: ' + (err.message || err));
    if(btn){ btn.disabled = false; btn.textContent = 'שמור'; }
  }).saveEmergencyItem(_emgPassword, id || '', cat, name, val, notes);
}

function _emgDeleteCore(id, m){
  if(!confirm('האם למחוק פריט זה?')) return;
  google.script.run.withSuccessHandler(function(jsonStr){
    try { var res = JSON.parse(jsonStr); if(res.error){ alert(res.error); return; } if(m) emgLoadMobile(); else emgLoad(); }
    catch(e){ alert('שגיאה: ' + e.message); }
  }).withFailureHandler(function(err){
    alert('שגיאה: ' + (err.message || err));
  }).deleteEmergencyItem(_emgPassword, id);
}

function emgUnlock(){ _emgUnlockCore(false); }

function emgShowMsg(text, type){
  var msg = document.getElementById('emgMsg');
  msg.textContent = text;
  msg.className = 'emg-msg ' + (type || '');
  msg.style.display = 'block';
}

function emgShowSetup(pwd){
  var tab = document.getElementById('tab-emergency');
  tab.innerHTML = '<div class="emg-setup">' +
    '<div class="emg-gate-icon">🔐</div>' +
    '<h2 class="emg-gate-title">הגדרת סיסמה ראשונית</h2>' +
    '<p class="emg-gate-sub">זו הפעם הראשונה שנכנסים לדף החירום. נא להגדיר סיסמה.</p>' +
    '<div class="emg-setup-warn">⚠️ אין אפשרות שחזור סיסמה! שמור את הסיסמה במקום בטוח. איבוד הסיסמה = איבוד הגישה לנתונים.</div>' +
    '<input type="password" id="emgNewPwd" class="emg-pwd-input" placeholder="סיסמה חדשה (לפחות 4 תווים)" style="border-color:var(--yellow)">' +
    '<input type="password" id="emgNewPwd2" class="emg-pwd-input" placeholder="אימות סיסמה" style="border-color:var(--yellow);margin-top:10px">' +
    '<button class="emg-btn" style="background:linear-gradient(135deg,#F5A623,#FFB84D)" onclick="emgSetup()">הגדר סיסמה</button>' +
    '<div id="emgSetupMsg" class="emg-msg"></div>' +
    '</div>';
}

function emgSetup(){ _emgSetupCore(false); }

function emgLoad(){ _emgLoadCore(false); }

function emgRender(){
  var tab = document.getElementById('tab-emergency');
  var data = _emgData;
  var html = '<div class="emg-header">' +
    '<div class="emg-title">🆘 דף חירום <span style="font-size:0.8rem;color:var(--muted);font-weight:400">' + (data.count || 0) + ' פריטים</span></div>' +
    '<div class="emg-actions">' +
      '<button class="emg-action-btn emg-add-btn" onclick="emgOpenAdd()">➕ הוסף פריט</button>' +
      '<button class="emg-action-btn emg-logout-btn" onclick="emgLock()">🔒 נעילה</button>' +
    '</div></div>';
  
  if(!data.items || data.items.length === 0){
    html += '<div style="text-align:center;padding:3rem;color:var(--muted)">' +
      '<div style="font-size:48px;margin-bottom:1rem">📭</div>' +
      '<p>אין עדיין פריטים בדף החירום</p>' +
      '<p style="font-size:0.9rem;margin-top:0.5rem">לחץ על "הוסף פריט" כדי להתחיל</p></div>';
  } else {
    // Render by category
    EMG_CATEGORIES.forEach(function(cat){
      var items = (data.byCategory || {})[cat.id] || [];
      if(items.length === 0) return;
      html += '<div class="emg-cat-card"><div class="emg-cat-header">' +
        '<span><span class="emg-cat-icon">' + cat.icon + '</span> ' + cat.label + '</span>' +
        '<span class="emg-cat-count">' + items.length + '</span></div>';
      items.forEach(function(it){
        html += '<div class="emg-item">' +
          '<div class="emg-item-name"><span>' + escapeHtml(it.name) + '</span>' +
            '<div class="emg-item-actions">' +
              '<button class="emg-edit" onclick="emgOpenEdit(\'' + it.id + '\')">✏️</button>' +
              '<button class="emg-del" onclick="emgDelete(\'' + it.id + '\')">🗑️</button>' +
            '</div></div>' +
          '<div class="emg-item-value">' + escapeHtml(it.value || '') + '</div>' +
          (it.notes ? '<div class="emg-item-notes">' + escapeHtml(it.notes) + '</div>' : '') +
        '</div>';
      });
      html += '</div>';
    });
    
    // Check for uncategorized items
    var knownCats = EMG_CATEGORIES.map(function(c){ return c.id; });
    var uncategorized = (data.items || []).filter(function(it){ return knownCats.indexOf(it.category) < 0; });
    if(uncategorized.length > 0){
      html += '<div class="emg-cat-card"><div class="emg-cat-header"><span><span class="emg-cat-icon">📋</span> ' + escapeHtml(uncategorized[0].category || 'אחר') + '</span><span class="emg-cat-count">' + uncategorized.length + '</span></div>';
      uncategorized.forEach(function(it){
        html += '<div class="emg-item"><div class="emg-item-name"><span>' + escapeHtml(it.name) + '</span><div class="emg-item-actions"><button class="emg-edit" onclick="emgOpenEdit(\'' + it.id + '\')">✏️</button><button class="emg-del" onclick="emgDelete(\'' + it.id + '\')">🗑️</button></div></div><div class="emg-item-value">' + escapeHtml(it.value || '') + '</div>' + (it.notes ? '<div class="emg-item-notes">' + escapeHtml(it.notes) + '</div>' : '') + '</div>';
      });
      html += '</div>';
    }
  }
  
  tab.innerHTML = html;
}

function emgOpenAdd(){ emgOpenModal(null); }

function emgOpenEdit(id){
  var item = (_emgData.items || []).find(function(it){ return String(it.id) === String(id); });
  if(!item) return;
  emgOpenModal(item);
}

function emgOpenModal(item){ _emgOpenModalCore(item, false); }

function emgCloseModal(){
  var ov = document.getElementById('emgOverlay');
  if(ov) ov.remove();
}

function emgSave(id){ _emgSaveCore(id, false); }

function emgDelete(id){ _emgDeleteCore(id, false); }

function emgLock(){
  _emgUnlocked = false;
  _emgPassword = '';
  _emgData = null;
  var tab = document.getElementById('tab-emergency');
  tab.innerHTML = '<div style="padding:2rem;text-align:center">' +
    '<div style="font-size:64px;margin-bottom:1rem">🆘</div>' +
    '<h2 style="font-size:1.5rem;margin-bottom:0.5rem">דף חירום</h2>' +
    '<p style="color:var(--muted);margin-bottom:2rem">הוראות ודרכי גישה לכל חשבון</p>' +
    '<div style="max-width:400px;margin:0 auto">' +
    '<input type="password" id="emgPwd" class="emg-pwd-input" placeholder="סיסמה">' +
    '<button class="emg-btn" style="margin-top:12px" onclick="emgUnlock()">פתח</button>' +
    '<div id="emgMsg" class="emg-msg"></div></div></div>';
}

function escapeHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function escapeAttr(s){ return String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }


function emgUnlockMobile(){ _emgUnlockCore(true); }

function emgShowSetupMobile(){
  var body = document.getElementById('mobile-detail-body');
  body.innerHTML = '<div style="padding:2rem;text-align:center;max-width:420px;margin:0 auto">' +
    '<div style="font-size:72px;margin-bottom:1rem">🔐</div>' +
    '<h2 style="font-size:1.6rem;font-weight:800;margin-bottom:0.5rem">הגדרת סיסמה ראשונית</h2>' +
    '<p style="color:var(--muted);margin-bottom:1rem">זו הפעם הראשונה. נא להגדיר סיסמה.</p>' +
    '<div style="background:var(--yellow-light,rgba(245,166,35,0.1));border:1px solid #F5A623;border-radius:12px;padding:16px;margin:1rem 0;font-size:0.9rem;color:#B8860B;text-align:right">⚠️ אין אפשרות שחזור סיסמה! שמור את הסיסמה במקום בטוח.</div>' +
    '<input type="password" id="emgNewPwdM" placeholder="סיסמה חדשה (לפחות 4 תווים)" style="width:100%;padding:14px;border:2px solid #F5A623;border-radius:12px;font-size:18px;text-align:center;font-family:Heebo,sans-serif;outline:none;background:var(--bg2);color:var(--text);margin-bottom:10px">' +
    '<input type="password" id="emgNewPwd2M" placeholder="אימות סיסמה" style="width:100%;padding:14px;border:2px solid #F5A623;border-radius:12px;font-size:18px;text-align:center;font-family:Heebo,sans-serif;outline:none;background:var(--bg2);color:var(--text)">' +
    '<button onclick="emgSetupMobile()" style="width:100%;margin-top:12px;padding:14px;background:linear-gradient(135deg,#F5A623,#FFB84D);color:#fff;border:none;border-radius:12px;font-size:18px;font-weight:700;cursor:pointer;font-family:Heebo,sans-serif">הגדר סיסמה</button>' +
    '<div id="emgSetupMsgM" style="margin-top:12px;font-size:14px;min-height:20px"></div>' +
    '</div>';
}

function emgSetupMobile(){ _emgSetupCore(true); }

function emgLoadMobile(){ _emgLoadCore(true); }

function emgRenderMobile(){
  var body = document.getElementById('mobile-detail-body');
  var data = _emgData;
  var html = '<div style="padding:1rem">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;gap:0.5rem;flex-wrap:wrap">' +
      '<div style="font-size:1.4rem;font-weight:800">🆘 דף חירום <span style="font-size:0.8rem;color:var(--muted);font-weight:400">(' + (data.count||0) + ' פריטים)</span></div>' +
      '<div style="display:flex;gap:8px">' +
        '<button onclick="emgOpenAddMobile()" style="padding:10px 14px;border-radius:10px;border:none;font-weight:700;cursor:pointer;font-size:14px;background:var(--blue);color:#fff;font-family:Heebo,sans-serif">➕ הוסף</button>' +
        '<button onclick="emgLockMobile()" style="padding:10px 14px;border-radius:10px;border:none;font-weight:700;cursor:pointer;font-size:14px;background:var(--red);color:#fff;font-family:Heebo,sans-serif">🔒 נעילה</button>' +
      '</div></div>';
  
  if(!data.items || data.items.length === 0){
    html += '<div style="text-align:center;padding:3rem;color:var(--muted)"><div style="font-size:48px;margin-bottom:1rem">📭</div><p>אין עדיין פריטים</p><p style="font-size:0.9rem;margin-top:0.5rem">לחץ על "הוסף" כדי להתחיל</p></div>';
  } else {
    EMG_CATEGORIES.forEach(function(cat){
      var items = (data.byCategory||{})[cat.id] || [];
      if(items.length === 0) return;
      html += '<div style="background:var(--card);border:1px solid var(--border);border-radius:16px;overflow:hidden;margin-bottom:16px;box-shadow:var(--shadow-sm)">' +
        '<div style="padding:14px 18px;background:var(--bg3);font-weight:700;font-size:1.05rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border)">' +
          '<span><span style="font-size:24px">' + cat.icon + '</span> ' + cat.label + '</span>' +
          '<span style="background:var(--blue-light,rgba(45,91,255,0.1));color:var(--blue);font-size:12px;font-weight:700;padding:4px 10px;border-radius:20px">' + items.length + '</span></div>';
      items.forEach(function(it){
        html += '<div style="padding:14px 18px;border-bottom:1px solid var(--border)">' +
          '<div style="font-weight:700;font-size:0.95rem;margin-bottom:4px;display:flex;justify-content:space-between;align-items:center">' +
            '<span>' + escapeHtml(it.name) + '</span>' +
            '<div style="display:flex;gap:6px">' +
              '<button onclick="emgOpenEditMobile(\'' + it.id + '\')" style="font-size:13px;padding:4px 10px;border-radius:8px;border:none;cursor:pointer;font-weight:600;background:var(--blue-light,rgba(45,91,255,0.1));color:var(--blue)">✏️</button>' +
              '<button onclick="emgDeleteMobile(\'' + it.id + '\')" style="font-size:13px;padding:4px 10px;border-radius:8px;border:none;cursor:pointer;font-weight:600;background:var(--red-light,rgba(232,57,74,0.1));color:var(--red)">🗑️</button>' +
            '</div></div>' +
          '<div style="color:var(--muted);font-size:0.9rem;font-family:JetBrains Mono,monospace;margin-bottom:4px;word-break:break-all">' + escapeHtml(it.value||'') + '</div>' +
          (it.notes ? '<div style="color:var(--muted2);font-size:0.82rem">' + escapeHtml(it.notes) + '</div>' : '') +
        '</div>';
      });
      html += '</div>';
    });
  }
  
  html += '</div>';
  body.innerHTML = html;
}

function emgOpenAddMobile(){ emgOpenModalMobile(null); }
function emgOpenEditMobile(id){
  var item = (_emgData.items||[]).find(function(it){ return String(it.id)===String(id); });
  if(!item) return;
  emgOpenModalMobile(item);
}

function emgOpenModalMobile(item){ _emgOpenModalCore(item, true); }

function emgCloseModalMobile(){
  var ov = document.getElementById('emgOverlayM');
  if(ov) ov.remove();
}

function emgSaveMobile(id){ _emgSaveCore(id, true); }

function emgDeleteMobile(id){ _emgDeleteCore(id, true); }

function emgLockMobile(){
  _emgUnlocked = false;
  _emgPassword = '';
  _emgData = null;
  var body = document.getElementById('mobile-detail-body');
  body.innerHTML = '<div style="padding:2rem;text-align:center">' +
    '<div style="font-size:64px;margin-bottom:1rem">🆘</div>' +
    '<h2 style="font-size:1.5rem;margin-bottom:0.5rem">דף חירום</h2>' +
    '<p style="color:var(--muted);margin-bottom:2rem">הוראות ודרכי גישה לכל חשבון</p>' +
    '<div style="max-width:400px;margin:0 auto">' +
    '<input type="password" id="emgPwdM" placeholder="סיסמה" style="width:100%;padding:14px;border:2px solid var(--border);border-radius:12px;font-size:18px;text-align:center;font-family:Heebo,sans-serif;outline:none;background:var(--bg2);color:var(--text)">' +
    '<button onclick="emgUnlockMobile()" style="width:100%;margin-top:12px;padding:14px;background:linear-gradient(135deg,#E8394A,#FF6B6B);color:#fff;border:none;border-radius:12px;font-size:18px;font-weight:700;cursor:pointer;font-family:Heebo,sans-serif">פתח</button>' +
    '<div id="emgMsgM" style="margin-top:12px;font-size:14px;min-height:20px"></div>' +
    '</div></div>';
}


function goHome(){
  if(_emgUnlocked){ if(typeof emgLockMobile==='function') emgLockMobile(); if(typeof emgLock==='function') emgLock(); if(_emgTimer){clearTimeout(_emgTimer);_emgTimer=null;} }
  if(isMobileDevice()){
    var mh = document.getElementById('mobile-home');
    var md = document.getElementById('mobile-detail');
    if(mh){ mh.style.display='block'; }
    if(md){ md.style.display='none'; }
  } else {
    go('overview');
  }
  window.scrollTo({top:0, behavior:'smooth'});
}


// ═══════════════════════════════════════════════════════════════
// 🆘 אבטחת חירום — נעילה אוטומטית
// ═══════════════════════════════════════════════════════════════
var _emgTimer = null;
var EMG_TIMEOUT = 180000; // 3 דקות

function _emgResetTimer(){
  if(_emgTimer) clearTimeout(_emgTimer);
  if(_emgUnlocked){
    _emgTimer = setTimeout(function(){
      _emgAutoLock();
    }, EMG_TIMEOUT);
  }
}

function _emgAutoLock(){
  if(!_emgUnlocked) return;
  // Desktop: lock the tab content
  if(typeof emgLock === 'function') emgLock();
  // Mobile: lock mobile view if active
  var body = document.getElementById('mobile-detail-body');
  if(body && body.innerHTML.indexOf('emgPwdM') >= 0){
    // Already locked or showing gate
  } else if(body && _emgUnlocked === false){
    // Already locked
  } else if(typeof emgLockMobile === 'function'){
    emgLockMobile();
  }
  // Show a brief notification
  var msg = document.createElement('div');
  msg.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#E8394A;color:#fff;padding:12px 24px;border-radius:12px;font-family:Heebo,sans-serif;font-size:14px;font-weight:700;z-index:9999;box-shadow:0 4px 20px rgba(232,57,74,0.4);animation:emgToast 3s forwards';
  msg.textContent = '🔒 דף חירום ננעל אוטומטית (חוסר פעילות)';
  document.body.appendChild(msg);
  setTimeout(function(){ if(msg.parentNode) msg.remove(); }, 3000);
}

// Wrap emgUnlock to start timer on unlock
(function(){
  var origUnlock = window.emgUnlock;
  if(origUnlock) window.emgUnlock = function(){
    var result = origUnlock.apply(this, arguments);
    // Timer starts on successful unlock (checked in emgLoad callback)
    return result;
  };
})();

// Wrap emgRender to start timer after successful render
(function(){
  var origRender = window.emgRender;
  if(origRender) window.emgRender = function(){
    var result = origRender.apply(this, arguments);
    _emgResetTimer();
    return result;
  };
})();

// Same for mobile
(function(){
  var origRenderM = window.emgRenderMobile;
  if(origRenderM) window.emgRenderMobile = function(){
    var result = origRenderM.apply(this, arguments);
    _emgResetTimer();
    return result;
  };
})();

// Reset timer on any interaction within emergency tab
document.addEventListener('click', function(e){
  if(!_emgUnlocked) return;
  var emgTab = document.getElementById('tab-emergency');
  var mobileBody = document.getElementById('mobile-detail-body');
  if((emgTab && emgTab.contains(e.target)) || (mobileBody && mobileBody.innerHTML.indexOf('emgPwdM') < 0 && mobileBody.innerHTML.indexOf('חירום') >= 0)){
    _emgResetTimer();
  }
}, true);

document.addEventListener('keydown', function(e){
  if(!_emgUnlocked) return;
  _emgResetTimer();
});


// ═══════════════════════════════════════════════════════════════
// 🔔 מודל התראות מחיר מאוחד — עובד בדסקטופ ובמובייל
// ═══════════════════════════════════════════════════════════════
function openAlertsModal(){
  var d = window._lastData || window._portfolioData;
  if(!d){ alert('הנתונים עדיין נטענים, נסה שוב בעוד רגע'); return; }

  // Collect all symbols from IBKR and FAIR
  var symbols = [];
  if(d.ibkr && d.ibkr.positions){
    d.ibkr.positions.forEach(function(p){
      if(p.sym && p.sym !== 'CASH-USD'){
        symbols.push({ sym: p.sym, name: p.sym, price: p.price, currency: '$', source: 'IBKR', valILS: p.valILS || (p.price * p.qty * (d.meta.usdIls||3.7)), qty: p.qty || 0 });
      }
    });
  }
  if(d.fair && d.fair.positions){
    d.fair.positions.forEach(function(p){
      symbols.push({ sym: p.name, name: p.name, price: p.valILS || 0, currency: '₪', source: 'FAIR', valILS: p.valILS || 0, qty: p.qty || 0 });
    });
  }

  var alerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');

  var html = '<div class="emg-modal-title">🔔 הגדרת התראת מחיר</div>';

  if(alerts.length > 0){
    html += '<div style="margin-bottom:1.25rem">';
    html += '<div style="font-size:0.95rem;font-weight:700;margin-bottom:0.5rem;display:flex;align-items:center;gap:6px">📋 התראות פעילות <span style="background:var(--blue-light,rgba(45,91,255,0.1));color:var(--blue);font-size:11px;padding:2px 8px;border-radius:20px">' + alerts.length + '</span></div>';
    alerts.forEach(function(a, i){
      var typeText = a.type === 'above' ? 'מעל $' + (a.price||'') : a.type === 'below' ? 'מתחת $' + (a.price||'') : a.type === 'change5' ? 'שינוי 5% ביום' : 'שינוי 10% ביום';
      html += '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:10px 14px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center">';
      html += '<div><div style="font-weight:700;font-size:0.9rem">' + escapeHtml(a.sym) + '</div><div style="color:var(--muted);font-size:0.8rem">' + typeText + '</div></div>';
      html += '<button onclick="deleteAlertModal(' + i + ')" style="background:var(--red-light,rgba(232,57,74,0.1));color:var(--red);border:none;border-radius:8px;padding:5px 10px;cursor:pointer;font-size:12px;font-weight:600">🗑️</button>';
      html += '</div>';
    });
    html += '</div>';
  }

  html += '<div style="font-size:0.95rem;font-weight:700;margin-bottom:0.5rem;display:flex;align-items:center;gap:6px">📊 בחר נייר <span style="background:var(--blue-light,rgba(45,91,255,0.1));color:var(--blue);font-size:11px;padding:2px 8px;border-radius:20px">' + symbols.length + '</span></div>';
  html += '<div style="max-height:min(50vh,400px);overflow-y:auto;margin-bottom:0.5rem">';

  if(symbols.length === 0){
    html += '<div style="text-align:center;padding:2rem;color:var(--muted)">אין ניירות בתיק</div>';
  }

  symbols.forEach(function(s){
    var sourceColor = s.source === 'IBKR' ? 'var(--blue)' : 'var(--green)';
    var sourceBg = s.source === 'IBKR' ? 'rgba(45,91,255,0.1)' : 'rgba(12,175,96,0.1)';
    var priceStr = s.currency + (s.price ? (s.price > 100 ? s.price.toFixed(0) : s.price.toFixed(2)) : '—');
    var valStr = s.valILS ? '₪' + (s.valILS > 1000 ? Math.round(s.valILS).toLocaleString() : s.valILS.toFixed(0)) : '';
    var safeSym = s.sym.replace(/'/g, "\\'");
    html += '<div onclick="openAlertModalFor(\'' + safeSym + '\',\'' + s.source + '\')" style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:12px 14px;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;cursor:pointer">';
    html += '<div style="display:flex;align-items:center;gap:10px">';
    html += '<div style="width:40px;height:40px;border-radius:10px;background:' + sourceBg + ';display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:' + sourceColor + ';flex-shrink:0">' + s.sym.substring(0,2).toUpperCase() + '</div>';
    html += '<div><div style="font-weight:700;font-size:0.9rem">' + escapeHtml(s.name) + '</div>';
    html += '<div style="display:flex;align-items:center;gap:6px"><span style="font-size:0.8rem;color:var(--muted);font-family:JetBrains Mono,monospace">' + priceStr + '</span>';
    if(valStr) html += '<span style="font-size:0.8rem;color:var(--text);font-weight:700;font-family:JetBrains Mono,monospace">' + valStr + '</span>';
    html += '<span style="font-size:10px;font-weight:700;padding:1px 7px;border-radius:10px;background:' + sourceBg + ';color:' + sourceColor + '">' + s.source + '</span></div></div>';
    html += '</div><div style="font-size:22px;color:var(--muted2)">›</div></div>';
  });

  html += '</div>';

  var overlay = document.getElementById('alertsListOverlay');
  if(overlay) overlay.remove();
  overlay = document.createElement('div');
  overlay.className = 'emg-modal-overlay';
  overlay.id = 'alertsListOverlay';
  overlay.innerHTML = '<div class="emg-modal">' + html + '<div class="emg-modal-actions"><button class="emg-cancel-btn" style="flex:1" onclick="document.getElementById(\'alertsListOverlay\').remove()">סגור</button></div></div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if(e.target === overlay) overlay.remove(); });
  if(typeof haptic === 'function') haptic(20);
}

function deleteAlertModal(idx){
  var alerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
  alerts.splice(idx, 1);
  localStorage.setItem('priceAlerts', JSON.stringify(alerts));
  openAlertsModal(); // refresh (re-creates overlay)
}



// ═══════════════════════════════════════════════════════════════
// 🔔 Toast — הודעה צפה בתחתית המסך
// ═══════════════════════════════════════════════════════════════
function showToast(msg, duration) {
  duration = duration || 4000;
  var t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:calc(80px + env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);background:var(--card);border:1px solid var(--border);border-radius:14px;padding:14px 24px;font-size:15px;font-weight:600;z-index:10001;box-shadow:var(--shadow-lg);max-width:90vw;text-align:center';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(function(){ t.style.opacity='0'; t.style.transition='opacity 0.3s'; setTimeout(function(){ t.remove(); }, 300); }, duration);
  if(typeof haptic === 'function') haptic(20);
}

// ═══════════════════════════════════════════════════════════════
// 🔔 מערכת התראות דחיפה — Notification API + Telegram backend
// ═══════════════════════════════════════════════════════════════
function showPushNotification(title, body){
  if(!('Notification' in window)) return;
  if(Notification.permission === 'granted'){
    var n = new Notification(title, {
      body: body,
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><text y="52" font-size="52">🔔</text></svg>',
      badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><text y="52" font-size="52">🔔</text></svg>',
      tag: 'price-alert',
      requireInteraction: false
    });
    setTimeout(function(){ n.close(); }, 10000);
  }
}

function requestNotificationPermission(){
  if(!('Notification' in window)) return false;
  if(Notification.permission === 'granted') return true;
  if(Notification.permission !== 'denied'){
    Notification.requestPermission(function(p){
      if(p === 'granted') showPushNotification('🔔 התראות הופעלו', 'תקבל התראות מחיר בדחיפה לטלפון');
    });
  }
  return Notification.permission === 'granted';
}

// Check alerts periodically when app is open
function checkLocalAlerts(){
  var d = window._lastData;
  if(!d) return;
  var alerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
  if(alerts.length === 0) return;

  // Track which alerts fired so we don't spam
  var firedKeys = JSON.parse(localStorage.getItem('firedAlertKeys') || '[]');
  var now = Date.now();
  // Clean old fired keys (older than 1 hour)
  firedKeys = firedKeys.filter(function(f){ return now - f.time < 3600000; });

  var newFired = [];
  alerts.forEach(function(a, idx){
    var sym = a.sym;
    var pos = null;
    var source = 'IBKR';
    var currentPrice = 0;
    var currency = '$';

    if(d.ibkr && d.ibkr.positions){
      pos = d.ibkr.positions.find(function(p){ return p.sym === sym; });
    }
    if(pos) {
      source = 'IBKR';
      currentPrice = pos.price || 0;
      currency = '$';
    }
    if(!pos && d.fair && d.fair.positions){
      pos = d.fair.positions.find(function(p){ return p.name === sym; });
      if(pos) {
        source = 'FAIR';
        currentPrice = pos.valILS || 0;
        currency = '₪';
      }
    }
    if(!pos) return;

    var fired = false;
    var fireKey = sym + '_' + a.type + '_' + a.price;
    var alreadyFired = firedKeys.some(function(f){ return f.key === fireKey; });

    if(alreadyFired) return;

    if(a.type === 'above' && currentPrice >= parseFloat(a.price)){
      fired = true;
    } else if(a.type === 'below' && currentPrice <= parseFloat(a.price)){
      fired = true;
    }

    if(fired){
      newFired.push({ key: fireKey, time: now });
      var title = '🔔 ' + sym + ' — ' + (a.type === 'above' ? 'עבר את היעד' : 'ירד מתחת ליעד');
      var body = 'מחיר נוכחי: ' + currency + (currentPrice > 100 ? currentPrice.toFixed(0) : currentPrice.toFixed(2)) + ' | יעד: ' + currency + a.price;
      showPushNotification(title, body);
      // Also show in-app toast
      if(typeof showToast === 'function') showToast(title + ' — ' + body);
    }
  });

  if(newFired.length > 0){
    firedKeys = firedKeys.concat(newFired);
    localStorage.setItem('firedAlertKeys', JSON.stringify(firedKeys));
  }
}

// Run alert check every 3 minutes when app is open
setInterval(function(){ checkLocalAlerts(); }, 180000);

</script>

</body>
</html>
