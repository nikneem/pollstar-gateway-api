var express = require('express');
var router = express.Router();
const axios = require('axios').default;
const serviceName = process.env.ORDER_SERVICE_NAME || 'pollstar-users-api';
const daprPort = process.env.DAPR_HTTP_PORT || 80;

//use dapr http proxy (header) to call orders service with normal /order route URL in axios.get call
const daprSidecar = `http://localhost:${daprPort}`

/* GET order by calling order microservice via dapr */
router.get('/', async function(req, res, next) {
    const targetUrl = `${daprSidecar}/api/users`;
  console.log(`Service invoke to: ${targetUrl}`);
  var data = await axios.get(targetUrl, {
    headers: {'dapr-app-id': `${serviceName}`} //sets app name for service discovery
  });
  
  res.setHeader('Content-Type', 'application/json');
  res.send(`${JSON.stringify(data.data)}`);
});

/* POST create order by calling order microservice via dapr */
router.post('/', async function(req, res, next) {
  try{
    var order = req.body;
    order['location'] = 'Seattle';
    order['priority'] = 'Standard';
    console.log('Service invoke POST to: ' + `${daprSidecar}/order?id=${req.query.id}` + ', with data: ' +  JSON.stringify(order));
    var data = await axios.post(`${daprSidecar}/order?id=${req.query.id}`, order, {
      headers: {'dapr-app-id': `${serviceName}`} //sets app name for service discovery
    });
  
    res.send(`<p>Order created!</p><br/><code>${JSON.stringify(data.data)}</code>`);
  }
  catch(err){
    res.send(`<p>Error creating order<br/>Order microservice or dapr may not be running.<br/></p><br/><code>${err}</code>`);
  }
});

/* DELETE order by calling order microservice via dapr */
router.post('/delete', async function(req, res ) {
   
  var data = await axios.delete(`${daprSidecar}/order?id=${req.body.id}`, {
    headers: {'dapr-app-id': `${serviceName}`}
  });
  
  res.setHeader('Content-Type', 'application/json');
  res.send(`${JSON.stringify(data.data)}`);
});

module.exports = router;