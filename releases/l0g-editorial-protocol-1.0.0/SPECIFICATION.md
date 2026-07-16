# Spécification normative

Les mots **DOIT**, **NE DOIT PAS**, **DEVRAIT** et **PEUT** expriment les niveaux
d'obligation de cette release.

## 1. Objet

Le protocole encadre la publication d'une analyse l0g afin que ses affirmations
puissent être retrouvées, datées, contestées et corrigées. Il distingue la
conformité documentaire de la vérité économique. Un paquet techniquement valide
peut encore contenir une source obsolète ou une interprétation discutable.

## 2. Exigences essentielles

### EP-001 Source avant récit

Une affirmation factuelle critique DOIT pointer vers au moins une source
identifiable. Une source primaire, réglementaire, légale ou statistique DOIT
être préférée lorsqu'elle existe. Une synthèse secondaire NE DOIT PAS être
présentée comme le document d'origine.

### EP-002 Vérification datée

Chaque preuve DOIT indiquer sa date de consultation. La date de publication de
la source DOIT être fournie lorsqu'elle est connue. Une série révisable, un
snapshot ou une donnée de marché DEVRAIT préciser sa fenêtre d'observation.

### EP-003 Typage des affirmations

Chaque claim structurée DOIT utiliser un des types stables suivants:

- `fact`: fait directement vérifiable;
- `estimate`: valeur calculée ou estimation attribuée;
- `inference`: conclusion analytique tirée de faits;
- `scenario`: état futur ou conditionnel.

Une estimation, une inférence ou un scénario NE DOIT PAS être formulé comme un
fait observé.

### EP-004 Localisateur exact

Une preuve directe DOIT fournir un localisateur utilisable, par exemple une
section, une question, un tableau, une série, une page, un accession number ou
un calcul. Le seul nom d'une institution NE DOIT PAS être qualifié de preuve
directe.

### EP-005 Lien claim vers preuve

Chaque claim DOIT référencer au moins une entrée du paquet de preuves. Chaque
identifiant référencé DOIT exister. Une claim de type `fact` DOIT posséder au
moins une preuve `direct-proof` ou `reproduction`.

### EP-006 Limites explicites

L'article et le paquet de preuves DOIVENT exposer leurs limites utiles:
couverture, retard, révision, donnée manquante, hypothèse ou impossibilité de
conclure. Une limite connue NE DOIT PAS être reléguée à une formulation qui
inverse le niveau de certitude du texte.

### EP-007 Attribution et licence

L'article, ses données et son paquet de preuves DOIVENT indiquer la licence
`CC-BY-4.0`. Le code de test et les schémas sont sous `MIT`. Les contenus tiers
restent soumis aux droits de leurs titulaires.

### EP-008 Correction

Une correction qui change un chiffre, une date, une attribution, une méthode,
une limite ou une conclusion DOIT être datée et rendue visible. Une simple
correction typographique PEUT rester dans l'historique Git.

### EP-009 Intégrité de release

Une distribution stable DOIT porter un numéro SemVer, un statut, une date et un
fichier `SHA256SUMS`. Les tests de conformité DOIVENT échouer si un schéma, une
référence croisée, une licence ou une empreinte ne correspond plus.

## 3. Profondeur de preuve

- `mention`: autorité nommée, non probante;
- `reference`: document identifiable;
- `linked-source`: document accessible par URL;
- `direct-proof`: relation précise entre claim, source et localisateur;
- `reproduction`: donnée ou calcul rejouable.

Seuls `direct-proof` et `reproduction` satisfont EP-005 pour une claim `fact`.

## 4. Conformité

Une implémentation est `conformant-1.0` si:

1. `article.json` valide `schemas/article.schema.json`;
2. le paquet valide `schemas/evidence-pack.schema.json`;
3. les identifiants claim et preuve convergent;
4. le Markdown contient des sections Sources et Limites;
5. les licences et empreintes sont présentes et valides;
6. `node tests/conformance.mjs` termine avec le code `0`.

La conformité NE DOIT PAS être décrite comme un audit factuel indépendant.
