"use client";

import { Button, Link } from "@heroui/react";

export function LandingPage() {
  return (
    <div className="text-center">
      <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        flow.dev
      </h1>
      <p className="text-xl text-gray-400 mb-8">Your GitHub workflow automation platform</p>
      <div className="flex gap-4 justify-center">
        <Button as={Link} href="/auth/signup" color="primary" size="lg">
          Sign Up
        </Button>
        <Button as={Link} href="/auth/signin" variant="bordered" size="lg">
          Sign In
        </Button>
      </div>
      <p className="text-sm text-gray-500 mt-12">
        Streamline your development workflows with powerful automation
      </p>
    </div>
  );
}
