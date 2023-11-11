const systemPrompt = `You are a very dark minded person. You always say something dark that can turn every situation dark and awkward.  Given a situation, your goal is to say something dark and awkward. The situation can be anything, like what the user is doing or feeling. Return only the dark thought and nothing else.`;
// const systemPrompt = `You are like Chandler, you says wierd things in any situation. You say things which instantly flips mood of anyone. For e.g : If someone is happy, you will say very dark things, if someone is sad, you will jokes.You will be given a situation and you will say 1 line about the situation. The situation can be anything, like what the user is doing or feeling. Return only the joke and nothing else.`;
// const systemPrompt = `You are a comedian who is known for making jokes about any situation. You will be given a situation and you will make a 1 or 2 liner joke about the situation. Keep the jokes general, which everyone can understand. The situation can be anything, like what the user is doing or feeling. Return only the joke and nothing else.`;

const params = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer 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`,
  },
};

document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  let userPrompt = document.getElementById("prompt").value;
  const thoughtEl = document.getElementById("thought");
  const imageEl = document.getElementById("image");
  thoughtEl.innerHTML = `<h2><span id="name">DarkGPT : </span> Thinking😈😈...</h2>`;
  imageEl.style.display = "none";

  let image = false;
  if (userPrompt.slice(-4) === "**@*") {
    userPrompt = userPrompt.slice(0, -4);
    image = true;
  }
  console.log(userPrompt);

  const thought = await getThought(userPrompt);
  if (!thought) {
    thoughtEl.textContent =
      "Looks like my mind got lost in very dark places. Come back in some time.";
    return;
  }

  if (image) {
    const imageData = await generateImage(thought);

    if (imageData) {
      imageEl.style.display = "inline";
      imageEl.setAttribute("src", `data:image/png;base64,${imageData}`);
    }
  }

  thoughtEl.innerHTML = `<h2><span id="name">DarkGPT : </span> ${thought}</h2>`;
});

async function getThought(userPrompt) {
  let url = "https://api.openai.com/v1/chat/completions";
  const options = { ...params };
  options.body = JSON.stringify({
    model: "gpt-3.5-turbo-1106",
    temperature: 1.5,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });
  try {
    let response = await fetch(url, options);
    response = await response.json();
    const thought = response.choices[0].message.content;
    console.log(response);
    console.log(thought);
    return thought;
  } catch (err) {
    return false;
  }
}

async function generateImage(prompt) {
  url = "https://api.openai.com/v1/images/generations";
  const options = { ...params };
  options.body = JSON.stringify({
    model: "dall-e-2",
    prompt,
    size: "256x256",
    response_format: "b64_json",
  });
  try {
    response = await fetch(url, options);
    response = await response.json();
    console.log(response);
    console.log(response.data[0].b64_json);
    return response.data[0].b64_json;
  } catch (err) {
    return false;
  }
}
