const createSingletonRouter = require('./_singleton');

module.exports = createSingletonRouter('department', {
    establishedYear: 2020,
    annualIntake: 60,
    affiliation: 'VTU, Belagavi',
    accreditation: 'NAAC A',
    programme: 'B.E. in Robotics & Artificial Intelligence',
    hodName: 'Dr. Basappaji K M',
    hodTitle: 'Head of Department',
    hodMessage: 'Welcome to the Department of Robotics & Artificial Intelligence at JNNCE, Shivamogga. We combine robotics, machine learning, control systems, and embedded AI to prepare students for Industry 4.0.',
    peos: [
        { code: 'PEO1', title: 'Core Technical Expertise', desc: 'Apply mathematics, sciences, and engineering fundamentals to design and develop robotic systems and AI-driven solutions.' },
        { code: 'PEO2', title: 'Innovation & Research', desc: 'Contribute to research, design innovative products, and solve complex problems in robotics, automation, and artificial intelligence.' },
        { code: 'PEO3', title: 'Industry Readiness', desc: 'Become employable in industry and contribute to automation, manufacturing, defence, healthcare, and technology sectors.' },
        { code: 'PEO4', title: 'Professional Ethics & Leadership', desc: 'Exhibit ethical professional behaviour, leadership skills, and adaptability to evolving technological landscapes.' }
    ],
    pos: [
        { code: 'PO1', title: 'Engineering Knowledge', desc: 'Apply mathematics, science, and engineering fundamentals to robotics and AI systems.' },
        { code: 'PO2', title: 'Problem Analysis', desc: 'Identify and formulate engineering problems in automation and study literature for solutions.' },
        { code: 'PO3', title: 'Design/Development', desc: 'Design solutions for complex engineering problems including mechanical, electronic, and AI components.' }
    ],
    psos: [
        { code: 'PSO1', title: 'Robotics System Design', desc: 'Design, prototype, and programme robotic systems using tools like ROS, MATLAB, and hardware platforms.' },
        { code: 'PSO2', title: 'AI & ML Applications', desc: 'Apply machine learning, deep learning, and computer vision algorithms to real-world challenges.' },
        { code: 'PSO3', title: 'Industrial Automation', desc: 'Design PLC-based, IoT-integrated automation systems for smart manufacturing environments.' }
    ]
});