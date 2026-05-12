/* Home page content: timeline, tech stack, featured projects */

export const timeline = [
  { year: '2020', title: 'RAI Department Launched', desc: 'Dept. of Robotics & AI established at JNNCE under VTU.' },
  { year: '2021', title: 'First Batch & Labs', desc: 'First B.E. RAI batch; RoboDK and hardware labs set up.' },
  { year: '2022', title: 'Research & Industry Tie-ups', desc: 'ABB, Bosch, Siemens collaborations; DST-SERB funded projects.' },
  { year: '2023', title: 'Autonomous Systems Focus', desc: 'SLAM, computer vision, and industrial automation projects.' },
  { year: '2024', title: 'AI Lab Expansion', desc: 'GPU lab, hackathons, 90%+ placements; Robothon annual event.' },
  { year: '2025', title: 'Advanced Robotics Lab', desc: 'Expanded research in human-robot interaction and swarm systems.' },
];

export const techStack = [
  { name: 'ROS2', label: 'ROS 2' },
  { name: 'Python', label: 'Python' },
  { name: 'TensorFlow', label: 'TensorFlow' },
  { name: 'OpenCV', label: 'OpenCV' },
  { name: 'Arduino', label: 'Arduino' },
  { name: 'Raspberry Pi', label: 'Raspberry Pi' },
  { name: 'NVIDIA CUDA', label: 'NVIDIA CUDA' },
  { name: 'PyTorch', label: 'PyTorch' },
  { name: 'Gazebo', label: 'Gazebo' },
  { name: 'LiDAR', label: 'LiDAR' },
];

export const featuredProjects = [
  {
    id: 1,
    title: 'Autonomous Pick-and-Place Robot',
    desc: '6-DOF robotic arm with ROS2 and computer vision for warehouse automation.',
    tech: ['ROS2', 'Python', 'OpenCV', 'MoveIt'],
    emoji: '🦾',
    href: '/projects',
    award: 'Best Project · VTU Tech Fest 2024',
  },
  {
    id: 2,
    title: 'AI-Based Crop Disease Detection',
    desc: 'YOLOv8 model on 12,000+ images for real-time leaf disease detection.',
    tech: ['PyTorch', 'YOLO', 'FastAPI'],
    emoji: '🌱',
    href: '/projects',
    award: 'DST-SERB Funded',
  },
  {
    id: 3,
    title: 'Autonomous Inspection Drone',
    desc: 'GPS-guided drone with onboard vision for structural crack detection.',
    tech: ['ArduPilot', 'MAVLink', 'OpenCV'],
    emoji: '🚁',
    href: '/projects',
    award: 'Runner-up · Drone Innovation Challenge',
  },
  {
    id: 4,
    title: 'Smart Factory PLC Control',
    desc: 'Industry 4.0 prototype with Siemens PLC and SCADA monitoring.',
    tech: ['Siemens PLC', 'SCADA', 'OPC-UA'],
    emoji: '🏭',
    href: '/projects',
    award: null,
  },
];

export const achievementMetrics = [
  { value: 15, suffix: '+', label: 'Robotics Projects' },
  { value: 10, suffix: '+', label: 'Hackathons' },
  { value: 5, suffix: '+', label: 'Research Papers' },
  { value: 20, suffix: '+', label: 'Team Members' },
  { value: 90, suffix: '%', label: 'Placement Rate' },
  { value: 12, suffix: '+', label: 'Expert Faculty' },
];
