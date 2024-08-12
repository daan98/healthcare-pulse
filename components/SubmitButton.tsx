import React from 'react'
import { Button } from './ui/button';
import Image from 'next/image';

interface ButtonProps {
  children  : React.ReactNode;
  className ?: string;
  isLoading : boolean;
}

const SubmitButton = ({isLoading, className, children} : ButtonProps) => {
  return (
    <Button
      type='submit'
      disabled={isLoading}
      className={className ?? "shad-primary-btn w-full"}
    >
      {isLoading ? (
        <div className='flex gap-x-2.5'>
          <Image
            src="/assets/icons/loader.svg"
            alt='loader'
            width={24}
            height={24}
            className='animate-spin'
          />
          Loading...
        </div>
      ) : children}
    </Button>
  )
}

export default SubmitButton