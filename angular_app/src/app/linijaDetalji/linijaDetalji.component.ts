import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MojConfig} from "../moj-config";
import {Router} from "@angular/router";

@Component({
  selector: 'app-linijaDetalji',
  templateUrl: './linijaDetalji.component.html',
  styleUrls: ['./linijaDetalji.component.css']
})
export class linijaDetaljiComponent implements OnInit {

  title: string = 'FindMyRoute - Detalji linije';
  id : number;
  linijaPodaci : any;
  constructor(private httpKlijent: HttpClient, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    //preuzima ID linije iz URL query parametra
    this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
    });
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

