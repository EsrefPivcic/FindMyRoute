import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MojConfig} from "../moj-config";
import {Router} from "@angular/router";
import {LoginInformacije} from "../_helpers/login-informacije";
import {AutentifikacijaHelper} from "../_helpers/autentifikacija-helper";

@Component({
  selector: 'app-linijaDetalji',
  templateUrl: './linijaDetalji.component.html',
  styleUrls: ['./linijaDetalji.component.css']
})
export class linijaDetaljiComponent implements OnInit {
  id : number;
  linijaPodaci : any;
  prevoznikLogo: string;
  constructor(private httpKlijent: HttpClient, private route: ActivatedRoute, private router: Router) {
  }

  loginInfo():LoginInformacije {
    return AutentifikacijaHelper.getLoginInfo();
  }

  btnKupovina(): void {
    this.router.navigate(['/kupovina', this.linijaPodaci.id]);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
    });
    this.GetLinija();
  }

  Prevoznik(): void {
    this.router.navigate(['/prevoznik', this.linijaPodaci.prevoznik.id]);
  }

  GetLinija(): void {
    fetch(MojConfig.adresa_servera+ "/Linija/Get/id?id="+this.id)
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
            this.linijaPodaci = x;
            const uniqueParam = new Date().getTime(); // Generate a unique timestamp
            this.prevoznikLogo = `${MojConfig.adresa_servera}/Prevoznik/GetSlikaDB/${this.linijaPodaci.prevoznik.id}?v=${uniqueParam}`;
          });
        }
      )
      .catch(
        err=>{
          alert("greska" + err);
        }
      )
  }
}

