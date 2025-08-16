"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export async function setRole(formData: FormData) {
  const client = await clerkClient();
  const { sessionClaims } = await auth();

  // Check that the user trying to set the role is an admin
  if (sessionClaims?.metadata?.role !== "admin") {
    return { message: "Not Authorized" };
  }

  try {
    const res = await client.users.updateUserMetadata(
      formData.get("id") as string,
      {
        publicMetadata: { role: formData.get("role") },
      }
    );
    return { message: res.publicMetadata };
  } catch (err) {
    return { message: err };
  }
}

export async function removeRole(formData: FormData) {
  const client = await clerkClient();

  try {
    const res = await client.users.updateUserMetadata(
      formData.get("id") as string,
      {
        publicMetadata: { role: null },
      }
    );
    return { message: res.publicMetadata };
  } catch (err) {
    return { message: err };
  }
}
