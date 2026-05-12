const createSingletonRouter = require('./_singleton');

module.exports = createSingletonRouter('site-settings', {
    siteName: 'Department of Robotics & Artificial Intelligence',
    collegeName: 'Jawaharlal Nehru National College of Engineering',
    contactEmail: 'rai@jnnce.ac.in',
    contactPhone: '+91 00000 00000',
    address: 'JNNCE, Navule, Shivamogga, Karnataka 577201',
    maintenanceMode: false,
    socialLinks: {
        website: 'https://jnnce.ac.in',
        facebook: '',
        instagram: '',
        linkedin: ''
    }
});