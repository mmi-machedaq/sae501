# Diagramme d'Architecture Système

```mermaid
graph TD
  subgraph Utilisateurs
    Player1((Joueur 1))
    Player2((Joueur 2))
  end

  subgraph Frontend [Interface de jeu - Next.js (XJS)]
    UI[UI Jeu / Sélection de boisson]
  end

  subgraph Backend [Serveur Next.js]
    API[API / Logic métier]
  end

  subgraph Arduino [Arduino R4 (Serveur Wi-Fi)]
    R1[/Route: /test/]
    R2[/Route: /drink/]
    Pumps[Contrôle Pompes + Capteurs]
  end

  Player1 --> UI
  Player2 --> UI
  UI --> API
  API -->|POST recette + ID boisson| R2
  R2 --> Pumps
  Pumps -->|Succès / erreur (JSON)| API
  API --> UI


```
