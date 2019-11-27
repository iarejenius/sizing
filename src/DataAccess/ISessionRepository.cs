using sizing.Models;

namespace sizing.DataAccess
{
    public interface ISessionRepository
    {

        sizing.Models.Session CreateSession(string connectionId);

        sizing.Models.Session GetSession(string key);

        sizing.Models.Participant CreateParticipant(string sessionKey, string name);

        void RemoveSession(string key);

        void UpdateParticipant(Participant updatedParticipant);

        void RemoveParticipant(Participant removedParticipant);

        Participant FindParticipantByConnectionId(string connectionId);
    }
}