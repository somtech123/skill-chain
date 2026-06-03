// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export async function GET(req: Request) {
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.accessToken) {
//     return new Response(JSON.stringify({ error: "Unauthorized" }), {
//       status: 401,
//     });
//   }
//   return new Response(
//     JSON.stringify({
//       connected: session.user.githubConnected,
//     }),
//   );
// }
