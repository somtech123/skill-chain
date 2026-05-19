export const GRAPH_URL = process.env.NEXT_PUBLIC_GRAPH_URL || "";

//achievement history for a particular user

export const GET_USER_PROOFS = `query GetUserProofs($address: ID!) {
        user(id: $address) {
            id
            totalProofs
            firstSeenAt
            lastSeenAt
            proofs(orderBy: blockTimestamp, orderDirection: desc) {
                id
                achievementHash
                blockTimestamp
                blockNumber
                transactionHash
            }
        }
    }
`;

// all proofs across all users
export const GET_ALL_PROOFS = `
    query GetAllProofs($first: Int!, $skip: Int!) {
        proofs(
            first: $first
            skip: $skip
            orderBy: blockTimestamp
            orderDirection: desc
        ) {
            id
            user {
                id
            }
            achievementHash
            blockTimestamp
            transactionHash
        }
    }
`;

//all users with their proof counts
export const GET_ALL_USERS = `
    query GetAllUsers($first: Int!, $skip: Int!) {
        users(
            first: $first
            skip: $skip
            orderBy: totalProofs
            orderDirection: desc
        ) {
            id
            totalProofs
            firstSeenAt
            lastSeenAt
            proofs(orderBy: blockTimestamp, orderDirection: desc) {
                id
                achievementHash
                blockTimestamp
                transactionHash
            }
        }
    }
`;

export const GET_USERS_NFTs = `query GetUserNFTs($owner: String!) {
  nfts(where: { owner: $owner, revoked: false }) {
    id
    tokenId
    tokenURI
    achievement
    revoked
    blockTimestamp
    txHash
  }
}`;
