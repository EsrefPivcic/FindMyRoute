using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FindMyRouteAPI.Migrations
{
    public partial class cake : Migration
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
                name: "Osoba",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Discriminator = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PIN = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Adresa = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BrojKupljenihKarata = table.Column<int>(type: "int", nullable: true),
                    Pozicija = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RadniStaz = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Osoba", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Prevoznik",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Prevoznik", x => x.Id);
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
                        name: "FK_KreditnaKartica_Osoba_Korisnik_id",
                        column: x => x.Korisnik_id,
                        principalTable: "Osoba",
                        principalColumn: "Id");
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
                    PolazakSati = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PolazakMinute = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DolazakSati = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DolazakMinute = table.Column<string>(type: "nvarchar(max)", nullable: false),
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
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Grad");

            migrationBuilder.DropTable(
                name: "KreditnaKartica");

            migrationBuilder.DropTable(
                name: "Linija");

            migrationBuilder.DropTable(
                name: "Osoba");

            migrationBuilder.DropTable(
                name: "DaniVoznje");

            migrationBuilder.DropTable(
                name: "Prevoznik");
        }
    }
}
