import { CollectionConfig } from "payload/types";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    verify: {
      //token used to verify email
      generateEmailHTML: ({ token }) => {
        return `<a href=${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}>Verify account</a>`;
      },
    },
  },
  //access policy provided by our cms ensure that only the right people can see the right data in their admin
  access: {
    //anyone is able to read all the users and create a user
    read: () => true,
    create: () => true,
  },
  //filed is like an entry in a database row
  fields: [
    {
      name: "role",
      defaultValue: "user",
      required: true,
      // admin: {
      //   condition: () => false,
      // },
      type: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ],
    },
  ],
};
