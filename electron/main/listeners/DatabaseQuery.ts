import { BaseListener } from "./BaseListener";
import { Database } from "../utils/Database";

export type DBRow = {
  ip?: string,
  port?: string,
  city?: string,
  country?: string,
  count?: string,
  country_code?: string,
}


export class DatabaseQuery extends BaseListener {

  constructor() {
    super();
  }

  setupListeners() {
    this.listeners = {
      "database:getCameraList": this.getCameraList
    }
  }

  async getCameraList() {
    const query: Promise<DBRow[]> = new Promise((resolve, error) => {
      Database.db.all(`SELECT ip, port, city, country, count, country_code FROM ${Database.dbName} ORDER BY count DESC`, [], (err, rows: DBRow[]) => {
        if (err)
          error(err);
        resolve(rows);
      })
    })
    const response: DBRow[] = await query;
    return JSON.stringify(response);
  }
}

