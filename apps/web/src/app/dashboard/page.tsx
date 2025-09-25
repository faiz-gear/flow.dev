import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardBody } from "@heroui/react";
import GitHubConnector from "./components/GitHubConnector";
import NotificationHandler from "./components/NotificationHandler";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signup");
  }

  // Check if GitHub is connected through Supabase identities
  // Identities are automatically managed by Supabase when using OAuth
  const hasGitHubConnected = user.identities?.some(
    identity => identity.provider === 'github'
  ) || false;

  // Also check our custom profile table for backward compatibility
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("github_connected, github_token_encrypted")
    .eq("id", user.id)
    .single();

  // Use either Supabase identity or our custom field
  const isGitHubConnected = hasGitHubConnected || profile?.github_connected || profile?.github_token_encrypted;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <NotificationHandler />
      <Card>
        <CardHeader className="flex flex-col gap-1 px-6 pt-6">
          <h1 className="text-2xl font-semibold">Welcome to Dashboard</h1>
          <p className="text-sm text-default-500">You have successfully signed up!</p>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          <div className="space-y-6">
            <div>
              <p className="text-sm text-default-600">Logged in as:</p>
              <p className="font-medium">{user.email}</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium">Integrations</h2>
              <GitHubConnector userId={user.id} isConnected={!!isGitHubConnected} />
            </div>

            <div className="text-sm text-default-500">
              <p>Connect your GitHub account to analyze your repositories.</p>
              <p>More features will be added in upcoming stories.</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
