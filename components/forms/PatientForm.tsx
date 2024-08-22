"use client"

import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import CustomeFormField, { FormFieldInterface } from "../CustomeFormField"
import SubmitButton from "../SubmitButton"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"
import { toast } from "sonner"

export enum FormFieldTypeEnum  {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton"
}

const PatientForm = () => {

  const [isLoading, setisLoading] = useState(false)
  const router = useRouter();

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })
 
  async function onSubmit({name, email, phone}: z.infer<typeof UserFormValidation>) {
    setisLoading(true);

    try {
      const userData : CreateUserParams = { name, email, phone };

      const user = await createUser(userData);
      
      if (user.$id) {
        router.push(`/patients/${user.$id}/register`);
      } else {
        showAlert("El correo y/o número proporcionado ya están siendo utilizados.", "info");
        setisLoading(false);
      }
    } catch (error) {
      console.log("Error while submitting the form: ",  error);
      setisLoading(false);
      showAlert("Hubo un error al enviar la información.", "error");
    }
  }

  const showAlert = (description: string, type : "error" | "info" | "warning" | "success") => {
    switch(type) {
      case "error":
        toast.error(description);
      break;

      case "info":
        toast.info(description);
      break;

      case "warning":
        toast.warning(description);
      break;

      case "success":
        toast.success(description);
      break;
    }
  };

  const fields : FormFieldInterface[] = [
    {
      control: form.control,
      fieldDescription: "Este es el nombre que se muestra al publico.",
      fieldType: FormFieldTypeEnum.INPUT,
      iconAlt: "user",
      iconSrc: "/assets/icons/user.svg",
      label: "Nombre de usuario",
      name: "name",
      placeholder: "Tecleé su nombre de usuario...",
    },
    {
      control: form.control,
      fieldDescription: "Este es el correo provisto cuando se regisrtró.",
      fieldType: FormFieldTypeEnum.INPUT,
      iconAlt: "email",
      iconSrc: "/assets/icons/email.svg",
      label: "Correo electrónico",
      name: "email",
      placeholder: "Tecleé su correo electrónico...",
    },
    {
      control: form.control,
      fieldDescription: "Número de teléfono móvil.",
      fieldType: FormFieldTypeEnum.PHONE_INPUT,
      iconAlt: "teléfono",
      label: "Número de teléfono",
      name: "phone",
      placeholder: "(123) 456-7890",
    }
  ]

  return(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Bienvenido a CarePulse 💊</h1>
          <p className="text-dark-700">Programa tu primera cita médica</p>
        </section>

        {fields.map((field, index) => (
          <CustomeFormField
            key={index}
            control={field.control}
            fieldDescription={field.fieldDescription}
            fieldType={field.fieldType}
            iconAlt={field.iconAlt}
            iconSrc={field.iconSrc}
            label={field.label}
            name={field.name}
            placeholder={field.placeholder}
            disabled={isLoading}
          />
        ))}

        <SubmitButton isLoading={isLoading}>Empecemos</SubmitButton>
      </form>
    </Form>
  );
}

export default PatientForm