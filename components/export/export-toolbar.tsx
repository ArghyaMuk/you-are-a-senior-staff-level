"use client";

import { Download, FileArchive, FileText, Link2, Printer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { copyShareLink, exportDOCX, exportPDF, exportTXT, printResume } from "@/lib/export";
import { useActiveResume } from "@/hooks/use-active-resume";

export function ExportToolbar() {
  const { resume } = useActiveResume();

  async function runExport(label: string, action: () => Promise<void> | void) {
    try {
      await action();
      toast.success(`${label} ready`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `${label} failed`);
    }
  }

  return (
    <div className="sticky top-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-background/90 p-3 shadow-sm backdrop-blur no-print">
      <div>
        <p className="text-sm font-semibold">Preview & Export</p>
        <p className="text-xs text-muted-foreground">ATS-safe PDF, DOCX, TXT, print, and share link.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => runExport("TXT export", () => exportTXT(resume))}>
          <FileText />
          TXT
        </Button>
        <Button variant="outline" size="sm" onClick={() => runExport("DOCX export", () => exportDOCX(resume))}>
          <FileArchive />
          DOCX
        </Button>
        <Button variant="outline" size="sm" onClick={() => runExport("Share link", () => copyShareLink(resume).then(() => undefined))}>
          <Link2 />
          Share
        </Button>
        <Button variant="outline" size="sm" onClick={printResume}>
          <Printer />
          Print
        </Button>
        <Button size="sm" onClick={() => runExport("PDF export", () => exportPDF("resume-preview-paper", `${resume.title}.pdf`))}>
          <Download />
          PDF
        </Button>
      </div>
    </div>
  );
}
