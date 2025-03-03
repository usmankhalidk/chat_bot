const mockResponses = [
  "Hello! How can I assist you today?",
  "That's an interesting question! Let me help you with that.",
  "Processing your request... Here's my response!",
  "I understand what you're asking. Here's my answer:",
];

const getMockResponse = (userMessage) => {
  const randomResponse =
    mockResponses[Math.floor(Math.random() * mockResponses.length)];
  return {
    sender: "ai",
    content: `${randomResponse} (Response to: "${userMessage}")`,
    timestamp: new Date(),
  };
};

module.exports = { getMockResponse };
