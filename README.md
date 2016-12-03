# 2048 Bot
Questo progetto nasce con l'obiettivo di supportare il Club degli Sviluppatori Puglia
nell'evento del 17 dicembre 2016.

L'obiettivo è quello di realizzare un algoritmo in grado di giocare a [2048](http://gabrielecirulli.github.io/2048/)
e massimizzare il punteggio finale.

# Architettura

```
+--------+       Grid state        +--------+
|        +------------------------->        |
| Client |                         | Server |
| (Bot)  |                         |        |
|        <-------------------------+        |
+--------+        Next Move        +--------+
```

Il Bot è realizzato come estensione di Google Chrome.

In ogni ciclo di gioco effettua 3 operazioni:

1. invia lo stato del gioco al server in formato JSON
(es. `[[0,0,2,8],[0,2,16,2],[0,4,2,4],[0,0,8,2]]`);

2. il server invia al client la successiva mossa come numero intero compreso tra 0 e 3
(`UP=0, RIGHT=1, DOWN=2, LEFT=3`);

3. il client bot esegue la mossa ricevuta dal server. 

# Velocità del bot
Normalmente ogni ciclo di gioco dura 1 secondo, tuttavia è possibile modificarne la durata tramite
la variabile `interval` presente nel file `config.js` del progetto client.

# Installazione client
* scaricare il progetto Client Bot
* aprire Google Chrome alla URL `chrome://extensions/`
* abilitare la `modalità sviluppatore`
* cliccare su `Carica estensione non pacchettizata...`
* selezionare la cartella in cui si è scaricato il Client Bot
* accedere alla pagina [http://gabrielecirulli.github.io/2048/](http://gabrielecirulli.github.io/2048/) 

# Interfaccia di comunicazione
Il client bot, per funzionare correttamente, necessita che ci sia un server in ascolto all'indirizzo http://localhost:3000.
In particolare tale server dele implementare una API con verbo `POST` e risorsa `/next-move`;

> Nota: 
Al fine di supportare il CORS (Cross-Origin Resource Sharing) è necessario che il server abiliti 2 particolari header nella risposta:
> 1. `Access-Control-Allow-Origin` -> `http://gabrielecirulli.github.io`;
>
> 2. `Access-Control-Allow-Headers` -> `Content-Type`.

# Esempio di server in node.js (express.js)
```js
const express = require('express');
const app = express();
const bodyParser = require('body-parser')

app.use(bodyParser.json()); // to support JSON-encoded bodies

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://gabrielecirulli.github.io');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.post('/next-move', function (req, res) {
    console.log(req.body); // Print the grid 
    res.end('1'); // Right Move
});

app.listen(3000, function () {
    console.log('The 2048 server listening on port 3000!');
});
```

# Esempio di server in php (slim)
```php
<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require 'vendor/autoload.php';

$app = new \Slim\App;

$app->add(function ($req, $res, $next) {
    $response = $next($req, $res);
    return $response
            ->withHeader('Access-Control-Allow-Origin', 'http://gabrielecirulli.github.io')
            ->withHeader('Access-Control-Allow-Headers', 'Content-Type');
});

$app->post('/next-move', function (Request $request, Response $response) {
    $grid = $request->getBody(); // Get the grid
    $response->getBody()->write("1"); // Right Move

    return $response;
});
$app->run();
``` 