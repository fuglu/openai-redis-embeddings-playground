import { Configuration, OpenAIApi } from "openai";

import { SchemaFieldTypes, VectorAlgorithms, createClient } from "redis";

const INDEX = "search";

function float32Buffer(arr: any) {
  return Buffer.from(new Float32Array(arr).buffer);
}

async function getRedisClient() {
  const client = createClient();

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  return client;
}

async function createIndex(client: any) {
  console.log("Dropping index");
  await client.ft.dropIndex(INDEX).catch(() => {
    console.log("Index does not exist");
  });

  console.log("Creating index");
  await client.ft.create(
    INDEX,
    {
      "$.embeddings[*]": {
        AS: "embeddings",
        type: SchemaFieldTypes.VECTOR,
        ALGORITHM: VectorAlgorithms.FLAT,
        TYPE: "FLOAT32",
        DIM: 1536,
        DISTANCE_METRIC: "COSINE",
      },
      "$.text": {
        AS: "text",
        type: SchemaFieldTypes.TEXT,
      },
    },
    {
      ON: "JSON",
    }
  );
}

async function getEmbeddings(input: string[]) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const { data } = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input,
  });

  return data.data.map((d) => d.embedding);
}

async function search(client: any, searchEmbeddings: number[][]) {
  const blob = float32Buffer(searchEmbeddings[0]);
  console.log("Searching data", blob);
  const value = await client.ft.search(
    INDEX,
    "*=>[KNN 4 @embeddings $blob AS dist]",
    {
      PARAMS: {
        blob,
      },
      SORTBY: "dist",
      DIALECT: 2,
      RETURN: ["text", "dist"],
    }
  );
  return value;
}

async function indexData(client: any, text: string) {
  const embeddings = await getEmbeddings([text]);

  console.log("Inserting data");
  await client.json.set(text, "$", { text, embeddings });
}

async function run() {
  const client = await getRedisClient();

  await createIndex(client);

  await indexData(client, "Ben ist ein geiler Typescript Hacker");
  await indexData(
    client,
    "Tamer kann gut Python und ist allgemein ein geiler Typ"
  );
  await indexData(client, "Felix ist schon raus aber kann auch Typescript.");
  await indexData(
    client,
    "Peter kann alles. Typescript, Python und ein geiler Typ sein."
  );

  const searchText = "Typescript";
  const searchEmbeddings = await getEmbeddings([searchText]);

  const result = await search(client, searchEmbeddings);
  console.log(JSON.stringify(result));

  await client.disconnect();
}

run();
