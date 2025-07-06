import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import EmailProvider from "next-auth/providers/email";
// import AppleProvider from "next-auth/providers/apple"; // Apple needs extra config

export const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		// EmailProvider({
		//   server: process.env.EMAIL_SERVER!,
		//   from: process.env.EMAIL_FROM!,
		// }),
		// AppleProvider({ ... }) // Uncomment & configure if needed
	],
	secret: process.env.NEXTAUTH_SECRET,
	// You can customize callbacks, pages, database, etc. here
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
