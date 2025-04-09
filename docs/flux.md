# Diagramme de flux fonctionnel – Jeu Barcade Boissons

```mermaid
flowchart TD
  A[👥 Joueur entre dans l'interface] --> B[🎮 Joue à un mini-jeu]
  B --> C[🍹 Choisit une boisson]
  C --> D[📡 L'app Next.js prépare la requête POST]
  D --> E[🔌 Envoie vers Arduino R4 via IP (Wi-Fi)]
  E --> F[🧠 Arduino analyse la requête / recette]
  F --> G[⚙️ Pompe(s) distribuent la boisson]
  G --> H[📨 Arduino répond à l'app (JSON)]
  H --> I[✅ Affiche succès ou erreur à l'utilisateur]
```
