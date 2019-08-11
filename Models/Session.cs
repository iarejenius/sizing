using System;
using System.Collections.Generic;

namespace Models
{

    class Session
    {
        const string possibleValues = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        public Session(string connectionId)
        {
            var key = "";
            var random = new Random();

            for (var i = 0; i < 3; i++)
                key += possibleValues[random.Next(possibleValues.Length)];

            this.Key = key;

            this.ConnectionId = connectionId;
        }

        public string Key { get; set; }
        public List<Models.Participant> Participants { get; set; }
        public string ConnectionId { get; set; }

    }
}