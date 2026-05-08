// "use client";
// import { useState } from "react";
// import { MintedNFT } from "@my-app/shared";

// const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "0x0000";

// export function NftCard({ id, txHash, score, repos, commits, mintedAt }: MintedNFT) {
//   const [pressed, setPressed] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [showMeta, setShowMeta] = useState(false);

//   const links = [
//     {
//       label: "OpenSea",
//       url: `https://opensea.io/assets/ethereum/${CONTRACT_ADDRESS}/${id}`,
//       color: "text-blue-600",
//     },
//     {
//       label: "Rarible",
//       url: `https://rarible.com/token/ethereum/${CONTRACT_ADDRESS}:${id}`,
//       color: "text-yellow-600",
//     },
//     {
//       label: "LooksRare",
//       url: `https://looksrare.org/collections/${CONTRACT_ADDRESS}/${id}`,
//       color: "text-green-600",
//     },
//     {
//       label: "Etherscan",
//       url: `https://etherscan.io/tx/${txHash}`,
//       color: "text-gray-600",
//     },
//   ];

//   const metadata = {
//     name: `Developer NFT #${id}`,
//     description: "On-chain proof of GitHub developer activity",
//     attributes: [
//       { trait_type: "Repositories", value: repos },
//       { trait_type: "Commits", value: commits },
//       { trait_type: "Score", value: score },
//     ],
//     minted_at: mintedAt,
//     contract: CONTRACT_ADDRESS,
//     token_id: id,
//   };

//   function handleClick() {
//     setPressed(true);
//     setTimeout(() => {
//       setPressed(false);
//       setOpen(true);
//     }, 150);
//   }

//   return (
//     <>
//       <div
//         role="button"
//         tabIndex={0}
//         onClick={handleClick}
//         onKeyDown={(e) => e.key === "Enter" && handleClick()}
//         className={`border rounded-xl overflow-hidden cursor-pointer select-none transition-all duration-150 ${
//           pressed
//             ? "scale-95 border-indigo-400 bg-indigo-50"
//             : "hover:border-indigo-200 hover:bg-gray-50"
//         }`}
//       >
//         <div className="bg-indigo-50 flex items-center justify-center h-28">
//           <svg width="52" height="52" viewBox="0 0 72 72" fill="none">
//             <polygon
//               points="36,4 66,20 66,52 36,68 6,52 6,20"
//               fill="#EEEDFE"
//               stroke="#7F77DD"
//               strokeWidth="2"
//             />
//             <polygon
//               points="36,12 58,24 58,48 36,60 14,48 14,24"
//               fill="#EEEDFE"
//               stroke="#AFA9EC"
//               strokeWidth="1"
//             />
//             <text
//               x="36" y="34"
//               textAnchor="middle"
//               fontSize="10"
//               fontWeight="500"
//               fill="#3C3489"
//             >
//               DEV
//             </text>
//             <text x="36" y="46" textAnchor="middle" fontSize="8" fill="#534AB7">
//               {score} pts
//             </text>
//           </svg>
//         </div>
//         <div className="p-3">
//           <p className="font-medium text-sm mb-0.5">Dev NFT #{id}</p>
//           <p className="text-xs text-gray-400 mb-1.5">
//             {repos} repos · {commits.toLocaleString()} commits
//           </p>
//           <span className="text-xs text-indigo-600">
//             View on marketplaces →
//           </span>
//         </div>
//       </div>

//       {open && (
//         <div
//           className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
//           onClick={() => { setOpen(false); setShowMeta(false); }}
//         >
//           <div
//             className="bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-sm"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-start mb-4">
//               <div>
//                 <p className="font-medium">Dev NFT #{id}</p>
//                 <p className="text-xs text-gray-400 mt-0.5">Minted {mintedAt}</p>
//               </div>
//               <button
//                 onClick={() => { setOpen(false); setShowMeta(false); }}
//                 className="text-gray-400 hover:text-gray-600 text-lg leading-none"
//                 aria-label="Close"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="bg-gray-50 rounded-xl p-3 text-xs mb-4 space-y-1.5">
//               <div className="flex justify-between">
//                 <span className="text-gray-400">Token ID</span>
//                 <span className="font-medium">#{id}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-400">Score</span>
//                 <span className="font-medium">{score} pts</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-400">Tx hash</span>
//                 <span className="font-medium font-mono">
//                   {txHash.slice(0, 10)}...{txHash.slice(-4)}
//                 </span>
//               </div>
//             </div>

//             <p className="text-xs text-gray-400 mb-2">View on</p>
//             <div className="space-y-2 mb-3">
//               {links.map(({ label, url, color }) => (
//                 <a>
//                   key={label}
//                   href={url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition-colors"

//                   <span className={color}>{label}</span>
//                   <span className="text-gray-300 text-xs">↗</span>
//                 </a>
//               ))}
//               <button
//                 onClick={() => setShowMeta((m) => !m)}
//                 className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition-colors"
//               >
//                 <span>View metadata</span>
//                 <span className="text-gray-400 text-xs">
//                   {showMeta ? "▲" : "▼"}
//                 </span>
//               </button>
//             </div>

//             {showMeta && (
//               <pre className="bg-gray-50 rounded-xl p-3 text-xs overflow-auto max-h-48 font-mono text-gray-700 leading-relaxed">
//                 {JSON.stringify(metadata, null, 2)}
//               </pre>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
