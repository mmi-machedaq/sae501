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

1. Récupérer l’IP de l’Arduino via le serial port
2. Le mettre dans le fichier .env
3. Brancher l'alimentation principale et l'alimentation de l'arduino
4. Lancer le serveur : yarn start:dev
