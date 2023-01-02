using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FindMyRouteAPI.Migrations
{
    public partial class nova3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.CreateIndex(
                name: "IX_KreditnaKartica_Korisnik_id",
                table: "KreditnaKartica",
                column: "Korisnik_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KreditnaKartica");
        }
    }
}
