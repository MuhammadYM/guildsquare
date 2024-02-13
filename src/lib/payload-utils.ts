import { NextRequest } from "next/server";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { User } from "../payload-types";

/**
 * A function we can call asynchronously from the server to get the currently
 * Logged in user
 */
export const getServerSideUser = async (
  cookies: NextRequest["cookies"] | ReadonlyRequestCookies
) => {
  const token = cookies.get("payload-token")?.value;
  //our cms has automatically createad this endpoint for us, we can just query or fetch from it to get the currently logged in user
  const meRes = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );

  const { user } = (await meRes.json()) as { user: User | null };

  return { user };
};
