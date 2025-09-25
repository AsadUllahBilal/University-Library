"use client";

import { cn, getInitials } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Session } from 'next-auth';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

const Header = ({ session }: { session: Session | null }) => {
  const pathname = usePathname();

  return (
    <header className='my-10 flex justify-between gap-5'>
      <Link href="/">
        <Image src="/icons/logo.svg" alt='logo' width={40} height={40} />
      </Link>

      <ul className='flex flex-row items-center gap-8'>
        <li>
          <Link
            href="/library"
            className={cn(
              "text-base cursor-pointer capitalize",
              pathname === "/library" ? "text-light-200" : "text-light-100"
            )}
          >
            Library
          </Link>
        </li>

        {session && (
          <li>
            <Link href="/my-profile" className='flex items-center justify-center gap-2'>
              <Avatar>
                <AvatarFallback className='bg-[#0C8CE9] font-bebas-neue text-black text-xl'>
                  {getInitials(session?.user?.name || "")}
                </AvatarFallback>
              </Avatar>
            </Link>
          </li>
        )}
        <li className='cursor-pointer' onClick={() => signOut()}>
          <LogOut className='text-red-500'/>
        </li>
      </ul>
    </header>
  );
};

export default Header;