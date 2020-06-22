const { user: userDocument, board: boardDocument, pin: pinDocument, image: imageDocument, category: categoryDocument } = require('../models/db');
const checkMonooseObjectID = require('./validation-controller');
const User={

    getUserById: async function(userId) {
        try {
            if (!checkMonooseObjectID([userId])) throw new Error('not mongoose id');
            const user = await userDocument.findById(userId, (err, user) => {
                if (err) return 0;
                return user;
            }).catch((err) => 0);

            return user;
        } catch (ex) {
            return 0;
        }
    },
    checkMAilExistAndFormat: async function(email){
       user =await  userDocument.findOne({ email: email }).exec().then(async user => {
          return user?user:0;
            });
        return user;
    } 
};

module.exports=User;