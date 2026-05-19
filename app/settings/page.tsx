import { AppShell } from "@/components/layout/app-shell";
import { SettingsModal } from "@/components/settings-modal";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal">Settings</h1>
          <p className="mt-2 text-muted-foreground">Authentication, AI, data, and notification surfaces for production deployment.</p>
        </div>
        <SettingsModal />
      </div>
    </AppShell>
  );
}
