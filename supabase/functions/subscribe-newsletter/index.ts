import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

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

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from("newsletter_subscribers")
      .select("id, status, confirmation_token")
      .eq("email", normalizedEmail)
      .single();

    let confirmationToken: string;

    if (existingSubscriber) {
      if (existingSubscriber.status === "confirmed") {
        // Already confirmed subscriber
        return new Response(
          JSON.stringify({ success: true, message: "Ten email jest już zapisany do newslettera!" }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      // Pending subscriber - resend confirmation
      confirmationToken = existingSubscriber.confirmation_token;
    } else {
      // New subscriber - insert with pending status
      const { data: newSubscriber, error: dbError } = await supabase
        .from("newsletter_subscribers")
        .insert({ 
          email: normalizedEmail,
          status: "pending",
          is_active: false
        })
        .select("confirmation_token")
        .single();

      if (dbError) {
        console.error("Database error:", dbError);
        throw new Error("Błąd zapisu do bazy danych");
      }

      confirmationToken = newSubscriber.confirmation_token;
    }

    // Send confirmation email via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      throw new Error("Konfiguracja wysyłki email nie jest kompletna");
    }

    const resend = new Resend(resendApiKey);
    
    // Build confirmation URL
    const baseUrl = Deno.env.get("SITE_URL") || "https://polaileon.pl";
    const confirmationUrl = `${baseUrl}/potwierdz-newsletter?token=${confirmationToken}`;

    const emailResponse = await resend.emails.send({
      from: "Pola i Leon <newsletter@polaileon.pl>",
      to: [normalizedEmail],
      subject: "Potwierdź swoją subskrypcję newslettera Pola i Leon",
      html: `
        <!DOCTYPE html>
        <html lang="pl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Nunito', Arial, sans-serif; background-color: #f8f7f4; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #7c9885 0%, #a8c5b5 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">🌍 Pola i Leon</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Bajki edukacyjne dla dzieci</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #2d3748; margin: 0 0 20px 0; font-size: 22px;">Cześć! 👋</h2>
              
              <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dziękujemy za zainteresowanie naszym newsletterem! Aby dokończyć rejestrację, prosimy o potwierdzenie Twojego adresu email.
              </p>
              
              <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Kliknij poniższy przycisk, aby potwierdzić subskrypcję:
              </p>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${confirmationUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #7c9885 0%, #5a7a64 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 15px rgba(124, 152, 133, 0.4);">
                  ✉️ Potwierdzam subskrypcję
                </a>
              </div>
              
              <p style="color: #718096; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                Jeśli nie rejestrowałeś/aś się do naszego newslettera, zignoruj tę wiadomość.
              </p>
              
              <p style="color: #718096; font-size: 12px; line-height: 1.6; margin: 20px 0 0 0;">
                Jeśli przycisk nie działa, skopiuj i wklej ten link do przeglądarki:<br>
                <a href="${confirmationUrl}" style="color: #7c9885; word-break: break-all;">${confirmationUrl}</a>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8f7f4; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #a0aec0; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Pola i Leon | CARSI Sp. z o.o.<br>
                Wszelkie prawa zastrzeżone
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Confirmation email sent:", emailResponse);

    // Sync with MailerLite if configured (for future marketing)
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
            email: normalizedEmail,
            status: "unconfirmed",
          }),
        });
      } catch (e) {
        console.error("MailerLite sync error:", e);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Sprawdź swoją skrzynkę email i potwierdź subskrypcję!" 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Nieznany błąd";
    console.error("Newsletter subscription error:", error);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
