import { db } from '@/database/drizzle';
import { getInitials } from '@/lib/utils';
import { getServerSession, } from 'next-auth';
import React from 'react'
import authOptions from '@/lib/auth';
import { Session } from 'next-auth';
import { users } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { Image as IKImage } from '@imagekit/next';
import config from '@/lib/config';
import Vector from "@/assets/Vector.png"
import Image from 'next/image';
import Frame from "@/assets/Frame.png"
import BorrowedBookCard from '@/components/BorrowedBookCard';
import type { Metadata } from "next";

interface User {
  id: string;
  fullName: string;
  email: string;
  universityId: number;
  universityCard: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}


export async function generateMetadata(): Promise<Metadata> {
  const session: Session | null = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { title: "Bookwise - Login Required" };
  }

  const userResult = await db.select().from(users).where(eq(users.id, session.user.id));
  const user = userResult[0] as User | undefined;

  return {
    title: user ? `Bookwise - ${user.fullName}` : "Bookwise - Profile",
    description: user ? `${user.fullName}'s profile page` : "Library Management System",
  };
}

const page = async () => {
  const session: Session | null = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return <div>Please log in to view your profile.</div>;
  }

  const userResult = await db.select().from(users).where(eq(users.id, session.user.id as string));
  const user = userResult[0] as User;

  if (!user) {
    return <div>User not found.</div>;
  }

  const isVerified = user.status === 'APPROVED';

  return (
    <section className='w-[1280px] min-h-screen p-5 flex flex-wrap items-start justify-center gap-10'>
      <div className='gradient-vertical min-h-[20vh] rounded-2xl pb-10 px-10 pt-20 relative'>
        <Image src={Frame} alt='Frame Image' className='absolute -top-8 left-[45%]' />
        <div className='flex items-center gap-5'>
            <div className='w-[150px] h-[150px] rounded-full grid place-items-center bg-[#0C8CE9] font-bebas-neue text-black text-6xl border-8 border-[#24293c]'>
              {getInitials(user.fullName)}
            </div>
            <div className='flex flex-col gap-3'>
              {isVerified ? (
                <div className='flex items-center gap-2'>
                  <Image src={Vector} alt='Verify badge Image' width={20} height={20} />
                  <p className='text-gray-300'>Verified Student</p>
                </div>
              ) : (
                <p className='text-gray-300'>Unverified Student</p>
              )}
              <h1 className='text-3xl font-medium'>{user.fullName}</h1>
              <p className='text-gray-300'>{user.email}</p>
            </div>
        </div>
        <div className='mt-6 space-y-4'>
          <div>
            <p className='text-gray-300'>University</p>
            <h1 className='text-2xl text-light-100'>Bookwise</h1>
          </div>
          <div>
            <p className='text-gray-300'>Student ID</p>
            <h1 className='text-2xl text-light-100'>{user.universityId}</h1>
          </div>
          <div>
            <IKImage
            src={user.universityCard}
            width={500}
            height={300}
            alt="Univeristy Card"
            urlEndpoint={config.env.imagekit.urlEndpoint}
            className='rounded-2xl'
            />
          </div>
        </div>
      </div>
      <div className='w-1/2'>
        <h1 className='text-3xl font-medium'>Borrowed Books</h1>
          <BorrowedBookCard userId={session?.user?.id as string} />
      </div>
    </section>
  )
}

export default page