"use client";

import { Bell, Database, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function SettingsModal() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            <CardTitle>Workspace Profile</CardTitle>
          </div>
          <CardDescription>Subscription-ready account settings for Auth.js or Clerk-backed workspaces.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input defaultValue="Demo User" />
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input defaultValue="demo@resumeforge.ai" />
          </div>
          <div className="grid gap-2">
            <Label>Plan</Label>
            <Input defaultValue="Pro" readOnly />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="size-5 text-primary" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>Product hooks are prepared for reminders, usage alerts, and resume health nudges.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {["Weekly resume health summary", "ATS regression alerts", "Export completion alerts"].map((label) => (
            <div key={label} className="flex items-center justify-between rounded-lg border bg-background p-3">
              <span className="text-sm">{label}</span>
              <Switch checked onCheckedChange={() => undefined} aria-label={label} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="size-5 text-primary" />
            <CardTitle>Data Layer</CardTitle>
          </div>
          <CardDescription>Local persistence is active now. Prisma schema is ready for multi-user deployment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Resume drafts, versions, job descriptions, and ATS reports have database-ready models.</p>
          <p>Switch from local storage to Prisma-backed routes when authentication is enabled.</p>
        </CardContent>
      </Card>
    </div>
  );
}
