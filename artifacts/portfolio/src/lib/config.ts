export const PORTFOLIO_CONFIG = {
  name: "Alex Developer",
  title: "Full-Stack Engineer & Python Enthusiast",
  bio: "I craft exceptional digital experiences and robust data pipelines. Passionate about clean code, open source, and learning new paradigms.",
  githubUsername: "octocat", // Replace with actual GitHub username
  socials: {
    github: "https://github.com/octocat",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "mailto:hello@example.com",
  },
  pythonProjects: [
    {
      id: "py-1",
      title: "Async Data Pipeline",
      description: "A high-throughput asynchronous data processing pipeline using asyncio and aiohttp. Processes 10k+ records/sec.",
      tags: ["Python", "asyncio", "ETL"],
      code: `import asyncio
import aiohttp

async def fetch_data(session, url):
    async with session.get(url) as response:
        return await response.json()

async def process_pipeline(urls):
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_data(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
        
        # Process batched results
        processed = [data['value'] * 2 for data in results if 'value' in data]
        return processed

# Run the pipeline
# asyncio.run(process_pipeline(['http://api.example.com/data/1']))`
    },
    {
      id: "py-2",
      title: "Neural Net from Scratch",
      description: "A lightweight feedforward neural network built entirely with NumPy to understand backpropagation inner workings.",
      tags: ["Python", "NumPy", "Deep Learning"],
      code: `import numpy as np

class NeuralNetwork:
    def __init__(self, layers):
        self.weights = [np.random.randn(layers[i], layers[i+1]) * 0.1 
                        for i in range(len(layers)-1)]
        self.biases = [np.zeros((1, layers[i+1])) 
                       for i in range(len(layers)-1)]

    def relu(self, z):
        return np.maximum(0, z)

    def forward(self, x):
        a = x
        for w, b in zip(self.weights, self.biases):
            z = np.dot(a, w) + b
            a = self.relu(z)
        return a

# nn = NeuralNetwork([2, 4, 1])
# print(nn.forward(np.array([1, 0])))`
    }
  ]
};
