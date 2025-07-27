
import { getTeamMemberById } from "@/lib/data";
import { notFound } from "next/navigation";
import { TeamMemberForm } from "@/app/admin/(dashboard)/team/team-member-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditTeamMemberPage({ params }: { params: { id: string } }) {
  const member = await getTeamMemberById(params.id);

  if (!member) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Team Member</CardTitle>
        </CardHeader>
        <CardContent>
          <TeamMemberForm initialData={member} />
        </CardContent>
      </Card>
    </div>
  );
}
