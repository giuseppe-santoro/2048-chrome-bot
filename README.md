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

#Esempio di server in Java (Jersey)

Installare il boilerplate di jersey con il comando:

`mvn archetype:generate -DarchetypeArtifactId=jersey-quickstart-grizzly2 \
-DarchetypeGroupId=org.glassfish.jersey.archetypes -DinteractiveMode=false \
-DgroupId=com.example -DartifactId=simple-service -Dpackage=com.example \
-DarchetypeVersion=2.25`

Poi per compilare, eseguire `mvn install` e per avviare il server eseguire `mvn exec:java`

[Qui maggiori info su Jersey](https://jersey.java.net/documentation/latest/getting-started.html)

Di sequito i file di progetto.

Pom.xml
```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>simple-service</artifactId>
    <packaging>jar</packaging>
    <version>1.0-SNAPSHOT</version>
    <name>simple-service</name>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.glassfish.jersey</groupId>
                <artifactId>jersey-bom</artifactId>
                <version>${jersey.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <dependencies>
        <dependency>
            <groupId>org.glassfish.jersey.containers</groupId>
            <artifactId>jersey-container-grizzly2-http</artifactId>
        </dependency>
        <!-- uncomment this to get JSON support:
         <dependency>
            <groupId>org.glassfish.jersey.media</groupId>
            <artifactId>jersey-media-moxy</artifactId>
        </dependency>
        -->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.9</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.glassfish.jersey.media</groupId>
            <artifactId>jersey-media-json-jackson</artifactId>
            <version>2.17</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>2.5.1</version>
                <inherited>true</inherited>
                <configuration>
                    <source>1.7</source>
                    <target>1.7</target>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>exec-maven-plugin</artifactId>
                <version>1.2.1</version>
                <executions>
                    <execution>
                        <goals>
                            <goal>java</goal>
                        </goals>
                    </execution>
                </executions>
                <configuration>
                    <mainClass>com.example.Main</mainClass>
                </configuration>
            </plugin>
        </plugins>
    </build>

    <properties>
        <jersey.version>2.25</jersey.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>
</project>
```

Main.java
```java
package com.example;

import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.glassfish.jersey.server.ResourceConfig;

import java.io.IOException;
import java.net.URI;

/**
 * Main class.
 *
 */
public class Main {
    // Base URI the Grizzly HTTP server will listen on
    public static final String BASE_URI = "http://localhost:3000";

    /**
     * Starts Grizzly HTTP server exposing JAX-RS resources defined in this application.
     * @return Grizzly HTTP server.
     */
    public static HttpServer startServer() {
        // create a resource config that scans for JAX-RS resources and providers
        // in com.example package
        final ResourceConfig rc = new ResourceConfig().packages("com.example");

        rc.register(new CrossDomainFilter());

        // create and start a new instance of grizzly http server
        // exposing the Jersey application at BASE_URI
        return GrizzlyHttpServerFactory.createHttpServer(URI.create(BASE_URI), rc);
    }

    /**
     * Main method.
     * @param args
     * @throws IOException
     */
    public static void main(String[] args) throws IOException {
        final HttpServer server = startServer();
        System.out.println(String.format("Jersey app started with WADL available at "
                + "%sapplication.wadl\nHit enter to stop it...", BASE_URI));
        System.in.read();
        server.stop();
    }
}
```

CrossDomainFilter.java
```java
package com.example;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;

public class CrossDomainFilter implements ContainerResponseFilter {

    @Override
    public void filter(ContainerRequestContext creq, ContainerResponseContext cres) {
        cres.getHeaders().add("Access-Control-Allow-Origin", "http://gabrielecirulli.github.io");
        cres.getHeaders().add("Access-Control-Allow-Headers", "Content-Type");
    }
  }
```

MyResourse.java
```java
package com.example;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

/**
 * Root resource (exposed at "myresource" path)
 */
@Path("/")
public class MyResource {

    /**
     * Method handling HTTP GET requests. The returned object will be sent
     * to the client as "text/plain" media type.
     *
     * @return String that will be returned as a text/plain response.
     */
    @POST
    @Path("/next-move")
    @Produces("application/json")
    @Consumes("application/json")
    public Integer nextMove(final Integer[][] input) {
        return 1;
    }
}
```
