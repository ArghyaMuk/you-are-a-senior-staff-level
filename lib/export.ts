"use client";

import type { ResumeData } from "@/types/resume";
import { resumeToPlainText } from "@/lib/resume-text";

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function safeFileName(title: string, extension: string) {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "resume"}.${extension}`;
}

export function exportTXT(resume: ResumeData) {
  downloadBlob(new Blob([resumeToPlainText(resume)], { type: "text/plain;charset=utf-8" }), safeFileName(resume.title, "txt"));
}

export async function exportDOCX(resume: ResumeData) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import("docx");
  const lines = resumeToPlainText(resume).split("\n");
  const children = lines.map((line) => {
    const isHeading = /^[A-Z][A-Z\s&]+$/.test(line) || line === resume.personal.fullName;
    return new Paragraph({
      heading: line === resume.personal.fullName ? HeadingLevel.TITLE : isHeading ? HeadingLevel.HEADING_2 : undefined,
      bullet: line.startsWith("- ") ? { level: 0 } : undefined,
      children: [
        new TextRun({
          text: line.replace(/^- /, ""),
          bold: isHeading,
          size: line === resume.personal.fullName ? 32 : 22
        })
      ],
      spacing: { after: isHeading ? 160 : 80 }
    });
  });

  const doc = new Document({
    creator: "RésuméForge AI",
    title: resume.title,
    description: "ATS-safe resume export",
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 }
          }
        },
        children
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, safeFileName(resume.title, "docx"));
}

export async function exportPDF(elementId = "resume-preview-paper", fileName = "resume.pdf") {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const element = document.getElementById(elementId);
  const title = element?.getAttribute("data-resume-title") ?? fileName.replace(/\.pdf$/i, "");
  const text = element?.innerText ?? title;
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 54;
  const lineHeight = 14;
  const fontSize = 10.5;
  let page = pdf.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  function drawLine(line: string, isHeading = false) {
    if (y < margin) {
      page = pdf.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }
    page.drawText(line, {
      x: margin,
      y,
      size: isHeading ? 12 : fontSize,
      font: isHeading ? bold : font,
      color: rgb(0.08, 0.1, 0.15)
    });
    y -= isHeading ? lineHeight + 4 : lineHeight;
  }

  function wrap(line: string) {
    const words = line.split(" ");
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      const next = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(next, fontSize) > pageWidth - margin * 2) {
        lines.push(current);
        current = word;
      } else {
        current = next;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line) {
      y -= 6;
      continue;
    }
    const isHeading = line === line.toUpperCase() && line.length < 48;
    for (const wrapped of wrap(line)) drawLine(wrapped, isHeading);
  }

  const bytes = await pdf.save();
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  downloadBlob(new Blob([buffer], { type: "application/pdf" }), fileName);
}

export function printResume() {
  window.print();
}

export async function copyShareLink(resume: ResumeData) {
  const payload = btoa(unescape(encodeURIComponent(JSON.stringify({ id: resume.id, title: resume.title, updatedAt: resume.updatedAt }))));
  const url = `${window.location.origin}/preview?share=${payload}`;
  await navigator.clipboard.writeText(url);
  return url;
}
