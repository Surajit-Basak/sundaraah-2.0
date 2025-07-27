
import { TeamMemberForm } from "@/app/admin/(dashboard)/team/team-member-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewTeamMemberPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Team Member</CardTitle>
        </CardHeader>
        <CardContent>
          <TeamMemberForm />
        </CardContent>
      </Card>
    </div>
  );
}
