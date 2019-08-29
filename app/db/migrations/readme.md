**Migration File Here**

## Structure folder will be:
- [migrations file]

## Example : 
- 1201920129-testing.js

### Script Generate Migration file using Sequalize

> ```node_modules/.bin/sequelize migration:generate --name testing --migrations-path ./app/db/migrations```

### Script Generate DB using Sequalize

> ```node_modules/.bin/sequelize db:migrate --migrations-path=app/db/migrations --config=app/db/datasource/mysql/migration.js```

