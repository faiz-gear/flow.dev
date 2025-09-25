import { createClient } from "@/app/utils/supabase/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createClient();

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect(
        new URL('/dashboard?error=Failed to authenticate with GitHub', requestUrl.origin)
      );
    }

    // Get the current user and their identities
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Check if GitHub is connected by looking at identities
      const hasGitHub = user.identities?.some(identity => identity.provider === 'github');

      if (hasGitHub) {
        // Store GitHub connection status in user profile
        const { error: updateError } = await supabase
          .from('user_profiles')
          .upsert({
            id: user.id,
            github_connected: true,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id',
            ignoreDuplicates: false
          });

        if (updateError) {
          console.error('Failed to update GitHub connection status:', updateError);
        }

        return NextResponse.redirect(
          new URL('/dashboard?success=GitHub connected successfully', requestUrl.origin)
        );
      }
    }
  }

  // Return the user to an error page if something went wrong
  return NextResponse.redirect(
    new URL('/dashboard?error=Authentication failed', requestUrl.origin)
  );
}