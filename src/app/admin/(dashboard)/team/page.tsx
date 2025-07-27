
"use client";

import { useEffect, useState, useTransition } from "react";
import { getTeamMembers, deleteTeamMember } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { TeamMember } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const { toast } = useToast();

  const fetchMembers = () => {
    setIsLoading(true);
    getTeamMembers().then((data) => {
      setMembers(data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleMemberUpdate = () => {
    startTransition(() => {
      fetchMembers();
    });
  };

  const openDeleteDialog = (member: TeamMember) => {
    setMemberToDelete(member);
    setIsAlertOpen(true);
  };

  const handleDelete = async () => {
    if (!memberToDelete) return;
    try {
      await deleteTeamMember(memberToDelete.id);
      toast({
        title: "Success!",
        description: "Team member has been deleted.",
      });
      handleMemberUpdate();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem deleting the team member.",
      });
    } finally {
      setIsAlertOpen(false);
      setMemberToDelete(null);
    }
  };

  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Team Members</h2>
          <Button asChild>
            <Link href="/admin/team/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Member
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Your Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(isLoading || isPending) ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        width={50}
                        height={50}
                        className="rounded-full object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                  <Link href={`/admin/team/${member.id}/edit`}>Edit</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => openDeleteDialog(member)}>
                                 Delete
                              </DropdownMenuItem>
                          </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              team member's profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
