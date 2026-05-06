// frontend/app/api/mint/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DeveloperStats } from "@my-app/shared";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { stats }: { stats: DeveloperStats } = await req.json();

  // Build NFT metadata
  const metadata: {
    name: string;
    description: string;
    attributes: Array<{ trait_type: string; value: string | number }>;
  } = {
    name: `Developer NFT — ${session.user.name}`,
    description: `${stats.totalRepos} repos, ${stats.totalCommits} commits`,
    attributes: [
      { trait_type: "Repositories", value: stats.totalRepos },
      { trait_type: "Commits", value: stats.totalCommits },
      { trait_type: "Score", value: stats.score },
      ...stats.topLanguages.map(({ language, count }) => ({
        trait_type: `Language: ${language}`,
        value: count,
      })),
    ],
  };
  console.log(metadata);

  // TODO: replace with your actual minting logic
  // e.g. ethers.js, viem, thirdweb, or a contract call
  const txHash = await mintNFT(metadata);

  return new Response(JSON.stringify({ txHash }), { status: 200 });
}

// Stub — replace with real minting
async function mintNFT(metadata: object): Promise<string> {
  return "0xabc123...";
}
