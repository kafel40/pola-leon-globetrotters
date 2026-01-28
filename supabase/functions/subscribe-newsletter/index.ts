import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface SubscribeRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: SubscribeRequest = await req.json();

    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "Nieprawidłowy adres email" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Save to database
    const { error: dbError } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: normalizedEmail });

    if (dbError) {
      if (dbError.code === "23505") {
        // Already subscribed - return success anyway
        console.log(`Email ${normalizedEmail} already subscribed`);
      } else {
        console.error("Database error:", dbError);
        throw new Error("Błąd zapisu do bazy danych");
      }
    }

    // =======================================================
    // MIEJSCE NA KLUCZ API: MAILERLITE_API_KEY
    // =======================================================
    // Aby aktywować integrację z MailerLite:
    // 1. Dodaj secret MAILERLITE_API_KEY w panelu Lovable Cloud
    // 2. Odkomentuj poniższy kod
    // =======================================================

    const mailerliteApiKey = Deno.env.get("MAILERLITE_API_KEY");

    if (mailerliteApiKey) {
      try {
        const mailerliteResponse = await fetch(
          "https://connect.mailerlite.com/api/subscribers",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${mailerliteApiKey}`,
            },
            body: JSON.stringify({
              email: normalizedEmail,
            }),
          }
        );

        if (!mailerliteResponse.ok) {
          const errorData = await mailerliteResponse.text();
          console.error("MailerLite API error:", errorData);
          // Don't fail the request - email is already saved to DB
        } else {
          console.log(`Successfully added ${normalizedEmail} to MailerLite`);
        }
      } catch (mailerliteError) {
        console.error("MailerLite integration error:", mailerliteError);
        // Don't fail - email is saved to local DB
      }
    } else {
      console.log("MAILERLITE_API_KEY not configured - skipping MailerLite sync");
    }

    return new Response(
      JSON.stringify({ success: true, message: "Zapisano do newslettera!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Nieznany błąd";
    console.error("Newsletter subscription error:", error);
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
