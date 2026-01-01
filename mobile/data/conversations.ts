export type MessageType = {
  id: number;
  text: string;
  fromUser: boolean; // true if message is from current user, false if from other user
  timestamp: Date;
  time: string;
};

export type ConversationType = {
  id: number;
  user: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  lastMessage: string;
  time: string;
  timestamp: Date;
  messages: MessageType[];
};

export const CONVERSATIONS: ConversationType[] = [
  {
    id: 1,
    user: {
      name: "Malik Nguidjol",
      username: "ronin",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      verified: true,
    },
    lastMessage: "Nichts besonderes, nur ein wenig Lernen :)",
    time: "2h",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    messages: [
      {
        id: 1,
        text: "Hey, wie geht's dir?",
        fromUser: false,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        time: "5h",
      },
      {
        id: 2,
        text: "Hey! Alles gut soweit.",
        fromUser: true,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        time: "4h",
      },
      {
        id: 3,
        text: "Was machst du heute? :)",
        fromUser: true,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        time: "4h",
      },
      {
        id: 4,
        text: "Nichts besonderes, nur ein wenig Lernen :)",
        fromUser: false,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        time: "2h",
      },
    ],
  },
  {
    id: 2,
    user: {
      name: "Coffee Lover",
      username: "coffeelover",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      verified: false,
    },
    lastMessage: "See you at the meetup tomorrow! Don't forget to bring your laptop.",
    time: "2d",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    messages: [
      {
        id: 1,
        text: "Are you planning to attend the React meetup this weekend?",
        fromUser: false,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        time: "3d",
      },
      {
        id: 2,
        text: "Yes! I've been looking forward to it. Should be great networking.",
        fromUser: true,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        time: "3d",
      },
      {
        id: 3,
        text: "See you at the meetup tomorrow! Don't forget to bring your laptop.",
        fromUser: false,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        time: "2d",
      },
    ],
  },
  {
    id: 3,
    user: {
      name: "Alex Johnson",
      username: "alexj",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      verified: false,
    },
    lastMessage: "Great collaboration on the project. The demo was impressive!",
    time: "3d",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    messages: [
      {
        id: 1,
        text: "How's the progress on the mobile app project?",
        fromUser: false,
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        time: "4d",
      },
      {
        id: 2,
        text: "Going really well! Just finished the authentication flow. Want to see a demo?",
        fromUser: true,
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        time: "4d",
      },
      {
        id: 3,
        text: "Great collaboration on the project. The demo was impressive!",
        fromUser: false,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        time: "3d",
      },
    ],
  },
  {
    id: 4,
    user: {
      name: "Design Studio",
      username: "designstudio",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      verified: true,
    },
    lastMessage: "The new designs look fantastic. When can we schedule a review?",
    time: "1w",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    messages: [
      {
        id: 1,
        text: "We've finished the initial mockups for your app. They're ready for review!",
        fromUser: false,
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        time: "1w",
      },
      {
        id: 2,
        text: "Awesome! Can't wait to see them. The timeline works perfectly.",
        fromUser: true,
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        time: "1w",
      },
      {
        id: 3,
        text: "The new designs look fantastic. When can we schedule a review?",
        fromUser: false,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        time: "1w",
      },
    ],
  },
];
