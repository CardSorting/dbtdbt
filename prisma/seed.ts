import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clean up existing data
  await prisma.lessonCompleted.deleteMany({});
  await prisma.userAchievement.deleteMany({});
  await prisma.moduleProgress.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.module.deleteMany({});
  await prisma.achievement.deleteMany({});
  await prisma.user.deleteMany({});

  // Create achievements
  const achievements = await Promise.all([
    prisma.achievement.create({
      data: {
        id: 'first-lesson',
        name: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🎯'
      }
    }),
    prisma.achievement.create({
      data: {
        id: 'three-day-streak',
        name: 'Consistency is Key',
        description: 'Maintain a 3-day streak',
        icon: '🔥'
      }
    }),
    prisma.achievement.create({
      data: {
        id: 'mindfulness-master',
        name: 'Mindfulness Master',
        description: 'Complete all mindfulness lessons',
        icon: '🧘'
      }
    }),
    prisma.achievement.create({
      data: {
        id: 'distress-tolerance',
        name: 'Calm in the Storm',
        description: 'Complete all distress tolerance lessons',
        icon: '🌊'
      }
    }),
    prisma.achievement.create({
      data: {
        id: 'emotion-regulation',
        name: 'Emotion Expert',
        description: 'Complete all emotion regulation lessons',
        icon: '❤️'
      }
    }),
    prisma.achievement.create({
      data: {
        id: 'interpersonal',
        name: 'Relationship Navigator',
        description: 'Complete all interpersonal effectiveness lessons',
        icon: '🤝'
      }
    }),
    prisma.achievement.create({
      data: {
        id: 'dbt-graduate',
        name: 'DBT Graduate',
        description: 'Complete all modules',
        icon: '🎓'
      }
    })
  ]);

  console.log(`Created ${achievements.length} achievements`);

  // Create modules
  const mindfulnessModule = await prisma.module.create({
    data: {
      id: 'mindfulness',
      title: 'Mindfulness',
      description: 'Learn to be fully aware in the present moment',
      icon: 'mindfulness',
      color: '#9C27B0',
      unlocked: true,
      order: 1
    }
  });

  const distressToleranceModule = await prisma.module.create({
    data: {
      id: 'distress-tolerance',
      title: 'Distress Tolerance',
      description: 'Develop skills to cope with crisis situations',
      icon: 'distress-tolerance',
      color: '#FF5722',
      unlocked: false,
      order: 2
    }
  });

  const emotionRegulationModule = await prisma.module.create({
    data: {
      id: 'emotion-regulation',
      title: 'Emotion Regulation',
      description: 'Learn to understand and manage your emotions',
      icon: 'emotion-regulation',
      color: '#4CAF50',
      unlocked: false,
      order: 3
    }
  });

  const interpersonalEffectivenessModule = await prisma.module.create({
    data: {
      id: 'interpersonal-effectiveness',
      title: 'Interpersonal Effectiveness',
      description: 'Develop skills for healthy relationships and communication',
      icon: 'interpersonal-effectiveness',
      color: '#2196F3',
      unlocked: false,
      order: 4
    }
  });

  console.log(`Created 4 modules`);

  // Create lessons
  const mindfulnessLessons = await Promise.all([
    prisma.lesson.create({
      data: {
        id: 'mindfulness-intro',
        moduleId: mindfulnessModule.id,
        title: 'Introduction to Mindfulness',
        description: 'Understand what mindfulness is and why it\'s important',
        type: 'theory',
        xpReward: 10,
        order: 1,
        content: {
          text: [
            "Mindfulness is the practice of being fully present and engaged in the moment, aware of your thoughts and feelings without distraction or judgment.",
            "In DBT, mindfulness is considered a core skill and serves as the foundation for all other skills.",
            "The goal of mindfulness is to help you experience reality as it is, rather than being caught up in thoughts about the past or future.",
            "By practicing mindfulness, you can increase your ability to focus, reduce emotional reactivity, and make better choices in difficult situations."
          ]
        }
      }
    }),
    prisma.lesson.create({
      data: {
        id: 'wise-mind',
        moduleId: mindfulnessModule.id,
        title: 'Wise Mind',
        description: 'Learn to balance emotional and reasonable mind',
        type: 'theory',
        xpReward: 15,
        order: 2,
        content: {
          text: [
            "In DBT, we talk about three states of mind: reasonable mind, emotion mind, and wise mind.",
            "Reasonable mind is the logical, rational part of our thinking. It's focused on facts, planning, and analyzing.",
            "Emotion mind is when our emotions control our thinking and behavior. Our feelings drive our decisions in this state.",
            "Wise mind is the integration of both reasonable mind and emotion mind. It's the state where you can consider both facts and feelings to make balanced decisions.",
            "Finding your wise mind involves acknowledging your emotions while also thinking rationally about a situation."
          ],
          exercises: [
            {
              id: 'wise-mind-reflection',
              instructions: "Think of a recent decision you made. Which mind state were you in? How might the decision have been different if you were in wise mind?",
              type: 'reflection'
            }
          ]
        }
      }
    }),
    prisma.lesson.create({
      data: {
        id: 'what-skills',
        moduleId: mindfulnessModule.id,
        title: 'What Skills',
        description: 'Observe, describe, and participate in the present moment',
        type: 'practice',
        xpReward: 20,
        order: 3,
        content: {
          text: [
            "The 'What' skills of mindfulness are about what you do to practice mindfulness.",
            "There are three 'What' skills: Observe, Describe, and Participate.",
            "Observe: Pay attention to your experiences without trying to change them. Notice sensations, thoughts, and feelings as they come and go.",
            "Describe: Put words to your experience. Label thoughts as thoughts, emotions as emotions. For example, 'I'm having the thought that I might fail' rather than 'I'm going to fail'.",
            "Participate: Fully engage in the current activity without self-consciousness. Become one with what you're doing."
          ],
          exercises: [
            {
              id: 'observing-breath',
              instructions: "For the next minute, focus all your attention on your breathing. Notice the sensation of air moving in and out of your body. When your mind wanders, gently bring it back to your breath.",
              type: 'breathing',
              duration: 60
            }
          ]
        }
      }
    })
  ]);

  const distressToleranceLessons = await Promise.all([
    prisma.lesson.create({
      data: {
        id: 'distress-tolerance-intro',
        moduleId: distressToleranceModule.id,
        title: 'Introduction to Distress Tolerance',
        description: 'Learn what distress tolerance is and why it matters',
        type: 'theory',
        xpReward: 10,
        order: 1,
        content: {
          text: [
            "Distress tolerance skills help you cope with painful emotions and difficult situations without making things worse.",
            "These skills are particularly useful during crisis situations when you might be tempted to engage in impulsive behaviors.",
            "Distress tolerance is about accepting reality as it is in the moment, even when it's painful or uncomfortable.",
            "These skills aren't about fixing or changing the situation, but rather about surviving it without creating additional problems."
          ]
        }
      }
    }),
    prisma.lesson.create({
      data: {
        id: 'stop-skill',
        moduleId: distressToleranceModule.id,
        title: 'STOP Skill',
        description: 'Learn to stop and avoid acting impulsively',
        type: 'practice',
        xpReward: 15,
        order: 2,
        content: {
          text: [
            "The STOP skill is a crisis survival strategy that helps you avoid acting impulsively when you're emotionally overwhelmed.",
            "S - Stop. Do not move forward. Freeze. Don't act immediately based on your emotions.",
            "T - Take a step back. Take a break. Let go. Take a deep breath.",
            "O - Observe what is happening inside and outside you. What are the facts of the situation?",
            "P - Proceed mindfully with awareness. Consider your goals. Think about what will make the situation better or worse."
          ],
          scenarios: [
            {
              id: 'argument-scenario',
              situation: "You're in a heated argument with someone you care about. They've just said something that feels like a personal attack, and you feel the urge to say something hurtful back. What do you do?",
              options: [
                "Immediately respond with something equally hurtful to defend yourself",
                "Use the STOP skill: Stop, take a step back, observe your emotions, then proceed mindfully",
                "Walk away from the conversation without saying anything",
                "Tell them they're being unfair and demand an apology"
              ],
              feedback: [
                "This is likely to escalate the conflict and damage the relationship further. Acting on impulse when emotionally triggered often leads to regret later.",
                "Great choice! Using the STOP skill helps create space between your emotional trigger and your response, allowing you to choose a more effective action.",
                "While taking space can be helpful, abruptly walking away without explanation might make the situation worse. Using STOP first can help you communicate your need for space more effectively.",
                "This response comes from emotion mind and might escalate the situation. The person might not see their comment as unfair from their perspective."
              ]
            }
          ]
        }
      }
    })
  ]);

  const emotionRegulationLessons = await Promise.all([
    prisma.lesson.create({
      data: {
        id: 'emotion-regulation-intro',
        moduleId: emotionRegulationModule.id,
        title: 'Introduction to Emotion Regulation',
        description: 'Understand the purpose of emotions and how to work with them',
        type: 'theory',
        xpReward: 10,
        order: 1,
        content: {
          text: [
            "Emotion regulation skills help you understand, experience, and influence your emotions in healthy ways.",
            "These skills focus on reducing emotional vulnerability and decreasing emotional suffering.",
            "The goal is not to eliminate emotions (which is neither possible nor desirable) but to experience them in balanced, effective ways.",
            "By learning to regulate emotions, you can reduce your suffering and improve your ability to act according to your values rather than your momentary feelings."
          ]
        }
      }
    })
  ]);

  const interpersonalEffectivenessLessons = await Promise.all([
    prisma.lesson.create({
      data: {
        id: 'interpersonal-effectiveness-intro',
        moduleId: interpersonalEffectivenessModule.id,
        title: 'Introduction to Interpersonal Effectiveness',
        description: 'Learn how to maintain relationships while achieving your objectives',
        type: 'theory',
        xpReward: 10,
        order: 1,
        content: {
          text: [
            "Interpersonal effectiveness skills help you navigate relationships and interactions with others.",
            "These skills focus on maintaining relationships, maintaining self-respect, and achieving your objectives when interacting with others.",
            "They can help you ask for what you need, say no to unwanted requests, and handle conflict effectively.",
            "The goal is to become more effective in getting your needs met while also preserving relationships and your own self-respect."
          ]
        }
      }
    })
  ]);

  console.log(`Created ${mindfulnessLessons.length + distressToleranceLessons.length + emotionRegulationLessons.length + interpersonalEffectivenessLessons.length} lessons`);

  // Create a default user
  const defaultUser = await prisma.user.create({
    data: {
      id: 'default-user',
      name: 'Guest',
      streak: 0,
      skillsLearned: 0,
      xpPoints: 0,
      overallProgress: 0
    }
  });

  console.log('Created default user');

  // Connect user with achievements
  await Promise.all(
    achievements.map(achievement => 
      prisma.userAchievement.create({
        data: {
          userId: defaultUser.id,
          achievementId: achievement.id,
          earned: false
        }
      })
    )
  );

  console.log('Connected user with achievements');

  // Connect user with modules for progress tracking
  await Promise.all([
    prisma.moduleProgress.create({
      data: {
        userId: defaultUser.id,
        moduleId: mindfulnessModule.id,
        progress: 0
      }
    }),
    prisma.moduleProgress.create({
      data: {
        userId: defaultUser.id,
        moduleId: distressToleranceModule.id,
        progress: 0
      }
    }),
    prisma.moduleProgress.create({
      data: {
        userId: defaultUser.id,
        moduleId: emotionRegulationModule.id,
        progress: 0
      }
    }),
    prisma.moduleProgress.create({
      data: {
        userId: defaultUser.id,
        moduleId: interpersonalEffectivenessModule.id,
        progress: 0
      }
    })
  ]);

  console.log('Connected user with modules for progress tracking');

  console.log('Seed completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
