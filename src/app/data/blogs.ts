export type BlogPost = {
  id: string;
  title: string;
  subtitle: string;
  platform: string;
  readTime: string;
  href: string;
};

export const techBlogs: BlogPost[] = [
  {
    id: 'business-operating-system',
    title: 'The Business Operating System Is About to Change',
    subtitle: 'How MCP, A2A, and controlled autonomy could change the way companies run.',
    platform: 'Medium',
    readTime: '8 min read',
    href: 'https://medium.com/@arnav.sharma1300/the-business-operating-system-is-about-to-change-4df7f3e7beb2?sharedUserId=arnav.sharma1300',
  },
];
