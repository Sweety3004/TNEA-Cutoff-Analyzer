export const branchMapping = {
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
        pros: ["High societal impact", "Combining nature with tech", "Unique career niche"],
        cons: ["Lots of rural/village travel", "Seasonal work cycles", "Niche industry"]
    },
    robot: {
        name: "Robotics & Automation (Future Workers)",
        tags: ["Robots", "Sensors", "AI"],
        desc: "Build machines that can move and think on their own! From factory arms to surgical robots.",
        future: "Robots will do all the hard work. You'll be the one commanding them.",
        career: "Robotics Designer, Automation Analyst, Control System Architect.",
        suitability: "If you love sci-fi movies and want to make 'real' robots, pick this.",
        pros: ["Cutting-edge innovation", "Extremely fun to build", "Fast growing field"],
        cons: ["Requires deep multi-skill knowledge", "Expensive to build prototypes", "Intense learning curve"]
    },
    aero: {
        name: "Aerospace Engineering (Planes & Space)",
        tags: ["Rockets", "Planes", "Space"],
        desc: "Design machines that fly! From fast jets to rockets going to Mars.",
        future: "With private space companies rising, you could be building the first Mars colony.",
        career: "Rocket Scientist, Aircraft Designer, Satellite Engineer.",
        suitability: "If you've always looked at the stars or planes with wonder.",
        pros: ["High prestige/Respect", "Work on space missions", "Elite engineering field"],
        cons: ["Hardest math & physics", "Very high safety pressure", "Limited number of companies"]
    },
    biomed: {
        name: "Biomedical Engineering (Health Tech)",
        tags: ["Hospitals", "Gadgets", "Scanners"],
        desc: "Dignity in technology! Design machines that save lives, like MRI scanners or bionic limbs.",
        future: "Healthcare is going high-tech. You'll be the bridge between doctors and engineers.",
        career: "Medical Device Designer, Health-Tech Consultant, Lab Instrument Expert.",
        suitability: "If you want to help people and love biology along with machines.",
        pros: ["Save lives with tech", "Fast growing health sector", "Meaningful work"],
        cons: ["Strict hospital regulations", "Requires deep biology learning", "Complex safety testing"]
    },
    chem: {
        name: "Chemical Engineering (Medicine & Fuels)",
        tags: ["Medicines", "Fuels", "Perfumes"],
        desc: "Transform raw materials into cool things like medicines, fuels, or even your favorite perfumes.",
        future: "Sustainability and new materials are the key. You'll find cleaner ways to make products.",
        career: "Medicine Maker, Energy Researcher, Material Scientist.",
        suitability: "If you love chemistry labs and wondering how things are made in factories.",
        pros: ["Critical for medicines/pharma", "Very high pay in energy sector", "Versatile knowledge"],
        cons: ["Exposure to chemicals", "Strict safety gear needed", "Usually working in industrial zones"]
    },
    fashion: {
        name: "Fashion Technology (Tech & Style)",
        tags: ["Clothes", "Design", "Fabrics"],
        desc: "Engineering for the style world! Combine high-tech fabrics with modern apparel design.",
        future: "Smart clothes that track your health are coming. You'll design the future of style.",
        career: "Apparel Designer, Textile Technologist, Fashion Brand Lead.",
        suitability: "If you have style and want to use math and logic to make clothes better.",
        pros: ["Creative & Logical mix", "Work in the fashion world", "Tangible everyday products"],
        cons: ["Fast changing trends", "High competition", "Industrial factory visits"]
    },
    textile: {
        name: "Textile Technology (Smart Fabrics)",
        tags: ["Cloth", "Looms", "Colors"],
        desc: "Learn how the clothes you wear are made, from cotton to high-tech threads.",
        future: "Eco-friendly fabrics are the big goal. You'll make the world more sustainable through cloth.",
        career: "Quality Control Lead, Textile Engineer, Sustainability Expert.",
        suitability: "If you are interested in the massive industry that covers the world.",
        pros: ["Huge global industry", "Core human necessity", "Many jobs in industrial hubs"],
        cons: ["Traditional industry", "Factory-based work", "Loud environments"]
    },
    food: {
        name: "Food Technology (Tasty Science)",
        tags: ["Food", "Safety", "Nutrition"],
        desc: "How do chips stay crunchy? How is ice cream made? Learn the science of the food you eat.",
        future: "Making healthy, long-lasting food for billions of people is a huge challenge.",
        career: "Food Quality Officer, Product Developer, Nutrition Analyst.",
        suitability: "If you love food and are curious about what's listed on the back of the packet.",
        pros: ["Recession-proof job (people always eat!)", "Creative product making", "Great for entrepreneurship"],
        cons: ["Lots of food safety checks", "Standing in labs/factories", "Requires high hygiene"]
    },
    petro: {
        name: "Petrochemicals (Fuel & Energy)",
        tags: ["Energy", "Refineries", "Oil"],
        desc: "Work with the energy that powers our world. Focus on oil, gas, and plastics.",
        future: "Transitioning to cleaner energy from traditional oil is the next big challenge.",
        career: "Refinery Engineer, Energy Analyst, Process Specialist.",
        suitability: "If you want to work in a massive, high-stakes energy industry.",
        pros: ["Highest salary potential", "International travel", "Deep technical learning"],
        cons: ["Remote plant locations", "Challenging safety rules", "Work can be in harsh weather"]
    },
    auto: {
        name: "Automobile Engineering (Cars & Bikes)",
        tags: ["Supercars", "Racing", "Engines"],
        desc: "Build the next sports car or superbike! Focus on design, speed, and safety.",
        future: "Driverless cars and flying vehicles are coming. You'll be the one designing them.",
        career: "Car Designer, Racing Analyst, Safety Engineer.",
        suitability: "If you're a 'gearhead' who loves bikes and cars more than anything.",
        pros: ["Work with your passion", "Thrilling field", "Focus on speed/cool design"],
        cons: ["High pressure for safety", "Expensive parts", "Shift to electric changing everything"]
    },
    env: {
        name: "Environmental Engineering (Planet Saving)",
        tags: ["Water", "Green", "Earth"],
        desc: "Save the Earth! Design systems to clean water, reduce pollution, and stop climate change.",
        future: "The Earth needs you. Sustainable living is not a choice, it's a necessity.",
        career: "Pollution Control Officer, Sustainability Expert, Water Project Designer.",
        suitability: "If you're a nature lover who wants to use science to fix the planet.",
        pros: ["Most meaningful career", "Global opportunities", "Highly respected work"],
        cons: ["Lots of rules & laws", "Can be difficult to see progress", "Government-focused jobs"]
    },
    prod: {
        name: "Production (The Factory Maestro)",
        tags: ["Efficiency", "Factories", "Management"],
        desc: "The 'Boss' of the factory! Optimize how things are made and delivered efficiently.",
        future: "Smart factories (Industry 4.0) need managers who understand both machines and people.",
        career: "Industrial Manager, Supply Chain Consultant, Quality Control Lead.",
        suitability: "If you are very organized and love making systems faster and better.",
        pros: ["Great bridge to Management (MBA)", "See the big picture", "Wide job options"],
        cons: ["High stress environment", "24/7 factory cycles", "Metrics & target pressure"]
    }
};

export const relatedCoursesData = {
    cs: [
        { key: 'it', why: 'Similar Role', desc: 'Information Technology offers almost identical career paths in software development with often slightly more accessible cutoffs.' },
        { key: 'ai', why: 'Trending', desc: 'AI & Data Science is a specialized version of CS focusing on machine learning and big data analytics.' },
        { key: 'ec', why: 'Hardware mix', desc: 'Electronics & Communication lets you work on both hardware design and software development.' }
    ],
    it: [
        { key: 'cs', why: 'Core Software', desc: 'Computer Science is the broader foundation for all software and computing systems.' },
        { key: 'ai', why: 'Data Focus', desc: 'If you enjoy the data management side of IT, AI & Data Science is a perfect next step.' },
        { key: 'ec', why: 'Connectivity', desc: 'Network design and communication hardware are foundational to modern IT systems.' }
    ],
    ai: [
        { key: 'cs', why: 'Foundation', desc: 'Provides the broad computing background that makes specialized AI knowledge even more powerful.' },
        { key: 'it', why: 'Implementation', desc: 'Focuses on how to deploy and manage large scale information systems.' },
        { key: 'ec', why: 'Robotics', desc: 'The physical brain for AI systems often lives in embedded electronic controllers.' }
    ],
    mech: [
        { key: 'prod', why: 'Industry 4.0', desc: 'Production engineering focuses on manufacturing efficiency and modern industrial management.' },
        { key: 'civil', why: 'Structural', desc: 'Both share foundations in mechanics and physical design across different scales.' },
        { key: 'ee', why: 'Power/EVs', desc: 'The future of mechanical systems is increasingly electrical (EVs, Automation).' }
    ],
    civil: [
        { key: 'mech', why: 'Mechanics', desc: 'Shares core physics principles regarding forces and material properties.' },
        { key: 'chem', why: 'Materials', desc: 'Crucial for understanding cement, polymers, and advanced construction materials.' },
        { key: 'ee', why: 'Smart Cities', desc: 'Electrical grids and renewable energy are the nervous system of modern urban planning.' }
    ],
    ec: [
        { key: 'cs', why: 'Embedded', desc: 'Crucial if you want to write the software that runs on electronic hardware.' },
        { key: 'ee', why: 'Power Electronics', desc: 'The base for working on power grids, motors, and high-voltage systems.' },
        { key: 'it', why: 'Networking', desc: 'Electronic communication signals are the base of all Information Technology.' }
    ],
    ee: [
        { key: 'ec', why: 'Electronics', desc: 'Focuses more on low-voltage signals, communication, and micro-processors.' },
        { key: 'mech', why: 'Control Systems', desc: 'Perfect for working on robotics and automated machinery.' },
        { key: 'cs', why: 'Automation', desc: 'Modern electrical grids are managed by sophisticated software and AI algorithms.' }
    ],
    chem: [
        { key: 'bio', why: 'Life Sciences', desc: 'Biotechnology uses chemical principles to solve medical and biological challenges.' },
        { key: 'mech', why: 'Process Plant', desc: 'Design the massive machines and systems used in chemical production.' },
        { key: 'prod', why: 'Optimization', desc: 'Managing chemical manufacturing at scale requires deep understanding of industrial processes.' }
    ],
    bio: [
        { key: 'chem', why: 'Molecular', desc: 'The fundamental chemistry behind biological processes and pharmaceutical design.' },
        { key: 'it', why: 'Bioinformatics', desc: 'Big data and software are the tools used to map genomes and biological patterns.' }
    ],
    prod: [
        { key: 'mech', why: 'Design', desc: 'Learn how to design the parts that your production lines will be manufacturing.' },
        { key: 'it', why: 'ERP/Data', desc: 'Modern production relies heavily on data systems for logistics and supply chain.' },
        { key: 'civil', why: 'Logistics', desc: 'Infrastructure planning is a key component of industrial and factory setup.' }
    ]
};

export const assessmentQuestions = [
    {
        text: "When solving a problem, you like to:",
        desc: "Choose the method that feels most natural to you.",
        options: [
            { text: "Use computer logic", personalize: "you enjoy logical problem solving on computers", scores: { cs: 15, it: 15, cyber: 12 } },
            { text: "Fix physical machines", personalize: "you have a knack for machines and tools", scores: { mech: 15, auto: 15, aero: 12 } },
            { text: "Design building plans", personalize: "you are a natural designer of physical structures", scores: { civil: 15, env: 12, agri: 10 } },
            { text: "Deep systems analysis", personalize: "you thrive on deep analysis and systems", scores: { ai: 15, robot: 15, ec: 12 } }
        ]
    },
    {
        text: "In school, you enjoyed:",
        desc: "Recall your favorite hands-on memories.",
        options: [
            { text: "Coding in lab", personalize: "you were a star in the computer lab", scores: { cs: 15, it: 15, cyber: 10 } },
            { text: "Physics circuit experiments", personalize: "you excelled in physics and electronics", scores: { ec: 15, ee: 15, robot: 12 } },
            { text: "Industrial workshop practice", personalize: "you loved working in the machine workshop", scores: { mech: 15, prod: 15, auto: 12 } },
            { text: "Drawing project designs", personalize: "you enjoyed design and drafting", scores: { civil: 15, fashion: 12, textile: 12 } }
        ]
    },
    {
        text: "Your favorite type of work would be:",
        desc: "Envision your ideal daily routine.",
        options: [
            { text: "Coding at desk", personalize: "you prefer an IT-focused desk job", scores: { cs: 15, it: 15, cyber: 12 } },
            { text: "Handling heavy machinery", personalize: "you want to be around active machinery", scores: { mech: 15, auto: 15, prod: 15 } },
            { text: "Visiting project sites", personalize: "you like being on-site for physical projects", scores: { civil: 15, env: 12, agri: 12 } },
            { text: "Lab-based research work", personalize: "you are driven by research and innovation", scores: { ai: 15, biomed: 15, chem: 15 } }
        ]
    },
    {
        text: "You feel strong in:",
        desc: "Identify your core natural talent.",
        options: [
            { text: "Logical code thinking", personalize: "logic is your primary mental tool", scores: { cs: 15, it: 15, math: 12 } },
            { text: "Hands-on technical work", personalize: "you're a hands-on technical worker", scores: { mech: 15, auto: 15, prod: 12 } },
            { text: "Organizing large structures", personalize: "you're a master of organization and structure", scores: { civil: 15, env: 12, agri: 12 } },
            { text: "Complex data analysis", personalize: "you excel at breaking down complex data", scores: { ai: 15, robot: 15, ec: 12 } }
        ]
    },
    {
        text: "What excites you more?",
        desc: "The type of project that ignites your passion.",
        options: [
            { text: "Building mobile apps", personalize: "you're an aspiring app developer", scores: { cs: 15, it: 15, ai: 10 } },
            { text: "Tuning car engines", personalize: "you're a pro at engine mechanics", scores: { auto: 15, mech: 15, aero: 12 } },
            { text: "Structural design projects", personalize: "you have the vision of an architect", scores: { civil: 15, env: 12, agri: 10 } },
            { text: "Designing smart robots", personalize: "you're building the brain of future tech", scores: { ai: 15, robot: 15, ec: 12 } }
        ]
    },
    {
        text: "You prefer learning by:",
        desc: "How do you naturally process information?",
        options: [
            { text: "Digital software practice", personalize: "you learn best through digital practice", scores: { cs: 15, it: 15, cyber: 10 } },
            { text: "Using technical tools", personalize: "you're a hands-on physical learner", scores: { mech: 15, auto: 15, prod: 12 } },
            { text: "Visualizing structural plans", personalize: "you learn by visualizing and drafting", scores: { civil: 15, fashion: 12, textile: 12 } },
            { text: "Deep research study", personalize: "you're a deep analytical researcher", scores: { ai: 15, biomed: 15, chem: 15 } }
        ]
    },
    {
        text: "Your dream workplace:",
        desc: "Where you see yourself in 5 years.",
        options: [
            { text: "Modern tech office", personalize: "you belong in a fast-paced tech firm", scores: { cs: 15, it: 15, cyber: 12 } },
            { text: "Large industrial factory", personalize: "the heart of industry is where you belong", scores: { prod: 15, mech: 15, auto: 12 } },
            { text: "Active building site", personalize: "you want to build massive landmarks", scores: { civil: 15, env: 12, architecture: 12 } },
            { text: "Scientific innovation lab", personalize: "you are a pioneer of innovation labs", scores: { ai: 15, biomed: 15, chem: 15 } }
        ]
    },
    {
        text: "If something stops working, you:",
        desc: "Your instinctive approach to troubleshooting.",
        options: [
            { text: "Fix software bugs", personalize: "you're a digital troubleshootings expert", scores: { cs: 15, it: 15, cyber: 12 } },
            { text: "Check mechanical parts", personalize: "you're a mechanical investigator", scores: { mech: 15, auto: 15, aero: 12 } },
            { text: "Inspect structural faults", personalize: "you look for foundational structural faults", scores: { civil: 15, env: 12, agri: 10 } },
            { text: "Analyze system data", personalize: "you analyze system-wide patterns", scores: { ai: 15, ec: 15, ee: 12 } }
        ]
    },
    {
        text: "You like problems that involve:",
        desc: "The category of hurdles you enjoy clearing.",
        options: [
            { text: "Coding digital puzzles", personalize: "digital coding challenges are your forte", scores: { cs: 15, it: 15, cyber: 12 } },
            { text: "Mechanical tool problems", personalize: "mechanical machine problems excite you", scores: { mech: 15, auto: 15, prod: 12 } },
            { text: "Large physical structures", personalize: "building structural challenges are your pick", scores: { civil: 15, env: 12, agri: 10 } },
            { text: "Intelligent data systems", personalize: "you master complex data and system logic", scores: { ai: 15, robot: 15, ec: 12 } }
        ]
    },
    {
        text: "In free time, you would:",
        desc: "What catches your attention during leisure?",
        options: [
            { text: "Explore new software", personalize: "you spend free time on software tech", scores: { cs: 15, it: 15, cyber: 12 } },
            { text: "Watch machine videos", personalize: "you're into mechanical inventions on video", scores: { mech: 15, auto: 15, aero: 12 } },
            { text: "Study building designs", personalize: "you're curious about architectural visuals", scores: { civil: 15, env: 12, architecture: 15 } },
            { text: "Read AI news", personalize: "you're excited by AI and the future", scores: { ai: 15, robot: 15, ec: 12 } }
        ]
    },
    {
        text: "You are more comfortable:",
        desc: "Your characteristic work style.",
        options: [
            { text: "Long computer sessions", personalize: "you have high digital stamina", scores: { cs: 15, it: 15, cyber: 12 } },
            { text: "Handling heavy tools", personalize: "you're a wizard with heavy tools", scores: { mech: 15, auto: 15, prod: 12 } },
            { text: "Working on-site outdoors", personalize: "the open air is your preferred workstation", scores: { civil: 15, agri: 15, env: 12 } },
            { text: "Scientific lab research", personalize: "you're at home in research environments", scores: { ai: 15, biomed: 15, chem: 15 } }
        ]
    },
    {
        text: "What gives you satisfaction?",
        desc: "What makes you feel truly accomplished?",
        options: [
            { text: "Solving code errors", personalize: "logical puzzles give you great pride", scores: { cs: 15, it: 12, ai: 12 } },
            { text: "Fixing broken equipment", personalize: "you're the go-to person for repairs", scores: { mech: 15, auto: 15, ee: 10 } },
            { text: "Creating strong structures", personalize: "you build structures that last eternity", scores: { civil: 15, env: 12, architecture: 15 } },
            { text: "Building smart tech", personalize: "you're a master of technological efficiency", scores: { ai: 15, robot: 15, ec: 12 } }
        ]
    },
    {
        text: "Your friends say you are:",
        desc: "How others perceive your natural role.",
        options: [
            { text: "Tech savvy thinker", personalize: "you've earned a 'tech-smart' reputation", scores: { cs: 15, it: 15, cyber: 12 } },
            { text: "Practical hands-on worker", personalize: "others see you as a practical fix-it person", scores: { mech: 15, auto: 15, civil: 12 } },
            { text: "Organized project planner", personalize: "you're the designated planner in your group", scores: { civil: 15, prod: 15, env: 12 } },
            { text: "Deep analytical mind", personalize: "people respect your deep analytical mind", scores: { ai: 15, biomed: 15, chem: 15 } }
        ]
    },
    {
        text: "When learning something new:",
        desc: "How you approach a new topic.",
        options: [
            { text: "Try coding first", personalize: "you learn through coding it yourself", scores: { cs: 15, it: 15, ai: 12 } },
            { text: "Build physical models", personalize: "you learn by building physical models", scores: { mech: 15, auto: 15, robot: 12 } },
            { text: "Draft design plans", personalize: "you learn by drafting it on paper", scores: { civil: 15, fashion: 12, textile: 12 } },
            { text: "Study core principles", personalize: "you are a master of fundamental principles", scores: { ai: 15, biomed: 15, chem: 15 } }
        ]
    },
    {
        text: "Which place feels comfortable?",
        desc: "Identify your ideal professional habitat.",
        options: [
            { text: "Software development firm", personalize: "you belong in a high-tech software house", scores: { cs: 15, it: 15, cyber: 12 } },
            { text: "Busy industrial factory", personalize: "you're comfortable in industrial production zones", scores: { prod: 15, mech: 15, auto: 12 } },
            { text: "Massive construction site", personalize: "the site of a building project is your workspace", scores: { civil: 15, env: 12, architecture: 15 } },
            { text: "High end research lab", personalize: "you're destined for tech research", scores: { ai: 15, biomed: 15, chem: 15 } }
        ]
    },
    {
        text: "Which skill suits you?",
        desc: "Identify your strongest suit.",
        options: [
            { text: "Digital coding logic", personalize: "coding is your most natural skill", scores: { cs: 15, it: 15, cyber: 12 } },
            { text: "Expert machine handling", personalize: "you have a natural hand for machines", scores: { mech: 15, auto: 15, ee: 12 } },
            { text: "Precise structural drawing", personalize: "you're a master of structural design drawing", scores: { civil: 15, architecture: 15, fashion: 12 } },
            { text: "Advanced data analysis", personalize: "you are a master of analytical data analysis", scores: { ai: 15, math: 15, it: 12 } }
        ]
    },
    {
        text: "You enjoy learning about:",
        desc: "What keeps you reading and curious.",
        options: [
            { text: "New software features", personalize: "you're always reading software updates", scores: { cs: 15, it: 15, cyber: 12 } },
            { text: "Mechanical gear systems", personalize: "you're curious about mechanical parts", scores: { mech: 15, auto: 15, aero: 12 } },
            { text: "Durable building items", personalize: "you're interested in building material science", scores: { civil: 15, env: 12, architecture: 12 } },
            { text: "Future smart tech", personalize: "you're fascinated by smart technologies", scores: { ai: 15, robot: 15, ec: 12 } }
        ]
    },
    {
        text: "If a system fails, you:",
        desc: "Your troubleshooting specialty.",
        options: [
            { text: "Checking program code", personalize: "you go straight to checking the program code", scores: { cs: 15, it: 15, cyber: 12 } },
            { text: "Inspecting hardware parts", personalize: "you go straight to checking the machine parts", scores: { mech: 15, auto: 15, aero: 12 } },
            { text: "Finding design flaws", personalize: "you go straight to checking the structure", scores: { civil: 15, env: 12, architecture: 12 } },
            { text: "Reviewing logic patterns", personalize: "you go straight to checking the systemic logic", scores: { ai: 15, math: 15, ec: 12 } }
        ]
    },
    {
        text: "You prefer tasks that are:",
        desc: "Your primary work preference.",
        options: [
            { text: "Desk based digital work", personalize: "you are a computer-based professional", scores: { cs: 15, it: 15, cyber: 12 } },
            { text: "Physical shop floor work", personalize: "you prefer hands-on physical labor", scores: { mech: 15, auto: 15, prod: 15 } },
            { text: "Outdoor project visits", personalize: "you like being in the field", scores: { civil: 15, agri: 15, env: 12 } },
            { text: "Dedicated research hours", personalize: "you are purely a research professional", scores: { ai: 15, biomed: 15, chem: 15 } }
        ]
    },
    {
        text: "Which work feels natural to you?",
        desc: "Identify your true professional home.",
        options: [
            { text: "Digital software world", personalize: "digital and software work is your home", scores: { cs: 15, it: 15, cyber: 12 } },
            { text: "Hardwares and machines", personalize: "machines and tools feel most natural", scores: { mech: 15, auto: 15, aero: 12 } },
            { text: "Buildings and project sites", personalize: "buildings and project sites are your home", scores: { civil: 15, env: 15, architecture: 12 } },
            { text: "Logic and analysis world", personalize: "smart systems and deep analysis is your world", scores: { ai: 15, robot: 15, ec: 12 } }
        ]
    },
    {
        text: "You prefer a job that:",
        desc: "Your core work-life preference.",
        options: [
            { text: "Remote work flexibility", personalize: "you value remote and digital flexibility", scores: { cs: 15, it: 15, cyber: 12 } },
            { text: "Skilled physical labor", personalize: "you thrive on physical technical labor", scores: { mech: 15, auto: 15, prod: 12 } },
            { text: "Diverse field visits", personalize: "you like work that takes you out into the field", scores: { civil: 15, agri: 15, env: 12 } },
            { text: "Research driven growth", personalize: "you're a natural research and development hire", scores: { ai: 15, biomed: 15, chem: 15 } }
        ]
    },
    {
        text: "You enjoy:",
        desc: "Your primary professional interest.",
        options: [
            { text: "Digital software world", personalize: "you're a digital professional at heart", scores: { cs: 15, it: 15, cyber: 12 } },
            { text: "Advanced mechanical tools", personalize: "you're a master of mechanical works", scores: { mech: 15, auto: 15, aero: 12 } },
            { text: "Global infrastructure projects", personalize: "you're built for structural engineering works", scores: { civil: 15, env: 12, agri: 12 } },
            { text: "Future intelligent systems", personalize: "you're an architect of intelligent digital systems", scores: { ai: 15, robot: 15, ec: 12 } }
        ]
    },
    {
        text: "When making decisions, you use:",
        desc: "Identify your primary decision-making tool.",
        options: [
            { text: "Clear mathematical logic", personalize: "pure logic is your guide for decisions", scores: { cs: 15, it: 15, math: 12 } },
            { text: "Direct hands-on experience", personalize: "you base decisions on real-world experience", scores: { mech: 15, auto: 15, prod: 12 } },
            { text: "Detailed project planning", personalize: "careful planning is your decision-making base", scores: { civil: 15, env: 12, architecture: 15 } },
            { text: "Complex data evidence", personalize: "data-driven decisions are your specialty", scores: { ai: 15, chem: 15, biomed: 15 } }
        ]
    },
    {
        text: "You see yourself as:",
        desc: "Your core identity as a problem solver.",
        options: [
            { text: "Digital logic innovator", personalize: "you identify as a logical innovator", scores: { cs: 15, it: 15, cyber: 12 } },
            { text: "Mechanical hardware expert", personalize: "you're essentially a hands-on mechanical worker", scores: { mech: 15, auto: 15, aero: 12 } },
            { text: "Physical structural designer", personalize: "you are primarily a physical designer", scores: { civil: 15, fashion: 15, textile: 12 } },
            { text: "Deep systems analyst", personalize: "you are a deep system analyst", scores: { ai: 15, math: 15, ec: 12 } }
        ]
    },
    {
        text: "If given a project, you choose:",
        desc: "Your dream assignment.",
        options: [
            { text: "Coding modern websites", personalize: "website creation is your preferred project", scores: { it: 15, cs: 15, cyber: 12 } },
            { text: "Improving machine power", personalize: "you'd rather spend time improving machinery", scores: { mech: 15, auto: 15, prod: 15 } },
            { text: "Planning architectural wonders", personalize: "planning a building is your ideal project", scores: { civil: 15, env: 12, architecture: 15 } },
            { text: "Developing AI automation", personalize: "you want to automate everything with AI", scores: { ai: 15, robot: 15, ec: 12 } }
        ]
    },
    {
        text: "You prefer tasks that are:",
        desc: "The nature of work you enjoy most.",
        options: [
            { text: "Purely software based", personalize: "you live at the center of technology", scores: { cs: 15, it: 15, cyber: 12 } },
            { text: "Using versatile tools", personalize: "you're a master of technical tools", scores: { mech: 15, auto: 12, aero: 12 } },
            { text: "Focused on structures", personalize: "you care about structural foundations", scores: { civil: 15, architect: 12, env: 12 } },
            { text: "Deep research science", personalize: "you're a pioneer of research fields", scores: { ai: 15, biomed: 15, chem: 15 } }
        ]
    },
    {
        text: "Which achievement makes you proud?",
        desc: "The ultimate milestone.",
        options: [
            { text: "Launching digital products", personalize: "launching software products is your goal", scores: { cs: 15, it: 15, cyber: 12 } },
            { text: "Designing powerful engines", personalize: "you want to design an iconic engine unit", scores: { auto: 15, mech: 15, aero: 12 } },
            { text: "Building massive bridges", personalize: "you'd like to build a landmark bridge", scores: { civil: 15, env: 12, agri: 12 } },
            { text: "Creating smart robots", personalize: "creating an intelligent robot is your aim", scores: { ai: 15, robot: 15, ec: 12 } }
        ]
    },
    {
        text: "Under pressure, you:",
        desc: "Your characteristic reaction to stress.",
        options: [
            { text: "Apply logical steps", personalize: "logic is your shield during pressure", scores: { cs: 15, it: 15, cyber: 12 } },
            { text: "Take practical action", personalize: "you remain calm and act practically", scores: { mech: 15, auto: 15, prod: 12 } },
            { text: "Draft better plans", personalize: "you carefully pivot with a new plan", scores: { civil: 15, prod: 15, env: 12 } },
            { text: "Analyze every angle", personalize: "you analyze every angle before acting", scores: { ai: 15, biomed: 15, chem: 15 } }
        ]
    },
    {
        text: "You are interested in:",
        desc: "Identify your primary curiosity.",
        options: [
            { text: "Software tech innovation", personalize: "digital innovation drives your curiosity", scores: { cs: 15, it: 15, cyber: 12 } },
            { text: "Moving mechanical parts", personalize: "you are fascinated by mechanical systems", scores: { mech: 15, auto: 15, aero: 12 } },
            { text: "Large urban infrastructure", personalize: "you care about the world's infrastructure", scores: { civil: 15, env: 15, agri: 12 } },
            { text: "Future intelligent systems", personalize: "you're obsessed with artificial intelligence", scores: { ai: 15, robot: 15, ec: 12 } }
        ]
    },
    {
        text: "You imagine future job in:",
        desc: "Where you see your career path landing.",
        options: [
            { text: "Leading tech company", personalize: "you see yourself in a top IT company", scores: { cs: 15, it: 15, cyber: 12 } },
            { text: "Major manufacturing plant", personalize: "you see yourself leading manufacturing", scores: { prod: 15, mech: 15, auto: 12 } },
            { text: "Urban construction firm", personalize: "you want to lead a construction firm", scores: { civil: 15, architecture: 15, env: 12 } },
            { text: "High end research lab", personalize: "you're destined for tech research", scores: { ai: 15, biomed: 15, chem: 15 } }
        ]
    }
];
