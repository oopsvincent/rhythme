export function getGreeting(): string {
  const greetings = [
    "Welcome back",
    "Good to see you again",
    "Hey there",
    "Glad you're here",
    "How's your day going",
    "Nice to have you back",
    "Ready to conquer the day",
    "Hope you're doing great",
    "Let's make today productive",
    "Always a pleasure to see you",
  ];

  // Randomly pick one
  const randomIndex = Math.floor(Math.random() * greetings.length);
  return greetings[randomIndex];
}