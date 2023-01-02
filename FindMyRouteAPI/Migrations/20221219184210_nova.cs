using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FindMyRouteAPI.Migrations
{
    public partial class nova : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Adresa",
                table: "Osoba",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "BrojKupljenihKarata",
                table: "Osoba",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "Osoba",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Osoba",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Password",
                table: "Osoba",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Prezime",
                table: "Osoba",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Adresa",
                table: "Osoba");

            migrationBuilder.DropColumn(
                name: "BrojKupljenihKarata",
                table: "Osoba");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "Osoba");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Osoba");

            migrationBuilder.DropColumn(
                name: "Password",
                table: "Osoba");

            migrationBuilder.DropColumn(
                name: "Prezime",
                table: "Osoba");
        }
    }
}
