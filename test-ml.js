const ML_ENDPOINT = 'https://ml.api.amplecen.com';
const API_SECRET = 'tDZmzDytasdasdafNJrsasdffdasdasdsfsdfsXRxJbigzWUENsdfsdfsdfCfsdfdsfeCGPRFVVdaSFgfwsgsgtmUrhuxfuVwktXFMtXmrEYLxneeQhnzWUEfjJvmRFZuDXRmekEgTruCPazVXXTPSuGEasdasdPAzRNvRWMijFxzsdasdasgfgsdDhHiWqqGffasfasfsdgfsdfgzvmGejYtsdgsgZmtqfKMUGpzxSMxJFPr';

const logs = Array.from({length: 14}).map((_, i) => ({
  date: `2026-05-${10+i}`,
  tasks_done: i,
  tasks_created: i+1,
  habits_completed: i % 2,
  journaled: i % 3 === 0,
  mood: (i % 5) + 5,
  focus_mins: i * 10,
  focus_sessions: i % 3,
}));

fetch(`${ML_ENDPOINT}/v1/insights_weekly`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-secret': API_SECRET,
  },
  body: JSON.stringify({ logs }),
})
.then(async res => {
  console.log('Status:', res.status);
  console.log('Body:', await res.text());
})
.catch(console.error);
