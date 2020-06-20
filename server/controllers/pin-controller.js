const { user: userDocument, board: boardDocument, pin: pinDocument, image: imageDocument, category: categoryDocument } = require('../models/db');
const checkMonooseObjectID = require('./validation-controller');
const Pin={

    createPin: async function(userId) {
        //implement post creation here
        //this should work with image upload
    }
};

module.exports=Pin;