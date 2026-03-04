require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

const User = require('../models/User');
const Faculty = require('../models/Faculty');
const Project = require('../models/Project');
const Placement = require('../models/Placement');
const Student = require('../models/Student');
const Notice = require('../models/Notice');
const Event = require('../models/Event');
const Alumni = require('../models/Alumni');

connectDB();

const seed = async () => {
    try {
        // Clear existing data
        await Promise.all([
            User.deleteMany(), Faculty.deleteMany(), Project.deleteMany(),
            Placement.deleteMany(), Student.deleteMany(), Notice.deleteMany(),
            Event.deleteMany(), Alumni.deleteMany()
        ]);

        // Seed admin user
        const salt = await bcrypt.genSalt(10);
        await User.create({
            name: 'Super Admin',
            email: 'admin@rai.jnnce.ac.in',
            password: await bcrypt.hash('Admin@123', salt),
            role: 'super_admin'
        });

        // Seed faculty
        const faculty = await Faculty.insertMany([
            { name: 'Dr. Rajesh Kumar', designation: 'Professor & HOD', qualification: 'Ph.D (Robotics)', specialization: 'Robotics', experience: 18, researchAreas: ['Autonomous Robots', 'Path Planning', 'SLAM'], email: 'rajesh@jnnce.ac.in', googleScholarLink: '#', publications: [{ title: 'Autonomous Navigation Using SLAM', journal: 'IEEE Robotics', year: 2023, link: '#' }] },
            { name: 'Dr. Priya Sharma', designation: 'Associate Professor', qualification: 'Ph.D (AI/ML)', specialization: 'AI/ML', experience: 12, researchAreas: ['Deep Learning', 'Computer Vision', 'NLP'], email: 'priya@jnnce.ac.in', googleScholarLink: '#', publications: [{ title: 'Real-Time Object Detection using YOLOv8', journal: 'Scopus', year: 2023, link: '#' }] },
            { name: 'Prof. Anil Naik', designation: 'Assistant Professor', qualification: 'M.Tech (Control Systems)', specialization: 'Control Systems', experience: 8, researchAreas: ['PID Control', 'Industrial Automation'], email: 'anil@jnnce.ac.in', googleScholarLink: '#' },
            { name: 'Prof. Deepa M.', designation: 'Assistant Professor', qualification: 'M.Tech (Embedded Systems)', specialization: 'Embedded Systems', experience: 6, researchAreas: ['ARM Processors', 'RTOS', 'IoT sensors'], email: 'deepa@jnnce.ac.in' },
            { name: 'Prof. Vinay Patil', designation: 'Assistant Professor', qualification: 'M.Tech (Mechatronics)', specialization: 'Mechatronics', experience: 5, researchAreas: ['Industrial Robots', 'CNC Machines', 'PLCs'], email: 'vinay@jnnce.ac.in' }
        ]);

        // Seed projects
        await Project.insertMany([
            { title: 'Autonomous Mobile Robot for Warehouse Navigation', description: 'A ROS-based AMR for indoor navigation', domain: 'Autonomous Robots', fundingAgency: 'VTU Research Fund', fundingAmount: 500000, year: 2023, status: 'ongoing', faculty: faculty[0]._id },
            { title: 'AI-Based Early Crop Disease Detection', description: 'Using CNNs to detect plant diseases from images', domain: 'Computer Vision', fundingAgency: 'DST SERB', fundingAmount: 1200000, year: 2022, status: 'completed', faculty: faculty[1]._id },
            { title: 'SLAM-based Mapping for Search & Rescue Robots', description: 'LiDAR-based SLAM in unknown environments', domain: 'SLAM', fundingAgency: 'DRDO', fundingAmount: 800000, year: 2023, status: 'ongoing', faculty: faculty[0]._id },
            { title: 'IoT-Based Smart Lab Monitoring System', description: 'Real-time lab equipment monitoring using IoT', domain: 'AI Automation', fundingAgency: 'AICTE', fundingAmount: 300000, year: 2023, status: 'completed', faculty: faculty[3]._id }
        ]);

        // Seed placements
        await Placement.insertMany([
            { year: 2024, totalStudents: 60, placedStudents: 54, highestPackage: 18, averagePackage: 8.5, internships: 48, coreRoboticsPlaced: 20, companies: [{ name: 'Infosys', studentsHired: 10 }, { name: 'TCS', studentsHired: 8 }, { name: 'ABB Robotics', studentsHired: 5 }, { name: 'Bosch', studentsHired: 4 }] },
            { year: 2023, totalStudents: 60, placedStudents: 50, highestPackage: 15, averagePackage: 7.2, internships: 42, coreRoboticsPlaced: 15, companies: [{ name: 'Wipro', studentsHired: 9 }, { name: 'Cognizant', studentsHired: 7 }, { name: 'FANUC', studentsHired: 3 }] },
            { year: 2022, totalStudents: 60, placedStudents: 45, highestPackage: 12, averagePackage: 6.5, internships: 35, coreRoboticsPlaced: 10, companies: [{ name: 'HCL', studentsHired: 8 }, { name: 'Siemens', studentsHired: 5 }] },
            { year: 2021, totalStudents: 60, placedStudents: 40, highestPackage: 10, averagePackage: 6.0, internships: 28, coreRoboticsPlaced: 8, companies: [{ name: 'L&T', studentsHired: 7 }, { name: 'TCS', studentsHired: 6 }] },
            { year: 2020, totalStudents: 60, placedStudents: 36, highestPackage: 9, averagePackage: 5.5, internships: 22, coreRoboticsPlaced: 6, companies: [{ name: 'Wipro', studentsHired: 6 }, { name: 'Infosys', studentsHired: 5 }] }
        ]);

        // Seed notices
        await Notice.insertMany([
            { title: 'Internal Assessment I Schedule – March 2024', description: 'IA-I for all semester students scheduled from 15th March 2024.', category: 'Exam', isActive: true },
            { title: 'Workshop on ROS2 and Gazebo – Registration Open', description: 'Two-day workshop on ROS2 and Gazebo simulation. Register before 10th March.', category: 'Event', isActive: true },
            { title: 'VTU Scholarship Applications 2024-25', description: 'Eligible students can apply for VTU post-matric scholarships.', category: 'Scholarship', isActive: true }
        ]);

        // Seed events
        await Event.insertMany([
            { title: 'National Robotics Championship 2023', description: 'Students won 2nd place in the national-level robotics challenge.', category: 'Competition', date: new Date('2023-11-20'), venue: 'Bengaluru', isUpcoming: false },
            { title: 'Industry Expert Talk: Future of AI in Manufacturing', description: 'Guest lecture by Senior Engineer from ABB Robotics.', category: 'Guest Lecture', date: new Date('2024-01-15'), venue: 'Seminar Hall, JNNCE', isUpcoming: false },
            { title: 'Robothon 2024 – Annual Hackathon', description: 'Inter-college robotics hackathon hosted by RAI dept.', category: 'Hackathon', date: new Date('2024-04-20'), venue: 'JNNCE Campus', isUpcoming: true }
        ]);

        // Seed alumni
        await Alumni.insertMany([
            { name: 'Arjun Hegde', batch: '2020-24', currentPosition: 'Robotics Engineer', currentOrganization: 'ABB Robotics, Bengaluru', linkedinLink: '#', successStory: 'Started as intern, converted to full-time Robotics Engineer.', isMentor: true },
            { name: 'Sneha R.', batch: '2019-23', currentPosition: 'ML Engineer', currentOrganization: 'Samsung R&D', linkedinLink: '#', successStory: 'Pursuing research on embedded AI systems.', isMentor: true },
            { name: 'Kiran Patil', batch: '2018-22', currentPosition: 'Automation Engineer', currentOrganization: 'Bosch India', linkedinLink: '#', isMentor: false }
        ]);

        // Seed students
        await Student.insertMany([
            { name: 'Rahul S.', batch: '2021-25', achievements: [{ title: '1st Prize - Smart India Hackathon 2023', category: 'Hackathon', year: 2023, description: 'Built autonomous fire-fighting robot using ROS.' }], internships: [{ company: 'ABB Robotics', role: 'Summer Intern', duration: '2 months', year: 2023 }] },
            { name: 'Pooja M.', batch: '2021-25', achievements: [{ title: 'Best FYP Award 2024', category: 'Research', year: 2024, description: 'AI-based gesture-controlled robotic arm.' }], internships: [{ company: 'Siemens', role: 'Automation Intern', duration: '3 months', year: 2023 }] }
        ]);

        console.log('✅ Database seeded successfully!');
        console.log('📧 Admin login: admin@rai.jnnce.ac.in | Password: Admin@123');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err.message);
        process.exit(1);
    }
};

seed();
