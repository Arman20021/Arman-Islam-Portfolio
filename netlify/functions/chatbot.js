const PROFILE_DATA = {
  name: "Md Arman Islam",

  about:
    "Md Arman Islam is a Computer Science & Engineering student at American International University-Bangladesh. He is passionate about software development, full-stack web applications, and problem solving. He enjoys building real-world solutions using ASP.NET Core, Django, databases, and modern technologies.",

  education: {
    university: "American International University-Bangladesh",
    shortName: "AIUB",
    degree: "BSc in Computer Science & Engineering",
    cgpa: "3.61 / 4.00",
    year: "2022 - Present",
    college: "Rajshahi Govt City College",
    hscYear: "2021",
    hscGroup: "Science",
    hscGpa: "5.00 / 5.00"
  },

  skills: {
    technical: [
      "Python",
      "Java",
      "C++",
      "C# / .NET",
      "MySQL",
      "PHP",
      "Tailwind",
      "PostgreSQL"
    ],
    tools: [
      "VS Code",
      "Visual Studio",
      "Git & GitHub",
      "Figma",
      "Jira / Agile"
    ],
    softSkills: [
      "Communication",
      "Problem Solving",
      "Teamwork"
    ]
  },

  projects: [
    {
      name: "The Book Matrix",
      description:
        "A professional ASP.NET Core MVC online book shop management system built with layered architecture, SQL Server, shopping cart, SSLCommerz sandbox payment, and sales analytics dashboard.",
      tech: ["C#", ".NET", "SQL Server"],
      live: "http://thebookmatrix.tryasp.net/",
      github:
        "https://github.com/Arman20021/THE__BOOK__MATRIX__FULLSTACK__.NET_CORE_PROJECT"
    },
    {
      name: "University Research Project Management",
      description:
        "A role-based web application for managing academic research projects, publications, funding, users, teamwork, and institutional data.",
      tech: ["PHP", "Oracle", "HTML"],
      github:
        "https://github.com/Arman20021/University_Research_Project_Management_System_By_Oracle_10g"
    },
    {
      name: "City Shop",
      description:
        "City Shop is a backend e-commerce REST API built using Django REST Framework. It provides product management, category organization, cart handling, and order processing.",
      tech: ["Django", "DRF", "React", "PostgreSQL"],
      github:
        "https://github.com/Arman20021/CityShop_Ecommerce_Project-Based-on-DRF-RESTAPI"
    },
    {
      name: "EVENTO",
      description:
        "EVENTO is a web-based event management system built with Django. It allows users to register, verify email, browse events, join events, and receive confirmation emails.",
      tech: ["Django", "Tailwind", "PostgreSQL"],
      github: "https://github.com/Arman20021/Event_Management_System_Django"
    },
    {
      name: "Hungry Naki",
      description:
        "Hungry Naki is an online food ordering system built with Java Swing. Users can browse restaurants, view food menus, customize orders, make payments, and place orders.",
      tech: ["Java", "Swing"],
      github: "https://github.com/Arman20021/Hungry_Naki_Java_Academic_Project"
    },
    {
      name: "Portfolio Website",
      description:
        "A responsive personal portfolio website showing projects and skills with a modern UI design.",
      tech: ["HTML", "CSS", "JavaScript"],
      github: "https://github.com/syringe-Ohy/EPortfolio"
    }
  ],

  competitiveProgramming: {
    codeforces: {
      profile: "Arman_Ar",
      maxRating: 1109,
      solved: "250+"
    },
    codechef: {
      profile: "arman_2002",
      maxRating: 1414,
      solved: "200+"
    },
    leetcode: {
      profile: "mdarmanislam20021",
      maxRating: 1449,
      solved: "40+"
    }
  },

  research: [
    {
      title: "Phishing Website Detection",
      details: "Multi-modal ML model using DistilBERT and EfficientNet."
    },
    {
      title: "Cybersecurity Risk Prediction",
      details: "Explainable ML for real-time risk assessment."
    }
  ],

  contact: {
    email: "mdarmanislam20021@gmail.com",
    phone: "01775757533",
    linkedin: "https://www.linkedin.com/in/arman-islam-19aa8a252/",
    github: "https://github.com/Arman20021"
  }
};

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

exports.handler = async function (event) {
  try {
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers,
        body: ""
      };
    }

    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({
          answer: "Only POST request is allowed."
        })
      };
    }

    const body = JSON.parse(event.body || "{}");
    const userMessage = body.message;

    if (!userMessage || userMessage.trim() === "") {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          answer: "Please ask something about Arman."
        })
      };
    }

    if (userMessage.length > 500) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          answer: "Please ask a shorter question."
        })
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          answer: "Gemini API key is missing on the server."
        })
      };
    }

    const prompt = `
You are Arman's portfolio chatbot.

Rules:
1. Answer only about Md Arman Islam.
2. Use only the profile data given below.
3. Users may ask in short, broken, or different English.
4. Understand the meaning of the question.
5. If user asks total projects, count the projects array.
6. If user asks CGPA, answer from education.cgpa.
7. If user asks university, answer from education.university.
8. If user asks skills, answer from skills.
9. If user asks CP, competitive programming, rating, Codeforces, CodeChef, or LeetCode, answer from competitiveProgramming.
10. If user asks contact, email, phone, GitHub, or LinkedIn, answer from contact.
11. If user asks about a project, answer from projects.
12. If the answer is not in the profile data, say: "I do not have that information yet."
13. Do not invent fake information.
14. Keep answers short, friendly, and clear.

Profile data:
${JSON.stringify(PROFILE_DATA, null, 2)}

User question:
${userMessage}
`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 250
          }
        })
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini error:", errorText);

      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          answer:
            "Sorry, the AI service is not working right now. Please try again later."
        })
      };
    }

    const data = await geminiResponse.json();

    const answer =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text)
        .join("")
        .trim() || "Sorry, I could not answer that.";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        answer
      })
    };
  } catch (error) {
    console.error("Server error:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        answer: "Sorry, something went wrong. Please try again later."
      })
    };
  }
};