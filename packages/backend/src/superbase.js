const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PRIVATE_SUPABASE_URL,
  process.env.NEXT_PRIVATE_SUPABASE_ANON_KEY,
);

module.exports = supabase;
