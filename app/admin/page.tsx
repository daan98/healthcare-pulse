import { DataTable } from '@/components/table/DataTable';
import StatCard from '@/components/StatCard';
import { AppointmentsInterface, getAppointmentsList } from '@/lib/actions/appointment.action';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { columns } from '@/components/table/columns';

const Admin = async () => {

  const appointments: AppointmentsInterface = await getAppointmentsList();

  return (
    <div className='mx-auto flex max-w-7xl flex-col space-y-14'>
      <header className='admin-header'>
        <Link href="/" className='cursor-pointer'>
          <Image
            src="assets/icons/logo-full.svg"
            alt='logo'
            height={32}
            width={162}
            className='h-8 w-fit'
          />
        </Link>

        <p className="text-16-semibold">Dashboard Adminstrativo</p>
      </header>

      <main className='admin-main'>
        <section className='w-full space-y-4'>
          <h1 className="hearder">Bienvenido 👋</h1>
          <p className='text-dark-700'>Comieza el día administrando nuevas consultas</p>
        </section>

        <section className='admin-stat'>
          <StatCard
            type="scheduled"
            count={appointments.counts.scheduledCount}
            label="Citas programadas"
            icon="/assets/icons/appointments.svg"
          />
          
          <StatCard
            type="pending"
            count={appointments.counts.pendingCount}
            label="Citas pendientes"
            icon="/assets/icons/pending.svg"
          />
          
          <StatCard
            type="cancelled"
            count={appointments.counts.cancelledCount}
            label="Citas canceladas"
            icon="/assets/icons/cancelled.svg"
          />
        </section>

        <DataTable columns={columns} data={appointments.documents} />
      </main>
    </div>
  );
};

export default Admin;