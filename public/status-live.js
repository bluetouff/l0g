/* Contrôle les artefacts réellement servis. Toutes les valeurs distantes
   sont rendues avec textContent uniquement. */
(function () {
  var updated = document.getElementById('status-live-updated');
  if (!updated) return;

  function formatDate(value) {
    if (!value) return 'date absente';
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'date invalide';
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Paris',
    }).format(date);
  }

  function durationMs(value) {
    var match = String(value || '').match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?$/);
    if (!match) return null;
    return (Number(match[1] || 0) * 24 * 60 + Number(match[2] || 0) * 60 + Number(match[3] || 0)) * 60_000;
  }

  function ageMs(value) {
    var date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : Math.max(0, Date.now() - date.getTime());
  }

  function ageLabel(milliseconds) {
    if (milliseconds == null) return 'âge inconnu';
    var minutes = Math.floor(milliseconds / 60_000);
    if (minutes < 90) return minutes + ' min';
    var hours = Math.floor(minutes / 60);
    if (hours < 48) return hours + ' h';
    return Math.floor(hours / 24) + ' j';
  }

  function stale(value, staleAfter) {
    var age = ageMs(value);
    var limit = durationMs(staleAfter);
    return age != null && limit != null && age > limit;
  }

  function card(name, value, detail, tone) {
    var element = document.querySelector('[data-live-card="' + name + '"]');
    if (!element) return;
    element.classList.remove('pending', 'ok', 'warn', 'fail');
    element.classList.add(tone);
    var valueElement = element.querySelector('[data-live-value]');
    var detailElement = element.querySelector('[data-live-detail]');
    if (valueElement) valueElement.textContent = value;
    if (detailElement) detailElement.textContent = detail;
  }

  function indices(payload) {
    if (Array.isArray(payload && payload.indices)) return payload.indices;
    if (payload && payload.indices && typeof payload.indices === 'object') {
      return Object.keys(payload.indices).map(function (key) {
        return Object.assign({ key: key }, payload.indices[key]);
      });
    }
    return [];
  }

  function getJson(path) {
    var separator = path.indexOf('?') === -1 ? '?' : '&';
    return fetch(path + separator + 'status=' + Date.now(), {
      cache: 'no-store', headers: { Accept: 'application/json' },
    }).then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    });
  }

  var riskPromise = getJson('/api/v1/risk.json').then(function (risk) {
    var rows = indices(risk);
    var expected = Number(risk && risk.summary && risk.summary.expected) || 5;
    var present = rows.length;
    var fallback = Number(risk && risk.summary && risk.summary.fallback) || 0;
    var staleCount = Number(risk && risk.summary && risk.summary.stale) || 0;
    var snapshot = risk.snapshot || risk.generated || risk.updated;
    var snapshotOld = stale(snapshot, risk.staleAfter || 'PT30M');
    var riskTone = present !== expected || snapshotOld || risk.status === 'failed'
      ? 'fail' : risk.status === 'ok' ? 'ok' : 'warn';
    card(
      'risk', present + ' / ' + expected + ' indices',
      'snapshot ' + formatDate(snapshot) + ' · âge ' + ageLabel(ageMs(snapshot)) +
        ' · seuil ' + (risk.staleAfter || 'PT30M') + ' · statut ' + (risk.status || 'inconnu') +
        ' · replis ' + fallback + ' · stale ' + staleCount,
      riskTone
    );

    var euro = rows.find(function (row) { return row.key === 'eu'; });
    if (!euro) {
      card('eu', 'absent', 'Le signal Euro manque dans la réponse publique.', 'fail');
    } else {
      var euroDate = euro.sourcePublishedAt || euro.sourceUpdatedAt;
      var euroOld = euro.timelinessStatus === 'stale' || stale(euroDate, euro.staleAfter);
      var euroHealthy = euro.sourceStatus === 'ok' && euro.qualityStatus === 'nominal' && !euroOld;
      var euroTone = euro.sourceStatus === 'fallback' || euroOld ? 'fail' : euroHealthy ? 'ok' : 'warn';
      var euroDetail = (euro.sourceStatus || 'source inconnue') + ' / ' +
        (euro.qualityStatus || 'qualité inconnue') + ' · source ' + formatDate(euroDate) +
        ' · âge ' + ageLabel(ageMs(euroDate)) + ' · seuil ' + (euro.staleAfter || 'absent') +
        ' · dernier succès ' + formatDate(euro.lastSuccessAt);
      if (euro.fallbackReason) euroDetail += ' · ' + euro.fallbackReason;
      card('eu', euro.value == null ? 'valeur absente' : euro.value + ' / 100', euroDetail, euroTone);
    }

    var energy = rows.find(function (row) { return row.key === 'energie'; });
    if (!energy) {
      card('energy', 'absent', 'Le signal Énergie manque dans la réponse publique.', 'fail');
    } else {
      var dates = energy.componentDates || {};
      var oilDates = [dates.brent, dates.wti].filter(Boolean);
      var oldestOilAge = oilDates.length === 2 ? Math.max.apply(null, oilDates.map(ageMs)) : null;
      var oilTone = oilDates.length !== 2 || oldestOilAge > 10 * 86_400_000
        ? 'fail' : oldestOilAge > 5 * 86_400_000 || energy.qualityStatus === 'official-delayed' ? 'warn' : 'ok';
      card(
        'energy', oilDates.length === 2 ? 'Brent/WTI ' + ageLabel(oldestOilAge) : 'dates incomplètes',
        'Brent ' + (dates.brent || 'absent') + ' · WTI ' + (dates.wti || 'absent') +
          ' · alerte 5 j · échec 10 j · ' + (energy.qualityStatus || 'qualité inconnue'),
        oilTone
      );
    }
  }).catch(function (error) {
    card('risk', 'indisponible', 'Lecture de /api/v1/risk.json impossible : ' + error.message, 'fail');
    card('eu', 'non contrôlé', 'Le signal Euro dépend du contrat Risk API.', 'fail');
    card('energy', 'non contrôlé', 'Le signal Énergie dépend du contrat Risk API.', 'fail');
  });

  var confluencePromise = getJson('/confluence.json').then(function (data) {
    if (String(data && data.version) !== '2' || !Array.isArray(data.items) ||
        !data.lastAttemptAt || Number.isNaN(Date.parse(data.lastAttemptAt))) {
      throw new Error('contrat v2 daté absent ou invalide');
    }
    var count = Array.isArray(data.items) ? data.items.length : 0;
    var freshness = data.freshness || {};
    var fallback = data.sourceStatus === 'fallback' || data.fallbackUsed === true;
    var old = data.timelinessStatus === 'stale' || stale(data.lastSuccessAt, data.staleAfter);
    var partial = data.provenanceStatus !== 'verified' || freshness.edgarRefreshVerified !== true;
    var tone = fallback || old || count === 0 ? 'fail' : partial ? 'warn' : 'ok';
    var detail = 'récupération l0g ' + formatDate(data.retrievedAt || data.updated) +
      ' · âge ' + ageLabel(ageMs(data.lastSuccessAt)) + ' · seuil ' + (data.staleAfter || 'absent');
    if (freshness.institutionalReportDate) detail += ' · 13F au ' + freshness.institutionalReportDate;
    if (freshness.upstreamServedFromCache === true) detail += ' · amont en cache';
    if (freshness.edgarRefreshVerified !== true) detail += ' · fraîcheur EDGAR non attestée';
    if (data.fallbackReason) detail += ' · ' + data.fallbackReason;
    card('confluence', count + ' ligne' + (count > 1 ? 's' : ''), detail, tone);
  }).catch(function (error) {
    card('confluence', 'indisponible', 'Lecture de /confluence.json impossible : ' + error.message, 'fail');
  });

  var corpusPromise = getJson('/api/v1/freshness.json').then(function (data) {
    var corpus = data.corpus || {};
    var frArticles = Number(corpus.articlesByLanguage && corpus.articlesByLanguage.fr);
    var frGuides = Number(corpus.guidesByLanguage && corpus.guidesByLanguage.fr);
    var generated = data.generated;
    var old = stale(generated, data.staleAfter || 'P2D');
    var valid = Number.isFinite(frArticles) && Number.isFinite(frGuides);
    card(
      'corpus', valid ? frArticles + ' articles FR' : 'compteurs absents',
      (valid ? frGuides + ' guides FR' : 'freshness.json incomplet') +
        ' · manifeste ' + formatDate(generated) + ' · âge ' + ageLabel(ageMs(generated)) +
        ' · seuil ' + (data.staleAfter || 'P2D'),
      !valid || old ? 'fail' : 'ok'
    );
  }).catch(function (error) {
    card('corpus', 'indisponible', 'Lecture de /api/v1/freshness.json impossible : ' + error.message, 'fail');
  });

  Promise.allSettled([riskPromise, confluencePromise, corpusPromise]).then(function () {
    updated.textContent = 'Contrôle côté lecteur terminé le ' + formatDate(new Date().toISOString()) +
      '. Les seuils et âges affichés proviennent des contrats publics.';
  });
})();
