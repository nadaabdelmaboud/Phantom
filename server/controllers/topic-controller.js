const { user: userDocument, board: boardDocument, pin: pinDocument, image: imageDocument, category: categoryDocument, topic: topicDocument } = require('../models/db');
const checkMonooseObjectID = require('./validation-controller');
const  mongoose  = require('mongoose');
const Pin = require('./pin-controller');
const limitOffset = require('../middlewares/limit-offset');
const Topic={

    createTopic: async function(imageId, description, imageWidth, imageHeight, name) {
        if (!checkMonooseObjectID([imageId])) return 0;
        let topicExist = await topicDocument.find({'name': name}, (err, topicExist) => {
            if (err) return 0;
            return topicExist;
        });
        if(topicExist) return 0;
        let topic = new topicDocument({
            name: name,
            imageId: imageId,
            imageWidth:imageWidth,
            imageHeight:imageHeight,
            name: name,
            followers: [],
            description: description,
            pins: [],
        });
        await topic.save();
        return topic;
    },
    getTopicById: async function(topicId){
        if (!checkMonooseObjectID([topicId])) return 0;
        const topic = await  topicDocument.findById(topicId, (err, topic) => {
            if (err) return 0;
            return topic;
        });
        return topic;
    },
    getTopics: async function(){
        const topics = await topicDocument.find({}, (err, topic) => {
            if (err) return 0;
            return topic;
        });
        return topics;
    },
    addPinToTopic: async function(topicName, pinId){
        if (!checkMonooseObjectID([pinId])) return 0;
        let topic = await topicDocument.find({name: topicName}, (err, topic) => {
            if (err) return 0;
            return topic;
        });
        if (!topic){
            topic = this.createTopic(undefined, undefined, undefined, undefined, topicName);
        }
        const pin = Pin.getPinById(pinId);
        if(topic && pin){
            topic.pins.push(pinId);
            topic.save();
            return 1;
        }
        return 0;
    },
    getPinsOfTopic: async function(topicId, limit, offset){
        if (!checkMonooseObjectID([topicId])) return 0;
        const topic = await this.getTopicById(topicId);
        if (topic.pins.length == 0) return [];
        let pinsIds = limitOffset(limit, offset, topic.pins);
        let pins = [];
        for (let i = 0; i < pinsIds.length; i++){
            let pin = Pin.getPinById(pinsIds[i]);
            if (pin){
                pins.push(pin);
            }
        }
        return pins;
    }
};

module.exports=Topic;