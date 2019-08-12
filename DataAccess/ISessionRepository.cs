using Models;

namespace DataAccess
{
    interface ISessionRepository
    {

        Models.Session CreateSession(string connectionId);

        Models.Session GetSession(string key);

        Models.Participant CreateParticipant(string sessionKey, string name);

        void RemoveSession(string key);

        void UpdateParticipant(Participant updatedParticipant);

        void RemoveParticipant(Participant removedParticipant);

        Participant FindParticipantByConnectionId(string connectionId);
    }
}