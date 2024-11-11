import { SubmitButton } from "@/components/form/Buttons";
import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import { createProfileAction } from "@/utils/createUser";

async function CreateProfilePage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">Create Account</h1>
      <div className="border p-8 rounded-md">
        <FormContainer action={createProfileAction}>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <FormInput type="email" name="email" label="Email" required />
            <FormInput type="text" name="username" label="Username" required />
            <FormInput type="password" name="password" label="Password" required />
            <FormInput type="password" name="password2" label="Confirm Password" required />
            <FormInput type="text" name="firstName" label="First Name" required />
            <FormInput type="text" name="lastName" label="Last Name" required />
          </div>
          <SubmitButton text="Create Profile" className="mt-8" />
        </FormContainer>
      </div>
    </section>
  );
}

export default CreateProfilePage;
