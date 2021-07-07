const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        // description: {
        //     type: String,
        // },
    }
);

module.exports = mongoose.model("Role", schema);

let mSchema = mongoose.model("Role", schema);

const Role = mSchema;


/* TO DO: 
  ROLE MANAGEMENT SYSTEM 
*/


function initRoles() {
    Object.keys({
        ADMIN: 0,
        CUSTOMER_REPRESENTATIVE: 1
    }).map((role) => {
        if (!Role.find({ name: role })) {
            const newRole = new Role({
                name: role,
            });

            newRole.save();
        }
    })
}
