const Message = require('./models/Message');
const Group = require('./models/Group');

const messageController = async (data, socket, ws) => {
    const json = JSON.parse(data);

    switch (json.event) {
        case 'chat-message': {
            try {
                const newMessage = new Message(json.message);

                const group = await Group.findOne({ _id: newMessage.groupId });
                group.lastMessage = newMessage.id;
                await group.save();

                const savedMessage = await newMessage.save();

                const response = JSON.stringify(savedMessage);
                socket.clients.forEach((client) => client.send(response));
            } catch (err) {
                console.log(err);
            }
        }
        default: {
            ws.send(new Error('Wrong query').message);
        }
    }
};

module.exports = messageController;
