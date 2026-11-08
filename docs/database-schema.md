# Modèle de données proposé

| Entité | Champs principaux |
|---|---|
| Users | id, familyId, email, role, authProviderId |
| Families | id, name, memberIds, preferences |
| Devices | id, familyId, adapter, firmware, online, lastSeen |
| Sensors | id, deviceId, type, name, status, config, lastUpdated |
| SensorReadings | id, sensorId, timestamp, value, unit, quality |
| Alerts | id, deviceId, category, severity, timestamp, description, status |
| Events | id, deviceId, category, timestamp, payload |
| Notifications | id, userId, alertId, channel, status, timestamp |
| DeviceConfigurations | deviceId, thresholds, heartbeat, version |

La démo stocke les formes compactées dans LocalStorage; ce n’est ni une implémentation multi-utilisateur ni un stockage médical. Une base distante doit contrôler l’accès par famille/utilisateur et conserver les événements avec règles explicites de rétention.
