import type { Tweet } from '../types'

export const dummyTweets: Tweet[] = [
    {
        id: '1',
        content: {
            text: 'Hello, world!',
            images: [
                'https://tse3.mm.bing.net/th/id/OIP.lX-ycselc93w-z5itxYbAgHaEK?cb=12ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
            ],
            videos: ['https://randomuser.me/api/portraits/men/75.jpg'],
        },
        user: {
            id: '1',
            name: 'John Doe',
            username: 'john_doe',
            avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
            link: 'https://google.com',
        },
        stats: {
            likes: 100,
            replies: 10,
            retweets: 5,
            views: 1250,
        },
        type: 'tweet',
        createdAt: '2021-01-01T08:00:00Z',
    },
    {
        id: '2',
        content: {
            text: 'Building amazing features with Vue.js! 🚀 The Composition API is a game-changer for complex components. #VueJS #WebDev',
            images: [
                'https://tse1.mm.bing.net/th/id/OIP.FHBR2TLtKAJRfkNJjgUQKQHaEK?rs=1&pid=ImgDetMain',
            ],
            videos: [],
        },
        user: {
            id: '2',
            name: 'Jane Smith',
            username: 'jane_dev',
            avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
            link: 'https://github.com/janedev',
        },
        stats: {
            likes: 45,
            replies: 8,
            retweets: 12,
            views: 890,
        },
        type: 'tweet',
        createdAt: '2023-10-15T14:30:00Z',
    },
    {
        id: '3',
        content: {
            text: 'Just deployed my first full-stack application! 🎉 Thanks to everyone who helped me along the way.',
            images: [],
            videos: [],
        },
        user: {
            id: '3',
            name: 'Alex Johnson',
            username: 'alex_codes',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            link: 'https://alexcodes.dev',
        },
        stats: {
            likes: 128,
            replies: 15,
            retweets: 23,
            views: 2100,
        },
        type: 'tweet',
        createdAt: '2023-10-16T09:15:00Z',
    },
]

export const dummyTweetDetails = {
    '1': {
        tweet: dummyTweets[0],
        replies: [
            {
                id: 'reply_1_1',
                content: {
                    text: 'Welcome to the platform! 👋',
                    images: [],
                    videos: [],
                },
                user: {
                    id: '4',
                    name: 'Sarah Wilson',
                    username: 'sarah_w',
                    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                    link: 'https://sarah.dev',
                },
                stats: {
                    likes: 5,
                    replies: 0,
                    retweets: 1,
                    views: 45,
                },
                type: 'reply' as const,
                createdAt: '2021-01-01T10:30:00Z',
            },
            {
                id: 'reply_1_2',
                content: {
                    text: 'Great to have you here! Looking forward to your posts 🚀',
                    images: [],
                    videos: [],
                },
                user: {
                    id: '5',
                    name: 'Mike Chen',
                    username: 'mike_c',
                    avatar: 'https://randomuser.me/api/portraits/men/56.jpg',
                    link: 'https://mikechen.tech',
                },
                stats: {
                    likes: 12,
                    replies: 2,
                    retweets: 0,
                    views: 78,
                },
                type: 'reply' as const,
                createdAt: '2021-01-01T11:45:00Z',
            },
        ],
    },
    '2': {
        tweet: dummyTweets[1],
        replies: [
            {
                id: 'reply_2_1',
                content: {
                    text: 'Totally agree! The Composition API has made my code so much cleaner and more reusable.',
                    images: [],
                    videos: [],
                },
                user: {
                    id: '6',
                    name: 'Emily Rodriguez',
                    username: 'emily_dev',
                    avatar: 'https://randomuser.me/api/portraits/women/89.jpg',
                    link: 'https://emilydev.com',
                },
                stats: {
                    likes: 8,
                    replies: 1,
                    retweets: 2,
                    views: 120,
                },
                type: 'reply' as const,
                createdAt: '2023-10-15T15:20:00Z',
            },
            {
                id: 'reply_2_2',
                content: {
                    text: 'Have you tried using it with TypeScript? The type inference is amazing! 💯',
                    images: [],
                    videos: [],
                },
                user: {
                    id: '7',
                    name: 'David Kim',
                    username: 'david_ts',
                    avatar: 'https://randomuser.me/api/portraits/men/91.jpg',
                    link: 'https://davidkim.dev',
                },
                stats: {
                    likes: 15,
                    replies: 0,
                    retweets: 3,
                    views: 200,
                },
                type: 'reply' as const,
                createdAt: '2023-10-15T16:10:00Z',
            },
        ],
    },
    '3': {
        tweet: dummyTweets[2],
        replies: [
            {
                id: 'reply_3_1',
                content: {
                    text: 'Congratulations! 🎉 What tech stack did you use?',
                    images: [],
                    videos: [],
                },
                user: {
                    id: '8',
                    name: 'Lisa Thompson',
                    username: 'lisa_fullstack',
                    avatar: 'https://randomuser.me/api/portraits/women/72.jpg',
                    link: 'https://lisatech.io',
                },
                stats: {
                    likes: 6,
                    replies: 1,
                    retweets: 0,
                    views: 85,
                },
                type: 'reply' as const,
                createdAt: '2023-10-16T10:30:00Z',
            },
        ],
    },
}

export const getTweetDetails = (tweetId: string) => {
    return dummyTweetDetails[tweetId as keyof typeof dummyTweetDetails] || null
}
