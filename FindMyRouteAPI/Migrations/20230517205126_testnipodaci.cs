using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FindMyRouteAPI.Migrations
{
    public partial class testnipodaci : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DaniVoznje",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ponedjeljak = table.Column<bool>(type: "bit", nullable: false),
                    Utorak = table.Column<bool>(type: "bit", nullable: false),
                    Srijeda = table.Column<bool>(type: "bit", nullable: false),
                    Cetvrtak = table.Column<bool>(type: "bit", nullable: false),
                    Petak = table.Column<bool>(type: "bit", nullable: false),
                    Subota = table.Column<bool>(type: "bit", nullable: false),
                    Nedjelja = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DaniVoznje", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Grad",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Grad", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "KorisnickiNalog",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    korisnickoIme = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    lozinka = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Adresa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BrojTelefona = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    isAktiviran = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KorisnickiNalog", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Prevoznik",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Adresa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BrojTelefona = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Prevoznik", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Administrator",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false),
                    PIN = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Administrator", x => x.id);
                    table.ForeignKey(
                        name: "FK_Administrator_KorisnickiNalog_id",
                        column: x => x.id,
                        principalTable: "KorisnickiNalog",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "AutentifikacijaToken",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    vrijednost = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KorisnickiNalogId = table.Column<int>(type: "int", nullable: false),
                    vrijemeEvidentiranja = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ipAdresa = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AutentifikacijaToken", x => x.id);
                    table.ForeignKey(
                        name: "FK_AutentifikacijaToken_KorisnickiNalog_KorisnickiNalogId",
                        column: x => x.KorisnickiNalogId,
                        principalTable: "KorisnickiNalog",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Korisnik",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false),
                    BrojKupljenihKarata = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Korisnik", x => x.id);
                    table.ForeignKey(
                        name: "FK_Korisnik_KorisnickiNalog_id",
                        column: x => x.id,
                        principalTable: "KorisnickiNalog",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "Linija",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Grad1 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Presjedanje = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Grad2 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Prevoznik_id = table.Column<int>(type: "int", nullable: true),
                    PolazakSati = table.Column<int>(type: "int", nullable: false),
                    PolazakMinute = table.Column<int>(type: "int", nullable: false),
                    DolazakSati = table.Column<int>(type: "int", nullable: false),
                    DolazakMinute = table.Column<int>(type: "int", nullable: false),
                    DaniVoznje_id = table.Column<int>(type: "int", nullable: true),
                    Kilometraza = table.Column<int>(type: "int", nullable: false),
                    Trajanje = table.Column<int>(type: "int", nullable: false),
                    Cijena = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Linija", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Linija_DaniVoznje_DaniVoznje_id",
                        column: x => x.DaniVoznje_id,
                        principalTable: "DaniVoznje",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Linija_Prevoznik_Prevoznik_id",
                        column: x => x.Prevoznik_id,
                        principalTable: "Prevoznik",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "RadnikFirme",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false),
                    Pozicija = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RadniStaz = table.Column<int>(type: "int", nullable: false),
                    Prevoznik_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RadnikFirme", x => x.id);
                    table.ForeignKey(
                        name: "FK_RadnikFirme_KorisnickiNalog_id",
                        column: x => x.id,
                        principalTable: "KorisnickiNalog",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_RadnikFirme_Prevoznik_Prevoznik_id",
                        column: x => x.Prevoznik_id,
                        principalTable: "Prevoznik",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "KreditnaKartica",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Korisnik_id = table.Column<int>(type: "int", nullable: true),
                    BrojKartice = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DatumIsteka = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SigurnosniBroj = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KreditnaKartica", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KreditnaKartica_Korisnik_Korisnik_id",
                        column: x => x.Korisnik_id,
                        principalTable: "Korisnik",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_AutentifikacijaToken_KorisnickiNalogId",
                table: "AutentifikacijaToken",
                column: "KorisnickiNalogId");

            migrationBuilder.CreateIndex(
                name: "IX_KreditnaKartica_Korisnik_id",
                table: "KreditnaKartica",
                column: "Korisnik_id");

            migrationBuilder.CreateIndex(
                name: "IX_Linija_DaniVoznje_id",
                table: "Linija",
                column: "DaniVoznje_id");

            migrationBuilder.CreateIndex(
                name: "IX_Linija_Prevoznik_id",
                table: "Linija",
                column: "Prevoznik_id");

            migrationBuilder.CreateIndex(
                name: "IX_RadnikFirme_Prevoznik_id",
                table: "RadnikFirme",
                column: "Prevoznik_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Administrator");

            migrationBuilder.DropTable(
                name: "AutentifikacijaToken");

            migrationBuilder.DropTable(
                name: "Grad");

            migrationBuilder.DropTable(
                name: "KreditnaKartica");

            migrationBuilder.DropTable(
                name: "Linija");

            migrationBuilder.DropTable(
                name: "RadnikFirme");

            migrationBuilder.DropTable(
                name: "Korisnik");

            migrationBuilder.DropTable(
                name: "DaniVoznje");

            migrationBuilder.DropTable(
                name: "Prevoznik");

            migrationBuilder.DropTable(
                name: "KorisnickiNalog");
        }
    }
}
