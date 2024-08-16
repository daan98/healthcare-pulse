import { Button } from '@/components/ui/button';
import { Doctors } from '@/constants';
import { getAppointment } from '@/lib/actions/appointment.action';
import { formatDateTime } from '@/lib/utils';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Success = async ({params : {userId}, searchParams } : SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || "";
  let appointment : CreateAppointmentParams = await getAppointment(appointmentId);
  let foundDoctor = Doctors.find((doctor) => doctor.name === appointment.primaryPhysician);
  return (
    <div className='flex h-screen max-h-screen px-[5%]'>
      <div className='success-img'>
        <Link
          href="/"
        >
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt='logo'
            className='h-10 w-fit'
          />
        </Link>

        <section className='flex flex-col items-center'>
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt='success'
          />

          <h2 className='header mb-6 max-w-[600px] text-center'>
            Su cita <span className='text-green-500'>ha sido recibida</span> exitosamente.
          </h2>

          <p>Le contactaremos en breve para confirmar.</p>
        </section>

        <section className='request-details'>
          <p>Detalles de cita solicitada:</p>

          <div className='flex items-center gap-3'>
            <Image
              src={foundDoctor?.image!}
              width={100}
              height={100}
              alt='doctor'
              className='size-6'
            />

            <p className='whitespace-nowrap'>Dr. {foundDoctor?.name}</p>
          </div>

          <div className='flex gap-2'>
            <Image
              src="/assets/icons/calendar.svg"
              alt='calendar'
              width={24}
              height={24}
            />

            <p>{ formatDateTime(appointment.schedule).dateTime }</p>
          </div>
        </section>

        <Button variant="outline" className='shad-primary-btn' asChild>
          <Link href={`/patients/${userId}/new-appointment`}>
            Nueva Cita
          </Link>
        </Button>

        <p className="copyright py-12">
          © 2024 CarePulse
        </p>
      </div>
    </div>
  )
}

export default Success