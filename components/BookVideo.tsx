"use client";

import React from 'react'
import { Video as IKVideo } from '@imagekit/next'
import config from '@/lib/config'

const BookVideo = ({ videoUrl }: {videoUrl: string}) => {
  return (
    <IKVideo src={videoUrl} urlEndpoint={config.env.imagekit.urlEndpoint}
    controls={true}
    className="h-96 w-full rounded-xl" />
  )
}

export default BookVideo