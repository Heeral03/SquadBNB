// services/BookDatabase.js

const bookDatabase = {
  // Books by category
  fantasy: [
    { title: "The Name of the Wind", author: "Patrick Rothfuss", description: "A young man grows to become the most notorious wizard his world has ever seen." },
    { title: "Mistborn", author: "Brandon Sanderson", description: "A heist story in a world where the Dark Lord has already won." },
    { title: "The Way of Kings", author: "Brandon Sanderson", description: "Epic fantasy about honor, duty, and finding your purpose." },
    { title: "A Game of Thrones", author: "George R.R. Martin", description: "Political intrigue and war in the land of Westeros." },
    { title: "The Lies of Locke Lamora", author: "Scott Lynch", description: "A gang of con artists in a fantasy Venice-like city." },
    { title: "The Final Empire", author: "Brandon Sanderson", description: "A secret society plots to overthrow an immortal emperor." },
  ],
  
  scifi: [
    { title: "Dune", author: "Frank Herbert", description: "Political and religious intrigue on a desert planet." },
    { title: "Project Hail Mary", author: "Andy Weir", description: "A lone astronaut must save humanity from extinction." },
    { title: "The Martian", author: "Andy Weir", description: "An astronaut is stranded on Mars and must survive." },
    { title: "Foundation", author: "Isaac Asimov", description: "A mathematician predicts the fall of civilization." },
    { title: "Children of Time", author: "Adrian Tchaikovsky", description: "Evolution takes a strange turn on a terraformed planet." },
    { title: "Neuromancer", author: "William Gibson", description: "The birth of cyberpunk and artificial intelligence." },
  ],
  
  philosophy: [
    { title: "Meditations", author: "Marcus Aurelius", description: "Stoic wisdom from a Roman emperor." },
    { title: "Thus Spoke Zarathustra", author: "Friedrich Nietzsche", description: "A philosophical novel about the Übermensch." },
    { title: "The Republic", author: "Plato", description: "Dialogue about justice and the ideal state." },
    { title: "Beyond Good and Evil", author: "Friedrich Nietzsche", description: "Critique of traditional morality." },
    { title: "The Consolations of Philosophy", author: "Alain de Botton", description: "How philosophy can help with everyday problems." },
  ],
  
  self_help: [
    { title: "Atomic Habits", author: "James Clear", description: "Tiny changes, remarkable results." },
    { title: "Deep Work", author: "Cal Newport", description: "Rules for focused success in a distracted world." },
    { title: "The 7 Habits of Highly Effective People", author: "Stephen Covey", description: "Timeless principles for personal growth." },
    { title: "Daring Greatly", author: "Brené Brown", description: "How vulnerability leads to courage and connection." },
    { title: "Think and Grow Rich", author: "Napoleon Hill", description: "Classic principles of success and achievement." },
    { title: "The Power of Now", author: "Eckhart Tolle", description: "A guide to spiritual enlightenment." },
  ],
  
  mystery: [
    { title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", description: "A journalist and a hacker investigate a disappearance." },
    { title: "Gone Girl", author: "Gillian Flynn", description: "A wife disappears; is the husband responsible?" },
    { title: "The Silent Patient", author: "Alex Michaelides", description: "A woman stops speaking after murdering her husband." },
    { title: "And Then There Were None", author: "Agatha Christie", description: "Ten strangers are invited to an island and die one by one." },
    { title: "The Hound of the Baskervilles", author: "Arthur Conan Doyle", description: "Sherlock Holmes investigates a family curse." },
  ],
romance: [
  { 
    title: "Pride and Prejudice", 
    author: "Jane Austen", 
    description: "Classic romance between Elizabeth Bennet and Mr. Darcy. A timeless tale of love, class, and misunderstandings.", 
    category: "romance" 
  },
  { 
    title: "The Notebook", 
    author: "Nicholas Sparks", 
    description: "A heartwarming love story that spans decades. Noah and Allie's romance will make you believe in true love.", 
    category: "romance" 
  },
  { 
    title: "Outlander", 
    author: "Diana Gabaldon", 
    description: "A WWII nurse travels through time to 18th century Scotland and finds love and adventure.", 
    category: "romance" 
  },
  { 
    title: "Me Before You", 
    author: "Jojo Moyes", 
    description: "A love story that asks difficult questions about life, choice, and what it means to truly live.", 
    category: "romance" 
  },
  { 
    title: "Red, White & Royal Blue", 
    author: "Casey McQuiston", 
    description: "The son of the US president falls for a British prince in this charming romantic comedy.", 
    category: "romance" 
  },
  { 
    title: "The Fault in Our Stars", 
    author: "John Green", 
    description: "Two teens meet at a cancer support group and fall in love. Heartbreaking and beautiful.", 
    category: "romance" 
  },
  { 
    title: "Call Me By Your Name", 
    author: "André Aciman", 
    description: "A coming-of-age romance set in Italy during a sun-drenched summer.", 
    category: "romance" 
  },
  { 
    title: "The Time Traveler's Wife", 
    author: "Audrey Niffenegger", 
    description: "A unique love story about a man with a genetic disorder that causes him to time travel unpredictably.", 
    category: "romance" 
  }
],
};

// Get books by category
const getBooksByCategory = (category, limit = 5) => {
  const books = bookDatabase[category] || [];
  return books.slice(0, limit);
};

// Search books by interest (simple keyword matching)
const searchBooksByInterest = (interest) => {
  const interestLower = interest.toLowerCase();
  const results = [];
  
  Object.keys(bookDatabase).forEach(category => {
    bookDatabase[category].forEach(book => {
      if (book.title.toLowerCase().includes(interestLower) || 
          book.author.toLowerCase().includes(interestLower) ||
          book.description.toLowerCase().includes(interestLower)) {
        results.push({
          ...book,
          category,
          matchReason: `Found in ${category} category`
        });
      }
    });
  });
  
  return results;
};

module.exports = {
  bookDatabase,
  getBooksByCategory,
  searchBooksByInterest
};