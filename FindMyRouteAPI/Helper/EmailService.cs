using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;

public class EmailService
{
    private readonly SmtpClient _smtpClient;
    private readonly IConfiguration _configuration;

    public EmailService(SmtpClient smtpClient, IConfiguration configuration)
    {
        _smtpClient = smtpClient;
        _configuration = configuration;
    }

    public void SendEmail(string recipient, string name)
    {
        string subject = "FindMyRoute - Registracija uspješna";
        string body = $"Poštovani/a {name},\n\nObavještavamo Vas da ste se uspješno registrirali na FindMyRoute.\nHvala na ukazanoj prilici i dobro došli.\n\nFindMyRoute Team";
        var senderName = _configuration["EmailSettings:SenderName"];
        var senderEmail = _configuration["EmailSettings:SenderEmail"];

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(senderName, senderEmail));
        message.To.Add(new MailboxAddress("", recipient));
        message.Subject = subject;
        message.Body = new TextPart("plain")
        {
            Text = body
        };
        var smtpServer = _configuration.GetValue<string>("EmailSettings:SmtpServer");
        var smtpPort = _configuration.GetValue<int>("EmailSettings:SmtpPort");
        var username = _configuration.GetValue<string>("EmailSettings:Username");
        var password = _configuration.GetValue<string>("EmailSettings:Password");
        _smtpClient.Connect(smtpServer, smtpPort, SecureSocketOptions.StartTls);
        _smtpClient.Authenticate(username, password);
        _smtpClient.Send(message);
        _smtpClient.Disconnect(true);
    }
}
