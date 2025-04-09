# Diagramme de flux fonctionnel

```mermaid
flowchart TD
  A[👥 Joueurs entrent dans l'interface] --> B[🍹 Choisissent un cocktail]
  B --> C[🎮 Choisissent un jeu]
  C --> D[🕹️ Jouent au jeu]
  D --> E[📡 Une fois terminé, l'app Next.js prépare la requête POST]
  E --> F[🔌 Envoie vers Arduino R4 via IP]
  F --> G[🧠 Arduino analyse la requête / recette]
  G --> H[⚙️ Pompes distribuent la boisson]
  H --> I[📨 Arduino répond à l'app]
  I --> J[✅ Affiche succès ou erreur à l'utilisateur]
