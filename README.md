### Chickpeas back

## Prérequis
* Docker
* Nodejs
* NPM

## ENV
* copiez le fichier .env.dist en .env
* changez les valeurs des variables selon vos préférences

## Commande pour lancer le back
```bash
npm i
npm run docker
```

## URL des différentes services
Apollo server : localhost:3002
MailDev : localhost:1025

## Les Tests
```bash
npm run test
```

## Connexion à la base de données
protocole : standard (TCP/IP)
hostname : 127.0.0.1 
port : 3307
username : root
voir aussi le fichier index.ts

## Utilisation de l'application sur Apollo
signup + aller sur mailDev pour valider la création de l'utilisateur
signin
addStatus
addProject
addTask
addAsset
addComment
addNotification