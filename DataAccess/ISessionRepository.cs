namespace DataAccess
{
    interface ISessionRepository
    {

        Models.Session CreateSession();

        Models.Session GetSession(string key);

        Models.Participant CreateParticipant(string sessionKey, string name);

    }
}