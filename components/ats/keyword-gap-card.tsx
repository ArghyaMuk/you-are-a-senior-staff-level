import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function KeywordGapCard({
  missing,
  present
}: {
  missing: string[];
  present: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Keyword Gap</CardTitle>
        <CardDescription>High-signal words from the job description compared with your resume.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold">Missing</h4>
            <span className="text-xs text-muted-foreground">{missing.length} gaps</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {missing.length ? missing.map((keyword) => <Badge key={keyword} variant="warning">{keyword}</Badge>) : <Badge variant="success">No major gaps</Badge>}
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold">Present</h4>
            <span className="text-xs text-muted-foreground">{present.length} matched</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {present.map((keyword) => (
              <Badge key={keyword} variant="secondary">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
