DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users 
(
	id SERIAL NOT NULL PRIMARY KEY,
	name character varying NOT NULL,
	email character varying NOT NULL,
	password character varying NOT NULL,
	document character varying NOT NULL 
);

DROP TABLE IF EXISTS test CASCADE;
CREATE TABLE test
(
	id SERIAL NOT NULL PRIMARY KEY,
	name character varying NOT NULL,
	created_at timestamp(6) without time zone NOT NULL,
	due_date timestamp(6) without time zone NOT NULL,
	duration integer NOT NULL, --MINUTOS
	img character varying NOT NULL
);

DROP TABLE IF EXISTS question_type CASCADE;
CREATE TABLE question_type
(
	id SERIAL NOT NULL PRIMARY KEY,
	type character varying NOT NULL
);

DROP TABLE IF EXISTS question CASCADE;
CREATE TABLE question
(
	id SERIAL NOT NULL PRIMARY KEY,
	question character varying NOT NULL,
	fk_test integer REFERENCES test(id),
	fk_type integer REFERENCES question_type(id),
	created_at timestamp(6) without time zone NOT NULL
);

DROP TABLE IF EXISTS question_keyword CASCADE;
CREATE TABLE question_keyword
(
	id SERIAL NOT NULL PRIMARY KEY,
	fk_question integer REFERENCES question(id) NOT NULL,
	keyword character varying NOT NULL,
);

DROP TABLE IF EXISTS question_option CASCADE;
CREATE TABLE question_option
(
	id SERIAL NOT NULL PRIMARY KEY,
	option character varying NOT NULL,
	fk_test_question integer REFERENCES question(id) NOT NULL,
	created_at timestamp(6) without time zone NOT NULL
);

DROP TABLE IF EXISTS user_test CASCADE;
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
);

DROP TABLE IF EXISTS user_test_answer CASCADE;
CREATE TABLE user_test_answer
(
	id SERIAL NOT NULL PRIMARY KEY,
	fk_user_test integer REFERENCES user_test(id) NOT NULL,
	fk_test_question integer REFERENCES question(id) NOT NULL,
	vl_answer character varying,
	fk_question_option integer REFERENCES question_option(id),
	created_at timestamp(6) without time zone NOT NULL
);

DROP TABLE IF EXISTS event_type CASCADE;
CREATE TABLE event_type
(
	id SERIAL NOT NULL PRIMARY KEY,
	key character varying NOT NULL,
	type character varying NOT NULL,
	weight integer NOT NULL
);

DROP TABLE IF EXISTS user_test_event CASCADE;
CREATE TABLE user_test_event
(
	id SERIAL NOT NULL PRIMARY KEY,
	fk_user_test integer REFERENCES user_test(id) NOT NULL,
	fk_type integer REFERENCES event_type(id) NOT NULL,
	started_at timestamp(6) without time zone NOT NULL,
	finished_at timestamp(6) without time zone NOT NULL
);



test: [{ name: 'Prova 1', created_at: '2019-06-01 16:34:00', duration: 60, img: 'http://www.unifesp.br/images/logos_unifesp/Unifesp-marca.pngs', due_date: '2019-06-01 16:34:00' }],
  question_type: [{ type: 'TEXTO' }, { type: 'MULTIPLA ESCOLHA' }, { type: 'FORMULA' }],
  question: [
    { question: 'Pergunta 1', fk_test: 1, fk_type: 1, created_at: '2019-06-01 16:34:00' },
    { question: 'Pergunta 2', fk_test: 1, fk_type: 2, created_at: '2019-06-01 16:34:00' },
    { question: 'Pergunta 3', fk_test: 1, fk_type: 1, created_at: '2019-06-01 16:34:00' },
  ],
  question_option: [
    { option: 'Opção 1', fk_test_question: 2, created_at: '2019-06-01 16:34:00' },
    { option: 'Opção 2', fk_test_question: 2, created_at: '2019-06-01 16:34:00' },
    { option: 'Opção 3', fk_test_question: 2, created_at: '2019-06-01 16:34:00' },
  ],
  user_test: [
    { fk_user: 1, fk_test: 1 },
    { fk_user: 2, fk_test: 1 },
  ],


 
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
 results[i]["keywords"].push("opção 1"); 
 results[i]["keywords"].push("opção 2"); 
 results[i]["keywords"].push("opção 3");
 results[i]["keywords"].push(" a "
 results[i]["keywords"].push("b" 
 results[i]["keywords"].push("c" 
 results[i]["keywords"].push("alternativa" 
 results[i]["keywords"].push("alternativa 1" 
 results[i]["keywords"].push("alternativa 2" 
 results[i]["keywords"].push("alternativa 3" 
 results[i]["keywords"].push("alternativa a" 
 results[i]["keywords"].push("alternativa b" 
 results[i]["keywords"].push("alternativa c" 
 