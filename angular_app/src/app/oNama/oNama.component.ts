import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-oNama',
  templateUrl: 'oNama.component.html',
  styleUrls: ['oNama.component.css']
})
export class ONamaComponent implements OnInit {
  constructor(private httpKlijent: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
  }
}
