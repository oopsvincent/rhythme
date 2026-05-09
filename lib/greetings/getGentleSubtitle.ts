export function getGentleSubtitle(): string {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    const subtitles = [
      "The day is yours. Move at your own pace.",
      "A fresh start. There's no need to rush.",
      "Ease into the day. One step at a time.",
    ];
    return subtitles[hour % subtitles.length];
  }

  if (hour >= 12 && hour < 17) {
    const subtitles = [
      "You're doing well. Remember to breathe.",
      "Steady and calm. Take breaks when you need them.",
      "Halfway there. Be kind to yourself today.",
    ];
    return subtitles[hour % subtitles.length];
  }

  if (hour >= 17 && hour < 22) {
    const subtitles = [
      "The day is winding down. Let go of what you couldn't finish.",
      "A gentle evening. Time to reflect and rest.",
      "You've done enough for today. Be proud.",
    ];
    return subtitles[hour % subtitles.length];
  }

  const subtitles = [
    "It's late. Give yourself permission to rest.",
    "The world is quiet now. Find your peace.",
    "Close your tabs and your mind. Rest well.",
  ];
  return subtitles[hour % subtitles.length];
}
