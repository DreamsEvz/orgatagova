import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://tgflofomuccihdarnnvj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnZmxvZm9tdWNjaWhkYXJubnZqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyODQ4NjM0NCwiZXhwIjoyMDQ0MDYyMzQ0fQ.TCLHuHF2ZCKpmWEidK6BxWeM2D9rTR2WIn46tPWfTAk"
);
