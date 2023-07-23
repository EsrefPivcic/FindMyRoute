import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MojConfig} from "../moj-config";
import {Router} from "@angular/router";
import {LoginInformacije} from "../_helpers/login-informacije";
import {AutentifikacijaHelper} from "../_helpers/autentifikacija-helper";

@Component({
  selector: 'app-detaljiKupovine',
  templateUrl: './detaljiKupovine.component.html',
  styleUrls: ['./detaljiKupovine.component.css']
})
export class DetaljiKupovineComponent implements OnInit {
  id : number;
  kupovina : any;
  constructor(private httpKlijent: HttpClient, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    //preuzima ID linije iz URL query parametra
    this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
    });
    fetch(MojConfig.adresa_servera+ "/Kupovina/Get/id?id="+this.id)
      .then(
        r=> {
          if (r.status != 200) {
            if (r.status == 400) {
              alert("Nepoznata linija!");
            }
            else {
              alert("greska" + r.status);
            }
            return;
          }
          r.json().then(x=>{
            this.kupovina = x;
          });
        }
      )
      .catch(
        err=>{
          alert("greska" + err);
        }
      )
  }

  formatirajDatum(datum: string): string {
    const skraceniDatum = datum.substring(0, 10);
    const date = new Date(skraceniDatum);
    const formatiraniDatum = date.toLocaleDateString('en-GB');
    return formatiraniDatum;
  }

  PrikaziHelp(): void {
    // Create a form element dynamically
    const form = document.createElement("form");

    // Add form styling, attributes, and content
    form.style.position = "fixed";
    form.style.top = "50%";
    form.style.left = "50%";
    form.style.transform = "translate(-50%, -50%)";
    form.style.backgroundColor = "#f8f9fa";
    form.style.padding = "20px";
    form.style.borderRadius = "8px";
    form.style.boxShadow = "0px 2px 10px rgba(0, 0, 0, 0.2)";

    // Add form content
    form.innerHTML = `
    <h3 style="margin-bottom: 10px; text-align: center;">Pomoć</h3>
    <div style="display: flex; flex-direction: column; gap: 10px;">
<p>Ovdje možete pregledati sve informacije o Vašem putovanju i kupovini karata. Prikazani su sljedeći detalji:</p>
<p>Polazište: Ovdje je navedeno mjesto polaska Vaše vožnje.<br>
Destinacija: Prikazuje odredište do kojeg ste putovali.<br>
Prevoznik: Ovdje je naziv prijevoznika koji je obavljao Vašu vožnju.<br>
Datum kupovine: Datum kada ste izvršili kupovinu karata.<br>
Datum vožnje: Datum na kojem ste planirali obaviti Vaše putovanje.<br>
Broj karata: Ukupan broj karata koje ste kupili za Vašu vožnju.<br>
Cijena karte: Cijena pojedinačne karte.<br>
Ukupna cijena: Ukupan iznos koji ste platili za sve kupljene karte.<br>
Način plaćanja: Ovdje je naveden način plaćanja koji ste koristili za izvršenje kupovine karata.</p>
    </div>
    <div style="display: flex; justify-content: center; align-items: center;">
        <button id="closeBtn" style="margin-top: 10px; padding: 10px; background-color: #007bff; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Zatvori</button>
    </div>
  `;

    // Append the form to the body element
    document.body.appendChild(form);

    // Add click event listener to the "Zatvori" button
    const closeButton = document.getElementById("closeBtn");
    if (closeButton) {
      closeButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent form submission
        form.remove(); // Remove the form from the DOM
      });
    }
  }

}

