import { checkRole, isSignedIn } from "@/utils/roles";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

const Home = async () => {
  const userIsSignedIn = await isSignedIn();
  const userIsAdmin = await checkRole("admin");

  if (userIsAdmin) {
    redirect("/admin");
  }

  return (
    <div className='container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center'>
      <h1 className='text-3xl font-semibold sm:text-4xl'>
        Welcome to ThreeScoreDB
      </h1>

      {userIsSignedIn && !userIsAdmin ? (
        // User is signed in but not an admin
        <div className='max-w-xl space-y-4'>
          <p className='text-balance text-muted-foreground'>
            You are signed in, but you don&apos;t have access to the Admin
            dashboard.
          </p>
          <p className='text-sm text-muted-foreground'>
            Please contact an administrator if you need admin access.
          </p>
        </div>
      ) : (
        // User is not signed in
        <div className='max-w-xl space-y-4'>
          <p className='text-balance text-muted-foreground'>
            Explore the site or sign in to access the admin dashboard.
          </p>
          {!userIsSignedIn && (
            <Link
              href='/sign-in'
              className='inline-block rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-500'>
              Sign In
            </Link>
          )}
        </div>
      )}

      <div className='mt-6 flex items-center gap-3 pl-3'>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Home;
