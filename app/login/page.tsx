import { SubmitButton } from "@/components/form/Buttons";
import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import { loginAction } from "@/utils/loginUser";
import Link from "next/link";

export default function LoginPage() {
  return (
    <section className="max-w-md mx-auto mt-16">
      <h1 className="text-2xl font-semibold mb-8 text-center">Login</h1>
      <div className="border p-8 rounded-md shadow-sm">
        <FormContainer action={loginAction}>
          <div className="space-y-4">
            <FormInput type="email" name="email" label="Email" required placeholder="Enter your email" />
            <FormInput type="password" name="password" label="Password" required placeholder="Enter your password" />
          </div>
          <SubmitButton text="Login" className="w-full mt-6" />
        </FormContainer>

        <div className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/profile/create" className="text-blue-500 hover:underline">
            Create one
          </Link>
        </div>
      </div>
    </section>
  );
}
