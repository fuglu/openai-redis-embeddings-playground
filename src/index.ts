import { Configuration, OpenAIApi } from "openai";
import { SchemaFieldTypes, VectorAlgorithms, createClient } from "redis";

const INDEX = "search";
const CUSTOMER_ID = "123456789";
const TEXTS = [
  "Heute Morgen bin ich früh aufgestanden und habe einen Spaziergang im Park gemacht.",
  "Meine Katze hat gestern eine Maus gefangen und ich war beeindruckt von ihrer Jagdfähigkeit.",
  "Gestern habe ich einen alten Freund aus der Uni getroffen und es war schön, ihn wiederzusehen.",
  "Ich habe gestern Abend eine neue Serie angefangen und konnte nicht aufhören zu schauen.",
  "Der Himmel war gestern Abend voller Sterne und ich konnte nicht aufhören, ihn anzuschauen.",
  "Heute Mittag treffe ich mich mit meiner Familie zum Mittagessen in einem neuen Restaurant.",
  "Ich habe gestern einen neuen Job angenommen und freue mich auf die neuen Herausforderungen.",
  "Die Blumen im Garten meiner Nachbarin sind dieses Jahr besonders schön und ich bewundere sie oft.",
  "Ich habe gestern Abend eine lange E-Mail an einen alten Freund geschrieben und es hat sich gut angefühlt.",
  "Heute Abend gehe ich zu einer Geburtstagsfeier und freue mich auf die Feier.",
  "Ich habe gestern Abend einen Film gesehen, der mich wirklich zum Nachdenken gebracht hat.",
  "Heute Morgen habe ich eine Yoga-Stunde genommen und es hat mir geholfen, mich zu entspannen.",
  "Meine Schwester hat gestern ein Baby bekommen und ich bin so aufgeregt, ihn kennenzulernen.",
  "Ich habe gestern Abend ein neues Restaurant ausprobiert und das Essen war fantastisch.",
  "Heute Abend werde ich zu Hause bleiben und ein Buch lesen, das ich schon lange lesen wollte.",
  "Ich habe gestern eine alte Freundin aus der Schule getroffen und wir haben den ganzen Tag über alte Zeiten gesprochen.",
  "Ich habe gestern Abend einen langen Spaziergang gemacht und die Natur genossen.",
  "Heute Morgen habe ich einen leckeren Smoothie zum Frühstück gemacht und mich gesund gefühlt.",
  "Gestern Abend habe ich mit meinem Partner ein neues Kartenspiel gespielt und es hat uns viel Spaß gemacht.",
  "Ich habe gestern den ganzen Tag im Garten verbracht und mich um meine Pflanzen gekümmert.",
  "Heute Abend gehe ich zu einem Konzert meiner Lieblingsband und ich kann es kaum erwarten.",
  "Ich habe gestern Abend eine neue TV-Serie entdeckt und bin süchtig danach geworden.",
  "Ich habe gestern den ganzen Tag gebacken und viele leckere Kekse gemacht.",
  "Heute Morgen habe ich einen alten Freund angerufen und wir haben uns lange unterhalten.",
  "Ich habe gestern Abend eine neue Sportart ausprobiert und es hat mir viel Spaß gemacht.",
  "Heute Abend gehe ich ins Kino und freue mich auf den neuen Film.",
  "Ich habe gestern den ganzen Tag im Park verbracht und mich gesonnt.",
  "Ich habe gestern Abend eine neue Sprache angefangen zu lernen und es ist herausfordernd, aber auch aufregend.",
  "Heute Morgen habe ich einen langen Spaziergang in den Bergen gemacht und mich erfrischt gefühlt.",
  "Heute Abend gehe ich auf eine Vernissage und freue mich darauf, neue Kunstwerke zu entdecken.",
  "Ich habe gestern den ganzen Tag gelesen und konnte nicht aufhören, das Buch aus der Hand zu legen.",
  "Ich habe gestern Abend einen neuen Cocktail ausprobiert und er war unglaublich lecker.",
  "Heute Morgen habe ich meine Wohnung aufgeräumt und mich produktiv gefühlt.",
  "Ich habe gestern den ganzen Tag im Museum verbracht und viele interessante Dinge gelernt.",
  "Ich habe gestern Abend ein neues Musikinstrument angefangen zu lernen und es ist herausfordernd, aber auch erfüllend.",
  "Heute Abend treffe ich mich mit Freunden in einer Bar und freue mich darauf, ein paar Drinks zu genießen.",
  "Ich habe gestern den ganzen Tag in der Küche verbracht und ein großes Abendessen zubereitet.",
  "Ich habe gestern Abend einen langen Spaziergang am Strand gemacht und den Sonnenuntergang genossen.",
  "Heute Morgen habe ich eine neue Joggingstrecke ausprobiert und es war eine schöne Abwechslung.",
  "Ich habe gestern den ganzen Tag im Zoo verbracht und viele Tiere gesehen.",
  "Ich habe gestern Abend einen neuen Podcast entdeckt und konnte nicht aufhören zuzuhören.",
  "Heute Abend gehe ich auf eine Comedy-Show und freue mich darauf, zu lachen.",
  "Ich habe gestern den ganzen Tag mit meiner Familie verbracht und wir haben viel Zeit miteinander verbracht.",
  "Ich habe gestern Abend einen neuen Cocktailkurs besucht und viele neue Rezepte gelernt.",
  "Heute Morgen habe ich einen Spaziergang im Wald gemacht und die Ruhe genossen.",
  "Ich habe gestern den ganzen Tag im Freizeitpark verbracht und viele Achterbahnen gefahren.",
  "Ich habe gestern Abend eine neue Fernsehserie entdeckt und konnte nicht aufhören zu schauen.",
  "Heute Abend treffe ich mich mit meinen Kollegen auf einen Drink und freue mich darauf, sie besser kennenzulernen.",
  "Ich habe gestern den ganzen Tag am Strand verbracht und viele Muscheln gesammelt.",
  "Ich habe gestern Abend ein neues Buch angefangen zu lesen und es hat mich von Anfang an gefesselt.",
  "Heute Morgen habe ich eine neue Kaffeemischung ausprobiert und sie hat mir sehr gut geschmeckt.",
  "Ich habe gestern den ganzen Tag im Fitnessstudio verbracht und viele neue Übungen gelernt.",
  "Ich habe gestern Abend einen neuen Theaterkurs besucht und viel über Schauspielerei gelernt.",
  "Heute Abend gehe ich auf eine Lesung meines Lieblingsautors und freue mich darauf, ihn zu treffen.",
  "Ich habe gestern den ganzen Tag in einem Spa verbracht und mich entspannt.",
  "Ich habe gestern Abend einen neuen Tanzkurs besucht und es hat mir viel Spaß gemacht.",
  "Heute Morgen habe ich eine neue Schreibübung ausprobiert und mich kreativ gefühlt.",
  "Ich habe gestern den ganzen Tag mit meinem Hund im Park verbracht und wir haben uns beide amüsiert.",
  "Ich habe gestern Abend einen neuen Wein ausprobiert und er war unglaublich lecker.",
  "Heute Abend treffe ich mich mit Freunden zum Spieleabend und freue mich auf eine gute Zeit.",
  "Ich habe gestern den ganzen Tag auf dem Bauernmarkt verbracht und frisches Obst und Gemüse gekauft.",
  "Ich habe gestern Abend eine neue Sportart ausprobiert und es hat mir viel Spaß gemacht.",
  "Heute Morgen habe ich eine neue Podcast-Episode gehört und sie hat mir viele neue Ideen gegeben.",
  "Ich habe gestern den ganzen Tag im Museum für moderne Kunst verbracht und viele faszinierende Kunstwerke gesehen.",
  "Ich habe gestern Abend ein neues Brettspiel entdeckt und es hat mir und meinen Freunden viel Spaß gemacht.",
  "Heute Abend gehe ich zu einer Lesung über Nachhaltigkeit und freue mich darauf, mehr über dieses Thema zu erfahren.",
  "Ich habe gestern den ganzen Tag in einem Vergnügungspark verbracht und viele Achterbahnen und Attraktionen ausprobiert.",
  "Ich habe gestern Abend eine neue Diät ausprobiert und mich gesünder gefühlt.",
  "Heute Morgen habe ich eine neue Rezeptkarte ausprobiert und es hat mich motiviert, mehr zu kochen.",
  "Ich habe gestern den ganzen Tag mit meinem Partner am Strand verbracht und wir haben uns einfach entspannt.",
  "Ich habe gestern Abend einen neuen Online-Kurs entdeckt und bin begeistert von den vielen Lernmöglichkeiten.",
  "Heute Abend treffe ich mich mit meiner Familie und wir spielen gemeinsam ein Gesellschaftsspiel.",
  "Ich habe gestern den ganzen Tag in einem Themenpark verbracht und mich in eine andere Welt versetzt gefühlt.",
  "Ich habe gestern Abend ein neues Lied entdeckt und konnte nicht aufhören, es zu hören.",
  "Heute Morgen habe ich einen neuen Blog entdeckt und viele interessante Artikel gelesen.",
  "Ich habe gestern den ganzen Tag in der Natur verbracht und viele Tiere beobachtet.",
  "Ich habe gestern Abend einen neuen Kochkurs besucht und viele neue Gerichte gelernt.",
  "Heute Abend gehe ich zu einem Poetry-Slam und freue mich darauf, den Talenten zuzuhören.",
  "Ich habe gestern den ganzen Tag in einem Schwimmbad verbracht und mich im Wasser entspannt.",
  "Ich habe gestern Abend eine neue Netflix-Serie entdeckt und konnte nicht aufhören, sie zu schauen.",
  "Heute Morgen habe ich einen langen Spaziergang durch die Stadt gemacht und neue Plätze entdeckt.",
  "Ich habe gestern den ganzen Tag in einer Bibliothek verbracht und viele interessante Bücher gefunden.",
  "Ich habe gestern Abend ein neues Restaurant besucht und das Essen war einfach köstlich.",
  "Heute Abend treffe ich mich mit Freunden zum Bowling und freue mich auf eine gute Zeit.",
  "Ich habe gestern den ganzen Tag in einem Skatepark verbracht und neue Tricks gelernt.",
];

const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));

function float32Buffer(arr: any) {
  return Buffer.from(new Float32Array(arr).buffer);
}

async function connectRedisClient() {
  await client.connect();
}

async function flushAll() {
  await client.flushAll();
}

async function createIndex() {
  console.log("Dropping old index", INDEX);
  await client.ft.dropIndex(INDEX).catch(() => {
    console.log("Old index does not exist");
  });

  console.log("Creating index", INDEX);
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
      "$.customerId": {
        AS: "customerId",
        type: SchemaFieldTypes.TEXT,
      },
      "$.text": {
        AS: "text",
        type: SchemaFieldTypes.TEXT,
      },
      "$.createdAt": {
        AS: "createdAt",
        type: SchemaFieldTypes.NUMERIC,
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

async function search(searchEmbeddings: number[][]) {
  const blob = float32Buffer(searchEmbeddings[0]);
  console.log("Searching data", blob);
  const value = await client.ft.search(
    INDEX,
    `@customerId:${CUSTOMER_ID}=>[KNN 3 @embeddings $blob AS score]`,
    // `(@createdAt:[1681825620507 1681825620509] @customerId:${CUSTOMER_ID})=>[KNN 3 @embeddings $blob AS score]`,
    {
      PARAMS: {
        blob,
      },
      SORTBY: "score",
      DIALECT: 2,
      RETURN: ["createdAt", "text", "score"],
    }
  );
  return value;
}

async function indexData(text: string) {
  const key = (Math.random() + 1).toString(36).substring(7);
  const embeddings = await getEmbeddings([text]);

  console.log("Inserting data", key, text);
  await client.json.set(key, "$", {
    customerId: CUSTOMER_ID,
    text,
    embeddings,
    createdAt: Date.now(),
  });
}

async function run() {
  await connectRedisClient();

  await flushAll();

  await createIndex();

  for (const text of TEXTS) {
    await indexData(text);
  }
  const searchText = "Gesunde Ernährung";
  const searchEmbeddings = await getEmbeddings([searchText]);

  const result = await search(searchEmbeddings);

  console.log(
    result.documents
      .map((r) => `${r.value.createdAt} ${r.value.score}: ${r.value.text}`)
      .join("\n")
  );

  client.disconnect();
}

run();
