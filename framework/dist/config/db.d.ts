import { Pool } from "pg";
import mysql, { Pool as MySQLPool } from "mysql2/promise";
import { DataSource } from 'typeorm';
declare let typeOrmDataSource: DataSource;
declare let db: Pool | MySQLPool;
/**
    << initDB() >>

    Summary: This function initializes the database and TypeORM connections
    Async: true
    Visibility: external => Exported for use in other functions/modules
    Input Parameters: nil
    Return Value: nil
    Dependencies:
    - typeorm: To allow for the use of an ORM in the application, acting as an interface between the ORMs and the databases.
    - logger: To log system events within the initialization process.
    - env: To access the environment variables through the env object.
    - db: To provide a base object for the database connection
    Line Calls:
    - 53 => typeorm.initialize()
    - 73 => db.connect() [For PostgreSQL]
    Usage Example:

*/
declare const initDb: () => Promise<void>;
/**
    << closeDB() >>

    Summary: This function closes the database connection on shutdown
    Async: true
    Visibility: external => Exported for use in other functions/modules
    Input Parameters: nil
    Return Value: nil
    Dependencies:
    - logger: To log system events within the initialization process.
    - db: To provide a base object for the database connection
    - typeOrmDataSource: To access the TypeORM connection
    Line Calls:
    - 132, 134 => db.end()
    - 141 => typeOrmDataSource.destroy()
    Usage Example:

*/
declare const closeDb: () => Promise<void>;
/**
    << query() >>

    Summary: This function acts as a wrapper function to log queries
    Async: true
    Visibility: external => Exported for use in other functions/modules
    Input Parameters:
    - text: [string] => This holds the text or template of the query
    - params: [any or undefined] => This holds any parameters for the query
    Return Value: nil
    Dependencies:
    - logger: To log system events within the initialization process.
    - db: To provide a base object for the database connection
    - typeOrmDataSource: To access the TypeORM connection
    Line Calls:
    - 132, 134 => db.end()
    - 141 => typeOrmDataSource.destroy()
    Usage Example:

*/
export declare const query: (text: string, params?: any[]) => Promise<mysql.QueryResult | import("pg").QueryResult<any>>;
export { db, typeOrmDataSource, initDb, closeDb };
