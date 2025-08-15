import React from "react";
import Link from "next/link";

const Home = () => {
  return (
    <div className='container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center'>
      <h1 className='text-3xl font-semibold sm:text-4xl'>Welcome to ThreeScoreDB</h1>
      <p className='max-w-xl text-balance text-muted-foreground'>
        Explore the site or head to the admin dashboard to manage content.
      </p>
      <Link
        href='/admin'
        className='inline-block rounded-md bg-amber-600 px-4 py-2 text-white transition-colors hover:bg-amber-500'>
        Go to Dashboard
      </Link>
    </div>
  );
};

export default Home;