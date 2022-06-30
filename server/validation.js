const Validator = require("fastest-validator");
const validator = new Validator();

const schema = {
    signup: {
        name: { type: 'string', min: 3, max: 255, optional: false},
        email: {type: 'email', optional: false},
        password: {type: 'string', min: 8, max: 255, optional: false},
        gender: {type: 'enum', values: ["male", "female"], optional: true},
        birthday: {type: 'string', nullable: true, optional: true}
    }
};

const validate = (data, type) => {
    const check = validator.compile(schema[type]);

    return check(data);
}

module.exports = {validate}