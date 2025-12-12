import { config } from "dotenv";
import fetch from 'cross-fetch'
import path from "path";

config({ path: path.resolve(__dirname, ".env.test") });
global.fetch = fetch