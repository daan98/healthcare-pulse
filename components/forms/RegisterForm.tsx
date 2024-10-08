"use client"

import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { Form, FormControl } from "@/components/ui/form"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { SelectItem } from "../ui/select"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import CustomeFormField from "../CustomeFormField"
import FileUploader from "../FileUploader"
import Image from "next/image"

import { createUser, registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldTypeEnum } from "./PatientForm"
import { PatientFormValidation, UserFormValidation } from "@/lib/validation"
import SubmitButton from "../SubmitButton"
import { toast } from "sonner"

const RegisterForm = ({ user } : {user : User}) => {

  const [isLoading, setisLoading] = useState(false)
  const router = useRouter();

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  })
 
  async function onSubmit(values : z.infer<typeof PatientFormValidation>) {
    setisLoading(true);

    let formData;

    if(values.identificationDocument && values.identificationDocument.length > 0){
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("name", values.identificationDocument[0].name);
    }
    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: values.identificationDocument ? formData : undefined,
      };

      const patient = await registerPatient(patientData);

      if(patient) {
        router.push(`/patients/${user.$id}/new-appointment`);
      }
    } catch (error) {
      console.log("Error while submitting the register form: ",  error);
      setisLoading(false);
      showAlert("Hubo un error al registrarse.", "error");
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

  return(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="space-y-4">
          <h1 className="header">Información de registro 🗒️</h1>
          <p className="text-dark-700">Cuentanos más sobre tí.</p>
        </section>
        {/* CAMPOS DE INFORMACIÓN PERSONAL */}
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Información Personal</h2>
          </div>
        </section>

        {/* Nombre del cliente */}
        <CustomeFormField
          control={form.control}
          fieldType={FormFieldTypeEnum.INPUT}
          iconAlt="user"
          iconSrc="/assets/icons/user.svg"
          label="Nombre del cliente"
          name="name"
          placeholder="Tecleé su nombre de usuario..."
        />

        {/* Email y Número de télefono */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomeFormField
            control={form.control}
            fieldType={FormFieldTypeEnum.INPUT}
            iconAlt="email"
            iconSrc="/assets/icons/email.svg"
            label="Correo electrónico"
            name="email"
            placeholder="Tecleé su correo electrónico..."
            multiField={true}
          />

          <CustomeFormField
            control={form.control}
            fieldType={FormFieldTypeEnum.PHONE_INPUT}
            iconAlt="teléfono"
            label="Número de teléfono"
            name="phone"
            placeholder="(123) 456-7890"
            multiField={true}
          />
        </div>

        {/* Fecha de nacimiento y Género */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomeFormField
            control={form.control}
            fieldType={FormFieldTypeEnum.DATE_PICKER}
            label="Fecha de nacimiento"
            name="birthDate"
            dateFormart="MMMM yyyy"
            multiField={true}
          />

          <CustomeFormField
            control={form.control}
            fieldType={FormFieldTypeEnum.SKELETON}
            label="Género"
            name="gender"
            multiField={true}
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-[10px] xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {GenderOptions.map((option) => (
                    <div
                      key={option}
                      className="radio-group"
                    >
                      <RadioGroupItem
                        value={option}
                        id={option}
                      />
                      <Label
                        htmlFor={option}
                        className="cursor-pointer"
                      >
                        { option === "male" ? "Masculino" : option == "female" ? "Femenino" : "Otro" }
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        {/* Dirección y Ocupación */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomeFormField
            control={form.control}
            fieldType={FormFieldTypeEnum.INPUT}
            label="Dirección"
            name="address"
            placeholder="Tecleé su dirección..."
            multiField={true}
          />

          <CustomeFormField
            control={form.control}
            fieldType={FormFieldTypeEnum.INPUT}
            label="Ocupación"
            name="occupation"
            placeholder="Tecleé su ocupación..."
            multiField={true}
          />
        </div>

        {/* Nombre de contacto de emergencia y Número de contacto de emergencia */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomeFormField
            control={form.control}
            fieldType={FormFieldTypeEnum.INPUT}
            label="Nombre del contacto de emergencia"
            name="emergencyContactName"
            placeholder="Nombre del contacto..."
            multiField={true}
          />

          <CustomeFormField
            control={form.control}
            fieldType={FormFieldTypeEnum.PHONE_INPUT}
            label="Número de contacto de emergencia"
            name="emergencyContactNumber"
            placeholder="(123) 456-7890"
            multiField={true}
          />
        </div>

        {/* CAMPOS DE INFORMACIÓN MÉDICA */}
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Información Médica</h2>
          </div>
        </section>

        {/* Doctor primario */}
        <CustomeFormField
          control={form.control}
          fieldType={FormFieldTypeEnum.SELECT}
          label="Doctor primario"
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

        {/* Proveedor de seguros  y Número de poliza de seguro */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomeFormField
            control={form.control}
            fieldType={FormFieldTypeEnum.INPUT}
            label="Proveedor de seguros"
            name="insuranceProvider"
            placeholder="Tecleé su proveedor de seguros..."
            multiField={true}
          />

          <CustomeFormField
            control={form.control}
            fieldType={FormFieldTypeEnum.INPUT}
            label="Número de poliza de seguro"
            name="insurancePolicyNumber"
            placeholder="ABCDE12345"
            multiField={true}
          />
        </div>

        {/* Alergías y Medicación actual */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomeFormField
            control={form.control}
            fieldType={FormFieldTypeEnum.TEXTAREA}
            label="Alergías (Si las hay)"
            name="allergies"
            placeholder="Tecleé todas los productos y alimentos a los que pueda ser alérgico(a)..."
            multiField={true}
          />

          <CustomeFormField
            control={form.control}
            fieldType={FormFieldTypeEnum.TEXTAREA}
            label="Medicación actual (Si la hay)"
            name="currentMedication"
            placeholder="Por favor, escriba el nombre del medicamento, cantidad y horario de ingesta..."
            multiField={true}
          />
        </div>

        {/* Historia médica familiar e Historial médico pasado */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomeFormField
            control={form.control}
            fieldType={FormFieldTypeEnum.TEXTAREA}
            label="Historia médica familiar"
            name="familyMedicalHistory"
            placeholder="Tecleé las enfermedades o condiciones que hayan tenido o tengan actualmente sus familiares..."
            multiField={true}
          />

          <CustomeFormField
            control={form.control}
            fieldType={FormFieldTypeEnum.TEXTAREA}
            label="Historial médico pasado"
            name="pastMedicalHistory"
            placeholder="Por favor, tecleé a detalle todo su historial medico..."
            multiField={true}
          />
        </div>

        {/* CAMPOS DE IDENTIFICACIÓN Y VERIFICACIÓN */}
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identificación y Verificación</h2>
          </div>
        </section>

        {/* Tipo de identificación */}
        <CustomeFormField
          control={form.control}
          fieldType={FormFieldTypeEnum.SELECT}
          label="Tipo de identificación"
          name="identificationType"
          placeholder="Seleccione su identificación..."
        >
          {IdentificationTypes.map((type, index) => (
            <SelectItem key={index} value={type}>
              { type }
            </SelectItem>
          ))}
        </CustomeFormField>

        {/* Número de identificación */}
        <CustomeFormField
          control={form.control}
          fieldType={FormFieldTypeEnum.INPUT}
          label="Número de identificación"
          name="identificationNumber"
          placeholder="123456789"
        />

        {/* URL del documento de identificación */}
        <CustomeFormField
          control={form.control}
          fieldType={FormFieldTypeEnum.SKELETON}
          label="Copia escaneada de documento de identificación seleccionado"
          name="identificationDocumentUrl"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />

        {/* CAMPOS DE CONSENTIMIENTO Y PRIVACIDAD */}
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consentimiento y privacidad</h2>
          </div>
        </section>

        {/* Tratamiento */}
        <CustomeFormField
          fieldType={FormFieldTypeEnum.CHECKBOX}
          control={form.control}
          name="treatmentConsent"
          label="Acepto el tratamiento."
        />
        
        {/* Divulgación de información */}
        <CustomeFormField
          fieldType={FormFieldTypeEnum.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="Acepto la política de divulgación de información."
        />

        {/* Política de privacidad */}
        <CustomeFormField
          fieldType={FormFieldTypeEnum.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="Acepto la politica de privacidad."
        />

        <SubmitButton isLoading={isLoading}>Registrarse</SubmitButton>
      </form>
    </Form>
  );
}

export default RegisterForm