"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import StatusBadge from "../StatusBadge"
import { Patient } from "@/types/appwrite.type"
import { formatDateTime } from "@/lib/utils"
import Image from "next/image"
import { Doctors } from "@/constants"
import AppointmentModal from "../AppointmentModal"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type AppointmentTable = {
  $id: string;
  status: Status;
  schedule: string | Date;
  patient: Patient;
  primaryPhysician: string;
  userId: string;
}

export const columns: ColumnDef<AppointmentTable>[] = [
  {
    header: "ID",
    cell: ({ row }) => <p className="text-14-medium">{ row.index + 1 }</p>
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => <p className="text-14-medium">{ row.original.patient.name }</p>
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="min-w-[115px]">
        <StatusBadge status={row.original.status} />
      </div>
    )
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => (
      <p className="text-14-regular min-w-[100px]">
        { formatDateTime(row.original.schedule).dateTime }
      </p>
    )
  },
  {
    accessorKey: "primaryPhysician",
    header: "Doctor",
    cell: ({ row }) => {
      const doctor = Doctors.find((doc) => doc.name === row.original.primaryPhysician)
      if (doctor) {
        return (
        <div className="flex items-center gap-3">
          <Image
            src={doctor.image!}
            alt={doctor.name!}
            height={100}
            width={100}
            className="size-8"
          />
  
          <p className="whitespace-nowrap">
            Dr. { doctor?.name }
          </p>
        </div>
        );
      } else {
        return (null)
      }
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row : {original : data} }) => {
      console.log({data});
      return (
        <div className="flex gap-1">
          <AppointmentModal
            type="schedule"
            patientId={data.patient.$id}
            appointment={data}
            userId={data.userId}
            title="Agendar Cita"
            description="Por favor confirma la siguiente información para agendar la cita."
          />
          <AppointmentModal
            type="cancel"
            patientId={data.patient.$id}
            appointment={data}
            userId={data.userId}
            title="Cancelar Cita"
            description="¿Está seguro de que desea cancelar la cita?."
          />
        </div>
        /* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir Menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copiar ID del pago
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Ver cliente</DropdownMenuItem>
            <DropdownMenuItem>Ver detalles del pago</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */
      )
    },
  },
]
