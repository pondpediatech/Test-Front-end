export const createThreadFetcher = (url: string, requestBody: any) => {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  }).then((res) => res.json());
};

export const createMessageFetcher = async (url, assistantId, userQuestion) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userQuestion,
      assistantId,
    }),
  });

  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }

  return response.json();
};

export const fetchThreads = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};
