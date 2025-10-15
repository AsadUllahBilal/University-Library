"use client";

import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { Button } from "@/components/ui/button";
import { Image as IKImage } from "@imagekit/next";
import config from "@/lib/config";
import { X, Eye, Trash } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { changeUserRole, deleteUser } from "@/lib/actions/user"; // 👈 import deleteUser
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export type UserInfo = {
  id: string;
  name: string;
  email: string;
  dateJoined: string;
  universityId: number;
  universityCard: string;
  role: string;
  booksBorrowed: number;
};

export const columns: ColumnDef<UserInfo>[] = [
  {
    id: "userInfo",
    header: "Name",
    cell: ({ row }) => {
      const { name, email } = row.original;
      return (
        <span className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback className="bg-[#0C8CE9]">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-medium">{name}</h1>
            <p className="text-xs text-gray-400">{email}</p>
          </div>
        </span>
      );
    },
  },
  {
    accessorKey: "universityId",
    header: "University ID",
  },
  {
    accessorKey: "dateJoined",
    header: "Date Joined",
    cell: ({ row }) => {
      const date = new Date(row.original.dateJoined);
      return <span>{date.toLocaleDateString("en-GB")}</span>;
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      const [selectedRole, setSelectedRole] = React.useState(role);

      const handleRoleChange = async (newRole: string) => {
        const previousRole = selectedRole;
        setSelectedRole(newRole);

        const result = await changeUserRole(
          row.original.id,
          newRole as "USER" | "ADMIN"
        );

        if (result.success) {
          toast.success("Role updated successfully");
        } else {
          toast.error("Failed to update role");
          setSelectedRole(previousRole);
        }
      };

      return (
        <Select value={selectedRole} onValueChange={handleRoleChange}>
          <SelectTrigger className="border-none">
            <SelectValue placeholder={role} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USER">User</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "booksBorrowed",
    header: "Books Borrowed",
    cell: ({ row }) => <span>{row.original.booksBorrowed}</span>,
  },
  {
    accessorKey: "universityCard",
    header: "University Card",
    cell: ({ row }) => {
      const cardUrl = row.original.universityCard;
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <p className="text-blue-500 cursor-pointer flex items-center gap-1">
              <Eye size={17} /> View ID Card
            </p>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader className="flex flex-row justify-between items-center">
              <AlertDialogTitle>Your ID Card</AlertDialogTitle>
              <AlertDialogCancel className="border-none cursor-pointer">
                <X />
              </AlertDialogCancel>
            </AlertDialogHeader>
            <IKImage
              src={cardUrl}
              width={1080}
              height={720}
              alt="University Card"
              urlEndpoint={config.env.imagekit.urlEndpoint}
              className="rounded object-cover w-full h-full"
            />
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;

      const handleDelete = async () => {
        const result = await deleteUser(user.id);

        if (result.success) {
          toast.success("User deleted successfully");
          // Optional: refresh page or revalidate data
          window.location.reload();
        } else {
          toast.error("Failed to delete user");
        }
      };

      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="text-red-600 cursor-pointer">
              <Trash />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete this user?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];