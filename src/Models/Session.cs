using System;
using System.Collections.Generic;

namespace sizing.Models
{

    public class Session
    {
        const string possibleValues = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        public Session() { }

        public Session(string connectionId)
        {
            var key = "";
            var random = new Random();

            for (var i = 0; i < 3; i++)
                key += possibleValues[random.Next(possibleValues.Length)];

            this.Key = key;

            this.ConnectionId = connectionId;
            this.Participants = new List<Participant>();
        }

        public string Key { get; set; }
        public List<sizing.Models.Participant> Participants { get; set; }
        public string ConnectionId { get; set; }

    }
}