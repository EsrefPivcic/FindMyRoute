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
}

