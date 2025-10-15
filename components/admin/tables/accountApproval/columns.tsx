"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Image as IKImage } from "@imagekit/next";
import config from "@/lib/config";
import { X, Eye, CircleX, CircleAlert, CircleCheck } from "lucide-react";
import { approveUser, rejectUser } from "@/lib/actions/user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export type UserInfo = {
  id: string;
  name: string;
  email: string;
  dateJoined: string;
  universityId: number;
  universityCard: string;
  status: string;
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
    accessorKey: "dateJoined",
    header: "Date Joined",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={`text-sm font-semibold ${
            status === "REJECTED" ? "text-red-600" : "text-green-600"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      const router = useRouter();

      if (user.status === "Rejected") return null;

      const handleApprove = async () => {
        const result = await approveUser(user.id);
        result.success
          ? toast.success(result.message)
          : toast.error(result.error);
        router.refresh();
      };

      const handleReject = async () => {
        const result = await rejectUser(user.id);
        result.success
          ? toast.success(result.message)
          : toast.error(result.error);
        router.refresh();
      };

      return (
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                className="bg-green-100 cursor-pointer font-medium text-green-600 hover:bg-green-200"
              >
                Approve
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader className="flex items-end">
                <AlertDialogCancel className="border-none cursor-pointer">
                  <X size={20} />
                </AlertDialogCancel>
              </AlertDialogHeader>
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-[80%] h-[80%] bg-green-400 rounded-full flex items-center justify-center">
                    <CircleCheck size={27} className="text-white" />
                  </div>
                </div>
                <h1 className="text-2xl font-semibold">Approve User Request</h1>
                <p className="text-[#64748B] text-center">
                  Approve the student’s account request and grant access. A
                  confirmation email will be sent upon approval.
                </p>
                <AlertDialogCancel
                  className="w-full border-none bg-green-400 hover:bg-green-500 hover:text-white transition-all duration-300 cursor-pointer text-white font-semibold"
                  onClick={handleApprove}
                >
                  Approve & Send Confirmation
                </AlertDialogCancel>
              </div>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-600 cursor-pointer hover:text-red-700 transition-all duration-300"
              >
                <CircleX className="h-6 w-6" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader className="flex items-end">
                <AlertDialogCancel className="border-none cursor-pointer">
                  <X size={20} />
                </AlertDialogCancel>
              </AlertDialogHeader>
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center">
                  <div className="w-[80%] h-[80%] bg-red-400 rounded-full flex items-center justify-center">
                    <CircleAlert size={27} className="text-white" />
                  </div>
                </div>
                <h1 className="text-2xl font-semibold">Deny User Request</h1>
                <p className="text-[#64748B] text-center">
                  Denying this request will notify the student they’re not
                  eligible due to unsuccessful ID card verification.
                </p>
                <AlertDialogCancel
                  className="w-full border-none bg-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer text-white font-semibold"
                  onClick={handleReject}
                >
                  Deny & Notify Student
                </AlertDialogCancel>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
