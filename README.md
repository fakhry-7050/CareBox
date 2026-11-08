# CareBox

CareBox est une interface web responsive de supervision à domicile, avec simulateur intégré et architecture d’adaptateurs destinée à une future passerelle ESP32. **Toutes les valeurs de départ sont des données de démonstration.** Ce logiciel ne constitue pas un dispositif médical, un service d’urgence certifié, ni un système de notification familiale.

## Lancement

Un serveur HTTP local est requis pour les modules JavaScript et le service worker (ne pas ouvrir directement `index.html` en `file://`). Avec Node.js 18+ :

```sh
npm start
```

Puis ouvrir `http://localhost:8000`. Python peut aussi servir les fichiers avec `python -m http.server 8000`. Une installation PWA peut être proposée par un navigateur compatible sur localhost ou HTTPS. Le cache hors ligne est opportuniste et doit être initialisé une première fois en ligne. Les polices Google sont facultatives et peuvent ne pas être disponibles hors ligne.

## Utiliser la démonstration

Ouvrir **Suivi en direct** : régler 15–60 °C, activer fumée, ouvrir la porte, choisir activité/inactivité, simuler chute ou SOS, couper le Wi-Fi ou déconnecter l’appareil. Le tableau de bord, les capteurs, les alertes et l’historique se mettent à jour ensemble. La réinitialisation efface les données enregistrées par la démo. Les alertes peuvent être prises en compte/résolues et l’historique exporté en CSV. Les notifications navigateur sont facultatives et restent locales.

Les capteurs dont les données sont absentes, périmées ou dont l’appareil est hors ligne sont signalés inconnus/hors ligne, jamais normaux. Le module de chute est distinct du PIR : une détection PIR ne confirme pas une chute.

## Architecture

`UI → services (DeviceManager, SensorManager, AlertManager, NotificationManager) → adaptateur → communication`. `SimulationAdapter` est le comportement de démo. `ESP32Adapter` définit le client REST avec délai de requête; l’API embarquée n’existe pas encore. `FirebaseAdapter` est une interface non configurée. Les données de démo, lectures, contacts et préférences sont dans `localStorage` (`carebox.data.v1`). Le choix de l’adaptateur est enregistré dans `carebox.adapter`.

## Futur ESP32

1. Implémenter les routes et le schéma de `docs/esp32-api.md` sur l’ESP32 ou, de préférence, sur une passerelle sécurisée.
2. Faire valider le modèle de capteurs, les seuils, l’horloge et les états de panne sur le matériel réel.
3. Servir le frontend et l’API en HTTPS ou dans un réseau local de confiance; ajouter authentification, autorisations, protection contre rejeu et CORS restrictif (aucun secret dans le navigateur).
4. Dans **Appareil**, configurer l’URL et choisir ESP32 REST seulement après disponibilité de l’API. À ce stade, la lecture d’état nécessite `/api/device/status`; les commandes d’actionneurs ne sont volontairement pas activées.
5. Tester panne, données périmées, reprise réseau, firmware et alertes de bout en bout avant tout usage de sécurité. MQTT peut être ajouté derrière un adaptateur, sans accès direct aux capteurs depuis l’interface.

## Firebase

Aucun identifiant Firebase n’est requis ni inclus. Créer un projet, configurer Auth/Firestore/FCM avec règles minimales et contrôle serveur, puis remplacer l’interface de `js/adapters/firebaseAdapter.js` par l’intégration officielle (chargée explicitement) et faire transiter les notifications sensibles via un backend de confiance. FCM et les contacts enregistrés ne sont pas opérationnels dans cette démo. Ne jamais intégrer de clé privée ou secret serveur au client.

## Android / iOS

La PWA n’est pas une application native publiée sur les stores. Cette structure web peut servir de base à Capacitor : ajouter Capacitor dans un projet séparé, définir les plateformes Android/iOS, configurer icônes/permissions, vérifier la persistance et remplacer les dépendances aux APIs web non prises en charge, puis tester les builds sur appareils réels. Les notifications natives requièrent une configuration et un backend réels.

## Limites

Démo mono-navigateur, stockage local sans synchronisation, connexion ESP32 non vérifiée et lecture limitée au contrat REST, pas d’authentification réelle, FCM/Firestore non configurés, pas d’appel ni notification de secours. Ne pas utiliser comme unique moyen de protection.

Voir `docs/` pour le contrat REST, les modèles et la feuille de route.
