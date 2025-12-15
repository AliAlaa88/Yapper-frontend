export const exploreServiceMock = () => {
    return {
        getExplore: async () => {
            return {
                data: {
                    trending: [
                        {
                            text: '#WorldCup2026',
                            posts_count: 45678,
                            reference_id: 'worldcup2026',
                            category: 'sports',
                            trend_rank: 1,
                        },
                        {
                            text: '#TechConference',
                            posts_count: 23456,
                            reference_id: 'techconference',
                            category: 'none',
                            trend_rank: 2,
                        },
                        {
                            text: 'New Movie Release',
                            posts_count: 18234,
                            reference_id: 'new-movie-release',
                            category: 'entertainment',
                            trend_rank: 3,
                        },
                    ],
                    who_to_follow: [
                        {
                            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                            username: 'techenthusiast',
                            name: 'Tech Enthusiast',
                            bio: 'Passionate about technology, AI, and innovation. Sharing the latest tech news and insights.',
                            avatar_url: 'https://cdn.example.com/avatars/techenthusiast.jpg',
                            verified: true,
                            followers: 45678,
                            following: 892,
                            is_following: false,
                            is_followed_by: false,
                        },
                        {
                            id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
                            username: 'sportsanalyst',
                            name: 'Sports Analyst',
                            bio: 'Breaking down the game | Sports statistics and analysis | Former athlete',
                            avatar_url: 'https://cdn.example.com/avatars/sportsanalyst.jpg',
                            verified: true,
                            followers: 32145,
                            following: 543,
                            is_following: false,
                            is_followed_by: true,
                        },
                        {
                            id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
                            username: 'musiclover',
                            name: 'Music Lover',
                            bio: '🎵 Music is life | Playlist curator | Concert photographer',
                            avatar_url: 'https://cdn.example.com/avatars/musiclover.jpg',
                            verified: false,
                            followers: 8234,
                            following: 1205,
                            is_following: false,
                            is_followed_by: false,
                        },
                    ],
                    for_you_posts: [
                        {
                            category: {
                                id: 1,
                                name: 'Sports',
                            },
                            posts: [
                                {
                                    tweet_id: '550e8400-e29b-41d4-a716-446655440000',
                                    type: 'tweet',
                                    content:
                                        'Just scored the winning goal! ⚽ What an incredible match! #Football #Victory',
                                    images: ['https://cdn.example.com/images/goal-celebration.jpg'],
                                    videos: [],
                                    likes_count: 1247,
                                    reposts_count: 89,
                                    views_count: 5432,
                                    quotes_count: 34,
                                    replies_count: 156,
                                    bookmarks_count: 78,
                                    is_liked: false,
                                    is_reposted: false,
                                    is_bookmarked: false,
                                    created_at: '2025-11-23T10:30:00.000Z',
                                    updated_at: '2025-11-23T10:30:00.000Z',
                                    user: {
                                        id: 'c8b1f8e2-3f4a-4d2a-9f0e-123456789abc',
                                        username: 'johndoe',
                                        name: 'John Doe',
                                        avatar_url: 'https://cdn.example.com/profiles/johndoe.jpg',
                                        verified: true,
                                        bio: 'Sports enthusiast | Football lover ⚽',
                                        cover_url: 'https://cdn.example.com/covers/johndoe.jpg',
                                        followers: 15234,
                                        following: 892,
                                        is_following: false,
                                        is_followed_by: false,
                                    },
                                },
                                {
                                    tweet_id: '770f0600-g41d-63f6-c938-668877662222',
                                    type: 'tweet',
                                    content:
                                        'Breaking: Championship finals set for next week! 🏆 #Sports #Championship',
                                    images: [],
                                    videos: [
                                        'https://cdn.example.com/videos/championship-preview.mp4',
                                    ],
                                    likes_count: 892,
                                    reposts_count: 156,
                                    views_count: 3421,
                                    quotes_count: 23,
                                    replies_count: 89,
                                    bookmarks_count: 45,
                                    is_liked: false,
                                    is_reposted: false,
                                    is_bookmarked: false,
                                    created_at: '2025-11-23T08:45:00.000Z',
                                    updated_at: '2025-11-23T08:45:00.000Z',
                                    user: {
                                        id: 'd9e3f1a4-5h6c-6f4d-1h2g-345678901ghi',
                                        username: 'sportsnews',
                                        name: 'Sports News',
                                        avatar_url:
                                            'https://cdn.example.com/profiles/sportsnews.jpg',
                                        verified: true,
                                        bio: 'Breaking sports news and updates 🏆 | Official sports media',
                                        cover_url: 'https://cdn.example.com/covers/sportsnews.jpg',
                                        followers: 2456789,
                                        following: 234,
                                        is_following: true,
                                        is_followed_by: false,
                                    },
                                },
                            ],
                        },
                        {
                            category: {
                                id: 2,
                                name: 'Music',
                            },
                            posts: [
                                {
                                    tweet_id: '660e9500-f30c-52e5-b827-557766551111',
                                    type: 'tweet',
                                    content:
                                        'New album dropping tonight at midnight! 🎵 Get ready! #NewMusic #AlbumRelease',
                                    images: ['https://cdn.example.com/images/album-cover.jpg'],
                                    videos: [],
                                    likes_count: 3421,
                                    reposts_count: 567,
                                    views_count: 12890,
                                    quotes_count: 89,
                                    replies_count: 445,
                                    bookmarks_count: 234,
                                    is_liked: true,
                                    is_reposted: false,
                                    is_bookmarked: true,
                                    created_at: '2025-11-23T09:15:00.000Z',
                                    updated_at: '2025-11-23T09:15:00.000Z',
                                    user: {
                                        id: 'a7c2e9f3-4g5b-5e3c-0g1f-234567890def',
                                        username: 'musicartist',
                                        name: 'Music Artist',
                                        avatar_url: 'https://cdn.example.com/profiles/artist.jpg',
                                        verified: true,
                                        bio: '🎵 Singer | Songwriter | Producer | New album out now!',
                                        cover_url: 'https://cdn.example.com/covers/artist.jpg',
                                        followers: 567890,
                                        following: 1234,
                                        is_following: true,
                                        is_followed_by: true,
                                    },
                                },
                                {
                                    tweet_id: '770f0611-g41d-63f6-c938-668877663333',
                                    type: 'tweet',
                                    content:
                                        "Umm kulthum drops her new song Altalal today! Can't wait to listen to it. 🎶 #UmmKulthum #NewSingle",
                                    images: ['https://i.ibb.co/yctfVWJh/07-01-1971-8.jpg'],
                                    videos: [],
                                    likes_count: 8123890,
                                    reposts_count: 1432345,
                                    views_count: 25678901,
                                    quotes_count: 12345,
                                    replies_count: 67890,
                                    bookmarks_count: 45678,
                                    is_liked: true,
                                    is_reposted: true,
                                    is_bookmarked: true,
                                    created_at: '2025-11-23T07:00:00.000Z',
                                    updated_at: '2025-11-23T07:00:00.000Z',
                                    user: {
                                        id: 'e1f2g3h4-i5j6-7k8l-9m0n-567890123ghi',
                                        username: 'ummkulthum',
                                        name: 'Umm Kulthum',
                                        avatar_url: 'https://i.ibb.co/BVDLL6cc/07-01-1971.jpg',
                                        verified: true,
                                        bio: 'Iconic Egyptian singer, songwriter, and actress. The Voice of Egypt and the Arab World. 🎤',
                                        cover_url: 'https://i.ibb.co/3p1LZ5Y/umm-kulthum-cover.jpg',
                                        followers: 150000000,
                                        following: 150,
                                        is_following: false,
                                        is_followed_by: true,
                                    },
                                },
                            ],
                        },
                        {
                            category: {
                                id: 3,
                                name: 'Entertainment',
                            },
                            posts: [
                                {
                                    tweet_id: '880g1711-h52e-74g7-d049-779988773333',
                                    type: 'tweet',
                                    content:
                                        'I dont think the casual Hunger Games films fans realise how deeply traumatising and genuinely heartbreaking Sunrise on the Reaping is about to be. 🎬',
                                    images: [],
                                    videos: [],
                                    likes_count: 5621,
                                    reposts_count: 892,
                                    views_count: 18234,
                                    quotes_count: 156,
                                    replies_count: 678,
                                    bookmarks_count: 412,
                                    is_liked: false,
                                    is_reposted: true,
                                    is_bookmarked: false,
                                    created_at: '2025-11-22T18:30:00.000Z',
                                    updated_at: '2025-11-22T18:30:00.000Z',
                                    user: {
                                        id: 'e0f4g2b5-6i7d-7g5e-2i3h-456789012jkl',
                                        username: 'moviebuff',
                                        name: 'Cinema Enthusiast',
                                        avatar_url:
                                            'https://cdn.example.com/profiles/moviebuff.jpg',
                                        verified: false,
                                        bio: '🎬 Film critic | Movie reviews | Hunger Games superfan',
                                        cover_url: 'https://cdn.example.com/covers/moviebuff.jpg',
                                        followers: 8934,
                                        following: 456,
                                        is_following: false,
                                        is_followed_by: true,
                                    },
                                },
                            ],
                        },
                    ],
                },
                count: 1,
                message: 'Explore page data retrieved successfully',
            }
        },
        getTrending: async (category: String, country: String) => {
            return {
                data: [
                    {
                        text: '#WorldCup2026',
                        posts_count: 45678,
                        reference_id: 'worldcup2026',
                        category: 'sports',
                        trend_rank: 1,
                    },
                    {
                        text: '#TechConference',
                        posts_count: 23456,
                        reference_id: 'techconference',
                        category: 'none',
                        trend_rank: 2,
                    },
                    {
                        text: 'New Movie Release',
                        posts_count: 18234,
                        reference_id: 'new-movie-release',
                        category: 'entertainment',
                        trend_rank: 3,
                    },
                    {
                        text: '#ClimateAction',
                        posts_count: 15890,
                        reference_id: 'climateaction',
                        category: 'news',
                        trend_rank: 4,
                    },
                    {
                        text: 'Champions League',
                        posts_count: 12567,
                        reference_id: 'champions-league',
                        category: 'sports',
                        trend_rank: 5,
                    },
                ],
                count: 5,
                message: 'Explore trending items retrieved successfully',
            }
        },
        getExploreCategories: async (category: String) => {
            if (category === 'sports') {
                return {
                    data: [
                        {
                            text: '#WorldCup2026',
                            posts_count: 45678,
                            reference_id: 'worldcup2026',
                            category: 'sports',
                            trend_rank: 1,
                        },
                        {
                            text: 'Champions League',
                            posts_count: 12567,
                            reference_id: 'champions-league',
                            category: 'sports',
                            trend_rank: 2,
                        },
                    ],
                    message: 'Category details retrieved successfully',
                    count: 2,
                }
            } else if (category === 'news') {
                return {
                    data: [
                        {
                            text: '#ClimateAction',
                            posts_count: 15890,
                            reference_id: 'climateaction',
                            category: 'news',
                            trend_rank: 1,
                        },
                    ],
                    message: 'Category details retrieved successfully',
                    count: 1,
                }
            } else if (category === 'entertainment') {
                return {
                    data: [
                        {
                            text: 'New Movie Release',
                            posts_count: 18234,
                            reference_id: 'new-movie-release',
                            category: 'entertainment',
                            trend_rank: 1,
                        },
                    ],
                    message: 'Category details retrieved successfully',
                    count: 1,
                }
            }
            return {
                data: [],
                count: 0,
                message: 'Invalid category',
            }
        },
    }
}
