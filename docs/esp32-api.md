# Contrat HTTP attendu (à implémenter)

Origine configurable dans Appareil. Réponses JSON en UTF-8, horodatages ISO-8601 UTC. L’ESP32 doit renvoyer état **unknown/offline** plutôt que normal quand la lecture manque. HTTPS ou réseau privé recommandé; authentification et CORS restrictif obligatoires avant production. Client web avec timeout de 8 s.

## Routes

- `GET /api/device/status` → `{ "deviceId":"CAREBOX-001", "online":true, "lastSeen":"2026-11-08T12:00:00Z", "firmware":"0.1.0" }`
- `GET /api/sensors` → `{ "deviceId":"CAREBOX-001", "timestamp":"2026-11-08T12:00:00Z", "sensors": { ... } }`
- `GET /api/alerts` → liste des alertes actives structurées.
- `POST /api/events` → accepter un événement validé, répondre `201` et son identifiant.
- `POST /api/device/heartbeat` → présence, version firmware et diagnostics; répondre `204` ou JSON.

Payload de lecture versionnable :

```json
{
  "deviceId": "CAREBOX-001",
  "timestamp": "2026-11-08T12:00:00Z",
  "sensors": {
    "temperature": {"value": 22, "unit": "C", "status": "normal"},
    "smoke": {"detected": false, "status": "normal"},
    "door": {"open": false, "status": "normal"},
    "movement": {"detected": true, "status": "normal"},
    "fall": {"detected": false, "status": "normal", "module": "vendor/model"},
    "sos": {"pressed": false, "status": "normal"}
  }
}
```

Ajouter `schemaVersion`, unités, identité capteur, séquence monotone et diagnostics qualité avant figer le firmware. Horloge invalide, valeur hors plage, timestamp trop ancien ou identifiant inconnu doivent donner erreur/inconnu, jamais « normal ». Aucun endpoint de commande d’actionneur n’est implémenté côté client pour le moment. MQTT est une option future derrière la même interface d’adaptateur, pas une connexion UI→capteur.
