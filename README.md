### Wallet Balance Tracker

POC

`To ensure wallet balance never goes below zero irrespective of the traffic coming in for a particular user.`

To run this app

`1. docker-compose build`

`2. docker-compose up`

`3. docker-compose run node npx sequelize-cli db:migrate`

##### URLs

GET

1. To create 3k unique wallet records
`http://localhost:5000/wallets/create-bulk`

POST

2. Will deduct money from wallet randomly between 1 to 5(Unit)
`http://localhost:5000/wallets/{id} // id is integer here`


Note: database credentials are hardcoded in sequelize config file, so if you are deploying using containerization then either modify app to use env variables or set the same db credentials in your db server.
