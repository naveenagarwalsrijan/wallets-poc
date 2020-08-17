var express = require('express');
var router = express.Router();

var db = require('../models');
const { uuid } = require('uuidv4');

var count = 0;

/* GET users listing. */
router.post('/:id', async function(req, res, next) {

  // mimic charges for api call upto 5 rupees
  charges = (Math.random() * 5 + 1).toFixed(2);

  // mimic user_token as id of the table
  id = parseInt(req.params.id, 10);

  // don't use the command as is in production it can cause sql injection
  query = `
    UPDATE Wallets
    SET spent = spent + ${charges}, balance= (total - spent)
    WHERE id = ${id} AND total >= (spent + ${charges});
    `;
  await db.sequelize.query(query)
    .then((r) => { /** do something on success */ })
    .catch((e) => { /**  do something on error */ });

  res.json({success : true});
  res.end();

});


router.get('/create-bulk', async function(req, res, next) {
  arr = []
  time = '2020-08-14 16:30:50';
  for(i=0; i < 3000; i++)  {
    topUp = (Math.random() * 100 + 50).toFixed(2);
    arr.push(`('${uuid()}', ${topUp}, 0.00, ${topUp}, '${time}', '${time}')`);
  }
  await db.sequelize.query(`INSERT INTO Wallets (user_token, total, spent, balance, createdAT, updatedAt) VALUES ${arr.join(', ')}`).catch((e) => {
    console.log(e);
  });
  res.json('3k users created;');
});

module.exports = router;
