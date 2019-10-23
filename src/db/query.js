const doInsert = (table, obj, returningId) => {
  let query = `INSERT INTO $table ($fields) VALUES ($values)${
    returningId ? " returning id" : ""
  }`;

  let fields = Object.keys(obj);
  //filtrando os campos válido(preenchidos)
  fields = fields.filter(item => obj[item]);
  const values = fields.map(item => `'${obj[item]}'`);
  query = query.replace("$table", table);
  query = query.replace("$fields", fields.join(","));
  query = query.replace("$values", values.join(","));
  console.log(query);
  return query;
};

const doArrayInsert = (table, list) => {
  if (list.length > 0) {
    let query = 'INSERT INTO $table ($fields) VALUES ';
    const fields = Object.keys(list[0]);

    for (var i = 0; i < list.length; i++) {
      query += "(";
      const values = fields.map(item => `'${list[i][item]}'`);
      query += values.join(',');
      query += i == list.length - 1 ? ")" : "),";
    }

    query = query.replace('$table', table);
    query = query.replace('$fields', fields.join(','));
    console.log(query);

    return query
  } else {
    return null;
  }
}

module.exports = {
  doInsert,
  doArrayInsert
};
