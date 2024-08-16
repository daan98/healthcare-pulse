"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { decryptKey, encryptKey } from "@/lib/utils";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { env } from "process";
import { useEffect, useState } from "react";


const PasskeyModal = () => {
  const [open, setOpen] = useState(true);
  const [passkey, setPasskey] = useState("")
  const [error, setError] = useState("");
  const router = useRouter();
  const accessKey = typeof window !== "undefined" ? window.localStorage.getItem("accessKey") : null;
  const path = usePathname();
  
  /* Check if accesKey exist in the local storage to let admin users go to the admin page */
  useEffect(() => {
    const decryptAccessKey = accessKey && decryptKey(accessKey);
    if (path && decryptAccessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      setOpen(false);
      router.push("/admin")
    } else {
      setOpen(true);
    }
  }, [accessKey]);

  /* Check if escape (Esc) button is clicked to close the modal in the action */
  useEffect(() => {
    document.addEventListener("keydown", handleScapeClicked);

    /* Avoiding memory leaks */ 
    return () => {
      document.removeEventListener("keydown", handleScapeClicked);
    };
  }, [])
  

  const closeModal = () => {
    setOpen(false);
    router.push("/");
  };

  const validatePassKey = (e : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      const encryptedKey = encryptKey(passkey);
      
      localStorage.setItem("accessKey", encryptedKey);

      setOpen(false);
    } else {
      setError("Clave de acceso invalida, Por favor vuelva a intentarlo.");
    }
  };

  const handleScapeClicked = (event : any) => {
    if (event.key === "Escape") closeModal();
  };

  return(
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            Acceso de verificación para administradores
            <Image
              src="/assets/icons/close.svg"
              height={20}
              width={20}
              onClick={() => closeModal()}
              className="cursor-pointer"
              alt="close"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            Para acceder a la página de administración, por favor introduzca la clave de acceso
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div>
        <InputOTP maxLength={6} value={passkey} onChange={(value) => setPasskey(value)}>
          <InputOTPGroup className="shad-otp">
            <InputOTPSlot className="shad-otp-slot" index={0} />
            <InputOTPSlot className="shad-otp-slot" index={1} />
            <InputOTPSlot className="shad-otp-slot" index={2} />
            <InputOTPSlot className="shad-otp-slot" index={3} />
            <InputOTPSlot className="shad-otp-slot" index={4} />
            <InputOTPSlot className="shad-otp-slot" index={5} />
          </InputOTPGroup>
        </InputOTP>

        {error && <p className="shad-error text-14-regular mt-4 flex justify-center">{error}</p>}
        </div>

        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => validatePassKey(e)}
            className="shad-primary-btn w-full"
          >
            Intrudcir clave de acceso
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PasskeyModal;