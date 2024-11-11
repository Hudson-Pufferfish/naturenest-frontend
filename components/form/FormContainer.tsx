"use client";

import { useFormState } from "react-dom";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { actionFunction } from "@/utils/types";
import { useRouter } from "next/navigation";

interface FormState {
  message: string;
  success?: boolean;
}

const initialState: FormState = {
  message: "",
  success: false,
};

function FormContainer({ action, children }: { action: actionFunction; children: React.ReactNode }) {
  const [state, formAction] = useFormState(action, initialState);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (state.message) {
      toast({
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });

      if (state.success) {
        // Wait a brief moment for the toast to be visible
        setTimeout(() => {
          router.push("/profile");
        }, 1000);
      }
    }
  }, [state, toast, router]);

  return <form action={formAction}>{children}</form>;
}

export default FormContainer;
