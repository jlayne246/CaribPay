import { Pool } from "pg";
import mysql, { Pool as MySQLPool } from "mysql2/promise";
import { DataSource } from 'typeorm';
declare let typeOrmDataSource: DataSource;
declare let db: Pool | MySQLPool;
declare const initDb: () => Promise<void>;
declare const closeDb: () => Promise<void>;
export declare const query: (text: string, params?: any[]) => Promise<mysql.QueryResult | import("pg").QueryResult<any>>;
export { db, typeOrmDataSource, initDb, closeDb };
