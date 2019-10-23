const moment = require("moment");
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var cors = require('cors');
app.use(cors())

const db = require("./db");
const { doInsert, doArrayInsert } = require("./db/query");
const { TABLES, migrations, data } = require("./db/migration");

// get user_test_event
app.get("/user-test-event-get/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT * FROM user_test_event WHERE fk_user_test = ${id}`
    );
    if (!result.rows.length) {
      return res.json(null);
    }
    //get type

    const fks = result.rows.map(item => item.fk_type).join(",");
    //pegando o test
    const eventTypes = await db.query(
      `SELECT * FROM event_type WHERE id IN(${fks})`
    );
    const events = result.rows.map(item => {
      item.type = eventTypes.rows.filter(t => t.id == item.fk_type)[0];
      return item;
    });

    return res.json(events);
  } catch (error) {
    return res.json("Ocorreu um problema");
  }
});
// add user_test_event
// add user_test_event
app.post("/user-test-event-add", async (req, res) => {
  try {
    let list = req.body;
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const result = await db.query(doInsert("user_test_event", item));
      if (result.rowCount != 1) {
        return res.json(false);
      }
    }
    return res.json(true);
  } catch (error) {
    return res.json("Ocorreu um problema");
  }
});
// add user_test_event

// get event_type
app.get("/get-event-type", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM event_type");
    if (!result.rows.length) {
      return res.json(null);
    }
    return res.json(result.rows);
  } catch (error) {
    return res.json("Ocorreu um problema");
  }
});
// get event_type

// add user test answer
app.post("/user-test-answer-add", async (req, res) => {
  try {
    let list = req.body;
    list = list.map(item => {
      item.created_at = moment().format("YYYY-MM-DD HH:mm:ss");
      return item;
    });
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const result = await db.query(doInsert("user_test_answer", item));
      if (result.rowCount != 1) {
        return res.json(false);
      }
    }
    return res.json(true);
  } catch (error) {
    return res.json("Ocorreu um problema");
  }
});
// add user test answer

// set status
app.put("/user-test/set-status", async (req, res) => {
  try {
    const { id, status, lat = 0, lon = 0 } = req.body;
    let sql = "";
    const now = moment().format("YYYY-MM-DD HH:mm:ss");
    switch (status) {
      case "AGUARDANDO INICIO":
        // setar lat e lon para verificar
        sql = `UPDATE public.user_test SET status = '${status}', lat = ${lat}, lon = ${lon} WHERE id = ${id}`;
        break;
      case "EM ANDAMENTO":
        sql = `UPDATE public.user_test SET status = '${status}', started_at = '${now}' WHERE id = ${id}`;
        break;
      case "CONCLUIDO":
        sql = `UPDATE public.user_test SET status = '${status}', finished_at = '${now}' WHERE id = ${id}`;
        break;
    }
    console.log(sql);
    const result = await db.query(sql);
    return res.json(result.rowCount == 1);
  } catch (error) {
    return res.json("Ocorreu um problema");
  }
});
// set status

// get user_test-status
app.get("/get-user-test-status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`SELECT * FROM user_test WHERE id = ${id}`);
    if (!result.rows.length) {
      return res.json(null);
    }
    return res.json(result.rows[0].status);
  } catch (error) {
    return res.json("Ocorreu um problema");
  }
});
// get user_test-status

// get user_test
app.get("/get-user-test/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT * FROM user_test WHERE fk_user = ${id}`
    );
    if (!result.rows.length) {
      return res.json(null);
    }
    const fks = result.rows.map(item => item.fk_test).join(",");
    //pegando o test
    const resultTest = await db.query(`SELECT * FROM test WHERE id IN(${fks})`);
    const tests = result.rows.map(item => {
      item.test = resultTest.rows.filter(t => t.id == item.fk_test)[0];
      return item;
    });

    return res.json(tests);
  } catch (error) {
    return res.json("Ocorreu um problema");
  }
});
// get user_test

// add user
app.post("/user-add", async (req, res) => {
  try {
    const u = req.body;
    const result = await db.query(doInsert("users", u, false));
    return res.json(result.rowCount == 1);
  } catch (error) {
    return res.json("Ocorreu um problema");
  }
});
// add user

// autenticação do usuário
app.post("/auth", async (req, res) => {
  try {
    const credentials = req.body;
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [credentials.email, credentials.password]
    );
    if (!result.rows.length) {
      return res.json(null);
    }
    return res.json(result.rows[0]);
  } catch (error) {
    return res.json("Ocorreu um problema");
  }
});
// autenticação do usuário

app.get("/get/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id_user = $1", [
      req.params.id
    ]);
    console.log(
      doInsert(TABLES.users, {
        name: "mateus",
        idade: 23,
        email: "mateus.pereira@agrotools.com.br"
      })
    );
    return res.json(result.rows);
  } catch (ex) {
    return res.json(ex);
  }
});

app.get("/run-migrations", async (req, res) => {
  try {
    Object.keys(migrations).forEach(async table => {
      //db.query('DROP TABLE IF EXISTS ' + table + ' CASCADE')
      await db.query(migrations[table]);

      const query = doArrayInsert(TABLES[table], data[table]);
      if (query != null)
        await db.query(query);

    });

    return res.json(true);
  } catch (ex) {
    return res.json(ex);
  }
});

app.get("/get-test/:id", async (req, res) => {
  const tests = await db.query("SELECT * FROM test WHERE id = $1", [
    req.params.id
  ]);
  const results = tests.rows;
  if (results.length > 0) {
    const questions = await db.query(
      `SELECT q.*, qt.type FROM question q INNER JOIN question_type qt ON q.fk_type = qt.id WHERE fk_test IN (${results
        .map(item => item.id)
        .join(",")});`
    );
    const options = await db.query(
      `SELECT * FROM question_option WHERE fk_test_question IN (${questions.rows
        .map(item => item.id)
        .join(",")}) ;`
    );

    const keywords = await db.query(
      `SELECT * FROM question_keyword WHERE fk_question IN (${questions.rows
        .map(item => item.id)
        .join(",")}) ;`
    );

    for (var i = 0; i < results.length; i++) {
      results[i]["keywords"] = [];
      results[i]["keywords"].push("a resposta é");
      results[i]["keywords"].push("resposta é");
      results[i]["keywords"].push("resposta");
      results[i]["keywords"].push("qual é a resposta");
      results[i]["keywords"].push("a resposta certa");
      results[i]["keywords"].push("resposta certa");
      results[i]["keywords"].push("a resposta correta");
      results[i]["keywords"].push("resposta correta");
      results[i]["keywords"].push("alternativa");
      results[i]["keywords"].push("resposta da pergunta");
      results[i]["keywords"].push("opção");

      const quests = questions.rows.filter(
        item => item.fk_test == results[i].id
      );
      for (var x = 0; x < quests.length; x++) {

        quests[x]["options"] = options.rows.filter(
          item => item.fk_test_question == quests[x].id
        );

        quests[x]["keywords"] = keywords.rows.filter(
          item => item.fk_question == quests[x].id
        );

        for (let a = 0; a < quests[x]["options"].length; a++) {
          const element = quests[x]["options"][a];
          results[i]["keywords"].push(element.option);

          let concat = "";
          for (let b = 0; b < element.option.split(" ").length; b++) {
            const item = element.option.split(" ")[b];
            if (b < 3) {
              concat += " " + item;
            }
          }
          results[i]["keywords"].push(concat += " ");
        }
      }

      results[i]["questions"] = quests;
    }
    return res.json(results[0]);
  } else {
    return res.json(null);
  }
});

app.get("/create-test", async (req, res) => {
  const random = Math.random() * (1000 - 1) + 1;
  const queryTest = doInsert("test", { name: 'Prova ' + random.toFixed(0), created_at: '2019-06-01 16:34:00', duration: 60, img: 'https://lever-client-logos.s3.amazonaws.com/349d1c8e-f724-4154-b4a1-10ced99e06e5-1479426290982.png', due_date: '2019-06-01 16:34:00' }, "id");
  const id = await db.query(queryTest);

  const id1 = await db.query(doInsert("question", { question: 'A respeito do funcionamento dos néfrons, é correto afirmar que', fk_test: 1, fk_type: id.rows[0].id, created_at: '2019-06-01 16:34:00' }, "id"));
  const id2 = await db.query(doInsert("question", { question: 'Ao longo das últimas décadas, muito esforço tem sido feito para conter a propagação do mosquito Aedes aegypti no Brasil e em diversas regiões no mundo. Essa espécie de mosquito está relacionada a duas doenças graves que ocorrem no território nacional, a dengue e a febre amarela. Com relação ao agente causador e ao modo de transmissão dessas doenças, está correto afirmar que', fk_test: id.rows[0].id, fk_type: 1, created_at: '2019-06-01 16:34:00' }, "id"));
  const id3 = await db.query(doInsert("question", { question: '""Em 17 de abril de 1996, os trabalhadores sem-terra que ocupavam uma fazenda improdutiva marchavam pelas pistas da rodovia que dá acesso ao município de Eldorado do Carajás, no Pará. A polícia foi chamada para controlar a situação. Houve resistência e dezenove trabalhadores foram mortos, 69 ficaram feridos e sete desapareceram. Os movimentos sociais proclamaram essa data como Dia Mundial da Luta pela Terra." (Sampaio, F e Sucena, I. 2010. p 240). Com base na leitura e interpretação do texto e seus conhecimentos sobre a atuação dos movimentos sociais que contribuíram para as mudanças ou rupturas em processos de disputa pelo poder e pela terra no Brasil, podemos concluir que" ', fk_test: id.rows[0].id, fk_type: 1, created_at: '2019-06-01 16:34:00' }, "id"));

  const queryQuestionKeywords = doArrayInsert("question_keyword", [
    { fk_question: id1.rows[0].id, keyword: "hormônio" },
    { fk_question: id1.rows[0].id, keyword: "antidiurético" },
    { fk_question: id1.rows[0].id, keyword: "ADH" },
    { fk_question: id1.rows[0].id, keyword: "urina" },
    { fk_question: id1.rows[0].id, keyword: "pressão" },
    { fk_question: id1.rows[0].id, keyword: "sangue" },
    { fk_question: id1.rows[0].id, keyword: "capilares" },
    { fk_question: id1.rows[0].id, keyword: "glomérulos" },
    { fk_question: id2.rows[0].id, keyword: "dengue" },
    { fk_question: id2.rows[0].id, keyword: "toxinas" },
    { fk_question: id2.rows[0].id, keyword: "mosquito" },
    { fk_question: id2.rows[0].id, keyword: "febre amarela" },
    { fk_question: id2.rows[0].id, keyword: "vírus" },
    { fk_question: id2.rows[0].id, keyword: "transmitidos" },
    { fk_question: id2.rows[0].id, keyword: "picada" },
    { fk_question: id2.rows[0].id, keyword: "transmissor" },
    { fk_question: id2.rows[0].id, keyword: "macho" },
    { fk_question: id3.rows[0].id, keyword: "movimentos" },
    { fk_question: id3.rows[0].id, keyword: "UDR" },
    { fk_question: id3.rows[0].id, keyword: "CUT" },
    { fk_question: id3.rows[0].id, keyword: "CGT" },
    { fk_question: id3.rows[0].id, keyword: "reivindicarem" },
    { fk_question: id3.rows[0].id, keyword: "reforma agrária" },
    { fk_question: id3.rows[0].id, keyword: "trabalhadores rurais" },
    { fk_question: id3.rows[0].id, keyword: "sem-terra" },
    { fk_question: id3.rows[0].id, keyword: "meeiros" },
  ]);
  await db.query(queryQuestionKeywords);

  const queryUserTest = doArrayInsert("user_test", [
    { fk_user: 1, fk_test: id.rows[0].id },
    { fk_user: 2, fk_test: id.rows[0].id },
    { fk_user: 3, fk_test: id.rows[0].id },
    { fk_user: 4, fk_test: id.rows[0].id },
  ]);
  await db.query(queryUserTest);

  return res.json(id.rows[0].id);
});

app.listen(process.env.PORT || 3000);
