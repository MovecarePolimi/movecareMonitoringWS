var mongoose = require('mongoose');
var dbconfig = require('../config.js');
var currentDatabase = "/users";

mongoose.Promise = global.Promise;

var conn = mongoose.createConnection(dbconfig.url+currentDatabase);

var userSchema = mongoose.Schema({

    /////////////////////////////////////////////////////////////////////////////////
    // Implicit metadata
    /////////////////////////////////////////////////////////////////////////////////

    // the username from community
    username: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: [true, 'Username must be provided'],
        index: true,
        match: [/^\S*$/, '{VALUE} is not a valid username']
    },

    // the user id from community
    userid: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, 'Userid must be provided']
    },

    email: {
        type: String,
        required: true,
        match: /\S+@\S+\.\S+/ //TODO: check this regexp
    },

    /////////////////////////////////////////////////////////////////////////////////
    // Metadata
    /////////////////////////////////////////////////////////////////////////////////

    // the user type: e.g., pilot, caregiver, community ... see db/config.js for allowed types
    t: {
        type: String,
        lowercase: true,
        required: [true, 'User type must be provided'],
        validate: {
            validator: function(v){
                return dbconfig.usertypes.indexOf(v) > -1;
            },
            message: '{VALUE} is not a valid user type'
        }
    },

    approved: {
        type: Boolean,
        default: false
    },

    // userids of assisted pilots (empy if the user is not a caregiver)
    assists: [{
        assisted : String,
        approved: {
            type: Number,
            max: 1,
            min: -1
        },
        nrequests: {
            type: Number,
            max: dbconfig.max_assistance_requests,
            min: 1
        }
    }],

    /////////////////////////////////////////////////////////////////////////////////
    // * Personal data
    /////////////////////////////////////////////////////////////////////////////////

    name: {
        first: String,
        last: String
    },

    // date of birth, age defined as a vritual
    birth: {
        type: Date,
        required: false
    },

    // the user language: e.g., ita, en, es ... see db/config.js for allowed languages
    // TODO: decide from where to read this, maybe from a configuration file local to the movecare installation
    lan: {
        type: String,
        lowercase: true,
        required: [true, 'User language must be provided'],
        validate: {
            validator: function(v){
                return dbconfig.langs.indexOf(v) > -1;
            },
            message: '{VALUE} is not a valid language'
        }
    },

    /////////////////////////////////////////////////////////////////////////////////
    // Numeric fields
    /////////////////////////////////////////////////////////////////////////////////

    // Set of named numeric attributes partitioned in:
    // * Clinical info: (e.g., weight, mmse, ...)
    // * Preference scores: (e.g., How much do you like pizza from 0 to 5?, ...)
    nf: [{
        name: String, // e.g., weight, likespizza
        value: Number, // e.g., 90, 5
        unit: String // e.g., Kg, -
    }],

    /////////////////////////////////////////////////////////////////////////////////
    // Text fields
    /////////////////////////////////////////////////////////////////////////////////

    // Set of named string attributes partitioned in:
    // * Preference answers: (e.g., What's your favourite pet? ...)
    sf: [{
        name: String, // e.g., favouritepet
        value: String // e.g., bugs
    }]

}, {timestamps: true});

// Virtuals
userSchema.virtual('fullName').get(function () {
    return this.name.first + ' ' + this.name.last;
});

userSchema.virtual('age').get(function () {
    var ageDifMs = Date.now() - this.birth.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
});

//userSchema.set('toObject', { virtuals: true });
//userSchema.set('toJSON', { virtuals: true });

// Statics
userSchema.statics.findByUsername = function(u, cb) {
    return this.find({ username: u }, cb);
};

userSchema.statics.findByUserID = function(u, cb) {
    return this.find({ userid: u }, cb);
};

userSchema.statics.upsertByUsername = function(u, o, cb) {
    var query = {
        username: u
    };

    var options = {
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true
    };

    return this.update(query, o, options, cb(err, raw));
};

// compile to a model
module.exports = conn.model('User', userSchema);
