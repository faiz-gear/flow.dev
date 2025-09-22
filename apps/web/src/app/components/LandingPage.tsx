"use client";

import { Button } from "@heroui/button";

export function LandingPage() {
  return (
    <div className="text-center">
      <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        flow.dev
      </h1>
      <p className="text-xl text-gray-400 mb-8">Professional engineering tools for developers</p>
      <div className="flex gap-4 justify-center">
        <Button color="primary" size="lg">
          Get Started
        </Button>
        <Button variant="bordered" size="lg">
          Learn More
        </Button>
      </div>
      <p className="text-sm text-gray-500 mt-12">
        Coming Soon - Building the future of development workflows
      </p>
    </div>
  );
}
