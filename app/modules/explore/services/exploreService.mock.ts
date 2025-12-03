export const exploreServiceMock = () => {
    return {
        getExplore: async () => {
            return {
                data: [],
            };
        },
        getTrending: async (category: String, country: String) => {
            return {
            data: [
                {
                  text: "#WorldCup2026",
                  posts_count: 45678,
                  reference_id: "worldcup2026",
                  category: "sports",
                  trend_rank: 1
                },
                {
                  text: "#TechConference",
                  posts_count: 23456,
                  reference_id: "techconference",
                  category: "none",
                  trend_rank: 2
                },
                {
                  text: "New Movie Release",
                  posts_count: 18234,
                  reference_id: "new-movie-release",
                  category: "entertainment",
                  trend_rank: 3
                },
                {
                  text: "#ClimateAction",
                  posts_count: 15890,
                  reference_id: "climateaction",
                  category: "news",
                  trend_rank: 4
                },
                {
                  text: "Champions League",
                  posts_count: 12567,
                  reference_id: "champions-league",
                  category: "sports",
                  trend_rank: 5
                }
            ],
            count: 5,
            message: "Explore trending items retrieved successfully"
        };
    },
}
}