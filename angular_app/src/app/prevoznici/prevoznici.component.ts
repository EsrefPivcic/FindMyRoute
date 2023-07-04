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
}
