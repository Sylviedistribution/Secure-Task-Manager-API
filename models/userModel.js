const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    provider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },    // OAuth provider (e.g., 'google')

    providerId: { type: String },  // Unique user ID from the provider (e.g., Google profile ID)

    name: {
        type: String,
        required: [true, 'Name is required'],
        lowercase: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        minlength: 6,
        select: false // exclude password from query results by default
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    birthdate: {
        type: Date
    }
});

// Hash the password before saving

userSchema.pre('save', async function () {

    if (!this.isModified('password')) {
        return; // Only hash if password was changed
    }

    this.password = await bcrypt.hash(this.password, 12);

});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
