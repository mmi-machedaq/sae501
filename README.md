# SAE501 - [Nom du projet]

## Pre-requisites

- Node.js >= 18

## Install the dependencies

```bash
yarn install
```

## Start developing

```bash
yarn start:dev
```

## Build for production

```bash
yarn run start:prod
```

## Steps to start the whole engine

1. Connecter le serveur et l'Arduino au même réseau (partage de connexion). Éditer le fichier /arduino/secrets.h si besoin.
2. Récupérer l’IP de l’Arduino via le Serial Port
3. Le mettre dans le fichier .env
4. Brancher l'alimentation principale et l'alimentation de l'arduino
5. Lancer le serveur : yarn start:dev ou yarn build puis yarn start:prod
