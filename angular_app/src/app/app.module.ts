import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule} from "@angular/forms"
import { AppComponent } from './app.component';
import { HttpClientModule} from "@angular/common/http";
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { HomeComponent } from './home/home.component';
import {AutorizacijaLoginProvjera} from "./_guards/autorizacija-login-provjera.service";
import { NotFoundComponent } from './not-found/not-found.component';
import { ChartsModule } from 'ng2-charts';
import { PostavkeProfilaComponent } from './postavke-profila/postavke-profila.component';
import {linijaDetaljiComponent} from "./linijaDetalji/linijaDetalji.component";
import {linijaPresjedanjeDetaljiComponent} from "./linijaPresjedanjeDetalji/linijaPresjedanjeDetalji.component";
import {PretragaComponent} from "./pretraga/pretraga.component";
import {UpravljanjeComponent} from "./upravljanje/upravljanje.component";

@NgModule({
  declarations: [
    AppComponent,
    linijaDetaljiComponent,
    linijaPresjedanjeDetaljiComponent,
    PretragaComponent,
    LoginComponent,
    RegistracijaComponent,
    HomeComponent,
    NotFoundComponent,
    PostavkeProfilaComponent,
    UpravljanjeComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path: 'pretraga', component: PretragaComponent},
      {path: 'detalji/:id', component: linijaDetaljiComponent},
      {path: 'detaljiPresjedanje/:id1/:id2', component: linijaPresjedanjeDetaljiComponent},
      {path: 'login', component: LoginComponent},
      {path: 'registracija', component: RegistracijaComponent},
      {path: 'home', component: HomeComponent, canActivate: [AutorizacijaLoginProvjera]},
      {path: 'postavke-profila', component: PostavkeProfilaComponent, canActivate: [AutorizacijaLoginProvjera]},
      {path: 'upravljanje', component: UpravljanjeComponent, canActivate:[AutorizacijaLoginProvjera]},
      {path: '**', component: NotFoundComponent, canActivate: [AutorizacijaLoginProvjera]},
    ]),
    FormsModule,
    HttpClientModule,
    ChartsModule,
  ],
  providers: [
    AutorizacijaLoginProvjera,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
