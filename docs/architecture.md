# Architecture CareBox

```text
Pages / UI → Services applicatifs → Device adapter → transport HTTP REST → ESP32/passerelle
                         ↘ stockage local (démo) / Firebase (futur)
```

- `core/config.js`: identifiants, URL, durée de péremption et navigation.
- `core/eventBus.js`: notification des vues après changement de modèle.
- `services/`: domaine, alertes et état appareil; rend les états indisponibles explicites.
- `adapters/SimulationAdapter`: source de données démonstration interchangeable.
- `adapters/ESP32Adapter`: client REST à délai limité; aucune lecture de broche depuis l’UI.
- `adapters/FirebaseAdapter`: seam non configuré, sans faux service.
- `data/storage.js`: données de démonstration persistées dans LocalStorage.
- `router.js` et `app.js`: navigation hash et rendu accessible/sécurisé (texte dynamique échappé).

Pour production, déplacer les opérations privilégiées vers un backend/gateway et ajouter authentification, validation de schéma, autorisations, observabilité et stratégie de synchronisation. Le stockage local n’est pas une base partagée ni une sauvegarde fiable.
