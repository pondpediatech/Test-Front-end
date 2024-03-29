import { BigQuery } from "@google-cloud/bigquery";
import type { NextApiRequest, NextApiResponse } from "next";

export const water = async (req: NextApiRequest, res: NextApiResponse) => {
  const bigquery = new BigQuery({
    projectId: process.env.BIGQUERY_PROJECT_ID,
    credentials: {
      client_email: process.env.BIGQUERY_CLIENT_EMAIL,
      private_key: process.env.BIGQUERY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      type: process.env.BIGQUERY_TYPE,
      client_id: process.env.BIGQUERY_CLIENT_ID,
    },
  });

  const datasetId = "messageFromPubSub";
  const tableId = "water_quality";

  // Construct a fully-qualified identifier in the format projectId:datasetId.tableId
  const table = bigquery.dataset(datasetId).table(tableId);
  const allData = req.query.allData === 'true';

  const query = `SELECT created_date, water_pH, tds, water_temp, turb, dox FROM \`${datasetId}.${tableId}\` LIMIT 30`;
  
  // let query = '';
  // if (allData) {
  //   // If allData is true, fetch all data
  // } else {
  //   // Otherwise, fetch only the last 5 records
  //   query = `SELECT created_date, water_pH, tds, water_temp, turb, dox FROM \`${datasetId}.${tableId}\` ORDER BY created_date DESC LIMIT 5`;
  // }

  const [rows] = await bigquery.query(query);

  // Convert rows to the format required by the plugin
  const data = rows.map((row) => ({
    data: {
      time: row.created_date.value,
      series: [
        {
          ph: row.water_pH,
          tds: row.tds,
          turb: row.turb,
          dox: row.dox,
          temp: row.water_temp,
        },
      ],
    },
  }));

  return res.json(data);
};

export default water;
