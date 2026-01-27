import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Allowed origins for CORS - restrict to Lovable domains + local dev.
// NOTE: Preview can run under both *.lovable.app and *.lovableproject.com.
const allowedOriginPatterns: RegExp[] = [
  /^https:\/\/[a-z0-9-]+\.lovable\.app$/i,
  /^https:\/\/[a-z0-9-]+\.lovableproject\.com$/i,
  /^http:\/\/localhost:(5173|8080)$/i,
]

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || ''

  const isAllowed = allowedOriginPatterns.some((re) => re.test(origin))
  // Fallback to the published domain if the request origin isn't in our allow-list.
  const allowedOrigin = isAllowed ? origin : 'https://pola-leon-globetrotters.lovable.app'
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const { ebookId, fileType } = await req.json()
    
    if (!ebookId || typeof ebookId !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid ebookId parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate ebookId format to prevent SQL injection
    // Must be either a valid UUID or a valid slug (lowercase letters, numbers, hyphens)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    const slugRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/
    
    const isUuid = uuidRegex.test(ebookId)
    const isSlug = slugRegex.test(ebookId) && ebookId.length <= 100
    
    if (!isUuid && !isSlug) {
      return new Response(
        JSON.stringify({ error: 'Invalid ebook identifier format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!fileType || !['pdf', 'epub', 'audio'].includes(fileType)) {
      return new Response(
        JSON.stringify({ error: 'Invalid fileType. Must be "pdf", "epub" or "audio"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client with the user's auth token
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    // User client to verify ownership
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    // Get current user
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Admin client for generating signed URLs
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Check if user is admin
    const { data: isAdmin } = await supabaseAdmin
      .rpc('is_admin', { _user_id: user.id })

    // Get the ebook details using safe parameterized queries
    let ebookQuery = supabaseAdmin
      .from('ebooks')
      .select('id, slug, pdf_url, epub_url, audio_url, is_published')

    // Use separate .eq() calls instead of .or() with string interpolation to prevent SQL injection
    if (isUuid) {
      ebookQuery = ebookQuery.eq('id', ebookId)
    } else {
      ebookQuery = ebookQuery.eq('slug', ebookId)
    }

    const { data: ebook, error: ebookError } = await ebookQuery.single()

    if (ebookError || !ebook) {
      return new Response(
        JSON.stringify({ error: 'Ebook not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if ebook is published (unless admin)
    if (!isAdmin && !ebook.is_published) {
      return new Response(
        JSON.stringify({ error: 'Ebook not available' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check ownership (unless admin)
    if (!isAdmin) {
      const { data: ownership, error: ownershipError } = await supabaseUser
        .from('owned_ebooks')
        .select('id')
        .eq('user_id', user.id)
        .eq('ebook_id', ebook.id)
        .maybeSingle()

      if (ownershipError || !ownership) {
        return new Response(
          JSON.stringify({ error: 'You do not own this ebook' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Get the file URL based on type
    const fileUrl = fileType === 'pdf' ? ebook.pdf_url : fileType === 'epub' ? ebook.epub_url : ebook.audio_url
    
    if (!fileUrl) {
      return new Response(
        JSON.stringify({ error: `${fileType.toUpperCase()} file not available for this ebook` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Extract the file path from the URL
    // The URL might be a full storage URL or just a path
    let filePath: string
    if (fileUrl.includes('/storage/v1/object/public/ebooks/')) {
      filePath = fileUrl.split('/storage/v1/object/public/ebooks/')[1]
    } else if (fileUrl.startsWith('http')) {
      // Try to extract path from other URL formats
      const urlParts = new URL(fileUrl)
      filePath = urlParts.pathname.replace(/^\/storage\/v1\/object\/(public|sign)\/ebooks\//, '')
    } else {
      // Assume it's already a path
      filePath = fileUrl
    }

    // Generate a signed URL (valid for 1 hour)
    const { data: signedUrl, error: signedUrlError } = await supabaseAdmin
      .storage
      .from('ebooks')
      .createSignedUrl(filePath, 3600) // 1 hour expiry

    if (signedUrlError || !signedUrl) {
      console.error('Error generating signed URL:', signedUrlError)
      return new Response(
        JSON.stringify({ error: 'Failed to generate download URL' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        downloadUrl: signedUrl.signedUrl,
        expiresIn: 3600 // seconds
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in generate-download-url:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
