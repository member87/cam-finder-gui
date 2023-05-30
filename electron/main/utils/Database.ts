import sqlite3 from "sqlite3"
import { app } from "electron";
import { join } from 'path';

export abstract class Database {

  private static _database: sqlite3.Database;
  private static DB_NAME: string = "CAMERA_LIST";
  private static DB_PATH: string = join(app.getPath("userData"), "database.db")

  static loadDatabase() {
    this._database = new sqlite3.Database(this.DB_PATH);
    this._database.run(`
      CREATE TABLE IF NOT EXISTS ${this.DB_NAME} 
        (
          ip            VARCHAR(16),
          port        VARCHAR(6),
          lat         STRING,
          long        STRING,
          city        STRING,
          country      STRING,
          country_code STRING,
          count       INT
        );
    `)


  }

  static get db() { return this._database }

  static get dbName() { return this.DB_NAME }

  static prepare(statement: string) {
    statement = statement.replace("{DATABASE}", this.DB_NAME);
    return this._database.prepare(statement);
  }
}

