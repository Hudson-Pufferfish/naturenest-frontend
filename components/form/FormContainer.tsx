"use client";

import { useFormState } from "react-dom";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface FormState {
  message: string;
}

interface FormContainerProps {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  children: React.ReactNode;
}

function FormContainer({ action, children }: FormContainerProps) {
  const [state, formAction] = useFormState<FormState, FormData>(action, { message: "" });
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      toast({ description: state.message });
    }
  }, [state, toast]);

  return <form action={formAction}>{children}</form>;
}

export default FormContainer;
