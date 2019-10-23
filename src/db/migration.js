const TABLES = {
  users: 'users',
  test: 'test',
  question_type: 'question_type',
  question: 'question',
  user_test: 'user_test',
  user_test_answer: 'user_test_answer',
  event_type: 'event_type',
  user_test_event: 'user_test_event',
  question_keyword: 'question_keyword',
  question_option: 'question_option',
}

const migrations = {
  users:
    `DROP TABLE IF EXISTS users CASCADE;
    CREATE TABLE users 
    (
      id SERIAL NOT NULL PRIMARY KEY,
      name character varying NOT NULL,
      email character varying NOT NULL,
      password character varying NOT NULL,
      document character varying NOT NULL
    );`,
  test:
    `DROP TABLE IF EXISTS test CASCADE;
    CREATE TABLE test
    (
      id SERIAL NOT NULL PRIMARY KEY,
      name character varying NOT NULL,
      created_at timestamp(6) without time zone NOT NULL,
      due_date timestamp(6) without time zone NOT NULL,
      duration integer NOT NULL, --MINUTOS
      img character varying NOT NULL
    );`,
  question_type:
    `DROP TABLE IF EXISTS question_type CASCADE;
    CREATE TABLE question_type
    (
      id SERIAL NOT NULL PRIMARY KEY,
      type character varying NOT NULL
    );`,
  question:
    `DROP TABLE IF EXISTS question CASCADE;
    CREATE TABLE question
    (
      id SERIAL NOT NULL PRIMARY KEY,
      question character varying NOT NULL,
      fk_test integer REFERENCES test(id),
      fk_type integer REFERENCES question_type(id),
      created_at timestamp(6) without time zone NOT NULL
    );`,
  question_keyword:
    `DROP TABLE IF EXISTS question_keyword CASCADE;
    CREATE TABLE question_keyword
    (
      id SERIAL NOT NULL PRIMARY KEY,
      fk_question integer REFERENCES question(id) NOT NULL,
      keyword character varying NOT NULL
    );`,
  question_option:
    `DROP TABLE IF EXISTS question_option CASCADE;
    CREATE TABLE question_option
    (
      id SERIAL NOT NULL PRIMARY KEY,
      option character varying NOT NULL,
      fk_test_question integer REFERENCES question(id) NOT NULL,
      created_at timestamp(6) without time zone NOT NULL
    );`,
  user_test:
    `DROP TABLE IF EXISTS user_test CASCADE;
    CREATE TABLE user_test
    (
      id SERIAL NOT NULL PRIMARY KEY,
      fk_user integer REFERENCES users(id) NOT NULL,
      fk_test integer REFERENCES test(id),
      "status" character varying DEFAULT 'INDISPONIVEL',	--INDISPONIVEL, AGUARDANDO INICIO, EM ANDAMENTO, CONCLUIDO
      started_at timestamp(6) without time zone,
      finished_at timestamp(6) without time zone,
      lat double precision,
	    lon double precision
    );`,
  user_test_answer:
    `DROP TABLE IF EXISTS user_test_answer CASCADE;
    CREATE TABLE user_test_answer
    (
      id SERIAL NOT NULL PRIMARY KEY,
      fk_user_test integer REFERENCES user_test(id) NOT NULL,
      fk_test_question integer REFERENCES question(id) NOT NULL,
      vl_answer character varying,
      fk_question_option integer REFERENCES question_option(id),
      created_at timestamp(6) without time zone NOT NULL
    );`,
  event_type: `
    DROP TABLE IF EXISTS event_type CASCADE;
    CREATE TABLE event_type
    (
      id SERIAL NOT NULL PRIMARY KEY,
      key character varying NOT NULL,
      type character varying NOT NULL,
      weight integer NOT NULL
    );
    `,
  user_test_event: `
    DROP TABLE IF EXISTS user_test_event;
    CREATE TABLE user_test_event
    (
      id SERIAL NOT NULL PRIMARY KEY,
      fk_user_test integer REFERENCES user_test(id) NOT NULL,
      fk_type integer REFERENCES event_type(id) NOT NULL,
      started_at timestamp(6) without time zone NOT NULL,
      finished_at timestamp(6) without time zone NOT NULL
    );`
}

const data = {
  users: [
    { name: 'mateus', email: 'mateus.pereira@quero.com.br', password: '123123', document: '407.227.398-85' },
    { name: 'breno', email: 'breno.pereira@quero.com.br', password: '123123', document: '407.227.398-85' },
    { name: 'felipe', email: 'felipe.nascimento@quero.com.br', password: '123123', document: '407.227.398-85' },
    { name: 'Rafael', email: 'rafael.nascimento@quero.com.br', password: '123123', document: '407.227.398-85' }
  ],
  test: [{ name: 'Prova 1', created_at: '2019-06-01 16:34:00', duration: 60, img: 'https://lever-client-logos.s3.amazonaws.com/349d1c8e-f724-4154-b4a1-10ced99e06e5-1479426290982.png', due_date: '2019-06-01 16:34:00' }],
  question_type: [{ type: 'TEXTO' }, { type: 'MULTIPLA ESCOLHA' }, { type: 'FORMULA' }],
  question: [
    { question: ' A respeito do funcionamento dos néfrons, é correto afirmar que', fk_test: 1, fk_type: 1, created_at: '2019-06-01 16:34:00' },
    { question: 'Em uma aula sobre Evolução, cujo tema discutido era a mutação gênica, o professor pediu para que os alunos analisassem cinco afirmações. Qual delas está CORRETA?', fk_test: 1, fk_type: 2, created_at: '2019-06-01 16:34:00' },
    { question: 'Ao longo das últimas décadas, muito esforço tem sido feito para conter a propagação do mosquito Aedes aegypti no Brasil e em diversas regiões no mundo. Essa espécie de mosquito está relacionada a duas doenças graves que ocorrem no território nacional, a dengue e a febre amarela. Com relação ao agente causador e ao modo de transmissão dessas doenças, está correto afirmar que', fk_test: 1, fk_type: 1, created_at: '2019-06-01 16:34:00' },
    { question: 'Um homem destro e daltônico casa-se com uma mulher destra e de visão normal para cores. O casal tem uma filha canhota e daltônica. A probabilidade desse casal ter uma criança não daltônica e destra é de ', fk_test: 1, fk_type: 2, created_at: '2019-06-01 16:34:00' },
    { question: 'A caxumba é uma doença viral que acomete as glândulas salivares parótidas mas, em alguns homens, a infecção alcança os testículos e epidídimo, promovendo distúrbios na função destas estruturas, podendo resultar na esterilidade. Os elementos em destaque no enunciado são responsáveis, respectivamente, pelas seguintes funções: ', fk_test: 1, fk_type: 2, created_at: '2019-06-01 16:34:00' },
    { question: '""Em 17 de abril de 1996, os trabalhadores sem-terra que ocupavam uma fazenda improdutiva marchavam pelas pistas da rodovia que dá acesso ao município de Eldorado do Carajás, no Pará. A polícia foi chamada para controlar a situação. Houve resistência e dezenove trabalhadores foram mortos, 69 ficaram feridos e sete desapareceram. Os movimentos sociais proclamaram essa data como Dia Mundial da Luta pela Terra." (Sampaio, F e Sucena, I. 2010. p 240). Com base na leitura e interpretação do texto e seus conhecimentos sobre a atuação dos movimentos sociais que contribuíram para as mudanças ou rupturas em processos de disputa pelo poder e pela terra no Brasil, podemos concluir que" ', fk_test: 1, fk_type: 1, created_at: '2019-06-01 16:34:00' },
  ],
  question_option: [
    { option: 'Mutações são alterações que ocorrem na molécula de DNA sempre transmitidas de pais para seus descendentes', fk_test_question: 2, created_at: '2019-06-01 16:34:00' },
    { option: 'Mutações ocorrem devido a uma necessidade de adaptação do indivíduo ao ambiente. ', fk_test_question: 2, created_at: '2019-06-01 16:34:00' },
    { option: 'Mutações são alterações que ocorrem na molécula de RNA mensageiro que controla a produção de uma proteína.', fk_test_question: 2, created_at: '2019-06-01 16:34:00' },
    { option: 'Em espécies diploides, uma mutação autossômica recessiva se expressa em indivíduos portadores de apenas um gene mutante.', fk_test_question: 2, created_at: '2019-06-01 16:34:00' },
    { option: 'Uma determinada mutação pode ser vantajosa em um ambiente e prejudicial em outro.', fk_test_question: 2, created_at: '2019-06-01 16:34:00' },
    { option: '3/8', fk_test_question: 4, created_at: '2019-06-01 16:34:00' },
    { option: '3/16', fk_test_question: 4, created_at: '2019-06-01 16:34:00' },
    { option: '1/4', fk_test_question: 4, created_at: '2019-06-01 16:34:00' },
    { option: '39/16', fk_test_question: 4, created_at: '2019-06-01 16:34:00' },
    { option: 'produção de hormônio folículo estimulante e ereção peniana.', fk_test_question: 4, created_at: '2019-06-01 16:34:00' },
    { option: 'produção de espermatozoides e armazenamento dos espermatozoides.', fk_test_question: 5, created_at: '2019-06-01 16:34:00' },
    { option: 'produção de hormônio luteinizante e produção do liquido seminal.', fk_test_question: 5, created_at: '2019-06-01 16:34:00' },
    { option: 'espermiogênese e produção do liquido prostático.', fk_test_question: 5, created_at: '2019-06-01 16:34:00' },
    { option: 'ejaculação e produção do hormônio luteinizante.', fk_test_question: 5, created_at: '2019-06-01 16:34:00' },
  ],
  question_keyword: [
    { fk_question: 1, keyword: "hormônio" },
    { fk_question: 1, keyword: "antidiurético" },
    { fk_question: 1, keyword: "ADH" },
    { fk_question: 1, keyword: "urina" },
    { fk_question: 1, keyword: "pressão" },
    { fk_question: 1, keyword: "sangue" },
    { fk_question: 1, keyword: "capilares" },
    { fk_question: 1, keyword: "glomérulos" },
    { fk_question: 3, keyword: "dengue" },
    { fk_question: 3, keyword: "toxinas" },
    { fk_question: 3, keyword: "mosquito" },
    { fk_question: 3, keyword: "febre amarela" },
    { fk_question: 3, keyword: "vírus" },
    { fk_question: 3, keyword: "transmitidos" },
    { fk_question: 3, keyword: "picada" },
    { fk_question: 3, keyword: "transmissor" },
    { fk_question: 3, keyword: "macho" },
    { fk_question: 6, keyword: "movimentos" },
    { fk_question: 6, keyword: "UDR" },
    { fk_question: 6, keyword: "CUT" },
    { fk_question: 6, keyword: "CGT" },
    { fk_question: 6, keyword: "reivindicarem" },
    { fk_question: 6, keyword: "reforma agrária" },
    { fk_question: 6, keyword: "trabalhadores rurais" },
    { fk_question: 6, keyword: "sem-terra" },
    { fk_question: 6, keyword: "meeiros" },
  ],
  user_test: [
    { fk_user: 1, fk_test: 1 },
    { fk_user: 2, fk_test: 1 },
    { fk_user: 3, fk_test: 1 },
    { fk_user: 4, fk_test: 1 },
  ],
  user_test_answer: [],
  event_type: [
    { key: 'GYROSCOPE', type: 'Giroscópio', weight: 1 },
    { key: 'BACKGROUND', type: 'Aplicativo em segundo plano', weight: 2 },
    { key: 'NOBODY', type: 'Nenhuma pessoa detectada', weight: 1 },
    { key: 'SOMEBODY', type: 'Mais de uma pessoa detectada', weight: 5 },
    { key: 'CELLPHONE', type: 'Celular detectado', weight: 8 },
    { key: 'LEFTTEST', type: 'Saiu da prova', weight: 13 },
  ],
  user_test_event: []
}

module.exports = {
  migrations,
  TABLES,
  data
}