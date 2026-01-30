import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Allowed origins for CORS - restrict to Lovable domains, production domain, and local dev
const allowedOriginPatterns: RegExp[] = [
  /^https:\/\/[a-z0-9-]+\.lovable\.app$/i,
  /^https:\/\/[a-z0-9-]+\.lovableproject\.com$/i,
  /^http:\/\/localhost:(5173|8080)$/i,
  /^https:\/\/polaileon\.pl$/i,
  /^https:\/\/www\.polaileon\.pl$/i,
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const isAllowed = allowedOriginPatterns.some((re) => re.test(origin));
  const allowedOrigin = isAllowed ? origin : "https://polaileon.pl";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  };
}

interface ConfirmRequest {
  token: string;
}

const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token }: ConfirmRequest = await req.json();

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Brak tokenu potwierdzającego" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find subscriber by token
    const { data: subscriber, error: fetchError } = await supabase
      .from("newsletter_subscribers")
      .select("id, email, status")
      .eq("confirmation_token", token)
      .single();

    if (fetchError || !subscriber) {
      return new Response(
        JSON.stringify({ error: "Nieprawidłowy lub wygasły link potwierdzający" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (subscriber.status === "confirmed") {
      return new Response(
        JSON.stringify({ success: true, message: "Subskrypcja została już wcześniej potwierdzona!" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Update subscriber to confirmed
    const { error: updateError } = await supabase
      .from("newsletter_subscribers")
      .update({
        status: "confirmed",
        is_active: true,
        confirmed_at: new Date().toISOString(),
      })
      .eq("id", subscriber.id);

    if (updateError) {
      console.error("Update error:", updateError);
      throw new Error("Błąd podczas potwierdzania subskrypcji");
    }

    // Update MailerLite if configured
    const mailerliteApiKey = Deno.env.get("MAILERLITE_API_KEY");
    if (mailerliteApiKey) {
      try {
        await fetch("https://connect.mailerlite.com/api/subscribers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${mailerliteApiKey}`,
          },
          body: JSON.stringify({
            email: subscriber.email,
            status: "active",
          }),
        });
      } catch (e) {
        console.error("MailerLite sync error:", e);
      }
    }

    console.log(`Newsletter subscription confirmed for: ${subscriber.email}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Dziękujemy! Twoja subskrypcja została potwierdzona." 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Nieznany błąd";
    console.error("Newsletter confirmation error:", error);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
