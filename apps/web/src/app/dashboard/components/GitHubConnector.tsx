"use client";

import { useState, useTransition } from "react";
import { Button, Card, CardBody, Chip } from "@heroui/react";
import { createClient } from "@/app/utils/supabase/client";

interface GitHubConnectorProps {
  userId: string;
  isConnected: boolean;
}

export default function GitHubConnector({ userId, isConnected }: GitHubConnectorProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleConnect = async () => {
    try {
      setError(null);
      startTransition(async () => {
        // Use Supabase's built-in OAuth with GitHub
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'github',
          options: {
            redirectTo: `${window.location.origin}/api/auth/callback`,
            scopes: 'repo:status public_repo', // Read-only repository access
          }
        });

        if (error) {
          console.error("GitHub OAuth initiation failed:", error);
          setError("Failed to initiate GitHub connection. Please try again.");
        }
      });
    } catch (error) {
      console.error("GitHub OAuth initiation failed:", error);
      setError("Failed to initiate GitHub connection. Please try again.");
    }
  };

  const handleDisconnect = async () => {
    try {
      setError(null);
      startTransition(async () => {
        // Get the current user and their identities
        const { data: { user } } = await supabase.auth.getUser();

        if (user?.identities) {
          // Find the GitHub identity
          const githubIdentity = user.identities.find(identity => identity.provider === 'github');

          if (githubIdentity) {
            // Unlink the GitHub provider from Supabase
            const { error: unlinkError } = await supabase.auth.unlinkIdentity(githubIdentity);

            if (unlinkError) {
              console.error("Failed to unlink GitHub from Supabase:", unlinkError);
            }
          }
        }

        // Also remove the connection from our database
        const response = await fetch("/api/auth/github/disconnect", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to disconnect GitHub");
        }

        // Refresh the page to update connection status
        window.location.reload();
      });
    } catch (error) {
      console.error("GitHub disconnect failed:", error);
      setError("Failed to disconnect GitHub. Please try again.");
    }
  };

  return (
    <Card className="max-w-md">
      <CardBody className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {/* GitHub Icon */}
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              <div>
                <p className="font-medium">GitHub</p>
                <p className="text-sm text-default-500">Connect your repositories</p>
              </div>
            </div>

            <div className="ml-auto">
              {isConnected ? (
                <Chip color="success" variant="flat" size="sm">
                  Connected
                </Chip>
              ) : (
                <Chip color="default" variant="flat" size="sm">
                  Not connected
                </Chip>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-danger-50 text-danger-600 rounded-md text-sm">{error}</div>
        )}

        <div className="mt-4">
          {isConnected ? (
            <Button
              color="default"
              variant="bordered"
              onPress={handleDisconnect}
              isLoading={isPending}
              fullWidth
            >
              Disconnect GitHub
            </Button>
          ) : (
            <Button color="primary" onPress={handleConnect} isLoading={isPending} fullWidth>
              Connect GitHub
            </Button>
          )}
        </div>

        {!isConnected && (
          <p className="mt-2 text-xs text-default-400">
            We&apos;ll request read-only access to your repositories
          </p>
        )}
      </CardBody>
    </Card>
  );
}