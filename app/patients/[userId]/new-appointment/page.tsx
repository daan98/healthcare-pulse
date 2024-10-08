import { getPatient } from '@/lib/actions/patient.actions';
import AppointmentForm from '@/components/forms/AppointmentForm';
import Image from 'next/image';
import React from 'react'
import* as Sentry from "@sentry/nextjs";

const NewAppointment = async ({params : { userId }} : SearchParamProps) => {
  const patient = await getPatient(userId);

  if (patient) {
    Sentry.metrics.set("user_view_new-appointment", patient.name);
  }

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patients"
            className="mb-12 h-10 w-fit"
          />

          <AppointmentForm userId={userId} type={"create"} patientId={patient.$id} />

          <p className="copyright py-12">
            © 2024 CarePulse
          </p>
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1000}
        width={1000}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
}

export default NewAppointment;