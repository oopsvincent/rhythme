export function getCalmTimeGreeting(name?: string | null): string {
  const hour = new Date().getHours();
  const firstName = name?.split(" ")[0];
  const namePart = firstName ? `, ${firstName}` : "";

  if (hour >= 5 && hour < 12) {
    const greetings = [
      "Good morning",
      "A gentle morning to you",
      "Take your time this morning",
    ];
    return `${greetings[hour % greetings.length]}${namePart}.`;
  }

  if (hour >= 12 && hour < 17) {
    const greetings = [
      "Good afternoon",
      "A peaceful afternoon",
      "Hope your day is going well",
    ];
    return `${greetings[hour % greetings.length]}${namePart}.`;
  }

  if (hour >= 17 && hour < 22) {
    const greetings = [
      "Good evening",
      "A quiet evening to you",
      "Time to gently unwind",
    ];
    return `${greetings[hour % greetings.length]}${namePart}.`;
  }

  const greetings = [
    "Rest well",
    "A peaceful night to you",
    "Time to recharge",
  ];
  return `${greetings[hour % greetings.length]}${namePart}.`;
}
