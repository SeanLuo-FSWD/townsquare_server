import ConversationModel from "../model/conversation.model";

class ConversationService {
    public getConversationByMembers = async (members) => {
        const matchedConversation = await ConversationModel.getConversationByMembers(members);

        if (matchedConversation.length) {
            return matchedConversation[0];
        } else {
            const usersInConversation = await ConversationModel.getUsersInConversation(members);
            const newConversation = new ConversationModel(usersInConversation);
            const result = await newConversation.create();
            console.log("created conversation", result);
            return {
                ...result,
                isNewConversation: true
            }
        }
    }

  public getAllConversationsByUserId = async (userId) => {
    const conversations = await ConversationModel.getAllConversationsByUserId(
      userId
    );
    return conversations;
  };
}

export default ConversationService;
