using FindMyRouteAPI.Data;
using FindMyRouteAPI.Modul.Models;
using FindMyRouteAPI.Modul.ViewModels;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MimeKit;

public class EmailService
{
    private readonly SmtpClient _smtpClient;
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _dbContext;

    public EmailService(SmtpClient smtpClient, IConfiguration configuration, ApplicationDbContext dbContext)
    {
        _smtpClient = smtpClient;
        _configuration = configuration;
        _dbContext = dbContext;
    }

    public void SendEmailRegister(Korisnik x)
    {
        string subject = "Dobrodošli u FindMyRoute - Potvrda registracije";
        string body = $"Poštovani/a {x.Ime + " " + x.Prezime},\n\nDobrodošli u FindMyRoute! Hvala Vam što ste se registrirali na našu " +
            $"aplikaciju za pretragu i kupovinu autobusnih i voznih karata između gradova. Ovim e-mailom potvrđujemo " +
            $"Vašu uspješnu registraciju.\r\n\r\n" +
            $"Vaši korisnički podaci:\r\n" +
            $"Korisničko ime: {x.korisnickoIme}\r\n" +
            $"E-mail adresa: {x.Email}\r\n" +
            $"Za početak, prijavite se u aplikaciju koristeći svoje korisničke podatke i istražite sve mogućnosti koje " +
            $"Vam pruža FindMyRoute.\r\n\r\nAko imate bilo kakva pitanja ili trebate dodatnu pomoć, slobodno nas " +
            $"kontaktirajte putem našeg korisničkog servisa. Naš tim će Vam rado pomoći i osigurati da imate što " +
            $"ugodnije iskustvo korištenja aplikacije.\r\n\r\nJoš jednom, dobrodošli u FindMyRoute! Veselimo se što " +
            $"ćemo Vam pomoći u planiranju vaših putovanja i osigurati Vam udobno putovanje.\r\n\r\nS " +
            $"poštovanjem,\r\nFindMyRoute Team";
        var senderName = _configuration["EmailSettings:SenderName"];
        var senderEmail = _configuration["EmailSettings:SenderEmail"];

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(senderName, senderEmail));
        message.To.Add(new MailboxAddress("", x.Email));
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

    public void SendEmailPurchase(Kupovina x, string nacinPlacanja)
    {
        Korisnik korisnik = _dbContext.Korisnik.FirstOrDefault(k => k.id == x.Korisnik_id);
        Linija linija = _dbContext.Linija.Include(g => g.Grad1).Include(g => g.Grad2).FirstOrDefault(l => l.Id == x.Linija_id);
        Prevoznik prevoznik = _dbContext.Prevoznik.FirstOrDefault(p => p.Id == linija.Prevoznik_id);
        string subject = "FindMyRoute - Potvrda o kupovini karte";
        string body = $"Poštovani/a {korisnik.Ime + " " + korisnik.Prezime},\n\nHvala Vam što ste koristili našu " +
            $"aplikaciju za kupovinu karte za putovanje.\n\nOvim e-mailom potvrđujemo detalje vaše kupovine:\n" +
            $"Polazište: {linija.Grad1.Naziv}\n" +
            $"Destinacija: {linija.Grad2.Naziv}\n" +
            $"Tip linije: Direktna linija\n" +
            $"Prevoznik: {prevoznik.Naziv}\n" +
            $"Datum vožnje: {x.DatumVoznje.ToString("dd.MM.yyyy")}\n" +
            $"Vrijeme polaska: {linija.PolazakSati.ToString("D2") + ":" + linija.PolazakMinute.ToString("D2")}\n" +
            $"Vrijeme dolaska: {linija.DolazakSati.ToString("D2") + ":" + linija.DolazakMinute.ToString("D2")}\n" +
            $"Cijena po karti: {linija.Cijena}KM\n" +
            $"Broj karata: {x.Kolicina}\n" +
            $"Ukupna cijena: {x.UkupnaCijena}KM\n" +
            $"Način plaćanja: {nacinPlacanja}\n" +
            $"Datum kupovine: {x.DatumKupovine.ToString("dd.MM.yyyy")}\n\n" + 
            $"Vaša karta je uspješno rezervirana i možete je koristiti na dan putovanja. Molimo Vas da na dan " +
            $"putovanja imate ovu e-potvrdu ili identifikacijski dokument s kojim ste izvršili kupovinu kako biste " +
            $"je mogli predočiti vozaču/inspektorima.\n\nAko imate bilo kakva pitanja ili trebate dodatne " +
            $"informacije, slobodno nas kontaktirajte putem našeg korisničkog servisa.\n\nHvala Vam još jednom " +
            $"na korištenju naše aplikacije i želimo Vam ugodno putovanje!\n\nS poštovanjem, FindMyRoute Team";
        var senderName = _configuration["EmailSettings:SenderName"];
        var senderEmail = _configuration["EmailSettings:SenderEmail"];

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(senderName, senderEmail));
        message.To.Add(new MailboxAddress("", korisnik.Email));
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

    public void SendEmailPurchaseTransfer(PresjedanjeEmailVM x)
    {
        Korisnik korisnik = _dbContext.Korisnik.FirstOrDefault(k => k.id == x.Korisnik_id);
        Linija linija1 = _dbContext.Linija.Include(g => g.Grad1).Include(g => g.Grad2).FirstOrDefault(l => l.Id == x.Linija1_id);
        Linija linija2 = _dbContext.Linija.Include(g => g.Grad1).Include(g => g.Grad2).FirstOrDefault(l => l.Id == x.Linija2_id);
        Prevoznik prevoznik1 = _dbContext.Prevoznik.FirstOrDefault(p => p.Id == linija1.Prevoznik_id);
        Prevoznik prevoznik2 = _dbContext.Prevoznik.FirstOrDefault(p => p.Id == linija2.Prevoznik_id);
        int ukupnaCijena = (x.Kolicina * linija1.Cijena) + (x.Kolicina * linija2.Cijena);
        string nacinPlacanja = "";
        if (!string.IsNullOrEmpty(x.PayPalEmail))
        {
            nacinPlacanja = "PayPal(" + x.PayPalEmail + ")";
        }
        else
        {
            if (!string.IsNullOrEmpty(x.TipKartice))
            {
                nacinPlacanja = x.TipKartice + " kreditna kartica";
            }
            else
            {
                KreditnaKartica kartica = _dbContext.KreditnaKartica.FirstOrDefault(k => k.Korisnik_id == x.Korisnik_id);
                nacinPlacanja = kartica.TipKartice + " kreditna kartica";
            }
        }
        string subject = "FindMyRoute - Potvrda o kupovini karata";
        string body = $"Poštovani/a {korisnik.Ime + " " + korisnik.Prezime},\n\nHvala Vam što ste koristili našu " +
            $"aplikaciju za kupovinu karti za putovanje.\n\nOvim e-mailom potvrđujemo detalje vaše kupovine:\n" +
            $"Polazište: {linija1.Grad1.Naziv}\n" +
            $"Destinacija: {linija2.Grad2.Naziv}\n" +
            $"Tip linije: Presjedanje ({linija1.Grad2.Naziv})\n\n" +
            $"Informacije o prvoj liniji (prije presjedanja):\n" +
            $"Prevoznik: {prevoznik1.Naziv}\n" +
            $"Polazište: {linija1.Grad1.Naziv}\n" +
            $"Destinacija (Presjedanje): {linija1.Grad2.Naziv}\n" +
            $"Datum vožnje: {x.DatumVoznje.ToString("dd.MM.yyyy")}\n" +
            $"Vrijeme polaska: {linija1.PolazakSati.ToString("D2") + ":" + linija1.PolazakMinute.ToString("D2")}\n" +
            $"Vrijeme dolaska: {linija1.DolazakSati.ToString("D2") + ":" + linija1.DolazakMinute.ToString("D2")}\n" +
            $"Cijena po karti: {linija1.Cijena}KM\n\n" +
            $"Informacije o drugoj liniji (poslije presjedanja):\n" +
            $"Prevoznik: {prevoznik2.Naziv}\n" +
            $"Polazište (Presjedanje): {linija2.Grad1.Naziv}\n" +
            $"Destinacija: {linija2.Grad2.Naziv}\n" +
            $"Datum vožnje: {x.DatumVoznje.ToString("dd.MM.yyyy")}\n" +
            $"Vrijeme polaska: {linija2.PolazakSati.ToString("D2") + ":" + linija2.PolazakMinute.ToString("D2")}\n" +
            $"Vrijeme dolaska: {linija2.DolazakSati.ToString("D2") + ":" + linija2.DolazakMinute.ToString("D2")}\n" +
            $"Cijena po karti: {linija2.Cijena}KM\n\n" +
            $"Ukupno:\n" +
            $"Broj karata po liniji: {x.Kolicina}\n" +
            $"Ukupna cijena: {ukupnaCijena}KM\n" +
            $"Način plaćanja: {nacinPlacanja}\n" +
            $"Datum kupovine: {DateTime.Now.ToString("dd.MM.yyyy")}\n\n" +
            $"Vaše karte su uspješno rezervirane i možete ih koristiti na dan putovanja. Molimo Vas da na dan " +
            $"putovanja imate ovu e-potvrdu ili identifikacijski dokument s kojim ste izvršili kupovinu kako biste " +
            $"je mogli predočiti vozaču/inspektorima.\n\nAko imate bilo kakva pitanja ili trebate dodatne " +
            $"informacije, slobodno nas kontaktirajte putem našeg korisničkog servisa.\n\nHvala Vam još jednom " +
            $"na korištenju naše aplikacije i želimo Vam ugodno putovanje!\n\nS poštovanjem, FindMyRoute Team";
        var senderName = _configuration["EmailSettings:SenderName"];
        var senderEmail = _configuration["EmailSettings:SenderEmail"];

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(senderName, senderEmail));
        message.To.Add(new MailboxAddress("", korisnik.Email));
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
