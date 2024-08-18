"use client"

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { Form } from '../ui/form';
import CustomeFormField from '../CustomeFormField';
import SubmitButton from '../SubmitButton';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormFieldTypeEnum } from './PatientForm';
import { SelectItem } from '../ui/select';
import Image from 'next/image';
import { Doctors } from '@/constants';
import { createAppointment, updateAppointment } from '@/lib/actions/appointment.action';
import { getAppointmentSchema } from '@/lib/validation';
import { Appointment } from '@/types/appwrite.type';

const AppointmentForm = ({
  userId,
  type,
  patientId,
  appointment,
  setOpen
} : {
  userId : string,
  type : "create" | "cancel" | "schedule",
  patientId : string,
  appointment : Appointment,
  setOpen  : (open : boolean) => void,
}) => {
  const [isLoading, setisLoading] = useState(false)
  const router = useRouter();
  const AppointmentFormValidation = getAppointmentSchema(type)

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: "",
      schedule: new Date(),
      reason: "",
      note: "",
      cancellationReason: ""
    },
  })
 
  async function onSubmit(values : z.infer<typeof AppointmentFormValidation>) {
    setisLoading(true);

    const { primaryPhysician, schedule, reason, note } = values;

    let status;
    switch (type) {
      case "cancel":
          status = "cancelled";
        break;

      case "schedule":
          status = "scheduled";
        break;
    
      default:
          status = "pending";
        break;
    }

    try {
      if (type === "create" && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician,
          schedule: new Date(schedule),
          reason: reason!,
          note,
          status: status as Status,
        }

        const appointment = await createAppointment(appointmentData);

        if (appointment) {
          form.reset();
          router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`);
        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment.$id,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            schedule: values.schedule,
            status: status as Status,
            cancellationReason:values.cancellationReason
          },
          type
        };

          const updatedAppointment = await updateAppointment(appointmentToUpdate);

          if(updatedAppointment) {
              setOpen && setOpen(false);
              form.reset();
              setisLoading(false);
          } else {
            setisLoading(false);
            // TODO ENVIAR MENSAJE DE QUE NO SE ENCONTRO LA CITA
          }
        }
      }
    catch (error) {
      setisLoading(false);
      console.log("Error while submitting the appointment form: ",  error);
    }
  }

  let buttonLabel;

  switch (type) {
    case 'cancel':
        buttonLabel = "Cancelar consulta";
      break;

    case "create":
        buttonLabel = "Crear consulta";
      break;
    
    case "schedule":
      buttonLabel = "Agendar consulta";
    break;
  
    default:
      break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">
            { 
              type === "schedule" ? 'Agendar Consulta 🩺' : 
              type === "create" ? 'Nueva Consulta 🩺' : 
              'Cancelar Consulta 🩺' 
            }
          </h1>
          <p className="text-dark-700">Concrete su cita en tan solo segundos</p>
        </section>
        
        {type !== "cancel" && (
          <>
            <CustomeFormField
              control={form.control}
              fieldType={FormFieldTypeEnum.SELECT}
              label="Doctor"
              name="primaryPhysician"
              placeholder="Seleccione un doctor"
            >
              {Doctors.map((doctor, index) => (
                <SelectItem key={index} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt={doctor.name}
                      className="rounded-full border border-dark-500"
                    />
                    <p>{ doctor.name }</p>
                  </div>
                </SelectItem>
              ))}
            </CustomeFormField>

            <CustomeFormField
              control={form.control}
              fieldType={FormFieldTypeEnum.DATE_PICKER}
              name='schedule'
              label='Fecha tentativa de consulta.'
              showTimeSelect={true}
              dateFormart='dd/MMM/yyyy h:mm aa'
            />

            <div className='flex flex-col gap-6 xl:flex-row'>
              <CustomeFormField
                control={form.control}
                fieldType={FormFieldTypeEnum.TEXTAREA}
                name='reason'
                label='Razón de la consulta.'
                placeholder='Por favor, explique la razón por la cual desea la consulta médica...'
              />

              <CustomeFormField
                control={form.control}
                fieldType={FormFieldTypeEnum.TEXTAREA}
                name='note'
                label='Comentarios adicionales.'
                placeholder='Información adicional a tomar en cuenta para la consulta...'
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomeFormField
            control={form.control}
            fieldType={FormFieldTypeEnum.TEXTAREA}
            name='cancellationReason'
            label='Razon de la cancelación.'
            placeholder='Por favor, explique por qué desea '
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}
        >
          { buttonLabel }
        </SubmitButton>
      </form>
    </Form>
  )
}

export default AppointmentForm