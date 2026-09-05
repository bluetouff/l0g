# `crypto.l0g.fr`, blocage d’indexation isolé

Le cohort GSC contient 18 URL de l’ancien sous-domaine `crypto.l0g.fr` :

- 12 explorées et non indexées, principalement des feeds WordPress ;
- 5 en 404, sur des catégories, un feed et l’ancien chemin `/mag7/` ;
- la racine, classée en double sans canonical utilisateur.

Le 4 septembre 2026, une requête HTTPS vérifiée vers la racine échoue avant
toute réponse HTTP : le certificat présenté ne couvre pas `crypto.l0g.fr`
(`curl` code 60, nom d’hôte absent du certificat). Une redirection applicative
ne peut donc pas régler seule la situation, car le client doit d’abord achever
la négociation TLS.

Le dépôt principal ne contient ni vhost, ni politique de migration, ni certificat
pour ce sous-domaine. Les 18 décisions restent donc `inconnue` plutôt que de
fabriquer une équivalence éditoriale. Deux issues sûres existent :

1. retirer définitivement le DNS si le sous-domaine doit disparaître ;
2. installer un certificat valide et un vhost de migration, puis définir 301 ou
   410 chemin par chemin.

Cette décision d’infrastructure ne doit pas être confondue avec les corrections
du vhost principal `l0g.fr`.
