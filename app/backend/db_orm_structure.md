/framework
  ├── src
  │   ├── db
  │   │   └── db.ts (manual DB connection and TypeORM setup)
  │   ├── env.ts
  │   ├── ormconfig.ts (TypeORM configuration, optional)
/backend
  ├── src
  │   ├── entities
  │   │   └── User.ts (Model class & TypeORM entity)
  │   ├── services
  │   │   └── UserService.ts (Using TypeORM to manage data)
  │   └── index.ts (App entry point where TypeORM is initialized)
