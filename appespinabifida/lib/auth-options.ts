import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const hasGoogleCredentials =
	Boolean(process.env.GOOGLE_CLIENT_ID) && Boolean(process.env.GOOGLE_CLIENT_SECRET);

export const authOptions: NextAuthOptions = {
	providers: hasGoogleCredentials
		? [
				GoogleProvider({
					clientId: process.env.GOOGLE_CLIENT_ID as string,
					clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
				}),
			]
		: [],
	pages: {
		signIn: "/",
	},
	secret: process.env.NEXTAUTH_SECRET,
};
