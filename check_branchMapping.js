const branchMapping = {
    cs: {
        name: "Computer Science (Coding & Apps)",
        tags: ["Software", "Apps", "Websites"],
        desc: "It's all about telling computers what to do. You'll learn to build apps, games, and websites.",
        future: "Every company needs software now. You will be the one building the tools everyone uses.",
        career: "App Developer, Web Creator, Software Engineer, Data Analyst.",
        suitability: "Great if you like solving puzzles and logic games.",
        pros: ["Good starting salary", "Can work from anywhere", "Always plenty of jobs"],
        cons: ["Sitting for long hours", "Need to keep learning new things", "Fast-paced work"]
    },
    it: {
        name: "Information Technology (Systems & Web)",
        tags: ["Web", "Security", "Data"],
        desc: "Focuses on making sure computer systems and networks work smoothly for businesses.",
        future: "The world runs on the internet. You'll keep the digital world connected and safe.",
        career: "Network Manager, IT Support, Web Architect, Security Specialist.",
        suitability: "Perfect if you like organizing things and fixing tech problems.",
        pros: ["Jobs in every type of company", "Practical skills", "Steady career"],
        cons: ["Can be repetitive", "Sometimes work odd hours", "Lots of screen time"]
    },
    ai: {
        name: "AI & Data Science (Smart Machines)",
        tags: ["ChatGPT", "Robots", "Data"],
        desc: "Teach computers to think! Learn how things like ChatGPT, face ID, and recommendations work.",
        future: "AI is the new electricity. You'll helping build the smart future.",
        career: "AI Developer, Data Scientist, Machine Learning Engineer.",
        suitability: "If you are curious about how 'Siri' or 'Google' actually knows the answers.",
        pros: ["Very high demand", "Exciting new field", "High pay potential"],
        cons: ["Requires good math skills", "Complex to learn initially", "Always changing"]
    },
    ec: {
        name: "Electronics & Communication (Chips & 5G)",
        tags: ["Chips", "Signals", "5G"],
        desc: "Understand what's inside your phone and how Wi-Fi travels through the air.",
        future: "From faster internet (6G) to smarter gadgets, you'll build the hardware of the future.",
        career: "Chip Designer, IoT Engineer, Network Engineer, Telecom Expert.",
        suitability: "If you wonder how gadgets work and like combining hardware with software.",
        pros: ["Work with real devices", "Core engineering job", "Good for R&D"],
        cons: ["Harder subjects", "Need to be very precise", "Slower initial growth than IT"]
    },
    ee: {
        name: "Electrical & Electronics (Power & EVs)",
        tags: ["Electric Cars", "Solar", "Power"],
        desc: "Power the world! Learn about electricity, huge motors, and Electric Vehicles.",
        future: "The world is going Electric. You'll build the chargers, batteries, and grids of tomorrow.",
        career: "EV Engineer, Power Grid Manager, Solar Energy Expert.",
        suitability: "If you want to work on big energy systems or green technology.",
        pros: ["Green & Sustainable career", "Real physical results", "Many Government jobs"],
        cons: ["Working with high voltage", "Field work (outdoors)", "Physically active"]
    },
    mech: {
        name: "Mechanical Engineering (Machines & Robots)",
        tags: ["Cars", "Robots", "Engines"],
        desc: "Design and build anything that moves—from racing cars to giant robots.",
        future: "Robots are taking over factories. You'll design the machines of the future.",
        career: "Car Designer, Robotics Engineer, Aerospace Specialist.",
        suitability: "If you love taking things apart to see how they work.",
        pros: ["Very versatile degree", "Basis for robotics/EVs", "High job satisfaction"],
        cons: ["Factory environment", "Heavy subjects", "Lower starting pay"]
    },
    civil: {
        name: "Civil Engineering (Buildings & Cities)",
        tags: ["Skyscrapers", "Bridges", "Cities"],
        desc: "Build the world around us. Design skyscrapers, bridges, and smart cities.",
        future: "We need smarter, greener cities. You'll design where people live and work.",
        career: "Structural Designer, Site Manager, Urban Planner.",
        suitability: "If you want to see your drawings turn into real, standing structures.",
        pros: ["Leave a physical legacy", "Good for business", "Outdoor work"],
        cons: ["Long project times", "Lots of rules/safety", "Weather-dependent"]
    },
    cyber: {
        name: "Cyber Security (Digital Police)",
        tags: ["Hackers", "Security", "Privacy"],
        desc: "Be a digital detective. Protect people and banks from hackers and thieves.",
        future: "As we go digital, safety is #1. You'll be the protector of the internet.",
        career: "Ethical Hacker, Security Analyst, Privacy Officer.",
        suitability: "If you are naturally suspicious and love finding loopholes.",
        pros: ["Huge demand", "Exciting 'Detective' work", "High respect"],
        cons: ["High stress", "Constant battle", "Always on alert"]
    },
    agri: {
        name: "Agricultural Engineering (Smart Farming)",
        tags: ["Farming", "Drones", "Water"],
        desc: "Use technology to grow better food! Design drones and smart watering systems for farms.",
        future: "We need more food for the world. You'll use tech to make farming easier and greener.",
        career: "Smart Farm Manager, Agri-Tech Designer, Food Process Engineer.",
        suitability: "If you love nature and want to use tech to help farmers and the planet.",
        pros: ["Impactful work", "Growing tech adoption", "Outdoor & Indoor mix"],
        cons: ["Rural locations often", "Physical work sometimes", "Niche market"]
    },
    bio: {
        name: "Biomedical & Biotech (Health & Tech)",
        tags: ["DNA", "Medicine", "Tech"],
        desc: "Combine biology and engineering to save lives. Build medical devices or new medicines.",
        future: "Healthcare needs more tech. You'll be bridging the gap between doctors and machines.",
        career: "Biomedical Engineer, Clinical Researcher, Pharma Manufacturer.",
        suitability: "If you like biology but want to build things instead of being a doctor.",
        pros: ["High social impact", "Research-oriented", "Good hospital jobs"],
        cons: ["Need higher studies for top jobs", "Strict regulations", "Slower career start"]
    }
};
