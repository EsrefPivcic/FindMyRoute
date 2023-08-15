import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MojConfig} from "../moj-config";
import {Router} from "@angular/router";

@Component({
  selector: 'app-prevoznici',
  templateUrl: 'prevoznici.component.html',
  styleUrls: ['prevoznici.component.css']
})
export class PrevozniciComponent implements OnInit {

  prevoznici: any;
  constructor(private httpKlijent: HttpClient, private router: Router) {
  }

  DetaljiPrevoznika(id : number) {
    this.router.navigate(['/prevoznik', id]);
  }

  ngOnInit(): void {
    this.GetPrevoznici();
  }

  GetPrevoznici(): void {
    fetch(MojConfig.adresa_servera+ "/Prevoznik/GetAll")
      .then(
        r=> {
          if (r.status != 200) {
            if (r.status == 400) {
              alert("Error!");
            }
            else {
              alert("greska" + r.status);
            }
            return;
          }
          r.json().then(x=>{
            this.prevoznici = x;
          });
        }
      )
      .catch(
        err=>{
          alert("greska" + err);
        }
      )
  }

  PrikaziHelp(): void {
    const form = document.createElement("form");

    form.style.position = "fixed";
    form.style.top = "50%";
    form.style.left = "50%";
    form.style.transform = "translate(-50%, -50%)";
    form.style.backgroundColor = "#333333";
    form.style.color = "white";
    form.style.padding = "20px";
    form.style.borderRadius = "8px";
    form.style.boxShadow = "0px 2px 10px rgba(0, 0, 0, 0.2)";

    form.innerHTML = `
    <h3 style="margin-bottom: 10px; text-align: center;">Pomoć</h3>
    <div style="display: flex; flex-direction: column; gap: 10px;">
    <p>Na ovoj stranici možete pronaći popis različitih prevoznika koji nude širok raspon linija. Da biste saznali više o određenom prevozniku, jednostavno kliknite na dugme "Detaljnije" pored njegovog imena.</p>
    <p>Klikom na "Detaljnije", otvorit će Vam se novi prozor koji sadrži sve relevantne informacije o tom prevozniku. Naći ćete kontakt podatke, uključujući telefon i e-mail adresu kako biste mogli stupiti u direktan kontakt s njima. Također, pronaći ćete cjelovit popis linija koje prevoznik nudi.</p>
    <p>Ova stranica je osmišljena kako bismo Vam olakšali planiranje putovanja i omogućili Vam da brzo pronađete sve potrebne informacije o različitim prevoznicima na jednom mjestu.</p>

    </div>
    <div style="display: flex; justify-content: center; align-items: center;">
        <button id="closeBtn" style="margin-top: 10px; padding: 10px; background-color: #0056b3; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Zatvori</button>
    </div>
  `;

    document.body.appendChild(form);

    const closeButton = document.getElementById("closeBtn");
    if (closeButton) {
      closeButton.addEventListener("click", (event) => {
        event.preventDefault();
        form.remove();
      });
    }
  }

}
