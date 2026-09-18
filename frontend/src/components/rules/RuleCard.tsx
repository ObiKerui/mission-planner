import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Link } from "@tanstack/react-router";
import type { Rule } from "@/entities/rules";

interface RuleCardProps {
  rule: Rule;
}

export function RuleCard({ rule }: RuleCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{rule.name}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">{rule.description}</p>

        <div className="mt-4 flex justify-end">
          <Button asChild>
            <Link to="/rules/$externalId" params={{ externalId: rule.id }}>
              View
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
