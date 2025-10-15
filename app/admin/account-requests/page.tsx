import React from "react";
import { UserApprvalTable } from "@/components/admin/tables/accountApproval/data-table";
import { getPendingUsers } from "@/lib/getDataFromDB";

const Page = async () => {
  const { data } = await getPendingUsers();

  // 🔑 Transform DB users into table format
  const tableData = data?.map((user: any) => ({
    id: user.id,
    name: user.fullName,
    email: user.email,
    dateJoined: new Date(user.createdAt).toLocaleDateString(),
    universityId: user.universityId,
    universityCard: user.universityCard,
    status: user.status,
  })) || [];

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Account Registration Requests</h2>
        <UserApprvalTable data={tableData} />
      </div>
    </section>
  );
};

export default Page;