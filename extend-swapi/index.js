const { ApolloServer, gql } = require("apollo-server-express");
const { buildFederatedSchema } = require("@apollo/federation");
const { GraphQLInteger } = require("ontotext-platform-custom-scalars");
const express = require('express');

const path = '/graphql';
const app = express();

const typeDefs = gql`

  scalar Integer

  interface Character @key(fields: "id") {
      id: ID
  }
  type Aleena @key(fields: "id") {
      id: ID
  }
  type Besalisk @key(fields: "id") {
      id: ID
  }
  type Cerean @key(fields: "id") {
      id: ID
  }
  type Chagrian @key(fields: "id") {
      id: ID
  }
  type Clawdite @key(fields: "id") {
      id: ID
  }
  type Droid @key(fields: "id") {
      id: ID
  }
  type Dug @key(fields: "id") {
      id: ID
  }
  type Ewok @key(fields: "id") {
      id: ID
  }
  type Geonosian @key(fields: "id") {
      id: ID
  }
  type Human @key(fields: "id") {
      id: ID
  }
  type Hutt @key(fields: "id") {
      id: ID
  }
  type Iktotchi @key(fields: "id") {
      id: ID
  }
  type Kaleesh @key(fields: "id") {
      id: ID
  }
  type Kaminoan @key(fields: "id") {
      id: ID
  }
  type Keldor @key(fields: "id") {
      id: ID
  }
  type Mirialan @key(fields: "id") {
      id: ID
  }
  type Moncalamari @key(fields: "id") {
      id: ID
  }
  type Gungan @key(fields: "id") {
      id: ID
  }
  type Muun @key(fields: "id") {
      id: ID
  }
  type Nautolan @key(fields: "id") {
      id: ID
  }
  type Neimodian @key(fields: "id") {
      id: ID
  }
  type Pauan @key(fields: "id") {
      id: ID
  }
  type Quermian @key(fields: "id") {
      id: ID
  }
  type Rodian @key(fields: "id") {
      id: ID
  }
  type Skakoan @key(fields: "id") {
      id: ID
  }
  type Sullustan @key(fields: "id") {
      id: ID
  }
  type Tholothian @key(fields: "id") {
      id: ID
  }
  type Togruta @key(fields: "id") {
      id: ID
  }
  type Toong @key(fields: "id") {
      id: ID
  }
  type Toydarian @key(fields: "id") {
      id: ID
  }
  type Trandoshan @key(fields: "id") {
      id: ID
  }
  type Twilek @key(fields: "id") {
      id: ID
  }
  type Umbaran @key(fields: "id") {
      id: ID
  }
  type Vulptereen @key(fields: "id") {
      id: ID
  }
  type Wookiee @key(fields: "id") {
      id: ID
  }
  type Xexto @key(fields: "id") {
      id: ID
  }
  type Yodasspecies @key(fields: "id") {
      id: ID
  }
  type Zabrak @key(fields: "id") {
      id: ID
  }
  
  extend type Planet @key(fields: "id") {
    id: ID @external
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
`

const resolvers = {
  Integer: GraphQLInteger,
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
        id: `9500`,
        name: 'SWAPI SOAAS Extension Health Check',
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
  console.log(`🚀 Server ready at http://swapiextended:4006${server.graphqlPath}`);
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
