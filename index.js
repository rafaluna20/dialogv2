const express = require('express');
const app = express();
const { WebhookClient } = require('dialogflow-fulfillment');
const { Express } = require('actions-on-google/dist/framework/express');
const axios = require('axios');



app.get('/', function (req, res) {
  res.send('Hello World')
})


app.post('/webhook', express.json(), function (req, res) {


  const agent = new WebhookClient({ request: req, response: res });
  console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(req.body));

  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }

  function fallback(agent) {

    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }


  function probandowebhook(agent) {
    agent.add(`desde  backen node js en la rafa`);

  }

  function crearTramite(agent) {
    agent.add(`deseas crear tramite 1`);

  }



  async function consultarTramite(agent) {
    let numero01 = agent.parameters["consulta"];

    let respuesta = await axios.get("https://erp.connasa.com/api/index.php/products/?DOLAPIKEY=4pJ0J6N80vxlIzGtd4xM9VbwDAZy6J78")
    let tramites = respuesta.data;
    console.log(tramites);

    if (tramites.length > 0) {
      let tramite = tramites[0];
      agent.add("nombre:" + tramite.label );
      agent.add("*condigo:*" + tramite.id );
      agent.add("*condigo:*" + tramite.stock_reel );

    } else {

      agent.add(" la fecha no existe");
    }

  }






  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);

  intentMap.set('probandowebhook', probandowebhook);

  intentMap.set('crearTramite', crearTramite);
  intentMap.set('consultarTramite', consultarTramite);



  agent.handleRequest(intentMap);

})





app.listen(3000, () => {
  console.log("esamos escuchando en puerto 3000");
})
