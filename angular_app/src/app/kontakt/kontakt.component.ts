import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-kontakt',
  templateUrl: 'kontakt.component.html',
  styleUrls: ['kontakt.component.css']
})
export class KontaktComponent implements OnInit {
  constructor(private httpKlijent: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
  }
}
