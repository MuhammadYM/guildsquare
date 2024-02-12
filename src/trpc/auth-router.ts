import { AuthCredentialsValidator } from "../lib/validators/account-credentials-validator";
import { publicProcedure, router } from "./trpc";
import { getPayloadClient } from "../get-payload";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const authRouter = router({
  //create a user inside our cms
  createPayloadUser: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async ({ input }) => {
      const { email, password } = input;

      //need access to our cms to create a user
      const payload = await getPayloadClient();

      //check if user already exists
      const { docs: users } = await payload.find({
        collection: "users",
        where: {
          email: {
            equals: email,
          },
        },
      });

      //if this doesn't trigger there is no user with the current email
      if (users.length !== 0) throw new TRPCError({ code: "CONFLICT" });

      //create the user
      //collection is nothing more than a table in our cms
      await payload.create({
        collection: "users",
        data: {
          email,
          password,
          role: "user",
        },
      });
      return { success: true, sentToEmail: email };
    }),

  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const { token } = input;

      //need access to our cms to verify the email
      const payload = await getPayloadClient();

      const isVerified = await payload.verifyEmail({
        collection: "users",
        token,
      });

      //if the email is not verified
      if (!isVerified) throw new TRPCError({ code: "UNAUTHORIZED" });

      return { success: true };
    }),

  signIn: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      const { res } = ctx;

      //gets access to our cms
      const payload = await getPayloadClient();

      try {
        await payload.login({
          collection: "users",
          data: {
            email,
            password,
          },
          res,
        });
        return { success: true };
      } catch (error) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
    }),
});
