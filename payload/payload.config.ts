import path from 'path';
import { buildConfig } from 'payload/config';
import { postgresAdapter } from '@payloadcms/db-postgres'
import { slateEditor } from '@payloadcms/richtext-slate';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import Users from '../pages/api/[collection]/Users';
import Thread from '../pages/api/[collection]/Thread';

export default buildConfig({
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    migrationDir: path.resolve(__dirname, 'migrations'),
  }),
  serverURL: process.env.NEXT_PUBLIC_PAYLOAD_URL,
  editor: slateEditor({}),
  admin: {
    bundler: webpackBundler(),
    meta: {
      titleSuffix: "PondPedia"
    }
  },
  cors: [
    process.env.NEXT_PUBLIC_PAYLOAD_URL || '', // For Our Front-end (Next.js)
  ].filter(Boolean),
  csrf: [
    process.env.NEXT_PUBLIC_PAYLOAD_URL || '',
  ].filter(Boolean),
  collections: [
    // Your collections here
    Users,
    Thread
  ],
  globals: [
    // Your globals here
  ],
  typescript: {
    outputFile: path.resolve(__dirname, '../app/payload-types.ts'),
  },
});
