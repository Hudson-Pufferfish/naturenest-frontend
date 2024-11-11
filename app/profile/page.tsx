import { getCurrentUser } from "@/utils/api";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import { getAuthToken } from "@/utils/auth";
import { Button } from "@/components/ui/button";

async function ProfilePage() {
  const token = getAuthToken();

  if (!token) {
    redirect("/login");
  }

  try {
    const user = await getCurrentUser();

    return (
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight mb-8">Profile</h1>

        <div className="bg-card text-card-foreground shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">Full Name</h2>
              <p className="text-lg font-semibold mt-1">
                {user.firstName} {user.lastName}
              </p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-muted-foreground">Username</h2>
              <p className="text-lg font-semibold mt-1">{user.username}</p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-muted-foreground">Email</h2>
              <p className="text-lg font-semibold mt-1">{user.email}</p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-muted-foreground">Member Since</h2>
              <p className="text-lg font-semibold mt-1">{format(new Date(user.createdAt), "MMMM dd, yyyy")}</p>
            </div>
          </div>

          <div className="mt-8">
            <Button variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <a href="/profile/edit">Edit Profile</a>
            </Button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    redirect("/login");
  }
}

export default ProfilePage;
