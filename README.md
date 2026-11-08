# Le Petit Déj de Myra — version Vercel + Supabase

Cette version conserve la base visuelle fournie et étend l'espace client et l'administration connectée à Supabase.

## Contenu

- `index.html` : boutique, panier, authentification, profil client, adresses, notifications et espace d'administration.
- `manifest.json` : manifeste PWA.
- `vercel.json` : en-têtes HTTP de sécurité et règles de cache pour Vercel.
- `_headers` : ancien fichier conservé pour compatibilité avec un éventuel retour sur Netlify ; Vercel utilise `vercel.json`.
- `supabase/migrations/README.md` : historique des changements appliqués au projet distant.

## Profil client

- Photo de profil (JPG, PNG ou WEBP, 3 Mo maximum) stockée dans le bucket privé par dossier utilisateur `avatars` (lecture publique pour afficher les avatars).
- Modification du nom complet, du téléphone et de l'adresse e-mail (confirmation Supabase si l'e-mail change).
- Changement du mot de passe depuis une session authentifiée.
- Création, modification, suppression et sélection d'une adresse par défaut.
- Limite de quatre adresses par compte, imposée côté base de données.
- Consultation et marquage comme lues des notifications personnelles.

## Administration

Le rôle `admin` ouvre les modules suivants :

- Comptes : créer, consulter, modifier nom/téléphone/e-mail/rôle/mot de passe, suspendre/réactiver et supprimer les comptes. Les rôles disponibles sont `customer`, `employee`, `driver` et `admin`.
- Commandes : consulter les commandes, changer le statut, les frais de livraison et le statut du paiement. L'annulation est conservée comme statut afin de préserver l'historique comptable.
- Catégories : CRUD.
- Catalogue produits : CRUD.
- Formats et tarifs produits : CRUD.
- Promotions : CRUD.
- Codes promotionnels : CRUD.
- Annonces : CRUD, avec génération de notifications internes immédiates pour l'audience ciblée quand l'annonce est active au moment de sa création.
- Livraisons : CRUD et affectation d'un compte livreur.
- Factures : CRUD et impression d'une facture depuis la commande liée.

Les opérations Auth privilégiées (gestion des comptes) passent par la fonction Edge `admin-user-management`, qui vérifie le JWT du demandeur et son rôle `admin` avant d'utiliser les privilèges serveur. La clé `service_role` n'est jamais exposée dans le navigateur.

## Projet Supabase

- Référence : `wsyvoggpnfztmtmgyxxr`
- Région : `eu-west-3`
- Clé utilisée côté navigateur : clé publishable uniquement.
- Les prix du panier sont recalculés côté base lors de la commande.

## Déploiement Vercel

Le projet est une application web statique (HTML/CSS/JavaScript) : aucun serveur Node ni commande de build n'est nécessaire.

1. Importer le dossier du projet dans un dépôt GitHub, ou téléverser le projet avec Vercel CLI.
2. Dans Vercel, créer un projet et sélectionner ce dépôt.
3. Laisser le framework sur **Other** (ou détection statique), ne définir aucune commande de build et utiliser `.` comme répertoire de sortie si Vercel le demande.
4. Vérifier que `index.html`, `manifest.json`, `vercel.json` et le dossier `img/` sont à la racine du projet.
5. Déployer.

### Configuration Supabase après le déploiement

Dans **Supabase → Authentication → URL Configuration**, remplacer/compléter les URL autorisées avec le domaine Vercel attribué au projet :
- `Site URL` : l'URL de production Vercel (ou le domaine personnalisé une fois relié).
- `Redirect URLs` : ajouter l'URL de production et, si nécessaire, les URL de prévisualisation utilisées pour tester la connexion et la confirmation d'e-mail.

Ne pas supprimer les URL existantes tant que l'ancien site est encore utilisé. Les clés Supabase côté navigateur doivent rester des clés publishable/anon ; ne jamais placer une clé `service_role` dans `index.html`.

Le fichier `_headers` n'est pas utilisé par Vercel ; les en-têtes sont définis dans `vercel.json`.

## Points qui nécessitent encore une configuration métier

- Les paiements MTN MoMo et Airtel Money sont enregistrés comme paiements en attente. L'encaissement automatique exige les identifiants marchands/API des opérateurs.
- Le bouton WhatsApp ouvre une conversation préremplie. L'envoi automatique serveur-à-serveur nécessite WhatsApp Business Platform, un numéro/Phone Number ID, un jeton Meta et des modèles approuvés.
- Les e-mails de confirmation et de réinitialisation dépendent de la configuration SMTP et des URL de redirection dans Supabase Auth.
- Les annonces planifiées ne déclenchent pas encore un envoi différé à l'heure future : le fan-out des notifications est immédiat lors de la création d'une annonce déjà active.
- La suppression d'un compte peut être refusée par les contraintes d'intégrité si des commandes historiques lui sont rattachées. Dans ce cas, suspendre le compte est préférable pour conserver les données comptables.
- La protection Supabase contre les mots de passe compromis reste à activer dans les paramètres Auth.

## Règles de livraison

Livraisons quotidiennes de 07h00 à 09h30. Précommandes pour le lendemain avant 14h30 ; après cette heure, la date proposée est décalée au surlendemain. Les frais de livraison sont confirmés par l'administration.

## Responsive layout update
- Mobile: compact app layout is preserved.
- Tablet (640–1023 px): full-width layout, wider content, two-column product listing and expanded admin navigation.
- Desktop (1024 px and above): full-height application with a persistent left navigation rail, centered wide content, multi-column product/admin layouts, and desktop-friendly dialogs.
- The Netlify badge is controlled by the Netlify plan; this package does not attempt to remove or hide it.

## Documents légaux
- Une rubrique « Confidentialité & CGU » est intégrée à la navigation de l'application.
- Elle présente la politique de confidentialité, les principes de protection des données (loi congolaise n° 29-2019 et RGPD lorsque celui-ci est applicable) et les conditions générales d'utilisation/commande.
- Ces textes sont une base d'information à faire valider juridiquement. L'exploitant doit notamment compléter/valider son identité légale, les durées de conservation, les formalités auprès de l'autorité compétente et les garanties relatives aux transferts internationaux.
