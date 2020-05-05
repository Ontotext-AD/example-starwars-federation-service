const { ApolloServer, gql } = require("apollo-server-express");
const { buildFederatedSchema } = require("@apollo/federation");
const express = require('express');

const path = '/graphql';
const app = express();

// GraphDb Repository
const {RDFRepositoryClient} = require('graphdb').repository;
const {GetQueryPayload, QueryType, QueryLanguage, UpdateQueryPayload} = require('graphdb').query;
const {RepositoryClientConfig} = require('graphdb').repository;
const {RDFMimeType} = require('graphdb').http;
const serverAddress = 'http://graphdb:7200';
const restApiConfig = new RepositoryClientConfig(
  [`${serverAddress}/repositories/soaas`], {
    'Accept': RDFMimeType.SPARQL_RESULTS_XML
  },
  '', 10000, 10000);
let rdfClient = new RDFRepositoryClient(restApiConfig);  
// -- GraphDb end

const typeDefs = gql`

  scalar Integer

  extend type Planet @key(fields: "id") {
    id: ID! @external
    diameter: Integer @external
    mass: Int
    calculatedGravity: String @requires(fields: "diameter")
  }

  input Integer_Where {
    AND: [Integer_Where!]
    OR: [Integer_Where!]
    EQ: Integer
    NEQ: Integer
    LT: Integer
    LTE: Integer
    GT: Integer
    GTE: Integer
    IN: [Integer!]
    NIN: [Integer!]
  }

  extend type Human @key(fields: "id") {
    id: ID! @external
    similar: [ID]
  }  
`

function readStream(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => {
      chunks.push(chunk);
    });
    stream.on('error', reject);
    stream.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf8').trim());
    });
  });
}

const resolvers = {
  Planet: {
    __resolveReference(reference) {
      return {
        ...reference,
        ...planetList.find(planet => planet.id === reference.id)
      };
    },
    calculatedGravity(reference) {
      console.log('Planet @key/id [' + reference.id + '] diameter [' + reference.diameter + ']');
      let planet = planetList.find(planet => planet.id === reference.id);
      console.log('Found planet its mass is [' + planet.mass + ']');
      // Clearly the wrong calc, its just to show calculated extension
      let gravity = reference.diameter * planet.mass * 100;
      console.log('Calculated gravity [' + this.gravity + ']');
      return gravity
    }
  },
  Human: {
    similar(reference) {
      console.log('Human @key/id [' + reference.id + ']');
      let query = `
        PREFIX :<http://www.ontotext.com/graphdb/similarity/>
        PREFIX inst:<http://www.ontotext.com/graphdb/similarity/instance/>
        PREFIX pubo: <http://ontology.ontotext.com/publishing#>
        PREFIX voc: <https://swapi.co/vocabulary/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        SELECT ?documentID ?name ?score 
        {
          BIND (<${reference.id}> as ?query)
            ?search a inst:embeddings ;
                :searchDocumentID ?query;
                :searchParameters "";
                :documentResult ?result .
            ?result :value ?documentID ;
                    :score ?score.
            ?documentID a voc:Human ;
                        rdfs:label ?name.
        }` 
      const payload = new GetQueryPayload()
        .setQuery(query)
        .setQueryType(QueryType.SELECT)
        .setResponseType(RDFMimeType.SPARQL_RESULTS_JSON)
        .setLimit(100); 
      let ids = rdfClient.query(payload).then((resp) => {
          return readStream(resp);
      }).then((stream) => {
        let jsonResult = JSON.parse(stream) 
        let ids = []
        for (i = 0; i < jsonResult.results.bindings.length; ++i) {
          ids.push((jsonResult.results.bindings[i].documentID.value))
        }
        return ids     
      });
      console.log(`Ids [${ids}]`) 
      return ids  
    }
  }
};

app.get('/__gtg', function (req, res){
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ gtg: "OK", message: "OK" }));
});

app.get('/__health', function (req, res){
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
        status: "OK",
        id: `example/1`,
        name: 'Example Health Check',
        type: 'graphql',
        healthChecks: []
      })
  )
});

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ]),
  context: params => () => {
    console.log(params.req.body.query);
    console.log(params.req.body.variables);
    console.log(params.req.headers);
  }
});

server.applyMiddleware({app: app, path: path});

app.listen({ port: 4006 }, () => {
  console.log(`🚀 Server ready at http://localhost:4006${server.graphqlPath}`);
});

const planetList = [
  {
    id: "https://swapi.co/resource/planet/25",
    mass: 120
  },
  {
    id: "https://swapi.co/resource/planet/13",
    mass: 130
  },
  {
    id: "https://swapi.co/resource/planet/15",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/16",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/17",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/19",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/20",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/21",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/26",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/27",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/3",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/30",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/32",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/36",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/4",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/42",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/46",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/52",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/53",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/61",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/22",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/23",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/24",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/29",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/31",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/33",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/34",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/35",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/38",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/39",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/40",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/41",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/43",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/44",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/45",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/47",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/48",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/49",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/50",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/54",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/55",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/56",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/57",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/58",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/59",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/6",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/60",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/11",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/12",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/18",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/37",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/5",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/51",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/7",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/14",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/10",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/2",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/9",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/28",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/1",
    mass: 130
 },
  {
    id: "https://swapi.co/resource/planet/8",
    mass: 130
 }
];
