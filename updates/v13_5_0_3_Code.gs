// ── // תיק השקעות | Ofir — Apps Script v11
// שינויי v11:
// - 🔐 Gate אבטחה בצד השרת: כל פונקציה שמחזירה נתונים ללקוח דורשת טוקן סשן תקף (אם מוגדר PIN)
// - סשנים מרובים: כניסה מהטלפון לא מנתקת את המחשב (סשן לכל מכשיר, 7 ימים)
// - נעילת PIN אחרי 5 ניסיונות כושלים (5 דקות)
// - סיסמת חירום: גיבוב עם מלח + איטרציות (שדרוג אוטומטי מהפורמט הישן)
// - Yahoo Finance: User-Agent + גיבוי query2 (מונע חסימות 429)
// - FAIR: קריאה עמידה — לא תלויה בשורה 7, fallback שווי = כמות×מחיר
// - getFairCommissionsData ב-batch read (מהירות), הוסרה הכפילות מ-import_commissions.gs
// - הוסרה כפילות setupAllTriggers (דריסה שקטה בין קבצים)
// - חדש: getIntegrityData, getSparklineData, getDividendCalendar (הלקוח קרא להן והן לא היו קיימות!)
// - חדש: FAIR_diagnose() — אבחון פערי שווי FAIR מול הגיליון
// - doGet: מוצא את קובץ ה-HTML לפי שם באופן עמיד (INDEX_V10 / INDEX_V2 / INDEX)
// גרסה משופרת עם:
// - תיקון getPurchaseCosts (קורא מהגיליון המעודכן)
// - כתיבה בbatch בwriteIBKRFromAPI
// - טוקן טלגרם בScript Properties
// - retry לYahoo Finance
// - getDividendData לדף הדיבידנדים החדש
// - cache לsettings
// ✅ v11.4: מספר הגרסה המוצג בפינת האתר — עדכן כאן בכל העלאה לייצור
var APP_VERSION = '13.5.0.3';
// ✅ v11.5.0.2: כתובת הפריסה הפעילה (מהדגם שלך) — עדכן כאן רק אם תיצור פריסה חדשה
var WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbz9rChZIM95O2FTNdw0W9P2Iir5wRYggO4nf5Jk2dH2wiNz_Iun18X2jeFZ7KQq2YqdRA/exec';
const SS = SpreadsheetApp.getActiveSpreadsheet();
let _settingsCache = null;
// ── doGet — דף האינטרנט ──
function doGet(e) {
  // ✅ v12.2.1.0: קריאת API חיצונית לתמצית תיק (עבור חבצלת בוואטסאפ) — token נעול ב-Script Properties
  // ✅ v13.4.5.2: קליטת מכירה מרחוק — ?sale=UPDATE_TOKEN&sym=..&qty=..&date=YYYY-MM-DD&price=..&fee=..&rate=..
  if (e && e.parameter && e.parameter.sale) {
    try {
      var _uTok = PropertiesService.getScriptProperties().getProperty('UPDATE_REMOTE_TOKEN') || '';
      if (!_uTok || e.parameter.sale !== _uTok) {
        return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' })).setMimeType(ContentService.MimeType.JSON);
      }
      var _sp = e.parameter;
      var _sym = String(_sp.sym || '').trim().toUpperCase();
      var _qty = parseFloat(_sp.qty), _price = parseFloat(_sp.price);
      var _fee = parseFloat(_sp.fee || '0') || 0;
      if (!_sym || !_qty || !_price) {
        return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'missing sym/qty/price' })).setMimeType(ContentService.MimeType.JSON);
      }
      var _rate = parseFloat(_sp.rate || '0');
      if (!_rate) _rate = getCurrentUSDILS();
      var _saleDate = _sp.date ? new Date(_sp.date + 'T12:00:00') : new Date();
      if (isNaN(_saleDate.getTime())) _saleDate = new Date();
      var _saleSheet = SS.getSheetByName('מכירות');
      if (!_saleSheet) {
        return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'sales sheet not found' })).setMimeType(ContentService.MimeType.JSON);
      }
      // מיפוי עמודות לפי כותרות אמיתיות
      var _sLast2 = _saleSheet.getLastRow();
      var _cols = {}, _hdrRow = 3;
      for (var _r2 = 1; _r2 <= Math.min(_sLast2, 5); _r2++) {
        var _hv = _saleSheet.getRange(_r2, 1, 1, 12).getValues()[0];
        var _found = false;
        for (var _c2 = 0; _c2 < _hv.length; _c2++) {
          var _t = String(_hv[_c2]).replace(/[\u200B-\u200F\uFEFF]/g, '').trim();
          if (_t === 'סימבול') { _cols.sym = _c2 + 1; _hdrRow = _r2; _found = true; }
          if (_t === 'כמות נמכרה' || _t === 'כמות מכירה') { _cols.qty = _c2 + 1; }
          if (_t.indexOf('מחיר') >= 0) { _cols.price = _c2 + 1; }
          if (_t.indexOf('תאריך') >= 0) { _cols.date = _c2 + 1; }
          if (_t.indexOf('שער') >= 0 || _t.indexOf('USD/ILS') >= 0) { _cols.rate = _c2 + 1; }
          if (_t.indexOf('עמלה') >= 0) { _cols.fee = _c2 + 1; }
          if (_t.indexOf('סכום') >= 0 && _t.indexOf('₪') >= 0) { _cols.sum = _c2 + 1; }
          if (_t === 'שם' || _t.indexOf('שם הנייר') >= 0) { _cols.name = _c2 + 1; }
        }
        if (_found) break;
      }
      if (!_cols.sym || !_cols.qty) {
        return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'headers not found', cols: _cols })).setMimeType(ContentService.MimeType.JSON);
      }
      var _wRow = _sLast2 + 1;
      var _sumILS = (_qty * _price - _fee) * _rate;
      if (_cols.date) _saleSheet.getRange(_wRow, _cols.date).setValue(_saleDate);
      _saleSheet.getRange(_wRow, _cols.sym).setValue(_sym);
      if (_cols.name) _saleSheet.getRange(_wRow, _cols.name).setValue(String(_sp.name || _sym));
      _saleSheet.getRange(_wRow, _cols.qty).setValue(_qty);
      if (_cols.price) _saleSheet.getRange(_wRow, _cols.price).setValue(_price);
      if (_cols.rate) _saleSheet.getRange(_wRow, _cols.rate).setValue(_rate);
      if (_cols.fee) _saleSheet.getRange(_wRow, _cols.fee).setValue(_fee);
      if (_cols.sum) _saleSheet.getRange(_wRow, _cols.sum).setValue(_sumILS);
      _bustAnalystCtx();
      return ContentService.createTextOutput(JSON.stringify({ ok: true, recorded: { sym: _sym, qty: _qty, price: _price, fee: _fee, rate: _rate, sumILS: Math.round(_sumILS), row: _wRow } })).setMimeType(ContentService.MimeType.JSON);
    } catch (_saleErr) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'sale err: ' + _saleErr })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  // ✅ v13.5.0.0: בדיקת מנוע הסיכון מרחוק — ?risk=READ_TOKEN
  if (e && e.parameter && e.parameter.risk) {
    try {
      var _rTok = PropertiesService.getScriptProperties().getProperty('AGENT_READ_TOKEN') || '';
      if (!_rTok || e.parameter.risk !== _rTok) {
        return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' })).setMimeType(ContentService.MimeType.JSON);
      }
      // נתיב קריאה מרחוק — לא דרך _gate (שם נדרש טוקן סשן של הדפדפן)
      return ContentService.createTextOutput(JSON.stringify(_riskBuild())).setMimeType(ContentService.MimeType.JSON);
    } catch (_rErr) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(_rErr) })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // ✅ v13.4.7.5: יצירת טריגר יומי לסנכרון הפעילות — ?settriggers=UPDATE_TOKEN
  if (e && e.parameter && e.parameter.settriggers) {
    try {
      var _stTok = PropertiesService.getScriptProperties().getProperty('UPDATE_REMOTE_TOKEN') || '';
      if (!_stTok || e.parameter.settriggers !== _stTok) {
        return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' })).setMimeType(ContentService.MimeType.JSON);
      }
      var _existing = ScriptApp.getProjectTriggers().filter(function (t) {
        return t.getHandlerFunction() === 'IBKR_syncActivity';
      });
      var _created = false;
      if (!_existing.length) {
        ScriptApp.newTrigger('IBKR_syncActivity')
          .timeBased()
          .atHour(23).nearMinute(30)
          .everyDays(1)
          .inTimezone('Asia/Jerusalem')
          .create();
        _created = true;
      }
      var _all = ScriptApp.getProjectTriggers().map(function (t) {
        return { fn: t.getHandlerFunction(), event: String(t.getEventType()) };
      });
      return ContentService.createTextOutput(JSON.stringify({ ok: true, version: APP_VERSION, created: _created, activityTriggers: _existing.length + (_created ? 1 : 0), allTriggers: _all })).setMimeType(ContentService.MimeType.JSON);
    } catch (_stE) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'settriggers: ' + _stE })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // ✅ v13.4.7.4: אבחון טריגרים — ?triggers=UPDATE_TOKEN
  if (e && e.parameter && e.parameter.triggers) {
    try {
      var _trTok = PropertiesService.getScriptProperties().getProperty('UPDATE_REMOTE_TOKEN') || '';
      if (!_trTok || e.parameter.triggers !== _trTok) {
        return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' })).setMimeType(ContentService.MimeType.JSON);
      }
      var _tr = ScriptApp.getProjectTriggers().map(function (t) {
        return { fn: t.getHandlerFunction(), event: String(t.getEventType()), id: t.getUniqueId() };
      });
      return ContentService.createTextOutput(JSON.stringify({ ok: true, version: APP_VERSION, count: _tr.length, triggers: _tr })).setMimeType(ContentService.MimeType.JSON);
    } catch (_trE) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'triggers: ' + _trE })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // ✅ v13.4.7.4: הרצת סנכרון הפעילות (קניות+מכירות+דיבידנדים) — ?actsync=UPDATE_TOKEN
  if (e && e.parameter && e.parameter.actsync) {
    try {
      var _asTok = PropertiesService.getScriptProperties().getProperty('UPDATE_REMOTE_TOKEN') || '';
      if (!_asTok || e.parameter.actsync !== _asTok) {
        return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' })).setMimeType(ContentService.MimeType.JSON);
      }
      var _has = (typeof IBKR_syncActivity === 'function');
      var _res = null;
      if (_has) { _res = IBKR_syncActivity(); }
      Utilities.sleep(1500);
      var _d = runIntegrityCheck();
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, version: APP_VERSION, syncAvailable: _has, syncResult: _res || 'ran',
        integrityAfter: _d.length, issues: _d
      })).setMimeType(ContentService.MimeType.JSON);
    } catch (_asE) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'actsync: ' + _asE })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // ✅ v13.4.7.3: מחיקת שורת מכירה שהוזנה בטעות — ?delrow=UPDATE_TOKEN&sym=X&date=YYYY-MM-DD&qty=N
  if (e && e.parameter && e.parameter.delrow) {
    try {
      var _dTok3 = PropertiesService.getScriptProperties().getProperty('UPDATE_REMOTE_TOKEN') || '';
      if (!_dTok3 || e.parameter.delrow !== _dTok3) {
        return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' })).setMimeType(ContentService.MimeType.JSON);
      }
      var _dSym = String(e.parameter.sym || '').trim().toUpperCase();
      var _dQty = parseFloat(e.parameter.qty);
      var _dDate = String(e.parameter.date || '').trim();
      if (!_dSym || !_dQty) return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'missing sym/qty' })).setMimeType(ContentService.MimeType.JSON);
      var _dSheet = SS.getSheetByName('מכירות');
      var _dCols = _salesSheetCols(_dSheet);
      var _dLast = _dSheet.getLastRow();
      var _deleted = [];
      for (var _dr = _dLast; _dr >= 4; _dr--) {
        var _dv = _dSheet.getRange(_dr, 1, 1, 12).getValues()[0];
        var _s = String(_dv[_dCols.sym - 1] || '').trim().toUpperCase();
        var _q = parseFloat(_dv[_dCols.qty - 1]) || 0;
        if (_s !== _dSym || Math.abs(_q - _dQty) > 0.01) continue;
        if (_dDate) {
          var _dObj = _dCols.date ? _safeSheetDateObj(_dv[_dCols.date - 1]) : null;
          var _dIso = _dObj ? new Date(_dObj).toISOString().slice(0, 10) : '';
          if (_dIso !== _dDate) continue;
        }
        if (_s === _dSym && Math.abs(_q - _dQty) <= 0.01) {
          _dSheet.deleteRow(_dr);
          _deleted.push({ row: _dr, sym: _s, qty: _q, date: _dDate || '' });
        }
      }
      _bustAnalystCtx();
      return ContentService.createTextOutput(JSON.stringify({ ok: true, version: APP_VERSION, deleted: _deleted })).setMimeType(ContentService.MimeType.JSON);
    } catch (_delErr) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'delrow: ' + _delErr })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // ✅ v13.4.7.1: אבחון שאילתות Flex — ?flexdiag=UPDATE_TOKEN&q=<QUERY_ID>
  if (e && e.parameter && e.parameter.flexdiag) {
    try {
      var _fTok = PropertiesService.getScriptProperties().getProperty('UPDATE_REMOTE_TOKEN') || '';
      if (!_fTok || e.parameter.flexdiag !== _fTok) {
        return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' })).setMimeType(ContentService.MimeType.JSON);
      }
      var _q = String(e.parameter.q || '').trim();
      if (!_q) return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'missing q' })).setMimeType(ContentService.MimeType.JSON);
      var _xml = _flexFetchStatement(_q);
      var _trades = (_xml.match(/<Trade\s/g) || []).length;
      var _pos = (_xml.match(/<OpenPosition\s/g) || []).length;
      var _cash = (_xml.match(/<CashReportCurrency\s/g) || []).length;
      var _syms = [];
      (_xml.match(/<Trade\s[^>]*symbol="([^"]+)"/g) || []).slice(0, 8).forEach(function (t) {
        var m = t.match(/symbol="([^"]+)"/); if (m) _syms.push(m[1]);
      });
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, version: APP_VERSION, queryId: _q, bytes: _xml.length,
        trades: _trades, openPositions: _pos, cashRows: _cash, tradeSymbols: _syms,
        verdict: _trades > 0 ? 'has Trades ✅' : 'NO Trades ❌'
      })).setMimeType(ContentService.MimeType.JSON);
    } catch (_fdErr) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'flexdiag: ' + _fdErr })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // ✅ v13.4.7.1: הגדרת שאילתת מכירות נפרדת — ?setflex=UPDATE_TOKEN&q=<QUERY_ID> (ריק = חזרה ל-FLEX_QUERY_ID)
  if (e && e.parameter && e.parameter.setflex) {
    try {
      var _sfTok = PropertiesService.getScriptProperties().getProperty('UPDATE_REMOTE_TOKEN') || '';
      if (!_sfTok || e.parameter.setflex !== _sfTok) {
        return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' })).setMimeType(ContentService.MimeType.JSON);
      }
      var _sfQ = String(e.parameter.q || '').trim();
      var _props = PropertiesService.getScriptProperties();
      if (_sfQ) { _props.setProperty('FLEX_TRADES_QUERY_ID', _sfQ); }
      else { _props.deleteProperty('FLEX_TRADES_QUERY_ID'); }
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, version: APP_VERSION,
        FLEX_QUERY_ID: _props.getProperty('FLEX_QUERY_ID') || null,
        FLEX_TRADES_QUERY_ID: _props.getProperty('FLEX_TRADES_QUERY_ID') || null
      })).setMimeType(ContentService.MimeType.JSON);
    } catch (_sfErr) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'setflex: ' + _sfErr })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // ✅ v13.4.7.0: ייבוא אוטומטי של מכירות מ-IBKR Flex — ?autosales=UPDATE_TOKEN (ידני; רץ גם יומית ב-dailyPortfolioUpdate)
  if (e && e.parameter && e.parameter.autosales) {
    try {
      var _uTok2 = PropertiesService.getScriptProperties().getProperty('UPDATE_REMOTE_TOKEN') || '';
      if (!_uTok2 || e.parameter.autosales !== _uTok2) {
        return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' })).setMimeType(ContentService.MimeType.JSON);
      }
      var _asRes = IBKR_autoSales();
      return ContentService.createTextOutput(JSON.stringify({ ok: true, version: APP_VERSION, result: _asRes })).setMimeType(ContentService.MimeType.JSON);
    } catch (_asErr) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'autosales: ' + _asErr })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  if (e && e.parameter && e.parameter.api) {
    try {
      var _readToken = PropertiesService.getScriptProperties().getProperty('AGENT_READ_TOKEN') || '';
      if (!_readToken || e.parameter.api !== _readToken) {
        return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' })).setMimeType(ContentService.MimeType.JSON);
      }
      // ✅ v13.4.5.1: נתיב אבחון — ?api=TOKEN&diag=1 מחזיר גם בעיות שלמות ומפות כמויות
      var _apiResp = {
        ok: true,
        version: APP_VERSION,
        ts: new Date().toISOString(),
        ctx: _buildAnalystCtx(e.parameter.diag === '1')
      };
      if (e.parameter.diag === '1') {
        _apiResp.integrity = runIntegrityCheck();
        try { _apiResp.sales = getSales(); } catch (e1) { _apiResp.sales = 'err: ' + e1; }
        try {
          var _pc = getPurchaseCosts();
          _apiResp.costsNet = {};
          Object.keys(_pc).forEach(function (s) {
            _apiResp.costsNet[s] = { qty: _pc[s].qty, gross: _pc[s].grossQty, sold: _pc[s].soldQty };
          });
        } catch (e2) { _apiResp.costsNet = 'err: ' + e2; }
      }
      return ContentService.createTextOutput(JSON.stringify(_apiResp)).setMimeType(ContentService.MimeType.JSON);
    } catch (apiErr) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(apiErr) })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // ✅ v12.5.0.6: אבחון webhook טלגרם מרוחק — ?tgdiag=<AGENT_READ_TOKEN> — בלי להטריד את עופר בעורך.
  // חוזר עם getWebhookInfo + בדיקת הגעה אנונימית לכתובת הרשומה + lastUpdateId המאוחסן.
  if (e && e.parameter && e.parameter.tgdiag) {
    try {
      var _dTok = PropertiesService.getScriptProperties().getProperty('AGENT_READ_TOKEN') || '';
      if (!_dTok || e.parameter.tgdiag !== _dTok) {
        return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' })).setMimeType(ContentService.MimeType.JSON);
      }
      var _cfg = getSettings();
      var _info = JSON.parse(UrlFetchApp.fetch('https://api.telegram.org/bot' + _cfg.tgToken + '/getWebhookInfo', { muteHttpExceptions: true }).getContentText());
      var _r = (_info && _info.result) || {};
      var _probeCode = null;
      try {
        var _pr = UrlFetchApp.fetch(_r.url || WEBAPP_URL, { method: 'post', contentType: 'application/json', followRedirects: true, muteHttpExceptions: true, payload: JSON.stringify({ update_id: 0 }) });
        _probeCode = _pr.getResponseCode();
      } catch (_pe) { _probeCode = 'ERR:' + _pe; }
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, version: APP_VERSION, registeredUrl: _r.url || null,
        pendingUpdateCount: _r.pending_update_count || 0,
        lastErrorDate: _r.last_error_date ? new Date(_r.last_error_date * 1000).toISOString() : null,
        lastErrorMessage: _r.last_error_message || null,
        anonymousProbeHttpCode: _probeCode,
        storedLastUpdateId: PropertiesService.getScriptProperties().getProperty('lastUpdateId') || null
      })).setMimeType(ContentService.MimeType.JSON);
    } catch (_dErr) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(_dErr) })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // ✅ v12.5.0.7: מעבר ל-polling אמין במקום webhook — ?tgfix=<AGENT_READ_TOKEN>
  // התגלה (05/10/2026): טלגרם מדווח "Wrong response from the webhook: 302 Found" על ה-POST
  // שחוזר מ-GAS /exec, בעקביות, גם כשבדיקה אנונימית עם מעקב-הפניות מקבלת 200 — טלגרם לא עוקב
  // אחרי ה-302 של GAS ל-webhook (מגבלה ידועה). 6 הודעות נשארו תקועות ב-pending. זה כנראה פעל
  // על fallback polling ישן (שהוסר כשעבר ל-webhook) בלי שמישהו שם לב שה-webhook לא אמין.
  // תיקון: מוחקים את ה-webhook, מרוקנים מיד את התקועות, ומקימים טריגר polling כל דקה (קבוע).
  if (e && e.parameter && e.parameter.tgfix) {
    try {
      var _fTok = PropertiesService.getScriptProperties().getProperty('AGENT_READ_TOKEN') || '';
      if (!_fTok || e.parameter.tgfix !== _fTok) {
        return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' })).setMimeType(ContentService.MimeType.JSON);
      }
      var _flog = [];
      var _fcfg = getSettings();
      var _delRes = UrlFetchApp.fetch('https://api.telegram.org/bot' + _fcfg.tgToken + '/deleteWebhook', { method: 'post', muteHttpExceptions: true }).getContentText();
      _flog.push('deleteWebhook: ' + _delRes);
      // ניקוז מיידי של ההודעות התקועות
      checkTelegramMessages();
      _flog.push('checkTelegramMessages() רוקן תקועות');
      // טריגר polling כל דקה — רק אם לא קיים כבר
      var _existing = ScriptApp.getProjectTriggers().filter(function (t) { return t.getHandlerFunction() === 'checkTelegramMessages'; });
      if (_existing.length === 0) {
        ScriptApp.newTrigger('checkTelegramMessages').timeBased().everyMinutes(1).create();
        _flog.push('טריגר polling כל דקה נוצר');
      } else {
        _flog.push('טריגר polling כבר קיים (' + _existing.length + ')');
      }
      var _info = JSON.parse(UrlFetchApp.fetch('https://api.telegram.org/bot' + _fcfg.tgToken + '/getWebhookInfo', { muteHttpExceptions: true }).getContentText());
      return ContentService.createTextOutput(JSON.stringify({ ok: true, log: _flog, webhookInfoAfter: (_info && _info.result) || null })).setMimeType(ContentService.MimeType.JSON);
    } catch (_fErr) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(_fErr) })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // ✅ v12.5.0.8: רישום webhook דרך רליי Base44 — ?tgrelay=<AGENT_READ_TOKEN>
  // טלגרם לא עוקב אחרי ה-302 של GAS /exec (הסיבה לשתיקות של 05/10), אבל הרליי של Base44 כן.
  // רושמים את ה-webhook של הבוט ל-relay הציבורי, שמעביר ל-?tg= הקיים. polling מוסר (מתנגש עם webhook).
  // גיבוי חירום נשאר ?tgfix (מוחק webhook ומחזיר polling כל דקה).
  if (e && e.parameter && e.parameter.tgrelay) {
    try {
      var _rwTok = PropertiesService.getScriptProperties().getProperty('AGENT_READ_TOKEN') || '';
      if (!_rwTok || e.parameter.tgrelay !== _rwTok) {
        return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' })).setMimeType(ContentService.MimeType.JSON);
      }
      var _rwcfg = getSettings();
      var _setRes = JSON.parse(UrlFetchApp.fetch('https://api.telegram.org/bot' + _rwcfg.tgToken + '/setWebhook', {
        method: 'post', contentType: 'application/json', muteHttpExceptions: true,
        payload: JSON.stringify({
          url: 'https://elio-44efba6d.base44.app/functions/telegramRelay',
          secret_token: '6eea65d502c7f17edb1cc979c163c827',
          allowed_updates: ['message', 'callback_query']
        })
      }).getContentText());
      var _removedTriggers = 0;
      ScriptApp.getProjectTriggers().forEach(function (t) {
        if (t.getHandlerFunction() === 'checkTelegramMessages') { ScriptApp.deleteTrigger(t); _removedTriggers++; }
      });
      var _rwinfo = JSON.parse(UrlFetchApp.fetch('https://api.telegram.org/bot' + _rwcfg.tgToken + '/getWebhookInfo', { muteHttpExceptions: true }).getContentText());
      return ContentService.createTextOutput(JSON.stringify({ ok: !!(_setRes && _setRes.result), setWebhook: _setRes, pollingTriggersRemoved: _removedTriggers, webhookInfo: (_rwinfo && _rwinfo.result) || null })).setMimeType(ContentService.MimeType.JSON);
    } catch (_rwErr) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(_rwErr) })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // ✅ v13.0.0.0: עדכון יתרות בנקים אוטומטי מהתראות מייל (חבצלת דוחפת מרחוק)
  // ?bankdata=<AGENT_READ_TOKEN>&get=1  ← קריאת יתרות נוכחיות
  // ?bankdata=<AGENT_READ_TOKEN>&poalim=<ILS>&chase=<USD>  ← כתיבה לגיליון "חשבונות בנק"
  if (e && e.parameter && e.parameter.bankdata) {
    try {
      var _bkTok = PropertiesService.getScriptProperties().getProperty('AGENT_READ_TOKEN') || '';
      if (!_bkTok || e.parameter.bankdata !== _bkTok) {
        return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' })).setMimeType(ContentService.MimeType.JSON);
      }
      var _bkSh = SS.getSheetByName('חשבונות בנק');
      if (!_bkSh) {
        return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'missing sheet: חשבונות בנק' })).setMimeType(ContentService.MimeType.JSON);
      }
      var _bkRange = _bkSh.getRange('A5:F12');
      var _bkRows = _bkRange.getValues();
      // קריאה בלבד
      if (e.parameter.get === '1') {
        return ContentService.createTextOutput(JSON.stringify({
          ok: true, version: APP_VERSION,
          accounts: getBankAccounts().map(function (b) { return { institution: b.institution, accType: b.accType, ccy: b.ccy, balance: b.balance }; })
        })).setMimeType(ContentService.MimeType.JSON);
      }
      // כתיבה
      var _bkStamp = Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'dd/MM/yyyy HH:mm');
      var _bkRes = { ok: true, updated: [], skipped: [] };
      function _bkFind(matchFn) {
        for (var r = 0; r < _bkRows.length; r++) {
          var inst = String(_bkRows[r][0] || '').toLowerCase();
          var type = String(_bkRows[r][1] || '').toLowerCase();
          if (inst && matchFn(inst, type)) return r + 5; // שורת הגיליון (A5 מתחיל בשורה 5)
        }
        return -1;
      }
      function _bkWrite(sheetRow, val, label) {
        _bkSh.getRange('D' + sheetRow).setValue(Number(val));
        _bkSh.getRange('F' + sheetRow).setValue('auto · ' + _bkStamp);
        _bkRes.updated.push(label + ' = ' + val);
      }
      if (typeof e.parameter.poalim !== 'undefined' && e.parameter.poalim !== '') {
        var pr = _bkFind(function (s) { return s.indexOf('פועלים') >= 0 || s.indexOf('poalim') >= 0; });
        if (pr > 0) _bkWrite(pr, e.parameter.poalim, 'פועלים'); else _bkRes.skipped.push('פועלים');
      }
      if (typeof e.parameter.chase !== 'undefined' && e.parameter.chase !== '') {
        var cr = _bkFind(function (s, t) {
          var isChase = s.indexOf('chase') >= 0 || s.indexOf('צייס') >= 0;
          var isSav = t.indexOf('sav') >= 0 || t.indexOf('חסכ') >= 0;
          return isChase && !isSav; // Checking בלבד
        });
        if (cr > 0) _bkWrite(cr, e.parameter.chase, 'Chase Checking'); else _bkRes.skipped.push('Chase Checking');
      }
      if (typeof e.parameter.chaseSav !== 'undefined' && e.parameter.chaseSav !== '') {
        var csr = _bkFind(function (s, t) {
          var isChase = s.indexOf('chase') >= 0 || s.indexOf('צייס') >= 0;
          var isSav = t.indexOf('sav') >= 0 || t.indexOf('חסכ') >= 0;
          return isChase && isSav;
        });
        if (csr > 0) _bkWrite(csr, e.parameter.chaseSav, 'Chase Savings'); else _bkRes.skipped.push('Chase Savings');
      }
      // ✅ v13.0.0.1: סנכרון יתרת השתלמות הראל מנתוני הפנסיה (PENSION_DATA) לגיליון הבנקים
      if (e.parameter.syncHishtalmut === '1') {
        var hr = _bkFind(function (s, t) { return s.indexOf('הראל') >= 0 && t.indexOf('שתלמות') >= 0; });
        var hBal = (PENSION_DATA.ofir.hishtalmut || {}).balance || 0;
        if (hr > 0 && hBal > 0) _bkWrite(hr, hBal, 'הראל השתלמות (מנתוני פנסיה)'); else _bkRes.skipped.push('השתלמות');
      }
      _bkRes.updatedAt = _bkStamp;
      return ContentService.createTextOutput(JSON.stringify(_bkRes)).setMimeType(ContentService.MimeType.JSON);
    } catch (_bkErr) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(_bkErr) })).setMimeType(ContentService.MimeType.JSON);
    }
  }


  // ✅ v13.3.1.0: עדכון חיסכון לכל ילד מסריקת פורטלים (חבצלת דוחפת מרחוק)
  // ?savdata=<AGENT_READ_TOKEN>&sav=<JSON>  ← JSON: [{name,fund,track,bl,parents,total},...]
  // name חייב להתאים לשם בעמודה A (שורות 5-7). bl=ביטוח לאומי, parents=סכום הורים.
  if (e && e.parameter && e.parameter.savdata) {
    try {
      var _svTok = PropertiesService.getScriptProperties().getProperty('AGENT_READ_TOKEN') || '';
      if (!_svTok || e.parameter.savdata !== _svTok) {
        return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' })).setMimeType(ContentService.MimeType.JSON);
      }
      var _svSh = SS.getSheetByName('חיסכון לכל ילד');
      if (!_svSh) {
        return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'missing sheet: חיסכון לכל ילד' })).setMimeType(ContentService.MimeType.JSON);
      }
      var _svIn = [];
      try { _svIn = JSON.parse(e.parameter.sav || '[]'); } catch (_svPe) {
        return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'bad sav JSON' })).setMimeType(ContentService.MimeType.JSON);
      }
      var _svRange = _svSh.getRange('A5:G7');
      var _svRows = _svRange.getValues();
      var _svStamp = Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'dd/MM/yyyy HH:mm');
      var _svRes = { ok: true, updated: [], skipped: [] };
      _svIn.forEach(function (kid) {
        if (!kid || !kid.name) return;
        var _row = -1;
        for (var r = 0; r < _svRows.length; r++) {
          if (String(_svRows[r][0] || '').trim() === String(kid.name).trim()) { _row = r + 5; break; }
        }
        if (_row < 0) { _svRes.skipped.push(String(kid.name) + ' (לא נמצא בגיליון)'); return; }
        _svSh.getRange('B' + _row).setValue(new Date());
        if (kid.fund)    _svSh.getRange('C' + _row).setValue(String(kid.fund));
        if (kid.track)   _svSh.getRange('D' + _row).setValue(String(kid.track));
        if (typeof kid.bl === 'number')      _svSh.getRange('E' + _row).setValue(kid.bl);
        if (typeof kid.parents === 'number')  _svSh.getRange('F' + _row).setValue(kid.parents);
        if (typeof kid.total === 'number')    _svSh.getRange('G' + _row).setValue(kid.total);
        _svRes.updated.push(String(kid.name) + ' = ₪' + (kid.total || '?'));
      });
      if (!_svRes.updated.length) _svRes.ok = false;
      _svRes.updatedAt = _svStamp;
      return ContentService.createTextOutput(JSON.stringify(_svRes)).setMimeType(ContentService.MimeType.JSON);
    } catch (_svErr) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(_svErr) })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // ✅ v12.5.0.10: סוויץ'ים מרחוק — ?cfg=<AGENT_READ_TOKEN>&k=KEY[&v=VALUE]
  // קריאה בלי v; כתיבה עם v (v=0 מנקה). משמש להשתקה/הפעלה של דוחות בלי דפלוי.
  if (e && e.parameter && e.parameter.cfg) {
    try {
      var _cfgTok = PropertiesService.getScriptProperties().getProperty('AGENT_READ_TOKEN') || '';
      if (!_cfgTok || e.parameter.cfg !== _cfgTok) {
        return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' })).setMimeType(ContentService.MimeType.JSON);
      }
      var _k = String(e.parameter.k || '');
      var _props = PropertiesService.getScriptProperties();
      if (!_k) {
        return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'missing key' })).setMimeType(ContentService.MimeType.JSON);
      }
      if (typeof e.parameter.v !== 'undefined') {
        var _v = String(e.parameter.v);
        if (_v === '0') { _props.deleteProperty(_k); }
        else { _props.setProperty(_k, _v); }
      }
      return ContentService.createTextOutput(JSON.stringify({ ok: true, version: APP_VERSION, key: _k, value: _props.getProperty(_k) || '0' })).setMimeType(ContentService.MimeType.JSON);
    } catch (_cfgErr) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(_cfgErr) })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // ✅ v12.5.0.9: אודיט טריגרים מרוחק — ?tgtriggers=<AGENT_READ_TOKEN>[&del=שם_פונקציה]
  // מציג את כל הטריגרים החיים (מה שבאמת יורה הודעות), ואופציונלית מוחק לפי שם handler.
  if (e && e.parameter && e.parameter.tgtriggers) {
    try {
      var _atTok = PropertiesService.getScriptProperties().getProperty('AGENT_READ_TOKEN') || '';
      if (!_atTok || e.parameter.tgtriggers !== _atTok) {
        return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' })).setMimeType(ContentService.MimeType.JSON);
      }
      var _deleted = [];
      if (e.parameter.del) {
        var _delName = String(e.parameter.del);
        ScriptApp.getProjectTriggers().forEach(function (t) {
          if (t.getHandlerFunction() === _delName) { ScriptApp.deleteTrigger(t); _deleted.push(t.getUniqueId()); }
        });
      }
      var _list = [];
      ScriptApp.getProjectTriggers().forEach(function (t) {
        _list.push({ id: t.getUniqueId(), handler: t.getHandlerFunction(), eventType: String(t.getEventType()) });
      });
      return ContentService.createTextOutput(JSON.stringify({ ok: true, version: APP_VERSION, deleted: _deleted.length, deletedIds: _deleted, triggers: _list })).setMimeType(ContentService.MimeType.JSON);
    } catch (_atErr) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(_atErr) })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // ✅ v12.4.2.0: עדכון בלחיצה אחת מוואטסאפ — ?upd=<UPDATE_REMOTE_TOKEN> — טוקן נעול ב-Script Properties
  if (e && e.parameter && e.parameter.upd) {
    try {
      var _updTok = PropertiesService.getScriptProperties().getProperty('UPDATE_REMOTE_TOKEN') || '';
      if (!_updTok || e.parameter.upd !== _updTok) {
        return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' })).setMimeType(ContentService.MimeType.JSON);
      }
      var _res = _updateApplyCore();
      var _r = {};
      try { _r = JSON.parse(_res) || {}; } catch (pe) { _r = { ok: false, error: 'parse: ' + _res.substring(0, 300) }; }
      var _page = _updResultPage(_r);
      return HtmlService.createHtmlOutput(_page).setTitle('עדכון האפליקציה').addMetaTag('viewport', 'width=device-width, initial-scale=1');
    } catch (updErr) {
      return HtmlService.createHtmlOutput('<div dir="rtl" style="font-family:sans-serif;padding:24px">שגיאה: ' + String(updErr).replace(/</g,'&lt;') + '</div>');
    }
  }
  // ✅ v11: מנסה כמה שמות קבצים — עמיד לשינויי שם של קובץ ה-HTML
  var htmlNames = ['INDEX_V10', 'INDEX_V2', 'INDEX'];
  for (var i = 0; i < htmlNames.length; i++) {
    try {
      // ✅ v13.0.1.0: שורש הבאג — out.append() מוסיף לסוף המסמך, אחרי כל הקוד, ולכן initLogin רץ
      // כש-window.__SHELL עוד undefined (sh=0) והכניסה נפלה לקוד. עכשיו הדגלים נכנסים לתחילת
      // המסמך דרך תבנית (evaluate) והם קיימים לפני שכל סקריפט אחר רץ.
      var _sh = (e && e.parameter && e.parameter.shell === '1') ? '1' : '0';
      var _gp = (e && e.parameter && (e.parameter.g === 'bio' || e.parameter.g === 'pin')) ? e.parameter.g : '';
      var _rawHtml = HtmlService.createHtmlOutputFromFile(htmlNames[i]).getContent();
      var _pre = '<script>window.APP_VERSION="' + APP_VERSION + '";window.__SHELL=' + (_sh === '1' ? 'true' : 'false') + ';window.__G="' + _gp + '";</script>';
      var _hd = _rawHtml.search(/<head[^>]*>/i);
      if (_hd >= 0) {
        var _m = _rawHtml.match(/<head[^>]*>/i);
        _rawHtml = _rawHtml.substring(0, _hd + _m[0].length) + _pre + _rawHtml.substring(_hd + _m[0].length);
      } else {
        _rawHtml = _pre + _rawHtml;
      }
      var out = HtmlService.createHtmlOutput(_rawHtml)
        .setTitle('תיק השקעות | Ofir')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      return out;
    } catch (err) { /* קובץ לא נמצא — ממשיך לשם הבא */ }
  }
  return ContentService.createTextOutput('שגיאה: קובץ ה-HTML לא נמצא בפרויקט. העלה את INDEX.html ונסה שוב.');
}
// ── doPost — מקבל נתוני IBKR ──
function doPost(e) {
  // ✅ v11.2: ניתוב — Webhook של טלגרם (?tg=SECRET) או קליטת IBKR
  try {
    if (e && e.parameter && e.parameter.tg) return _handleTelegramWebhook(e);
    const payload = JSON.parse(e.postData.contents);
    const secret = PropertiesService.getScriptProperties().getProperty('IBKR_SECRET') || '';
    if (!secret || payload.secret !== secret)
      return ContentService.createTextOutput(JSON.stringify({ error: 'Unauthorized' })).setMimeType(ContentService.MimeType.JSON);
    if (payload.type === 'ibkr_positions') {
      const results = writeIBKRFromAPI(payload.positions, payload.cashUSD, payload.usdIls);
      return ContentService.createTextOutput(JSON.stringify({ ok: true, written: results.length })).setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(JSON.stringify({ error: 'Unknown payload type' })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log('doPost שגיאה: ' + err);
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}
// ═══════════════════════════════════════════════════════════════
// 🔐 אבטחה v11 — Gate בצד השרת
// כל פונקציה שמחזירה נתונים ללקוח מקבלת token ומאומתת כאן קודם.
// אם לא הוגדר PIN — אין נעילה (תאימות לאחור: האתר נשאר פתוח כמו קודם).
// ═══════════════════════════════════════════════════════════════

var SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // ✅ v11.8.0.0: סשן תקף 30 יום — טביעת אצבע בלבד בפתיחה (הקוד נדרש אחת לחודש, או אחרי יציאה מדמו/התנתקות)

function _authEnabled() {
  return !!PropertiesService.getScriptProperties().getProperty('LOGIN_PIN_HASH');
}

// מחזיר null אם מותר להמשיך, אחרת JSON שגיאה שמוחזר ללקוח
function _gate(token) {
  if (!_authEnabled()) return null;
  var ok = false;
  try { var r = JSON.parse(_checkToken(token)); ok = !!r.valid; } catch (e) { ok = false; }
  if (ok) return null;
  Logger.log('🚫 גישה נדחתה — סשן לא תקף');
  return JSON.stringify({ error: 'unauthorized' });
}

// ── סשנים מרובים: כל מכשיר מקבל סשן משלו ──
// ✅ v11.7.0.0: לכל סשן יש scope — 'real' (אמיתי) או 'demo' (דמו, עם מקדם כיווץ).
// סשנים דמו = קריאה בלבד; הנתונים מוקטנים בשרת לפי המקדם. תאימות לאחור לערכים מספריים ישנים.
function _loadSessions() {
  var raw = PropertiesService.getScriptProperties().getProperty('LOGIN_SESSIONS');
  var map = {};
  if (raw) { try { map = JSON.parse(raw); } catch (e) { map = {}; } }
  var now = new Date().getTime();
  var changed = false;
  Object.keys(map).forEach(function(t) {
    var v = map[t];
    if (typeof v === 'number') { map[t] = { t: v, scope: 'real', admin: false, factor: 0 }; v = map[t]; changed = true; }
    var ts = parseInt(v.t);
    if (isNaN(ts) || now - ts > SESSION_TTL_MS) { delete map[t]; changed = true; }
  });
  if (changed) PropertiesService.getScriptProperties().setProperty('LOGIN_SESSIONS', JSON.stringify(map));
  return map;
}

function _addSession(token, opts) {
  var map = _loadSessions();
  var o = opts || {};
  map[token] = {
    t: new Date().getTime(),
    scope: o.scope || 'real',
    admin: !!o.admin,
    factor: o.factor || 0
  };
  PropertiesService.getScriptProperties().setProperty('LOGIN_SESSIONS', JSON.stringify(map));
}

function _checkToken(token) {
  if (!token) return JSON.stringify({ valid: false });
  var map = _loadSessions();
  if (!map[token]) return JSON.stringify({ valid: false });
  return JSON.stringify({ valid: true });
}

// ═══ ✅ v11.7.0.0: מצב דמו — עזרים ═══
function _sessionObj(token) {
  if (!token || !_authEnabled()) return null;
  var map = _loadSessions();
  return map[token] || null;
}
// מקדם הכיווץ של סשן דמו — 0 אם זה לא דמו
function _demoFactor(token) {
  var s = _sessionObj(token);
  return (s && s.scope === 'demo' && s.factor > 0) ? s.factor : 0;
}
// האם זה סשן אמיתי של מנהל (רק לו מותר לפתוח דמו)
function _isRealAdmin(token) {
  var s = _sessionObj(token);
  return !!(s && s.scope !== 'demo' && s.admin);
}
// חסימת כתיבה לסשן דמו — מחזיר JSON שגיאה או null אם מותר
function _requireReal(token) {
  if (_demoFactor(token) > 0) {
    Logger.log('🚫 דמו: ניסיון כתיבה נחסם');
    return JSON.stringify({ error: 'demo-mode-readonly' });
  }
  return null;
}

// ═══ ✅ v11.7.0.0: טרנספורמציית דמו — מקטין כסף וכמויות, משאיר מחירים ליחידה ואחוזים אמיתיים ═══
var _DEMO_SCALE = ['qty','quantity','grossQty','soldQty','buyQty','remainingAfterSale','valILS','totalVal','totalValue','totalCost','totalRet','totalRetUSD','totalReturn','totalPL','cash','balance','valueILS','value','costILS','grossCostILS','retILS','retUSD','pl','plILS','gainsILS','gainILS','gainUSD','proceedsUSD','proceedsILS','costUSD','taxDueILS','taxPaidUS','taxPaidUS_ILS','taxPaidForeign_ILS','foreignTaxCreditUsed','foreignTaxCreditRemaining','grossUSD','taxUSD','netUSD','netILS','potentialTaxILS','banksVal','ibkrVal','fairVal','grandTotal','goalILS','currentVal','remaining','monthlyUSD','annualEstUSD','totalILS','totalUSD','avgPerTrade','commission','amount','total','ibkr','fair','banks','returnILS','divNetUSD','taxPaidUSD','perLotCostILS','targetILS','excessILS','sellQty','totalExcessILS','totalGainILS','totalGainUSD','estTaxILS','grossILS','foreignTaxILS','estLocalTaxILS','amountILS','taxILS','monthlyPension','disabilityMonthly','survivorSpouse','survivorParent','survivorOrphan','waiverMonthly','deathBenefit','premium','depositsYTD','lastDeposit','yearTotal','criticalIllness','cancerComp','yearStartBalance','profitYTD'];

function _demoTransform(node, f) {
  if (Array.isArray(node)) return node.map(function(x) { return _demoTransform(x, f); });
  if (node && typeof node === 'object' && !(node instanceof Date)) {
    var out = {};
    Object.keys(node).forEach(function(k) {
      var v = node[k];
      if (typeof v === 'number' && _DEMO_SCALE.indexOf(k) >= 0) {
        out[k] = Math.round(v * f * 100) / 100;
      } else {
        out[k] = _demoTransform(v, f);
      }
    });
    return out;
  }
  return node;
}

// ═══════════════════════════════════════════════════════════════
// ✅ v12.4.0.0 — פנסיה וביטוח: נתונים שחולצו אוטומטית מפורטל מגדל
// על ידי חבצלת (27/09/2026). עדכון נתונים = החלפת בלוק PENSION_DATA בלבד.
// שדות כספיים רשומים ב-_DEMO_SCALE כדי שמצב דמו יקטין גם אותם.
// ═══════════════════════════════════════════════════════════════
var PENSION_DATA = {
  asOf: '27/09/2026',
  source: 'פורטל מגדל · דוחות PDF שהועלו: פניקס Q2/2026, הראל השתלמות 23/09/2026, מנורה בריאות 2025 · חבצלת',
  ofir: {
    pension: {
      provider: 'מגדל', fund: 'מקפת אישית', employer: 'כנפי שחר',
      balance: 699231, depositsYTD: 20523, lastDeposit: 609, lastDepositDate: '05/10/2026',
      track: 'עוקב S&P 500', feeDepositPct: 1.5, feeAccumPct: 0.14,
      monthlyPension: 8607, disabilityMonthly: 7678, survivorSpouse: 6142,
      survivorParent: 1024, survivorOrphan: 3071, waiverMonthly: 2005,
      beneficiaryDirective: false
    },
    hishtalmut: {
      provider: 'הראל', fund: 'קרן השתלמות', account: '165379782',
      agent: 'ארן ביטוחים סוכנות',
      balance: 89859, balanceDate: '23/09/2026',
      track: 'עוקב S&P 500', returnYTD: '5.61%', terPct: 0.80,
      feeDepositPct: 0, feeAccumPct: 0.70,
      status: 'פעילה · עצמאי · מ-01/07/2023',
      liquidity: '31/01/2029', tax: 'פטורה ממס רווחי הון',
      note: '100% צבירת עמית (ללא תגמולי מעסיק) · דוח מידע אישי מהפורטל'
    },
    phoenixPension: {
      provider: 'הפניקס', fund: 'פנסיה מקיפה',
      balance: 5450, balanceDate: '30/06/2026', yearStartBalance: 5148, profitYTD: 310,
      feeDepositPct: 0, feeAccumPct: 0.20, returnYTD: '6.01%', track: 'לבני 50 ומטה (תלוי גיל)',
      monthlyPension: 67, retireAge: 67, depositsStopped: '07/2021',
      agent: 'שקל מיזם קמעונאים',
      note: 'קרן רדומה — יתרה שולית; לא כדאי לנהל מו"מ דמי ניהול עליה'
    },
    life: [{
      provider: 'מגדל', name: 'אור 1 — ביטוח חיים (ריסק מתחדש)', num: '24191303',
      status: 'פעילה', period: '01/05/2026 – 01/05/2062',
      deathBenefit: 1018273, premium: 108
    }],
    health: {
      provider: 'מגדל', num: '19391460', plan: 'דואגים למשפחה מורחב — פלטינום',
      planType: 'תאונות אישיות', since: '06/2017',
      coverages: ['תאונות אישיות', 'בריאות', 'מחלות קשות', 'סיעוד']
    }
  },
  revital: {
    pension: {
      provider: 'מגדל', fund: 'מקפת אישית', employer: 'כנפי שחר', agent: 'קלישר דוד',
      balance: 252707, balanceDate: '08/10/2026', yearStartBalance: 216686,
      depositsYTD: 17850, lastDeposit: 1785, lastDepositDate: '05/10/2026',
      feeDepositPct: 1.5, feeAccumPct: 0.14, retireAge: 64,
      monthlyPension: 3535, survivorSpouse: 5217, survivorOrphan: 3478,
      survivorParent: 1739, disabilityMonthly: 6521, waiverMonthly: 1702,
      beneficiaryDirective: null,
      balanceHistory: [
        { d: '01/2024', v: 128255 }, { d: '01/2025', v: 167072 },
        { d: '31/03/2025', v: 171340 }, { d: '30/06/2025', v: 190231 },
        { d: '01/2026', v: 216686 }, { d: '31/03/2026', v: 223478 },
        { d: '30/06/2026', v: 241896 }
      ],
      source: 'דוחות רבעוניים רשמיים Q3/2024-Q2/2026 (סריקת מייל רויטל 08/10/2026)'
    },
    health: {
      provider: 'מגדל', num: '19393464', plan: 'דואגים למשפחה מורחב — פלטינום',
      planType: 'תאונות אישיות', since: '06/2017',
      coverages: ['תאונות אישיות', 'בריאות', 'מחלות קשות', 'סיעוד']
    },
    // ✅ v12.4.3.4: ביטוח חיים רויטל — אושר ע"י אופיר (28/09/2026): ₪2M במגדל, נוצר ~אפריל-מאי 2026
    // דרך ליאל חזון (חדר מצב, lielh@migdal.co.il). מס' פוליסה ופרמיה במסמכי פורמלי המאובטחים — ממתין לאימות.
    life: [
      {
        name: 'ביטוח חיים — רויטל', provider: 'מגדל', num: '24191302',
        plan: 'אור 1 (ריסק)', status: 'פעילה', deathBenefit: 2036545,
        period: '01/05/2026-01/05/2070 (עד גיל 80)', premium: 28,
        coverage: 'מוות בלבד (חד פעמי) · נכות/אובדן כושר מכוסים בקרן הפנסיה',
        source: 'פורטל מגדל 08/10/2026 (כניסת רויטל) — הפוליסה שהופיעה אצל אופיר כ-24191302 לא מזוהה. נוצר דרך ליאל חזון בעקבות פנייה לקלישר 05/04/2026'
      }
    ],
    // ✅ v12.4.3.4: פוליסת הראל פרטית של רויטל (נחשפה בסריקת מיילים 28/09/2026)
    harelHealth: {
      provider: 'הראל', num: '895373434',
      plan: 'פוליסה פרטית — תרופות מיוחדות + השתלות וטיפולים בחו"ל',
      since: '01/03/2010', agency: 'עמרי/לאומית מקסימום (09-8807920)', discountPct: 5,
      annualCost: 171.77, monthlyCost: 15.07, asOf: '01/2025',
      coverages: [
        { name: "תרופות מיוחדות 'לאומית'", annex: 940, monthly: 6.34 },
        { name: 'השתלות וטיפולים בחו"ל', annex: '949/896', monthly: 8.73 }
      ],
      source: 'דף פרטי ביטוח מלא + דוח שנתי 2023 (צרוף למייל רויטל 07/01/2025)'
    },
    // ✅ v13.3.3.0: קופת גמל רדומה של רויטל במגדל — התגלתה בסריקת מייל (הודעות הפסקת תשלום 11/2020 + 02/2022)
    migdalGemel: {
      status: 'רדומה — הפקדות הופסקו', stopped: '02/2022', balance: null,
      source: 'הודעות מגדל על הפסקת תשלום לקופת גמל (מייל רויטל) — יתרה לבדיקה בפורטל'
    }
  },
  uri: {
    health: {
      provider: 'מגדל', num: '24193003', plan: 'ביטוח בריאות פרטי מלא',
      since: '06/05/2026', renewed: '08/09/2026',
      coverages: ['בריאות', 'מחלות קשות', 'סיעוד', 'תאונות אישיות', 'מזור מורחב', 'מזור לסרטן', 'תרופות שאינן בסל הבריאות', 'ניתוחים וטיפולים בחו"ל']
    }
  },
  menoraHealth: {
    provider: 'מנורה מבטחים', policy: '501992895', agent: 'קלישר דוד',
    year: 2025, yearTotal: 5879,
    renewal: 'חידוש 06/2026: נוסף כיסוי טיפולים פסיכולוגיים בגילוי מחלה קשה · בוטלה תקופת שרידות בסרטן · ללא שינוי מחיר',
    members: [
      { name: 'אופיר', premium: 2666, criticalIllness: 236143, coverages: 'תרופות מיוחדות · תרופה בהתאמה אישית · שירותים אמבולטוריים · קרן אור טופ (מחלות קשות)' },
      { name: 'רויטל', premium: 1924, criticalIllness: 236143, cancerComp: 118071, coverages: 'תרופות מיוחדות · תרופה בהתאמה אישית · אבחון מהיר · קרן אור טופ · קרן לחיים (פיצוי סרטן)' },
      { name: 'רומי', premium: 645, criticalIllness: 236143, cancerComp: 118071, coverages: 'תרופות מיוחדות · תרופה בהתאמה אישית · אבחון מהיר · קרן אור טופ · קרן לחיים' },
      { name: 'נועם דוד', premium: 644, criticalIllness: 236143, cancerComp: 118071, coverages: 'תרופות מיוחדות · תרופה בהתאמה אישית · אבחון מהיר · קרן אור טופ · קרן לחיים' }
    ]
  },
  feeNegotiation: {
    agent: 'דודי קלישר', status: 'במו\"מ', since: '08/2025',
    target: { deposit: 1.4, accum: 0.10 },
    history: [
      { date: '11/2021', text: 'הופחת דמי ניהול בקרן 630064147: שוטף 2.0% → 1.5% · צבירה 0.20% → 0.18%' },
      { date: '08/2025', text: 'קלישר דוחף ל-1.4% שוטף + 0.10% צבירה לאופיר ולרויטל יחד — הבקשה הוחזרה למגדל בשלישית, ממתין לאישור סופי' }
    ]
  },
  fundIds: [
    { num: '630064147', type: 'קרן פנסיה', owner: 'לאימות — כנראה אופיר' },
    { num: '600025062', type: 'קרן פנסיה', owner: 'רויטל (אומת מדוח רבעוני)' },
    { num: '24191302', type: 'אור 1 — ביטוח חיים רויטל (אומת 08/10/2026)', owner: 'רויטל' },
    { num: '15876260', type: 'פוליסה בפורטל — טרם זוהתה', owner: 'לאימות' }
  ],
  alerts: [
    { level: 'high', text: 'לא הוגדרה הוראת מוטבים בקרן הפנסיה של אופיר — מומלץ להגדיר מיד בפורטל מגדל' },
    { level: 'high', text: 'דמי ניהול הפקדות 1.50% — קלישר במו\"מ פעיל להורדה ל-1.4% (מאז 08/2025). כל 0.1% ≈ ₪1,840 לשנה' },
    { level: 'info', text: 'השתלמות הראל: דמי ניהול צבירה 0.70% — מעל המקובל בשוק (0.30%–0.50%). שווה פנייה לארן ביטוחים · דמי הפקדות 0% מצוינים' },
    { level: 'info', text: 'פניקס "פנסיה מקיפה": קרן רדומה ₪5,450 — קצבה צפויה ₪67/חודש בלבד. שולית; שקול מיזוג למגדל בעתיד' },
    { level: 'info', text: 'פוליסה 15876260 בפורטל שטרם זוהתה (24191302 אומתה: ביטוח חיים רויטל ₪2.04M)' },
    { level: 'info', text: 'רויטל: דמי ניהול הפקדות 1.50% — כמו אופיר; שווה מו"מ משותף מול הסוכן (קלישר דוד)' },
    { level: 'info', text: 'רויטל: קופת גמל רדומה במגדל (הפקדות הופסקו 02/2022) — יתרה לבדיקה בפורטל; שקול איחוד לפנסיה' }
  ],
  pending: [
    'דוחות פירוט תשלומים ממגדל (2024–2026) — הופקו בפורטל, בדרך למייל',
    'פרמיות וסכומי ביטוח מדויקים לכל כיסוי בריאות בפורטל מגדל',
    'זיהוי פוליסה 15876260 בפורטל מגדל (24191302 אומתה כביטוח חיים רויטל)',
    'קופת גמל רדומה של רויטל במגדל — בדיקת יתרה בפורטל (הפקדות הופסקו 02/2022)'
  ]
};

// ═══════════════════════════════════════════════════════════════
// ✅ v13.0.0.0: מנוע סריקת פנסיות וביטוחים — כפתור "סריקה חכמה" באפליקציה
// + סריקת עומק חצי-שנתית של חבצלת (משדרת המלצות בוואטסאפ, עדכון בנצ'מרקס מרחוק)
// נתוני שוק: סריקת מחקר חבצלת 06/10/2026 (אמיתים/גמל"א, פנסיה יעילה, פרסומים כלכליים)
var PEN_BENCHMARKS = {
  asOf: '06/10/2026',
  nextDeepScan: '07/04/2027',
  source: 'סריקת שוק חבצלת — אמיתים, פנסיה יעילה, פרסומים כלכליים',
  pensionDeposit:    { marketAvg: 1.40, good: 0.50, best: 0.25 },
  pensionAccum:      { marketAvg: 0.25, good: 0.15, best: 0.11 },
  hishtalmutDeposit: { marketAvg: 1.55, good: 0.00, best: 0.00 },
  hishtalmutAccum:   { marketAvg: 0.55, good: 0.40, best: 0.30 },
  ofirMonthlyDeposit: 2115,      // ₪/חודש סה"כ (עובד+מעסיק+פיצויים)
  revitalMonthlyDeposit: 1785,  // ₪/חודש
  negotiationStatus: 'קלישר דוחף ל-1.4% הפקדה + 0.10% צבירה לאופיר ורויטל יחד — ממתין לאישור מגדל מאז 08/2025 (תקוע 14 חודשים)',
  alternatives: [
    { name: 'מיטב דולק — פנסיה מקיפה', accum: 0.11, deposit: 1.00 },
    { name: 'אלטשולר שחם — פנסיה מקיפה', accum: 0.12, deposit: 1.49 },
    { name: 'איביאי / מיטב — השתלמות', accum: 0.30, deposit: 0.00 }
  ]
};

function PENSION_review(token) {
  var g = _gate(token);
  if (g) { try { return JSON.parse(g); } catch (eG) { return { error: 'unauthorized' }; } }
  try {
    var P = _pensionPayload(), B = PEN_BENCHMARKS, F = [], save = 0;

    // ── פנסיות מגדל (אופיר + רויטל) — דמי הפקדה ──
    var oDep = P.ofir.pension.feeDepositPct || 0, rDep = P.revital.pension.feeDepositPct || 0;
    var annualDep = (B.ofirMonthlyDeposit + B.revitalMonthlyDeposit) * 12;
    if (oDep > B.pensionDeposit.good || rDep > B.pensionDeposit.good) {
      var cut = Math.max(oDep - B.pensionDeposit.good, rDep - B.pensionDeposit.good) / 100 * annualDep;
      save += cut;
      F.push({ sev: 'high', icon: '🎯', title: 'דמי הפקדה במגדל — ' + oDep + '% לשתי הקרנות (אופיר + רויטל)',
        text: 'ממוצע השוק: ' + B.pensionDeposit.marketAvg + '% · יעד לצבירה שלכם: ' + B.pensionDeposit.good + '% ומטה (הסכמים קיבוציים מגיעים ל-0%). ' +
              'חיסכון: ₪' + Math.round(cut) + '/שנה ישירות + ריבית דחויה עד הפרישה. ' +
              'המו"מ תקוע מאז 08/2025 (' + B.negotiationStatus + ') — בצבירה משותפת של ₪943K והפקדות של ₪' + Math.round(annualDep) + '/שנה אתם בעמדת כוח. ' +
              'פעולה: אולטימטום לדודי קלישר — או העברה מחברתית דיגיטלית לקרן נבחרת (מיטב: צבירה 0.11%).',
        saveYr: Math.round(cut) });
    }

    // ── השתלמות הראל — דמי צבירה ──
    var H = P.ofir.hishtalmut || {}, hAcc = H.feeAccumPct || 0;
    if (hAcc > B.hishtalmutAccum.good) {
      var hcut = (hAcc - B.hishtalmutAccum.good) / 100 * (H.balance || 0);
      save += hcut;
      F.push({ sev: 'med', icon: '💼', title: 'השתלמות הראל — צבירה ' + hAcc + '%',
        text: 'ממוצע שוק: ' + B.hishtalmutAccum.marketAvg + '% · יעד: ' + B.hishtalmutAccum.good + '% (איביאי/מיטב: 0.30%). ' +
              'חיסכון: ₪' + Math.round(hcut) + '/שנה, ויגדל עם הקרן עד נזילות 31/01/2029. ' +
              'פעולה: מו"מ עם ארן ביטוחים; אם לא מורידים — העברה בנזילות 2029. (דמי הפקדה 0% — מעולה, לשמור.)',
        saveYr: Math.round(hcut) });
    }

    // ── הוראת מוטבים ──
    if (P.ofir.pension.beneficiaryDirective === false) {
      F.push({ sev: 'high', icon: '⚠️', title: 'חסרה הוראת מוטבים — קרן פנסיה של אופיר',
        text: '5 דקות בפורטל מגדל. בלי זה, חלוקת הכספים במקרה מוות נקבעת לפי חוק הירושה ולא לפי בחירתך — ריבוי עם 3 ילדים קטינים.',
        saveYr: 0 });
    }
    var rvBen = P.revital.pension.beneficiaryDirective;
    if (rvBen === null || rvBen === undefined) {
      F.push({ sev: 'med', icon: '❓', title: 'הוראת מוטבים של רויטל — סטטוס לא ידוע',
        text: 'לא מופיע בדוחות הרבעוניים. בדוק בפורטל מגדל והגדר אם חסר.', saveYr: 0 });
    }

    // ── ביטוח חיים רויטל — אימות ──
    var rvLife = (P.revital.life || [])[0] || {};
    if (String(rvLife.num || '').indexOf('ממתין') >= 0) {
      F.push({ sev: 'med', icon: '📄', title: 'ביטוח חיים רויטל (₪2M במגדל) — ממתין לאימות',
        text: 'מספר פוליסה ופרמיה נמצאים במסמכי ליאל חזון (מיילים 13/04, 05-06/05/2026 — סיסמה בטלפון שלך). אמת ועדכן.', saveYr: 0 });
    }

    // ── ריכוז מסלול ──
    F.push({ sev: 'low', icon: '🧭', title: 'ריכוז מסלול: פנסיה + השתלמות — 100% S&P 500',
      text: 'עקבי עם אסטרטגיית התיק (VB/VT). אין פעולה נדרשת — רק מודעות: כל חיסכון הפנסיוני שלכם צמוד למדד אמריקאי אחד.', saveYr: 0 });

    // ── פניקס רדומה ──
    var X = P.ofir.phoenixPension || {};
    F.push({ sev: 'low', icon: '😴', title: 'פניקס פנסיה — קרן רדומה ₪' + fmt(X.balance || 0),
      text: 'דמי ניהול 0%/0.20% סבירים. עלות העברה (₪250+מע"ב לדודי) עולה על התועלת — השאר במקום. לשקול איחוד בפרישה.', saveYr: 0 });

    // ── בריאות ──
    var M = P.menoraHealth || {};
    F.push({ sev: 'low', icon: '🩺', title: 'ביטוח בריאות משפחתי מנורה — ₪' + (M.yearTotal || 0) + '/שנה ל-4 נפשות',
      text: 'חידוש ' + (M.renewal || '06/2027') + ' הולך וקרב. כחודש לפני — השוואת מחיר מול חלופות (אעשה זאת בסריקה החצי-שנתית של חבצלת).', saveYr: 0 });

    // ── כיסוי מוות ──
    F.push({ sev: 'low', icon: '🛡️', title: 'כיסוי מוות משפחתי: ₪3.02M + קצבאות שארים',
      text: 'אופיר ₪1.02M ("אור 1") + רויטל ₪2M + קצבאות שארים משתי הקרנות. נראה נדיב — ודא שתואם להתחייבויות לטווח ארוך (משכנתא/הלוואות אם יש).', saveYr: 0 });

    // סדר לפי חומרה
    var ord = { high: 0, med: 1, low: 2 };
    F.sort(function (a, b) { return (ord[a.sev] || 9) - (ord[b.sev] || 9); });
    var high = F.filter(function (x) { return x.sev === 'high'; }).length;

    var now = new Date();
    var ts = Utilities.formatDate(now, 'Asia/Jerusalem', 'dd/MM/yyyy HH:mm');
    var out = {
      version: APP_VERSION, ts: ts, asOf: P.asOf,
      benchmarks: { asOf: B.asOf, nextDeepScan: B.nextDeepScan, negotiationStatus: B.negotiationStatus },
      findings: F, totalSavings: Math.round(save),
      headline: 'חיסכון פוטנציאלי: ₪' + Math.round(save) + '/שנה (ועוד ריבית דחויה עד הפרישה)'
    };
    try {
      PropertiesService.getScriptProperties().setProperty('PEN_LAST_SCAN',
        JSON.stringify({ ts: ts, totalSavings: out.totalSavings, high: high }));
    } catch (eS) {}
    return out;
  } catch (e) {
    return { error: String(e) };
  }
}

function _pensionPayload() {
  return JSON.parse(JSON.stringify(PENSION_DATA));
}

// ✅ v12.4.0.0 — קריאה עצמאית מסומנת (עורך/בדיקה): PEN_checkData()
function getPensionData(token) {
  var g = _gate(token); if (g) return g;
  return JSON.stringify(_pensionPayload());
}

// ═══════════════════════════════════════════════════════════════
// ✅ v12.4.1.0 — מנגנון עדכון עצמי: האפליקציה שופכת לעצמה גרסאות
// זרימה: באנר באפליקציה → אישור → UPDATE_apply → גיבוי → שפיכת קבצים →
// גרסה חדשה → עדכון דיפלוי. נכשל שלב? הדיפלוי הקיים ממשיך לשרת את הישן.
// דרוש חד-פעמית: oauthScopes של script.projects + script.deployments
// ב-appsscript.json ואישור הרשאות מחדש (מסך הסכמה פעם אחת).
// ═══════════════════════════════════════════════════════════════
var UPDATE_MANIFEST_URL = 'https://elio-44efba6d.base44.app/functions/ofirAppManifest';

function _verNewer(a, b) {
  var pa = String(a || '').split('.'), pb = String(b || '').split('.');
  for (var i = 0; i < 4; i++) {
    var x = parseInt(pa[i] || '0', 10) || 0, y = parseInt(pb[i] || '0', 10) || 0;
    if (x !== y) return x > y;
  }
  return false;
}

function _updFetch(url, opts) {
  opts = opts || {};
  opts.muteHttpExceptions = true;
  opts.followRedirects = true;
  return UrlFetchApp.fetch(url, opts);
}

function UPDATE_check(token) {
  var g = _gate(token); if (g) return g;
  try {
    var r = _updFetch(UPDATE_MANIFEST_URL + '?t=' + Date.now());
    if (r.getResponseCode() !== 200) return JSON.stringify({ ok: false, error: 'manifest ' + r.getResponseCode() });
    var m = JSON.parse(r.getContentText());
    return JSON.stringify({ ok: true, current: APP_VERSION, available: m.version, newer: _verNewer(m.version, APP_VERSION), notes: m.notes || '' });
  } catch (e) {
    return JSON.stringify({ ok: false, error: String(e) });
  }
}

function UPDATE_apply(token) {
  var g = _gate(token); if (g) return g;
  return _updateApplyCore();
}

// ✅ v12.4.2.0 — דף תוצאה נחמד לעדכון מוואטסאפ (RTL, מובייל)
function _updResultPage(r) {
  var ok = !!r.ok;
  var logHtml = ((r.log) || []).map(function (l) { return '<div style="padding:3px 0;border-bottom:1px solid rgba(128,128,128,.15)">' + String(l).replace(/</g, '&lt;') + '</div>'; }).join('');
  var title = ok ? '✅ הקוד נשפך בהצלחה' : '❌ העדכון נכשל — הגרסה הקודמת ממשיכה לרוץ';
  var verLine = ok ? ('לגרסה <b>v' + String(r.to) + '</b> · גרסת גוגל ' + String(r.versionNumber) + ' · גיבוי ' + String(r.backup)) : String(r.error || '');
  return '<div dir="rtl" style="font-family:Heebo,sans-serif;background:linear-gradient(160deg,#0f1420,#141b2d);min-height:100vh;margin:0;padding:28px 18px;color:#e8ecf4">'
    + '<div style="max-width:520px;margin:0 auto;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:20px;padding:24px;backdrop-filter:blur(14px)">'
    + '<div style="font-size:22px;font-weight:800;margin-bottom:10px">' + title + '</div>'
    + '<div style="font-size:15px;opacity:.92;margin-bottom:16px">' + verLine + '</div>'
    + (logHtml ? '<div style="font-size:12.5px;opacity:.85;line-height:1.55;background:rgba(0,0,0,.25);border-radius:12px;padding:12px">' + logHtml + '</div>' : '')
    + '<div style="margin-top:20px;font-size:15px;font-weight:700;background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;border-radius:14px;padding:14px;text-align:center">'
    + (ok ? '🎉 סגור ופתח מחדש את האפליקציה — והגרסה החדשה תעלה' : 'נסה שוב מאוחר יותר או פנה לחבצלת') + '</div>'
    + '<div style="margin-top:14px;font-size:11px;opacity:.55;text-align:center">v' + APP_VERSION + ' · מנוע עדכון עצמי</div>'
    + '</div></div>';
}

// ✅ v12.4.2.0 — הפקת טוקן עדכון חד-פעמית (הרץ בעורך פעם אחת): UPDATE_setupRemoteToken()
// מייצר UPDATE_REMOTE_TOKEN ב-Script Properties ומדפיס קישור מוכן להעברה לחבצלת בוואטסאפ
function UPDATE_setupRemoteToken() {
  var props = PropertiesService.getScriptProperties();
  var existing = props.getProperty('UPDATE_REMOTE_TOKEN');
  var token = existing || (Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '').substring(0, 8));
  props.setProperty('UPDATE_REMOTE_TOKEN', token);
  var url = ScriptApp.getService().getUrl();
  var link = url + '?upd=' + token;
  Logger.log('════════ טוקן עדכון מרחוק נשמר ב-Script Properties ════════');
  Logger.log('קישור העדכון המוכן (העבר לחבצלת בוואטסאפ בדיוק כמו שהוא):');
  Logger.log(link);
  return link;
}

// ═══ ✅ v13.0.0.8: מוניטור גרסאות — אזהרה בלבד ═══
// מחיקת גרסאות מרחוק אינה אפשרית: ל-API הציבורי של Apps Script אין versions.delete (נבדק מול ה-discovery doc).
// הניקוי נעשה ידנית בממשק (היסטוריית פרויקט). כאן רק נצפה ונזהיר בלוג כשמתקרבים למגבלת 200.
function _pruneOldVersions(base, auth, log) {
  try {
    var all = [], pageToken = '';
    do {
      var u = base + '/versions?pageSize=100' + (pageToken ? '&pageToken=' + encodeURIComponent(pageToken) : '');
      var r = _updFetch(u, { headers: auth });
      if (r.getResponseCode() !== 200) { return; }
      var d = JSON.parse(r.getContentText());
      (d.versions || []).forEach(function (v) { all.push(Number(v.versionNumber)); });
      pageToken = d.nextPageToken || '';
    } while (pageToken);
    log.push('גרסאות בפרויקט: ' + all.length);
    if (all.length > 190) log.push('⚠️ מתקרבים למגבלת 200 — נקה גרסאות ישנות בהיסטוריית הפרויקט');
  } catch (e) { /* מוניטור בלבד — לא חוסם עדכון */ }
}

function _updateApplyCore() {
  var log = [];
  try {
    var mr = _updFetch(UPDATE_MANIFEST_URL + '?t=' + Date.now());
    if (mr.getResponseCode() !== 200) throw new Error('טעינת מניפסט נכשלה ' + mr.getResponseCode());
    var m = JSON.parse(mr.getContentText());
    var types = { 'Code.gs': 'SERVER_JS', 'INDEX.html': 'HTML' };
    var content = {}, bytes = 0;
    (m.files || []).forEach(function (f) {
      if (!types[f.name]) return;
      var r = _updFetch(f.url);
      if (r.getResponseCode() !== 200) throw new Error('הורדת ' + f.name + ' נכשלה ' + r.getResponseCode());
      content[f.name] = r.getContentText();
      bytes += content[f.name].length;
    });
    if (!content['Code.gs'] || !content['INDEX.html']) throw new Error('לא התקבלו שני הקבצים מהמניפסט');
    log.push('הורדו 2 קבצים (' + Math.round(bytes / 1024) + 'KB)');

    var scriptId = ScriptApp.getScriptId();
    var auth = { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() };
    var base = 'https://script.googleapis.com/v1/projects/' + scriptId;

    // 1) קריאת ה-HEAD הנוכחי
    var cur = _updFetch(base + '/content', { headers: auth });
    if (cur.getResponseCode() !== 200) throw new Error('קריאת הפרויקט נכשלה ' + cur.getResponseCode() + ' — חסר scope script.projects? אשר הרשאות מחדש. ' + cur.getContentText().substring(0, 200));
    var project = JSON.parse(cur.getContentText());
    var files = (project.files || []);
    log.push('HEAD נוכחי: ' + files.length + ' קבצים');

    // ✅ v13.0.0.8: מוניטור מספר הגרסאות — אזהרה בלוג כשמתקרבים למגבלת 200 של גוגל
    _pruneOldVersions(base, auth, log);

    // 2) גיבוי — גרסה קפואה של הקוד הנוכחי לפני השפיכה
    var bk = _updFetch(base + '/versions', {
      method: 'post', contentType: 'application/json', headers: auth,
      payload: JSON.stringify({ description: 'גיבוי אוטומטי לפני ' + m.version })
    });
    if (bk.getResponseCode() !== 200) throw new Error('יצירת גיבוי נכשלה ' + bk.getResponseCode() + ' — חסר scope? ' + bk.getContentText().substring(0, 150));
    var backupNum = (JSON.parse(bk.getContentText()) || {}).versionNumber;
    log.push('גיבוי: גרסה ' + backupNum);

    // ⚒️ 3) מיזוג לפי תוכן ושם מנורמל — GAS מאחסן קבצי-שרת בלי סיומת .gs
    // (ב-12.4.1.2 מיזוג לפי השם המדויק "Code.gs" יצר כפילות Code.gs.gs ושגיאת SS כפולה)
    function _norm(n) { return String(n || '').toLowerCase().replace(/\.gs$/, ''); }

    // 3א) קובץ הקוד: זהה לפי תוכן (APP_VERSION ייחודי לקוד שלנו), אחר כך לפי שם
    var codeIdx = -1;
    for (var i = 0; i < files.length; i++) {
      if (files[i].type === 'SERVER_JS' && /APP_VERSION\s*=/.test(String(files[i].source || ''))) { codeIdx = i; break; }
    }
    if (codeIdx === -1) {
      for (var j = 0; j < files.length; j++) {
        if (files[j].type === 'SERVER_JS' && _norm(files[j].name) === 'code') { codeIdx = j; break; }
      }
    }
    if (content['Code.gs']) {
      if (codeIdx === -1) { files.push({ name: 'Code', type: 'SERVER_JS', source: content['Code.gs'] }); log.push('נוצר קובץ Code חדש (לא נמצא קובץ קוד קיים)'); }
      else { files[codeIdx].source = content['Code.gs']; files[codeIdx].type = 'SERVER_JS'; log.push('הקוד עודכן בקובץ "' + files[codeIdx].name + '"'); }
    }

    // 3ב) קובץ ה-HTML: זהה לפי תוכן ואחר כך לפי שם
    var htmlIdx = -1;
    for (var i2 = 0; i2 < files.length; i2++) {
      if (files[i2].type === 'HTML' && /aiSheet|safeRender|renderOverview/.test(String(files[i2].source || ''))) { htmlIdx = i2; break; }
    }
    if (htmlIdx === -1) {
      for (var j2 = 0; j2 < files.length; j2++) {
        if (files[j2].type === 'HTML' && _norm(files[j2].name) === 'index') { htmlIdx = j2; break; }
      }
    }
    if (content['INDEX.html']) {
      if (htmlIdx === -1) { files.push({ name: 'INDEX.html', type: 'HTML', source: content['INDEX.html'] }); log.push('נוצר קובץ INDEX.html חדש'); }
      else { files[htmlIdx].source = content['INDEX.html']; files[htmlIdx].type = 'HTML'; log.push('ה-HTML עודכן בקובץ "' + files[htmlIdx].name + '"'); }
    }

    // 3ג) ניקוי כפילויות אוטומטי: עותקים נוספים של הקוד/ה-HTML נמחקים מה-HEAD
    var keptNames = [];
    files = files.filter(function (f, idx) {
      if (idx !== codeIdx && idx !== htmlIdx) {
        if (f.type === 'SERVER_JS' && /APP_VERSION\s*=/.test(String(f.source || ''))) { log.push('🧹 נמחקה כפילות קוד: "' + f.name + '"'); return false; }
        if (f.type === 'HTML' && /aiSheet|safeRender|renderOverview/.test(String(f.source || ''))) { log.push('🧹 נמחקה כפילות HTML: "' + f.name + '"'); return false; }
      }
      keptNames.push(f.name);
      return true;
    });
    log.push('HEAD לפני שפיכה: ' + keptNames.join(', '));
    // ⚒️ ודא שהמניפסט (appsscript.json) קיים עם source — בלעדיו updateContent
    // מוחק אותו מה-HEAD ואז עדכון הדיפלוי נופל ב"Manifest file not found"
    var _DEFAULT_MANIFEST = JSON.stringify({
      timeZone: 'Asia/Jerusalem',
      dependencies: {},
      exceptionLogging: 'CLOUD',
      runtimeVersion: 'V8',
      oauthScopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/script.external_request',
        'https://www.googleapis.com/auth/script.scriptapp',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/script.send_mail',
        'https://www.googleapis.com/auth/script.projects',
        'https://www.googleapis.com/auth/script.deployments'
      ]
    }, null, 2);
    var mIdx = -1;
    for (var mi = 0; mi < files.length; mi++) {
      if (files[mi].name === 'appsscript.json' || files[mi].type === 'JSON') { mIdx = mi; break; }
    }
    if (mIdx === -1) {
      files.push({ name: 'appsscript.json', type: 'JSON', source: _DEFAULT_MANIFEST });
      log.push('⚠️ manifest חסר ב-HEAD — הוזרק מניפסט ברירת מחדל (ידרוש אישור הרשאות בפעם הבאה)');
    } else if (!files[mIdx].source || !String(files[mIdx].source).replace(/[\s\n]/g, '')) {
      files[mIdx].source = _DEFAULT_MANIFEST;
      log.push('⚠️ manifest הגיע ללא source — הוזרק ברירת מחדל');
    } else {
      log.push('manifest ✓ (' + String(files[mIdx].source).length + ' בתים)');
    }

    var payloadFiles = files.map(function (f) { return { name: f.name, type: f.type, source: f.source }; });

    // 4) שפיכה ל-HEAD
    var up = _updFetch(base + '/content', {
      method: 'put', contentType: 'application/json', headers: auth,
      payload: JSON.stringify({ files: payloadFiles })
    });
    if (up.getResponseCode() !== 200) throw new Error('שפיכת קוד נכשלה ' + up.getResponseCode() + ': ' + up.getContentText().substring(0, 300));
    log.push('הקוד נשפך ל-HEAD');

    // אימות: קריאה חוזרת של ה-HEAD — האם המניפסט שרד את השפיכה?
    var chk = _updFetch(base + '/content', { headers: auth });
    if (chk.getResponseCode() === 200) {
      var cf = JSON.parse(chk.getContentText()).files || [];
      var hasM = cf.some(function (f2) { return f2.type === 'JSON' || f2.name === 'appsscript' || f2.name === 'appsscript.json'; });
      log.push('HEAD לאחר שפיכה: ' + cf.length + ' קבצים · manifest ' + (hasM ? '✓' : '✗ ✗ ✗'));
    }

    // 5) גרסה חדשה
    var vn = _updFetch(base + '/versions', {
      method: 'post', contentType: 'application/json', headers: auth,
      payload: JSON.stringify({ description: 'v' + m.version + ' (אוטומטי)' })
    });
    if (vn.getResponseCode() !== 200) throw new Error('יצירת גרסה נכשלה ' + vn.getResponseCode());
    var newNum = (JSON.parse(vn.getContentText()) || {}).versionNumber;
    log.push('גרסה חדשה: ' + newNum);

    // 6) איתור דיפלוי ה-WebApp והפנייתו לגרסה החדשה
    var dl = _updFetch(base + '/deployments', { headers: auth });
    if (dl.getResponseCode() !== 200) throw new Error('קריאת דיפלוים נכשלה ' + dl.getResponseCode() + ' — חסר scope script.deployments?');
    var deps = (JSON.parse(dl.getContentText()).deployments) || [];
    var target = null;
    deps.forEach(function (d) {
      var web = (d.entryPoints || []).some(function (e) { return e.entryPointType === 'WEB_APP'; });
      if (web && (!target || String(d.updateTime || '') > String(target.updateTime || ''))) target = d;
    });
    if (!target) throw new Error('לא נמצא דיפלוי WebApp בפרויקט');
    var du = _updFetch(base + '/deployments/' + target.deploymentId, {
      method: 'put', contentType: 'application/json', headers: auth,
      payload: JSON.stringify({ deploymentConfig: { scriptId: scriptId, versionNumber: newNum, description: 'v' + m.version } })
    });
    if (du.getResponseCode() !== 200) throw new Error('עדכון דיפלוי נכשל ' + du.getResponseCode() + ': ' + du.getContentText().substring(0, 300));
    log.push('דיפלוי → גרסה ' + newNum);

    return JSON.stringify({ ok: true, from: APP_VERSION, to: m.version, versionNumber: newNum, backup: backupNum, log: log });
  } catch (e) {
    return JSON.stringify({ ok: false, error: String((e && e.message) || e), log: log });
  }
}

// ✅ שחזור לגרסת גיבוי (במקרה חירום): UPDATE_rollback(token, מספר גרסה)
function UPDATE_rollback(token, versionNumber) {
  var g = _gate(token); if (g) return g;
  try {
    var scriptId = ScriptApp.getScriptId();
    var auth = { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() };
    var base = 'https://script.googleapis.com/v1/projects/' + scriptId;
    var vr = _updFetch(base + '/versions/' + Number(versionNumber) + '/content', { headers: auth });
    if (vr.getResponseCode() !== 200) return JSON.stringify({ ok: false, error: 'קריאת גרסת הגיבוי נכשלה ' + vr.getResponseCode() });
    var files = (JSON.parse(vr.getContentText()).files || []).map(function (f) { return { name: f.name, type: f.type, source: f.source }; });
    var up = _updFetch(base + '/content', { method: 'put', contentType: 'application/json', headers: auth, payload: JSON.stringify({ files: files }) });
    if (up.getResponseCode() !== 200) return JSON.stringify({ ok: false, error: 'שחזור נכשל ' + up.getResponseCode() });
    var vn = _updFetch(base + '/versions', { method: 'post', contentType: 'application/json', headers: auth, payload: JSON.stringify({ description: 'שחזור לגרסה ' + versionNumber }) });
    var newNum = (JSON.parse(vn.getContentText()) || {}).versionNumber;
    return JSON.stringify({ ok: true, restoredFrom: versionNumber, versionNumber: newNum, note: 'שחזור ל-HEAD הושלם — הפנה דיפלוי ידנית או הרץ UPDATE_apply שוב' });
  } catch (e) {
    return JSON.stringify({ ok: false, error: String(e) });
  }
}

// ✅ אבחון מהעורך (בלי טוקן): UPDATE_checkSelf()
function UPDATE_checkSelf() {
  Logger.log('═══════ אבחון עדכון עצמי · גרסה מותקנת: ' + APP_VERSION + ' ═══════');
  try {
    var r = _updFetch(UPDATE_MANIFEST_URL + '?t=' + Date.now());
    Logger.log('מניפסט HTTP ' + r.getResponseCode());
    var m = JSON.parse(r.getContentText());
    Logger.log('זמין: ' + m.version + (m.notes ? ' · ' + m.notes : ''));
    Logger.log('מצב: ' + (_verNewer(m.version, APP_VERSION) ? '🟢 יש עדכון חדש יותר!' : '✅ מעודכן'));
    m.files.forEach(function (f) {
      var fr = _updFetch(f.url);
      Logger.log('  ' + f.name + ' → HTTP ' + fr.getResponseCode() + ' (' + Math.round(fr.getContentText().length / 1024) + 'KB)');
    });
  } catch (e) { Logger.log('שגיאה: ' + e); }
  Logger.log('הרצה של UPDATE_applySelf() תבצע שפיכה מלאה + דיפלוי');
}

// ✅ שפיכה מהעורך (בלי טוקן): UPDATE_applySelf()
function UPDATE_applySelf() {
  Logger.log(_updateApplyCore());
}

function PEN_checkData() {
  var p = _pensionPayload();
  Logger.log('═══════ פנסיה v12.4.0.0 · נכון ל-' + p.asOf + ' ═══════');
  Logger.log('אופיר: יתרה ₪' + p.ofir.pension.balance + ' | קצבה צפויה ₪' + p.ofir.pension.monthlyPension + ' | מוות (חיים) ₪' + p.ofir.life[0].deathBenefit);
  Logger.log('רויטל: ' + p.revital.pension.status);
  Logger.log('אורי: בריאות פרטית מלאה · פוליסה ' + p.uri.health.num);
  Logger.log('התראות: ' + p.alerts.length + ' | בצינור: ' + p.pending.length);
}

// ═══ ✅ v12.2.0.9: יצירת סשן דמו — רק למנהל, מקדם קבוע (לא אקראי): מציג 12.83% מהערך האמיתי ═══
// לשינוי אחוז התצוגה: שנה רק את DEMO_SHOW_PCT (ערך יחיד, שאר הקוד מחשב לבד).
var DEMO_SHOW_PCT = 12.83; // המצב דמו מציג 12.83% מכל סכום אמיתי — קבוע, לא מתחלף בין סשנים
function createDemoSession(token) {
  var g = _gate(token); if (g) return g;
  if (!_isRealAdmin(token)) {
    Logger.log('🚫 יצירת סשן דמו נדחתה — סשן לא מנהלי');
    return JSON.stringify({ error: 'unauthorized' });
  }
  var factor = Math.round(DEMO_SHOW_PCT / 100 * 10000) / 10000; // 12.83% → 0.1283
  var demoToken = 'demo-' + Utilities.getUuid();
  _addSession(demoToken, { scope: 'demo', admin: false, factor: factor });
  Logger.log('🎭 סשן דמו נוצר — תצוגה קבועה של ' + DEMO_SHOW_PCT + '% מכל סכום');
  return JSON.stringify({ success: true, demoToken: demoToken });
}

// ═══ ✅ v11.7.1.0: אבחון קוד מנהל — הרץ מהעורך וקרא את היומן (Ctrl+Enter) ═══
function DEMO_checkAdminPin() {
  var props = PropertiesService.getScriptProperties();
  var hash3010 = _hashPassword('3010');
  var baked = 'ff4b467b7a593047c46682ecdbf6da36b3f3bb4b50d35f08f17f751ef5f15531';
  var override = props.getProperty('DEMO_ADMIN_PIN_HASH');
  var fails = CacheService.getScriptCache().get('pin_fails');
  Logger.log('═══════ אבחון קוד מנהל ═══════');
  Logger.log('1. APP_VERSION בקובץ: ' + APP_VERSION);
  Logger.log('2. האש של 3010: ' + hash3010);
  Logger.log('3. תואם להאש האפוי בקוד: ' + (hash3010 === baked ? 'כן ✓' : 'לא ✗ (?!'));
  Logger.log('4. דריסה ידנית DEMO_ADMIN_PIN_HASH: ' + (override ? 'כן — קוד מנהל אחר פעיל!' : 'לא — 3010 פעיל'));
  Logger.log('5. ניסיונות כושלים (pin_fails): ' + (fails || '0') + (parseInt(fails || '0', 10) >= 5 ? ' — ⚠️ נעילה זמנית פעילה, המתן 5 דקות!' : ''));
  Logger.log('═══════ סוף אבחון ═══════');
  return 'הרץ מהעורך — התוצאות ביומן הביצוע (Execution log)';
}

// ═══ ✅ v11.7.0.0: קוד מנהל — PIN נפרד שמזהה את Ofir ומאפשר כפתור דמו ═══
// יש להריץ פעם אחת מהעורך: DEMO_setupAdminPin('קוד-מנהל')
function DEMO_setupAdminPin(pin) {
  if (!pin || String(pin).length < 4) return JSON.stringify({ error: 'הקוד חייב להיות לפחות 4 תווים' });
  PropertiesService.getScriptProperties().setProperty('DEMO_ADMIN_PIN_HASH', _hashPassword(pin));
  Logger.log('✅ קוד מנהל (דמו) הוגדר');
  var token = Utilities.getUuid();
  _addSession(token, { scope: 'real', admin: true });
  return JSON.stringify({ success: true, token: token, admin: true });
}

// ── writeIBKRFromAPI — כותב פוזיציות לגיליון (עם batch writes) ──
function writeIBKRFromAPI(positions, cashUSD, usdIls) {
  const sheet    = SS.getSheetByName('IBKR');
  const costs    = getPurchaseCosts();
  const usdToday = usdIls || getCurrentUSDILS();

  const headers = ['סימבול','שם','סוג','מטבע','כמות','מחיר קנייה ($)','תאריך קנייה','USD/ILS בקנייה','עלות מקורית (₪)','מחיר נוכחי ($)','USD/ILS היום','שווי נוכחי (₪)','תשואה (₪)','תשואה (%)','% מהתיק'];
  sheet.getRange(9, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#2E3A50').setFontColor('#FFFFFF').setHorizontalAlignment('center');
  if (sheet.getLastRow() > 9) sheet.getRange(10, 1, sheet.getLastRow() - 9, headers.length).clearContent();

  let results = [], allRows = [], row = 10, mismatchWarnings = [];

  positions.forEach(pos => {
    const sym      = String(pos.contract_description || '').trim().toUpperCase();
    const qty      = parseFloat(pos.position)     || 0;
    const curP     = parseFloat(pos.market_price)  || 0;
    const ccy      = String(pos.currency           || 'USD');
    const assetC   = String(pos.asset_class        || 'STK');
    const assetHeb = assetC === 'STK' ? 'מניה' : assetC === 'BOND' ? 'אג"ח' : assetC === 'CASH' ? 'מזומן' : assetC;
    const cd          = costs[sym] || {};
    const buyPrice    = cd.buyPrice  || parseFloat(pos.average_price) || 0;
    const buyDate     = cd.buyDate   || 'לא הוזן';
    const usdBuy      = cd.usdIlsBuy || usdToday;
    const boughtQty   = cd.qty       || qty;
    const name        = cd.name || sym;  // ✅ תיקון: שם נייר אמיתי

    if (cd.qty && Math.abs(cd.qty - qty) > 0.001) {
      mismatchWarnings.push(sym + ': "עלויות קנייה" מציין ' + cd.qty + ' יח\' אך ב-IBKR יש ' + qty + ' יח\'');
    }

    const costPerUnit = (boughtQty > 0 && cd.costILS) ? cd.costILS / boughtQty : buyPrice * usdBuy;
    const costILS  = costPerUnit * qty;
    const valueILS = qty * curP * usdToday;
    const retILS   = costILS > 0 ? valueILS - costILS : 0;
    const retPct   = costILS > 0 ? retILS / costILS   : 0;

    // ✅ אסוף למערך במקום כתיבה שורה-אחר-שורה
    allRows.push([sym, name, assetHeb, ccy, qty, buyPrice, buyDate, usdBuy, costILS, curP, usdToday, valueILS, retILS, retPct, 0]);

    results.push({ sym, assetHeb, qty, buyPrice, buyDate, usdIlsBuy: usdBuy, costILS, curP, usdToday, valueILS, retILS, retPct, isCash: false });
    row++;
  });

  // ✅ כתיבת batch — כל השורות במכה אחת
  if (allRows.length > 0) {
    sheet.getRange(10, 1, allRows.length, 15).setValues(allRows);
    // עיצוב batch לכל השורות
    for (let i = 0; i < allRows.length; i++) {
      applyRowFormat(sheet, 10 + i, allRows[i][12]);
    }
  }

  if (cashUSD && Math.abs(cashUSD) > 0.01) {
    const valueILS = cashUSD * usdToday;
    sheet.getRange(row, 1, 1, 15).setValues([['CASH-USD','מזומן USD','מזומן','USD',cashUSD,1,'-',usdToday,valueILS,1,usdToday,valueILS,0,0,0]]);
    applyRowFormat(sheet, row, 0);
    results.push({ sym: 'CASH-USD', assetHeb: 'מזומן', qty: cashUSD, buyPrice: 1, buyDate: '-', usdIlsBuy: usdToday, costILS: valueILS, curP: 1, usdToday, valueILS, retILS: 0, retPct: 0, isCash: true });
    row++;
  }

  const totalVal = results.reduce((s, r) => s + r.valueILS, 0);
  results.forEach((r, i) => {
    const w = totalVal > 0 ? r.valueILS / totalVal : 0;
    sheet.getRange(10 + i, 15).setValue(w).setNumberFormat('0.00%');
    results[i].weight = w;
  });

  const bg = '#2E3A50', nonCash = results.filter(r => !r.isCash);
  const totCost = nonCash.reduce((s, r) => s + r.costILS, 0);
  const totVal2 = results.reduce((s, r) => s + r.valueILS, 0);
  const totRet  = nonCash.reduce((s, r) => s + r.retILS, 0);
  const totPct  = totCost > 0 ? totRet / totCost : 0;
  sheet.getRange(row, 1).setValue('סה"כ').setFontWeight('bold').setBackground(bg).setFontColor('#FFFFFF');
  [[9,totCost,'#FFFFFF'],[12,totVal2,'#2ECC71'],[13,totRet,totRet>=0?'#2ECC71':'#E74C3C'],[14,totPct,totRet>=0?'#2ECC71':'#E74C3C']].forEach(([c,v,color]) => {
    sheet.getRange(row, c).setValue(v).setFontWeight('bold').setFontColor(color).setBackground(bg).setNumberFormat(c === 14 ? '0.00%' : '#,##0.00 ₪');
  });
  for (let c = 1; c <= 15; c++) sheet.getRange(row, c).setBackground(bg);
  sheet.getRange('B7').setValue(new Date());

  if (mismatchWarnings.length > 0) {
    Logger.log('⚠️ אי-התאמות כמות: ' + mismatchWarnings.join(' | '));
    try { sendTelegram('⚠️ <b>נמצאו אי-התאמות כמות בעלויות קנייה</b>\n\n' + mismatchWarnings.join('\n') + '\n\nכדאי לבדוק את גיליון "עלויות קנייה".'); } catch (e) {}
  }

  Logger.log('writeIBKRFromAPI הושלם: ' + results.length + ' שורות (batch write)');
  return results;
}
// ── רענון "שקט" ──
function _refreshPricesCore() {
  try {
    // ✅ v12.0.0.0: שומר רענון — אם רועננו לפני פחות מ-10 דקות, דלג (לחיצות כפולות על "רענן" מקבלות מענה מיידי)
    var props = PropertiesService.getScriptProperties();
    var lastRef = parseFloat(props.getProperty('PRICE_REFRESH_AT') || '0');
    var tenMin = 10 * 60 * 1000;
    if (lastRef && (Date.now() - lastRef) < tenMin) {
      Logger.log('⏭️ ריענון נדלג — בוצע לפני פחות מ-10 דקות');
      return 'skipped-recent';
    }
    props.setProperty('PRICE_REFRESH_AT', String(Date.now()));
    updateExchangeRates();
    const usdIls = getCurrentUSDILS();
    refreshIBKRPricesFromYahoo(usdIls);
    refreshFAIRPricesFromTASE();
    Logger.log('silentPriceRefresh הושלם | USD/ILS=' + usdIls);
    // ✅ v11.6.4.0: איפוס המטמון — הקריאה הבאה לנתוני התיק תראה את המחירים החדשים
    try { CacheService.getScriptCache().remove('PDATA_JSON'); } catch (e) {}
  } catch (e) {
    Logger.log('silentPriceRefresh שגיאה: ' + e);
  }
}

// רענון מהלקוח — דורש סשן תקף (אם מוגדר PIN). טריגרים קוראים ל-_refreshPricesCore ישירות.
function silentPriceRefresh(token) {
  var g = _gate(token); if (g) return g;
  return _refreshPricesCore();
}
// ── refreshIBKRPricesFromYahoo (עם batch writes) ──
function refreshIBKRPricesFromYahoo(usdIls) {
  const sheet = SS.getSheetByName('IBKR');
  const lastRow = sheet.getLastRow();
  if (lastRow < 10) return;
  usdIls = usdIls || getCurrentUSDILS();
  const rows = sheet.getRange(10, 1, lastRow - 9, 15).getValues();

  // ✅ אסוף עדכונים לbatch
  const updates = [];

  rows.forEach((row, i) => {
    const sym  = String(row[0]).trim().toUpperCase();
    const type = String(row[2]).trim();
    if (!sym || sym === 'סה"כ' || type === 'מזומן') {
      if (type === 'מזומן') {
        const qty = parseFloat(row[4]) || 0;
        updates.push({ rowIdx: 10 + i, col: 11, val: usdIls, fmt: '#,##0.0000' });
        updates.push({ rowIdx: 10 + i, col: 12, val: qty * usdIls, fmt: '#,##0.00 ₪' });
      }
      return;
    }
    const qty = parseFloat(row[4]) || 0, costILS = parseFloat(row[8]) || 0;
    if (qty === 0) return;
    const curP = fetchYahooPriceWithRetry(sym);  // ✅ retry logic
    if (!curP || curP <= 0) { Logger.log('לא הצלחתי לקבל מחיר עבור ' + sym); return; }
    const valueILS = qty * curP * usdIls;
    const retILS   = costILS > 0 ? valueILS - costILS : 0;
    const retPct   = costILS > 0 ? retILS / costILS   : 0;
    const r = 10 + i;

    updates.push({ rowIdx: r, col: 10, val: curP, fmt: '#,##0.00' });
    updates.push({ rowIdx: r, col: 11, val: usdIls, fmt: '#,##0.0000' });
    updates.push({ rowIdx: r, col: 12, val: valueILS, fmt: '#,##0.00 ₪' });
    updates.push({ rowIdx: r, col: 13, val: retILS, fmt: '#,##0.00 ₪', color: retILS >= 0 ? '#2ECC71' : '#E74C3C' });
    updates.push({ rowIdx: r, col: 14, val: retPct, fmt: '0.00%', color: retPct >= 0 ? '#2ECC71' : '#E74C3C' });

    Logger.log(sym + ': $' + curP + ' | ₪' + Math.round(valueILS));
    Utilities.sleep(200);
  });

  // ✅ Batch: כתוב את כל העדכונים
  updates.forEach(u => {
    const cell = sheet.getRange(u.rowIdx, u.col);
    cell.setValue(u.val).setNumberFormat(u.fmt);
    if (u.color) cell.setFontColor(u.color);
  });

  updateIBKRSummaryRow(usdIls);
  sheet.getRange('B7').setValue(new Date());
  Logger.log('refreshIBKRPricesFromYahoo הושלם | USD/ILS=' + usdIls + ' | ' + updates.length + ' עדכונים');
}

// ✅ חדש: fetchYahooPrice עם retry
// ── ✅ v11: Yahoo Finance — headers + גיבוי לשרת משני (query1 → query2) ──
var _YAHOO_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'application/json,text/plain,*/*'
};

function _yahooFetch(path) {
  var hosts = ['https://query1.finance.yahoo.com', 'https://query2.finance.yahoo.com'];
  for (var i = 0; i < hosts.length; i++) {
    try {
      var res = UrlFetchApp.fetch(hosts[i] + path, { muteHttpExceptions: true, headers: _YAHOO_HEADERS });
      if (res.getResponseCode() === 200) return res.getContentText();
    } catch (e) {}
  }
  return null;
}

function fetchYahooPriceWithRetry(symbol, maxRetries) {
  maxRetries = maxRetries || 2;
  for (let i = 0; i <= maxRetries; i++) {
    const price = fetchYahooPrice(symbol);
    if (price && price > 0) return price;
    if (i < maxRetries) {
      Logger.log('Retry ' + (i + 1) + ' עבור ' + symbol);
      Utilities.sleep(1000 * (i + 1));  // backoff
    }
  }
  return 0;
}

function fetchYahooPrice(symbol) {
  try {
    var text = _yahooFetch('/v8/finance/chart/' + encodeURIComponent(symbol) + '?interval=1d&range=1d');
    if (!text) return 0;
    const meta = JSON.parse(text).chart.result[0].meta;
    return meta.regularMarketPrice || meta.previousClose || 0;
  } catch (e) { Logger.log('Yahoo שגיאה עבור ' + symbol + ': ' + e); return 0; }
}

function updateIBKRSummaryRow(usdIls) {
  const sheet = SS.getSheetByName('IBKR');
  const lastRow = sheet.getLastRow();
  if (lastRow < 10) return;
  const rows = sheet.getRange(10, 1, lastRow - 9, 15).getValues();
  let totCost = 0, totVal = 0, totRet = 0, summaryRow = -1;
  rows.forEach((row, i) => {
    const sym = String(row[0]).trim(), type = String(row[2]).trim();
    if (sym === 'סה"כ') { summaryRow = 10 + i; return; }
    if (!sym) return;
    if (type !== 'מזומן') { totCost += parseFloat(row[8]) || 0; totRet += parseFloat(row[12]) || 0; }
    totVal += parseFloat(row[11]) || 0;
  });
  if (summaryRow < 0) return;
  const totPct = totCost > 0 ? totRet / totCost : 0, bg = '#2E3A50';
  [[9,totCost,'#FFFFFF'],[12,totVal,'#2ECC71'],[13,totRet,totRet>=0?'#2ECC71':'#E74C3C'],[14,totPct,totRet>=0?'#2ECC71':'#E74C3C']].forEach(([c,v,color]) => {
    sheet.getRange(summaryRow, c).setValue(v).setFontWeight('bold').setFontColor(color).setBackground(bg).setNumberFormat(c === 14 ? '0.00%' : '#,##0.00 ₪');
  });
  rows.forEach((row, i) => {
    const sym = String(row[0]).trim();
    if (!sym || sym === 'סה"כ') return;
    sheet.getRange(10 + i, 15).setValue(totVal > 0 ? (parseFloat(row[11]) || 0) / totVal : 0).setNumberFormat('0.00%');
  });
}
// ── refreshFAIRPricesFromTASE ──
function refreshFAIRPricesFromTASE() {
  const sheet = SS.getSheetByName('FAIR');
  const lastRow = sheet.getLastRow();
  if (lastRow < 7) return;
  const rows = sheet.getRange(7, 1, lastRow - 6, 6).getValues();
  let failCount = 0;

  rows.forEach((row, i) => {
    const name     = String(row[0]).trim();
    const taseNum  = String(row[1]).trim();
    const qty      = parseFloat(row[4]) || 0;
    const avgPrice = parseFloat(row[5]) || 0;
    const sheetRow = 7 + i;
    if (!name || name === 'מזומן' || !taseNum || qty === 0) return;

    const curPrice = fetchTASEPrice(taseNum);
    if (curPrice <= 0) { Logger.log('אין מחיר עבור ' + name + ' (' + taseNum + ')'); failCount++; return; }

    const costTotal  = qty * avgPrice;
    const valueTotal = qty * curPrice;
    const gainILS    = costTotal > 0 ? valueTotal - costTotal : 0;
    const gainPct    = costTotal > 0 ? gainILS / costTotal    : 0;

    sheet.getRange(sheetRow, 3).setValue(curPrice).setNumberFormat('#,##0.0000');
    sheet.getRange(sheetRow, 7).setValue(valueTotal).setNumberFormat('#,##0.00 ₪');
    sheet.getRange(sheetRow, 8).setValue(gainILS).setNumberFormat('#,##0.00 ₪').setFontColor(gainILS >= 0 ? '#2ECC71' : '#E74C3C');
    sheet.getRange(sheetRow, 9).setValue(gainPct).setNumberFormat('0.00%').setFontColor(gainPct >= 0 ? '#2ECC71' : '#E74C3C');

    Logger.log('FAIR | ' + name + ': ₪' + curPrice.toFixed(4) + ' × ' + qty + ' = ₪' + Math.round(valueTotal));
    Utilities.sleep(300);
  });

  if (failCount >= 3) {
    try { sendTelegram('⚠️ <b>שליפת מחירי FAIR נכשלה עבור ' + failCount + ' ניירות</b>\nייתכן שמבנה אתר Sponser השתנה — כדאי לבדוק את fetchTASEPrice.'); } catch (e) {}
  }

  sheet.getRange('E4').setValue(new Date()).setNumberFormat('dd/MM/yyyy HH:mm');
  Logger.log('refreshFAIRPricesFromTASE הושלם');
}

function fetchTASEPrice(securityNumber) {
  // ✅ v11.1: Sponser ראשי + גיבוי Bizportal לקרנות שלא קיימות/נכשלות ב-Sponser
  const price = _fetchSponserPrice(securityNumber);
  if (price > 0) return price;
  return _fetchBizportalPrice(securityNumber);
}

function _fetchSponserPrice(securityNumber) {
  try {
    const res = UrlFetchApp.fetch('https://finance.sponser.co.il/finance/table/?s=' + securityNumber, {
      muteHttpExceptions: true,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GAS/1.0)' }
    });
    if (res.getResponseCode() !== 200) { Logger.log('Sponser HTTP ' + res.getResponseCode() + ' עבור ' + securityNumber); return 0; }
    const match = res.getContentText().match(/id="header-quote"[^>]*>\s*([\d,\.]+)\s*<span/);
    if (match && match[1]) {
      const shekel = parseFloat(match[1].replace(/,/g, '')) / 100;
      Logger.log('Sponser ' + securityNumber + ': ₪' + shekel.toFixed(4));
      return shekel;
    }
    Logger.log('Sponser: לא נמצא מחיר עבור ' + securityNumber);
    return 0;
  } catch (e) { Logger.log('Sponser שגיאה ' + securityNumber + ': ' + e); return 0; }
}

// ✅ v11.1: מקור גיבוי — מחיר פדיון מ-Bizportal (באגורות, מחולק ב-100 כמו Sponser)
function _fetchBizportalPrice(securityNumber) {
  try {
    const res = UrlFetchApp.fetch('https://www.bizportal.co.il/mutualfunds/quote/profile/' + securityNumber, {
      muteHttpExceptions: true,
      followRedirects: true,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36' }
    });
    if (res.getResponseCode() !== 200) { Logger.log('Bizportal HTTP ' + res.getResponseCode() + ' עבור ' + securityNumber); return 0; }
    const match = res.getContentText().match(/מחיר פדיון<\/div><div class="num">([\d,\.]+)/);
    if (match && match[1]) {
      const shekel = parseFloat(match[1].replace(/,/g, '')) / 100;
      Logger.log('Bizportal (גיבוי) ' + securityNumber + ': ₪' + shekel.toFixed(4));
      return shekel;
    }
    Logger.log('Bizportal: לא נמצא מחיר עבור ' + securityNumber);
    return 0;
  } catch (e) { Logger.log('Bizportal שגיאה ' + securityNumber + ': ' + e); return 0; }
}
// ── הגדרות (עם cache) ──
function getSettings() {
  // ✅ Cache — טען פעם אחת לכל הרצה
  if (_settingsCache) return _settingsCache;

  const s = SS.getSheetByName('הגדרות');
  const props = PropertiesService.getScriptProperties();

  // ✅ v11.6.3.0: batch-read — קריאה אחת במקום 5 בודדות
  var g = s.getRange('A1:C20').getValues();
  _settingsCache = {
    // ✅ טוקן מScript Properties, fallback לגיליון
    tgToken  : props.getProperty('TG_TOKEN') || String(g[11][1]), // B12
    tgChatId : String(g[12][1]),                                    // B13
    alertDown: g[18][1] || 0.03,                                     // B19
    alertUp  : g[19][1] || 0.05,                                     // B20
    usdIls   : g[4][2]  || 3.7,                                      // C5
  };
  return _settingsCache;
}
// ── עלויות קנייה (✅ v8: מיפוי עמודות קבוע — פשוט ויציב) ──

// עוזר: מוצא גיליון לפי כמה שמות אפשריים
function _findSheetByNames(names) {
  for (var i = 0; i < names.length; i++) {
    var s = SS.getSheetByName(names[i]);
    if (s) return s;
  }
  // ניסיון אחרון: כל גיליון ששמו מכיל "עלויות" ו"מעדכן"/"מעודכן"
  var all = SS.getSheets();
  for (var j = 0; j < all.length; j++) {
    var name = all[j].getName();
    if (name.indexOf('עלויות') >= 0 && (name.indexOf('מעדכן') >= 0 || name.indexOf('מעודכן') >= 0)) {
      return all[j];
    }
  }
  return null;
}

// מכירות — קורא כמות נמכרת לכל סימבול מגיליון "מכירות"
// מבנה ידוע: שורה 3 = כותרות, נתונים משורה 4 | עמודה B=סימבול, עמודה D=כמות נמכרה
function getSales() {
  var sheet = SS.getSheetByName('מכירות');
  if (!sheet) { Logger.log('getSales: גיליון "מכירות" לא נמצא'); return {}; }

  var lastRow = sheet.getLastRow();
  if (lastRow < 4) return {};

  // נסה למצוא שורת כותרות (בד"כ שורה 3) — מחפש "סימבול" בעמודה B
  var headerRow = 3;
  var symCol = 1;  // עמודה B
  var qtyCol = 3;  // עמודה D

  // וודא — סרוק 5 שורות ראשונות, מצא את "סימבול"
  for (var r = 1; r <= Math.min(lastRow, 5); r++) {
    var vals = sheet.getRange(r, 1, 1, 8).getValues()[0];
    for (var c = 0; c < vals.length; c++) {
      var v = String(vals[c]).replace(/[\u200B-\u200F\uFEFF]/g, '').trim();
      if (v === 'סימבול') { symCol = c; headerRow = r; }
      if (v === 'כמות נמכרה' || v === 'כמות מכירה') { qtyCol = c; }
    }
  }

  var dataStart = headerRow + 1;
  if (dataStart > lastRow) return {};

  var data = sheet.getRange(dataStart, 1, lastRow - dataStart + 1, Math.max(symCol, qtyCol) + 1).getValues();
  var map = {};
  data.forEach(function(row) {
    var sym = String(row[symCol] || '').replace(/[\u200B-\u200F\uFEFF]/g, '').trim().toUpperCase();
    var qty = parseFloat(row[qtyCol]) || 0;
    if (!sym || qty === 0 || sym === 'הוראות') return;
    map[sym] = (map[sym] || 0) + qty;
  });
  Logger.log('getSales: ' + Object.keys(map).length + ' סימבולים נמכרו | ' + JSON.stringify(map));
  return map;
}

// עלויות קנייה — מסכם רכישות (כולל מספר lots) ומחסיר מכירות
// מבנה ידוע: שורה 4 = כותרות, נתונים משורה 5
// עמודות: A=סימבול(0), B=שם(1), D=כמות שנקנתה(3), E=מחיר(4), F=תאריך(5), G=USD/ILS(6), I=עלות ₪(8)
function getPurchaseCosts() {
  var sheet = _findSheetByNames(['עלויות_קנייה_מעדכן', 'עלויות_קנייה_מעודכן', 'עלויות קנייה מעודכן', 'עלויות קנייה (מעודכן)']);
  if (!sheet) sheet = SS.getSheetByName('עלויות קנייה');
  if (!sheet) { Logger.log('❌ getPurchaseCosts: לא נמצא גיליון עלויות'); return {}; }

  var lastRow = sheet.getLastRow();
  if (lastRow < 5) return {};

  // מיפוי עמודות קבוע (מבוסס על הלוג)
  var symCol = 0;   // A: סימבול
  var nameCol = 1;   // B: שם הנייר
  var qtyCol = 3;    // D: כמות שנקנתה
  var priceCol = 4;  // E: מחיר קנייה ($)
  var dateCol = 5;   // F: תאריך קנייה
  var usdCol = 6;    // G: USD/ILS בקנייה
  var costCol = 8;   // I: עלות כוללת (₪)
  var dataStart = 5; // נתונים מתחילים בשורה 5

  // שלב 1: סכימת רכישות גולמיות (תומך במספר lots לאותו סימבול)
  var gross = {};
  var data = sheet.getRange(dataStart, 1, lastRow - dataStart + 1, costCol + 1).getValues();
  data.forEach(function(row) {
    var sym = String(row[symCol] || '').replace(/[\u200B-\u200F\uFEFF]/g, '').trim().toUpperCase();
    var qty = parseFloat(row[qtyCol]) || 0;
    if (!sym || qty === 0) return;

    var costILS = parseFloat(row[costCol]) || 0;
    var buyPrice = parseFloat(row[priceCol]) || 0;
    var usdIlsBuy = parseFloat(row[usdCol]) || 0;
    var buyDate = _safeSheetDateStr(row[dateCol]); // ✅ v11.9.3.0
    var name = String(row[nameCol] || '').trim();

    if (!gross[sym]) gross[sym] = { qty: 0, costILS: 0, name: name, buyDate: buyDate, usdIlsBuy: usdIlsBuy, buyPrice: buyPrice, lots: 0 };
    gross[sym].qty += qty;
    gross[sym].costILS += costILS;
    gross[sym].lots += 1;
    if (name) gross[sym].name = name;
  });

  // שלב 2: החסרת מכירות → נטו
  var sales = getSales();
  var map = {};
  Object.keys(gross).forEach(function(sym) {
    var g = gross[sym];
    var sold = sales[sym] || 0;
    var netQty = g.qty - sold;
    var avgCostPerShare = g.qty > 0 ? g.costILS / g.qty : 0;
    var netCostILS = avgCostPerShare * netQty;

    map[sym] = {
      qty: netQty,
      grossQty: g.qty,
      soldQty: sold,
      lots: g.lots,
      buyPrice: g.buyPrice,
      buyDate: g.buyDate,
      usdIlsBuy: g.usdIlsBuy,
      costILS: netCostILS,
      grossCostILS: g.costILS,
      name: g.name
    };
  });

  Logger.log('getPurchaseCosts: ' + Object.keys(map).length + ' סימבולים (נטו) מגיליון "' + sheet.getName() + '" | מכירות: ' + Object.keys(sales).length + ' סימבולים');
  return map;
}

// ✅ v11.9.3.0: פורמט תאריך בטוח מתא גיליון — לא נופל על מחרוזות dd/MM/yyyy או תאריכים לא תקינים
function _safeSheetDateStr(v) {
  if (!v) return '';
  var d = new Date(v);
  if (isNaN(d.getTime())) {
    var m = String(v).match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/);
    if (m) d = new Date(parseInt(m[3], 10), parseInt(m[2], 10) - 1, parseInt(m[1], 10));
  }
  if (isNaN(d.getTime())) return String(v);
  try { return Utilities.formatDate(d, 'Asia/Jerusalem', 'dd/MM/yyyy'); } catch (e) { return String(v); }
}
function _safeSheetDateObj(v) {
  if (!v) return new Date(0);
  var d = new Date(v);
  if (isNaN(d.getTime())) {
    var m = String(v).match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/);
    if (m) d = new Date(parseInt(m[3], 10), parseInt(m[2], 10) - 1, parseInt(m[1], 10), 12, 0, 0);
  }
  return isNaN(d.getTime()) ? new Date(0) : d;
}

// דיאגנוסטיקה
// ── ✅ חדש: getDividendData — נתוני דיבידנדים לאתר ──
function getDividendData() {
  const sheet = SS.getSheetByName('דיבידנדים');
  if (!sheet) return { summary: [], forecast: [], totals: { grossUSD: 0, taxUSD: 0, netUSD: 0, netILS: 0 } };

  const usdToday = getCurrentUSDILS();

  // טבלת סיכום: שורות 6-15, עמודות A-E (0-indexed: שורות 5-14)
  const summaryRange = sheet.getRange(6, 1, 10, 5).getValues();
  const summary = [];
  for (let i = 0; i < summaryRange.length; i++) {
    const row = summaryRange[i];
    const sym = String(row[0]).trim();
    if (!sym || sym === 'סה"כ') break;
    summary.push({
      symbol: sym,
      grossUSD: parseFloat(row[1]) || 0,
      taxUSD: parseFloat(row[2]) || 0,
      netUSD: parseFloat(row[3]) || 0,
      netILS: parseFloat(row[4]) || 0,
    });
  }

  // טבלת צפי: שורות 6-14, עמודות G-K (0-indexed: עמודות 6-10)
  const forecastRange = sheet.getRange(6, 7, 10, 5).getValues();
  const forecast = [];
  for (let i = 0; i < forecastRange.length; i++) {
    const row = forecastRange[i];
    const sym = String(row[0]).trim();
    if (!sym) break;
    forecast.push({
      symbol: sym,
      lastDividend: String(row[1] || ''),
      nextEstimate: String(row[2] || ''),
      annualEstUSD: parseFloat(row[3]) || 0,
      frequency: String(row[4] || ''),
    });
  }

  // סה"כ
  const totals = {
    grossUSD: summary.reduce((s, r) => s + r.grossUSD, 0),
    taxUSD: summary.reduce((s, r) => s + r.taxUSD, 0),
    netUSD: summary.reduce((s, r) => s + r.netUSD, 0),
    netILS: summary.reduce((s, r) => s + r.netILS, 0),
  };

  return { summary, forecast, totals, usdToday };
}
// ── חשבונות בנק ──
function getBankAccounts() {
  const sheet = SS.getSheetByName('חשבונות בנק');
  if (!sheet) return [];
  const liveUSD = getCurrentUSDILS();
  return sheet.getRange('A5:F12').getValues().reduce((acc, row) => {
    const institution = String(row[0]).trim(), accType = String(row[1]).trim();
    const ccyRaw = String(row[2]).trim();
    // ✅ תיקון: נרמול מטבע — לא רגיש לרישיות (usd/USD/$ → USD)
    const ccyUpper = ccyRaw.toUpperCase();
    const ccy = (ccyUpper === 'USD' || ccyRaw === '$') ? 'USD'
              : (ccyUpper === 'ILS' || ccyRaw === '₪' || !ccyRaw) ? 'ILS'
              : ccyUpper;
    const balance = parseFloat(row[3]) || 0;
    if (!institution || balance === 0) return acc;
    const rate     = ccy === 'ILS' ? 1 : ccy === 'USD' ? liveUSD : parseFloat(row[4]) || 1;
    const valueILS = balance * rate;
    var stampRaw = String(row[5] || '').trim();
    var stamp = stampRaw ? stampRaw.replace(/^(auto|ידני|manual)\s*·\s*/i, '').trim() : ''; // "08/10/2026 15:30"
    acc.push({ name: accType ? institution + ' — ' + accType : institution, institution, accType, ccy, balance, rate, valueILS, stamp: stamp });
    return acc;
  }, []);
}
// ═══ ✅ v13.3.6.0: BACK OFFICE — עדכון ידני של יתרות בנקים מתוך האפליקציה ═══
// Ofir לא מעביר סיסמת בנק; ההזנה ידנית דרך הטאב "⚙️ Back Office".
// כתיבה לאותן עמודות של ?bankdata= (D=יתרה, F=חותמת) עם קידומת "ידני ·".
function BO_getBanks(token) {
  var g = _gate(token);
  if (g) { try { return JSON.parse(g); } catch (eG) { return { error: 'unauthorized' }; } }
  try {
    var sheet = SS.getSheetByName('חשבונות בנק');
    if (!sheet) return { error: 'missing sheet' };
    var rows = sheet.getRange('A5:F12').getValues();
    var out = [];
    for (var r = 0; r < rows.length; r++) {
      var inst = String(rows[r][0] || '').trim(), type = String(rows[r][1] || '').trim();
      if (!inst) continue;
      var ccyRaw = String(rows[r][2] || '').trim().toUpperCase();
      var ccy = (ccyRaw === 'USD' || ccyRaw === '$') ? 'USD' : 'ILS';
      var stampRaw = String(rows[r][5] || '').trim();
      var stamp = stampRaw ? stampRaw.replace(/^(auto|ידני|manual)\s*·\s*/i, '').trim() : '';
      var src = /^\s*(ידני|manual)/i.test(stampRaw) ? 'manual' : (stampRaw ? 'auto' : '');
      out.push({ row: r + 5, institution: inst, accType: type, ccy: ccy, balance: parseFloat(rows[r][3]) || 0, stamp: stamp, src: src });
    }
    return { ok: true, banks: out };
  } catch (eBO) { return { error: String(eBO) }; }
}

function BO_updateBank(token, institution, accType, valueStr) {
  var g = _gate(token);
  if (g) { try { return JSON.parse(g); } catch (eG) { return { error: 'unauthorized' }; } }
  var demoBlock = _requireReal(token);
  if (demoBlock) { try { return JSON.parse(demoBlock); } catch (eD) { return { error: 'demo-mode-readonly' }; } }
  try {
    var num = parseFloat(String(valueStr == null ? '' : valueStr).replace(/[\s,₪$]/g, ''));
    if (!isFinite(num) || num < 0) return { ok: false, error: 'מספר לא תקין' };
    var sheet = SS.getSheetByName('חשבונות בנק');
    if (!sheet) return { ok: false, error: 'missing sheet' };
    var rows = sheet.getRange('A5:F12').getValues();
    var rowIdx = -1;
    for (var r = 0; r < rows.length; r++) {
      if (String(rows[r][0] || '').trim().toLowerCase() === String(institution || '').toLowerCase() &&
          String(rows[r][1] || '').trim().toLowerCase() === String(accType || '').toLowerCase()) { rowIdx = r + 5; break; }
    }
    if (rowIdx < 0) return { ok: false, error: 'חשבון לא נמצא: ' + institution + (accType ? ' — ' + accType : '') };
    var stamp = Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'dd/MM/yyyy HH:mm');
    sheet.getRange('D' + rowIdx).setValue(num);
    sheet.getRange('F' + rowIdx).setValue('ידני · ' + stamp);
    return { ok: true, institution: institution, accType: accType, balance: num, stamp: stamp };
  } catch (eBO2) { return { ok: false, error: String(eBO2) }; }
}
// ═══ ✅ v13.4.0.0: סריקת שוק — מדדים, ETFs ומניות (ארה"ב + ישראל) ═══
// Yahoo chart API; תוצאות בקאש 30 דק'. מניות ת"א מגיעות באגורות (ILA) — מחולק ב-100.
var MKT_UNIVERSE = [
  { s: 'SPY', m: 'US', t: 'etf' }, { s: 'QQQ', m: 'US', t: 'etf' }, { s: 'VOO', m: 'US', t: 'etf' },
  { s: 'VT', m: 'US', t: 'etf' }, { s: 'VTI', m: 'US', t: 'etf' }, { s: 'VUG', m: 'US', t: 'etf' },
  { s: 'VGT', m: 'US', t: 'etf' }, { s: 'XLK', m: 'US', t: 'etf' }, { s: 'VSS', m: 'US', t: 'etf' },
  { s: 'ARKG', m: 'US', t: 'etf' }, { s: 'HACK', m: 'US', t: 'etf' }, { s: 'SKYY', m: 'US', t: 'etf' },
  { s: 'SMH', m: 'US', t: 'etf' }, { s: 'ILF', m: 'US', t: 'etf' }, { s: 'EWZ', m: 'US', t: 'etf' },
  { s: 'INDA', m: 'US', t: 'etf' }, { s: 'GLD', m: 'US', t: 'etf' }, { s: 'SLV', m: 'US', t: 'etf' },
  { s: 'TLT', m: 'US', t: 'etf' }, { s: 'IEF', m: 'US', t: 'etf' }, { s: 'VNQ', m: 'US', t: 'etf' },
  { s: 'XLE', m: 'US', t: 'etf' }, { s: 'XLF', m: 'US', t: 'etf' }, { s: 'XLV', m: 'US', t: 'etf' },
  { s: 'XLI', m: 'US', t: 'etf' }, { s: 'XLP', m: 'US', t: 'etf' }, { s: 'XLU', m: 'US', t: 'etf' },
  { s: 'XLB', m: 'US', t: 'etf' }, { s: 'XLY', m: 'US', t: 'etf' }, { s: 'XLC', m: 'US', t: 'etf' },
  { s: 'IWM', m: 'US', t: 'etf' }, { s: 'VB', m: 'US', t: 'etf' }, { s: 'IJR', m: 'US', t: 'etf' },
  { s: 'EFA', m: 'US', t: 'etf' }, { s: 'EEM', m: 'US', t: 'etf' }, { s: 'BND', m: 'US', t: 'etf' },
  { s: 'XBI', m: 'US', t: 'etf' }, { s: 'IBB', m: 'US', t: 'etf' }, { s: 'VHT', m: 'US', t: 'etf' },
  { s: 'FDN', m: 'US', t: 'etf' }, { s: 'CIBR', m: 'US', t: 'etf' }, { s: 'PDBC', m: 'US', t: 'etf' },
  { s: 'NVDA', m: 'US', t: 'stock' }, { s: 'MSFT', m: 'US', t: 'stock' }, { s: 'AAPL', m: 'US', t: 'stock' },
  { s: 'GOOGL', m: 'US', t: 'stock' }, { s: 'AMZN', m: 'US', t: 'stock' }, { s: 'META', m: 'US', t: 'stock' },
  { s: 'AVGO', m: 'US', t: 'stock' }, { s: 'TSM', m: 'US', t: 'stock' }, { s: 'AMD', m: 'US', t: 'stock' },
  { s: 'TSLA', m: 'US', t: 'stock' }, { s: 'NFLX', m: 'US', t: 'stock' }, { s: 'JPM', m: 'US', t: 'stock' },
  { s: 'COST', m: 'US', t: 'stock' }, { s: 'LLY', m: 'US', t: 'stock' }, { s: 'ORCL', m: 'US', t: 'stock' },
  { s: 'CRM', m: 'US', t: 'stock' }, { s: 'ADBE', m: 'US', t: 'stock' }, { s: 'INTC', m: 'US', t: 'stock' },
  { s: 'WMT', m: 'US', t: 'stock' }, { s: 'UNH', m: 'US', t: 'stock' },
  { s: 'TA35.TA', m: 'IL', t: 'index' }, { s: 'TA90.TA', m: 'IL', t: 'index' }, { s: '^TA125.TA', m: 'IL', t: 'index' },
  { s: 'POLI.TA', m: 'IL', t: 'stock' }, { s: 'MZTF.TA', m: 'IL', t: 'stock' }, { s: 'LUMI.TA', m: 'IL', t: 'stock' },
  { s: 'DSCT.TA', m: 'IL', t: 'stock' }, { s: 'NICE.TA', m: 'IL', t: 'stock' }, { s: 'TEVA.TA', m: 'IL', t: 'stock' },
  { s: 'ALHE.TA', m: 'IL', t: 'stock' }, { s: 'GILT.TA', m: 'IL', t: 'stock' }, { s: 'ESLT.TA', m: 'IL', t: 'stock' },
  { s: 'HARL.TA', m: 'IL', t: 'stock' }
];

function MARKET_scan(token, force) {
  var g = _gate(token);
  if (g) { try { return JSON.parse(g); } catch (eG) { return { error: 'unauthorized' }; } }
  try {
    var cache = CacheService.getScriptCache();
    if (!force) {
      var cached = cache.get('MKT_SCAN_V1');
      if (cached) { try { var cj = JSON.parse(cached); cj.cached = true; return cj; } catch (eC) {} }
    }
    // fetchAll מקבל מערך אובייקטי בקשה בלבד — כל אובייקט נושא headers/muteHttpExceptions משלו
    var reqs = MKT_UNIVERSE.map(function (u) {
      return {
        url: 'https://query1.finance.yahoo.com/v8/finance/chart/' + encodeURIComponent(u.s) + '?range=1y&interval=1d',
        method: 'get',
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        muteHttpExceptions: true
      };
    });
    var resps = UrlFetchApp.fetchAll(reqs);
    // ניירות שכבר בבעלותך (גיליון IBKR) — לסימון חופף
    var held = {};
    try {
      var shH = SS.getSheetByName('IBKR');
      if (shH) {
        var vH = shH.getDataRange().getValues();
        for (var ih = 0; ih < vH.length; ih++) {
          var sy = String(vH[ih][0] || '').trim().toUpperCase();
          if (sy) held[sy] = true;
        }
      }
    } catch (eH) {}
    var out = [], fails = 0;
    for (var i = 0; i < MKT_UNIVERSE.length; i++) {
      try {
        var d = JSON.parse(resps[i].getContentText());
        var r = d && d.chart && d.chart.result && d.chart.result[0];
        if (!r || !r.meta) { fails++; continue; }
        out.push(_mktAnalyze(MKT_UNIVERSE[i], r, held));
      } catch (eA) { fails++; }
    }
    out.sort(function (a, b) { return (b.score || 0) - (a.score || 0); });
    var now = Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'dd/MM/yyyy HH:mm');
    var payload = {
      ok: true, ts: now, scanned: out.length, failed: fails,
      recs: out.filter(function (o) { return o.signal === 'breakout' || o.signal === 'momentum' || o.signal === 'pullback'; }).slice(0, 12),
      all: out
    };
    try { cache.put('MKT_SCAN_V1', JSON.stringify(payload), 1800); } catch (eP) {}
    return payload;
  } catch (e) { return { error: String(e) }; }
}

function _mktAnalyze(u, r, held) {
  var m = r.meta || {};
  var q = (r.indicators && r.indicators.quote && r.indicators.quote[0]) || {};
  var closes = (q.close || []).map(Number).filter(function (x) { return isFinite(x) && x > 0; });
  var vols = (q.volume || []).map(function (x2) { return Number(x2) || 0; });
  var n = closes.length;
  var isAg = String(m.currency || '') === 'ILA';
  var div = isAg ? 100 : 1;
  // כל החישובים ביחידות הגולמיות של Yahoo (ת"א = אגורות) — החלוקה ב-div רק לתצוגה
  var px = (Number(m.regularMarketPrice) || (n ? closes[n - 1] : 0));
  var hi52 = (Number(m.fiftyTwoWeekHigh) || 0);
  var lo52 = (Number(m.fiftyTwoWeekLow) || 0);
  var name = String(m.shortName || m.longName || u.s).slice(0, 30);
  var symKey = u.s.split('.')[0].toUpperCase();
  var isHeld = !!held[symKey];
  var ccy = isAg ? '₪' : (u.m === 'IL' ? '₪' : '$');
  if (!px || n < 20) return { sym: u.s, name: name, market: u.m, type: u.t, signal: 'none', score: 0, ccy: ccy, held: isHeld };
  function sma(len) { if (n < len) len = n; var s = 0; for (var i = n - len; i < n; i++) s += closes[i]; return s / len; }
  var s50 = sma(50), s200 = sma(200);
  var rsi = 50;
  if (n > 15) { var up = 0, dn = 0; for (var i2 = n - 14; i2 < n; i2++) { var ch = closes[i2] - closes[i2 - 1]; if (ch > 0) up += ch; else dn -= ch; } rsi = dn === 0 ? 100 : Math.round(100 - 100 / (1 + (up / 14) / (dn / 14))); }
  var atrP = 0;
  if (n > 15) { var sA = 0; for (var i3 = n - 14; i3 < n; i3++) sA += Math.abs(closes[i3] - closes[i3 - 1]); atrP = (sA / 14) / px * 100; }
  var atrV = px * atrP / 100;
  var ret3m = n > 64 ? (px / closes[n - 64] - 1) * 100 : (n > 1 ? (px / closes[0] - 1) * 100 : 0);
  var chg = isFinite(Number(m.regularMarketChangePercent)) ? Number(m.regularMarketChangePercent) : (n > 1 ? (px / closes[n - 1] - 1) * 100 : 0);
  var volR = 1;
  if (n > 95) { var a10 = 0, b80 = 0; for (var i4 = n - 10; i4 < n; i4++) a10 += vols[i4]; for (var i5 = n - 90; i5 < n - 10; i5++) b80 += vols[i5]; volR = b80 > 0 ? (a10 / 10) / (b80 / 80) : 1; }
  var hi20 = 0, lo20 = Infinity;
  for (var i6 = Math.max(0, n - 20); i6 < n; i6++) { if (closes[i6] > hi20) hi20 = closes[i6]; if (closes[i6] < lo20) lo20 = closes[i6]; }
  if (!isFinite(lo20)) lo20 = px;
  if (hi52 <= 0) hi52 = Math.max.apply(null, closes);
  if (lo52 <= 0) lo52 = Math.min.apply(null, closes);

  var trendUp = s50 > s200 && px > s50;
  var strongTrend = trendUp && ret3m >= 8;
  var nearHigh = hi52 > 0 && px >= hi52 * 0.97;
  var overbought = rsi >= 78;
  var nearS50 = Math.abs(px / s50 - 1) <= 0.03;
  var above200 = px > s200;

  var signal = 'watch', entry = 0, stop = 0, target = 0, exitNote = '';
  if (nearHigh && trendUp && !overbought) {
    signal = 'breakout';
    entry = px;
    stop = Math.max(lo20, px - 1.8 * atrV);
    if (stop > px * 0.96) stop = px * 0.94;
    if (stop < px * 0.88) stop = px * 0.90;
    target = Math.max(hi52 * 1.05, px * 1.08);
    exitNote = 'יציאה: סטופ מתחת לתמיכה הקרובה, ביעד או בסגירה מתחת לממוצע 50 יום. אחרי +10% מומלץ להזיז את הסטופ נגד הרווח.';
  } else if (strongTrend && rsi >= 45 && rsi < 72) {
    signal = 'momentum';
    entry = px;
    stop = Math.max(s50 * 0.98, px - 2.2 * atrV);
    if (stop > px * 0.97) stop = px * 0.94;
    target = entry + 2.2 * (entry - stop);
    exitNote = 'יציאה: סטופ מתחת לממוצע 50 יום או יעד R:R 1:2.2. אם RSI יורד מתחת ל-45 — שקול לצמצם.';
  } else if (above200 && rsi >= 35 && rsi <= 52 && nearS50) {
    signal = 'pullback';
    entry = px;
    stop = Math.max(lo20, px - 1.8 * atrV);
    if (stop > px * 0.975) stop = px * 0.95;
    target = Math.max(hi20 * 1.01, px * 1.05);
    exitNote = 'יציאה: סטופ מתחת לתמיכת הכניסה או יעד חזרה לשיא 20 הימים. סגירה מתחת לממוצע 200 יום — יציאה מלאה.';
  }
  var exp = target > entry ? (target / entry - 1) * 100 : 0;
  var rr = (target > entry && entry > stop) ? (target - entry) / (entry - stop) : 0;
  if (rr < 1.3 && signal !== 'watch') { signal = 'watch'; entry = stop = target = exp = rr = 0; exitNote = ''; }

  var score = 0;
  if (above200) score += 15;
  if (s50 > s200) score += 10;
  if (px > s50) score += 10;
  if (ret3m >= 15) score += 15; else if (ret3m >= 8) score += 10; else if (ret3m >= 0) score += 5;
  if (nearHigh) score += 10;
  if (rsi >= 45 && rsi < 62) score += 15; else if (rsi >= 62 && rsi < 72) score += 10; else if (rsi >= 35 && rsi < 45) score += 8;
  if (volR >= 1.2) score += 8; else if (volR >= 1.0) score += 4;
  if (rr >= 2.5) score += 12; else if (rr >= 1.8) score += 8; else if (rr >= 1.5) score += 5;
  if (overbought) score = Math.min(score, 55);
  if (signal === 'watch' && score < 62) { entry = stop = target = exp = rr = 0; }
  else if (signal === 'watch') { signal = 'watch'; }

  return {
    sym: u.s, name: name, market: u.m, type: u.t, ccy: ccy, held: isHeld,
    px: Math.round(px / div * 100) / 100, chg: Math.round(chg * 100) / 100,
    rsi: rsi, ret3m: Math.round(ret3m * 10) / 10, volR: Math.round(volR * 100) / 100,
    signal: signal, score: score,
    entry: entry ? Math.round(entry / div * 100) / 100 : 0, stop: stop ? Math.round(stop / div * 100) / 100 : 0,
    target: target ? Math.round(target / div * 100) / 100 : 0, exp: Math.round(exp * 10) / 10,
    rr: Math.round(rr * 10) / 10, exit: exitNote,
    hi52: Math.round(hi52 / div * 100) / 100,
    above50: px > s50, above200: above200
  };
}

// ═══ ✅ v13.4.2.0: ציון ניירות התיק — הרצה ידנית מהכפתור בטאב סריקת שוק ═══
function MARKET_scoreHoldings(token) {
  var g = _gate(token);
  if (g) { try { return JSON.parse(g); } catch (eG) { return { error: 'unauthorized' }; } }
  try {
    var shH = SS.getSheetByName('IBKR');
    if (!shH) return { error: 'missing IBKR sheet' };
    var vH = shH.getDataRange().getValues();
    var syms = [];
    for (var i = 0; i < vH.length; i++) {
      var sy = String(vH[i][0] || '').trim().toUpperCase();
      if (sy) syms.push(sy);
    }
    if (!syms.length) return { error: 'no holdings' };
    var reqs = syms.map(function (sm) {
      return { url: 'https://query1.finance.yahoo.com/v8/finance/chart/' + encodeURIComponent(sm) + '?range=1y&interval=1d', method: 'get', headers: { 'User-Agent': 'Mozilla/5.0' }, muteHttpExceptions: true };
    });
    var resps = UrlFetchApp.fetchAll(reqs);
    var held = {};
    syms.forEach(function (x) { held[x] = true; });
    var out = [], fails = 0;
    for (var j = 0; j < syms.length; j++) {
      try {
        var d = JSON.parse(resps[j].getContentText());
        var r = d && d.chart && d.chart.result && d.chart.result[0];
        if (!r) { fails++; continue; }
        var isIL = syms[j].indexOf('.TA') >= 0;
        out.push(_mktAnalyze({ s: syms[j], m: isIL ? 'IL' : 'US', t: 'stock' }, r, held));
      } catch (eA) { fails++; }
    }
    out.sort(function (a, b) { return (b.score || 0) - (a.score || 0); });
    return { ok: true, ts: Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'dd/MM/yyyy HH:mm'), rows: out, failed: fails };
  } catch (e) { return { error: String(e) }; }
}


// ── חיסכון לכל ילד ──
function getSavingsData() {
  const sheet = SS.getSheetByName('חיסכון לכל ילד');
  if (!sheet) return { kids: [], total: 0 };
  const kids = sheet.getRange('A5:G7').getValues().reduce((acc, row) => {
    const name = String(row[0]).trim();
    if (!name) return acc;
    let updatedAt = '';
    try { if (row[1]) updatedAt = Utilities.formatDate(new Date(row[1]), 'Asia/Jerusalem', 'dd/MM/yyyy'); } catch (e) {}
    const bituachLeumi = parseFloat(row[4]) || 0, parents = parseFloat(row[5]) || 0;
    acc.push({ name, fund: String(row[2]).trim(), track: String(row[3]).trim(), bituachLeumi, parents, total: parseFloat(row[6]) || (bituachLeumi + parents), updatedAt });
    return acc;
  }, []);
  return { kids, total: kids.reduce((s, k) => s + k.total, 0) };
}
// ── שערי מט"ח ──
function getCurrentUSDILS() {
  // ✅ v12.3.0.0: קאשינג 6 שעות — פחות קריאות רשת, טעינה מהירה יותר
  var cache = CacheService.getScriptCache();
  try {
    var cached = cache.get('USDILS_RATE');
    if (cached) return parseFloat(cached);
  } catch (e2) {}
  try {
    const data = JSON.parse(UrlFetchApp.fetch('https://api.frankfurter.app/latest?from=USD&to=ILS', { muteHttpExceptions: true }).getContentText());
    if (data && data.rates && data.rates.ILS) {
      try { cache.put('USDILS_RATE', String(data.rates.ILS), 21600); } catch (e3) {}
      return data.rates.ILS;
    }
  } catch (e) { Logger.log('שגיאה שער: ' + e); }
  return getSettings().usdIls;
}

function updateExchangeRates() {
  const sheet = SS.getSheetByName('הגדרות');
  if (!sheet) return;
  try {
    const data = JSON.parse(UrlFetchApp.fetch('https://api.frankfurter.app/latest?from=ILS&to=USD,EUR,GBP', { muteHttpExceptions: true }).getContentText());
    if (!data || !data.rates) return;
    const rates = { USD: data.rates.USD > 0 ? 1/data.rates.USD : 0, EUR: data.rates.EUR > 0 ? 1/data.rates.EUR : 0, GBP: data.rates.GBP > 0 ? 1/data.rates.GBP : 0, ILS: 1 };
    const dateStr = Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'dd/MM/yyyy HH:mm');
    // ✅ v11.6.3.0: batch-read — קריאה אחת של עמודה A במקום לולאת getValue
    const lastRow = sheet.getLastRow();
    const colA = sheet.getRange(1, 1, lastRow, 1).getValues();
    for (let r = 0; r < colA.length; r++) {
      const ccy = String(colA[r][0]).trim().toUpperCase();
      if (rates.hasOwnProperty(ccy)) {
        sheet.getRange(r + 1, 3).setValue(rates[ccy]).setNumberFormat('0.0000');
        if (ccy === 'USD') sheet.getRange(r + 1, 4).setValue(dateStr);
      }
    }
    const bankSheet = SS.getSheetByName('חשבונות בנק');
    if (bankSheet) {
      bankSheet.getRange('A5:E12').getValues().forEach((row, i) => {
        const ccy = String(row[2]).trim().toUpperCase(), balance = parseFloat(row[3]) || 0;
        if (rates.hasOwnProperty(ccy) && ccy !== 'ILS') {
          bankSheet.getRange(5+i, 5).setValue(rates[ccy]).setNumberFormat('0.0000');
          bankSheet.getRange(5+i, 6).setValue(balance * rates[ccy]).setNumberFormat('#,##0.00 ₪');
        }
      });
    }
    Logger.log('שערי מטבעות עודכנו');
  } catch (e) { Logger.log('שגיאה בעדכון שערים: ' + e); }
}
// ── רווח ממומש ──
function getRealizedGains() {
  const sheet = SS.getSheetByName('רווח ממומש');
  if (!sheet) return { totalUSD: 0, totalILS: 0, entries: [] };
  const lastRow = sheet.getLastRow();
  if (lastRow < 5) return { totalUSD: 0, totalILS: 0, entries: [] };
  const entries = sheet.getRange('A5:I' + (lastRow - 1)).getValues().reduce((acc, row) => {
    const sym = String(row[1]).trim();
    if (!sym) return acc;
    acc.push({ period: String(row[0]).trim(), sym, desc: String(row[2]).trim(), saleDate: row[3] ? Utilities.formatDate(new Date(row[3]),'Asia/Jerusalem','dd/MM/yyyy') : '', costUSD: parseFloat(row[4])||0, proceedsUSD: parseFloat(row[5])||0, gainUSD: parseFloat(row[6])||0, usdIls: parseFloat(row[7])||0, gainILS: parseFloat(row[8])||0 });
    return acc;
  }, []);
  return { totalUSD: entries.reduce((s,e)=>s+e.gainUSD,0), totalILS: entries.reduce((s,e)=>s+e.gainILS,0), entries };
}
// ═══ ✅ v11.6.5.0: פירוט דיבידנדים — קריאת טבלת הפירוט (עם תאריכים) מהגיליון ═══
// מזהה אוטומטית את שורת הכותרת של טבלת הפירוט (דורש עמודת 'תאריך' + עמודות סכומים),
// ומזהה מטבע לפי כותרת העמודה ($/₪). אם אין פירוט — מחזיר null והקוד נופל חזרה לסיכום הכללי.
var _divDetailsCache = null;
function _getDividendDetails() {
  if (_divDetailsCache !== null) return _divDetailsCache;
  _divDetailsCache = false; // ברירת מחדל — אין פירוט
  try {
    var sheet = SS.getSheetByName('דיבידנדים');
    if (!sheet) return null;
    var lastRow = sheet.getLastRow(), lastCol = sheet.getLastColumn();
    if (lastRow < 2 || lastCol < 2) return null;
    var all = sheet.getRange(1, 1, lastRow, lastCol).getValues(); // ✅ batch-read — קריאה אחת

    var headerIdx = -1, cols = null;
    for (var r = 0; r < all.length; r++) {
      var map = { date: -1, sym: -1, gross: -1, grossIls: -1, tax: -1, taxIls: -1, net: -1, netIls: -1 };
      for (var c = 0; c < all[r].length; c++) {
        var h = String(all[r][c] || '').replace(/[\u200B-\u200F\uFEFF]/g, '').replace(/\s+/g, ' ').trim();
        if (!h) continue;
        var hl = h.toLowerCase();
        var isIls = (h.indexOf('₪') >= 0 || h.indexOf('ש\"ח') >= 0 || h.indexOf('שח') >= 0 || hl.indexOf('ils') >= 0 || hl.indexOf('shekel') >= 0);
        if ((h.indexOf('תאריך') === 0 || hl.indexOf('date') === 0) && map.date < 0) { map.date = c; continue; }
        if ((h.indexOf('סימ') === 0 || h.indexOf('נייר') === 0 || hl.indexOf('symbol') === 0 || hl.indexOf('ticker') === 0) && map.sym < 0) { map.sym = c; continue; }
        if ((h.indexOf('גולמי') >= 0 || h.indexOf('ברוטו') >= 0 || hl.indexOf('gross') >= 0)) {
          if (isIls) { if (map.grossIls < 0) map.grossIls = c; } else { if (map.gross < 0) map.gross = c; }
          continue;
        }
        if ((h.indexOf('ניכוי') >= 0 || h.indexOf('מס') >= 0 || hl.indexOf('tax') >= 0 || hl.indexOf('withhold') >= 0)) {
          if (isIls) { if (map.taxIls < 0) map.taxIls = c; } else { if (map.tax < 0) map.tax = c; }
          continue;
        }
        if ((h.indexOf('נטו') >= 0 || hl.indexOf('net') >= 0)) {
          if (isIls) { if (map.netIls < 0) map.netIls = c; } else { if (map.net < 0) map.net = c; }
          continue;
        }
        // ✅ v11.6.5.1: "סכום ($)" — בפירוט ללא עמודת מס, הסכום הוא הגולמי
        if ((h.indexOf('סכום') >= 0 || hl.indexOf('amount') >= 0 || hl.indexOf('payment') >= 0)) {
          if (isIls) { if (map.grossIls < 0 && map.netIls < 0) map.grossIls = c; } else { if (map.gross < 0 && map.net < 0) map.gross = c; }
          continue;
        }
      }
      var recognized = ['date','sym','gross','grossIls','tax','taxIls','net','netIls'].filter(function(k){ return map[k] >= 0; }).length;
      // טבלת פירוט = תאריך + לפחות 2 עמודות נוספות. לוקחים את השורה האחרונה שעומדת בתנאי
      // (טבלת הפירוט בדרך כלל מתחת לטבלת הסיכום)
      if (map.date >= 0 && recognized >= 3) { headerIdx = r; cols = map; }
    }
    if (headerIdx < 0) {
      Logger.log('⚠️ taxData: לא זוהתה טבלת פירוט דיבידנדים בגיליון — נופלים חזרה לסיכום הכללי (all-time)');
      return null;
    }

    // ✅ v11.6.5.1: אין עמודת מס בפירוט → נגזר שיעור ניכוי אפקטיבי מטבלת הסיכום
    // (מס לחלק לגולמי, לפי נייר; fallback לשיעור הכללי — בדרך כלל ~25% לניירות ארה\"ב)
    var effRates = {}, effOverall = 0;
    try {
      var _ds = getDividendData();
      if (_ds && _ds.summary) {
        _ds.summary.forEach(function (s) {
          if ((s.grossUSD || 0) > 0) effRates[s.symbol.toUpperCase()] = Math.abs(s.taxUSD || 0) / s.grossUSD;
        });
        if (_ds.totals && (_ds.totals.grossUSD || 0) > 0) {
          effOverall = Math.abs(_ds.totals.taxUSD || 0) / _ds.totals.grossUSD;
        }
      }
    } catch (e2) { Logger.log('taxData: שגיאת שיעורי ניכוי: ' + e2); }

    var rows = [];
    for (var r2 = headerIdx + 1; r2 < all.length; r2++) {
      var dv = all[r2][cols.date];
      if (dv === '' || dv === null) continue;
      var d = (dv instanceof Date) ? dv : _parseSheetDate(dv);
      if (!d) continue;
      var sym = cols.sym >= 0 ? String(all[r2][cols.sym] || '').trim() : '';
      var gross = cols.gross >= 0 ? (parseFloat(all[r2][cols.gross]) || 0) : 0;
      var tax = cols.tax >= 0 ? Math.abs(parseFloat(all[r2][cols.tax]) || 0) : 0;
      var net = cols.net >= 0 ? (parseFloat(all[r2][cols.net]) || 0) : 0;
      var grossIls = cols.grossIls >= 0 ? (parseFloat(all[r2][cols.grossIls]) || 0) : 0;
      var netIls = cols.netIls >= 0 ? (parseFloat(all[r2][cols.netIls]) || 0) : 0;
      // ✅ v11.6.5.1: אין עמודת מס → מס נגזר מהשיעור האפקטיבי של הנייר
      if (cols.tax < 0 && gross > 0) {
        var _key = sym ? sym.toUpperCase() : '';
        var _rate = (_key && effRates[_key] !== undefined) ? effRates[_key] : effOverall;
        tax = gross * _rate;
      }
      if (!gross && net) gross = net + tax;      // אין גולמי? נגזר מנטו+מס
      if (!net && gross) net = gross - tax;      // אין נטו? נגזר מגולמי-מס
      if (!gross && !net && !grossIls && !netIls) continue; // שורת סה"כ/ריקה — דלג
      rows.push({ year: d.getFullYear(), sym: sym, grossUSD: gross, taxUSD: tax, netUSD: net, grossILS: grossIls, netILS: netIls, date: Utilities.formatDate(d, 'Asia/Jerusalem', 'dd/MM/yyyy') });
    }
    if (rows.length) {
      Logger.log('✅ taxData: נקראו ' + rows.length + ' שורות פירוט דיבידנדים (כותרת בשורה ' + (headerIdx + 1) + (cols.tax < 0 ? ', מס נגזר משיעור הסיכום' : '') + ')');
      _divDetailsCache = rows;
      return rows;
    }
    Logger.log('⚠️ taxData: טבלת פירוט דיבידנדים זוהתה אך ריקה');
    return null;
  } catch (e) {
    Logger.log('taxData: שגיאת קריאת פירוט דיבידנדים: ' + e);
    return null;
  }
}

// ✅ v11.6.5.0: פרסור תאריך מהגיליון — תומך dd/MM/yyyy (עברית), yyyy-MM-dd, MM/dd/yyyy
function _parseSheetDate(v) {
  var s = String(v).trim();
  if (!s) return null;
  var m = s.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/);
  if (m) { var y = parseInt(m[3]); if (y < 100) y += 2000; return new Date(y, parseInt(m[2]) - 1, parseInt(m[1])); }
  m = s.match(/^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})/);
  if (m) return new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]));
  var d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

// ✅ v11.6.5.0: סיכום דיבידנדים לשנת מס מסוימת מתוך טבלת הפירוט
function _getDividendsForYear(year) {
  var rows = _getDividendDetails();
  if (!rows) return null;
  var sum = { year: year, grossUSD: 0, taxUSD: 0, netUSD: 0, grossILS: 0, netILS: 0, count: 0 };
  rows.forEach(function(r) {
    if (r.year !== year) return;
    sum.grossUSD += r.grossUSD; sum.taxUSD += r.taxUSD; sum.netUSD += r.netUSD;
    sum.grossILS += r.grossILS; sum.netILS += r.netILS; sum.count++;
  });
  return sum; // גם אם הכל 0 — זה מידע תקף (אין דיבידנדים השנה)
}

// ── ✅ מחשבון מס ישראלי — FIFO + תחזית מס שנתית + מעקב מס שולם ──
// ═══════════════════════════════════════════════════════════════
// ✅ v12.3.0.0 — אשף איזון תיק: תקרת ריכוז לנייר בודד
// מחזיר תוכנית מכירה עבור כל נייר שחורג מהתקרה (IBKR + FAIR)
// ═══════════════════════════════════════════════════════════════
function getRebalancePlan(token, maxPct) {
  var g = _gate(token); if (g) return g;
  try {
    maxPct = Math.min(60, Math.max(1, parseFloat(maxPct) || 20));
    var pd = _getPortfolioData();
    var total = ((pd.ibkr || {}).totalVal || 0) + ((pd.fair || {}).totalVal || 0);
    var rows = [];
    var maxShare = 0;
    function addPos(sym, source, valILS, qty) {
      var share = total > 0 ? valILS / total : 0;
      if (share > maxShare) maxShare = share;
      if (share <= maxPct / 100) return;
      var targetILS = total * maxPct / 100;
      var excessILS = valILS - targetILS;
      var unitILS = qty > 0 ? valILS / qty : 0;
      rows.push({
        sym: sym, source: source, valILS: valILS, qty: qty, share: share,
        targetILS: targetILS, excessILS: excessILS,
        sellQty: unitILS > 0 ? Math.floor(excessILS / unitILS * 100) / 100 : 0
      });
    }
    ((pd.ibkr || {}).positions || []).forEach(function (p) { addPos(p.sym, 'IBKR', p.valILS, p.qty); });
    ((pd.fair || {}).positions || []).forEach(function (p) { addPos(p.name, 'FAIR', p.valILS, p.qty); });
    rows.sort(function (a, b) { return b.excessILS - a.excessILS; });
    var out = {
      maxPct: maxPct, total: total, rows: rows,
      totalExcessILS: rows.reduce(function (s, r) { return s + r.excessILS; }, 0),
      worstShare: maxShare
    };
    var f = _demoFactor(token);
    if (f > 0) out = _demoTransform(out, f);
    return JSON.stringify(out);
  } catch (e) {
    return JSON.stringify({ error: 'שגיאה בחישוב התוכנית: ' + String(e).substring(0, 150) });
  }
}

// ═══════════════════════════════════════════════════════════════
// ✅ v12.3.0.0 — דוח מס לפי שנת מס: מימושים + דיבידנדים + שורות CSV
// ═══════════════════════════════════════════════════════════════
function getTaxReport(token, year) {
  var g = _gate(token); if (g) return g;
  try {
    year = parseInt(year) || (new Date().getFullYear());
    var out = { year: year, realized: { rows: [], bySym: [], totalGainILS: 0, totalGainUSD: 0, estTaxILS: 0 }, dividends: null, rows: [] };
    // ── רווחים ממומשים בשנה זו ──
    var rg = getRealizedGains() || { entries: [] };
    var bySym = {};
    (rg.entries || []).forEach(function (e) {
      var parts = (e.saleDate || '').split('/');
      if (parseInt(parts[2] || 0) !== year) return;
      out.realized.rows.push({ date: e.saleDate, sym: e.sym, desc: e.desc, gainUSD: e.gainUSD, usdIls: e.usdIls, gainILS: e.gainILS });
      out.rows.push({ type: 'רווח ממושש', date: e.saleDate, sym: e.sym, amountILS: e.gainILS, amountUSD: e.gainUSD, taxILS: Math.max(0, e.gainILS) * 0.25 });
      var b = bySym[e.sym] = bySym[e.sym] || { sym: e.sym, count: 0, gainILS: 0, gainUSD: 0 };
      b.count++; b.gainILS += e.gainILS; b.gainUSD += e.gainUSD;
      out.realized.totalGainILS += e.gainILS; out.realized.totalGainUSD += e.gainUSD;
    });
    out.realized.estTaxILS = Math.max(0, out.realized.totalGainILS) * 0.25;
    out.realized.bySym = Object.keys(bySym).map(function (k) { return bySym[k]; });
    // ── דיבידנדים בשנה זו ──
    try {
      var dy = _getDividendsForYear(year);
      if (dy && (dy.count > 0 || dy.grossUSD > 0 || dy.grossILS > 0)) {
        var usdNow = getCurrentUSDILS();
        var grossILS = dy.grossILS > 0 ? dy.grossILS : dy.grossUSD * usdNow;
        var netILS = dy.netILS > 0 ? dy.netILS : dy.netUSD * usdNow;
        var foreignTaxILS = Math.max(0, grossILS - netILS);
        out.dividends = {
          count: dy.count, grossILS: grossILS, netILS: netILS,
          foreignTaxILS: foreignTaxILS,
          estLocalTaxILS: Math.max(0, grossILS * 0.25 - foreignTaxILS)
        };
        out.rows.push({ type: 'דיבידנדים (סיכום שנתי)', date: '01/01/' + year, sym: '—', amountILS: netILS, amountUSD: 0, taxILS: out.dividends.estLocalTaxILS });
      }
    } catch (eD) { Logger.log('taxReport div: ' + eD); }
    var f = _demoFactor(token);
    if (f > 0) out = _demoTransform(out, f);
    return JSON.stringify(out);
  } catch (e) {
    return JSON.stringify({ error: 'שגיאה בדוח המס: ' + String(e).substring(0, 150) });
  }
}

// ═══════════════════════════════════════════════════════════════
// ✅ v12.3.2.0 — מכ"ם סיכונים: תנודתיות/שפל/תרומת סיכון לניירות IBKR
// נתוני שוק מ-Yahoo (fetchAll מקבילי, 1y יומי) — בלי פגיעה בזמן טעינה
// ═══════════════════════════════════════════════════════════════
function getRiskRadar(token) {
  var g = _gate(token); if (g) return g;
  try {
    var pd = _getPortfolioData();
    var ib = ((pd.ibkr || {}).positions || []);
    var s = pd.summary || {};
    var total = ((pd.ibkr || {}).totalVal || 0) + ((pd.fair || {}).totalVal || 0);
    var syms = ib.map(function (p) { return p.sym; });
    var rows = [];
    if (syms.length) {
      var reqsR = syms.map(function (sm) {
        return { url: 'https://query1.finance.yahoo.com/v8/finance/chart/' + encodeURIComponent(sm) + '?interval=1d&range=1y', method: 'get', headers: { 'User-Agent': 'Mozilla/5.0' }, muteHttpExceptions: true };
      });
      var resps = UrlFetchApp.fetchAll(reqsR);
      for (var i = 0; i < syms.length; i++) {
        try {
          var j = JSON.parse(resps[i].getContentText());
          var r = (j.chart && j.chart.result && j.chart.result[0]);
          if (!r) continue;
          var closes = ((r.indicators.quote[0] || {}).close || []).filter(function (x) { return x != null; });
          if (closes.length < 30) continue;
          var rets = [];
          for (var k = 1; k < closes.length; k++) { if (closes[k - 1] > 0) rets.push(closes[k] / closes[k - 1] - 1); }
          var m = rets.reduce(function (a, b) { return a + b; }, 0) / rets.length;
          var vr = rets.reduce(function (a, b) { return a + (b - m) * (b - m); }, 0) / (rets.length - 1);
          var vol = Math.sqrt(vr) * Math.sqrt(252);
          var hi = Math.max.apply(null, closes);
          var dd = hi > 0 ? closes[closes.length - 1] / hi - 1 : 0;
          var w = total > 0 ? (ib[i].valILS || 0) / total : 0;
          rows.push({ sym: syms[i], valILS: ib[i].valILS || 0, share: w, vol: vol, dd: dd, contrib: w * vol });
        } catch (eR) { Logger.log('risk ' + syms[i] + ': ' + eR); }
      }
    }
    rows.sort(function (a, b) { return b.contrib - a.contrib; });
    var sumWVol = rows.reduce(function (a, x) { return a + x.contrib; }, 0);
    var sumW2V2 = rows.reduce(function (a, x) { return a + x.contrib * x.contrib; }, 0);
    var portVol = Math.sqrt(0.7 * sumWVol * sumWVol + 0.3 * sumW2V2); // מתאם משוער 0.7
    // ריכוז + חשיפות מהתיק עצמו (IBKR+FAIR)
    var allPos = ib.map(function (p) { return { n: p.sym, v: p.valILS }; })
      .concat(((pd.fair || {}).positions || []).map(function (p) { return { n: p.name, v: p.valILS }; }));
    var top = { n: '—', v: 0 };
    allPos.forEach(function (p) { if (p.v > top.v) top = p; });
    var grand = s.grandTotal || total || 1;
    var out = {
      total: total, portVol: portVol,
      usdShare: grand > 0 ? (((pd.ibkr || {}).totalVal || 0) + ((pd.ibkr || {}).cash || 0)) / grand : 0,
      cashShare: grand > 0 ? (((pd.ibkr || {}).cash || 0) + ((pd.fair || {}).cash || 0) + (s.banksVal || 0)) / grand : 0,
      topSym: top.n, topShare: grand > 0 ? top.v / grand : 0,
      rows: rows, contribTotal: sumWVol
    };
    var f = _demoFactor(token);
    if (f > 0) out = _demoTransform(out, f);
    return JSON.stringify(out);
  } catch (e) {
    return JSON.stringify({ error: 'שגיאה במכ"ם הסיכונים: ' + String(e).substring(0, 150) });
  }
}

function getTaxData() {
  var usdToday = getCurrentUSDILS();
  var currentYear = new Date().getFullYear();

  // ══════ 1. רווח ממומש מהגיליון "רווח ממומש" ══════
  var rg = { totalUSD: 0, totalILS: 0, entries: [] };
  try { var realized = getRealizedGains(); if(realized) rg = realized; } catch(e) { Logger.log('taxData: rg err: '+e); }

  // סינון לפי שנת מס
  var rgThisYear = { totalUSD: 0, totalILS: 0, entries: [] };
  var rgPrevYears = { totalUSD: 0, totalILS: 0, entries: [] };
  (rg.entries || []).forEach(function(e) {
    // saleDate format: dd/MM/yyyy
    var parts = (e.saleDate || '').split('/');
    var year = parts.length === 3 ? parseInt(parts[2]) : 0;
    if (year === currentYear) {
      rgThisYear.totalUSD += e.gainUSD;
      rgThisYear.totalILS += e.gainILS;
      rgThisYear.entries.push(e);
    } else if (year > 0 && year < currentYear) {
      rgPrevYears.totalUSD += e.gainUSD;
      rgPrevYears.totalILS += e.gainILS;
      rgPrevYears.entries.push(e);
    }
  });

  // ══════ 2. דיבידנדים — מס 25% (זיכוי מס זר) ══════
  var divs = { summary: [], totals: {} };
  try { var divData = getDividendData(); if(divData) divs = divData; } catch(e) { Logger.log('taxData: div err: '+e); }

  // דיבידנדים השנה — ניכוי מס ארה"ב 25% + מס ישראלי 32% על הנטו (או זיכוי מס זר)
  // נוסחה: מס ישראלי = max(0, (נטו_גולמי * 32%) - מס_זר_שנוכה)
  // בפועל: אם שילמת 25% בארה"ב, מס ישראלי = גולמי * 32% - גולמי * 25% = גולמי * 7%
  // אבל אם יש אמנת מס, המס בישראל הוא 25% על הגולמי (ולא 32%)
  // לפי החוק הישראלי: מס רווח הון ודיבידנד זה 25% (למשקיע פרטי)
  // עדכון: 2025+ — 25% רווח הון, 25% דיבידנד חו"ל
  var divGrossUSD = (divs.totals || {}).grossUSD || 0;
  var divTaxUS = Math.abs((divs.totals || {}).taxUSD || 0);
  var divNetUSD = (divs.totals || {}).netUSD || 0;
  var divNetILS = (divs.totals || {}).netILS || 0;
  // ✅ v11.6.5.0: דיבידנדים לפי שנת מס — מטבלת הפירוט (עם תאריכים) בגיליון.
  // אם יש פירוט — המס מחושב רק על הדיבידנדים שהתקבלו השנה (במקום על כל ההיסטוריה).
  var divScope = 'all-time';
  var divYearRow = null;
  try { divYearRow = _getDividendsForYear(currentYear); } catch(e) { Logger.log('taxData: divYear err: '+e); }
  if (divYearRow && (divYearRow.grossUSD > 0 || divYearRow.grossILS > 0 || divYearRow.count > 0)) {
    divScope = 'year';
    if (divYearRow.grossUSD > 0 || divYearRow.taxUSD > 0 || divYearRow.netUSD > 0) {
      divGrossUSD = divYearRow.grossUSD;
      divTaxUS = divYearRow.taxUSD;
      divNetUSD = divYearRow.netUSD;
    } else if (divYearRow.grossILS > 0) { // פירוט בש\"ח בלבד — המרה גסה לדולר בשער נוכחי
      divGrossUSD = divYearRow.grossILS / usdToday;
      divTaxUS = 0;
      divNetUSD = divYearRow.netILS / usdToday;
    }
    divNetILS = divYearRow.netILS > 0 ? divYearRow.netILS : divNetUSD * usdToday;
    Logger.log('✅ taxData: דיבידנדים לשנת ' + currentYear + ': גולמי $' + divGrossUSD.toFixed(2) + ' | מס שנוכה $' + divTaxUS.toFixed(2) + ' | ' + divYearRow.count + ' תשלומים');
  } else {
    Logger.log('⚠️ taxData: אין פירוט דיבידנדים לשנת ' + currentYear + ' — מס דיבידנדים מחושב על כל ההיסטוריה (לא מדויק לשנה)');
  }

  // ✅ v11.6.6.0: פילוח חודשי של דיבידנדים השנה (לגרף בטאב מס)
  var divMonthly = [];
  try {
    var _details = _getDividendDetails() || [];
    var _mMap = {};
    _details.forEach(function(r) {
      if (r.year !== currentYear) return;
      var _m = r.date.substring(3, 5); // MM מתוך dd/MM/yyyy
      if (!_mMap[_m]) _mMap[_m] = { month: _m, grossUSD: 0, taxUSD: 0, netUSD: 0 };
      _mMap[_m].grossUSD += r.grossUSD;
      _mMap[_m].taxUSD += r.taxUSD;
      _mMap[_m].netUSD += r.netUSD;
    });
    divMonthly = Object.keys(_mMap).sort().map(function(k) { return _mMap[k]; });
  } catch (e3) { Logger.log('taxData: monthly err: ' + e3); }

  // מס ישראלי על דיבידנד: 25% על הגולמי, פחות מס ארה"ב שכבר שולם (זיכוי)
  var divTaxILS_gross = divGrossUSD * usdToday * 0.25;
  var divTaxUS_ILS = divTaxUS * usdToday;
  var divTaxILS_net = Math.max(0, divTaxILS_gross - divTaxUS_ILS); // מס נוסף לתשלום בישראל

  // ══════ 3. חישוב FIFO — לכל סימבול, מה שנמכר מתחבר לקנייה הכי ישנה ══════
  var fifoResult = { matches: [], summary: { totalSold: 0, totalGainILS: 0 } };
  try { fifoResult = calculateFIFO(); } catch(e) { Logger.log('taxData: fifo err: '+e); }

  // ══════ 4. רווח הון השנה — מס 25% ══════
  var capitalGainsThisYearILS = rgThisYear.totalILS;
  var capitalGainsTaxILS = capitalGainsThisYearILS * 0.25;
  var capitalGainsTaxUSD = rgThisYear.totalUSD * 0.25;

  // ══════ 5. רווחים לא ממומשים (אם תמכור הכל היום) ══════
  // ✅ רווח לא ממומש = (שווי IBKR - עלות IBKR) + רווח/הפסד FAIR — נטו, בלי לספור פעמיים
  var unrealizedGainsILS = 0;
  try {
    var ibkrSheet = SS.getSheetByName('IBKR');
    if (ibkrSheet) {
      var ibkrLast = ibkrSheet.getLastRow();
      if (ibkrLast > 9) {
        var ibkrRows = ibkrSheet.getRange(10, 1, ibkrLast - 9, 15).getValues();
        var ibkrValTotal = 0, ibkrCostTotal = 0;
        ibkrRows.forEach(function(row) {
          var sym = String(row[0] || '').trim();
          var type = String(row[2]).trim();
          if (!sym || sym === 'סה"כ' || type === 'מזומן') return; // ✅ דלג על שורת הסיכום ומזומן
          ibkrValTotal += parseFloat(row[11]) || 0;
          ibkrCostTotal += parseFloat(row[8]) || 0;
        });
        unrealizedGainsILS += (ibkrValTotal - ibkrCostTotal); // נטו — כולל הפסדים
      }
    }
    var fairSheet = SS.getSheetByName('FAIR');
    if (fairSheet) {
      var fairLast = fairSheet.getLastRow();
      if (fairLast >= 7) {
        var fairRows = fairSheet.getRange(7, 1, fairLast - 6, 9).getValues();
        fairRows.forEach(function(row) {
          var name = String(row[0] || '').trim();
          if (!name || name === 'מזומן') return;
          unrealizedGainsILS += parseFloat(row[7]) || 0; // pl column, נטו
        });
      }
    }
  } catch(e) { Logger.log('taxData: ibkr err: '+e); }
  var unrealizedTaxILS = unrealizedGainsILS * 0.25;

  // ══════ 6. סיכום מס ══════
  var totalTaxPaidUS_ILS = divTaxUS_ILS; // מס ששולם בארה"ב
  var totalTaxDueILS = capitalGainsTaxILS + divTaxILS_net; // מס לתשלום בישראל
  var totalTaxAllILS = totalTaxPaidUS_ILS + totalTaxDueILS;

  // ══════ 7. יתרות מס זר (Foreign Tax Credit) ══════
  // אם שילמת יותר מס בארה"ב ממה שצריך בישראל, יש לך יתרת זיכוי
  var foreignTaxCreditUsed = Math.min(divTaxUS_ILS, divTaxILS_gross);
  var foreignTaxCreditRemaining = Math.max(0, divTaxUS_ILS - divTaxILS_gross);

  return {
    meta: { usdToday: usdToday, taxYear: currentYear },
    capitalGains: {
      thisYear: { totalUSD: rgThisYear.totalUSD, totalILS: rgThisYear.totalILS, entries: rgThisYear.entries },
      prevYears: { totalUSD: rgPrevYears.totalUSD, totalILS: rgPrevYears.totalILS },
      taxRate: 0.25,
      taxDueILS: capitalGainsTaxILS,
      taxDueUSD: capitalGainsTaxUSD
    },
    dividends: {
      scope: divScope,
      taxYear: currentYear,
      thisYear: divYearRow,
      monthly: divMonthly,
      grossUSD: divGrossUSD,
      taxPaidUS: divTaxUS,
      taxPaidUS_ILS: divTaxUS_ILS,
      netUSD: divNetUSD,
      netILS: divNetILS,
      taxRateILS: 0.25,
      taxDueILS_gross: divTaxILS_gross,
      taxDueILS_net: divTaxILS_net,
      foreignTaxCreditUsed: foreignTaxCreditUsed,
      foreignTaxCreditRemaining: foreignTaxCreditRemaining
    },
    fifo: fifoResult,
    unrealized: {
      gainsILS: unrealizedGainsILS,
      potentialTaxILS: unrealizedTaxILS
    },
    totals: {
      taxPaidForeign_ILS: totalTaxPaidUS_ILS,
      taxDueILS: totalTaxDueILS,
      taxAll_ILS: totalTaxAllILS,
      realizedGainsThisYear_ILS: capitalGainsThisYearILS,
      dividendsNet_ILS: divNetILS,
      totalTaxableIncome_ILS: capitalGainsThisYearILS + divNetILS
    }
  };
}

// ═══ ✅ v11.6.6.0: מחשבון "מה אם" — מכירה היפותטית לפי FIFO ═══
// קליינט מעביר סימבול, כמות ומחיר נוכחי (מהדשבורד). מחזיר לוטים שיימכרו, רווח ומס 25%.
// ═══════════════════════════════════════════════════════════════
//  ✅ v12.0.0.2 — עמוד/מודאל פרטי נייר: לחיצה על נייר בכל טאב פותחת
//  תמונת מצב מלאה — לוטים, מכירות ורווח ממומש, דיבידנדים, ומס משוער.
// ═══════════════════════════════════════════════════════════════
function getPositionDetail(token, symbol) {
  var g = _gate(token); if (g) return g;
  try {
    symbol = String(symbol || '').trim().toUpperCase();
    if (!symbol) return JSON.stringify({ error: 'לא צוין נייר' });
    var _demoF = _demoFactor(token);
    var usdToday = getCurrentUSDILS();
    var _grandTotal = 0; // ✅ v12.1.0.0: לחישות ריכוז — % מסך התיק

    // ── מחיר נוכחי + מיקום (IBKR / FAIR) ──
    var current = { price: 0, qty: 0, source: '', name: symbol, valILS: 0, avgCostUSD: 0 };
    try {
      var pd = _getPortfolioData();
      if (pd && pd.ibkr && pd.ibkr.positions) {
        var ibP = pd.ibkr.positions.find(function(p){ return String(p.sym||'').toUpperCase() === symbol; });
        if (ibP) { current = { price: ibP.curP||0, qty: ibP.qty||0, source: 'IBKR', name: ibP.sym, valILS: ibP.valILS||0, avgCostUSD: ibP.buyP||0 }; }
      }
      if (pd && pd.summary && pd.summary.grandTotal) _grandTotal = pd.summary.grandTotal;
      if (!current.qty && pd && pd.fair && pd.fair.positions) {
        var faP = pd.fair.positions.find(function(p){ return String(p.name||'').toUpperCase() === symbol; });
        if (faP) { current = { price: 0, qty: faP.qty||0, source: 'FAIR', name: faP.name, valILS: faP.valILS||0, avgCostUSD: 0, plILS: faP.pl||0, type: faP.type||'' }; }
      }
    } catch (eP) { Logger.log('getPositionDetail: portfolio data err: ' + eP); }

    // ── לוטי קנייה פתוחים (מ"עלויות קנייה", לאחר הפחתת מכירות FIFO) ──
    var lots = [];
    try {
      var sheet = _findSheetByNames(['עלויות_קנייה_מעדכן', 'עלויות_קנייה_מעודכן', 'עלויות קנייה מעודכן', 'עלויות קנייה (מעודכן)']);
      if (!sheet) sheet = SS.getSheetByName('עלויות קנייה');
      if (sheet) {
        var lastRow = sheet.getLastRow();
        if (lastRow >= 5) {
          var data = sheet.getRange(5, 1, lastRow - 4, 9).getValues();
          data.forEach(function(row) {
            if (String(row[0] || '').trim().toUpperCase() !== symbol) return;
            var lqty = parseFloat(row[3]) || 0;
            if (lqty <= 0) return;
            lots.push({ qty: lqty, price: parseFloat(row[4]) || 0, date: row[5] ? Utilities.formatDate(new Date(row[5]), 'Asia/Jerusalem', 'dd/MM/yyyy') : '', usdIls: parseFloat(row[6]) || 0, costILS: parseFloat(row[8]) || 0 });
          });
          lots.sort(function(a, b) { var da = _parseSheetDate(a.date), db = _parseSheetDate(b.date); return (da?da.getTime():0) - (db?db.getTime():0); });
          var soldQty = (getSales()[symbol] || 0);
          for (var i = 0; i < lots.length && soldQty > 0; i++) {
            var take = Math.min(soldQty, lots[i].qty);
            // ✅ פרופורציה: costILS מיוחס במקור לכמות המלאה של הלוט — משאירים רק את החלק שתואם לכמות שנשארה
            lots[i].costILS = lots[i].qty > 0 ? lots[i].costILS * ((lots[i].qty - take) / lots[i].qty) : 0;
            lots[i].qty -= take; soldQty -= take;
          }
          lots = lots.filter(function(l){ return l.qty > 0.0001; });
        }
      }
    } catch (eL) { Logger.log('getPositionDetail: lots err: ' + eL); }

    // ── מכירות ורווח ממומש (FIFO מלא, לפי נייר) ──
    var sales = [];
    try {
      var fifo = calculateFIFO();
      (fifo.matches || []).forEach(function(m) {
        if (String(m.sym || '').toUpperCase() !== symbol) return;
        sales.push({ buyDate: m.buyDate, buyPrice: m.buyPrice, sellDate: m.sellDate, sellPrice: m.sellPrice, qty: m.sellQty, costILS: Math.round(m.costILS), proceedsILS: Math.round(m.proceedsILS), gainILS: Math.round(m.gainILS), usdIlsSell: m.usdIlsSell });
      });
    } catch (eS) { Logger.log('getPositionDetail: sales err: ' + eS); }
    var totalRealizedGainILS = sales.reduce(function(s, r){ return s + (r.gainILS || 0); }, 0);

    // ── דיבידנדים (מטבלת הפירוט, לפי נייר) ──
    var dividends = [];
    try {
      var dd = _getDividendDetails(); // ✅ מחזיר מערך שורות ישירות (או null/false אם אין טבלת פירוט)
      if (dd && dd.length) {
        dd.forEach(function(r) {
          if (String(r.sym || '').trim().toUpperCase() !== symbol) return;
          dividends.push({ date: r.date || '', grossUSD: r.grossUSD || 0, taxUSD: r.taxUSD || 0, netUSD: r.netUSD || 0 });
        });
      }
    } catch (eD) { Logger.log('getPositionDetail: dividends err: ' + eD); }
    var totalDivGrossUSD = dividends.reduce(function(s, r){ return s + r.grossUSD; }, 0);
    var totalDivNetUSD = dividends.reduce(function(s, r){ return s + r.netUSD; }, 0);

    // ── עלות/רווח לא ממומש על ההחזקה הפתוחה ──
    // ✅ v12.0.0.4: FAIR — אין לוטים ב"עלויות קנייה" (זה גיליון IBKR). עלות ההחזקה
    // נגזרת מהגיליון FAIR עצמו: עלות = שווי נוכחי − רווח. יוצרים "לוט" סינתטי אחד
    // כדי שהמודאל ומחשבון "מה אם" יעבדו לקרנות בדיוק כמו לניירות IBKR.
    if (!lots.length && current.source === 'FAIR' && current.valILS > 0) {
      var fairCost = current.valILS - (current.plILS || 0);
      if (fairCost < 0) fairCost = 0;
      var fairOpenQty = current.qty || 0;
      lots.push({
        qty: fairOpenQty,
        price: fairOpenQty > 0 ? Math.round((fairCost / fairOpenQty) * 100) / 100 : 0,
        date: '', usdIls: 0, costILS: fairCost, synthetic: true
      });
    }
    var openCostILS = lots.reduce(function(s, l){ return s + (l.costILS || 0); }, 0); // ✅ costILS כבר מיוחס לכמות הנשארת (ראו פרופורציה למעלה)
    var openQty = lots.reduce(function(s, l){ return s + l.qty; }, 0) || current.qty || 0;
    var currentValILS = current.valILS || (current.price * openQty * usdToday);
    var unrealizedGainILS = currentValILS - openCostILS;
    var estTaxIfSoldTodayILS = unrealizedGainILS > 0 ? Math.round(unrealizedGainILS * 0.25) : 0;

    var out = {
      symbol: symbol,
      current: current,
      sharePct: _grandTotal > 0 ? Math.round((currentValILS / _grandTotal) * 1000) / 10 : 0, // ✅ v12.1.0.0: ריכוז — % מסך התיק
      lots: lots,
      sales: sales,
      dividends: dividends,
      totals: {
        openQty: Math.round(openQty * 10000) / 10000,
        openCostILS: Math.round(openCostILS),
        currentValILS: Math.round(currentValILS),
        unrealizedGainILS: Math.round(unrealizedGainILS),
        estTaxIfSoldTodayILS: estTaxIfSoldTodayILS,
        totalRealizedGainILS: Math.round(totalRealizedGainILS),
        totalDivGrossUSD: Math.round(totalDivGrossUSD * 100) / 100,
        totalDivNetUSD: Math.round(totalDivNetUSD * 100) / 100
      },
      usdToday: usdToday
    };
    if (_demoF > 0) out = _demoTransform(out, _demoF);
    return JSON.stringify(out);
  } catch (e) {
    return JSON.stringify({ error: String(e) });
  }
}

// ═══════════════════════════════════════════════════════════════
//  ✅ v12.0.0.3 — ניתוח וחדשות לפי נייר: חיפוש חדשות עבריות (Google News RSS,
//  hl=iw&gl=IL) על הנייר/החברה הספציפית — משמש בעמוד פרטי הנייר.
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
//  ✅ v12.1.0.0 — גרף מחיר + נתוני שוק לנייר IBKR: שנה של נתוני
//  סגירה יומיים מ-Yahoo. מציג 6 חודשים אחרונים בגרף + שיא/שפל 52 שבועות
//  + שינוי יומי. FAIR — אין מקור מחירים היסטורי לפי שם קרן → supported:false.
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
//  ✅ v12.2.0.0 — 🤖 AI_ANALYST: חיבור הסוכן חבצלת לתוך האפליקציה
//  בלי הרשמה לשירות חיצוני — ה-API של הסופר-אייג'נט ב-Base44.
//  דרוש רק מפתח (AGENT_API_KEY) ב-Script Properties + הרצת AI_testConnection
//  פעם אחת. שאלות בשפה פשוטה ומורכבת, תשובה בעברית בתוך האפליקציה.
// ═══════════════════════════════════════════════════════════════
var AI_AGENT_ID = '6a842d761d7eee2c44efba6d'; // הסופר-אייג'נט חבצלת
var AI_API_BASE = 'https://app.base44.com/api/agents/' + AI_AGENT_ID;

// ✅ v12.2.0.0: תמצית נתוני תיק קומפקטית להקשר — כל מה שדרוש לתשובות מדויקות
function _buildAnalystCtxRaw() {
  try {
    var d = _getPortfolioData();
    var s = d.summary || {}, ib = d.ibkr || {}, fa = d.fair || {}, dv = d.dividends || {};
    var L = [];
    try {
      var _bkA = getBankAccounts() || [];
      if (_bkA.length) L.push('בנקים (גיליון חשבונות בנק): ' + _bkA.map(function (b) { return b.institution + (b.accType ? ' (' + b.accType + ')' : '') + ' ' + (b.ccy === 'ILS' ? '₪' + Math.round(b.balance) : '$' + Math.round(b.balance)); }).join(' | '));
    } catch (eBk) {}
    L.push('=== פנסיה וביטוח (חולץ ' + PENSION_DATA.asOf + ') ===');
    try {
      var _P = _pensionPayload();
      var _O = _P.ofir.pension;
      L.push('פנסיה אופיר: מגדל מקפת אישית | יתרה ₪' + _O.balance + ' | קצבה צפויה ₪' + _O.monthlyPension + '/חודש | נכות ₪' + _O.disabilityMonthly + ' | שארים בת זוג ₪' + _O.survivorSpouse);
      L.push('דמי ניהול: הפקדה ' + _O.feeDepositPct + '% (גבוה) | צבירה ' + _O.feeAccumPct + '% (מצוין) | הוראת מוטבים: ' + (_O.beneficiaryDirective ? 'קיימת' : 'חסרה!'));
      L.push('ביטוח חיים "אור 1": כיסוי מוות ₪' + _P.ofir.life[0].deathBenefit + ' | פרמיה ₪' + _P.ofir.life[0].premium);
      L.push('בריאות: אופיר 19391460 | רויטל 19393464 (תאונות אישיות פלטינום) | אורי 24193003 (בריאות פרטית מלאה + מזור מורחב + מזור לסרטן)');
      var _R = _P.revital.pension;
      var _H = _P.ofir.hishtalmut || {};
      L.push('השתלמות הראל: יתרה ₪' + _H.balance + ' (23/09/2026) | מסלול ' + _H.track + ' | תשואה מתחילת שנה ' + _H.returnYTD + ' | דמי ניהול ' + _H.feeDepositPct + '% הפקדות / ' + _H.feeAccumPct + '% צבירה | נזילות ' + _H.liquidity + ' | ' + _H.tax);
      var _X = _P.ofir.phoenixPension || {};
      L.push('פניקס פנסיה מקיפה: קרן רדומה ₪' + _X.balance + ' (30/06/2026) | קצבה צפויה ₪' + _X.monthlyPension + '/חודש בגיל 67 | דמי ניהול 0%/0.20% | הפקדות הופסקו ' + _X.depositsStopped);
      var _M = _P.menoraHealth || {};
      L.push('ביטוח בריאות משפחתי מנורה ' + _M.policy + ': אופיר + רויטל + רומי + נועם דוד · ₪' + _M.yearTotal + '/שנה · קרן אור טופ (מחלות קשות) ₪236,143 לכל מבוטח · ' + _M.renewal);
      L.push('מו\"מ דמי ניהול: קלישר דוחף ל-1.4% שוטף + 0.10% צבירה לאופיר ולרויטל יחד (מאז 08/2025, ממתין לאישור מגדל)');
      L.push('פנסיה רויטל: מגדל מקפת אישית | יתרה ₪' + _R.balance + ' (30/06/2026) | קצבה צפויה ₪' + _R.monthlyPension + ' בגיל 64 | נכות ₪' + _R.disabilityMonthly + ' | שארים בן זוג ₪' + _R.survivorSpouse + ' | הפקדות ₪' + _R.lastDeposit + '/חודש | דמי ניהול 1.5%/0.14%');
      L.push('ביטוח חיים רויטל: מגדל ₪2,000,000 (אושר ע״י אופיר 28/09/2026, מספר פוליסה ממתין לאימות) · פוליסת הראל פרטית 895373434: תרופות + השתלות, ~₪162/שנה');
    } catch (eP) { L.push('פנסיה: שגיאת קריאה ' + eP); }
    L.push('=== תמצית תיק אוטומטית (נכון לעכשיו) ===');
    L.push('USD/ILS: ' + (d.meta ? d.meta.usdIls : '?'));
    L.push('סה"כ תיק: ' + Math.round(s.grandTotal || 0) + ' ILS | IBKR: ' + Math.round(s.ibkrVal || 0) + ' | FAIR: ' + Math.round(s.fairVal || 0) + ' | מזומן/בנקים: ' + Math.round((d.cash ? d.cash.total : 0) || 0));
    if (ib.xirr && ib.xirr.xirrPct !== null && ib.xirr.xirrPct !== undefined) L.push('XIRR כולל: ' + Number(ib.xirr.xirrPct).toFixed(1) + '% | XIRR שנתי: ' + (ib.xirrYear && ib.xirrYear.xirrPct !== null ? Number(ib.xirrYear.xirrPct).toFixed(1) + '%' : 'אין'));
    L.push('ניירות IBKR (' + (ib.positions ? ib.positions.length : 0) + '):');
    if (ib.positions) ib.positions.forEach(function (p) {
      L.push('- ' + p.sym + ' | qty ' + p.qty + ' | ₪' + Math.round(p.valILS || 0) + ' | תשואה ' + (Number(p.retPct) * 100).toFixed(1) + '%');
    });
    if (fa.positions && fa.positions.length) {
      L.push('קרנות FAIR (' + fa.positions.length + '):');
      fa.positions.forEach(function (p) {
        L.push('- ' + p.name + ' | ₪' + Math.round(p.valILS || 0) + ' | רווח ' + (Number(p.plPct) * 100).toFixed(1) + '%');
      });
    }
    if (dv.totals && dv.totals.netUSD) L.push('דיבידנדים: נטו 12 חודשים $' + Math.round(dv.totals.netUSD));
    // ✅ v12.5.0.0: התראות חכמות + שינוי שבועי — זורמים גם לדוחות הוואטסאפ של חבצלת
    try {
      var _sa = _smartAlerts(d, { light: true });
      if (_sa.length) {
        L.push('=== התראות חכמות (' + _sa.length + ') ===');
        _sa.forEach(function (a) { L.push(a.icon + ' ' + a.title + ' — ' + a.detail); });
      }
    } catch (eSA) {}
    try {
      var histCtx = (getHistoricalData() || {}).history || [];
      if (histCtx.length >= 2) {
        var nowCtx = new Date(), wkCtx = null;
        for (var iC = histCtx.length - 1; iC >= 0; iC--) {
          var dtC = parseHistDate(histCtx[iC].date);
          if ((nowCtx - dtC) >= 6 * 86400000) { wkCtx = histCtx[iC]; break; }
        }
        if (wkCtx && wkCtx.totalValue > 0) {
          var dDelta = (s.grandTotal || 0) - wkCtx.totalValue;
          L.push('שינוי שבועי מול ' + _fmtHistDate(wkCtx.date) + ': ' + (dDelta >= 0 ? '+' : '') + Math.round(dDelta) + ' ILS (' + (dDelta / wkCtx.totalValue * 100).toFixed(2) + '%)');
        }
      }
    } catch (eW) {}
    return L.join('\n');
  } catch (e) { return '(תמצית התיק לא זמינה: ' + e + ')'; }
}
// ✅ v13.4.7.0: קאשינג 90 שניות לתשלום ניתוח — טעינה ראשונה 6.9ש' → ~1ש' בחלון הקאש
function _buildAnalystCtx(bustCache) {
  var cache = null;
  try { cache = CacheService.getScriptCache(); } catch (e) {}
  if (cache && !bustCache) {
    try { var hit = cache.get('ANALYST_CTX_V2'); if (hit) return hit; } catch (e) {}
  }
  var out = _buildAnalystCtxRaw();
  if (cache && !bustCache) {
    try { cache.put('ANALYST_CTX_V2', out, 90); } catch (e) { Logger.log('ctx cache put: ' + e); }
  }
  return out;
}
function _bustAnalystCtx() {
  try { CacheService.getScriptCache().remove('ANALYST_CTX_V2'); } catch (e) {}
}


// ✅ v12.2.0.3: שליפת שיחת האנליסט — GET /conversations מחזיר מערך; שומרים את הראשונה
// (/conversations/default אינו קיים לסוכן הזה — מחזיר 500. לא בשימוש יותר.)
function _analystConvId(key) {
  var props = PropertiesService.getScriptProperties();
  var cid = props.getProperty('AGENT_CONV_ID');
  if (cid) return cid;
  var r = UrlFetchApp.fetch(AI_API_BASE + '/conversations', { method: 'get', headers: { 'Authorization': 'Bearer ' + key }, muteHttpExceptions: true });
  var j = JSON.parse(r.getContentText() || '[]');
  var arr = (Array.isArray(j) ? j : (j.conversations || [j]));
  var id = null;
  if (arr.length && typeof arr[0] === 'object') id = arr[0].id || arr[0]._id || null;
  if (!id) throw new Error('GET /conversations החזיר ' + r.getResponseCode() + ': ' + String(r.getContentText()).substring(0, 150));
  props.setProperty('AGENT_CONV_ID', String(id));
  return String(id);
}

// ✅ v12.2.0.4: חילוץ טקסט התשובה — סריקה רקורסיבית עמידה לשינויי סכמה
function _extractAssistantText(j) {
  var res = _deepFindAssistant(j, 0);
  return res;
}
function _deepFindAssistant(node, depth) {
  if (depth > 6 || node === null || node === undefined) return null;
  if (typeof node === 'string') return node.trim() ? node : null;
  if (Array.isArray(node)) {
    for (var i = node.length - 1; i >= 0; i--) {
      var r = _deepFindAssistant(node[i], depth + 1);
      if (r) return r;
    }
    return null;
  }
  if (typeof node === 'object') {
    // אובייקט הודעה של הסוכן
    var role = (node.role || node.sender || node.author || '').toString().toLowerCase();
    var txt = node.text || node.content || node.message || node.answer || node.response;
    if (typeof txt === 'string' && txt.trim() && (role === 'assistant' || role === 'agent' || role === 'ai')) return txt;
    // טקסט ישיר ברמה העליונה (תשובת POST סינכרונית) — אבל לא אם זו הודעת משתמש
    if (depth === 0 && role !== 'user' && role !== 'human') {
      for (var k in node) {
        var v = node[k];
        if (typeof v === 'string' && v.trim() && (k === 'text' || k === 'content' || k === 'message' || k === 'answer')) return v;
      }
    }
    // המשך חיפוש עמוק — קודם שדות סבירים
    var order = ['assistant_message', 'message', 'data', 'result', 'conversation', 'messages'];
    for (var o = 0; o < order.length; o++) {
      if (node[order[o]] !== undefined && node[order[o]] !== null) {
        var rr = _deepFindAssistant(node[order[o]], depth + 1);
        if (rr) return rr;
      }
    }
    for (var kk in node) {
      if (order.indexOf(kk) === -1) {
        var rv = _deepFindAssistant(node[kk], depth + 1);
        if (rv) return rv;
      }
    }
  }
  return null;
}

// ✅ v12.2.0.0: הפונקציה הראשית — שואלת את חבצלת ומחזירה תשובה
function AI_askAnalyst(token, question) {
  var g = _gate(token); if (g) return g;
  try {
    question = String(question || '').trim().substring(0, 1000);
    if (!question) return JSON.stringify({ error: 'שאלה ריקה' });
    var props = PropertiesService.getScriptProperties();
    var key = props.getProperty('AGENT_API_KEY');
    if (!key) return JSON.stringify({ error: 'חסר מפתח AGENT_API_KEY ב-Script Properties — יש להדביק את מפתח ה-API של הסוכן (מסביבת העורך ב-Base44) ולהריץ AI_testConnection' });

    var cid = _analystConvId(key);
    var msg = 'הודעה אוטומטית מהאפליקציה שלי (כרגע בתוך המסך של טאב הניתוח). '
      + 'ענה בעברית, ישירות לשאלה ובקצרה (עד ~120 מילים, אלא אם נדרש פירוט). '
      + 'אל תציע לפתוח את הצ\'אט שלך או לשלוח פקודות טלגרם — התשובה מוצגת בתוך האפליקציה. '
      + 'אם חסר לך נתון כדי לענות, כתוב בדיוק מה חסר.\n\n'
      + _buildAnalystCtx() + '\n\n=== שאלה ===\n' + question;

    // ✅ v12.2.0.5: כיול אוטומטי — ניסיון עם שמות שדה אפשריים (422 = ההודעה לא נוצרה, בטוח לנסות שוב)
    var variants = [
      { message: msg }, { text: msg }, { content: msg },
      { message: msg, text: msg }
    ];
    var code = 0, body = '{}', j = null;
    for (var vi = 0; vi < variants.length; vi++) {
      var resp = UrlFetchApp.fetch(AI_API_BASE + '/conversations/' + cid + '/messages', {
        method: 'post', contentType: 'application/json',
        headers: { 'Authorization': 'Bearer ' + key },
        payload: JSON.stringify(variants[vi]),
        muteHttpExceptions: true
      });
      code = resp.getResponseCode();
      body = resp.getContentText() || '{}';
      if (code === 200) { j = JSON.parse(body); break; }
      if (code === 422) {
        try { Logger.log('422 בניסיון #' + (vi + 1) + ' (' + Object.keys(variants[vi]).join('+') + '): ' + body.substring(0, 400)); } catch (e3) {}
        continue; // ההודעה לא נוצרה — נסה שם שדה הבא
      }
      // תשובה ארוכה מדי? ההודעה נשלחה והסוכן עדיין מעבד — נאסוף ב-polling
      if (code >= 500 || code === 408) return JSON.stringify({ pending: true });
      return JSON.stringify({ error: 'API החזיר ' + code + ': ' + body.substring(0, 300) });
    }
    if (code !== 200) {
      // ✅ v12.2.0.5: ניסיון אחרון — אולי ההודעה ארוכה מדי? שאלה בלבד, בלי הקשר
      var short = 'שאלה מהאפליקציה (ללא תמצית נתונים): ' + question;
      var resp2 = UrlFetchApp.fetch(AI_API_BASE + '/conversations/' + cid + '/messages', {
        method: 'post', contentType: 'application/json',
        headers: { 'Authorization': 'Bearer ' + key },
        payload: JSON.stringify({ message: short, text: short }),
        muteHttpExceptions: true
      });
      code = resp2.getResponseCode();
      body = resp2.getContentText() || '{}';
      if (code === 200) j = JSON.parse(body);
      else {
        try { Logger.log('גם ניסיון קצר נכשל ' + code + ': ' + body.substring(0, 400)); } catch (e4) {}
        return JSON.stringify({ error: 'API החזיר ' + code + ' בכל הפורמטים — שלח לוג' });
      }
    }
    var text = _extractAssistantText(j);
    if (text) return JSON.stringify({ answer: text });
    // ✅ v12.2.0.4: כיול — לוג גולמי של 500 תווים כדי לראות את סכמת התשובה בפועל
    try { Logger.log('AI raw response (' + body.length + ' chars): ' + body.substring(0, 500)); } catch (e2) {}
    return JSON.stringify({ pending: true }); // נשלח אך תשובה לא נכללה בתשובה סינכרונית
  } catch (e) {
    return JSON.stringify({ error: String(e).substring(0, 250) });
  }
}

// ✅ v12.2.0.4: איסוף תשובה ב-polling — GET /conversations/{id} (ניתוב /messages לא קיים)
function AI_getAnalystReply(token) {
  var g = _gate(token); if (g) return g;
  try {
    var props = PropertiesService.getScriptProperties();
    var key = props.getProperty('AGENT_API_KEY');
    var cid = props.getProperty('AGENT_CONV_ID');
    if (!key || !cid) return JSON.stringify({ pending: true });
    var resp = UrlFetchApp.fetch(AI_API_BASE + '/conversations/' + cid, { method: 'get', headers: { 'Authorization': 'Bearer ' + key }, muteHttpExceptions: true });
    if (resp.getResponseCode() !== 200) return JSON.stringify({ pending: true });
    var j = JSON.parse(resp.getContentText() || '{}');
    // מחפשים מערך הודעות בכל עומק — ומתוכו את ההודעה האחרונה של הסוכן
    var msgs = _findMessagesArray(j, 0);
    if (!msgs) return JSON.stringify({ pending: true });
    var lastAssistant = null;
    for (var i = msgs.length - 1; i >= 0; i--) {
      var m = msgs[i] || {};
      var role = (m.role || m.sender || '').toString().toLowerCase();
      var txt = m.text || m.content;
      if ((role === 'assistant' || role === 'agent' || role === 'ai') && typeof txt === 'string' && txt.trim()) {
        lastAssistant = txt;
        break;
      }
    }
    if (lastAssistant) return JSON.stringify({ answer: lastAssistant });
    return JSON.stringify({ pending: true });
  } catch (e) {
    return JSON.stringify({ pending: true });
  }
}
function _findMessagesArray(node, depth) {
  if (depth > 5 || !node || typeof node !== 'object') return null;
  if (Array.isArray(node)) {
    if (node.length && typeof node[0] === 'object' && ((node[0].role !== undefined) || (node[0].text !== undefined))) return node;
    return null;
  }
  var direct = node.messages || (node.conversation && node.conversation.messages) || (node.data && node.data.messages);
  if (Array.isArray(direct) && direct.length) return direct;
  for (var k in node) {
    var r = _findMessagesArray(node[k], depth + 1);
    if (r) return r;
  }
  return null;
}

// ✅ v12.2.0.3: בדיקת חיבור — להרצה מהעורך. מדפיסה הכל ללוג.
// ✅ v12.2.1.1: יוצר ושומר את AGENT_READ_TOKEN בעצמו — עוקף את באג השמירה של Script Properties.
// מריץ מהאדיטור, לא דורש פריסה.
function AI_setupReadToken() {
  var props = PropertiesService.getScriptProperties();
  var token = (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, '');
  props.setProperty('AGENT_READ_TOKEN', token);
  Logger.log('🎉 AGENT_READ_TOKEN נשמר בהצלחה (' + token.length + ' תווים)');
  Logger.log('📋 העתק את השורה הבאה ושלח אותה לחבצלת בוואטסאפ:');
  Logger.log('TOKEN=' + token);
  var out = doGet({ parameter: { api: token } });
  var body = out.getContent();
  Logger.log(body.indexOf('"ok":true') >= 0 ? '✅ נקודת הקריאה עובדת — חבצלת תוכל לקרוא את התיק' : '⚠️ בעיה: ' + body.substring(0, 300));
}

// ✅ v12.2.1.0: בדיקת נקודת הקצה לקריאה חיצונית — מריץ מהאדיטור, לא דורש פריסה
function AI_testRead() {
  var token = PropertiesService.getScriptProperties().getProperty('AGENT_READ_TOKEN');
  if (!token) { Logger.log('❌ חסר AGENT_READ_TOKEN — הרץ את AI_setupReadToken וזה יישמר אוטומטית'); return; }
  Logger.log('🔑 טוקן קיים (' + token.length + ' תווים)');
  var out = doGet({ parameter: { api: token } });
  var body = out.getContent();
  Logger.log('📋 תשובת ה-API: ' + body.substring(0, 400));
  Logger.log(body.indexOf('"ok":true') >= 0 ? '🎉 נקודת הקריאה עובדת! חבצלת יכולה לקרוא את התיק' : '⚠️ תשובה ללא ok:true — בדוק את הלוג');
}

function AI_testConnection() {
  var props = PropertiesService.getScriptProperties();
  var key = props.getProperty('AGENT_API_KEY');
  Logger.log('════ AI_testConnection v12.2.0.4 ════');
  if (!key) {
    Logger.log('❌ חסר AGENT_API_KEY ב-Script Properties!');
    return;
  }
  Logger.log('✅ AGENT_API_KEY קיים (אורך ' + key.length + ' תווים)');
  try {
    var cid = _analystConvId(key);
    Logger.log('✅ AGENT_CONV_ID: ' + cid);
    // ✅ v12.2.0.4: בדיקת קריאת השיחה — GET /conversations/{id} (הניתוב .../messages לא קיים, החזיר 404)
    var r = UrlFetchApp.fetch(AI_API_BASE + '/conversations/' + cid, { method: 'get', headers: { 'Authorization': 'Bearer ' + key }, muteHttpExceptions: true });
    Logger.log('GET /conversations/{id} → HTTP ' + r.getResponseCode());
    if (r.getResponseCode() === 200) {
      Logger.log('🎉 הכל מחובר! נסה שאלה מהאפליקציה (טאב ניתוח → שאל את חבצלת).');
    } else {
      Logger.log('תשובה (300 תווים): ' + String(r.getContentText()).substring(0, 300));
    }
  } catch (e) {
    Logger.log('❌ שגיאה: ' + e);
  }
  Logger.log('════ סוף בדיקה ════');
}

function getPositionChart(token, symbol) {
  var g = _gate(token); if (g) return g;
  try {
    symbol = String(symbol || '').trim().toUpperCase();
    if (!symbol) return JSON.stringify({ error: 'לא צוין נייר' });
    var cache = CacheService.getScriptCache();
    var key = 'POSCHART_' + symbol;
    var cached = cache.get(key);
    if (cached) return cached;

    var text = _yahooFetch('/v8/finance/chart/' + encodeURIComponent(symbol) + '?range=1y&interval=1d');
    if (!text) return JSON.stringify({ supported: false, reason: 'שירות נתוני שוק לא זמין כרגע' });
    var j = JSON.parse(text);
    var r = (((j.chart || {}).result) || [])[0];
    if (!r || !r.timestamp) return JSON.stringify({ supported: false, reason: 'אין נתוני שוק לנייר זה' });
    var cl = (((r.indicators || {}).quote) || [])[0].close;
    if (!cl) return JSON.stringify({ supported: false, reason: 'אין נתוני שוק לנייר זה' });

    var pts = [], highs = 0, lows = 0;
    var high52 = -Infinity, low52 = Infinity;
    for (var i = 0; i < r.timestamp.length; i++) {
      if (cl[i] === null || cl[i] === undefined) continue;
      var dt = new Date(r.timestamp[i] * 1000);
      var dStr = Utilities.formatDate(dt, 'Asia/Jerusalem', 'dd/MM');
      pts.push({ d: dStr, p: cl[i] });
      if (cl[i] > high52) high52 = cl[i];
      if (cl[i] < low52) low52 = cl[i];
    }
    if (pts.length < 2) return JSON.stringify({ supported: false, reason: 'אין מספיק נתוני שוק' });

    var curPrice = pts[pts.length - 1].p;
    var prevClose = pts[pts.length - 2].p;
    var dayChgPct = prevClose > 0 ? ((curPrice - prevClose) / prevClose) * 100 : 0;
    var posInRange = curPrice > 0 && high52 > low52 ? ((curPrice - low52) / (high52 - low52)) * 100 : 50;

    var out = JSON.stringify({
      supported: true,
      symbol: symbol,
      points: pts.slice(-126), // ~6 חודשי מסחר
      curPrice: Math.round(curPrice * 100) / 100,
      prevClose: Math.round(prevClose * 100) / 100,
      dayChgPct: Math.round(dayChgPct * 100) / 100,
      high52: Math.round(high52 * 100) / 100,
      low52: Math.round(low52 * 100) / 100,
      rangePosPct: Math.round(posInRange) // 0=תחתית השנה, 100=שיא השנה
    });
    try { cache.put(key, out, 21600); } catch (eC) {}
    return out;
  } catch (e) {
    return JSON.stringify({ error: String(e) });
  }
}

function getPositionNews(token, query) {
  var g = _gate(token); if (g) return g;
  try {
    query = String(query || '').trim();
    if (!query) return JSON.stringify({ error: 'לא צוין נייר לחיפוש' });
    var url = 'https://news.google.com/rss/search?q=' + encodeURIComponent(query) +
      '&hl=iw&gl=IL&ceid=IL:iw';
    var res = UrlFetchApp.fetch(url, { muteHttpExceptions: true, headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (res.getResponseCode() !== 200) return JSON.stringify({ error: 'שגיאת רשת בשליפת חדשות (' + res.getResponseCode() + ')' });
    var xml = res.getContentText();
    var doc = XmlService.parse(xml);
    var root = doc.getRootElement();
    var channel = root.getChild('channel');
    var items = channel ? channel.getChildren('item') : [];
    var news = [];
    for (var i = 0; i < items.length && news.length < 6; i++) {
      var it = items[i];
      var title = it.getChildText('title') || '';
      var link = it.getChildText('link') || '';
      var pubDate = it.getChildText('pubDate') || '';
      var sourceEl = it.getChild('source');
      var source = sourceEl ? sourceEl.getText() : '';
      // ✅ כותרת Google News בפורמט "כותרת - שם האתר" — מפרידים אם source חסר
      if (!source && title.indexOf(' - ') >= 0) {
        var parts = title.split(' - ');
        source = parts[parts.length - 1];
        title = parts.slice(0, -1).join(' - ');
      }
      var dateStr = '';
      try { dateStr = pubDate ? Utilities.formatDate(new Date(pubDate), 'Asia/Jerusalem', 'dd/MM/yyyy HH:mm') : ''; } catch (eD) {}
      news.push({ title: title, link: link, source: source, date: dateStr });
    }
    return JSON.stringify({ query: query, items: news });
  } catch (e) {
    return JSON.stringify({ error: String(e) });
  }
}

// ═══════════════════════════════════════════════════════════════
//  ✅ v12.0.0.4 — מחשבון "מה אם" לקרן FAIR: מכירה היפותטית בש"ח.
//  קרנות נאמנות לא מופיעות בגיליון "עלויות קנייה" (IBKR בלבד), לכן
//  העלות נגזרת מהגיליון FAIR: עלות = שווי נוכחי − רווח (pro-rata לכמות).
// ═══════════════════════════════════════════════════════════════
function getFairWhatIfSale(token, name, qty, priceILS) {
  var g = _gate(token); if (g) return g;
  try {
    name = String(name || '').trim();
    qty = parseFloat(qty) || 0;
    priceILS = parseFloat(priceILS) || 0;
    if (!name) return JSON.stringify({ error: 'לא צוין נייר' });
    if (qty <= 0) return JSON.stringify({ error: 'הזן כמות תקינה' });
    if (priceILS <= 0) return JSON.stringify({ error: 'הזן מחיר מכירה בש"ח' });
    var usdToday = getCurrentUSDILS();
    var pos = null;
    try {
      var pd = _getPortfolioData();
      if (pd && pd.fair && pd.fair.positions) {
        pos = pd.fair.positions.find(function (p) { return String(p.name || '').trim() === name; });
      }
    } catch (eP) { Logger.log('getFairWhatIfSale: portfolio err: ' + eP); }
    if (!pos) return JSON.stringify({ error: 'הקרן "' + name + '" לא נמצאה בגיליון FAIR' });

    var posQty = pos.qty || 0;
    var totalCostILS = (pos.valILS || 0) - (pos.pl || 0); // עלות כוללת של ההחזקה
    if (totalCostILS < 0) totalCostILS = 0;
    var sellQty = Math.min(qty, posQty);
    // עלות pro-rata לפי חלק יחסי מההחזקה
    var costILS = posQty > 0 ? totalCostILS * (sellQty / posQty) : 0;
    var proceedsILS = sellQty * priceILS;
    var gainILS = proceedsILS - costILS;
    var taxILS = gainILS > 0 ? Math.round(gainILS * 0.25) : 0;
    var netAfterTaxILS = proceedsILS - taxILS;

    var out = {
      fair: true,
      symbol: name,
      sellQty: sellQty,
      unitPriceILS: priceILS,
      proceedsILS: Math.round(proceedsILS),
      proceedsUSD: Math.round(proceedsILS / usdToday),
      costILS: Math.round(costILS),
      gainILS: Math.round(gainILS),
      taxILS: taxILS,
      netAfterTaxILS: Math.round(netAfterTaxILS),
      remainingAfterSale: Math.max(0, posQty - sellQty),
      usdToday: usdToday,
      matches: [{ buyDate: '', buyPrice: priceILS, qty: sellQty, costILS: Math.round(costILS) }]
    };
    var _demoF = _demoFactor(token);
    if (_demoF > 0) out = _demoTransform(out, _demoF);
    return JSON.stringify(out);
  } catch (e) {
    return JSON.stringify({ error: String(e) });
  }
}

function getWhatIfSale(token, symbol, qty, priceUSD) {
  var g = _gate(token); if (g) return g;
  try {
    symbol = String(symbol || '').trim().toUpperCase();
    qty = parseFloat(qty) || 0;
    priceUSD = parseFloat(priceUSD) || 0;
    if (!symbol || qty <= 0) return JSON.stringify({ error: 'בחר נייר והזן כמות' });

    // ✅ v11.7.0.0: בסשן דמו — הכמות שהתקבלה היא מוקטנת; מחזירים לכמות אמיתית לחישוב
    var _demoF = _demoFactor(token);
    var _demoQty = qty;
    if (_demoF > 0) qty = qty / _demoF;

    var usdToday = getCurrentUSDILS();
    var sheet = _findSheetByNames(['עלויות_קנייה_מעדכן', 'עלויות_קנייה_מעודכן', 'עלויות קנייה מעודכן', 'עלויות קנייה (מעודכן)']);
    if (!sheet) sheet = SS.getSheetByName('עלויות קנייה');
    if (!sheet) return JSON.stringify({ error: 'גיליון עלויות הקנייה לא נמצא' });
    var lastRow = sheet.getLastRow();
    if (lastRow < 5) return JSON.stringify({ error: 'אין נתוני קנייה' });

    // לוטים גולמיים — קריאה אחת (✅ batch-read)
    var data = sheet.getRange(5, 1, lastRow - 4, 9).getValues();
    var lots = [];
    data.forEach(function(row) {
      var sym = String(row[0] || '').trim().toUpperCase();
      if (sym !== symbol) return;
      var lqty = parseFloat(row[3]) || 0;
      if (lqty <= 0) return;
      lots.push({
        qty: lqty,
        price: parseFloat(row[4]) || 0,
        date: row[5] ? Utilities.formatDate(new Date(row[5]), 'Asia/Jerusalem', 'dd/MM/yyyy') : '',
        costILS: parseFloat(row[8]) || 0
      });
    });
    lots.sort(function(a, b) {
      var da = _parseSheetDate(a.date), db = _parseSheetDate(b.date);
      return (da ? da.getTime() : 0) - (db ? db.getTime() : 0);
    });

    // הפחת מכירות היסטוריות (FIFO) — מגיליון "מכירות"
    var salesMap = getSales();
    var soldQty = salesMap[symbol] || 0;
    for (var i = 0; i < lots.length && soldQty > 0; i++) {
      var take = Math.min(soldQty, lots[i].qty);
      lots[i].qty -= take;
      soldQty -= take;
    }
    var remaining = lots.reduce(function(s, l) { return s + l.qty; }, 0);
    if (remaining <= 0) return JSON.stringify({ error: 'אין החזקות פתוחות של ' + symbol + ' בגיליון עלויות הקנייה' });
    if (qty > remaining) return JSON.stringify({ error: 'הכמות המבוקשת גדולה מההחזקה. זמין: ' + remaining });

    // המכירה ההיפותטית — צריכת לוטים מהישן לחדש
    var matches = [], costILS = 0, costUSD = 0, toSell = qty;
    for (var j = 0; j < lots.length && toSell > 0; j++) {
      var lot = lots[j];
      if (lot.qty <= 0) continue;
      var m = Math.min(toSell, lot.qty);
      var perLotCostILS = lot.qty > 0 ? (lot.costILS / lot.qty) * m : 0;
      matches.push({ buyDate: lot.date, buyPrice: lot.price, qty: m, costILS: Math.round(perLotCostILS) });
      costILS += perLotCostILS;
      costUSD += lot.price * m;
      toSell -= m;
    }

    var proceedsUSD = qty * priceUSD;
    var proceedsILS = proceedsUSD * usdToday;
    var gainILS = proceedsILS - costILS;
    var gainUSD = proceedsUSD - costUSD;
    var taxILS = gainILS > 0 ? gainILS * 0.25 : 0;

    var out = {
      symbol: symbol,
      qty: qty,
      priceUSD: priceUSD,
      usdToday: usdToday,
      matches: matches,
      costILS: Math.round(costILS),
      costUSD: Math.round(costUSD * 100) / 100,
      proceedsUSD: Math.round(proceedsUSD * 100) / 100,
      proceedsILS: Math.round(proceedsILS),
      gainILS: Math.round(gainILS),
      gainUSD: Math.round(gainUSD * 100) / 100,
      taxILS: Math.round(taxILS),
      netAfterTaxILS: Math.round(gainILS - taxILS),
      remainingAfterSale: Math.round((remaining - qty) * 100) / 100
    };
    // ✅ v11.7.0.0: בדמו — התוצאה מוקטנת חזרה, הכמות חוזרת להיות מוקטנת
    if (_demoF > 0) {
      out = _demoTransform(out, _demoF);
      out.qty = _demoQty;
    }
    return JSON.stringify(out);
  } catch (e) {
    return JSON.stringify({ error: String(e) });
  }
}

// ═══ ✅ v11.6.6.0: היסטוריית מדד VOO להשוואה בגרף ההיסטוריה — מטמון 6 שעות ═══
function getBenchmarkHistory(token) {
  var g = _gate(token); if (g) return g;
  try {
    var pts = _getBenchPoints();
    if (!pts) return JSON.stringify({ error: 'שירות המדד לא זמין כרגע' });
    return JSON.stringify({ symbol: 'VOO', points: pts });
  } catch (e) {
    return JSON.stringify({ error: String(e) });
  }
}
// ✅ v12.1.0.0: מנוע פנימי משותף — getBenchmarkHistory (קליינט) + getMonthlyReturns (השוואת VOO)
function _getBenchPoints() {
  var cache = CacheService.getScriptCache();
  var cached = cache.get('BENCH_JSON');
  if (cached) { try { return JSON.parse(cached).points || null; } catch (e) { return null; } }
  var text = _yahooFetch('/v8/finance/chart/VOO?range=1y&interval=1d');
  if (!text) return null;
  var j = JSON.parse(text);
  var r = (((j.chart || {}).result) || [])[0];
  if (!r || !r.timestamp) return null;
  var cl = (((r.indicators || {}).quote) || [])[0].close;
  if (!cl) return null;
  var pts = [];
  for (var i = 0; i < r.timestamp.length; i++) {
    if (cl[i] === null || cl[i] === undefined) continue;
    pts.push({ d: Utilities.formatDate(new Date(r.timestamp[i] * 1000), 'Asia/Jerusalem', 'dd/MM/yyyy'), c: cl[i] });
  }
  try { cache.put('BENCH_JSON', JSON.stringify({ symbol: 'VOO', points: pts }), 21600); } catch (e) {}
  return pts;
}

// ══════ FIFO — מחשב איזה קנייה מתחברת לאיזו מכירה ══════
// ═══════════════════════════════════════════════════════════════
//  ✅ v12.1.0.0 — טבלת תשואות חודשיות: % חודשי מהסנאפשוטים + VOO
//  להשוואה. מחושב אוטומטית מגיליון ההיסטוריה — בלי תחזוק ידני.
// ═══════════════════════════════════════════════════════════════
function getMonthlyReturns(token) {
  var g = _gate(token); if (g) return g;
  try {
    var hist = (getHistoricalData() || {}).history || [];
    if (hist.length < 2) return JSON.stringify({ error: 'אין מספיק נתוני היסטוריה לחישוב חודשי' });

    // קבוצות לפי חודש (MM/yyyy) — ערך פתיחה וסיום מהסנאפשוטים
    var months = {};
    hist.forEach(function (r) {
      if (!r.date || r.date.length < 10) return;
      var mKey = r.date.substring(3); // MM/yyyy
      if (!months[mKey]) months[mKey] = { first: r.totalValue, last: r.totalValue };
      else months[mKey].last = r.totalValue;
    });

    // VOO — אותו קיבוץ לפי חודש
    var vooMonths = {};
    try {
      var bpts = _getBenchPoints();
      if (bpts) {
        bpts.forEach(function (p) {
          if (!p.d || p.d.length < 10) return;
          var mKey = p.d.substring(3);
          if (!vooMonths[mKey]) vooMonths[mKey] = { first: p.c, last: p.c };
          else vooMonths[mKey].last = p.c;
        });
      }
    } catch (eB) {}

    // מיון חודשים כרונולוגי
    var keys = Object.keys(months).sort(function (a, b) {
      var pa = a.split('/'), pb = b.split('/');
      return (parseInt(pa[1], 10) * 100 + parseInt(pa[0], 10)) - (parseInt(pb[1], 10) * 100 + parseInt(pb[0], 10));
    });

    var rows = [];
    keys.forEach(function (k) {
      var m = months[k];
      var retPct = m.first > 0 ? ((m.last - m.first) / m.first) * 100 : 0;
      var vooPct = null;
      if (vooMonths[k] && vooMonths[k].first > 0) vooPct = ((vooMonths[k].last - vooMonths[k].first) / vooMonths[k].first) * 100;
      rows.push({
        month: k,
        startValILS: Math.round(m.first),
        endValILS: Math.round(m.last),
        deltaILS: Math.round(m.last - m.first),
        retPct: Math.round(retPct * 100) / 100,
        vooPct: vooPct === null ? null : Math.round(vooPct * 100) / 100,
        alphaPct: vooPct === null ? null : Math.round((retPct - vooPct) * 100) / 100
      });
    });
    return JSON.stringify({ rows: rows });
  } catch (e) {
    return JSON.stringify({ error: String(e) });
  }
}

// ═══════════════════════════════════════════════════════════════
//  ✅ v12.1.0.0 — חיזוי דיבידנדים אוטומטי (30 יום קרובים + קצב שנתי)
//  מבוסס על דפוסי התשלומים בטבלת הפירוט: מזהה ניירות ששילמו
//  באותה תקופת לוח שנה בשנים קודמות — בלי תחזוק ידני.
// ═══════════════════════════════════════════════════════════════
function getDividendForecast(token) {
  var g = _gate(token); if (g) return g;
  try {
    var rows = _getDividendDetails();
    if (!rows || !rows.length) return JSON.stringify({ error: 'אין טבלת פירוט דיבידנדים לחיזוי אוטומטי' });

    var jt = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' }));
    var todayMs = jt.getTime();

    // לפי סימבול: רשימת תשלומים {t, gross, net}
    var bySym = {};
    rows.forEach(function (r) {
      var sym = String(r.sym || '').trim().toUpperCase();
      var dt = _parseSheetDate(r.date);
      if (!sym || !dt) return;
      if (!bySym[sym]) bySym[sym] = [];
      bySym[sym].push({ t: dt.getTime(), gross: r.grossUSD || 0, net: r.netUSD || 0 });
    });

    var items = [];
    var yearGross = 0, yearNet = 0;
    Object.keys(bySym).forEach(function (sym) {
      var pays = bySym[sym].slice().sort(function (a, b) { return a.t - b.t; });
      if (!pays.length) return;

      // קצב שנתי — סכום 365 יום אחרונים
      pays.forEach(function (p) {
        if (todayMs - p.t <= 365 * 24 * 3600 * 1000) { yearGross += p.gross; yearNet += p.net; }
      });

      // חיזוי 30 יום: תשלום היסטורי באותו חלון לוח שנה (1-2 שנים אחרונות)
      var best = null;
      for (var y = 1; y <= 2; y++) {
        var winStart = todayMs - y * 365 * 24 * 3600 * 1000;
        var winEnd = winStart + 30 * 24 * 3600 * 1000;
        for (var i = 0; i < pays.length; i++) {
          if (pays[i].t >= winStart && pays[i].t <= winEnd) {
            best = { gross: pays[i].gross, net: pays[i].net, histDate: pays[i].t };
            break;
          }
        }
        if (best) break;
      }
      if (best) {
        items.push({
          sym: sym,
          expGrossUSD: Math.round(best.gross * 100) / 100,
          expNetUSD: Math.round(best.net * 100) / 100,
          lastPaid: Utilities.formatDate(new Date(best.histDate), 'Asia/Jerusalem', 'dd/MM/yyyy')
        });
      }
    });

    items.sort(function (a, b) { return b.expGrossUSD - a.expGrossUSD; });
    return JSON.stringify({
      items: items,
      next30GrossUSD: Math.round(items.reduce(function (s, r) { return s + r.expGrossUSD; }, 0) * 100) / 100,
      next30NetUSD: Math.round(items.reduce(function (s, r) { return s + r.expNetUSD; }, 0) * 100) / 100,
      runRateGrossUSD: Math.round(yearGross * 100) / 100,
      runRateNetUSD: Math.round(yearNet * 100) / 100
    });
  } catch (e) {
    return JSON.stringify({ error: String(e) });
  }
}

function calculateFIFO() {
  // קורא רכישות מ"עלויות קנייה מעודכן"
  var sheet = _findSheetByNames(['עלויות_קנייה_מעדכן', 'עלויות_קנייה_מעודכן', 'עלויות קנייה מעודכן', 'עלויות קנייה (מעודכן)']);
  if (!sheet) sheet = SS.getSheetByName('עלויות קנייה');
  if (!sheet) return { matches: [], summary: { totalSold: 0, totalGainILS: 0 } };

  // קורא רכישות
  var lastRow = sheet.getLastRow();
  if (lastRow < 5) return { matches: [], summary: { totalSold: 0, totalGainILS: 0 } };

  var purchases = []; // {sym, qty, price, date, usdIls, costILS}
  var data = sheet.getRange(5, 1, lastRow - 4, 9).getValues();
  data.forEach(function(row) {
    var sym = String(row[0] || '').trim().toUpperCase();
    var qty = parseFloat(row[3]) || 0;
    if (!sym || qty === 0) return;
    purchases.push({
      sym: sym,
      qty: qty,
      price: parseFloat(row[4]) || 0,
      date: _safeSheetDateStr(row[5]), // ✅ v11.9.3.0
      dateObj: _safeSheetDateObj(row[5]),
      usdIls: parseFloat(row[6]) || 0,
      costILS: parseFloat(row[8]) || 0
    });
  });

  // קורא מכירות מ"מכירות" — מנסה לקרוא פירוט מלא
  var salesSheet = SS.getSheetByName('מכירות');
  var sales = [];
  if (salesSheet) {
    var sLastRow = salesSheet.getLastRow();
    if (sLastRow >= 4) {
      // מצא כותרות
      var headerRow = 3, symCol = 1, qtyCol = 3, priceCol = -1, dateCol = -1, rateCol = -1;
      for (var r = 1; r <= Math.min(sLastRow, 5); r++) {
        var vals = salesSheet.getRange(r, 1, 1, 12).getValues()[0];
        for (var c = 0; c < vals.length; c++) {
          var v = String(vals[c]).replace(/[\u200B-\u200F\uFEFF]/g, '').trim();
          if (v === 'סימבול') { symCol = c; headerRow = r; }
          if (v === 'כמות נמכרה' || v === 'כמות מכירה') { qtyCol = c; }
          if (v === 'מחיר מכירה' || v === 'מחיר') { priceCol = c; }
          if (v === 'תאריך מכירה' || v === 'תאריך') { dateCol = c; }
          // ✅ v11.9.2.0: עמודת שער USD/ILS ביום המכירה (למשל "במכירה USD/ILS") — קודם עדיפות לעמודה עם 'שער', אחרת כל עמודה עם USD
          if (rateCol < 0 && (v.indexOf('שער') >= 0 || v.toUpperCase().indexOf('USD') >= 0)) { rateCol = c; }
        }
      }
      var sData = salesSheet.getRange(headerRow + 1, 1, sLastRow - headerRow, Math.max(symCol + 1, qtyCol + 1, priceCol + 1, dateCol + 1, rateCol + 1, 5)).getValues();
      sData.forEach(function(row) {
        var sym = String(row[symCol] || '').trim().toUpperCase();
        var qty = parseFloat(row[qtyCol]) || 0;
        if (!sym || qty === 0) return;
        var rowRate = rateCol >= 0 ? (parseFloat(row[rateCol]) || 0) : 0;
        sales.push({
          sym: sym,
          qty: qty,
          sellPrice: priceCol >= 0 ? (parseFloat(row[priceCol]) || 0) : 0,
          sellDate: dateCol >= 0 && row[dateCol] ? _safeSheetDateStr(row[dateCol]) : '', // ✅ v11.9.3.0
          usdIls: rowRate // ✅ v11.9.2.0: שער יום המכירה מהגיליון (עמודה F) — אם חסר/0 יש fallback לשער היום בהמשך
        });
      });
    }
  }

  // אם אין פירוט מכירות מלא, השתמש ברווח ממומש כדי לבנות FIFO
  if (sales.length === 0) {
    var rg = getRealizedGains();
    (rg.entries || []).forEach(function(e) {
      // הערך: נחשב כמות מתוך עלות/מחיר — לא מדויק אבל נותן תמונה
      sales.push({
        sym: e.sym,
        qty: 0, // לא ידוע בלי פירוט
        sellPrice: e.costUSD > 0 ? (e.proceedsUSD / (e.costUSD / 1)) : 0,
        sellDate: e.saleDate,
        gainUSD: e.gainUSD,
        gainILS: e.gainILS,
        usdIls: e.usdIls,
        fromRealizedGains: true
      });
    });
  }

  // ══════ FIFO matching ══════
  // ממיין רכישות לפי תאריך (ישן → חדש)
  var lotsBySym = {};
  purchases.forEach(function(p) {
    if (!lotsBySym[p.sym]) lotsBySym[p.sym] = [];
    lotsBySym[p.sym].push(p);
  });
  Object.keys(lotsBySym).forEach(function(sym) {
    lotsBySym[sym].sort(function(a, b) { return a.dateObj - b.dateObj; });
  });

  var matches = [];
  var totalSold = 0, totalGainILS = 0;

  sales.forEach(function(s) {
    var lots = lotsBySym[s.sym] || [];
    var remainingSell = s.qty;
    var costBasisILS = 0;

    for (var i = 0; i < lots.length && remainingSell > 0; i++) {
      var lot = lots[i];
      if (lot.qty <= 0) continue;

      var matchedQty = Math.min(remainingSell, lot.qty);
      var matchedCostILS = (lot.costILS / (lot.qty > 0 ? lot.qty : 1)) * matchedQty;
      var sellValueILS = s.sellPrice > 0 ? (s.sellPrice * matchedQty * (s.usdIls || getCurrentUSDILS())) : 0;
      var gainILS = sellValueILS - matchedCostILS;

      matches.push({
        sym: s.sym,
        buyDate: lot.date,
        buyPrice: lot.price,
        buyQty: matchedQty,
        sellDate: s.sellDate,
        sellPrice: s.sellPrice,
        sellQty: matchedQty,
        costILS: matchedCostILS,
        proceedsILS: sellValueILS,
        gainILS: gainILS,
        usdIlsBuy: lot.usdIls,
        usdIlsSell: s.usdIls || getCurrentUSDILS()
      });

      lot.qty -= matchedQty;
      remainingSell -= matchedQty;
      totalSold += matchedQty;
      totalGainILS += gainILS;
    }
  });

  return {
    matches: matches,
    summary: {
      totalSold: totalSold,
      totalGainILS: totalGainILS,
      matchCount: matches.length
    }
  };
}
// ── נתוני תיק לדאשבורד (✅ כולל דיבידנדים) ──
function _getPortfolioData() {
  // ✅ v11.6.4.0: מטמון שרת (60 שניות) — קריאות חוזרות לא קוראות מחדש 12 גיליונות.
  // הריצה היומית קוראת לזה 3 פעמים ברצף, והדשבורד בכל טעינה — עכשיו חלקן מוגשות מהמטמון.
  // מתאפס אוטומטית בריענון מחירים (_refreshPricesCore) או שאחרי 60 שניות.
  try {
    var _cached = CacheService.getScriptCache().get('PDATA_JSON');
    if (_cached) return JSON.parse(_cached);
  } catch (e) {}
  const usdIls  = getCurrentUSDILS();
  const dateStr = Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'dd/MM/yyyy HH:mm');

  // IBKR
  const ibkrSheet = SS.getSheetByName('IBKR');
  if (!ibkrSheet) throw new Error('גיליון IBKR לא נמצא');
  const ibkrLast = ibkrSheet.getLastRow();
  const ibkrRows = ibkrLast > 9 ? ibkrSheet.getRange(10, 1, ibkrLast - 9, 15).getValues() : [];
  let ibkrPositions = [], ibkrTotalVal = 0, ibkrTotalCost = 0, ibkrCash = 0;
  ibkrRows.forEach(row => {
    const sym = String(row[0]).trim();
    if (!sym || sym === 'סה"כ') return;
    const type = String(row[2]), valILS = parseFloat(row[11]) || 0, costILS = parseFloat(row[8]) || 0;
    if (type === 'מזומן') { ibkrCash += valILS; return; }
    ibkrTotalVal += valILS; ibkrTotalCost += costILS;
    ibkrPositions.push({ sym, type, qty: parseFloat(row[4])||0, buyP: parseFloat(row[5])||0, buyDate: String(row[6]), buyFX: parseFloat(row[7])||0, costILS, curP: parseFloat(row[9])||0, valILS, retILS: parseFloat(row[12])||0, retPct: parseFloat(row[13])||0 });
  });

  // FAIR
  // ✅ v11: קריאת FAIR עמידה — לא תלויה בשורה 7 (מוצאת ניירות גם אם מבנה הגיליון זז),
  // מדלגת על כותרות/סה"כ, ואם עמודת השווי ריקה מחשבת כמות × מחיר בפנים.
  const fairSheet = SS.getSheetByName('FAIR');
  if (!fairSheet) throw new Error('גיליון FAIR לא נמצא');
  const fairLast = fairSheet.getLastRow();
  const fairRows = fairLast > 0 ? fairSheet.getRange(1, 1, fairLast, 9).getValues() : [];
  let fairPositions = [], fairTotalVal = 0, fairTotalPL = 0, fairCash = 0;
  fairRows.forEach(row => {
    const name = String(row[0]).trim();
    if (!name) return;
    if (name === 'סה"כ' || name === 'שם הנייר' || name === 'שם נייר' || name === 'נייר ערך' || name === 'שם') return;
    const qty  = parseFloat(row[4]) || 0;
    const curP = parseFloat(row[2]) || 0;
    let valILS = parseFloat(row[6]) || 0;
    // ✅ v11.6.0.9: שורות כותרת/הוראות (אין כמות ואין שווי) — לא נייר ערך, לא מוצגות בכלל
    if (!(qty > 0) && !(valILS > 0)) return;
    if (!valILS && qty > 0 && curP > 0) valILS = qty * curP; // fallback: שווי חסר → כמות×מחיר
    let pl = parseFloat(row[7]) || 0;
    // ✅ v11.6.0.8: fallback רק אם יש מחיר קנייה — בלי F אין להציג את שווי הנייר כולו כ"רווח"
    if (!parseFloat(row[7]) && valILS > 0 && qty > 0 && (parseFloat(row[5]) || 0) > 0) pl = valILS - (qty * (parseFloat(row[5]) || 0));
    if (name === 'מזומן') { fairCash += valILS; return; }
    fairTotalVal += valILS; fairTotalPL += pl;
    fairPositions.push({ name, type: String(row[3]).trim(), qty, valILS, pl, plPct: parseFloat(row[8])||0 });
  });

  const banks = getBankAccounts(), banksTotal = banks.reduce((s,b)=>s+b.valueILS,0);
  const savings = getSavingsData();
  const grandTotal  = ibkrTotalVal + ibkrCash + fairTotalVal + fairCash + banksTotal;
  const totalReturn = (ibkrTotalVal - ibkrTotalCost) + fairTotalPL;
  const totalCostUSD = ibkrPositions.reduce((s,p)=>s+(p.qty*p.buyP),0);

  // ✅ חדש: נתוני דיבידנדים
  const dividends = getDividendData();

  // ✅ נתוני עמלות
  const commissions = getCommissionsData();
  const fairCommissions = getFairCommissionsData();

  // ✅ נתוני שלמות + היסטוריה (מהיר — לא קורא getPortfolioData)
  var integrityResult = runIntegrityCheck();
  var historyResult = getHistoricalData();

  var result = {
    meta   : { updatedAt: dateStr, usdIls },
    summary: { grandTotal, totalReturn, totalRetPct: ibkrTotalCost>0?totalReturn/ibkrTotalCost:0, ibkrVal: ibkrTotalVal+ibkrCash, fairVal: fairTotalVal+fairCash, banksVal: banksTotal },
    ibkr   : { xirr: _getXIRRData(ibkrTotalVal, ibkrCash), xirrYear: _getXIRRData(ibkrTotalVal, ibkrCash, new Date().getFullYear()), positions: ibkrPositions, totalVal: ibkrTotalVal, totalCost: ibkrTotalCost, totalRet: ibkrTotalVal-ibkrTotalCost, totalRetPct: ibkrTotalCost>0?(ibkrTotalVal-ibkrTotalCost)/ibkrTotalCost:0, cash: ibkrCash, totalValUSD: ibkrTotalVal/usdIls, totalCostUSD, totalRetUSD: (ibkrTotalVal/usdIls)-totalCostUSD, totalRetPctUSD: totalCostUSD>0?((ibkrTotalVal/usdIls)-totalCostUSD)/totalCostUSD:0 },
    fair   : { positions: fairPositions, totalVal: fairTotalVal, totalPL: fairTotalPL, totalPLPct: (fairTotalVal-fairTotalPL)>0?fairTotalPL/(fairTotalVal-fairTotalPL):0, cash: fairCash },
    banks  : banks.map(b=>({ name:b.name, institution:b.institution, accType:b.accType, ccy:b.ccy, balance:b.balance, rate:b.rate, valueILS:b.valueILS })),
    cash   : { ibkr: ibkrCash, fair: fairCash, banks: banksTotal, total: ibkrCash+fairCash+banksTotal },
    savings,
    realizedGains: getRealizedGains(),
    dividends,
    commissions,
    fairCommissions,
    integrity: { issues: integrityResult, passed: integrityResult.length === 0 },
    history: historyResult,
    taxData: (function(){ try { return getTaxData(); } catch(e) { Logger.log('taxData err: '+e); return {error:String(e)}; } })(),
    // ── חדש: יעדים, חשיפת מטבע, אטריבוציה, drawdown ──
    goal: (function(){ try { return getPortfolioGoal(grandTotal, historyResult.history); } catch(e) { Logger.log('goal err: '+e); return null; } })(),
    currencyExposure: getCurrencyExposure(ibkrPositions, fairPositions, ibkrCash, fairCash, banks, usdIls),
    attribution: getAttribution(ibkrPositions, fairPositions),
    activity: _getActivityLog(),
    drawdown: (function(){
      try {
        var hist = historyResult.history || [];
        var dd = calculateMaxDrawdown(hist);
        dd.beta = calculateBeta(hist);
        return dd;
      } catch(e) { return { maxDrawdown: 0, maxDrawdownPct: 0, beta: 1.0 }; }
    })(),
    // analysis נטען עצל — רק כשלוחצים על הטאב, דרך getAnalysisAndNews()
  };
  // ✅ v11.6.4.0: שמירה למטמון (60 שניות). ערך גדול מדי (>100KB) — פשוט לא נשמר, בלי שגיאה.
  try { CacheService.getScriptCache().put('PDATA_JSON', JSON.stringify(result), 60); } catch (e) {}
  return result;
}

// ── Wrapper for frontend: returns JSON string for google.script.run ──

// ═══════════════════════════════════════════════════════════════
//  ✅ v12.0.0.0 — XIRR: תשואה שנתית ממושקלת בכסף (חשבון IBKR)
//  הגיון: כל קנייה = הפקדה (−), כל מכירה = משיכה (+), והיום = שווי נוכחי (+).
//  התוצאה עונה על "אם הכסף שהפקדתי היה בפיקדון — איזו ריבית שנתית הייתי צריך לקבל?"
// ═══════════════════════════════════════════════════════════════
function _xirrSolve(flows) {
  if (flows.length < 2) return null;
  flows.sort(function(a, b) { return a.t - b.t; });
  var t0 = flows[0].t;
  var npv = function(r) {
    var s = 0;
    for (var i = 0; i < flows.length; i++) {
      var yrs = (flows[i].t - t0) / (365 * 24 * 3600 * 1000);
      s += flows[i].cf / Math.pow(1 + r, yrs);
    }
    return s;
  };
  var lo = -0.9, hi = 5, flo = npv(lo), fhi = npv(hi);
  if (isNaN(flo) || isNaN(fhi) || flo * fhi > 0) return null;
  for (var i = 0; i < 80; i++) {
    var mid = (lo + hi) / 2, fm = npv(mid);
    if (Math.abs(fm) < 0.5) return mid;
    if (flo * fm < 0) { hi = mid; fhi = fm; } else { lo = mid; flo = fm; }
  }
  return (lo + hi) / 2;
}

function _getXIRRData(ibkrTotalVal, ibkrCash, year) {
  try {
    // ✅ v12.1.0.0: year אופציונלי — XIRR שנתי: רק תזרימי השנה + שווי פותח (מסנאפשוט אחרון שלפני תחילת השנה) כהפקדה ראשונית
    var yearStartMs = year ? new Date(year, 0, 1).getTime() : 0;
    var flows = [];
    var invested = 0, proceeds = 0, skipped = 0;

    // קניות — הפקדות
    var pSheet = _findSheetByNames(['עלויות_קנייה_מעדכן', 'עלויות_קנייה_מעודכן', 'עלויות קנייה מעודכן', 'עלויות קנייה (מעודכן)']) || SS.getSheetByName('עלויות קנייה');
    if (pSheet) {
      var pLast = pSheet.getLastRow();
      if (pLast >= 5) {
        var pData = pSheet.getRange(5, 1, pLast - 4, 9).getValues();
        pData.forEach(function(row) {
          var sym = String(row[0] || '').trim().toUpperCase();
          var qty = parseFloat(row[3]) || 0;
          if (!sym || !qty) return;
          var costILS = parseFloat(row[8]) || 0;
          var dMs = _safeSheetDateObj(row[5]);
          if (!costILS || !dMs) { skipped++; return; }
          flows.push({ t: dMs, cf: -costILS });
          invested += costILS;
        });
      }
    }

    // מכירות — משיכות
    var sSheet = SS.getSheetByName('מכירות');
    if (sSheet) {
      var sLast = sSheet.getLastRow();
      if (sLast >= 4) {
        var sData = sSheet.getRange(4, 1, sLast - 3, 8).getValues();
        sData.forEach(function(row) {
          var sym = String(row[1] || '').trim().toUpperCase();
          var qty = parseFloat(row[3]) || 0;
          if (!sym || !qty) return;
          var dMs = _safeSheetDateObj(row[0]);
          var sumILS = parseFloat(row[7]) || 0;
          if (!sumILS) {
            var price = parseFloat(row[4]) || 0, rate = parseFloat(row[5]) || 0;
            if (price && rate) sumILS = qty * price * rate;
          }
          if (!dMs || !sumILS) { skipped++; return; }
          flows.push({ t: dMs, cf: sumILS });
          proceeds += sumILS;
        });
      }
    }

    // ✅ v12.1.0.0: XIRR שנתי — שווי פותח מסנאפשוט ההיסטוריה (שורה אחרונה לפני 1/1), תזרימים מסוננים לשנה
    if (year) {
      var startVal = 0, startT = yearStartMs;
      try {
        var hist = (getHistoricalData() || {}).history || [];
        for (var hi = 0; hi < hist.length; hi++) {
          var hd = _parseSheetDate(hist[hi].date);
          if (hd && hd.getTime() < yearStartMs && hist[hi].totalValue > 0) { startVal = hist[hi].totalValue; startT = hd.getTime(); }
        }
      } catch (eH) {}
      flows = flows.filter(function (f) { return f.t >= yearStartMs; });
      if (!startVal) {
        return { xirrPct: null, reason: 'אין סנאפשוט מלפני תחילת השנה — XIRR שנתי ייחשב אוטומטית כשיהיו נתוני פתיחה' };
      }
      flows.unshift({ t: startT, cf: -startVal });
      invested += startVal; // השווי הפותח נחשב "הפקדה" לצורך התשואה השנתית
    }

    // היום — שווי נוכחי (ניירות + מזומן)
    var currentVal = ibkrTotalVal + ibkrCash;
    flows.push({ t: Date.now(), cf: currentVal });

    var r = _xirrSolve(flows);
    var t0 = flows.length ? flows[0].t : Date.now();
    var years = (Date.now() - t0) / (365 * 24 * 3600 * 1000);
    return {
      xirrPct: (r !== null && !isNaN(r)) ? Math.round(r * 10000) / 100 : null,
      investedILS: Math.round(invested),
      proceedsILS: Math.round(proceeds),
      currentValILS: Math.round(currentVal),
      years: Math.round(years * 10) / 10,
      flows: flows.length,
      skippedRows: skipped
    };
  } catch (e) {
    Logger.log('XIRR err: ' + e);
    return null;
  }
}


// ═══════════════════════════════════════════════════════════════
//  ✅ v12.0.0.0 — יומן פעילות: מה הסנכרון הוסיף לאחרונה לגיליונות
//  המאגר ACTIVITY_LOG_JSON מתוחזק ב-ibkr_cloud_sync.gs (_actRecordAdds)
// ═══════════════════════════════════════════════════════════════
function _getActivityLog() {
  try {
    var raw = PropertiesService.getScriptProperties().getProperty('ACTIVITY_LOG_JSON');
    if (!raw) return [];
    var log = JSON.parse(raw);
    return Array.isArray(log) ? log.slice(0, 30) : [];
  } catch (e) {
    return [];
  }
}

function getActivityFeed(token) {
  var g = _gate(token); if (g) return g;
  return JSON.stringify({ activity: _getActivityLog() });
}


// ═══════════════════════════════════════════════════════════════
//  ✅ v13.5.0.0 — מנוע סיכון והקצאה
//  1) ריכוזיות לפי נייר  2) חפיפה אמיתית בין קרנות לפי חשיפה בסיסית
//  3) תוכנית איזון עם מחיר מס FIFO  4) ציון סיכון משוקלל
// ═══════════════════════════════════════════════════════════════
var RISK_PROFILES = {
  'VT':   { us_large: 0.60, us_small: 0.05, intl_dev: 0.25, em: 0.10 },
  'VOO':  { us_large: 1.00 },
  'VTI':  { us_large: 0.75, us_small: 0.25 },
  'VB':   { us_small: 1.00 },
  'SPMO': { us_large: 1.00 },
  'VGT':  { us_tech: 1.00 },
  'SMH':  { us_tech: 1.00 },
  'HACK': { us_tech: 1.00 },
  'AAPL': { us_tech: 1.00 },
  'MSFT': { us_tech: 1.00 },
  'XLV':  { us_health: 1.00 },
  'NLR':  { us_util: 1.00 },
  'INDA': { em: 1.00 },
  'VWO':  { em: 1.00 },
  'VSS':  { intl_dev: 1.00 }
};
var RISK_BUCKET_HE = {
  us_large: 'ארה"ב — מניות גדולות',
  us_small: 'ארה"ב — מניות קטנות',
  us_tech: 'ארה"ב — טכנולוגיה ושבבים',
  us_health: 'ארה"ב — בריאות',
  us_util: 'ארה"ב — תשתיות ואנרגיה',
  intl_dev: 'שווקים מפותחים מחוץ לארה"ב',
  em: 'שווקים מתפתחים',
  ils: 'ישראל — קרנות מקומיות',
  other: 'אחר'
};

// לוטים פתוחים לפי FIFO: עלויות קנייה פחות מכירות (לפי כמויות)
function _riskOpenLots() {
  var lots = {};
  var sheet = _findSheetByNames(['עלויות_קנייה_מעדכן', 'עלויות_קנייה_מעודכן', 'עלויות קנייה מעודכן', 'עלויות קנייה (מעודכן)']) || SS.getSheetByName('עלויות קנייה');
  if (!sheet) return lots;
  var last = sheet.getLastRow();
  if (last < 5) return lots;
  var data = sheet.getRange(5, 1, last - 4, 9).getValues();
  data.forEach(function (row) {
    var sym = String(row[0] || '').trim().toUpperCase();
    var qty = parseFloat(row[3]) || 0;
    if (!sym || qty <= 0) return;
    var priceUsd = parseFloat(row[4]) || 0;
    var dMs = _safeSheetDateObj(row[5]);
    var costILS = parseFloat(row[8]) || 0;
    if (!costILS) costILS = qty * priceUsd * (parseFloat(row[6]) || 0);
    if (!costILS) return;
    if (!lots[sym]) lots[sym] = [];
    lots[sym].push({ qty: qty, priceUsd: priceUsd, costILS: costILS, unitILS: costILS / qty, t: dMs ? new Date(dMs).getTime() : 0 });
  });
  // צריכת מכירות FIFO מהבנות הוותיקות
  var sold;
  try { sold = getSales() || {}; } catch (e) { sold = {}; }
  Object.keys(lots).forEach(function (sym) {
    var remaining = parseFloat(sold[sym]) || 0;
    lots[sym].sort(function (a, b) { return a.t - b.t; });
    for (var i = 0; i < lots[sym].length && remaining > 0; i++) {
      var take = Math.min(remaining, lots[sym][i].qty);
      lots[sym][i].qty -= take;
      lots[sym][i].costILS = lots[sym][i].qty * lots[sym][i].unitILS;
      remaining -= take;
    }
    lots[sym] = lots[sym].filter(function (l) { return l.qty > 0.0001; });
  });
  return lots;
}

// מחיר מס על חיתוך כמות: מכירה לפי FIFO, רווח הון ומס 25% בישראל
function _riskTrimTax(lots, sym, trimQty, priceILS) {
  var arr = (lots[sym] || []).slice();
  arr.sort(function (a, b) { return a.t - b.t; });
  var remaining = trimQty, costUsed = 0, saleUsedILS = 0, lotsUsed = [];
  for (var i = 0; i < arr.length && remaining > 0.0001; i++) {
    var take = Math.min(remaining, arr[i].qty);
    var lotCost = take * arr[i].unitILS;
    costUsed += lotCost;
    saleUsedILS += take * priceILS;
    lotsUsed.push({ qty: Math.round(take * 100) / 100, priceUsd: arr[i].priceUsd, costILS: Math.round(lotCost) });
    remaining -= take;
  }
  var gain = saleUsedILS - costUsed;
  var tax = gain > 0 ? gain * 0.25 : 0;
  return {
    qty: Math.round((trimQty - remaining) * 100) / 100,
    costILS: Math.round(costUsed),
    proceedsILS: Math.round(saleUsedILS),
    gainILS: Math.round(gain),
    taxILS: Math.round(tax),
    taxPct: saleUsedILS > 0 ? Math.round(tax / saleUsedILS * 1000) / 10 : 0,
    lots: lotsUsed,
    lossOffset: gain < 0
  };
}

function _riskBuild(thresholds) {
  var CAP = (thresholds && thresholds.cap) || 20;      // יעד מקסימלי לנייר בודד
  var WARN = (thresholds && thresholds.warn) || 15;    // סף התראה
  var d = _getPortfolioData();
  var usdIls = d.meta.usdIls || 1;
  var totalAll = d.summary.grandTotal || 1;

  var holdings = [];
  (d.ibkr.positions || []).forEach(function (p) {
    holdings.push({ sym: p.sym, label: p.sym, val: p.valILS || 0, qty: p.qty || 0, curUSD: p.curP || 0, ret: p.retPct || 0, src: 'IBKR', profile: RISK_PROFILES[p.sym] || { other: 1 } });
  });
  var fairTotal = 0, fairCount = 0;
  (d.fair.positions || []).forEach(function (p) {
    if (!p || !p.name || String(p.name).indexOf('מזומן') >= 0) return;
    fairTotal += (p.valILS || 0); fairCount++;
    holdings.push({ sym: 'F:' + String(p.name), label: p.name, val: p.valILS || 0, qty: p.qty || 0, curUSD: 0, ret: p.plPct || 0, src: 'FAIR', profile: { ils: 1 } });
  });
  holdings = holdings.filter(function (h) { return h.val > 0; });
  var invTotal = holdings.reduce(function (s, h) { return s + h.val; }, 0) || 1;

  // ── 1. ריכוזיות ──
  holdings.sort(function (a, b) { return b.val - a.val; });
  var bySym = {}, bySymLabel = {};
  holdings.forEach(function (h) {
    var k = h.sym;
    bySym[k] = (bySym[k] || 0) + h.val;
    bySymLabel[k] = h.label;
  });
  var conc = Object.keys(bySym).map(function (k) {
    var w = bySym[k] / invTotal * 100;
    return {
      sym: k, label: bySymLabel[k], val: Math.round(bySym[k]),
      weight: Math.round(w * 10) / 10,
      level: w >= 25 ? 'critical' : (w >= CAP ? 'high' : (w >= WARN ? 'warn' : 'ok'))
    };
  }).sort(function (a, b) { return b.val - a.val; });
  var fairGroup = { label: 'קרנות ישראליות — FAIR', weight: Math.round(fairTotal / invTotal * 1000) / 10, count: fairCount, val: Math.round(fairTotal) };
  var top5 = conc.slice(0, 5).reduce(function (s, x) { return s + x.weight; }, 0);
  var hhi = conc.reduce(function (s, x) { return s + Math.pow(x.weight / 100, 2); }, 0);

  // ── 2. חפיפה אמיתית ──
  var buckets = {};
  holdings.forEach(function (h) {
    var w = h.val / invTotal;
    var prof = h.profile || { other: 1 };
    Object.keys(prof).forEach(function (b) {
      buckets[b] = (buckets[b] || 0) + w * prof[b];
    });
  });
  var bucketList = Object.keys(buckets).map(function (b) {
    return { key: b, label: RISK_BUCKET_HE[b] || b, weight: Math.round(buckets[b] * 1000) / 10 };
  }).sort(function (a, b) { return b.weight - a.weight; });
  var maxBucket = bucketList.length ? bucketList[0] : { weight: 0, label: '-' };
  var nominalTop = conc.length ? conc[0].weight : 0;
  var effectiveTop = maxBucket.weight;
  var overlapNote = '';
  var vtLike = bySym['VT'] ? (bySym['VT'] / invTotal * 100) : 0;
  var usLargeFunds = ['VOO', 'VTI', 'VT', 'SPMO'].filter(function (s) { return bySym[s]; });
  if (usLargeFunds.length >= 2 && buckets['us_large']) {
    overlapNote = 'שים לב: ' + usLargeFunds.join(', ') + ' מחזיקות כולן את אותן מניות גדולות בארה"ב. החשיפה האמיתית למניות גדולות בארה"ב היא ' + (buckets['us_large'] * 100).toFixed(1) + '% מהתיק, גם אם אף אחת מהן לא נראית גדולה לבד.';
  }
  var distinctBuckets = bucketList.filter(function (b) { return b.weight >= 2; }).length;

  // ── 3. תוכנית איזון עם מחיר מס ──
  var lots = {};
  try { lots = _riskOpenLots(); } catch (e) { lots = {}; }
  var realizedOffset = 0;
  try { realizedOffset = (d.realizedGains && d.realizedGains.totalILS) || 0; } catch (e) { realizedOffset = 0; }
  var plan = [], watch = [];
  conc.forEach(function (x) {
    if (x.level === 'ok') return;
    if (x.level === 'warn') { watch.push({ sym: x.sym, label: x.label, weight: x.weight }); return; }
    if (String(x.sym).indexOf('F:') === 0) { watch.push({ sym: x.sym, label: x.label, weight: x.weight }); return; }
    var trimILS = x.val - (CAP / 100) * invTotal;
    if (trimILS <= 0) return;
    var holdingQty = holdings.filter(function (h) { return (h.src === 'IBKR' ? h.sym : 'IL') === x.sym; }).reduce(function (s, h) { return s + (h.qty || 0); }, 0);
    if (!holdingQty) holdingQty = 1;
    var unit = bySym[x.sym] / holdingQty;
    var trimQty = Math.floor(trimILS / unit);
    if (trimQty < 1) trimQty = 1;
    var calc = null;
    if (x.sym !== 'IL') {
      try { calc = _riskTrimTax(lots, x.sym, trimQty, unit); } catch (e) { calc = null; }
    }
    var taxNet = calc ? calc.taxILS : null;
    plan.push({
      sym: x.sym, label: x.label, weight: x.weight, level: x.level,
      trimILS: Math.round(calc ? calc.proceedsILS : trimILS),
      trimQty: calc ? calc.qty : trimQty,
      targetWeight: CAP,
      gainILS: calc ? calc.gainILS : null,
      taxILS: taxNet,
      taxPct: calc ? calc.taxPct : null,
      lots: calc ? calc.lots : [],
      note: x.sym === 'IL' ? 'קרן ישראלית ב-FAIR — אין פירוט לוטים, המס יחושב לפי מחיר מכירה פחות עלות ממוצעת' : ''
    });
  });
  if (fairGroup.weight >= WARN) watch.push({ sym: 'FAIR', label: 'קבוצת קרנות FAIR', weight: fairGroup.weight });
  var totalTax = plan.reduce(function (s, x) { return s + (x.taxILS || 0); }, 0);
  var totalTrim = plan.reduce(function (s, x) { return s + (x.trimILS || 0); }, 0);

  // ── 4. ציון סיכון ──
  var dd = (d.drawdown && d.drawdown.maxDrawdownPct) || 0;
  var usdShare = ((d.ibkr.totalVal || 0) / totalAll) * 100;
  var comp = {
    concentration: Math.min(100, nominalTop / 25 * 100),
    effective: Math.min(100, effectiveTop / 60 * 100),
    currency: Math.min(100, usdShare),
    diversity: Math.max(0, Math.min(100, (6 - distinctBuckets) / 6 * 100)),
    drawdown: Math.min(100, Math.abs(dd) * 5)
  };
  var score = Math.round(comp.concentration * 0.40 + comp.effective * 0.25 + comp.currency * 0.15 + comp.diversity * 0.10 + comp.drawdown * 0.10);
  var band = score >= 75 ? { key: 'very_high', he: 'ריכוז גבוה מאוד' } : score >= 55 ? { key: 'high', he: 'מרוכז' } : score >= 30 ? { key: 'mid', he: 'מוטה' } : { key: 'low', he: 'מאוזן' };

  return {
    ok: true,
    version: APP_VERSION,
    asOf: new Date().toISOString(),
    usdIls: usdIls,
    totals: { portfolio: Math.round(totalAll), securities: Math.round(invTotal), cash: Math.round(totalAll - invTotal) },
    concentration: { items: conc, fairGroup: fairGroup, top5Weight: Math.round(top5 * 10) / 10, hhi: Math.round(hhi * 1000) / 1000, thresholds: { warn: WARN, cap: CAP } },
    overlap: { buckets: bucketList, nominalTop: nominalTop, effectiveTop: effectiveTop, distinctBuckets: distinctBuckets, note: overlapNote },
    rebalance: { cap: CAP, plan: plan, watch: watch, totalTaxILS: Math.round(totalTax), totalTrimILS: Math.round(totalTrim), realizedOffsetILS: Math.round(realizedOffset) },
    risk: { score: score, band: band, components: comp, drawdownPct: dd, usdSharePct: Math.round(usdShare * 10) / 10 }
  };
}

function RISK_engine(token) {
  var g = _gate(token); if (g) return g;
  try { return JSON.stringify(_riskBuild()); } catch (e) {
    Logger.log('RISK_engine err: ' + e);
    return JSON.stringify({ error: 'risk: ' + e });
  }
}

function getPortfolioData(token) {
  var g = _gate(token); if (g) return g;
  var payload = _getPortfolioData();
  payload.meta = payload.meta || {};
  var f = _demoFactor(token);
  if (f > 0) {
    // ✅ v11.7.0.0: סשן דמו — כל הכסף והכמויות מוקטנים בשרת; מחירי יחידה ואחוזים אמיתיים
    payload = _demoTransform(payload, f);
    payload.meta = payload.meta || {};
    payload.meta.scope = 'demo';
  } else {
    payload.meta.scope = 'real';
  }
  payload.meta.canDemo = _isRealAdmin(token); // כפתור הדמו רק למנהל בסשן אמיתי
  // ✅ v12.4.3.4: נתוני פנסיה וביטוח תמיד אמיתיים — גם במצב דמו (בקשת אופיר 28/09/2026).
  // מצורפים אחרי הטרנספורמציה כדי שלא יוקטנו.
  try { payload.pension = _pensionPayload(); } catch (eP) { Logger.log("pension payload: " + eP); }
  return JSON.stringify(payload);
}

// ── // עמלות — קריאה מגיליון "עמלות"
// מבנה צפוי: שורה 1 = כותרות, נתונים משורה 2
// עמודות: TradeDate | Symbol | Buy/Sell | Quantity | TradePrice | IBCommission | NetCash | TransactionType
// ── // ── פונקציה שקוראת נתוני עמלות מהגיליון עבור האתר ──
function getCommissionsData() {
  var sheet = SS.getSheetByName('עמלות IBKR');
  if (!sheet) return { totals: { totalUSD: 0, totalILS: 0, txCount: 0, buyCount: 0, sellCount: 0, avgPerTrade: 0 }, bySymbol: [], byMonth: [], transactions: [] };

  var lastRow = sheet.getLastRow();
  if (lastRow < 6) return { totals: { totalUSD: 0, totalILS: 0, txCount: 0, buyCount: 0, sellCount: 0, avgPerTrade: 0 }, bySymbol: [], byMonth: [], transactions: [] };

  var usdIls = getCurrentUSDILS();

  // ✅ v11.6.3.0: batch-read — קריאה אחת לגיליון במקום 5 קריאות לכל שורה
  var all = sheet.getRange(1, 1, lastRow, 5).getValues();

  // ══════ סיכום לפי נייר (שורות 6 עד 'סה"כ') ══════
  var bySymbol = [];
  for (var i = 5; i < all.length; i++) {
    var sym = all[i][0];
    if (!sym || sym === 'סה"כ' || sym === '') break;
    var count = all[i][1];
    var buys = all[i][2];
    var sells = all[i][3];
    var totalUSD = all[i][4];
    bySymbol.push({
      symbol: sym, count: count, buys: buys, sells: sells,
      totalUSD: totalUSD, avgPerTrade: count > 0 ? totalUSD / count : 0
    });
  }

  // ══════ חישוב סה"כ מהסיכום ══════
  var totalUSD = bySymbol.reduce(function(s, r) { return s + r.totalUSD; }, 0);
  var txCount = bySymbol.reduce(function(s, r) { return s + r.count; }, 0);
  var buyCount = bySymbol.reduce(function(s, r) { return s + r.buys; }, 0);
  var sellCount = bySymbol.reduce(function(s, r) { return s + r.sells; }, 0);

  // ══════ קריאת פירוט עסקאות (מתחת לסיכום) ══════
  var transactions = [];
  var byMonth = {};

  // מצא את שורת הפירוט — מחפש "תאריך" בעמודה 1 (✅ v11.6.3.0: מהמערך שכבר נקרא)
  var detailStartIdx = 0;
  for (var i = 0; i < all.length; i++) {
    if (all[i][0] === 'תאריך') { detailStartIdx = i + 1; break; }
  }

  if (detailStartIdx > 0) {
    for (var i = detailStartIdx; i < all.length; i++) {
      var date = String(all[i][0]);
      var sym = String(all[i][1]).trim();
      var type = String(all[i][2]).trim();
      var qty = parseFloat(all[i][3]) || 0;
      var comm = parseFloat(all[i][4]) || 0;

      if (!sym || !date || sym === '') continue;

      transactions.push({ date: date, symbol: sym, type: type, qty: qty, commission: comm, price: 0 });

      var month = date.substring(0, 7);
      if (!byMonth[month]) byMonth[month] = { month: month, totalUSD: 0, count: 0 };
      byMonth[month].totalUSD += comm;
      byMonth[month].count++;
    }
  }

  var byMonthArr = Object.keys(byMonth).map(function(k) { return byMonth[k]; }).sort(function(a, b) { return a.month.localeCompare(b.month); });
  transactions.sort(function(a, b) { return b.date.localeCompare(a.date); });

  return {
    totals: {
      totalUSD: totalUSD,
      totalILS: totalUSD * usdIls,
      txCount: txCount,
      buyCount: buyCount,
      sellCount: sellCount,
      avgPerTrade: txCount > 0 ? totalUSD / txCount : 0
    },
    bySymbol: bySymbol,
    byMonth: byMonthArr,
    transactions: transactions
  };
}
// ── פונקציה שקוראת נתוני עמלות FAIR מהגיליון עבור האתר ──
function getFairCommissionsData() {
  var empty = { totals: { totalILS: 0, txCount: 0, buyCount: 0, sellCount: 0, avgPerTrade: 0 }, bySymbol: [], transactions: [] };
  var sheet = SS.getSheetByName('עמלות IBKR');
  if (!sheet) return empty;

  var C = 8; // עמודה I
  var lastRow = sheet.getLastRow();
  if (lastRow < 6) return empty;

  // ✅ v11: batch read — קריאה אחת במקום מאות קריאות תא-תא
  var data = sheet.getRange(1, C + 1, lastRow, 7).getValues();

  // ══════ סיכום לפי קרן (שורות 6 עד 'סה"כ') ══════
  var bySymbol = [];
  for (var i = 5; i < data.length; i++) {
    var c1 = String(data[i][0]).trim();
    if (!c1 || c1 === 'סה"כ' || c1 === 'תאריך' || c1 === 'פירוט עסקאות') break;
    var count = parseFloat(data[i][1]) || 0;
    var totalILS = parseFloat(data[i][4]) || 0;
    bySymbol.push({
      symbol: c1, count: count, buys: parseFloat(data[i][2]) || 0, sells: parseFloat(data[i][3]) || 0,
      totalILS: totalILS, avgPerTrade: count > 0 ? totalILS / count : 0
    });
  }

  var totalILS = 0, txCount = 0, buyCount = 0, sellCount = 0;
  bySymbol.forEach(function(r) { totalILS += r.totalILS; txCount += r.count; buyCount += r.buys; sellCount += r.sells; });

  // ══════ פירוט עסקאות (מתחת לכותרת 'תאריך') ══════
  var transactions = [];
  for (var j = 0; j < data.length; j++) {
    if (String(data[j][0]).trim() === 'תאריך') {
      for (var k = j + 1; k < data.length; k++) {
        var date = String(data[k][0]).trim();
        var sym = String(data[k][1]).trim();
        if (!date || !sym) continue;
        transactions.push({
          date: date, symbol: sym, name: String(data[k][5] || '').trim(),
          type: String(data[k][2] || '').trim(),
          qty: parseFloat(data[k][3]) || 0,
          commission: parseFloat(data[k][4]) || 0
        });
      }
      break;
    }
  }

  transactions.sort(function(a, b) { return b.date.localeCompare(a.date); });

  return {
    totals: {
      totalILS: totalILS,
      txCount: txCount,
      buyCount: buyCount,
      sellCount: sellCount,
      avgPerTrade: txCount > 0 ? totalILS / txCount : 0
    },
    bySymbol: bySymbol,
    transactions: transactions
  };
}

function applyRowFormat(sheet, row, ret) {
  // ✅ פורמט batch — טווח אחד במקום 8 נפרדים
  sheet.getRange(row, 5, 1, 10).setNumberFormats([
    ['#,##0', '#,##0.00', '#,##0.0000', '#,##0.00 ₪', '#,##0.00', '#,##0.0000', '#,##0.00 ₪', '0.00%', '0.00%', '#,##0.00']
  ]);
  // צבעי תשואה
  sheet.getRange(row, 13).setFontColor(ret >= 0 ? '#2ECC71' : '#E74C3C');
  sheet.getRange(row, 14).setFontColor(ret >= 0 ? '#2ECC71' : '#E74C3C');
}
// ── טלגרם — הודעות (זהה למקור, רק עם cache לsettings) ──
function buildIBKRMessage(positions, usdToday) {
  if (!positions || !Array.isArray(positions)) return '❌ IBKR: לא התקבלו נתונים\nבדוק שעדכנת נתוני IBKR דרך Claude.';
  const dateStr = Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'dd/MM/yyyy HH:mm');
  const nonCash = positions.filter(r=>!r.isCash);
  const totCost = nonCash.reduce((s,r)=>s+r.costILS,0), totVal = positions.reduce((s,r)=>s+r.valueILS,0), totRet = nonCash.reduce((s,r)=>s+r.retILS,0);
  const totPct = totCost>0?totRet/totCost:0, s = totRet>=0?'+':'';
  let msg = '<b>🏦 IBKR — '+dateStr+'</b>\n💱 USD/ILS: '+usdToday.toFixed(4)+'\n\n📊 <b>סיכום</b>\n  עלות מקורית: ₪'+fmt(totCost)+'\n  שווי נוכחי:  ₪'+fmt(totVal)+'\n  '+(totRet>=0?'📈':'📉')+' תשואה: '+s+'₪'+fmt(Math.abs(totRet))+' ('+s+(totPct*100).toFixed(2)+'%)\n\n';
  const cash = positions.filter(r=>r.isCash);
  if (cash.length>0) { msg+='💵 <b>מזומן IBKR</b>\n'; cash.forEach(c=>{msg+='  '+(c.desc||c.sym)+': '+(c.qty||0).toFixed(2)+' ≈ ₪'+fmt(c.valueILS)+'\n'}); msg+='\n'; }
  msg+='📋 <b>ניירות</b>\n─────────────────\n';
  nonCash.forEach(p=>{
    const sign=p.retILS>=0?'+':'';
    msg+=(p.retILS>=0?'🟢':'🔴')+' <b>'+(p.sym)+'</b>\n';
    if(p.costILS>0) msg+='  קנייה: $'+(p.buyPrice||p.buyP||0).toFixed(2)+' | שער: ₪'+(p.usdIlsBuy||p.buyFX||0).toFixed(3)+' | '+(p.buyDate||'')+'\n  עלות: ₪'+fmt(p.costILS)+'\n';
    msg+='  עכשיו: $'+(p.curP||0).toFixed(2)+' × '+p.qty+' = ₪'+fmt(p.valueILS)+'\n';
    if(p.costILS>0) msg+='  תשואה: '+sign+'₪'+fmt(Math.abs(p.retILS))+' ('+sign+((p.retPct||0)*100).toFixed(2)+'%)\n';
    msg+='─────────────────\n';
  });
  return msg;
}

function buildFAIRMessage() {
  const fair = SS.getSheetByName('FAIR'), dateStr = Utilities.formatDate(new Date(),'Asia/Jerusalem','dd/MM/yyyy HH:mm');
  const lastRow = fair.getLastRow(), dataRows = lastRow>=7?fair.getRange('A7:I'+lastRow).getValues():[];
  const totVal = dataRows.reduce((s,r)=>s+(parseFloat(r[6])||0),0), totPL = dataRows.reduce((s,r)=>s+(parseFloat(r[7])||0),0);
  const s = totPL>=0?'+':'';
  let msg = '<b>🇮🇱 FAIR — '+dateStr+'</b>\n\n📊 <b>סיכום</b>\n  שווי נוכחי: ₪'+fmt(totVal)+'\n  '+(totPL>=0?'📈':'📉')+' תשואה: '+s+'₪'+fmt(Math.abs(totPL))+'\n\n📋 <b>ניירות</b>\n─────────────────\n';
  dataRows.forEach(row=>{
    const name=String(row[0]).trim(); if(!name) return;
    const val=parseFloat(row[6])||0, pl=parseFloat(row[7])||0, sign=pl>=0?'+':'';
    msg+=(pl>=0?'🟢':'🔴')+' <b>'+name+'</b>\n  שווי: ₪'+fmt(val)+' | תשואה: '+sign+'₪'+fmt(Math.abs(pl))+'\n─────────────────\n';
  });
  return msg;
}

function buildBankMessage(banks) {
  if (!banks||banks.length===0) return '';
  const byI={};
  banks.forEach(b=>{if(!byI[b.institution])byI[b.institution]=[];byI[b.institution].push(b)});
  const totalAll=banks.reduce((s,b)=>s+b.valueILS,0);
  let msg='🏛 <b>חשבונות בנק</b>\n─────────────────\n';
  Object.keys(byI).forEach(inst=>{
    const accounts=byI[inst], instTotal=accounts.reduce((s,b)=>s+b.valueILS,0);
    msg+='🏦 <b>'+inst+'</b> | סה"כ: ₪'+fmt(instTotal)+'\n';
    accounts.forEach(b=>{msg+='  '+b.accType+': '+(b.ccy==='ILS'?'₪'+fmt(b.balance):b.balance.toLocaleString('en-US')+' '+b.ccy+' ≈ ₪'+fmt(b.valueILS))+'\n'});
    msg+='─────────────────\n';
  });
  return msg+'💰 <b>סה"כ בנקים: ₪'+fmt(totalAll)+'</b>\n';
}

function buildSavingsMessage() {
  const s=getSavingsData(); if(!s.kids.length) return '';
  const dateStr=Utilities.formatDate(new Date(),'Asia/Jerusalem','dd/MM/yyyy HH:mm');
  let msg='👶 <b>חיסכון לכל ילד — '+dateStr+'</b>\n\n';
  s.kids.forEach(k=>{
    msg+='👤 <b>'+k.name+'</b>\n  קופה: '+k.fund+(k.track?' | '+k.track:'')+'\n  ב"ל: ₪'+fmt(k.bituachLeumi)+' | הורים: ₪'+fmt(k.parents)+'\n  💰 סה"כ: ₪'+fmt(k.total)+'\n';
    if(k.updatedAt) msg+='  עודכן: '+k.updatedAt+'\n';
    msg+='─────────────────\n';
  });
  return msg+'💎 <b>סה"כ כולל: ₪'+fmt(s.total)+'</b>\n';
}

function buildCashMessage() {
  const usdToday=getCurrentUSDILS(), dateStr=Utilities.formatDate(new Date(),'Asia/Jerusalem','dd/MM/yyyy HH:mm');
  let msg='<b>💵 מזומן — '+dateStr+'</b>\n💱 USD/ILS: '+usdToday.toFixed(4)+'\n\n';
  const ibkr=SS.getSheetByName('IBKR'), lastRow=ibkr.getLastRow(); let ibkrCash=0;
  if(lastRow>=10) ibkr.getRange(10,1,lastRow-9,13).getValues().forEach(row=>{
    if(String(row[2])==='מזומן'){const val=parseFloat(row[11])||0,qty=parseFloat(row[4])||0;ibkrCash+=val;msg+='🏦 <b>IBKR</b>\n  💵 '+qty.toLocaleString('en-US')+' '+String(row[3])+'\n  ₪'+fmt(val)+' (× '+usdToday.toFixed(4)+')\n\n';}
  });
  const banks=getBankAccounts(); let bankTotal=0;
  if(banks.length>0){const byI={};banks.forEach(b=>{if(!byI[b.institution])byI[b.institution]=[];byI[b.institution].push(b)});Object.keys(byI).forEach(inst=>{const accs=byI[inst],t=accs.reduce((s,b)=>s+b.valueILS,0);bankTotal+=t;msg+='🏦 <b>'+inst+'</b> | ₪'+fmt(t)+'\n';accs.forEach(b=>{msg+='  '+b.accType+': '+(b.ccy==='ILS'?'₪'+fmt(b.balance):b.balance.toLocaleString('en-US')+' '+b.ccy+' × '+b.rate.toFixed(4)+' = ₪'+fmt(b.valueILS))+'\n'});msg+='\n'});}
  let fairCash=0;const fair=SS.getSheetByName('FAIR'),fairLR=fair.getLastRow();
  if(fairLR>=7) fair.getRange('A7:G'+fairLR).getValues().forEach(row=>{if(String(row[0]).trim()==='מזומן')fairCash+=parseFloat(row[6])||0;});
  if(fairCash>0) msg+='🇮🇱 <b>FAIR — מזומן</b>\n  ₪'+fmt(fairCash)+'\n\n';
  return msg+'─────────────────\n💰 <b>סה"כ מזומן: ₪'+fmt(ibkrCash+bankTotal+fairCash)+'</b>\n';
}

function buildNetWorthMessage() {
  const usdToday=getCurrentUSDILS(), dateStr=Utilities.formatDate(new Date(),'Asia/Jerusalem','dd/MM/yyyy HH:mm');
  const ibkr=SS.getSheetByName('IBKR'),lastRow=ibkr.getLastRow();
  let ibkrValILS=0;
  if(lastRow>=10) ibkr.getRange(10,1,lastRow-9,13).getValues().forEach(row=>{const sym=String(row[0]);if(!sym||sym==='סה"כ')return;ibkrValILS+=parseFloat(row[11])||0;});
  const fair=SS.getSheetByName('FAIR'),fairLR=fair.getLastRow();
  const fairILS=fairLR>=7?fair.getRange('G7:G'+fairLR).getValues().reduce((s,r)=>s+(parseFloat(r[0])||0),0):0;
  const banks=getBankAccounts(),banksILS=banks.reduce((s,b)=>s+b.valueILS,0),savings=getSavingsData();
  const totalILS=ibkrValILS+fairILS+banksILS+savings.total;
  let msg='<b>💎 שווי נכסים כולל — '+dateStr+'</b>\n💱 USD/ILS: '+usdToday.toFixed(4)+'\n\n';
  msg+='🏦 <b>IBKR:</b> $'+fmt(ibkrValILS/usdToday)+' | ₪'+fmt(ibkrValILS)+'\n';
  msg+='🇮🇱 <b>FAIR:</b> $'+fmt(fairILS/usdToday)+' | ₪'+fmt(fairILS)+'\n🏛 <b>חשבונות בנק</b>\n';
  banks.forEach(b=>{msg+='  '+b.name+': $'+fmt(b.valueILS/usdToday)+' | ₪'+fmt(b.valueILS)+'\n'});
  msg+='👶 <b>חיסכון לכל ילד:</b> ₪'+fmt(savings.total)+'\n━━━━━━━━━━━━━━━━━\n💰 <b>סה"כ: $'+fmt(totalILS/usdToday)+' | ₪'+fmt(totalILS)+'</b>\n';
  return msg;
}

function buildDividendMessage() {
  const costs=getPurchaseCosts(),ibkrSymbols=Object.keys(costs).filter(s=>!s.startsWith('CASH'));
  const fair=SS.getSheetByName('FAIR'),fairLR=fair.getLastRow();
  const fairNames=fairLR>=7?fair.getRange('A7:A'+fairLR).getValues().map(r=>String(r[0]).trim()).filter(s=>s):[];
  let msg='<b>📅 דיבידנדים קרובים</b>\n\n';
  if(ibkrSymbols.length>0){
    msg+='🏦 <b>IBKR</b>\n─────────────────\n';
    ibkrSymbols.forEach(sym=>{
      try{
        const meta=JSON.parse(UrlFetchApp.fetch('https://query1.finance.yahoo.com/v8/finance/chart/'+sym+'?interval=1d&range=1d',{muteHttpExceptions:true}).getContentText()).chart.result[0].meta;
        msg+='📌 <b>'+sym+'</b>\n  Ex-Div: '+(meta.exDividendDate?Utilities.formatDate(new Date(meta.exDividendDate*1000),'Asia/Jerusalem','dd/MM/yyyy'):'לא זמין')+'\n  רבעוני: $'+(meta.trailingAnnualDividendRate?(meta.trailingAnnualDividendRate/4).toFixed(3):'לא זמין')+'\n  תשואה: '+(meta.trailingAnnualDividendYield?(meta.trailingAnnualDividendYield*100).toFixed(2)+'%':'לא זמין')+'\n─────────────────\n';
      }catch(e){msg+='📌 <b>'+sym+'</b>\n  שגיאה\n─────────────────\n';}
      Utilities.sleep(300);
    });
  }
  if(fairNames.length>0){msg+='\n🇮🇱 <b>FAIR</b>\n─────────────────\n⚠️ בדוק ידנית:\nhttps://info.tase.co.il\n';fairNames.forEach(n=>{msg+='  • '+n+'\n'});}
  return msg;
}

function handleChart(chatId, cfg) {
  try {
    const sheet=SS.getSheetByName('IBKR'),fair=SS.getSheetByName('FAIR'),banks=getBankAccounts(),lastRow=sheet.getLastRow();
    let labels=[],values=[];
    if(lastRow>=10) sheet.getRange(10,1,lastRow-9,13).getValues().forEach(row=>{const sym=String(row[0]),val=parseFloat(row[11])||0;if(sym&&sym!=='סה"כ'&&val>100){labels.push(sym);values.push(Math.round(val));}});
    const fairVal=fair.getLastRow()>=7?fair.getRange('G7:G'+fair.getLastRow()).getValues().reduce((s,r)=>s+(parseFloat(r[0])||0),0):0;
    if(fairVal>0){labels.push('FAIR 🇮🇱');values.push(Math.round(fairVal));}
    banks.forEach(b=>{if(b.valueILS>100){labels.push(b.name);values.push(Math.round(b.valueILS));}});
    const savings=getSavingsData();
    if(savings.total>0){labels.push('חיסכון לכל ילד 👶');values.push(Math.round(savings.total));}
    if(labels.length===0){sendTelegramTo(chatId,cfg.tgToken,'⚠️ אין נתונים לגרף');return;}
    const total=values.reduce((a,b)=>a+b,0);
    const colors=['#4A9EF7','#2ECC71','#F39C12','#E74C3C','#9B59B6','#1ABC9C','#E67E22','#3498DB','#27AE60','#8E44AD','#F1C40F','#16A085'];
    UrlFetchApp.fetch('https://api.telegram.org/bot'+cfg.tgToken+'/sendPhoto',{method:'post',contentType:'application/json',payload:JSON.stringify({chat_id:chatId,photo:'https://quickchart.io/chart?c='+encodeURIComponent(JSON.stringify({type:'pie',data:{labels:labels.map((l,i)=>l+' ('+((values[i]/total)*100).toFixed(1)+'%)'),datasets:[{data:values,backgroundColor:colors}]},options:{plugins:{title:{display:true,text:'הרכב תיק | ₪'+total.toLocaleString('en-US'),font:{size:16}},legend:{position:'right'}}}}))+  '&w=600&h=400&bkg=white',caption:'📊 <b>הרכב תיק</b> — סה"כ ₪'+total.toLocaleString('en-US'),parse_mode:'HTML'})});
  } catch(e){sendTelegramTo(chatId,cfg.tgToken,'❌ שגיאה בגרף: '+e.toString());}
}
// ── Polling טלגרם ──

// ═══════════════════════════════════════════════════════════
// ⏰ v13.3.5.0: מערכת תזכורות המלצות → וואטסאפ
// גיליון: תזכורות | בדיקה כל דקה בתוך checkTelegramMessages
// ═══════════════════════════════════════════════════════════
function _remSheet() {
  var sh = SS.getSheetByName('תזכורות');
  if (!sh) {
    sh = SS.insertSheet('תזכורות');
    sh.appendRow(['id', 'gid', 'title', 'due', 'details', 'status', 'sentAt', 'created']);
    sh.setFrozenRows(1);
  }
  return sh;
}

function REM_addReminder(token, obj) {
  var g = _gate(token); if (g) return g;
  try {
    obj = obj || {};
    if (!obj.gid || !obj.title || !obj.due) return { ok: false, error: 'נתונים חסרים' };
    var due = new Date(obj.due);                       // 'YYYY-MM-DDTHH:mm' — אזור הזמן של הסקריפט
    if (isNaN(due.getTime())) return { ok: false, error: 'תאריך לא תקין' };
    var id = 'rem_' + Utilities.getUuid().substring(0, 8);
    var sh = _remSheet();
    sh.appendRow([id, obj.gid, obj.title, due,
      JSON.stringify({ text: obj.text || '', saveYr: obj.saveYr || 0, sev: obj.sev || '' }),
      'pending', '', new Date()]);
    return { ok: true, id: id, dueText: _fmtDue(due) };
  } catch (e) { return { ok: false, error: String(e) }; }
}

function REM_listForGid(token, gid) {
  var g = _gate(token); if (g) return g;
  try {
    var sh = _remSheet(), last = sh.getLastRow();
    if (last < 2) return { ok: true, items: [] };
    var vals = sh.getRange(2, 1, last - 1, 8).getValues(), out = [];
    for (var i = 0; i < vals.length; i++) {
      if (String(vals[i][1]) === gid && String(vals[i][5]) === 'pending') {
        out.push({ id: vals[i][0], due: vals[i][3], dueText: _fmtDue(vals[i][3]) });
      }
    }
    return { ok: true, items: out };
  } catch (e) { return { ok: false, error: String(e) }; }
}

function REM_cancelReminder(token, id) {
  var g = _gate(token); if (g) return g;
  try {
    var sh = _remSheet(), last = sh.getLastRow();
    if (last < 2) return { ok: false, error: 'לא נמצא' };
    var ids = sh.getRange(2, 1, last - 1, 1).getValues();
    for (var i = 0; i < ids.length; i++) {
      if (String(ids[i][0]) === String(id)) { sh.getRange(i + 2, 6).setValue('cancelled'); return { ok: true }; }
    }
    return { ok: false, error: 'לא נמצא' };
  } catch (e) { return { ok: false, error: String(e) }; }
}

function _fmtDue(d) {
  try {
    return Utilities.formatDate(d, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
  } catch (e) { return String(d); }
}

// נקראת כל דקה מתוך checkTelegramMessages. מוצאת תזכורות שהגיע זמנן ושולחת לסופראייג'נטית
// (חבצלת) שתעביר לוואטסאפ של אופיר. דורש AGENT_API_KEY ב-Script Properties
// (מוגדר מרחוק דרך ?cfg=READ_TOKEN&k=AGENT_API_KEY&v=...).
function REM_checkDue() {
  try {
    var props = PropertiesService.getScriptProperties();
    var key = props.getProperty('AGENT_API_KEY');
    var sh = _remSheet(), last = sh.getLastRow();
    if (last < 2) return;
    var now = new Date();
    var vals = sh.getRange(2, 1, last - 1, 8).getValues();
    for (var i = 0; i < vals.length; i++) {
      var status = String(vals[i][5]), due = vals[i][3];
      if (status !== 'pending' || !(due instanceof Date) || due.getTime() > now.getTime()) continue;
      var row = i + 2, id = vals[i][0], gid = vals[i][1], title = vals[i][2];
      var det = {}; try { det = JSON.parse(vals[i][4] || '{}'); } catch (e) {}
      // סימון 'sending' לפני השליחה — למניעת כפילוּת
      sh.getRange(row, 6).setValue('sending');
      if (!key) continue;                              // אין מפתח עדיין — נשלח ברגע שיוגדר
      var msg = '⏰ תזכורת שנקבעה באפליקציה (מזהה ' + id + ', המלצה ' + gid + ') הגיע זמנה (' +
        _fmtDue(due) + '). שלח/י עכשיו הודעת וואטסאפ לאופיר עם תזכורת ההמלצה הבאה, בטון אישי וקצר:\n' +
        'המלצה: ' + title + '\n' + (det.text ? 'פירוט: ' + det.text + '\n' : '') +
        (det.saveYr ? 'חיסכון שנתי פוטנציאלי: ₪' + det.saveYr + '\n' : '') +
        'לטיפול: פתח את האפליקציה → לשונית המלצות → ההמלצה "' + title + '".';
      var sent = _remNotifyAgent(key, msg);
      sh.getRange(row, 6).setValue(sent ? 'sent' : 'pending');   // כשל תשלוח → נסה שוב בדקה הבאה
      if (sent) sh.getRange(row, 7).setValue(new Date());
      Utilities.sleep(400);
    }
  } catch (e) { Logger.log('REM_checkDue: ' + e); }
}

function _remNotifyAgent(key, text) {
  try {
    var props = PropertiesService.getScriptProperties();
    var base = props.getProperty('AGENT_API_BASE') || 'https://app.base44.com';
    var agentId = props.getProperty('AGENT_API_ID') || '6a842d761d7eee2c44efba6d';
    var convId = props.getProperty('AGENT_CONV_ID');
    if (!convId) {
      // אחזור שיחת ברירת המחדל (ה-API מחזיר אותה; לא נוצרת שיחה חדשה)
      var r0 = UrlFetchApp.fetch(base + '/api/agents/' + agentId + '/conversations', {
        method: 'post', contentType: 'application/json', muteHttpExceptions: true,
        headers: { Authorization: 'Bearer ' + key },
        payload: JSON.stringify({ title: 'תזכורות אפליקציה' })
      });
      var code0 = r0.getResponseCode(), body0 = r0.getContentText();
      if (code0 !== 200 && code0 !== 201) { Logger.log('REM conv create ' + code0 + ': ' + body0.substring(0, 300)); return false; }
      var j0 = JSON.parse(body0);
      convId = j0.id || j0.conversation_id || (j0.data && (j0.data.id || j0.data.conversation_id));
      if (!convId) { Logger.log('REM: no conv id in ' + body0.substring(0, 300)); return false; }
      props.setProperty('AGENT_CONV_ID', String(convId));
    }
    var r = UrlFetchApp.fetch(base + '/api/agents/' + agentId + '/conversations/' + convId + '/messages', {
      method: 'post', contentType: 'application/json', muteHttpExceptions: true,
      headers: { Authorization: 'Bearer ' + key },
      payload: JSON.stringify({ content: text })
    });
    if (r.getResponseCode() !== 200 && r.getResponseCode() !== 201) {
      Logger.log('REM send ' + r.getResponseCode() + ': ' + r.getContentText().substring(0, 300));
      // שיחה שנמחקה — ננקה וננסה שוב בדקה הבאה
      if (r.getResponseCode() === 404) props.deleteProperty('AGENT_CONV_ID');
      return false;
    }
    return true;
  } catch (e) { Logger.log('REM_notify: ' + e); return false; }
}


function checkTelegramMessages() {
  // ✅ v13.3.5.0: בדיקת תזכורות שהגיע זמנן — כל דקה, לפני הכל
  try { REM_checkDue(); } catch (e) { Logger.log('REM gate: ' + e); }

  // ✅ v11.2: polling נשאר כגיבוי — ה-webhook הוא הערוץ הראשי
  const cfg=getSettings(),props=PropertiesService.getScriptProperties(),lastId=parseInt(props.getProperty('lastUpdateId')||'0');
  try {
    const data=JSON.parse(UrlFetchApp.fetch('https://api.telegram.org/bot'+cfg.tgToken+'/getUpdates?offset='+(lastId+1)+'&timeout=0',{muteHttpExceptions:true}).getContentText());
    if(!data.ok||!data.result||data.result.length===0)return;
    data.result.forEach(update=>{
      const msg=update.message;
      if(msg&&msg.text){
        const text=msg.text.trim(),chatId=String(msg.chat.id);
        if(chatId===cfg.tgChatId)_processTelegramCommand(text,chatId,cfg);
      }
      // ✅ v12.1.0.0: כפתורים גם בגיבוי polling
      const cbq=update.callback_query;
      if(cbq&&cbq.data&&String(cbq.data).indexOf('cmd:')===0){
        const chatId=cbq.message?String(cbq.message.chat.id):'';
        if(chatId===cfg.tgChatId){_tgAnswerCallback(cfg.tgToken,cbq.id);_processTelegramCommand(String(cbq.data).substring(4),chatId,cfg);}
      }
      props.setProperty('lastUpdateId',String(update.update_id));
    });
  } catch(e){Logger.log('Polling שגיאה: '+e);}
}

// ✅ v11.2: מנוע פקודות משותף — polling ו-webhook
function _processTelegramCommand(text, chatId, cfg) {
  if(text==='דיבידנד'||text==='/dividend'){sendTelegram('⏳ מחפש דיבידנדים...');sendTelegram(buildDividendMessage());}
  else if(text==='תיק'||text==='/portfolio'){
    const d=_getPortfolioData(),usd=d.meta.usdIls;
    const pos=d.ibkr.positions.map(p=>({sym:p.sym,assetHeb:p.type,qty:p.qty,buyPrice:p.buyP,buyDate:p.buyDate,usdIlsBuy:p.buyFX,costILS:p.costILS,curP:p.curP,valueILS:p.valILS,retILS:p.retILS,retPct:p.retPct,isCash:false}));
    if(d.ibkr.cash>0)pos.push({sym:'CASH-USD',desc:'מזומן',qty:d.ibkr.cash/usd,valueILS:d.ibkr.cash,isCash:true});
    sendTelegram(buildIBKRMessage(pos,usd));Utilities.sleep(500);sendTelegram(buildFAIRMessage());
    const bm=buildBankMessage(getBankAccounts());if(bm){Utilities.sleep(500);sendTelegram(bm);}
    const sm=buildSavingsMessage();if(sm){Utilities.sleep(500);sendTelegram(sm);}
  }
  else if(text==='מזומן'||text==='/cash'){sendTelegram(buildCashMessage());}
  else if(text==='שווי'||text==='networth'){sendTelegram(buildNetWorthMessage());}
  else if(text==='חיסכון'||text==='/חיסכון'){sendTelegram(buildSavingsMessage()||'אין נתוני חיסכון עדיין.');}
  else if(text==='גרף'||text==='/chart'){sendTelegram('⏳ מכין גרף...');handleChart(chatId,cfg);}
  // ✅ v12.1.0.0: פקודות פרטניות לכפתורים — IBKR בלבד / FAIR בלבד / שער דולר
  else if(text==='IBKR'||text==='/ibkr'){const d=_getPortfolioData(),usd=d.meta.usdIls;const pos=d.ibkr.positions.map(p=>({sym:p.sym,assetHeb:p.type,qty:p.qty,buyPrice:p.buyP,buyDate:p.buyDate,usdIlsBuy:p.buyFX,costILS:p.costILS,curP:p.curP,valueILS:p.valILS,retILS:p.retILS,retPct:p.retPct,isCash:false}));if(d.ibkr.cash>0)pos.push({sym:'CASH-USD',desc:'מזומן',qty:d.ibkr.cash/usd,valueILS:d.ibkr.cash,isCash:true});sendTelegram(buildIBKRMessage(pos,usd));}
  else if(text==='FAIR'||text==='/fair'){sendTelegram(buildFAIRMessage());}
  else if(text==='שער'||text==='דולר'||text==='/rate'){
    const usd=getCurrentUSDILS();
    sendTelegram('💱 <b>USD/ILS: ' + usd.toFixed(4) + '</b>\nמחירי התיק מומרים בשער זה.');
  }
  else if(text==='עזרה'||text==='/help'||text==='/start'){sendTelegram('<b>📱 פקודות זמינות</b>\n\n📊 <b>תיק</b> — סיכום מלא\n🏦 <b>IBKR</b> / 🇮🇱 <b>FAIR</b> — חשבונות בנפרד\n💱 <b>שער</b> — דולר/שקל\n💵 <b>מזומן</b> — נזילות\n💎 <b>שווי</b> — נטו\n👶 <b>חיסכון</b> — ילדים\n📈 <b>גרף</b> — פיזור\n📅 <b>דיבידנד</b> — תזרים\n🧠 <b>ניתוח</b> — ניתוח חכם\n🔔 <b>התראות</b> — התראות שוק\n\n⬇️ <b>או פשוט לחץ על כפתור:</b>\n\n⚡ IBKR מתעדכן דרך Claude\n⏰ סיכום יומי 10:00 | ניתוח שבועי ראשון 10:30',_tgMainMenuKeyboard());}
  else if(text==='ניתוח'||text==='/analysis'){sendTelegram('🧠 מכין ניתוח...');REPORT_weekly();}
  else if(text==='התראות'||text==='/alerts'){sendTelegram('🔔 בודק התראות...');checkMarketAlerts();_sendSmartAlertsTelegram();}
  else{sendTelegram('❓ פקודה לא מוכרת. שלח <b>עזרה</b> או השתמש בכפתורים:',_tgMainMenuKeyboard());}
}

// ═══════════════════════════════════════════════════════════════
// ✅ v11.2: Telegram Webhook — תגובה מיידית במקום polling של 5 דקות
// ═══════════════════════════════════════════════════════════════

function _handleTelegramWebhook(e) {
  // ✅ v11.3: דה-דופ + נעילה — טלגרם מוסר מחדש עדכונים כשהתשובה איטית; מעבדים כל עדכון פעם אחת בלבד
  const props = PropertiesService.getScriptProperties();
  const secret = props.getProperty('TG_WEBHOOK_SECRET') || '';
  if (!secret || e.parameter.tg !== secret)
    return ContentService.createTextOutput('Unauthorized').setMimeType(ContentService.MimeType.TEXT);
  const update = JSON.parse(e.postData.contents);
  const updateId = Number(update.update_id || 0);
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(25000); // מסירה כפולה שמגיעה במקביל תחכה — ואז תדלג כי כבר טופל
    const last = parseInt(props.getProperty('lastUpdateId') || '0', 10);
    if (updateId > last) {
      props.setProperty('lastUpdateId', String(updateId)); // סימון לפני עיבוד = בלי לופים
      try {
        const msg = update.message || update.edited_message;
        if (msg && msg.text) {
          const cfg = getSettings();
          const chatId = String(msg.chat.id);
          if (chatId === cfg.tgChatId) _processTelegramCommand(msg.text.trim(), chatId, cfg);
        }
        // ✅ v12.1.0.0: לחיצה על כפתור inline — מנותבת לאותו מנוע פקודות
        const cbq = update.callback_query;
        if (cbq && cbq.data && String(cbq.data).indexOf('cmd:') === 0) {
          const cfg2 = getSettings();
          const chatId2 = cbq.message ? String(cbq.message.chat.id) : '';
          if (chatId2 === cfg2.tgChatId) {
            _tgAnswerCallback(cfg2.tgToken, cbq.id);
            _processTelegramCommand(String(cbq.data).substring(4), chatId2, cfg2);
          }
        }
      } catch (pErr) {
        // ✅ v12.5.0.5: כשל בעיבוד לא נבלע יותר — מחזירים את סימון הדה-דופ כדי שניסיון החוזר
        // של טלגרם יעובד בהצלחה (05/10 12:01: "תיק" נפל בדיוק בהחלפת דפלוימנט, הרטריי בלע),
        // וגם מודיעים בצ'אט במקום לשתוק.
        try { props.setProperty('lastUpdateId', String(last)); } catch (_) {}
        try {
          const cfgE = getSettings();
          sendTelegramTo(cfgE.tgChatId, cfgE.tgToken, '⚠️ שגיאה בעיבוד הפקודה: ' + pErr + '\nטלגרם ינסה שוב בעוד רגע.');
        } catch (_) {}
        Logger.log('Telegram webhook שגיאת עיבוד עדכון ' + updateId + ': ' + pErr);
      }
    } else {
      Logger.log('Webhook: עדכון ' + updateId + ' כפול — נדלג (last=' + last + ')');
    }
  } catch (err) {
    Logger.log('Telegram webhook שגיאה: ' + err);
    // ✅ v12.5.0.5: גם שגיאות מסגרת (נעילה/קליטה) מדווחות למשתמש — אפס שתיקה
    try {
      const cfgO = getSettings();
      sendTelegramTo(cfgO.tgChatId, cfgO.tgToken, '⚠️ טלגרם: שגיאת קליטה (' + err + ').');
    } catch (_) {}
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
  return ContentService.createTextOutput('ok').setMimeType(ContentService.MimeType.TEXT);
}

// הרצה חד-פעמית: TELEGRAM_setupWebhook('כתובת-/exec-המלאה') ואז שליחת "עזרה" לבוט
function TELEGRAM_setupWebhook(webappUrl) {
  const cfg = getSettings();
  if (!webappUrl || webappUrl.indexOf('/exec') === -1)
    throw new Error('העבר את כתובת ה-/exec המלאה, למשל: TELEGRAM_setupWebhook("https://script.google.com/macros/s/XXXX/exec")');
  const props = PropertiesService.getScriptProperties();
  let secret = props.getProperty('TG_WEBHOOK_SECRET');
  if (!secret) { secret = Utilities.getUuid().replace(/-/g, ''); props.setProperty('TG_WEBHOOK_SECRET', secret); }
  const hookUrl = webappUrl + '?tg=' + secret;
  // ✅ v11.5.0.0: שומרים את הכתובת ב-Script Properties — מעכשיו TELEGRAM_setupWebhookOnce תמיד תדע לאיזו פריסה לרשום
  props.setProperty('TG_WEBAPP_URL', webappUrl);
  const res = UrlFetchApp.fetch('https://api.telegram.org/bot' + cfg.tgToken + '/setWebhook', {
    method: 'post', contentType: 'application/json', muteHttpExceptions: true,
    payload: JSON.stringify({ url: hookUrl, allowed_updates: ['message'], drop_pending_updates: true }) // ✅ v11.5.0.1: מנקה הודעות ישנות שהצטברו בזמן התקלה
  }).getContentText();
  Logger.log('setWebhook ← ' + res);
  TELEGRAM_status();
}

// ✅ v11.5.0.0: רישום חוזר בלי להעביר כתובת — קודם כל מ-TG_WEBAPP_URL (הכתובת שנשמרה בפעם הקודמת),
// אחרת מנסה את כתובת הפריסה האוטומטית. מריצים אחרי כל Deploy של גרסה חדשה.
function TELEGRAM_setupWebhookOnce() {
  const props = PropertiesService.getScriptProperties();
  // ✅ v12.5.0.2: סדר עדיפויות הפוך — WEBAPP_URL (הפריסה הפעילה, מתוחזק בכל שחרור) קודם לכל.
  // המאגר TG_WEBAPP_URL הכיל כתובת ישנה מתקופת v11.5 (הדפלוימנט AKfycby5 הלא-פתוח)
  // והסתיר את הקבוע המתוקן — מה שגרם לרישום ה-webhook לפריסה הלא נכונה (05/10/2026).
  let url = (typeof WEBAPP_URL !== 'undefined') ? WEBAPP_URL : '';
  if (!url || url.indexOf('/exec') === -1) url = props.getProperty('TG_WEBAPP_URL') || '';
  if (!url || url.indexOf('/exec') === -1) url = (ScriptApp.getService().getUrl() || '');
  if (url.indexOf('/exec') === -1)
    throw new Error('לא נמצאה כתובת /exec — עדכן את WEBAPP_URL בראש הקובץ לכתובת הפריסה הפעילה.');
  Logger.log('רושם webhook לכתובת: ' + url);
  TELEGRAM_setupWebhook(url);
}

// ✅ v11.5.0.0: אבחון מלא — כתובת, הודעות תקועות, שגיאה אצל טלגרם, ובדיקת גישה אנונימית לפריסה.
// ההרצה עצמה אומרת מה הבעיה — אין צורך לנחש.
function TELEGRAM_status() {
  const cfg = getSettings();
  const info = JSON.parse(UrlFetchApp.fetch('https://api.telegram.org/bot' + cfg.tgToken + '/getWebhookInfo', { muteHttpExceptions: true }).getContentText());
  const r = (info && info.result) || {};
  Logger.log('═══════ אבחון Webhook טלגרם ═══════');
  Logger.log('1) כתובת רשומה: ' + (r.url || '❌ לא נרשם כלל — הרץ TELEGRAM_setupWebhookOnce'));
  Logger.log('2) הודעות ממתינות אצל טלגרם: ' + (r.pending_update_count || 0) + (r.pending_update_count > 0 ? ' ← ההודעות לא מגיעות לשרת!' : ''));
  if (r.last_error_date) {
    const when = new Date(r.last_error_date * 1000);
    Logger.log('3) שגיאה אחרונה אצל טלגרם: ' + (r.last_error_message || 'אין') + ' (בשעה ' + Utilities.formatDate(when, 'Asia/Jerusalem', 'HH:mm:ss') + ')');
  } else {
    Logger.log('3) שגיאה אחרונה אצל טלגרם: אין');
  }
  if (r.url && r.url.indexOf('script.google.com') >= 0) {
    try {
      // ✅ v11.5.0.1: בדיקת POST אנונימי — חיקוי מדויק של מה שטלגרם עושה (GET מקודם הטעה — גוגל ענתה לו 200 מבפנים)
      const resp = UrlFetchApp.fetch(r.url, {
        method: 'post', contentType: 'application/json', followRedirects: false, muteHttpExceptions: true,
        payload: JSON.stringify({ update_id: 0 }) // עדכון דמה — מסתיים בניתוב לדה-דופ ולא שולח כלום
      });
      const code = resp.getResponseCode();
      const loc = (resp.getAllHeaders().Location || '');
      // ✅ v12.5.0.3: GAS /exec תמיד מחזיר 302 לגוגל-usercontent — זו הפניה תקינה שטלגרם עוקב אחריה,
      // לא חסימה (אזעקת השווא הקודמת הטעתה אותנו ב-05/10). חסימה אמיתית = הפניה להתחברות של גוגל.
      if (code === 200) Logger.log('4) POST אנונימי (כמו טלגרם): ✅ קיבל 200 — הכתובת פתוחה ומוכנה');
      else if (loc.indexOf('accounts.google.com') >= 0)
        Logger.log('4) POST אנונימי (כמו טלגרם): ❌ נחסם — הפניה להתחברות גוגל. תקן: Deploy → Manage deployments → ✏️ (הפריסה מהכתובת) → Who has access = "Anyone" + Execute as = "Me" → Save → הרץ TELEGRAM_setupWebhookOnce');
      else if (code === 301 || code === 302 || code === 303 || code === 307) {
        try {
          const resp2 = UrlFetchApp.fetch(r.url, {
            method: 'post', contentType: 'application/json', followRedirects: true, muteHttpExceptions: true,
            payload: JSON.stringify({ update_id: 0 })
          });
          const code2 = resp2.getResponseCode();
          if (code2 === 200) Logger.log('4) POST אנונימי (כמו טלגרם): ✅ פתוח — הפניה תקינה של גוגל (' + code + ' → 200 אנונימי), טלגרם עוקב אחריה בהצלחה');
          else Logger.log('4) POST אנונימי (כמו טלגרם): ❌ בסוף שרשרת ההפניות קוד ' + code2 + ' ← זו הבעיה');
        } catch (eR) {
          Logger.log('4) POST אנונימי (כמו טלגרם): שגיאת מעקב אחרי הפניה: ' + eR);
        }
      }
      else Logger.log('4) POST אנונימי (כמו טלגרם): קוד ' + code + ' ← אם זה לא 200, זו כנראה הבעיה');
    } catch (e) { Logger.log('4) בדיקת הכתובת נכשלה: ' + e); }
  }
  Logger.log('אם הכל ✅ — שלח "עזרה" ואמור להיענות תוך ~20 שניות.');
}

// גיבוי במקרה תקלה: מחזיר את ה-polling
function TELEGRAM_deleteWebhook() {
  const cfg = getSettings();
  const res = UrlFetchApp.fetch('https://api.telegram.org/bot' + cfg.tgToken + '/deleteWebhook', { method: 'post', muteHttpExceptions: true }).getContentText();
  Logger.log('deleteWebhook ← ' + res);
  Logger.log('חזרנו ל-polling. הרץ setupSmartTriggers() כדי להחזיר את הטריגר של 5 הדקות.');
}

// הרצה לאחר אימות ה-webhook: מוריד את טריגר ה-polling (שומר 288 ריצות ביום)
function TELEGRAM_removePolling() {
  let removed = 0;
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'checkTelegramMessages') { ScriptApp.deleteTrigger(t); removed++; }
  });
  Logger.log(removed ? '🗑️ טריגר ה-polling הוסר (' + removed + ') — ה-webhook הוא הערוץ היחיד' : 'לא נמצא טריגר polling — כנראה כבר הוסר');
}
// ── 📊 סיכום יומי — הודעה אחת מקיפה (מחליף 4 הודעות ישנות) ──
function REPORT_daily() {
  try {
    updateExchangeRates();
    var usdIls = getCurrentUSDILS();
    refreshIBKRPricesFromYahoo(usdIls);
    refreshFAIRPricesFromTASE();

    var data = _getPortfolioData();
    var dateStr = Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'dd/MM/yyyy');
    var timeStr = Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'HH:mm');

    var msg = '📊 <b>סיכום יומי — ' + dateStr + '</b>\n';
    msg += '⏰ ' + timeStr + ' | 💱 USD/ILS: ' + usdIls.toFixed(4) + '\n';
    msg += '━━━━━━━━━━━━━━━━━━\n\n';

    // שווי נטו
    var gt = data.summary.grandTotal;
    var tr = data.summary.totalReturn;
    var trPct = data.summary.totalRetPct;
    var trSign = tr >= 0 ? '+' : '';
    msg += '💎 <b>שווי נטו</b>\n';
    msg += '  ₪' + fmt(gt) + '\n';
    msg += '  ' + (tr >= 0 ? '📈' : '📉') + ' תשואה כוללת: ' + trSign + '₪' + fmt(Math.abs(tr)) + ' (' + trSign + (trPct * 100).toFixed(2) + '%)\n';
    msg += '  💵 בדולרים: $' + fmt(gt / usdIls) + '\n\n';

    // ✅ v12.1.0.0: "מה השתנה מאתמול" — השוואת שווי כולל + מובילים/מפגרים לפי נייר
    try {
      var props = PropertiesService.getScriptProperties();
      var prevPos = {};
      try { prevPos = JSON.parse(props.getProperty('PREV_POS_JSON') || '{}') || {}; } catch (ePP) {}
      var curPos = {};
      data.ibkr.positions.forEach(function (p) { curPos['I|' + p.sym] = p.valILS || 0; });
      data.fair.positions.forEach(function (p) { curPos['F|' + p.name] = p.valILS || 0; });

      // סה"כ מול אתמול — מהסנאפשוט האחרון שלפני היום
      var yDelta = null;
      try {
        var histD = (getHistoricalData() || {}).history || [];
        var todayKey = Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'dd/MM/yyyy');
        for (var hi2 = histD.length - 1; hi2 >= 0; hi2--) {
          if (histD[hi2].date !== todayKey) { yDelta = gt - histD[hi2].totalValue; break; }
        }
      } catch (eHD) {}
      if (yDelta !== null) {
        var yPct = (gt - yDelta) > 0 ? (yDelta / (gt - yDelta)) * 100 : 0;
        msg += '📲 <b>מול הסנאפשוט הקודם</b>\n';
        msg += '  ' + (yDelta >= 0 ? '📈' : '📉') + ' ' + (yDelta >= 0 ? '+' : '-') + '₪' + fmt(Math.abs(Math.round(yDelta))) + ' (' + (yDelta >= 0 ? '+' : '') + yPct.toFixed(2) + '%)\n\n';
      }

      // מובילים/מפגרים לפי נייר (רק אם יש תמונת אתמול)
      var movers = [];
      Object.keys(curPos).forEach(function (k) {
        if (prevPos[k] !== undefined && prevPos[k] > 0) {
          var d = curPos[k] - prevPos[k];
          if (Math.abs(d) >= 1) movers.push({ name: k.split('|')[1], d: d });
        }
      });
      if (movers.length) {
        movers.sort(function (a, b) { return b.d - a.d; });
        var ups = movers.slice(0, 3), downs = movers.slice(-3).reverse().filter(function (m) { return m.d < 0; });
        msg += '📲 <b>מול אתמול — לפי נייר</b>\n';
        if (ups.length) msg += '  🟢 ' + ups.map(function (m) { return m.name + ' (+' + fmt(Math.round(m.d)) + '₪)'; }).join(', ') + '\n';
        if (downs.length) msg += '  🔴 ' + downs.map(function (m) { return m.name + ' (-' + fmt(Math.abs(Math.round(m.d))) + '₪)'; }).join(', ') + '\n';
        msg += '\n';
      }
      // שומרים את תמונת היום להשוואה מחר
      props.setProperty('PREV_POS_JSON', JSON.stringify(curPos));
    } catch (eMv) { Logger.log('movers err: ' + eMv); }

    // IBKR
    var ibkr = data.ibkr;
    msg += '🏦 <b>IBKR (חו"ל)</b>\n';
    msg += '  עלות: ₪' + fmt(ibkr.totalCost) + ' → שווי: ₪' + fmt(ibkr.totalVal + ibkr.cash) + '\n';
    var ibkrSign = ibkr.totalRet >= 0 ? '+' : '';
    msg += '  ' + (ibkr.totalRet >= 0 ? '📈' : '📉') + ' תשואה: ' + ibkrSign + '₪' + fmt(Math.abs(ibkr.totalRet)) + ' (' + ibkrSign + (ibkr.totalRetPct * 100).toFixed(2) + '%)\n';
    if (ibkr.cash > 0) {
      msg += '  💵 מזומן: $' + fmt(ibkr.cash / usdIls) + ' (₪' + fmt(ibkr.cash) + ')\n';
    }
    var sorted = ibkr.positions.slice().sort(function(a, b) { return b.retPct - a.retPct; });
    var gainers = sorted.filter(function(p) { return p.retPct > 0; }).slice(0, 3);
    var losers = sorted.filter(function(p) { return p.retPct < 0; }).reverse().slice(0, 3);
    if (gainers.length > 0) {
      msg += '  🟢 מצטיינים: ';
      msg += gainers.map(function(p) { return p.sym + ' (+' + (p.retPct * 100).toFixed(1) + '%)'; }).join(', ') + '\n';
    }
    if (losers.length > 0) {
      msg += '  🔴 פחות מוצלחים: ';
      msg += losers.map(function(p) { return p.sym + ' (' + (p.retPct * 100).toFixed(1) + '%)'; }).join(', ') + '\n';
    }
    msg += '\n';

    // FAIR
    var fair = data.fair;
    msg += '🇮🇱 <b>FAIR (ישראל)</b>\n';
    msg += '  שווי: ₪' + fmt(fair.totalVal + fair.cash) + '\n';
    var fairSign = fair.totalPL >= 0 ? '+' : '';
    msg += '  ' + (fair.totalPL >= 0 ? '📈' : '📉') + ' תשואה: ' + fairSign + '₪' + fmt(Math.abs(fair.totalPL)) + '\n';
    if (fair.cash > 0) {
      msg += '  💵 מזומן: ₪' + fmt(fair.cash) + '\n';
    }
    var fairSorted = fair.positions.slice().sort(function(a, b) { return b.pl - a.pl; });
    var fairGainer = fairSorted[0];
    var fairLoser = fairSorted[fairSorted.length - 1];
    if (fairGainer && fairGainer.pl > 0) {
      msg += '  🟢 ' + fairGainer.name + ': +₪' + fmt(fairGainer.pl) + '\n';
    }
    if (fairLoser && fairLoser.pl < 0 && fairLoser.name !== fairGainer.name) {
      msg += '  🔴 ' + fairLoser.name + ': -₪' + fmt(Math.abs(fairLoser.pl)) + '\n';
    }
    msg += '\n';

    // בנקים
    var banks = data.banks;
    if (banks && banks.length > 0) {
      var bankTotal = banks.reduce(function(s, b) { return s + b.valueILS; }, 0);
      msg += '🏛 <b>חשבונות בנק</b>\n';
      msg += '  ₪' + fmt(bankTotal) + '\n';
      var byInst = {};
      banks.forEach(function(b) {
        if (!byInst[b.institution]) { byInst[b.institution] = 0; }
        byInst[b.institution] += b.valueILS;
      });
      Object.keys(byInst).forEach(function(inst) {
        msg += '  • ' + inst + ': ₪' + fmt(byInst[inst]) + '\n';
      });
      msg += '\n';
    }

    // חיסכון
    var savings = data.savings;
    if (savings && savings.kids && savings.kids.length > 0) {
      msg += '👶 <b>חיסכון לכל ילד</b>\n';
      msg += '  ₪' + fmt(savings.total) + '\n';
      savings.kids.forEach(function(k) {
        msg += '  • ' + k.name + ': ₪' + fmt(k.total) + '\n';
      });
      msg += '\n';
    }

    // דיבידנדים
    if (data.dividends && data.dividends.summary && data.dividends.summary.length > 0) {
      var divTotals = data.dividends.totals || {};
      var grossUSD = divTotals.grossUSD || 0;
      var netUSD = divTotals.netUSD || 0;
      var netILS = divTotals.netILS || 0;
      msg += '📅 <b>דיבידנדים (סה"כ היסטורי)</b>\n';
      msg += '  ברוטו: $' + fmt(grossUSD) + '\n';
      msg += '  נטו (אחרי מס): $' + fmt(netUSD) + '\n';
      msg += '  בש"ח: ₪' + fmt(netILS) + '\n\n';
    }

    // פירוט ניירות IBKR
    msg += '📋 <b>פירוט ניירות</b>\n';
    msg += '━━━━━━━━━━━━━━━━━━\n';
    ibkr.positions.forEach(function(p) {
      var sign = p.retILS >= 0 ? '+' : '';
      var emoji = p.retILS >= 0 ? '🟢' : '🔴';
      msg += emoji + ' <b>' + p.sym + '</b> — ₪' + fmt(p.valILS);
      if (p.costILS > 0) {
        msg += ' (' + sign + (p.retPct * 100).toFixed(1) + '%)';
      }
      msg += '\n';
    });
    msg += '━━━━━━━━━━━━━━━━━━\n';

    // לינק
    msg += '\n🌐 <a href="https://tinyurl.com/RaynPortfolio">פתח את הדשבורד</a>';

    // ✅ v12.5.0.10: שליחת דוח יומי לטלגרם מושתקת אופציונלית (Ofir מקבל בוקר בוואטסאפ בלבד)
    // כל העבודה הפנימית למעלה נשארת: רענון מחירים, סנאפשוטים, PREV_POS_JSON.
    var _dailyTgOff = (PropertiesService.getScriptProperties().getProperty('DAILY_TG_OFF') === '1');
    if (_dailyTgOff) {
      Logger.log('⏭️ שליחת דוח יומי לטלגרם מושתקת (DAILY_TG_OFF=1)');
    } else {
      sendTelegram(msg);
      Logger.log('✅ סיכום יומי נשלח');
    }
  } catch (e) {
    Logger.log('שגיאה בסיכום יומי: ' + e);
    sendTelegram('❌ שגיאה בסיכום היומי: ' + e.toString());
  }
}

// ═══════════════════════════════════════════════════════════════
//  ✅ v13.4.7.0 — ייבוא אוטומטי של מכירות מ-IBKR Flex אל גיליון "מכירות"
//  פותר את שורש תקלת "אי ההתאמות": כל מכירה שנרשמת ב-IBKR נכנסת לבד
//  לגיליון, עם דה-דופליקציה לפי מזהה פעולה + בדיקת שורות קיימות.
// ═══════════════════════════════════════════════════════════════
function _flexFetchStatement(qidOverride) {
  var props = PropertiesService.getScriptProperties();
  var tok = props.getProperty('FLEX_TOKEN');
  var qid = qidOverride || props.getProperty('FLEX_TRADES_QUERY_ID') || props.getProperty('FLEX_QUERY_ID');
  if (!tok || !qid) throw new Error('FLEX_TOKEN / FLEX_QUERY_ID חסרים ב-Script Properties');
  var base = 'https://ndcdyn.interactivebrokers.com/AccountManagement/FlexWebService/';
  var r1 = UrlFetchApp.fetch(base + 'SendRequest?t=' + encodeURIComponent(tok) + '&q=' + encodeURIComponent(qid) + '&v=3', { muteHttpExceptions: true });
  var x1 = r1.getContentText();
  var ref = (x1.match(/<ReferenceCode>([^<]+)<\/ReferenceCode>/) || [])[1];
  if (!ref) throw new Error('SendRequest: אין ReferenceCode — ' + x1.slice(0, 200));
  Utilities.sleep(3000);
  var r2 = UrlFetchApp.fetch(base + 'GetStatement?t=' + encodeURIComponent(tok) + '&q=' + encodeURIComponent(ref) + '&v=3', { muteHttpExceptions: true });
  var x2 = r2.getContentText();
  if (!x2 || x2.length < 200) throw new Error('GetStatement ריק/קצר (' + (x2 ? x2.length : 0) + 'B)');
  return x2;
}

function _flexAttrs(tag) {
  var o = {}, m = tag.match(/([A-Za-z0-9_]+)="([^"]*)"/g) || [];
  m.forEach(function (kv) { var p = kv.split('="'); o[p[0]] = p[1].replace(/"$/, ''); });
  return o;
}

function _rateForDate(dMs) {
  try {
    var from = Math.floor((dMs - 8 * 86400000) / 1000), to = Math.floor((dMs + 3 * 86400000) / 1000);
    var u = 'https://query1.finance.yahoo.com/v8/finance/chart/ILS=X?period1=' + from + '&period2=' + to + '&interval=1d';
    var r = JSON.parse(UrlFetchApp.fetch(u, { muteHttpExceptions: true, headers: { 'User-Agent': 'Mozilla/5.0' } }).getContentText());
    var res = r.chart.result[0];
    var ts = res.timestamp || [], cl = res.indicators.quote[0].close || [];
    var best = null, bestDiff = Infinity;
    for (var i = 0; i < ts.length; i++) {
      if (!cl[i]) continue;
      var diff = Math.abs(ts[i] * 1000 - dMs);
      if (diff < bestDiff) { bestDiff = diff; best = cl[i]; }
    }
    if (best) return Math.round(best * 10000) / 10000;
  } catch (e) { Logger.log('rateForDate: ' + e); }
  return getCurrentUSDILS();
}

function _salesSheetCols(sh) {
  var cols = {}, hdrRow = 3, last = sh.getLastRow();
  for (var r = 1; r <= Math.min(last, 5); r++) {
    var hv = sh.getRange(r, 1, 1, 12).getValues()[0], found = false;
    for (var k = 0; k < hv.length; k++) {
      var t = String(hv[k]).replace(/[\u200B-\u200F\uFEFF]/g, '').trim();
      if (t === 'סימבול') { cols.sym = k + 1; hdrRow = r; found = true; }
      if (t === 'כמות נמכרה' || t === 'כמות מכירה') cols.qty = k + 1;
      if (t.indexOf('מחיר') >= 0) cols.price = k + 1;
      if (t.indexOf('תאריך') >= 0) cols.date = k + 1;
      if (t.indexOf('שער') >= 0 || t.indexOf('USD/ILS') >= 0) cols.rate = k + 1;
      if (t.indexOf('עמלה') >= 0) cols.fee = k + 1;
      if (t.indexOf('סכום') >= 0 && t.indexOf('₪') >= 0) cols.sum = k + 1;
      if (t === 'שם' || t.indexOf('שם הנייר') >= 0) cols.name = k + 1;
    }
    if (found) break;
  }
  return cols;
}

function IBKR_autoSales() {
  var out = { added: [], skipped: [], conflicts: [], errors: [] };
  try {
    var xml = _flexFetchStatement(PropertiesService.getScriptProperties().getProperty('FLEX_TRADES_QUERY_ID') || null);
    var tradeTags = xml.match(/<Trade\s[^>]*>/g) || [];
    if (!tradeTags.length) {
      out.errors.push('אין סעיף Trades בדוח ה-Flex — הוסף Trades לשאילתה ' + (PropertiesService.getScriptProperties().getProperty('FLEX_QUERY_ID') || ''));
      return JSON.stringify(out);
    }
    var sheet = SS.getSheetByName('מכירות');
    if (!sheet) { out.errors.push('גיליון מכירות לא נמצא'); return JSON.stringify(out); }
    var cols = _salesSheetCols(sheet);
    if (!cols.sym || !cols.qty) { out.errors.push('כותרות מכירות לא נמצאו'); return JSON.stringify(out); }
    // שורות קיימות לדה-דופ
    var last = sheet.getLastRow();
    var existing = [];
    if (last >= 4) {
      var data = sheet.getRange(4, 1, last - 3, 12).getValues();
      data.forEach(function (row) {
        var s = String(row[cols.sym - 1] || '').trim().toUpperCase();
        var q = parseFloat(row[cols.qty - 1]) || 0;
        var p = cols.price ? (parseFloat(row[cols.price - 1]) || 0) : 0;
        var d = cols.date ? _safeSheetDateObj(row[cols.date - 1]) : null;
        if (s && q) existing.push({ sym: s, qty: q, price: p, t: d ? new Date(d).toISOString().slice(0, 10) : '' });
      });
    }
    var props = PropertiesService.getScriptProperties();
    var doneKeys = [];
    try { doneKeys = JSON.parse(props.getProperty('AUTO_SALES_KEYS') || '[]'); } catch (e) { doneKeys = []; }

    // ── v13.4.7.2: קיבוץ לפי נייר+יום — פילגולים מתאחדים לשורה אחת כמו הרישום הידני,
    //    והתנגשות כמות מול שורה קיימת נחסמת ומדווחת במקום לזהם את נתוני המס ──
    var agg = {};
    tradeTags.forEach(function (tag) {
      try {
        var a = _flexAttrs(tag);
        var bs = String(a.buySell || '').toUpperCase();
        var qty = parseFloat(a.quantity) || 0;
        if (!(bs === 'SELL' || qty < 0)) return;
        var ac = String(a.assetCategory || '').toUpperCase();
        if (ac && ac !== 'STK') return;
        var sym = String(a.symbol || '').trim().toUpperCase();
        if (!sym) return;
        qty = Math.abs(qty);
        var price = parseFloat(a.tradePrice) || 0;
        if (!qty || !price) return;
        var td = String(a.tradeDate || '');
        if (!/^\d{8}$/.test(td)) return;
        var k = sym + '|' + td;
        if (!agg[k]) agg[k] = { sym: sym, td: td, dMs: new Date(+td.slice(0, 4), +td.slice(4, 6) - 1, +td.slice(6, 8), 12).getTime(), qty: 0, proceeds: 0, fee: 0 };
        agg[k].qty += qty;
        agg[k].proceeds += qty * price;
        agg[k].fee += Math.abs(parseFloat(a.ibCommission) || 0);
      } catch (eOne) { out.errors.push(String(eOne)); }
    });

    // ✅ v13.4.7.3: שמרנות — לכל נייר נקבע "התאריך האחרון שכבר רשום בגיליון".
    //    פעולה ותיקה ממנו לא מיובאת בכלל (ההיסטוריה כבר מתועדת אצל אופיר), גם לא בהתאמת מחיר.
    var lastDateBySym = {};
    existing.forEach(function (e2) {
      if (!e2.t) return;
      if (!lastDateBySym[e2.sym] || e2.t > lastDateBySym[e2.sym]) lastDateBySym[e2.sym] = e2.t;
    });

    Object.keys(agg).forEach(function (k) {
      try {
        var t = agg[k];
        var priceW = Math.round((t.proceeds / t.qty) * 10000) / 10000;
        var iso = new Date(t.dMs).toISOString().slice(0, 10);
        var key = t.sym + '|' + t.td + '|' + t.qty + '|' + priceW.toFixed(4);
        var same = existing.filter(function (e2) { return e2.sym === t.sym && e2.t === iso; });
        var sameSum = same.reduce(function (acc, e2) { return acc + (e2.qty || 0); }, 0);
        var covered = (same.length > 0 && Math.abs(sameSum - t.qty) < 0.01) || same.some(function (e2) {
          return Math.abs(e2.qty - t.qty) < 0.01 && (!e2.price || Math.abs(e2.price - priceW) / priceW < 0.005);
        });
        var histLast = lastDateBySym[t.sym];
        if (!covered && histLast && iso <= histLast) {
          out.skipped.push(t.sym + ' ' + iso + ' (היסטוריה — אחרי ' + histLast + ' בגיליון)');
          return;
        }
        if (covered) {
          out.skipped.push(t.sym + ' ' + iso + ' (קיים בגיליון)');
          if (doneKeys.indexOf(key) < 0) doneKeys.push(key);
          return;
        }
        if (same.length) {
          out.conflicts.push(t.sym + ' ' + iso + ' — Flex ' + t.qty + ' יח׳ מול גיליון ' + same.map(function (x) { return x.qty; }).join('+') + ' · לא נרשם, בדוק ידנית');
          return;
        }
        if (doneKeys.indexOf(key) >= 0) { out.skipped.push(key); return; }
        var rate = _rateForDate(t.dMs);
        var sumILS = (t.qty * priceW - t.fee) * rate;
        var w = sheet.getLastRow() + 1;
        if (cols.date) sheet.getRange(w, cols.date).setValue(new Date(t.dMs));
        sheet.getRange(w, cols.sym).setValue(t.sym);
        if (cols.name) sheet.getRange(w, cols.name).setValue(t.sym);
        sheet.getRange(w, cols.qty).setValue(t.qty);
        if (cols.price) sheet.getRange(w, cols.price).setValue(priceW);
        if (cols.rate) sheet.getRange(w, cols.rate).setValue(rate);
        if (cols.fee) sheet.getRange(w, cols.fee).setValue(Math.round(t.fee * 100) / 100);
        if (cols.sum) sheet.getRange(w, cols.sum).setValue(sumILS);
        existing.push({ sym: t.sym, qty: t.qty, price: priceW, t: iso });
        doneKeys.push(key);
        out.added.push(t.sym + ' ' + t.qty + ' @' + priceW + ' · ' + iso + ' · ₪' + Math.round(sumILS));
      } catch (eAgg) { out.errors.push(String(eAgg)); }
    });
    // שמירת מזהים (עד 500)
    try { props.setProperty('AUTO_SALES_KEYS', JSON.stringify(doneKeys.slice(-500))); } catch (e) {}
    if (out.added.length) {
      _bustAnalystCtx();
      var _msg = '✅ <b>ייבוא אוטומטי — ' + out.added.length + ' מכירות נרשמו</b>\n' + out.added.join('\n');
      if (out.conflicts.length) _msg += '\n\n⚠️ התנגשויות שלא נרשמו:\n' + out.conflicts.join('\n');
      try { sendTelegram(_msg); } catch (e) {}
    } else if (out.conflicts.length) {
      try { sendTelegram('⚠️ <b>ייבוא מכירות — ' + out.conflicts.length + ' התנגשויות</b>\n' + out.conflicts.join('\n')); } catch (e) {}
    }
  } catch (e) {
    out.errors.push(String(e));
    Logger.log('IBKR_autoSales: ' + e);
  }
  Logger.log('IBKR_autoSales → ' + JSON.stringify(out));
  return JSON.stringify(out);
}

// ── עדכון יומי — קורא לסיכום היומי ──
function dailyPortfolioUpdate() {
  // ✅ v13.4.7.4: סנכרון פעילות מלא (קניות + מכירות + דיבידנדים) לפני בדיקת השלמות.
  //    IBKR_syncActivity הוא אותו מנוע ותיק עם דה-דופ לפי מזהה עסקה — הוא הגורם הרשמי.
  try {
    if (typeof IBKR_syncActivity === 'function') {
      IBKR_syncActivity();
      Logger.log('activity sync ran');
    } else {
      Logger.log('autoSales fallback: ' + IBKR_autoSales());
    }
  } catch (eAS) { Logger.log('activity sync err: ' + eAS); }
  // בדיקת שלמות
  REPORT_integrity();
  // סנאפשוט יומי
  saveDailySnapshot();
  // ✅ v11.6.4.0: דוח חודשי בטלגרם — פעם אחת בתחילת החודש
  REPORT_monthly();
  // סיכום יומי
  REPORT_daily();
  // ניתוח שבועי — יום ראשון (0 בJS)
  if (new Date().getDay() === 0) {
    Utilities.sleep(5000);
    REPORT_weekly();
  }
}

// ✅ v11.6.4.0: דוח חודשי בטלגרם — נשלח פעם אחת בתחילת החודש, על החודש הקודם.
// עמיד לסופ"ש: גם אם ה-1 בחודש חל בשישי/שבת, הדוח יישלח ביום העבודה הראשון שאחריו.
function REPORT_monthly() {
  try {
    var jt = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' }));
    if (jt.getDate() > 7) return; // רק בשבוע הראשון של החודש

    var prev = new Date(jt.getFullYear(), jt.getMonth() - 1, 1);
    var mm = ('0' + (prev.getMonth() + 1)).slice(-2);
    var yy = prev.getFullYear();
    var key = 'MREPORT_' + mm + '_' + yy;
    var props = PropertiesService.getScriptProperties();
    if (props.getProperty(key)) return; // כבר נשלח לחודש הזה

    var hist = (getHistoricalData() || {}).history || [];
    var rows = hist.filter(function(h) {
      return h.date && h.date.length >= 10 && h.date.substring(3) === mm + '/' + yy;
    });
    if (!rows.length) { props.setProperty(key, 'no-data'); return; }

    var first = rows[0], last = rows[rows.length - 1];
    var delta = last.totalValue - first.totalValue;
    var pct = first.totalValue > 0 ? delta / first.totalValue * 100 : 0;
    var arrow = delta >= 0 ? '📈' : '📉';
    var sign = delta >= 0 ? '+' : '';

    var msg = '📅 <b>סיכום חודשי — ' + mm + '/' + yy + '</b>\n\n' +
      arrow + ' שווי תחילת החודש: <b>₪' + fmt(first.totalValue) + '</b>\n' +
      'שווי סוף החודש: <b>₪' + fmt(last.totalValue) + '</b>\n' +
      'שינוי: <b>' + sign + fmt(Math.round(delta)) + ' ₪ (' + sign + pct.toFixed(1) + '%)</b>\n\n' +
      '🇺🇸 IBKR: ₪' + fmt(first.ibkr) + ' → ₪' + fmt(last.ibkr) + '\n' +
      '🇮🇱 FAIR: ₪' + fmt(first.fair) + ' → ₪' + fmt(last.fair) + '\n' +
      '💵 מזומן: ₪' + fmt(first.cash) + ' → ₪' + fmt(last.cash) + '\n' +
      '💱 USD/ILS: ' + Number(first.usdIls).toFixed(2) + ' → ' + Number(last.usdIls).toFixed(2) + '\n\n' +
      '💰 תשואה מצטברת: ₪' + fmt(Math.round(last.returnILS)) + ' (' + last.returnPct + '%)';
    sendTelegram(msg);
    props.setProperty(key, 'sent');
    Logger.log('📅 דוח חודשי נשלח: ' + mm + '/' + yy);
  } catch (e) {
    Logger.log('שגיאת דוח חודשי: ' + e);
  }
}
function weeklyTasks() {
  var day = new Date().getDay(); // 0=Sunday, 5=Friday, 6=Saturday
  if (day === 5) {
    // יום שישי 20:00 — גיבוי Drive
    MAINT_backupToDrive();
  }
  if (day === 0) {
    // יום ראשון 20:00 — דוח אימייל (מועד מתוקן מ-09:00)
    REPORT_email();
  }
}
// ── שליחת טלגרם ──
function sendTelegram(message, keyboard) { const cfg=getSettings();sendTelegramTo(cfg.tgChatId,cfg.tgToken,message,keyboard); }
// ✅ v12.1.0.0: keyboard אופציונלי — inline_keyboard לכפתורי פקודה מהירים
function sendTelegramTo(chatId, token, message, keyboard) {
  if(!token||token.startsWith('ENTER'))return;
  try{
    var payload={chat_id:chatId,text:message,parse_mode:'HTML'};
    if(keyboard&&keyboard.length)payload.reply_markup={inline_keyboard:keyboard};
    UrlFetchApp.fetch('https://api.telegram.org/bot'+token+'/sendMessage',{method:'post',contentType:'application/json',payload:JSON.stringify(payload)});
  }
  catch(e){Logger.log('שגיאת טלגרם: '+e);}
}
// ✅ v12.1.0.0: מקלדת כפתורים קבועה — פקודות מהירות בלי לזכור טקסטים
function _tgMainMenuKeyboard() {
  return [
    [{text:'📊 תיק',callback_data:'cmd:תיק'},{text:'🏦 IBKR',callback_data:'cmd:IBKR'},{text:'🇮🇱 FAIR',callback_data:'cmd:FAIR'}],
    [{text:'💱 שער דולר',callback_data:'cmd:שער'},{text:'📅 דיבידנד',callback_data:'cmd:דיבידנד'},{text:'💎 שווי',callback_data:'cmd:שווי'}],
    [{text:'📈 גרף',callback_data:'cmd:גרף'},{text:'🧠 ניתוח',callback_data:'cmd:ניתוח'},{text:'🔔 התראות',callback_data:'cmd:התראות'}],
    [{text:'💵 מזומן',callback_data:'cmd:מזומן'},{text:'👶 חיסכון',callback_data:'cmd:חיסכון'},{text:'❓ עזרה',callback_data:'cmd:עזרה'}]
  ];
}
// ✅ v12.1.0.0: אישור קליק על כפתור (מנטרליז את "טוען..." של טלגרם)
function _tgAnswerCallback(token, cbId) {
  try { UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/answerCallbackQuery', { method: 'post', contentType: 'application/json', payload: JSON.stringify({ callback_query_id: cbId }) }); } catch (e) {}
}
// ── Triggers ──
// ✅ v11.6.3.0: setupAllTriggers / setupSmartTriggers קיימים רק ב-SmartTriggers.gs.
// ⚠️ מחק את smart_triggers.gs מהפרויקט! כפילות גורמת לדריסה שקטה של פונקציות,
// והגרסה הישנה שם מכילה לוח חגים שגוי ל-2026 וקריאה לפונקציה מיושנת.
// ── 🔔 התראות שוק חכמות — תנועות מחיר, USD/ILS, דיבידנדים ──
function checkMarketAlerts() {
  try {
    var sheet = SS.getSheetByName('IBKR');
    var lastRow = sheet.getLastRow();
    if (lastRow < 10) return;

    var usdIls = getCurrentUSDILS();
    var rows = sheet.getRange(10, 1, lastRow - 9, 15).getValues();
    var alerts = [];
    var alertThreshold = 0.03; // 3% שינוי יומי

    rows.forEach(function(row) {
      var sym = String(row[0]).trim().toUpperCase();
      var type = String(row[2]).trim();
      if (!sym || sym === 'סה"כ' || type === 'מזומן') return;

      var qty = parseFloat(row[4]) || 0;
      if (qty === 0) return;

      var changeData = fetchYahooDailyChange(sym);
      if (!changeData) return;

      var changePct = changeData.changePct;

      if (Math.abs(changePct) >= alertThreshold) {
        var emoji = changePct > 0 ? '🟢' : '🔴';
        var sign = changePct > 0 ? '+' : '';
        var valueILS = qty * changeData.current * usdIls;
        var changeILS = qty * changeData.change * usdIls;
        alerts.push(emoji + ' <b>' + sym + '</b>: ' + sign + (changePct * 100).toFixed(2) + '% (' + sign + '$' + Math.abs(changeData.change).toFixed(2) + ' | ' + sign + '\u20aa' + fmt(Math.abs(changeILS)) + ')');
      }
      Utilities.sleep(200);
    });

    // בדיקת USD/ILS
    var usdChange = fetchUSDILSDailyChange();
    if (usdChange && Math.abs(usdChange.changePct) >= 0.01) {
      var fxEmoji = usdChange.changePct > 0 ? '📈' : '📉';
      var fxSign = usdChange.changePct > 0 ? '+' : '';
      alerts.push(fxEmoji + ' <b>USD/ILS</b>: ' + usdIls.toFixed(4) + ' (' + fxSign + (usdChange.changePct * 100).toFixed(2) + '% | ' + fxSign + '\u20aa' + fmt(Math.abs(usdChange.change).toFixed(2)) + ')');
    }

    // בדיקת דיבידנדים קרובים
    var divAlerts = checkUpcomingDividends();
    if (divAlerts.length > 0) {
      alerts = alerts.concat(divAlerts);
    }

    if (alerts.length > 0) {
      var dateStr = Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'dd/MM/yyyy HH:mm');
      var msg = '🔔 <b>התראות שוק</b>\n';
      msg += '\u23F0 ' + dateStr + '\n';
      msg += '\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n';
      alerts.forEach(function(a) { msg += a + '\n'; });
      sendTelegram(msg);
      Logger.log('✅ נשלחו ' + alerts.length + ' התראות');
    } else {
      Logger.log('✅ אין התראות — הכל רגוע');
    }
  } catch (e) {
    Logger.log('שגיאה בהתראות שוק: ' + e);
  }
}

// ✅ v12.5.0.4: שליחה תמיד בטלגרם של ההתראות החכמות (ריכוז/יעד/דולר/דיבידנדים) + הודעת "הכל רגוע"
// כשאין כלום — checkMarketAlerts לבדה שקטה בלי התראות שוק, מה שגרם לכפתור "התראות" להרגיש "לא מגיב".
function _sendSmartAlertsTelegram() {
  try {
    var d = _getPortfolioData();
    var sa = _smartAlerts(d, { light: false });
    if (!sa.length) { sendTelegram('✅ <b>הכל רגוע</b> — אין ריכוזים חריגים, התיק לא ירד משיא, ואין תנודת דולר משמעותית.'); return; }
    var msg = '🔎 <b>התראות חכמות</b> (' + sa.length + ')\n' + '━━━━━━━━━━━━━━━━━━━━\n';
    sa.forEach(function (a) { msg += a.icon + ' <b>' + a.title + '</b>: ' + a.detail + '\n'; });
    sendTelegram(msg);
  } catch (e) { Logger.log('שגיאת שליחת התראות חכמות: ' + e); }
}

function fetchYahooDailyChange(sym) {
  try {
    var text = _yahooFetch('/v8/finance/chart/' + encodeURIComponent(sym) + '?interval=1d&range=5d');
    if (!text) return null;
    var data = JSON.parse(text);
    var meta = data.chart.result[0].meta;
    var current = meta.regularMarketPrice;
    var prevClose = meta.chartPreviousClose || meta.previousClose;
    if (!current || !prevClose) return null;
    var change = current - prevClose;
    var changePct = change / prevClose;
    return { current: current, prevClose: prevClose, change: change, changePct: changePct };
  } catch (e) {
    Logger.log('fetchYahooDailyChange שגיאה ' + sym + ': ' + e);
    return null;
  }
}

function fetchUSDILSDailyChange() {
  try {
    var today = getCurrentUSDILS();
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var dateStr = Utilities.formatDate(yesterday, 'Asia/Jerusalem', 'yyyy-MM-dd');
    var url = 'https://api.frankfurter.app/' + dateStr + '?from=USD&to=ILS';
    var data = JSON.parse(UrlFetchApp.fetch(url, { muteHttpExceptions: true }).getContentText());
    var prevRate = data.rates.ILS;
    if (!prevRate || !today) return null;
    var change = today - prevRate;
    var changePct = change / prevRate;
    return { today: today, prevRate: prevRate, change: change, changePct: changePct };
  } catch (e) {
    Logger.log('fetchUSDILSDailyChange שגיאה: ' + e);
    return null;
  }
}

function checkUpcomingDividends() {
  var alerts = [];
  var sheet = SS.getSheetByName('IBKR');
  var lastRow = sheet.getLastRow();
  if (lastRow < 10) return alerts;

  var symbols = [];
  sheet.getRange(10, 1, lastRow - 9, 1).getValues().forEach(function(row) {
    var sym = String(row[0]).trim().toUpperCase();
    if (sym && sym !== 'סה"כ') symbols.push(sym);
  });

  var now = new Date();
  var sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  symbols.forEach(function(sym) {
    try {
      var meta = JSON.parse(UrlFetchApp.fetch('https://query1.finance.yahoo.com/v8/finance/chart/' + encodeURIComponent(sym) + '?interval=1d&range=1d', { muteHttpExceptions: true }).getContentText()).chart.result[0].meta;
      if (meta.exDividendDate) {
        var exDate = new Date(meta.exDividendDate * 1000);
        if (exDate >= now && exDate <= sevenDaysLater) {
          var dateStr = Utilities.formatDate(exDate, 'Asia/Jerusalem', 'dd/MM/yyyy');
          var divRate = meta.trailingAnnualDividendRate ? (meta.trailingAnnualDividendRate / 4).toFixed(3) : 'לא זמין';
          alerts.push('📅 <b>' + sym + '</b> — Ex-Dividend ב-' + dateStr + ' | רבעוני: $' + divRate);
        }
      }
      Utilities.sleep(300);
    } catch (e) {}
  });

  return alerts;
}
// ── 🧠 ניתוח תיק חכם — מדדים, חשיפה, סיכון, איזון ──
function REPORT_weekly() {
  try {
    var data = _getPortfolioData();
    var usdIls = data.meta.usdIls;
    var dateStr = Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'dd/MM/yyyy');

    var msg = '🧠 <b>ניתוח תיק חכם — ' + dateStr + '</b>\n';
    msg += '\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\n';

    // ══════ השוואה למדדי ייחוס ══════
    var portfolioReturn = data.ibkr.totalRetPct;

    msg += '📊 <b>השוואה למדדי ייחוס</b>\n';
    msg += '  📁 התיק: ' + (portfolioReturn * 100).toFixed(2) + '%\n';

    var sp500 = fetchYahooReturn('^GSPC', '1y');
    if (sp500 !== null) {
      var alpha = (portfolioReturn - sp500) * 100;
      msg += '  🇺🇸 S&P 500: ' + (sp500 * 100).toFixed(2) + '%';
      msg += alpha >= 0 ? ' → +' + alpha.toFixed(2) + '% alpha ✅\n' : ' → ' + alpha.toFixed(2) + '% alpha ❌\n';
    }

    var nasdaq = fetchYahooReturn('^IXIC', '1y');
    if (nasdaq !== null) {
      var alphaN = (portfolioReturn - nasdaq) * 100;
      msg += '  💻 Nasdaq: ' + (nasdaq * 100).toFixed(2) + '%';
      msg += alphaN >= 0 ? ' → +' + alphaN.toFixed(2) + '% alpha ✅\n' : ' → ' + alphaN.toFixed(2) + '% alpha ❌\n';
    }

    var msciWorld = fetchYahooReturn('URTH', '1y');
    if (msciWorld !== null) {
      var alphaW = (portfolioReturn - msciWorld) * 100;
      msg += '  🌍 MSCI World: ' + (msciWorld * 100).toFixed(2) + '%';
      msg += alphaW >= 0 ? ' → +' + alphaW.toFixed(2) + '% alpha ✅\n' : ' → ' + alphaW.toFixed(2) + '% alpha ❌\n';
    }
    msg += '\n';

    // ══════ חשיפה סקטוריאלית ══════
    var sectorMap = getSectorExposure(data.ibkr.positions);
    var sortedSectors = Object.keys(sectorMap).sort(function(a, b) { return sectorMap[b] - sectorMap[a]; });

    msg += '🏭 <b>חשיפה סקטוריאלית</b>\n';
    sortedSectors.forEach(function(sector) {
      var pct = sectorMap[sector] * 100;
      var bars = Math.round(pct / 5);
      var bar = '';
      for (var i = 0; i < bars; i++) bar += '\u2588';
      for (var i = bars; i < 20; i++) bar += '\u2591';
      msg += '  ' + sector + ' ' + bar + ' ' + pct.toFixed(1) + '%\n';
    });
    msg += '\n';

    // ══════ איזון מחדש ══════
    var rebalanceAlerts = [];
    var totalVal = data.ibkr.totalVal + data.ibkr.cash;
    data.ibkr.positions.forEach(function(p) {
      var weight = p.valILS / totalVal;
      if (weight > 0.12) {
        rebalanceAlerts.push('⚠️ <b>' + p.sym + '</b>: ' + (weight * 100).toFixed(1) + '% מהתיק — שקול איזון');
      }
    });

    if (rebalanceAlerts.length > 0) {
      msg += '⚖️ <b>התראות איזון</b>\n';
      rebalanceAlerts.forEach(function(a) { msg += a + '\n'; });
      msg += '\n';
    }

    // ══════ מדדי סיכון ══════
    var positions = data.ibkr.positions;
    var totalValNonCash = positions.reduce(function(s, p) { return s + p.valILS; }, 0);
    var weightedReturns = positions.map(function(p) {
      return { ret: p.retPct, weight: p.valILS / totalValNonCash };
    });
    var avgReturn = weightedReturns.reduce(function(s, w) { return s + w.ret * w.weight; }, 0);
    var variance = weightedReturns.reduce(function(s, w) {
      var diff = w.ret - avgReturn;
      return s + diff * diff * w.weight;
    }, 0);
    var volatility = Math.sqrt(variance);

    msg += '📏 <b>מדדי סיכון</b>\n';
    msg += '  תנודתיות משוכללת: ' + (volatility * 100).toFixed(2) + '%\n';
    msg += '  תשואה ממוצעת משוכללת: ' + (avgReturn * 100).toFixed(2) + '%\n';
    if (volatility > 0) {
      var sharpe = avgReturn / volatility;
      msg += '  Sharpe Ratio (יחסי): ' + sharpe.toFixed(3);
      if (sharpe > 1) msg += ' ✅ מצוין';
      else if (sharpe > 0.5) msg += ' ✡️ סביר';
      else msg += ' ⚠️ נמוך';
      msg += '\n';
    }
    msg += '\n';

    // ══════ ניירות למעקב ══════
    var bigLosers = positions.filter(function(p) { return p.retPct < -0.10; });
    if (bigLosers.length > 0) {
      msg += '👀 <b>ניירות בהפסד מעל 10%</b>\n';
      bigLosers.sort(function(a, b) { return a.retPct - b.retPct; });
      bigLosers.forEach(function(p) {
        msg += '  🔴 ' + p.sym + ': ' + (p.retPct * 100).toFixed(1) + '% (\u20aa' + fmt(Math.abs(p.retILS)) + ')\n';
      });
      msg += '\n';
    }

    // ══════ מצטיינים ══════
    var bigGainers = positions.filter(function(p) { return p.retPct > 0.30; });
    if (bigGainers.length > 0) {
      msg += '🌟 <b>ניירות עם תשואה מעל 30%</b>\n';
      bigGainers.sort(function(a, b) { return b.retPct - a.retPct; });
      bigGainers.forEach(function(p) {
        msg += '  🟢 ' + p.sym + ': +' + (p.retPct * 100).toFixed(1) + '% (+\u20aa' + fmt(p.retILS) + ')\n';
      });
      msg += '\n';
    }

    // ══════ דיבידנדים ══════
    if (data.dividends && data.dividends.totals) {
      var dt = data.dividends.totals;
      msg += '💰 <b>דיבידנדים</b>\n';
      msg += '  ברוטו: $' + fmt(dt.grossUSD || 0) + '\n';
      msg += '  נטו: $' + fmt(dt.netUSD || 0) + ' (\u20aa' + fmt(dt.netILS || 0) + ')\n';
      msg += '  תשואת דיבידנד: ' + (((dt.netUSD || 0) / (data.ibkr.totalCostUSD || 1)) * 100).toFixed(2) + '%\n\n';
    }

    msg += '\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n';
    msg += '🌐 <a href="https://tinyurl.com/RaynPortfolio">פתח את הדשבורד</a>';

    sendTelegram(msg);
    Logger.log('✅ ניתוח שבועי נשלח');
  } catch (e) {
    Logger.log('שגיאה בניתוח שבועי: ' + e);
    sendTelegram('❌ שגיאה בניתוח: ' + e.toString());
  }
}

function fetchYahooReturn(sym, range) {
  try {
    var text = _yahooFetch('/v8/finance/chart/' + encodeURIComponent(sym) + '?interval=1d&range=' + range);
    if (!text) return null;
    var data = JSON.parse(text);
    var result = data.chart.result[0];
    var closePrices = result.indicators.quote[0].close.filter(function(p) { return p !== null; });
    if (closePrices.length < 2) return null;
    var startPrice = closePrices[0];
    var endPrice = closePrices[closePrices.length - 1];
    return (endPrice - startPrice) / startPrice;
  } catch (e) {
    Logger.log('fetchYahooReturn שגיאה ' + sym + ': ' + e);
    return null;
  }
}

// חשיפה סקטוריאלית — מוגדרת ידנית לETFs + ניחוש לניירות אחרים
var _sectorMap = {
  'VT': 'Global Equity',
  'VB': 'US Small Cap',
  'VOO': 'US Large Cap',
  'VTI': 'US Total Market',
  'VSS': 'Intl Small Cap',
  'VGT': 'Technology',
  'SPMO': 'US Momentum',
  'OMAH': 'Value',
  'NVDA': 'Technology',
  'WOR': 'Real Estate'
};

function getSectorExposure(positions) {
  var sectorMap = {};
  var totalVal = positions.reduce(function(s, p) { return s + p.valILS; }, 0);
  if (totalVal === 0) return sectorMap;

  positions.forEach(function(p) {
    var sector = _sectorMap[p.sym] || 'Other';
    if (!sectorMap[sector]) sectorMap[sector] = 0;
    sectorMap[sector] += p.valILS;
  });

  Object.keys(sectorMap).forEach(function(s) {
    sectorMap[s] = sectorMap[s] / totalVal;
  });

  return sectorMap;
}
// ── 🧠 ניתוח וחדשות — נתונים לדשבורד ──
function getAnalysisAndNews(token) {
  var g = _gate(token); if (g) return g;
  try {
    var data = _getPortfolioData();
    var positions = data.ibkr.positions;
    var totalVal = data.ibkr.totalVal + data.ibkr.cash;
    var usdIls = data.meta.usdIls;

    // ══════ Benchmarks — נסה Yahoo, אם נכשל תן null ══════
    var sp500 = null, nasdaq = null, msciWorld = null;
    try {
      sp500 = fetchYahooReturn('^GSPC', '1y');
    } catch(e) { Logger.log('S&P500 fetch failed: ' + e); }
    try {
      nasdaq = fetchYahooReturn('^IXIC', '1y');
    } catch(e) { Logger.log('Nasdaq fetch failed: ' + e); }
    try {
      msciWorld = fetchYahooReturn('URTH', '1y');
    } catch(e) { Logger.log('MSCI World fetch failed: ' + e); }
    var portfolioReturn = data.ibkr.totalRetPct;

    // ══════ Sector exposure (פנימי — תמיד עובד) ══════
    var sectorMap = getSectorExposure(positions);

    // ══════ Risk metrics (פנימי — תמיד עובד) ══════
    var totalValNonCash = positions.reduce(function(s, p) { return s + p.valILS; }, 0);
    var weightedReturns = positions.map(function(p) {
      return { ret: p.retPct, weight: p.valILS / (totalValNonCash || 1) };
    });
    var avgReturn = weightedReturns.reduce(function(s, w) { return s + w.ret * w.weight; }, 0);
    var variance = weightedReturns.reduce(function(s, w) {
      var diff = w.ret - avgReturn;
      return s + diff * diff * w.weight;
    }, 0);
    var volatility = Math.sqrt(variance);
    var sharpe = volatility > 0 ? avgReturn / volatility : 0;

    // ══════ Rebalancing (פנימי — תמיד עובד) ══════
    var rebalance = positions.filter(function(p) {
      return (p.valILS / (totalVal || 1)) > 0.12;
    }).map(function(p) {
      return { sym: p.sym, weight: p.valILS / (totalVal || 1), valILS: p.valILS, retPct: p.retPct };
    });

    // ══════ Top movers (פנימי — תמיד עובד) ══════
    var sorted = positions.slice().sort(function(a, b) { return b.retPct - a.retPct; });
    var gainers = sorted.filter(function(p) { return p.retPct > 0; }).slice(0, 5);
    var losers = sorted.filter(function(p) { return p.retPct < 0; }).reverse().slice(0, 5);

    // ══════ News — נסה Yahoo, אם נכשל תן מערך ריק ══════
    var news = [];
    try {
      var seen = {};
      var topSyms = positions.slice().sort(function(a, b) { return b.valILS - a.valILS; }).slice(0, 6).map(function(p) { return p.sym; });

      topSyms.forEach(function(sym) {
        try {
          var url = 'https://query1.finance.yahoo.com/v1/finance/search?q=' + encodeURIComponent(sym) + '&newsCount=3&quotesCount=0';
          var resp = UrlFetchApp.fetch(url, {
            muteHttpExceptions: true,
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GAS/1.0)' }
          });
          var respData = JSON.parse(resp.getContentText());
          if (respData.news) {
            respData.news.forEach(function(article) {
              var key = article.uuid || article.title;
              if (seen[key]) return;
              seen[key] = true;
              news.push({
                title: article.title,
                publisher: article.publisher,
                link: article.link,
                publishTime: article.providerPublishTime * 1000,
                symbol: sym,
                type: article.type || 'STORY'
              });
            });
          }
          Utilities.sleep(200);
        } catch (e) {
          Logger.log('News fetch error for ' + sym + ': ' + e);
        }
      });
      news.sort(function(a, b) { return b.publishTime - a.publishTime; });
    } catch(e) {
      Logger.log('News section failed entirely: ' + e);
    }

    return JSON.stringify({
      benchmarks: {
        portfolio: portfolioReturn,
        sp500: sp500,
        nasdaq: nasdaq,
        msciWorld: msciWorld
      },
      sectors: sectorMap,
      risk: {
        volatility: volatility,
        avgReturn: avgReturn,
        sharpe: sharpe
      },
      rebalance: rebalance,
      movers: { gainers: gainers, losers: losers },
      dividends: data.dividends ? {
        grossUSD: data.dividends.totals.grossUSD || 0,
        netUSD: data.dividends.totals.netUSD || 0,
        netILS: data.dividends.totals.netILS || 0,
        yieldOnCost: ((data.dividends.totals.netUSD || 0) / (data.ibkr.totalCostUSD || 1))
      } : null,
      news: news.slice(0, 30),
      usdIls: usdIls,
      updatedAt: data.meta.updatedAt
    });
  } catch (e) {
    return JSON.stringify({ error: e.toString() });
  }
}
// ── 🚀 שדרוג v3 — בדיקות שלמות, דיבידנדים מתקדמים, אינטגרציות, היסטוריה ──
// ── 🔍 1. בדיקות שלמות אוטומטיות ──
function runIntegrityCheck() {
  var issues = [];

  // ── בדיקה 1: IBKR vs עלויות קנייה ──
  var ibkrSheet = SS.getSheetByName('IBKR');
  if (!ibkrSheet) { issues.push('❌ גיליון IBKR לא נמצא'); return issues; }

  var ibkrLast = ibkrSheet.getLastRow();
  var ibkrData = ibkrLast > 9 ? ibkrSheet.getRange(10, 1, ibkrLast - 9, 15).getValues() : [];

  var purchaseCosts = getPurchaseCosts();
  var ibkrSymbols = {};

  ibkrData.forEach(function(row) {
    var sym = String(row[0]).trim().toUpperCase();
    var type = String(row[2]).trim();
    var qty = parseFloat(row[4]) || 0;
    if (!sym || sym === 'סה"כ' || type === 'מזומן') return;
    ibkrSymbols[sym] = qty;
  });

  // השוואת כמויות
  Object.keys(ibkrSymbols).forEach(function(sym) {
    var ibkrQty = ibkrSymbols[sym];
    var pc = purchaseCosts[sym];
    if (!pc) {
      issues.push('⚠️ <b>' + sym + '</b>: קיים בIBKR אך חסר בעלויות קנייה (כמות: ' + ibkrQty + ')');
    } else {
      var diff = Math.abs(ibkrQty - pc.qty);
      if (diff > 0.001) {
        issues.push('🔴 <b>' + sym + '</b>: פער כמות — IBKR: ' + ibkrQty + ' | נטו (קנייה-מכירה): ' + pc.qty +
          ' [גולמי: ' + pc.grossQty + ' | נמכר: ' + pc.soldQty + '] (פער: ' + diff.toFixed(4) + ')');
      }
    }
  });

  // בדיקה הפוכה — סימבולים בעלויות שלא בIBKR (משתמש בסף כדי להתעלם משאריות float קטנות)
  Object.keys(purchaseCosts).forEach(function(sym) {
    if (!ibkrSymbols[sym] && purchaseCosts[sym].qty > 0.001) {
      issues.push('⚠️ <b>' + sym + '</b>: קיים בעלויות קנייה (נטו) אך לא בIBKR (כמות נטו: ' + purchaseCosts[sym].qty.toFixed(2) + ')');
    }
  });

  // ── בדיקה 2: מזומן IBKR ──
  var ibkrCash = 0;
  ibkrData.forEach(function(row) {
    if (String(row[2]).trim() === 'מזומן') {
      ibkrCash += parseFloat(row[11]) || 0;
    }
  });
  if (ibkrCash < 0) {
    issues.push('🔴 יתרת מזומן IBKR שלילית: ₪' + fmt(Math.abs(ibkrCash)));
  }

  // ── בדיקה 3: שער USD/ILS ──
  var usdIls = getCurrentUSDILS();
  if (usdIls < 2.5 || usdIls > 5) {
    issues.push('⚠️ שער USD/ILS חריג: ' + usdIls.toFixed(4) + ' (בדוק עדכון שערים)');
  }

  // ── בדיקה 4: נתונים חסרים בIBKR ──
  ibkrData.forEach(function(row) {
    var sym = String(row[0]).trim();
    var type = String(row[2]).trim();
    if (!sym || sym === 'סה"כ' || type === 'מזומן') return;
    var curP = parseFloat(row[9]);
    var valILS = parseFloat(row[11]);
    if (!curP || curP === 0) {
      issues.push('⚠️ <b>' + sym + '</b>: מחיר נוכחי חסר (0)');
    }
    if (!valILS || valILS === 0) {
      issues.push('⚠️ <b>' + sym + '</b>: שווי בשקלים חסר (0)');
    }
  });

  // ── בדיקה 5: סה"כ IBKR ──
  var totalRow = ibkrData.find(function(r) { return String(r[0]).trim() === 'סה"כ'; });
  if (totalRow) {
    var sheetTotal = parseFloat(totalRow[11]) || 0;
    var calcTotal = 0;
    var calcCash = 0;
    ibkrData.forEach(function(row) {
      var label = String(row[0]).trim();
      var type = String(row[2]).trim();
      if (label === 'סה"כ') return;
      var val = parseFloat(row[11]) || 0;
      if (type === 'מזומן') { calcCash += val; return; }
      calcTotal += val;
    });
    var calcGrand = calcTotal + calcCash;
    var totalDiff = Math.abs(sheetTotal - calcGrand);
    if (totalDiff > 1) {
      issues.push('🔴 סה"כ IBKR לא תואם: גיליון ₪' + fmt(sheetTotal) + ' | חישוב ₪' + fmt(calcGrand) +
        ' [ניירות ₪' + fmt(calcTotal) + ' + מזומן ₪' + fmt(calcCash) + '] (פער ₪' + fmt(totalDiff) + ')');
    }
  }

  return issues;
}

function REPORT_integrity() {
  // ✅ v13.4.7.0: התראה רק כשהתמונה משתנה — אותה אי-התאמה לא תישלח שוב ושוב
  var issues = runIntegrityCheck();
  var props = PropertiesService.getScriptProperties();
  var lastSig = props.getProperty('LAST_INTEGRITY_SIG') || '';
  var sig = issues.join('||');
  if (issues.length === 0) {
    if (lastSig) {
      sendTelegram('✅ <b>בדיקת שלמות חזרה לתקין</b>\nכל הנתונים תואמים — הפערים נסגרו');
      props.deleteProperty('LAST_INTEGRITY_SIG');
    }
    Logger.log('✅ Integrity check passed (no change)');
    return;
  }
  if (sig === lastSig) {
    Logger.log('⚠️ Integrity issues unchanged (' + issues.length + ') — silent');
    return;
  }
  var msg = '🔍 <b>בדיקת שלמות — נמצאו ' + issues.length + ' בעיות</b>\n';
  msg += '━━━━━━━━━━━━━━━━━━━━\n';
  issues.forEach(function(issue) { msg += issue + '\n'; });
  msg += '\n⚠️ בדוק ותקן לפני שזה מתפוצץ';
  sendTelegram(msg);
  props.setProperty('LAST_INTEGRITY_SIG', sig);
  Logger.log('⚠️ Integrity issues: ' + issues.length + ' (new)');
}
function getAnnualTaxSummary() {
  var sheet = SS.getSheetByName('דיבידנדים');
  if (!sheet) return { totalTaxUSD: 0, totalTaxILS: 0, byYear: {} };

  // Read the summary table at top
  var summaryRange = sheet.getRange(6, 1, 10, 5).getValues();
  var totalTaxUSD = 0;
  for (var i = 0; i < summaryRange.length; i++) {
    var sym = String(summaryRange[i][0]).trim();
    if (!sym || sym === 'סה"כ') break;
    totalTaxUSD += parseFloat(summaryRange[i][2]) || 0;
  }

  var usdIls = getCurrentUSDILS();
  return {
    totalTaxUSD: Math.abs(totalTaxUSD),
    totalTaxILS: Math.abs(totalTaxUSD) * usdIls,
    note: 'ניכוי מס במקור 25% — ניתן לקזז בדו"ח שנתי בישראל'
  };
}

function getUpcomingExDividends(daysAhead) {
  var sheet = SS.getSheetByName('IBKR');
  if (!sheet) return [];
  var lastRow = sheet.getLastRow();
  if (lastRow < 10) return [];

  var symbols = [];
  sheet.getRange(10, 1, lastRow - 9, 1).getValues().forEach(function(row) {
    var sym = String(row[0]).trim().toUpperCase();
    if (sym && sym !== 'סה"כ') symbols.push(sym);
  });

  var now = new Date();
  var future = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
  var upcoming = [];

  symbols.forEach(function(sym) {
    try {
      var text = _yahooFetch('/v8/finance/chart/' + encodeURIComponent(sym) + '?interval=1d&range=1d');
      if (!text) return;
      var meta = JSON.parse(text).chart.result[0].meta;
      if (meta.exDividendDate) {
        var exDate = new Date(meta.exDividendDate * 1000);
        if (exDate >= now && exDate <= future) {
          upcoming.push({
            symbol: sym,
            exDate: Utilities.formatDate(exDate, 'Asia/Jerusalem', 'dd/MM/yyyy'),
            exDateISO: exDate.toISOString(),
            trailingRate: meta.trailingAnnualDividendRate || 0,
            quarterlyEst: meta.trailingAnnualDividendRate ? meta.trailingAnnualDividendRate / 4 : 0
          });
        }
      }
      Utilities.sleep(300);
    } catch (e) {}
  });

  return upcoming;
}
// ── 🌐 3. אינטגרציות — Google Calendar, Drive, Email ──
function syncDividendCalendar() {
  try {
    var upcoming = getUpcomingExDividends(60);
    if (upcoming.length === 0) {
      Logger.log('📅 אין ex-dividend קרובים');
      return;
    }

    // Find or create a dedicated calendar
    var calName = '📊 דיבידנדים — תיק השקעות';
    var calendars = CalendarApp.getCalendarsByName(calName);
    var cal = calendars.length > 0 ? calendars[0] : CalendarApp.createCalendar(calName);

    var added = 0;
    upcoming.forEach(function(d) {
      var exDate = new Date(d.exDateISO);
      var title = '📅 Ex-Dividend: ' + d.symbol;
      var desc = 'סימבול: ' + d.symbol + '\n' +
                 'תאריך Ex-Dividend: ' + d.exDate + '\n' +
                 'רבעוני מוערך: $' + d.quarterlyEst.toFixed(3) + '\n' +
                 'שנתי נומינלי: $' + d.trailingRate.toFixed(2);

      // Check if event already exists
      var existing = cal.getEventsForDay(exDate);
      var found = existing.some(function(e) { return e.getTitle() === title; });
      if (!found) {
        cal.createAllDayEvent(title, exDate, { description: desc });
        added++;
      }
    });

    Logger.log('📅 ' + added + ' אירועי לוח שנה נוספו/עודכנו');
    return added;
  } catch (e) {
    Logger.log('שגיאת יומן: ' + e);
    return 0;
  }
}

function MAINT_backupToDrive() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var dateStr = Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'yyyy-MM-dd');

    // Create backup folder if not exists
    var folderName = 'גיבויי תיק השקעות';
    var folders = DriveApp.getFoldersByName(folderName);
    var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

    // Copy the spreadsheet
    var file = DriveApp.getFileById(ss.getId());
    var backupName = 'תיק השקעות — גיבוי ' + dateStr;

    // Check if backup already exists for today
    var existing = folder.getFilesByName(backupName);
    if (existing.hasNext()) {
      Logger.log('💾 גיבוי כבר קיים להיום');
      return;
    }

    file.makeCopy(backupName, folder);
    Logger.log('💾 גיבוי נשמר: ' + backupName);

    // Clean old backups (keep last 30)
    var backups = [];
    var files = folder.getFiles();
    while (files.hasNext()) {
      backups.push(files.next());
    }
    backups.sort(function(a, b) { return b.getLastUpdated() - a.getLastUpdated(); });
    if (backups.length > 30) {
      for (var i = 30; i < backups.length; i++) {
        backups[i].setTrashed(true);
      }
      Logger.log('💾 נמחקו ' + (backups.length - 30) + ' גיבויים ישנים');
    }
  } catch (e) {
    Logger.log('שגיאת גיבוי: ' + e);
  }
}

function REPORT_email() {
  try {
    var data = _getPortfolioData();
    var dateStr = Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'dd/MM/yyyy HH:mm');

    var html = '<div style="font-family:Arial,sans-serif;direction:rtl;max-width:600px;margin:0 auto">';
    html += '<h2 style="color:#3B6FE8">📊 דוח תיק השקעות — ' + dateStr + '</h2>';
    html += '<hr>';

    // Summary
    html += '<h3>סיכום</h3>';
    html += '<table style="border-collapse:collapse;width:100%">';
    html += '<tr><td style="padding:8px;border:1px solid #ddd">שווי כולל</td><td style="padding:8px;border:1px solid #ddd;text-align:left">₪' + fmt(data.summary.grandTotal) + '</td></tr>';
    html += '<tr><td style="padding:8px;border:1px solid #ddd">תשואה כוללת</td><td style="padding:8px;border:1px solid #ddd;text-align:left;color:' + (data.summary.totalReturn >= 0 ? 'green' : 'red') + '">₪' + fmt(data.summary.totalReturn) + ' (' + (data.summary.totalRetPct * 100).toFixed(2) + '%)</td></tr>';
    html += '<tr><td style="padding:8px;border:1px solid #ddd">IBKR</td><td style="padding:8px;border:1px solid #ddd;text-align:left">₪' + fmt(data.summary.ibkrVal) + '</td></tr>';
    html += '<tr><td style="padding:8px;border:1px solid #ddd">FAIR</td><td style="padding:8px;border:1px solid #ddd;text-align:left">₪' + fmt(data.summary.fairVal) + '</td></tr>';
    html += '<tr><td style="padding:8px;border:1px solid #ddd">בנקים</td><td style="padding:8px;border:1px solid #ddd;text-align:left">₪' + fmt(data.summary.banksVal) + '</td></tr>';
    html += '</table>';

    // Dividends
    if (data.dividends) {
      html += '<h3>דיבידנדים</h3>';
      html += '<table style="border-collapse:collapse;width:100%">';
      html += '<tr><th style="padding:8px;border:1px solid #ddd">סימבול</th><th style="padding:8px;border:1px solid #ddd">נטו $</th><th style="padding:8px;border:1px solid #ddd">נטו ₪</th></tr>';
      data.dividends.summary.forEach(function(d) {
        html += '<tr><td style="padding:8px;border:1px solid #ddd">' + d.symbol + '</td><td style="padding:8px;border:1px solid #ddd">$' + d.netUSD.toFixed(2) + '</td><td style="padding:8px;border:1px solid #ddd">₪' + fmt(d.netILS) + '</td></tr>';
      });
      html += '<tr style="font-weight:bold"><td style="padding:8px;border:1px solid #ddd">סה"כ</td><td style="padding:8px;border:1px solid #ddd">$' + data.dividends.totals.netUSD.toFixed(2) + '</td><td style="padding:8px;border:1px solid #ddd">₪' + fmt(data.dividends.totals.netILS) + '</td></tr>';
      html += '</table>';
    }

    // Integrity check
    var issues = runIntegrityCheck();
    if (issues.length > 0) {
      html += '<h3 style="color:red">⚠️ בדיקת שלמות — נמצאו ' + issues.length + ' בעיות</h3>';
      html += '<ul>';
      issues.forEach(function(i) { html += '<li>' + i.replace(/<[^>]+>/g, '') + '</li>'; });
      html += '</ul>';
    } else {
      html += '<h3 style="color:green">✅ בדיקת שלמות תקינה</h3>';
    }

    html += '</div>';

    var settings = getSettings();
    var emailAddr = PropertiesService.getScriptProperties().getProperty('REPORT_EMAIL');
    if (!emailAddr) {
      Logger.log('⚠️ לא הוגדר אימייל לדוחות — הגדר בScript Properties: REPORT_EMAIL');
      return;
    }

    MailApp.sendEmail({
      to: emailAddr,
      subject: '📊 דוח תיק השקעות — ' + dateStr,
      htmlBody: html
    });
    Logger.log('📧 דוח נשלח ל' + emailAddr);
  } catch (e) {
    Logger.log('שגיאת אימייל: ' + e);
  }
}
// ── 🗄️ 4. סנאפשוט יומי + היסטוריה ──
function saveDailySnapshot() {
  try {
    var data = _getPortfolioData();
    var sheet = SS.getSheetByName('היסטוריה');

    // Create sheet if not exists
    if (!sheet) {
      sheet = SS.insertSheet('היסטוריה');
      // Headers
      var headers = ['תאריך', 'שווי כולל ₪', 'IBKR ₪', 'FAIR ₪', 'בנקים ₪', 'מזומן ₪', 'תשואה ₪', 'תשואה %', 'USD/ILS', 'דיבידנדים נטו $', 'מס זר $'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, headers.length).setBackground('#3B6FE8').setFontColor('#FFFFFF');
    }

    var dateStr = Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'dd/MM/yyyy');

    // Check if already saved today — update existing row instead of duplicating
    var lastRow = sheet.getLastRow();
    var existingRow = 0;
    if (lastRow >= 2) {
      var allDates = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (var i = 0; i < allDates.length; i++) {
        if (String(allDates[i][0]) === dateStr) { existingRow = i + 2; break; }
      }
    }

    var divNet = data.dividends ? (data.dividends.totals.netUSD || 0) : 0;
    var taxPaid = data.dividends ? Math.abs(data.dividends.totals.taxUSD || 0) : 0;

    var row = [
      dateStr,
      Math.round(data.summary.grandTotal),
      Math.round(data.summary.ibkrVal),
      Math.round(data.summary.fairVal),
      Math.round(data.summary.banksVal),
      Math.round(data.cash.total),
      Math.round(data.summary.totalReturn),
      (data.summary.totalRetPct * 100).toFixed(2),
      data.meta.usdIls.toFixed(4),
      divNet.toFixed(2),
      taxPaid.toFixed(2)
    ];

    var r;
    if (existingRow > 0) {
      // עדכן שורה קיימת של היום
      sheet.getRange(existingRow, 1, 1, row.length).setValues([row]);
      r = existingRow;
      Logger.log('📊 סנאפשוט עודכן (שורה קיימת): ' + dateStr);
    } else {
      // שורה חדשה
      sheet.appendRow(row);
      r = sheet.getLastRow();
    }
    sheet.getRange(r, 2, 1, 5).setNumberFormat('#,##0');
    sheet.getRange(r, 7, 1, 1).setNumberFormat('#,##0');
    sheet.getRange(r, 8, 1, 1).setNumberFormat('0.00');
    sheet.getRange(r, 9, 1, 1).setNumberFormat('0.0000');
    sheet.getRange(r, 10, 1, 2).setNumberFormat('#,##0.00');

    // Color the return cell
    var retPct = parseFloat(row[7]);
    sheet.getRange(r, 8).setFontColor(retPct >= 0 ? '#2ECC71' : '#E74C3C');

    // ✅ v11.6.3.0: אבן דרך בטלגרם — כל חצי מיליון ₪ שהתיק חוצה
    try {
      var M_STEP = 500000;
      var mProps = PropertiesService.getScriptProperties();
      var mLast = parseFloat(mProps.getProperty('MILESTONE_LAST') || '0');
      var mCur = Math.floor(data.summary.grandTotal / M_STEP);
      if (mLast > 0 && mCur > Math.floor(mLast / M_STEP)) {
        var mLevel = mCur * M_STEP;
        var mLabel = (mLevel % 1000000 === 0) ? (mLevel / 1000000) + ' מיליון' : (mLevel / 1000000) + ' מיליון';
        var mGoal = parseFloat(mProps.getProperty('PORTFOLIO_GOAL_ILS')) || 0;
        var mMsg = '🎉 <b>אבן דרך!</b>\n\nהתיק חצה את ה-' + mLabel + ' מיליון ₪ 🚀\nשווי נוכחי: <b>₪' + fmt(data.summary.grandTotal) + '</b>';
        if (mGoal > 0) {
          var mPct = data.summary.grandTotal / mGoal * 100;
          var mBars = Math.min(10, Math.max(0, Math.round(mPct / 10)));
          mMsg += '\nהתקדמות ליעד (₪' + fmt(mGoal) + '): <b>' + mPct.toFixed(1) + '%</b>';
          mMsg += '\n' + '█'.repeat(mBars) + '░'.repeat(10 - mBars);
        }
        mMsg += '\n\n📊 ממשיכים לעבר היעד! 💪';
        sendTelegram(mMsg);
        Logger.log('🎉 אבן דרך: ' + mLabel + ' ₪');
      }
      mProps.setProperty('MILESTONE_LAST', String(data.summary.grandTotal));
    } catch (me) { Logger.log('שגיאת אבן דרך: ' + me); }

    // ✅ v11.6.6.0: התראת שפל (Drawdown) — 5% מהשיא המתעדכן, התאוששות ב-2.5%
    try {
      var DD_THRESHOLD = 0.05, DD_RECOVERY = 0.025;
      var ddProps = PropertiesService.getScriptProperties();
      var ddState = {};
      try { ddState = JSON.parse(ddProps.getProperty('DD_STATE') || '{}'); } catch (de) { ddState = {}; }
      if (!ddState.peak || ddState.peak < data.summary.grandTotal) ddState.peak = data.summary.grandTotal;
      var ddPct = ddState.peak > 0 ? (ddState.peak - data.summary.grandTotal) / ddState.peak : 0;
      if (ddPct >= DD_THRESHOLD && !ddState.alerted) {
        sendTelegram('📉 <b>התראת שפל (Drawdown)</b>\n\nהתיק ירד <b>' + (ddPct * 100).toFixed(1) + '%</b> מהשיא\nשיא: <b>₪' + fmt(ddState.peak) + '</b>\nנוכחי: <b>₪' + fmt(data.summary.grandTotal) + '</b>\n(₪' + fmt(Math.round(ddState.peak - data.summary.grandTotal)) + ' מתחת לשיא)');
        ddState.alerted = true;
        Logger.log('📉 התראת שפל: ' + (ddPct * 100).toFixed(1) + '% מהשיא');
      } else if (ddPct <= DD_RECOVERY && ddState.alerted) {
        ddState.alerted = false;
        sendTelegram('📈 <b>התאוששות משפל</b>\n\nהתיק חזר לטווח ' + (DD_RECOVERY * 100).toFixed(1) + '% מהשיא\nנוכחי: <b>₪' + fmt(data.summary.grandTotal) + '</b>');
      }
      ddProps.setProperty('DD_STATE', JSON.stringify(ddState));
    } catch (dde) { Logger.log('שגיאת התראת שפל: ' + dde); }

    Logger.log('📊 סנאפשוט נשמר: ' + dateStr + ' | שווי: ₪' + fmt(data.summary.grandTotal));
  } catch (e) {
    Logger.log('שגיאת סנאפשוט: ' + e);
  }
}

function getHistoricalData() {
  var sheet = SS.getSheetByName('היסטוריה');
  if (!sheet) return { history: [], chart: null };

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return { history: [], chart: null };

  var data = sheet.getRange(2, 1, lastRow - 1, 11).getValues();
  var history = [];

  data.forEach(function(row) {
    if (!row[0]) return;
    // ✅ v13.1.0.0: תאריך תא Date אמיתי → dd/MM/yyyy (String(Date) נתן "Wed Oct 07 2026 ..." ושבר גרפים וסינון תקופות)
    var _d = row[0];
    var _ds;
    if (Object.prototype.toString.call(_d) === '[object Date]' && !isNaN(_d.getTime())) {
      _ds = Utilities.formatDate(_d, 'Asia/Jerusalem', 'dd/MM/yyyy');
    } else {
      _ds = String(_d).trim();
      // "dd/MM/yyyy HH:mm" → רק התאריך (תואם לפרסור בצד הלקוח)
      var _m = _ds.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (_m) _ds = ('0' + _m[1]).slice(-2) + '/' + ('0' + _m[2]).slice(-2) + '/' + _m[3];
    }
    history.push({
      date: _ds,
      totalValue: parseFloat(row[1]) || 0,
      ibkr: parseFloat(row[2]) || 0,
      fair: parseFloat(row[3]) || 0,
      banks: parseFloat(row[4]) || 0,
      cash: parseFloat(row[5]) || 0,
      returnILS: parseFloat(row[6]) || 0,
      returnPct: parseFloat(row[7]) || 0,
      usdIls: parseFloat(row[8]) || 0,
      divNetUSD: parseFloat(row[9]) || 0,
      taxPaidUSD: parseFloat(row[10]) || 0
    });
  });

  return { history: history };
}
// ── 🚀 שדרוג v4 — התראות מותאמות, מטרות, יצוא נתונים ──
// ── 🔔 התראות מחיר מותאמות אישית ──
function getCustomAlerts() {
  var sheet = SS.getSheetByName('התראות מחיר');
  if (!sheet) return [];
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  var data = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
  var alerts = [];
  data.forEach(function(row) {
    var sym = String(row[0]).trim();
    if (!sym) return;
    alerts.push({
      symbol: sym,
      targetPrice: parseFloat(row[1]) || 0,
      direction: String(row[2]).trim(), // 'מעל' או 'מתחת'
      note: String(row[3] || ''),
      active: String(row[4]).trim() !== 'לא',
      lastTriggered: String(row[5] || '')
    });
  });
  return alerts;
}


function markAlertTriggered(sym) {
  var sheet = SS.getSheetByName('התראות מחיר');
  if (!sheet) return;
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  var data = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
  for (var i = 0; i < data.length; i++) {
    if (String(data[i][0]).trim() === sym) {
      sheet.getRange(i + 2, 6).setValue(new Date());
      break;
    }
  }
}
// ── 🎯 מערכת מטרות — יעד שווי תיק ──
function getPortfolioGoal(currentVal, history) {
  var props = PropertiesService.getScriptProperties();
  var goalILS = parseFloat(props.getProperty('PORTFOLIO_GOAL_ILS')) || 0;

  if (goalILS === 0 || !currentVal || currentVal <= 0) return null;

  var progress = currentVal / goalILS;
  var remaining = goalILS - currentVal;

  // ── חישוב מגמות מהיסטוריה ──
  var hist = history || [];
  var monthlyGrowthRate = 0;  // גידול חודשי ממוצע ב₪ (כולל שער דולר)
  var usdTrendRate = 0;       // מגמת שער דולר חודשית (%)
  var portfolioTrendPct = 0; // תשואה חודשית ממוצעת (%)
  var trendBasis = 'אין מספיק נתונים';

  if (hist.length >= 3) {
    // מיון לפי תאריך (ישן → חדש)
    var sorted = hist.slice().sort(function(a,b) {
      var da = parseHistDate(a.date), db = parseHistDate(b.date);
      return da - db;
    });

    // ── מגמת שווי כולל (₪) ──
    var values = sorted.map(function(h) { return h.totalValue || 0; });
    var n = values.length;
    if (n >= 3 && values[0] > 0) {
      // חישוב CAGR חודשי מנקודה ראשונה לאחרונה
      var monthsElapsed = Math.max(1, n - 1);
      var totalGrowth = values[n-1] / values[0];
      monthlyGrowthRate = Math.pow(totalGrowth, 1/monthsElapsed) - 1; // חודשי ריבית דריבית
      portfolioTrendPct = monthlyGrowthRate * 100;
      trendBasis = monthsElapsed + ' חודשים היסטוריה';
    }

    // ── מגמת שער דולר ──
    var usdValues = sorted.map(function(h) { return h.usdIls || 0; }).filter(function(v){return v > 0;});
    if (usdValues.length >= 3) {
      var usdN = usdValues.length;
      var usdMonths = Math.max(1, usdN - 1);
      var usdGrowth = usdValues[usdN-1] / usdValues[0];
      usdTrendRate = (Math.pow(usdGrowth, 1/usdMonths) - 1) * 100;
    }

    // ── ניתוח רגרסיה לינארית (מגמה אחרונה) ──
    // משתמש ב30 נקודות אחרונות אם יש
    var recentValues = values.slice(-Math.min(30, n));
    var recentN = recentValues.length;
    if (recentN >= 3) {
      // Linear regression: y = a + b*x
      var sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
      for (var i = 0; i < recentN; i++) {
        sumX += i; sumY += recentValues[i];
        sumXY += i * recentValues[i]; sumX2 += i * i;
      }
      var denom = recentN * sumX2 - sumX * sumX;
      if (denom !== 0) {
        var slope = (recentN * sumXY - sumX * sumY) / denom;
        var intercept = (sumY - slope * sumX) / recentN;
        // שיפוע חודשי ב₪
        var monthlyDeltaILS = slope;
        // אם השיפוע חיובי, נשתמש בו כחיזוי שמרני
        if (monthlyDeltaILS > 0 && monthlyGrowthRate <= 0) {
          monthlyGrowthRate = monthlyDeltaILS / currentVal;
          portfolioTrendPct = monthlyGrowthRate * 100;
          trendBasis = 'מגמה לינארית (' + recentN + ' נקודות אחרונות)';
        }
      }
    }
  }

  // ── חישוב תחזית קומפאונדינג ──
  var monthsToGoal = 0;
  var projectedValues = [];

  if (monthlyGrowthRate > 0 && remaining > 0) {
    // Compound growth: val * (1+r)^m >= goal
    // m = log(goal/val) / log(1+r)
    monthsToGoal = Math.ceil(Math.log(goalILS / currentVal) / Math.log(1 + monthlyGrowthRate));

    // צור נקודות תחזית לגרף (כל 3 חודשים)
    var maxMonths = Math.min(monthsToGoal, 120); // מקסימום 10 שנים
    for (var m = 0; m <= maxMonths; m += 3) {
      projectedValues.push({
        month: m,
        value: Math.round(currentVal * Math.pow(1 + monthlyGrowthRate, m))
      });
    }
    // ודא שהנקודה האחרונה היא היעד
    if (monthsToGoal <= 120) {
      projectedValues.push({ month: monthsToGoal, value: goalILS });
    }
  }

  // ── פירוט מרכיבי התחזית ──
  var breakdown = {
    portfolioTrendPct: portfolioTrendPct,
    usdTrendPct: usdTrendRate,
    trendBasis: trendBasis,
    histPoints: hist.length,
    currentVal: currentVal,
    ibkrShare: 0,  // יתמלא מבחוץ אם יש נתונים
    fairShare: 0,
    banksShare: 0
  };

  return {
    goalILS: goalILS,
    currentVal: currentVal,
    progress: progress,
    remaining: remaining,
    monthlyGrowthRate: monthlyGrowthRate,
    monthlyGrowthPct: portfolioTrendPct,
    usdTrendPct: usdTrendRate,
    trendBasis: trendBasis,
    histPoints: hist.length,
    monthsToGoal: monthsToGoal,
    estimatedDate: monthsToGoal > 0 ?
      Utilities.formatDate(new Date(new Date().getTime() + monthsToGoal * 30 * 24 * 60 * 60 * 1000), 'Asia/Jerusalem', 'MM/yyyy') : '',
    projectedValues: projectedValues,
    breakdown: breakdown
  };
}

// עזר: פרסור תאריך מהפורמט dd/MM/yyyy
function parseHistDate(dateStr) {
  // ✅ v12.5.0.1: תאריכים בגיליון ההיסטוריה עשויים להגיע כאובייקטי Date אמיתיים
  // (String(date) = "Mon Oct 05 2026...") ולא רק כטקסט dd/MM/yyyy — פעם הפרסור
  // החזיר 1970 לכל שורה כזו ושבר את הדיג'סט השבועי ואת מיון ההיסטוריה ביעד.
  if (dateStr && typeof dateStr === 'object' && dateStr.getTime) return dateStr;
  var s = String(dateStr);
  var parts = s.split('/');
  if (parts.length === 3) {
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  }
  var dt = new Date(s);
  return isNaN(dt.getTime()) ? new Date(0) : dt;
}

// ✅ v12.5.0.1: עזר תצוגה — מנרמל תאריך היסטוריה (טקסט או Date) ל-dd/MM/yyyy
function _fmtHistDate(d) {
  try {
    var s = String(d);
    if (s.indexOf('/') >= 0) return s;
    var dt = parseHistDate(s);
    if (!dt.getTime()) return s;
    return Utilities.formatDate(dt, 'Asia/Jerusalem', 'dd/MM/yyyy');
  } catch (e) { return String(d); }
}


// ✅ חדש: העבר טוקן טלגרם לScript Properties



function setPortfolioGoal(goalILS) {
  var props = PropertiesService.getScriptProperties();
  props.setProperty('PORTFOLIO_GOAL_ILS', String(goalILS || 0));
  return { goalILS: goalILS, saved: true };
}

// ── 📉 2. Max Drawdown — מחשב את הנפילה הגרועה ביותר מפסגה ──
function calculateMaxDrawdown(history) {
  if (!history || history.length < 2) return { maxDrawdown: 0, maxDrawdownPct: 0, peakDate: '', troughDate: '' };

  var peak = history[0].totalValue;
  var peakDate = history[0].date;
  var maxDD = 0;
  var maxDDPct = 0;
  var troughDate = '';
  var curPeakDate = peakDate;

  for (var i = 1; i < history.length; i++) {
    var val = history[i].totalValue;
    if (val > peak) {
      peak = val;
      curPeakDate = history[i].date;
    }
    var dd = peak - val;
    var ddPct = peak > 0 ? dd / peak : 0;
    if (ddPct > maxDDPct) {
      maxDDPct = ddPct;
      maxDD = dd;
      peakDate = curPeakDate;
      troughDate = history[i].date;
    }
  }
  return { maxDrawdown: maxDD, maxDrawdownPct: maxDDPct, peakDate: peakDate, troughDate: troughDate };
}

// ── 📊 3. Beta — רגישות התיק מול S&P 500 ──
function calculateBeta(history, sp500Returns) {
  // If we don't have real S&P returns, estimate from portfolio volatility vs typical market
  // Beta = Cov(Rp, Rm) / Var(Rm)
  // Without market data, use a simplified approach: compare portfolio daily returns variance
  if (!history || history.length < 5) return 1.0; // Default beta = 1

  // Calculate daily portfolio returns
  var returns = [];
  for (var i = 1; i < history.length; i++) {
    if (history[i].totalValue > 0 && history[i-1].totalValue > 0) {
      returns.push((history[i].totalValue - history[i-1].totalValue) / history[i-1].totalValue);
    }
  }
  if (returns.length < 3) return 1.0;

  // Estimate beta from portfolio volatility
  // Typical broad market index fund has volatility ~15% annual
  // If portfolio vol is higher → beta > 1, lower → beta < 1
  var avgReturn = returns.reduce(function(s, r) { return s + r; }, 0) / returns.length;
  var variance = returns.reduce(function(s, r) { return s + Math.pow(r - avgReturn, 2); }, 0) / returns.length;
  var dailyVol = Math.sqrt(variance);
  // Annualize: daily * sqrt(252)
  var annualVol = dailyVol * Math.sqrt(252);

  // Market volatility assumption ~15% for S&P 500
  var marketVol = 0.15;
  // Simplified beta = portfolio vol / market vol (assumes correlation ~1)
  // This is a rough estimate; real beta needs actual market returns
  var beta = annualVol / marketVol;

  // Clamp to reasonable range
  return Math.max(0.1, Math.min(3.0, beta));
}

// ── 💱 4. Currency Exposure — פילוח מטבע ──
function getCurrencyExposure(ibkrPositions, fairPositions, ibkrCash, fairCash, banks, usdIls) {
  var usdValue = 0; // In ILS
  var ilsValue = 0;

  // IBKR positions are all in USD (converted to ILS in valILS)
  ibkrPositions.forEach(function(p) { usdValue += p.valILS; });
  usdValue += ibkrCash; // IBKR cash is in USD (stored as ILS equivalent)

  // FAIR positions are in ILS
  fairPositions.forEach(function(p) { ilsValue += p.valILS; });
  ilsValue += fairCash;

  // Banks — check currency
  banks.forEach(function(b) {
    if (b.ccy === 'USD' || b.ccy === '$') {
      usdValue += b.valueILS;
    } else {
      ilsValue += b.valueILS;
    }
  });

  var total = usdValue + ilsValue;
  return {
    usd: { valueILS: usdValue, pct: total > 0 ? usdValue / total : 0, valueUSD: usdIls > 0 ? usdValue / usdIls : 0 },
    ils: { valueILS: ilsValue, pct: total > 0 ? ilsValue / total : 0 },
    total: total,
    usdIls: usdIls
  };
}

// ── 📈 5. Performance Attribution — תרומת כל נייר לרווח ──
function getAttribution(ibkrPositions, fairPositions) {
  var attribution = [];

  // IBKR: contribution = retILS (absolute return in ILS)
  ibkrPositions.forEach(function(p) {
    attribution.push({
      name: p.sym,
      source: 'IBKR',
      valueILS: p.valILS,
      returnILS: p.retILS,
      returnPct: p.retPct,
      contribution: p.retILS // Absolute ₪ contribution to portfolio profit
    });
  });

  // FAIR: contribution = pl (absolute P&L in ILS)
  fairPositions.forEach(function(p) {
    attribution.push({
      name: p.name,
      source: 'FAIR',
      valueILS: p.valILS,
      returnILS: p.pl,
      returnPct: p.plPct,
      contribution: p.pl
    });
  });

  // Sort by absolute contribution (biggest contributors first)
  attribution.sort(function(a, b) {
    return Math.abs(b.contribution) - Math.abs(a.contribution);
  });

  // Calculate total positive and negative
  var totalPositive = 0, totalNegative = 0;
  attribution.forEach(function(a) {
    if (a.contribution > 0) totalPositive += a.contribution;
    else totalNegative += Math.abs(a.contribution);
  });

  return {
    positions: attribution.slice(0, 15), // Top 15
    totalPositive: totalPositive,
    totalNegative: totalNegative,
    netContribution: totalPositive - totalNegative
  };
}

// ═══════════════════════════════════════════════════════════
// ✅ v12.5.0.0 — מרכז התראות חכם + דיג'סט שבועי + קביעת יעד מהממשק
// ═══════════════════════════════════════════════════════════

// קביעת יעד מהממשק (מאובטח בטוקן) — סוגר את ה-thread הישן של "איך מגדירים את היעד"
function setPortfolioGoalSecured(token, goalILS) {
  var g = _gate(token); if (g) return g;
  try {
    var v = parseFloat(goalILS);
    if (isNaN(v) || v < 100000) return JSON.stringify({ ok: false, error: 'יעד לא תקין — מינימום ₪100,000' });
    PropertiesService.getScriptProperties().setProperty('PORTFOLIO_GOAL_ILS', String(Math.round(v)));
    return JSON.stringify({ ok: true, goalILS: Math.round(v) });
  } catch (e) { return JSON.stringify({ ok: false, error: String(e) }); }
}

// התראות חכמות — מחושבות מהנתונים בלבד, אפס תחזוק ידני.
// options.light=true מדלג על דיבידנדים צפויים (קריאות Yahoo) — לשימוש בתמצית ה-AI/דוחות.
function _smartAlerts(d, options) {
  var alerts = [];
  var light = !!(options && options.light);
  try {
    var s = d.summary || {}, ib = d.ibkr || {}, fa = d.fair || {};
    var total = s.grandTotal || 0;
    var hist = [];
    try { hist = (getHistoricalData() || {}).history || []; } catch (eH) {}
    if (total > 0) {
      // 1. ריכוז — נייר/קרן מעל 25% (danger) או 15% (warn) מהתיק
      var all = [];
      (ib.positions || []).forEach(function (p) { all.push({ name: p.sym, val: p.valILS || 0 }); });
      (fa.positions || []).forEach(function (p) { all.push({ name: p.name, val: p.valILS || 0 }); });
      all.forEach(function (p) {
        var share = p.val / total;
        if (share >= 0.25) alerts.push({ level: 'danger', icon: '🎯', title: 'ריכוז גבוה: ' + p.name, detail: (share * 100).toFixed(1) + '% מהתיק (₪' + Math.round(p.val).toLocaleString('en-US') + ') — שקול הקטנת פוזיציה' });
        else if (share >= 0.15) alerts.push({ level: 'warn', icon: '⚠️', title: 'ריכוז בינוני: ' + p.name, detail: (share * 100).toFixed(1) + '% מהתיק' });
      });
      // 2. שפל משיא אחרון — צניחה מעל 3% מהשיא ב-30 הנקודות האחרונות
      if (hist.length >= 3) {
        var recent = hist.slice(-30);
        var peak = 0; recent.forEach(function (h) { if ((h.totalValue || 0) > peak) peak = h.totalValue || 0; });
        if (peak > 0) {
          var dropPct = (peak - total) / peak * 100;
          if (dropPct >= 3) alerts.push({ level: 'warn', icon: '📉', title: 'תיק מתחת לשיא האחרון', detail: '-' + dropPct.toFixed(1) + '% מהשיא (₪' + Math.round(peak).toLocaleString('en-US') + ')' });
        }
      }
      // 3. קרבה ליעד — מעל 90%
      try {
        var goal = getPortfolioGoal(total, hist);
        if (goal && goal.goalILS > 0 && goal.progress >= 0.9) alerts.push({ level: 'info', icon: '🎯', title: 'קרוב ליעד!', detail: (goal.progress * 100).toFixed(1) + '% מהיעד ₪' + goal.goalILS.toLocaleString('en-US') + ' — נותרו ₪' + Math.round(goal.remaining).toLocaleString('en-US') });
      } catch (eG) {}
    }
    // 4. תזוזת דולר יומית מעל 0.8%
    try {
      var usdChg = fetchUSDILSDailyChange();
      if (usdChg && Math.abs(usdChg.changePct) >= 0.008) alerts.push({ level: 'info', icon: '💱', title: 'תזוזת שער דולר', detail: (usdChg.changePct >= 0 ? '+' : '') + (usdChg.changePct * 100).toFixed(2) + '% ביממה (' + usdChg.today.toFixed(4) + ')' });
    } catch (eU) {}
    // 5. דיבידנדים צפויים ב-7 ימים (כבד — נטען רק בממשק)
    if (!light) {
      try {
        var up = getUpcomingExDividends(7) || [];
        if (up.length > 0) {
          var names = [];
          up.slice(0, 5).forEach(function (u) { var nm = u.sym || u.symbol || u.ticker || ''; if (nm && names.indexOf(nm) < 0) names.push(nm); });
          alerts.push({ level: 'info', icon: '📅', title: 'דיבידנדים בדרך (' + up.length + ')', detail: names.join(', ') });
        }
      } catch (eD) {}
    }
  } catch (e) { alerts.push({ level: 'warn', icon: 'ℹ️', title: 'חישוב התראות נכשל חלקית', detail: String(e) }); }
  return alerts;
}

function ALERTS_smart(token) {
  var g = _gate(token); if (g) return g;
  try {
    var d = _getPortfolioData();
    return JSON.stringify({ ok: true, alerts: _smartAlerts(d, { light: false }), generatedAt: Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'dd/MM HH:mm') });
  } catch (e) { return JSON.stringify({ ok: false, error: String(e) }); }
}

// דיג'סט שבועי — מה השתנה בתיק מול לפני שבוע (מגיליון ההיסטוריה, אוטומטי לחלוטין)
function getWeeklyDigest(token) {
  var g = _gate(token); if (g) return g;
  try {
    var d = _getPortfolioData();
    var s = d.summary || {};
    var hist = (getHistoricalData() || {}).history || [];
    var out = { ok: true, hasHistory: false };
    if (hist.length >= 2) {
      var now = new Date();
      var weekAgo = null;
      for (var i = hist.length - 1; i >= 0; i--) {
        var dt = parseHistDate(hist[i].date);
        if ((now - dt) >= 6 * 24 * 60 * 60 * 1000) { weekAgo = hist[i]; break; }
      }
      if (weekAgo && weekAgo.totalValue > 0) {
        var delta = (s.grandTotal || 0) - weekAgo.totalValue;
        out = {
          ok: true, hasHistory: true,
          weekAgoValue: Math.round(weekAgo.totalValue),
          weekAgoDate: _fmtHistDate(weekAgo.date),
          currentValue: Math.round(s.grandTotal || 0),
          deltaILS: Math.round(delta),
          deltaPct: delta / weekAgo.totalValue * 100,
          usdThen: weekAgo.usdIls || null,
          usdNow: (d.meta && d.meta.usdIls) || null
        };
      }
    }
    return JSON.stringify(out);
  } catch (e) { return JSON.stringify({ ok: false, error: String(e) }); }
}

function fmt(n) { return Math.round(n).toLocaleString('en-US'); }

// ═══════════════════════════════════════════════════════════════
// 🆘 חירום — הוראות ודרכי גישה מאובטחים
// ═══════════════════════════════════════════════════════════════
// אחסון: גיליון "חירום" עם קידוד base64
// סיסמה: מאוחסנת כ-hash ב-Script Properties
// ═══════════════════════════════════════════════════════════════

function _hashPassword(pwd) {
  // legacy (ללא מלח) — נשמר לצורך אימות/שדרוג של גרסאות ישנות
  return Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256, pwd, Utilities.Charset.UTF_8
  ).map(function(b){ return ('0' + (b & 0xFF).toString(16)).slice(-2); }).join('');
}

// ✅ v11: גיבוב עם מלח + איטרציות — פורמט: v2$<iterations>$<salt>$<hash>
var _PWD_ITERATIONS = 1500;

function _hashPasswordSalted(pwd, salt, iterations) {
  var h = salt + '|' + pwd;
  for (var i = 0; i < iterations; i++) {
    h = Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256, h + salt, Utilities.Charset.UTF_8
    ).map(function(b){ return ('0' + (b & 0xFF).toString(16)).slice(-2); }).join('');
  }
  return 'v2$' + iterations + '$' + salt + '$' + h;
}

function _getEmergencySheet() {
  var sheet = SS.getSheetByName('חירום');
  if (!sheet) {
    sheet = SS.insertSheet('חירום');
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 5).setValues([['ID', 'קטגוריה', 'שם פריט', 'ערך (Base64)', 'הערות']]);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#2D5BFF').setFontColor('#FFFFFF');
    sheet.setColumnWidth(1, 80); sheet.setColumnWidth(2, 120); sheet.setColumnWidth(3, 200);
    sheet.setColumnWidth(4, 300); sheet.setColumnWidth(5, 200);
  }
  return sheet;
}

function _verifyEmergencyPassword(password) {
  var props = PropertiesService.getScriptProperties();
  var storedHash = props.getProperty('EMERGENCY_PWD_HASH');
  if (!storedHash) return { ok: false, needSetup: true };
  // ✅ v11: פורמט חדש עם מלח
  if (storedHash.indexOf('v2$') === 0) {
    var parts = storedHash.split('$');
    var iters = parseInt(parts[1], 10) || _PWD_ITERATIONS;
    var salt = parts[2];
    return { ok: _hashPasswordSalted(password, salt, iters) === storedHash, needSetup: false };
  }
  // פורמט ישן — אם הסיסמה נכונה, משדרגים אוטומטית לפורמט המאובטח
  if (_hashPassword(password) === storedHash) {
    var newSalt = Utilities.getUuid().replace(/-/g, '').substring(0, 12);
    props.setProperty('EMERGENCY_PWD_HASH', _hashPasswordSalted(password, newSalt, _PWD_ITERATIONS));
    Logger.log('✅ סיסמת חירום שודרגה אוטומטית לפורמט מלוח');
    return { ok: true, needSetup: false };
  }
  return { ok: false, needSetup: false };
}

function setupEmergencyPassword(newPassword) {
  if (!newPassword || newPassword.length < 4) {
    return JSON.stringify({ error: 'הסיסמה חייבת להיות לפחות 4 תווים' });
  }
  // ✅ v11: מלח אקראי + איטרציות
  var salt = Utilities.getUuid().replace(/-/g, '').substring(0, 12);
  PropertiesService.getScriptProperties().setProperty('EMERGENCY_PWD_HASH', _hashPasswordSalted(newPassword, salt, _PWD_ITERATIONS));
  return JSON.stringify({ success: true });
}

function getEmergencyData(password) {
  var verify = _verifyEmergencyPassword(password);
  if (verify.needSetup) return JSON.stringify({ needSetup: true });
  if (!verify.ok) return JSON.stringify({ error: 'סיסמה שגויה' });

  var sheet = _getEmergencySheet();
  var lastRow = sheet.getLastRow();
  var items = [];

  if (lastRow > 1) {
    var data = sheet.getRange(2, 1, lastRow - 1, 5).getValues();
    for (var i = 0; i < data.length; i++) {
      if (!data[i][0]) continue;
      var encoded = data[i][3] || '';
      var decoded = '';
      try { decoded = encoded ? Utilities.newBlob(Utilities.base64Decode(encoded)).getDataAsString('UTF-8') : ''; }
      catch(e) { decoded = String(data[i][3] || ''); }
      items.push({
        id: data[i][0],
        category: data[i][1],
        name: data[i][2],
        value: decoded,
        notes: data[i][4] || ''
      });
    }
  }

  // Group by category
  var byCategory = {};
  items.forEach(function(it) {
    if (!byCategory[it.category]) byCategory[it.category] = [];
    byCategory[it.category].push(it);
  });

  return JSON.stringify({ items: items, byCategory: byCategory, count: items.length });
}

function saveEmergencyItem(password, id, category, name, value, notes) {
  var verify = _verifyEmergencyPassword(password);
  if (!verify.ok) return JSON.stringify({ error: 'סיסמה שגויה' });

  var sheet = _getEmergencySheet();
  var encoded = Utilities.base64Encode(value || '', Utilities.Charset.UTF_8);
  var lastRow = sheet.getLastRow();

  if (id && id !== '') {
    // Update existing
    var data = sheet.getRange(2, 1, lastRow - 1, 5).getValues();
    for (var i = 0; i < data.length; i++) {
      if (String(data[i][0]) === String(id)) {
        sheet.getRange(i + 2, 2, 1, 4).setValues([[category, name, encoded, notes || '']]);
        return JSON.stringify({ success: true, id: id, action: 'updated' });
      }
    }
  }

  // Create new
  var newId = new Date().getTime();
  sheet.appendRow([newId, category, name, encoded, notes || '']);
  return JSON.stringify({ success: true, id: newId, action: 'created' });
}

function deleteEmergencyItem(password, id) {
  var verify = _verifyEmergencyPassword(password);
  if (!verify.ok) return JSON.stringify({ error: 'סיסמה שגויה' });

  var sheet = _getEmergencySheet();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return JSON.stringify({ error: 'אין פריטים למחיקה' });

  var data = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.deleteRow(i + 2);
      return JSON.stringify({ success: true, id: id });
    }
  }
  return JSON.stringify({ error: 'פריט לא נמצא' });
}

// ═══════════════════════════════════════════════════════════════
// 🔔 התראות מחיר — שמירה + בדיקה + שליחה לטלגרם
// ═══════════════════════════════════════════════════════════════

function savePriceAlert(sym, type, price, token) {
  var g = _gate(token); if (g) return g;
  var dw = _requireReal(token); if (dw) return dw; // ✅ v11.7.0.0: דמו = קריאה בלבד
  try {
    var props = PropertiesService.getScriptProperties();
    var alerts = JSON.parse(props.getProperty('PRICE_ALERTS') || '[]');
    // Remove duplicate for same sym+type
    alerts = alerts.filter(function(a){ return !(a.sym === sym && a.type === type); });
    alerts.push({ sym: sym, type: type, price: parseFloat(price) || 0, created: Date.now() });
    props.setProperty('PRICE_ALERTS', JSON.stringify(alerts));
    return JSON.stringify({ success: true });
  } catch(e) {
    return JSON.stringify({ error: e.toString() });
  }
}

function deletePriceAlert(sym, type, token) {
  var g = _gate(token); if (g) return g;
  var dw = _requireReal(token); if (dw) return dw; // ✅ v11.7.0.0: דמו = קריאה בלבד
  try {
    var props = PropertiesService.getScriptProperties();
    var alerts = JSON.parse(props.getProperty('PRICE_ALERTS') || '[]');
    alerts = alerts.filter(function(a){ return !(a.sym === sym && a.type === type); });
    props.setProperty('PRICE_ALERTS', JSON.stringify(alerts));
    return JSON.stringify({ success: true });
  } catch(e) {
    return JSON.stringify({ error: e.toString() });
  }
}

function getPriceAlerts(token) {
  var g = _gate(token); if (g) return g;
  var props = PropertiesService.getScriptProperties();
  return JSON.parse(props.getProperty('PRICE_ALERTS') || '[]');
}

// בודק התראות מחיר — נקרא ע"י trigger יומי (08:00 ו-18:00)
function checkPriceAlerts() {
  try {
    var alerts = getPriceAlerts();
    if (alerts.length === 0) { Logger.log('checkPriceAlerts: אין התראות'); return; }

    // Batch read IBKR prices once
    var ibkrPrices = {};
    var ibkrSheet = SS.getSheetByName('IBKR');
    if (ibkrSheet) {
      var lastRow = ibkrSheet.getLastRow();
      if (lastRow >= 10) {
        var data = ibkrSheet.getRange(10, 1, lastRow - 9, 10).getValues();
        data.forEach(function(row) {
          var sym = String(row[0]).trim().toUpperCase();
          if (sym) ibkrPrices[sym] = { price: parseFloat(row[5]) || 0, currency: '$' };
        });
      }
    }

    // Batch read FAIR prices once
    var fairPrices = {};
    var fairSheet = SS.getSheetByName('FAIR');
    if (fairSheet) {
      var fLastRow = fairSheet.getLastRow();
      if (fLastRow >= 2) {
        var fData = fairSheet.getRange(2, 1, fLastRow - 1, 10).getValues();
        fData.forEach(function(row) {
          var name = String(row[0]).trim();
          if (name) fairPrices[name] = { price: parseFloat(row[4]) || 0, currency: '₪' };
        });
      }
    }

    var triggered = [];

    alerts.forEach(function(a) {
      var lookup = a.sym.toUpperCase();
      var currentPrice = null;
      var currency = '$';

      // ✅ v12.0.0.0: התראת שער דולר/שקל — USDILS כ"נייר" פסאודו
      if (lookup === 'USDILS') {
        currentPrice = getCurrentUSDILS();
        currency = '₪';
      } else if (ibkrPrices[lookup]) {
        currentPrice = ibkrPrices[lookup].price;
        currency = ibkrPrices[lookup].currency;
      } else if (fairPrices[a.sym]) {
        currentPrice = fairPrices[a.sym].price;
        currency = fairPrices[a.sym].currency;
      }

      if (currentPrice === null) return;

      var hit = false;
      var direction = '';
      var detail = '';

      if (a.type === 'above' && currentPrice >= a.price) {
        hit = true;
        direction = 'עלה מעל';
      } else if (a.type === 'below' && currentPrice <= a.price) {
        hit = true;
        direction = 'ירד מתחת';
      } else if (a.type === 'change5' || a.type === 'change10') {
        var threshold = a.type === 'change5' ? 0.05 : 0.10;
        var changeData = lookup === 'USDILS' ? fetchUSDILSDailyChange() : fetchYahooDailyChange(a.sym);
        if (changeData && Math.abs(changeData.changePct) >= threshold) {
          hit = true;
          direction = 'שינוי ' + (threshold * 100) + '% ביום';
          detail = (changeData.changePct > 0 ? '+' : '') + (changeData.changePct * 100).toFixed(2) + '%';
        }
      }

      if (hit) {
        triggered.push({
          sym: a.sym,
          direction: direction,
          current: currentPrice,
          target: a.price,
          currency: currency,
          detail: detail
        });
      }
    });

    if (triggered.length > 0) {
      var msg = '🔔 <b>התראות מחיר הופעלו</b>\n';
      msg += '\u23F0 ' + Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'dd/MM/yyyy HH:mm') + '\n';
      msg += '\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n';
      triggered.forEach(function(t) {
        var emoji = t.direction.indexOf('עלה') >= 0 || (t.detail && t.detail.indexOf('+') >= 0) ? '🟢' : '🔴';
        msg += emoji + ' <b>' + t.sym + '</b> ' + t.direction + ' ' + t.currency + t.target;
        if (t.detail) msg += ' (' + t.detail + ')';
        msg += '\n';
        msg += '   מחיר נוכחי: ' + t.currency + (t.current > 100 ? Math.round(t.current) : t.current.toFixed(2)) + '\n\n';
      });
      sendTelegram(msg);
      Logger.log('✅ נשלחו ' + triggered.length + ' התראות מחיר לטלגרם');

      // Remove triggered one-time alerts (above/below) — keep change alerts
      var remaining = alerts.filter(function(a) {
        var wasTriggered = triggered.some(function(t) { return t.sym === a.sym; });
        return !(wasTriggered && (a.type === 'above' || a.type === 'below'));
      });
      PropertiesService.getScriptProperties().setProperty('PRICE_ALERTS', JSON.stringify(remaining));
    } else {
      Logger.log('✅ אין התראות מחיר שהופעלו');
    }
  } catch(e) {
    Logger.log('שגיאה בcheckPriceAlerts: ' + e);
  }
}

// ── checkCustomAlerts — wrapper לתאימות לאחור, מפנה לcheckPriceAlerts המאוחד ──
function checkCustomAlerts() {
  checkPriceAlerts();
  // גם בודק התראות ישנות מגיליון "התראות מחיר" אם קיים
  try {
    var sheetAlerts = getCustomAlerts();
    if (sheetAlerts.length > 0) {
      checkSheetAlerts(sheetAlerts);
    }
  } catch(e) { Logger.log('checkCustomAlerts sheet check skipped: ' + e); }
}

// ── checkSheetAlerts — בודק התראות ישנות מגיליון ──
function checkSheetAlerts(sheetAlerts) {
  var usdIls = getCurrentUSDILS();
  var triggered = [];
  sheetAlerts.forEach(function(a) {
    if (!a.active) return;
    var currentPrice = fetchYahooPrice(a.symbol);
    if (!currentPrice) return;
    var hit = false;
    if (a.direction === 'מעל' && currentPrice >= a.targetPrice) hit = true;
    if (a.direction === 'מתחת' && currentPrice <= a.targetPrice) hit = true;
    if (hit) {
      triggered.push({ sym: a.symbol, direction: a.direction, current: currentPrice, target: a.targetPrice, note: a.note });
      markAlertTriggered(a.symbol);
    }
  });
  if (triggered.length > 0) {
    var msg = '🔔 <b>התראות מחיר (גיליון)</b>\n';
    msg += Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'dd/MM/yyyy HH:mm') + '\n';
    msg += '\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n';
    triggered.forEach(function(t) {
      var emoji = t.direction === 'מעל' ? '🟢' : '🔴';
      msg += emoji + ' <b>' + t.sym + '</b> ' + t.direction + ' $' + t.target + ' (נוכחי: $' + t.current.toFixed(2) + ')\n';
      if (t.note) msg += '   📝 ' + t.note + '\n';
    });
    sendTelegram(msg);
    Logger.log('✅ נשלחו ' + triggered.length + ' התראות מגיליון');
  }
}

// ═══════════════════════════════════════════════════════════════
// 🔐 מערכת כניסה — PIN + WebAuthn (טביעת אצבע / Face ID)
// ═══════════════════════════════════════════════════════════════

// ── setupLoginPIN — הגדרת קוד כניסה לאתר ──
function setupLoginPIN(pin) {
  if (!pin || pin.length < 4) {
    return JSON.stringify({ error: 'הקוד חייב להיות לפחות 4 תווים' });
  }
  var hash = _hashPassword(pin);
  PropertiesService.getScriptProperties().setProperty('LOGIN_PIN_HASH', hash);
  Logger.log('✅ קוד כניסה הוגדר');
  // ✅ v11: מחזירים סשן אמיתי מיד — הלקוח ממשיך לעבוד בלי להינעל מחוץ לכלום
  var token = Utilities.getUuid();
  _addSession(token);
  return JSON.stringify({ success: true, token: token });
}

// ── verifyLoginPIN — בדיקת קוד כניסה ──
function verifyLoginPIN(pin) {
  var storedHash = PropertiesService.getScriptProperties().getProperty('LOGIN_PIN_HASH');
  if (!storedHash) {
    return JSON.stringify({ needSetup: true });
  }
  // ✅ v11: נעילה אחרי 5 ניסיונות כושלים (5 דקות)
  var cache = CacheService.getScriptCache();
  var fails = parseInt(cache.get('pin_fails') || '0', 10);
  if (fails >= 5) {
    return JSON.stringify({ error: 'נעילה זמנית — נסה שוב בעוד 5 דקות' });
  }
  var inputHash = _hashPassword(pin);
  // ✅ v11.7.0.0: קוד מנהל (נפרד) → סשן אמיתי עם הרשאת דמו
  // ✅ v11.7.0.1: ברירת מחדל = 3010 (מאופה בקוד). DEMO_setupAdminPin עדיין יכול להחליף אותו.
  var adminHash = PropertiesService.getScriptProperties().getProperty('DEMO_ADMIN_PIN_HASH') || 'ff4b467b7a593047c46682ecdbf6da36b3f3bb4b50d35f08f17f751ef5f15531';
  if (adminHash && inputHash === adminHash) {
    cache.remove('pin_fails');
    var tokenA = Utilities.getUuid();
    _addSession(tokenA, { scope: 'real', admin: true });
    return JSON.stringify({ success: true, token: tokenA, admin: true });
  }
  if (inputHash === storedHash) {
    cache.remove('pin_fails');
    // ✅ v11: סשן במפה מרובת-מכשירים
    var token = Utilities.getUuid();
    _addSession(token, { scope: 'real', admin: false });
    return JSON.stringify({ success: true, token: token, admin: false });
  }
  cache.put('pin_fails', String(fails + 1), 300);
  var left = 4 - fails;
  return JSON.stringify({ error: left > 0 ? ('קוד שגוי — נותרו ' + left + ' ניסיונות') : 'קוד שגוי — נעילה ל-5 דקות' });
}

// ── checkLoginSession — בדיקת סשן פעיל ──
function checkLoginSession(token) {
  // ✅ v11: מבוסס מפת סשנים — תומך בכמה מכשירים במקביל
  if (!token) return JSON.stringify({ valid: false });
  var map = _loadSessions();
  if (!map[token]) return JSON.stringify({ valid: false });
  var s = map[token];
  var ts = parseInt(s.t);
  var age = new Date().getTime() - (isNaN(ts) ? 0 : ts);
  if (isNaN(ts) || age > SESSION_TTL_MS) return JSON.stringify({ valid: false, expired: true });
  return JSON.stringify({ valid: true, scope: s.scope || 'real', admin: !!s.admin });
}

// ── registerWebAuthn — שמירת credential ID לטביעת אצבע ──
function registerWebAuthn(credentialIdBase64) {
  if (!credentialIdBase64) return JSON.stringify({ error: 'חסר credential ID' });
  PropertiesService.getScriptProperties().setProperty('WEBAUTHN_CRED_ID', credentialIdBase64);
  Logger.log('✅ WebAuthn credential נשמר');
  return JSON.stringify({ success: true });
}

// ── getWebAuthnCredentialId — שליפת credential ID לאימות ──
function getWebAuthnCredentialId() {
  var credId = PropertiesService.getScriptProperties().getProperty('WEBAUTHN_CRED_ID');
  var hasPin = PropertiesService.getScriptProperties().getProperty('LOGIN_PIN_HASH');
  return JSON.stringify({
    credentialId: credId || null,
    hasPin: !!hasPin,
    needsSetup: !hasPin
  });
}

// ── verifyWebAuthn — אימות WebAuthn assertion (מצד שרת פשוט) ──
function verifyWebAuthn(assertionData) {
  // אנחנו לא מבצעים אימות קריפטוגרפי מלא (GAS לא תומך ב-WebCrypto המלא)
  // אבל בודקים שה-credential ID תואם ושיש assertion חוקי
  var storedCredId = PropertiesService.getScriptProperties().getProperty('WEBAUTHN_CRED_ID');
  if (!storedCredId) return JSON.stringify({ error: 'WebAuthn לא מוגדר' });

  try {
    var parsed = JSON.parse(assertionData);
    if (parsed.credentialId && parsed.credentialId === storedCredId) {
      var token = Utilities.getUuid();
      _addSession(token, { scope: 'real', admin: true }); // המכשיר הרשום לטביעה = מנהל
      return JSON.stringify({ success: true, token: token });
    }
  } catch(e) {
    Logger.log('WebAuthn verify error: ' + e);
  }
  return JSON.stringify({ error: 'אימות נכשל' });
}

// ── isLoginEnabled — בדיקה אם יש הגנת כניסה ──
function isLoginEnabled() {
  var hasPin = PropertiesService.getScriptProperties().getProperty('LOGIN_PIN_HASH');
  return JSON.stringify({ enabled: !!hasPin });
}

// ── removeWebAuthn — מחיקת טביעת אצבע רשומה ──
function removeWebAuthn(token) {
  var g = _gate(token); if (g) return g;
  var dw = _requireReal(token); if (dw) return dw; // ✅ v11.7.0.0: דמו = קריאה בלבד
  PropertiesService.getScriptProperties().deleteProperty('WEBAUTHN_CRED_ID');
  Logger.log('✅ WebAuthn credential נמחק');
  return JSON.stringify({ success: true });
}


// ═══════════════════════════════════════════════════════════════
// ✅ v11 — פונקציות חדשות שהלקוח קרא להן ולא היו קיימות
// (גרמו לשגיאה בטאב שלמות ול"ריק" בדיבידנדים/ספארקליינים)
// ═══════════════════════════════════════════════════════════════

// ── טאב שלמות — הלקוח קורא לה כשנכנסים לטאב ──
function getIntegrityData(token) {
  var g = _gate(token); if (g) return g;
  var issues = runIntegrityCheck();
  return JSON.stringify({ issues: issues, passed: issues.length === 0 });
}

// ── לוח דיבידנדים קרובים — ex-dividend ל-45 יום קדימה ──
function getDividendCalendar(token) {
  var g = _gate(token); if (g) return g;
  try {
    return JSON.stringify({ calendar: getUpcomingExDividends(45), available: true });
  } catch (e) {
    Logger.log('getDividendCalendar שגיאה: ' + e);
    return JSON.stringify({ calendar: [], available: false });
  }
}

// ── ספארקליינים — 30 נקודות סגירה יומיות לכל סימבול IBKR ──
function getSparklineData(token) {
  var g = _gate(token); if (g) return g;
  var out = { sparklines: {} };
  try {
    var sheet = SS.getSheetByName('IBKR');
    var lastRow = sheet.getLastRow();
    var syms = [];
    if (lastRow > 9) {
      sheet.getRange(10, 1, lastRow - 9, 1).getValues().forEach(function(r) {
        var s = String(r[0]).trim().toUpperCase();
        if (s && s !== 'סה"כ') syms.push(s);
      });
    }
    syms.forEach(function(sym) {
      try {
        var text = _yahooFetch('/v8/finance/chart/' + encodeURIComponent(sym) + '?interval=1d&range=1mo');
        if (!text) return;
        var closes = JSON.parse(text).chart.result[0].indicators.quote[0].close
          .filter(function(p) { return p !== null && p !== undefined; });
        if (closes.length >= 2) out.sparklines[sym] = closes.slice(-30);
      } catch (e) {}
      Utilities.sleep(150);
    });
  } catch (e) { Logger.log('getSparklineData שגיאה: ' + e); }
  return JSON.stringify(out);
}

// ═══════════════════════════════════════════════════════════════
// 🔍 FAIR_diagnose — אבחון פער שווי FAIR (גיליון מול האפליקציה)
// הרץ מה-Editor כשיש פער בין השווי באתר FAIR לבין הטאב באפליקציה.
// מדפיס ללוג כל שורה + סימון שורות בעייתיות (שווי חסר / מחיר ישן / פער חישוב).
// ═══════════════════════════════════════════════════════════════
function FAIR_diagnose() {
  // ✅ v11.6.0.8: אבחון מורחב — בודק גם מחיר קנייה (F), רווח (H) ותשואה (I)
  var sheet = SS.getSheetByName('FAIR');
  if (!sheet) { Logger.log('אין גיליון FAIR'); return; }
  var lastRow = sheet.getLastRow();
  var data = sheet.getRange(1, 1, lastRow, 9).getValues();
  var sumSheetVal = 0, sumComputed = 0, problems = 0, avgMissing = 0, plZero = 0;
  Logger.log('══════ אבחון FAIR — ' + lastRow + ' שורות ══════');
  for (var i = 0; i < lastRow; i++) {
    var name = String(data[i][0]).trim();
    if (!name) continue;
    var qty   = parseFloat(data[i][4]) || 0;
    var price = parseFloat(data[i][2]) || 0;
    var avg   = parseFloat(data[i][5]) || 0;
    var valG  = parseFloat(data[i][6]) || 0;
    var plH   = parseFloat(data[i][7]) || 0;
    var pctI  = parseFloat(data[i][8]) || 0;
    // ✅ v11.6.0.9: שורות כותרת/הוראות — לא מוצגות באבחון ולא נספרות כבעייתיות
    if (!(qty > 0) && !(valG > 0)) continue;
    var computed = qty * price;
    var isTotal = (name === 'סה"כ');
    var isCash  = (name === 'מזומן');
    if (!isTotal && !isCash) { sumSheetVal += valG; sumComputed += computed; }
    var flag = '';
    if (!isTotal && !isCash && qty > 0 && price > 0 && Math.abs(valG - computed) > 1) { flag += ' | ⚠️ פער בין שווי בגיליון לכמות×מחיר'; problems++; }
    if (!isTotal && !isCash && valG === 0) { flag += ' | ⚠️ שווי חסר (עמודה G ריקה)'; problems++; }
    if (!isTotal && !isCash && qty > 0 && price === 0) { flag += ' | ⚠️ אין מחיר עדכני — ייתכן ש-fetchTASEPrice נכשל'; problems++; }
    if (!isTotal && !isCash && qty > 0 && avg === 0) { flag += ' | ⚠️ חסר מחיר קנייה ממוצע (עמודה F) — התשואה תוצג כ-0'; avgMissing++; }
    if (!isTotal && !isCash && qty > 0 && avg > 0 && plH === 0) { flag += ' | ⚠️ מחיר קנייה קיים אבל רווח (H) = 0 — הרץ refreshFAIRPricesFromTASE'; plZero++; }
    Logger.log('שורה ' + (i + 1) + ' | ' + name + ' | כמות: ' + qty + ' | מחיר: ' + price + ' | קנייה ממוצע: ' + avg + ' | שווי: ' + Math.round(valG) + ' | רווח H: ' + Math.round(plH) + ' | תשואה I: ' + (pctI * 100).toFixed(1) + '%' + flag);
  }
  Logger.log('──────────────────────────────');
  Logger.log('סה"כ לפי עמודת השווי בגיליון (ללא מזומן): ₪' + Math.round(sumSheetVal));
  Logger.log('סה"כ מחושב כמות×מחיר (ללא מזומן): ₪' + Math.round(sumComputed));
  Logger.log('פער פנימי: ₪' + Math.round(sumSheetVal - sumComputed) + ' | שורות בעייתיות: ' + problems);
  if (avgMissing > 0) Logger.log('⚠️ ' + avgMissing + ' ניירות בלי מחיר קנייה בעמודה F — עד שלא יוזן, התשואה שלהם תהיה 0 בכל הטאבים. אפשר להשלים מהאתר של FAIR (מחיר קנייה/עלות ממוצעת לכל קרן).');
  if (plZero > 0) Logger.log('⚠️ ' + plZero + ' ניירות עם מחיר קנייה אבל בלי רווח מחושב — הרץ refreshFAIRPricesFromTASE והם יתמלאו אוטומטית.');
  Logger.log('💡 השווה את השורות מול האתר של FAIR — שים לב שמחירי Sponser מגיעים באגורות ומחולקים ב-100');
}
