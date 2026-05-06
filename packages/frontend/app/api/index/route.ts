// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { IndexedRepo } from "@my-app/shared";
// import { buildIndex } from "@my-app/indexer";

// export async function GET(req: Request) {
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.accessToken) {
//     return new Response(JSON.stringify({ error: "Unauthorized" }), {
//       status: 401,
//     });
//   }
//   try {
//     const index: IndexedRepo[] = await buildIndex(session.user.accessToken);
//     return new Response(JSON.stringify({ index }), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (err: any) {
//     return new Response(JSON.stringify({ error: err.message }), {
//       status: 500,
//     });
//   }
// }
