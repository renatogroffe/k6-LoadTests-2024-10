import sql from 'k6/x/sql';
import faker from "k6/x/faker";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

const db = sql.open('postgres', '#{DatabaseTestsConnection}#');

export function teardown() {
  db.close();
}

export default function () {
  db.exec(`INSERT INTO "Products" ("Name", "Upc") ` +
    `VALUES('${faker.product.productName()}', ` +
    `'${faker.product.productUpc()}');`);
}

export function handleSummary(data) {
  return {
    "db-loadtests.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true })
  };
}
