
module.exports = {
    'url' : 'mongodb://localhost:27017',
    //'url' : 'mongodb://10.0.0.67:27017',
    'measurements' : '/polimi_measurements',
    'indicators' : '/polimi_indicators',
    'SUM' : '/messages',         // Single User Message collection
    'SUC' : '/calls',            // Single User Call collection
    'SSU' : '/smartphoneUse',    // Summary Smartphone Use collection
    'PSU' : '/peopleUse',         // People Smartphone Use collection
    'type': ['IN', 'OUT'],
    'temporality': ['timestamp', 'datestamp', 'timeinterval']
};
