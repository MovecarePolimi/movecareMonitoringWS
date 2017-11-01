
module.exports = {
    'url' : 'mongodb://localhost:27017',
    'measurements' : '/polimi_measurements',
    'indicators' : '/polimi_indicators',
    'SUM' : '/messages',         // Single User Message
    'SUC' : '/calls',            // Single User Call
    'SSU' : '/smartphoneUse',    // Summary Smartphone Use
    'PSU' : '/peopleUse',         // People Smartphone Use
    'type': ['IN', 'OUT'],
    'temporality': ['timestamp', 'datestamp', 'timeinterval']
};
