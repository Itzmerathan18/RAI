const createSingletonRouter = require('./_singleton');

module.exports = createSingletonRouter('homepage', {
    heroEyebrow: 'Est. 1980 · VTU Affiliated · NAAC A Grade',
    heroTitle: 'Robotics & Artificial Intelligence',
    heroSubtitle: 'JNNCE, Shivamogga',
    introTitle: 'About JNNCE',
    introParagraph1: 'JNNCE, established in 1980, is a premier engineering institution committed to academic excellence, innovation, and holistic student development.',
    introParagraph2: 'The department blends robotics, AI, automation, and industry collaborations to support hands-on learning and research.',
    statBadges: [
        { value: '60', label: 'Intake/Year' },
        { value: 'B.E.', label: '4-Year Programme' },
        { value: '5', label: 'Research Labs' },
        { value: '90%', label: 'Placement Rate' }
    ]
});