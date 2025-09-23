import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardBody } from '@heroui/react';

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signup');
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader className="flex flex-col gap-1 px-6 pt-6">
          <h1 className="text-2xl font-semibold">Welcome to Dashboard</h1>
          <p className="text-sm text-default-500">You have successfully signed up!</p>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-default-600">Logged in as:</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div className="text-sm text-default-500">
              <p>This is a placeholder dashboard page.</p>
              <p>More features will be added in upcoming stories.</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}