import { createClient } from "@supabase/supabase-js";
import { AppEnv } from "./env";

export const supabase = createClient(
  AppEnv.SUPABASE_URL,
  AppEnv.SUPABASE_KEY // server only
);
