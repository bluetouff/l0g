import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("publie les conditions Watch sans ouvrir la vente prématurément", async () => {
  const [terms, privacy, footer] = await Promise.all([
    readFile(new URL("src/pages/cgv.astro", root), "utf8"),
    readFile(new URL("src/pages/rgpd.astro", root), "utf8"),
    readFile(new URL("src/components/SiteFooter.astro", root), "utf8"),
  ]);

  assert.match(
    terms,
    /data-l0gwatch-commercial-terms=\{commercialReady \? 'ready-v1' : 'blocked-v1'\}/,
  );
  assert.match(terms, /const consumerMediatorContractActive = true/);
  assert.match(terms, /const salesActivationApproved = false/);
  assert.match(
    terms,
    /const commercialReady = consumerMediatorContractActive && salesActivationApproved/,
  );
  assert.match(terms, /Abonnements non disponibles/);
  assert.doesNotMatch(
    terms,
    /mentions signalées|coordonnées contractuelles complètes|L’ouverture reste bloquée/,
  );
  assert.match(terms, /12 €/);
  assert.match(terms, /120 €/);
  assert.match(terms, /TVA non applicable, article 293 B du CGI/);
  assert.match(terms, /5 rue de Volaille, 28000 Chartres, France/);
  assert.match(terms, /Quatorze jours pour changer d’avis/);
  assert.match(terms, /remboursement intégral/);
  assert.match(terms, /Modèle de formulaire de rétractation/);
  assert.match(terms, /article L215-1-1/);
  assert.match(terms, /articles L224-25-12/);
  assert.match(terms, /médiateur de la consommation/);
  assert.match(terms, /Centre de la Médiation de la Consommation des Conciliateurs de/);
  assert.match(terms, /Justice \(CM2C\), 49 rue de Ponthieu, 75008 Paris/);
  assert.match(terms, /litiges@cm2c\.net/);
  assert.match(terms, /01 89 47 00 14/);
  assert.match(terms, /https:\/\/www\.cm2c\.net\/declarer-un-litige\.php/);
  assert.match(terms, /https:\/\/watch\.l0g\.fr\/conditions/);
  assert.doesNotMatch(terms, /Buttondown/i);
  assert.doesNotMatch(terms, /—/);

  assert.match(privacy, /Contribution volontaire via Stripe/);
  assert.match(privacy, /https:\/\/watch\.l0g\.fr\/confidentialite/);
  assert.match(privacy, /href="\/cgv\/"/);
  assert.doesNotMatch(privacy, /Buttondown/i);

  assert.match(footer, /\['\/cgv\/', 'Conditions Watch', 'proof'\]/);
});
