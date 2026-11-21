export type PublishedTool = {
  title: string;
  kind: string;
  href: string;
  summary: string;
  published?: string;
  publishedLabel?: string;
};

export const publishedTools: PublishedTool[] = [
  {
    title: 'Video GIF Export',
    kind: 'Figma plugin',
    href: 'https://www.figma.com/community/plugin/1693631974036211787/video-gif-export',
    summary: 'Export a Figma selection as a video or a GIF.'
  }
];

export type PostSection = {
  heading?: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  /** Up to two short topic tags shown as an eyebrow. */
  tags: [string] | [string, string];
  published: string;
  publishedLabel: string;
  description: string;
  /** Optional Substack note/post for “Read on Substack”. */
  substackUrl?: string;
  sections: PostSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'battle-of-balance',
    title: 'Battle of Balance',
    tags: ['Philosophy', 'Systems'],
    published: '2026-11-13',
    publishedLabel: '13 November 2026',
    description: 'Change is the constant. Balance is the pursuit.',
    substackUrl:
      'https://substack.com/@vittesh/note/c-390425740?r=x5tqe&utm_source=notes-share-action&utm_medium=web',
    sections: [
      {
        paragraphs: [
          'Change is the constant. Balance is the pursuit.',
          'I have been thinking about balance for a very long time, and I can’t say exactly when it started. The first time I really stopped on it was while reading Kapil Gupta. I have read two of his books and a lot of commentary on him, and one idea stayed with me: society hands each of us a set of prescriptions about how to live, and if you keep them exactly as they are, you never outgrow them.',
          'Balance, I realised, is one of the most popular prescriptions of all. Work-life balance, a balanced diet, a balanced mind: each one is offered as a place you reach and then stay in. I never quite believed that.',
          'What I believe instead is simpler. Balance is something the world keeps pursuing and never finishes. Change is the constant, and balance is the pursuit, which makes the whole thing a kind of battle.',
          'I want to be clear about what that is. It is not a law of physics, and I am not claiming to have found something nobody saw before. Heraclitus said something close to it more than two thousand years ago. I am offering a way of looking and asking what we see when we apply it to different parts of the world. I also use the word “battle” carefully, because nothing in nature is fighting for a cause. I mean a contest between processes with no one directing it, which over a long time still ends up with winners, losers and things that disappear.'
        ]
      },
      {
        heading: 'An old pattern',
        paragraphs: [
          'The shape of the idea comes from Hindu philosophy, in the Trimurti. Brahma creates, Vishnu sustains and Shiva dissolves. Different traditions read these three in different ways, and I am not trying to settle that. I am borrowing the pattern, because I see it everywhere.',
          'The three do not take turns. In anything alive, all three are working at the same time. Something new is always being made, something is always being kept in place, and something is always being let go. Each one also has a risk we tend to miss. Letting go is not only loss, because it often clears the ground for what comes next. Keeping things is not only good, because it can hold on to structures that stopped being useful a long time ago. So in my reading, Vishnu alone is not balance. Balance is what we see when all three keep pulling against each other and the result holds for a while.'
        ]
      },
      {
        heading: 'The slow contest',
        paragraphs: [
          'Take the time of the dinosaurs. For tens of millions of years it looked completely stable. Huge animals ruled the land, plants and grazers shaped each other, and predators and prey kept each other in check. If you could have watched for a thousand years, you would have called it a settled order. But underneath, species were rising and fading and nothing was ever finished. It was a contest moving too slowly for any one observer to notice.',
          'Then, about sixty-six million years ago, the arrangement ended. An asteroid hit the Earth, and large volcanic eruptions in what is now India were happening around the same time. Scientists still debate how much each one contributed, but for my point it doesn’t matter. Change can come from outside a system or build up inside it, and either way the old arrangement can’t hold. The small mammals that took over weren’t winners of the earlier struggle. They happened to be small, many of them lived underground, and they could survive on very little, and that mattered once everything changed.',
          'Two details I like. The dinosaurs didn’t fully disappear, because birds are living dinosaurs, so the line carried on in a different form. And the empty world didn’t stay empty. A new set of contests started almost immediately among the survivors, and after a while that arrangement looked stable too. The end of one balance was the start of the next pursuit.',
          'It would be easy to read this as a story about the best surviving, and I don’t think it is. What lasts is what fits the moment, which is not the same as what is good. An unfair arrangement can stay stable for centuries without becoming any fairer, and lasting has never made anything right. Nature is indifferent to that. I haven’t managed to be.',
          'There is an obvious objection: doesn’t everything eventually reach equilibrium? Some things do. A cup of coffee cools to room temperature and stays there, and the universe as a whole may end up in a final, featureless state. But look at what that state is. No change, no structure, no struggle. The physicist Ilya Prigogine showed that order, including life, appears in systems held far from equilibrium, kept going by a constant flow of energy and by processes pushing against each other. Stars, storms, cells and ecosystems exist because they are not at rest. A system that has stopped struggling has, in a real sense, stopped existing.'
        ]
      },
      {
        heading: 'The company that keeps launching',
        paragraphs: [
          'The same pattern shows up in companies, and one of the clearest examples is Google, with its famous graveyard of shut-down products. It is easy to read that as proof of a healthy cycle: create boldly, keep what works, let go of what doesn’t. I think the real story is less flattering.',
          'Search and advertising make so much money that Google can fail again and again without real consequences, which says more about its wealth than its skill at letting go. Many of those shutdowns weren’t careful pruning. Some products were launched with a lot of noise, given too little commitment and then quietly dropped, which is closer to a failure of sustaining than good dissolving. There was also a cost. People and developers learned to think twice before depending on anything new from the company, so the habit of destroying slowed down the creating.',
          'The lesson I take from it is about quality, not quantity. Retiring something on purpose, with care for the people who relied on it, is very different from just walking away. In most organisations, creating gets celebrated because launches are exciting, and sustaining gets respected because maintenance feels responsible, but letting go gets no credit. A product retired well leaves nothing to point at. A company doesn’t need equal effort on all three, but it needs to notice which one it has been ignoring.'
        ]
      },
      {
        heading: 'A correction that never finishes',
        paragraphs: [
          'The pattern shows up almost literally in how machines learn. A machine learning model is trained by measuring how wrong it is, adjusting to be slightly less wrong, and repeating that thousands or millions of times. The error gets smaller but never reaches zero, and if it somehow did, that would be a warning sign, because a model that fits its past data perfectly has usually memorised it and will fail on anything new. Perfect balance with the past is a failure in the future.',
          'There is a bigger version of this for people. AI is changing faster than the things meant to correct it: laws, institutions, safety research and public understanding. With earlier technologies, the corrections, like labour protections and nuclear safeguards, usually arrived late and often after real harm. People who study technology governance have described this gap for a long time, and I am not the first to see it. What this way of looking adds is a simple frame: the trouble sits in the distance between how fast change moves and how fast correction can follow.',
          'I don’t want to make any of this sound comforting. The idea doesn’t say AI will turn out well because balance always returns. It only says a new arrangement will form, and that arrangement could be fair or cruel, wise or reckless. Collapse is also an arrangement.'
        ]
      },
      {
        heading: 'Keep moving',
        paragraphs: [
          'Einstein put it better than I can. In a letter to his son Eduard in 1930, he compared life to riding a bicycle: to keep your balance, you have to keep moving. A bicycle standing still falls over, while a moving one is kept upright by a lot of small corrections the rider hardly notices.',
          'Once I started looking for this, I couldn’t stop seeing it, and the funniest example is one we all do without thinking. Walking, seen from a different angle, is nothing but stopping yourself from crashing. You lean forward, gravity starts pulling you down, and just before you hit the ground you swing a foot out and catch yourself. Then you do it again with the other foot. Every step is a small fall you refuse to finish. We call it a walk in the park, but it is really an argument with gravity that we win thousands of times a day, and lose now and then on a wet staircase.',
          'None of it is calm, and yet it is the most ordinary balance we know. We never get to a point where we are balanced and can stop correcting, because the balance is the correcting. Design works the same way. A system that never changes becomes irrelevant, and one that changes all the time loses the familiarity that made it useful, so the skill is knowing, again and again, what to add, what to keep and what to let go of.'
        ]
      },
      {
        heading: 'Where I’m leaving it',
        paragraphs: [
          'I am not going to wrap this up, because I don’t think it can be wrapped up. There is a passage in the fourth chapter of the Bhagavad Gita where Krishna says he appears whenever righteousness declines and its opposite rises, in order to restore it. The text speaks of a divine purpose, which is more than I am claiming, and the thought that excess creates its own opposing force is my reading, not the verse’s. But when order is restored, is that the end, or only the next stage?',
          'The world does not reach balance and then stop changing. It changes, and the pursuit goes on, one caught fall at a time.'
        ]
      }
    ]
  }
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
