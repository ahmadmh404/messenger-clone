import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...\n");

  // Clear existing data (optional - remove if you want to keep existing data)
  console.log("🗑️  Clearing existing data...");
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Existing data cleared\n");

  // Hash password for users
  const hashedPassword = await bcrypt.hash("Password123!", 12);

  // Create Users
  console.log("👤 Creating users...");
  const user1 = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      hashedPassword: hashedPassword,
      image:
        "https://res.cloudinary.com/dkqom5jm4/image/upload/v1699123456/samples/people/john.jpg",
      emailVerified: new Date(),
    },
  });
  console.log(`✅ Created user: ${user1.name} (${user1.email})`);

  const user2 = await prisma.user.create({
    data: {
      name: "Jane Smith",
      email: "jane@example.com",
      hashedPassword: hashedPassword,
      image:
        "https://res.cloudinary.com/dkqom5jm4/image/upload/v1699123456/samples/people/jane.jpg",
      emailVerified: new Date(),
    },
  });
  console.log(`✅ Created user: ${user2.name} (${user2.email})`);

  const user3 = await prisma.user.create({
    data: {
      name: "Bob Johnson",
      email: "bob@example.com",
      hashedPassword: hashedPassword,
      image:
        "https://res.cloudinary.com/dkqom5jm4/image/upload/v1699123456/samples/people/bob.jpg",
      emailVerified: new Date(),
    },
  });
  console.log(`✅ Created user: ${user3.name} (${user3.email})`);

  const user4 = await prisma.user.create({
    data: {
      name: "Alice Williams",
      email: "alice@example.com",
      hashedPassword: hashedPassword,
      image:
        "https://res.cloudinary.com/dkqom5jm4/image/upload/v1699123456/samples/people/alice.jpg",
      emailVerified: new Date(),
    },
  });
  console.log(`✅ Created user: ${user4.name} (${user4.email})`);

  const user5 = await prisma.user.create({
    data: {
      name: "Charlie Brown",
      email: "charlie@example.com",
      hashedPassword: hashedPassword,
      image:
        "https://res.cloudinary.com/dkqom5jm4/image/upload/v1699123456/samples/people/charlie.jpg",
      emailVerified: new Date(),
    },
  });
  console.log(`✅ Created user: ${user5.name} (${user5.email})`);
  console.log("");

  // Create Direct Conversations
  console.log("💬 Creating direct conversations...");

  // Conversation 1: John and Jane
  const conversation1 = await prisma.conversation.create({
    data: {
      isGroup: false,
      userIds: [user1.id, user2.id],
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
  });
  console.log(
    `✅ Created conversation between ${user1.name} and ${user2.name}`,
  );

  // Conversation 2: John and Bob
  const conversation2 = await prisma.conversation.create({
    data: {
      isGroup: false,
      userIds: [user1.id, user3.id],
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
  });
  console.log(
    `✅ Created conversation between ${user1.name} and ${user3.name}`,
  );

  // Conversation 3: Jane and Alice
  const conversation3 = await prisma.conversation.create({
    data: {
      isGroup: false,
      userIds: [user2.id, user4.id],
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
  });
  console.log(
    `✅ Created conversation between ${user2.name} and ${user4.name}`,
  );
  console.log("");

  // Create Group Conversation
  console.log("👥 Creating group conversations...");

  const groupConversation = await prisma.conversation.create({
    data: {
      name: "Project Team",
      isGroup: true,
      userIds: [user1.id, user2.id, user3.id, user4.id],
      lastMessageAt: new Date(),
    },
  });
  console.log(
    `✅ Created group conversation: "${groupConversation.name}" with ${user1.name}, ${user2.name}, ${user3.name}, ${user4.name}`,
  );
  console.log("");

  // Create Messages for Conversation 1 (John and Jane)
  console.log("💬 Creating messages for John & Jane conversation...");

  const msg1 = await prisma.message.create({
    data: {
      body: "Hey Jane! How are you doing?",
      conversationId: conversation1.id,
      senderId: user1.id,
      seenIds: [user2.id],
    },
  });
  console.log(`✅ Message from ${user1.name}: "${msg1.body}"`);

  const msg2 = await prisma.message.create({
    data: {
      body: "I'm doing great, John! Thanks for asking. How about you?",
      conversationId: conversation1.id,
      senderId: user2.id,
      seenIds: [user1.id],
    },
  });
  console.log(`✅ Message from ${user2.name}: "${msg2.body}"`);

  const msg3 = await prisma.message.create({
    data: {
      body: "Pretty good! Working on a new project.",
      conversationId: conversation1.id,
      senderId: user1.id,
      seenIds: [user2.id],
    },
  });
  console.log(`✅ Message from ${user1.name}: "${msg3.body}"`);

  const msg4 = await prisma.message.create({
    data: {
      body: "That's awesome! Let me know if you need any help.",
      conversationId: conversation1.id,
      senderId: user2.id,
      seenIds: [],
    },
  });
  console.log(`✅ Message from ${user2.name}: "${msg4.body}" (unread)`);
  console.log("");

  // Create Messages for Conversation 2 (John and Bob)
  console.log("💬 Creating messages for John & Bob conversation...");

  const msg5 = await prisma.message.create({
    data: {
      body: "Hey Bob, are we still on for the meeting tomorrow?",
      conversationId: conversation2.id,
      senderId: user1.id,
      seenIds: [user3.id],
    },
  });
  console.log(`✅ Message from ${user1.name}: "${msg5.body}"`);

  const msg6 = await prisma.message.create({
    data: {
      body: "Yes, definitely! 2 PM works for you?",
      conversationId: conversation2.id,
      senderId: user3.id,
      seenIds: [user1.id],
    },
  });
  console.log(`✅ Message from ${user3.name}: "${msg6.body}"`);

  const msg7 = await prisma.message.create({
    data: {
      image:
        "https://res.cloudinary.com/dkqom5jm4/image/upload/v1699123456/samples/meeting-schedule.png",
      conversationId: conversation2.id,
      senderId: user1.id,
      seenIds: [user3.id],
    },
  });
  console.log(`✅ Image message from ${user1.name}`);
  console.log("");

  // Create Messages for Group Conversation
  console.log("💬 Creating messages for group conversation...");

  const msg8 = await prisma.message.create({
    data: {
      body: "Welcome everyone to the Project Team group! 🎉",
      conversationId: groupConversation.id,
      senderId: user1.id,
      seenIds: [user2.id, user3.id, user4.id],
    },
  });
  console.log(`✅ Message from ${user1.name}: "${msg8.body}"`);

  const msg9 = await prisma.message.create({
    data: {
      body: "Thanks for creating this group, John!",
      conversationId: groupConversation.id,
      senderId: user2.id,
      seenIds: [user1.id, user3.id, user4.id],
    },
  });
  console.log(`✅ Message from ${user2.name}: "${msg9.body}"`);

  const msg10 = await prisma.message.create({
    data: {
      body: "Looking forward to collaborating with you all! 🚀",
      conversationId: groupConversation.id,
      senderId: user4.id,
      seenIds: [user1.id, user2.id, user3.id],
    },
  });
  console.log(`✅ Message from ${user4.name}: "${msg10.body}"`);

  const msg11 = await prisma.message.create({
    data: {
      body: "When is our first kickoff meeting? I've marked my calendar.",
      conversationId: groupConversation.id,
      senderId: user3.id,
      seenIds: [user1.id, user2.id],
    },
  });
  console.log(`✅ Message from ${user3.name}: "${msg11.body}"`);
  console.log("");

  // Summary
  console.log("🎉 Database seed completed successfully!\n");
  console.log("📊 Summary:");
  console.log(`   • Users created: 5`);
  console.log(`   • Conversations created: 4 (3 direct + 1 group)`);
  console.log(`   • Messages created: 11`);
  console.log("");
  console.log("🔑 Login credentials for test users:");
  console.log(
    "   Email: john@example.com / jane@example.com / bob@example.com / alice@example.com / charlie@example.com",
  );
  console.log("   Password: Password123!");
  console.log("");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
