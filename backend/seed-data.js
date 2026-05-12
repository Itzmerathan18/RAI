const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'db', 'data');

// Faculty data
const facultyData = [
    {
        "_id": "faculty-1",
        "name": "Dr. Rajesh Kumar",
        "designation": "Professor & HOD",
        "email": "rajesh@jnnce.ac.in",
        "qualification": "Ph.D",
        "specialization": "Robotics",
        "experience": 18,
        "researchAreas": ["Autonomous Robots", "Path Planning", "SLAM"]
    },
    {
        "_id": "faculty-2",
        "name": "Dr. Priya Sharma",
        "designation": "Associate Professor",
        "email": "priya@jnnce.ac.in",
        "qualification": "Ph.D",
        "specialization": "AI/ML",
        "experience": 12,
        "researchAreas": ["Deep Learning", "Computer Vision", "NLP"]
    },
    {
        "_id": "faculty-3",
        "name": "Prof. Anil Naik",
        "designation": "Assistant Professor",
        "email": "anil@jnnce.ac.in",
        "qualification": "M.Tech",
        "specialization": "Control Systems",
        "experience": 8,
        "researchAreas": ["PID Control", "Industrial Automation"]
    }
];

// Research data
const researchData = [
    {
        "_id": "research-1",
        "title": "Advanced Robotics and Automation",
        "leader": "Dr. Rajesh Kumar",
        "description": "Research in autonomous systems and robotics",
        "status": "Ongoing",
        "members": ["Dr. Rajesh Kumar", "Prof. Anil Naik"],
        "publications": 15,
        "fundingAmount": 500000
    },
    {
        "_id": "research-2",
        "title": "Machine Learning for Industrial Applications",
        "leader": "Dr. Priya Sharma",
        "description": "AI/ML solutions for industry 4.0",
        "status": "Ongoing",
        "members": ["Dr. Priya Sharma"],
        "publications": 12,
        "fundingAmount": 450000
    }
];

// Projects data
const projectsData = [
    {
        "_id": "project-1",
        "title": "Smart Manufacturing System",
        "lead": "Dr. Rajesh Kumar",
        "description": "IoT-based smart manufacturing platform",
        "status": "In Progress",
        "startDate": "2023-01-15",
        "endDate": "2024-12-31",
        "budget": 250000,
        "team": ["Dr. Rajesh Kumar", "Prof. Anil Naik"]
    },
    {
        "_id": "project-2",
        "title": "Computer Vision for Quality Control",
        "lead": "Dr. Priya Sharma",
        "description": "CV-based inspection system",
        "status": "In Progress",
        "startDate": "2023-06-01",
        "endDate": "2024-12-31",
        "budget": 200000,
        "team": ["Dr. Priya Sharma"]
    }
];

// Labs data
const labsData = [
    {
        "_id": "lab-1",
        "name": "Robotics Lab",
        "incharge": "Dr. Rajesh Kumar",
        "description": "Advanced robotics research and development",
        "equipment": ["ABB Robot", "KUKA Robot", "Computer Vision System"],
        "capacity": 30,
        "projects": 5
    },
    {
        "_id": "lab-2",
        "name": "AI/ML Lab",
        "incharge": "Dr. Priya Sharma",
        "description": "Machine Learning and Deep Learning research",
        "equipment": ["GPU Servers", "TensorFlow Setup", "CUDA Workstations"],
        "capacity": 25,
        "projects": 4
    }
];

// Achievements data
const achievementsData = [
    {
        "_id": "ach-1",
        "title": "Best Paper Award",
        "description": "Won best paper award at ICRA 2023",
        "awardedTo": "Dr. Rajesh Kumar",
        "date": "2023-05-15",
        "category": "Research",
        "details": "For paper on Autonomous Navigation Systems"
    },
    {
        "_id": "ach-2",
        "title": "Industry Excellence Award",
        "description": "Recognition for industry collaboration",
        "awardedTo": "Dr. Priya Sharma",
        "date": "2023-08-20",
        "category": "Industry Collaboration",
        "details": "For developing ML solutions for manufacturing"
    },
    {
        "_id": "ach-3",
        "title": "Patent Granted",
        "description": "Patent granted for smart control system",
        "awardedTo": "Dr. Rajesh Kumar, Prof. Anil Naik",
        "date": "2023-10-10",
        "category": "Innovation",
        "details": "US Patent for Adaptive Control Mechanism"
    }
];

// Publications data
const publicationsData = [
    {
        "_id": "pub-1",
        "title": "Deep Learning Models for Autonomous Systems",
        "authors": ["Dr. Rajesh Kumar", "Dr. Priya Sharma"],
        "year": 2023,
        "journal": "IEEE Transactions on Robotics",
        "doi": "10.1109/TRO.2023.1234567",
        "citationCount": 15
    },
    {
        "_id": "pub-2",
        "title": "Vision-Based Navigation in Dynamic Environments",
        "authors": ["Dr. Priya Sharma", "Prof. Anil Naik"],
        "year": 2023,
        "journal": "Computer Vision and Image Understanding",
        "doi": "10.1016/j.cviu.2023.103456",
        "citationCount": 8
    }
];

// Events data
const eventsData = [
    {
        "_id": "event-1",
        "title": "AI & Robotics Symposium 2024",
        "date": "2024-03-15",
        "location": "Main Campus Auditorium",
        "description": "Annual symposium on AI and Robotics advancements",
        "attendees": 150,
        "status": "Scheduled"
    },
    {
        "_id": "event-2",
        "title": "Industry-Academia Interaction",
        "date": "2024-04-10",
        "location": "Seminar Hall",
        "description": "Interaction with industry partners",
        "attendees": 100,
        "status": "Scheduled"
    }
];

// Gallery data
const galleryData = [
    {
        "_id": "gal-1",
        "title": "Robotics Lab Setup",
        "images": ["robotics-lab-1.jpg", "robotics-lab-2.jpg"],
        "description": "State-of-the-art robotics laboratory",
        "uploadDate": "2023-12-01",
        "category": "Labs"
    },
    {
        "_id": "gal-2",
        "title": "Alumni Meet 2024",
        "images": ["alumni-meet-1.jpg", "alumni-meet-2.jpg"],
        "description": "Annual alumni gathering",
        "uploadDate": "2024-01-15",
        "category": "Events"
    }
];

// Notices data
const noticesData = [
    {
        "_id": "notice-1",
        "title": "Semester Exam Schedule",
        "content": "Examinations scheduled from February 15 to March 10",
        "date": "2024-01-20",
        "priority": "High",
        "category": "Academic"
    },
    {
        "_id": "notice-2",
        "title": "Campus Maintenance",
        "content": "Campus will undergo maintenance on weekends",
        "date": "2024-01-22",
        "priority": "Medium",
        "category": "Administrative"
    }
];

// Placements data
const placementsData = [
    {
        "_id": "place-1",
        "company": "TCS",
        "designation": "Software Engineer",
        "salary": 650000,
        "joiningDate": "2024-06-15",
        "studentsPlaced": 5,
        "studentNames": ["Student 1", "Student 2", "Student 3", "Student 4", "Student 5"]
    },
    {
        "_id": "place-2",
        "company": "Infosys",
        "designation": "Systems Engineer",
        "salary": 600000,
        "joiningDate": "2024-07-01",
        "studentsPlaced": 3,
        "studentNames": ["Student 6", "Student 7", "Student 8"]
    }
];

// Alumni data
const alumniData = [
    {
        "_id": "alumni-1",
        "name": "Rajesh Verma",
        "graduationYear": 2019,
        "currentCompany": "Google",
        "designation": "Senior Software Engineer",
        "email": "rajesh.verma@google.com",
        "linkedin": "linkedin.com/in/rajesh-verma"
    },
    {
        "_id": "alumni-2",
        "name": "Priya Gupta",
        "graduationYear": 2020,
        "currentCompany": "Microsoft",
        "designation": "AI Researcher",
        "email": "priya.gupta@microsoft.com",
        "linkedin": "linkedin.com/in/priya-gupta"
    }
];

// Students data
const studentsData = [
    {
        "_id": "student-1",
        "name": "Aditya Sharma",
        "rollNumber": "19CS001",
        "email": "aditya.sharma@jnnce.ac.in",
        "semester": 8,
        "cgpa": 8.5,
        "specialization": "Robotics"
    },
    {
        "_id": "student-2",
        "name": "Neha Patel",
        "rollNumber": "19CS002",
        "email": "neha.patel@jnnce.ac.in",
        "semester": 8,
        "cgpa": 9.0,
        "specialization": "AI/ML"
    }
];

const homepageData = [
    {
        "_id": "homepage-1",
        "heroEyebrow": "Est. 1980 · VTU Affiliated · NAAC A Grade",
        "heroTitle": "Robotics & Artificial Intelligence",
        "heroSubtitle": "JNNCE, Shivamogga",
        "introTitle": "About JNNCE",
        "introParagraph1": "JNNCE, established in 1980, is a premier engineering institution committed to academic excellence, innovation, and holistic student development.",
        "introParagraph2": "The department blends robotics, AI, automation, and industry collaborations to support hands-on learning and research.",
        "statBadges": [
            { "value": "60", "label": "Intake/Year" },
            { "value": "B.E.", "label": "4-Year Programme" },
            { "value": "5", "label": "Research Labs" },
            { "value": "90%", "label": "Placement Rate" }
        ]
    }
];

const aboutData = [
    {
        "_id": "about-1",
        "collegeOverview": "Jawaharlal Nehru National College of Engineering is a premier institution in Shivamogga focused on engineering education, innovation, and student growth.",
        "departmentOverview": "The Department of Robotics & Artificial Intelligence prepares students for intelligent automation, robotics, and AI-driven industry applications.",
        "vision": "To be a nationally recognized centre of excellence in Robotics and Artificial Intelligence education, producing innovative engineers who lead technological advancements.",
        "mission": "Deliver outcome-based education, foster research culture, build state-of-the-art laboratories, and nurture entrepreneurship and ethics among students."
    }
];

const departmentData = [
    {
        "_id": "department-1",
        "establishedYear": 2020,
        "annualIntake": 60,
        "affiliation": "VTU, Belagavi",
        "accreditation": "NAAC A",
        "programme": "B.E. in Robotics & Artificial Intelligence",
        "hodName": "Dr. Basappaji K M",
        "hodTitle": "Head of Department",
        "hodMessage": "Welcome to the Department of Robotics & Artificial Intelligence at JNNCE, Shivamogga. We combine robotics, machine learning, control systems, and embedded AI to prepare students for Industry 4.0.",
        "peos": [
            { "code": "PEO1", "title": "Core Technical Expertise", "desc": "Apply mathematics, sciences, and engineering fundamentals to design and develop robotic systems and AI-driven solutions." },
            { "code": "PEO2", "title": "Innovation & Research", "desc": "Contribute to research, design innovative products, and solve complex problems in robotics, automation, and artificial intelligence." },
            { "code": "PEO3", "title": "Industry Readiness", "desc": "Become employable in industry and contribute to automation, manufacturing, defence, healthcare, and technology sectors." },
            { "code": "PEO4", "title": "Professional Ethics & Leadership", "desc": "Exhibit ethical professional behaviour, leadership skills, and adaptability to evolving technological landscapes." }
        ],
        "pos": [
            { "code": "PO1", "title": "Engineering Knowledge", "desc": "Apply mathematics, science, and engineering fundamentals to robotics and AI systems." },
            { "code": "PO2", "title": "Problem Analysis", "desc": "Identify and formulate engineering problems in automation and study literature for solutions." },
            { "code": "PO3", "title": "Design/Development", "desc": "Design solutions for complex engineering problems including mechanical, electronic, and AI components." }
        ],
        "psos": [
            { "code": "PSO1", "title": "Robotics System Design", "desc": "Design, prototype, and programme robotic systems using tools like ROS, MATLAB, and hardware platforms." },
            { "code": "PSO2", "title": "AI & ML Applications", "desc": "Apply machine learning, deep learning, and computer vision algorithms to real-world challenges." },
            { "code": "PSO3", "title": "Industrial Automation", "desc": "Design PLC-based, IoT-integrated automation systems for smart manufacturing environments." }
        ]
    }
];

const testimonialsData = [
    {
        "_id": "test-1",
        "name": "Sahana R",
        "designation": "Class of 2024",
        "quote": "The RAI department gave me a real project mindset. The labs and faculty support made a big difference.",
        "rating": 5,
        "featured": true,
        "date": "2024-04-18"
    },
    {
        "_id": "test-2",
        "name": "Karthik B",
        "designation": "Alumnus, Software Engineer",
        "quote": "The emphasis on robotics and AI tools helped me transition smoothly into industry interviews and project work.",
        "rating": 5,
        "featured": true,
        "date": "2024-04-20"
    }
];

const siteSettingsData = [
    {
        "_id": "settings-1",
        "siteName": "Department of Robotics & Artificial Intelligence",
        "collegeName": "Jawaharlal Nehru National College of Engineering",
        "contactEmail": "rai@jnnce.ac.in",
        "contactPhone": "+91 00000 00000",
        "address": "JNNCE, Navule, Shivamogga, Karnataka 577201",
        "maintenanceMode": false,
        "socialLinks": {
            "website": "https://jnnce.ac.in",
            "facebook": "",
            "instagram": "",
            "linkedin": ""
        }
    }
];

// Write all files
const collections = {
    'faculty.json': facultyData,
    'research.json': researchData,
    'projects.json': projectsData,
    'labs.json': labsData,
    'achievements.json': achievementsData,
    'publications.json': publicationsData,
    'events.json': eventsData,
    'gallery.json': galleryData,
    'notices.json': noticesData,
    'placements.json': placementsData,
    'alumni.json': alumniData,
    'students.json': studentsData,
    'homepage.json': homepageData,
    'about.json': aboutData,
    'department.json': departmentData,
    'testimonials.json': testimonialsData,
    'site-settings.json': siteSettingsData
};

Object.entries(collections).forEach(([filename, data]) => {
    const filepath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✓ Created ${filename} with ${data.length} records`);
});

console.log('\nAll data files created successfully!');
