export interface Cluster {
    name: string
}

export interface Block {
    name: string
    clusters: Cluster[]
}

export interface District {
    name: string
    blocks: Block[]
}

export interface State {
    name: string
    districts: District[]
}

export const INDIA_GEOGRAPHY: State[] = [
    {
        name: "Bihar",
        districts: [
            {
                name: "Patna",
                blocks: [
                    {
                        name: "Patna Sadar",
                        clusters: [{ name: "Cluster 1" }, { name: "Cluster 2" }]
                    },
                    {
                        name: "Danapur",
                        clusters: [{ name: "Cluster A" }, { name: "Cluster B" }]
                    }
                ]
            },
            {
                name: "Muzaffarpur",
                blocks: [
                    {
                        name: "Mushahari",
                        clusters: [{ name: "Cluster X" }, { name: "Cluster Y" }]
                    },
                    {
                        name: "Bochahan",
                        clusters: [{ name: "Cluster P" }, { name: "Cluster Q" }]
                    }
                ]
            }
        ]
    },
    {
        name: "Uttar Pradesh",
        districts: [
            {
                name: "Lucknow",
                blocks: [
                    {
                        name: "Chinhat",
                        clusters: [{ name: "Sector 1" }, { name: "Sector 2" }]
                    }
                ]
            },
            {
                name: "Varanasi",
                blocks: [
                    {
                        name: "Kashi",
                        clusters: [{ name: "Zone A" }, { name: "Zone B" }]
                    }
                ]
            }
        ]
    },
    {
        name: "Karnataka",
        districts: [
            {
                name: "Bangalore Urban",
                blocks: [
                    {
                        name: "North",
                        clusters: [{ name: "Hebbal" }, { name: "Yelahanka" }]
                    },
                    {
                        name: "South",
                        clusters: [{ name: "Jayanagar" }, { name: "JP Nagar" }]
                    }
                ]
            }
        ]
    }
]
